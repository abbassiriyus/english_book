#!/usr/bin/env node
// Builds python/index.html from src/engine.html, src/parse.js and lessons/*.txt.
// It also checks every lesson: the text format, and with python3 installed it runs every
// task solution and every example that shows an output, and compares the results.
// The page is then protected the same way as the English course: Ctrl+U shows only a short
// loader, the real page is scrambled inside it, and right click, F12, Ctrl+U, Ctrl+S and the
// DevTools shortcuts are blocked. This stops casual copying, not a determined developer.
// Sales demo: only the DEMO lessons are readable, the others are encrypted (scripts/course-lock.js)
// and open when the login and password from the root .course-login are typed (one login for all courses).
// Output: python/index.html and python/dist/ (the folder to deploy: index.html, _headers, session function).
// Usage: node python/build.js [--no-run] [--plain] [--no-lock]
//   --plain writes a readable page for debugging, --no-lock puts every lesson in the page openly
//   (never deploy either of them).
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { parseLesson } = require("./src/parse.js");
const courseLock = require("../scripts/course-lock.js");

// Lessons 1-3 and one stronger lesson (26, OOP) are free so buyers can try the course.
const DEMO = [1, 2, 3, 26];

const dir = __dirname;
const noRun = process.argv.includes("--no-run");
const plain = process.argv.includes("--plain");
const noLock = process.argv.includes("--no-lock");
const files = fs.readdirSync(path.join(dir, "lessons")).filter((f) => f.endsWith(".txt")).sort();
const sources = files.map((f) => ({ file: f, text: fs.readFileSync(path.join(dir, "lessons", f), "utf8") }));

// Same input() behaviour as in the browser: the prompt and the typed value are echoed.
const PRELUDE = `
import builtins, sys
def __uz_input(prompt=""):
    sys.stdout.write(str(prompt))
    line = sys.stdin.readline()
    if not line:
        raise EOFError("no input")
    line = line.rstrip("\\n")
    print(line)
    return line
builtins.input = __uz_input
__src = open(sys.argv[1], encoding="utf-8").read()
exec(compile(__src, "<kod>", "exec"), {"__name__": "__main__"})
`;
const work = fs.mkdtempSync(path.join(os.tmpdir(), "pybook-"));
const norm = (s) => (s || "").replace(/\r/g, "").split("\n").map((x) => x.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "").replace(/^\n+/, "");
let hasPython = !noRun && spawnSync("python3", ["--version"]).status === 0;
function runPy(code, stdin) {
  const file = path.join(work, "main.py");
  fs.writeFileSync(file, code);
  const r = spawnSync("python3", ["-I", "-c", PRELUDE, file], { input: stdin || "", cwd: work, encoding: "utf8", timeout: 10000, env: { ...process.env, PYTHONHASHSEED: "0" } });
  return { out: (r.stdout || "") + (r.status !== 0 ? r.stderr : ""), ok: r.status === 0 };
}
function guessStdin(src) {
  const n = (src.match(/\binput\s*\(/g) || []).length;
  if (!n) return "";
  const m = src.match(/#\s*kiritish:\s*(.+)/);
  if (m) return m[1].split(/\s*;\s*/).join("\n");
  return Array.from({ length: n }, (_, i) => String([5, 3, 7, 2, 9][i % 5])).join("\n");
}


// Records ```anim blocks step by step: the next line to run, the variables and the output so far.
const TRACER = `
import sys, io, builtins, json, types
src = open(sys.argv[1], encoding="utf-8").read()
feed = sys.argv[2].split("\\n") if sys.argv[2] else []
out = io.StringIO()
frames = []
def inp(prompt=""):
    out.write(str(prompt))
    v = feed.pop(0) if feed else ""
    out.write(v + "\\n")
    return v
def show(d):
    r = {}
    for k, v in d.items():
        if k.startswith("_") or isinstance(v, types.ModuleType) or k in ("print", "input"):
            continue
        if isinstance(v, type) or (callable(v) and not isinstance(v, types.FunctionType)):
            continue
        t = "function" if isinstance(v, types.FunctionType) else type(v).__name__
        try:
            s = repr(v)
        except Exception:
            s = "<" + type(v).__name__ + " obyekti>"
        r[k] = [s if len(s) <= 60 else s[:57] + "...", t]
    return r
g = {"__name__": "__main__", "print": lambda *a, **k: builtins.print(*a, **{**k, "file": out}), "input": inp}
def tracer(frame, event, arg):
    if frame.f_code.co_filename != "<anim>":
        return None
    if event == "line" and len(frames) < 150:
        fn = frame.f_code.co_name
        frames.append({"l": frame.f_lineno, "g": show(frame.f_globals), "fn": None if fn == "<module>" else fn,
                       "v": None if fn == "<module>" else show(frame.f_locals), "o": out.getvalue()})
    return tracer
err = None
sys.settrace(tracer)
try:
    exec(compile(src, "<anim>", "exec"), g)
except Exception as e:
    err = type(e).__name__ + ": " + str(e)
sys.settrace(None)
frames.append({"l": 0, "g": show(g), "fn": None, "v": None, "o": out.getvalue(), "e": err})
print(json.dumps(frames, ensure_ascii=False))
`;
const animKey = (src) => { let h = 5381; for (let i = 0; i < src.length; i++) h = ((h * 33) ^ src.charCodeAt(i)) >>> 0; return h.toString(16); };
const ANIM = {};
const ANIM_OF = {}; // lesson number -> its animation keys, so locked lessons' frames are encrypted too
function traceAnim(code) {
  const file = path.join(work, "anim.py");
  fs.writeFileSync(file, code);
  const r = spawnSync("python3", ["-I", "-c", TRACER, file, guessStdin(code)], { cwd: work, encoding: "utf8", timeout: 10000, env: { ...process.env, PYTHONHASHSEED: "0" } });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
}

const problems = [];
const lessons = [];
let checked = 0;
sources.forEach(({ file, text }) => {
  let lesson;
  try { lesson = parseLesson(text); } catch (e) { problems.push(file + ": " + e.message); return; }
  lessons.push(lesson);
  const where = "lesson " + lesson.n;
  lesson.tests.forEach((t, i) => { if (t.length < 5) problems.push(where + ": test level " + (i + 1) + " has " + t.length + " questions (need 5+)"); });
  if (lesson.game.length < 6) problems.push(where + ": @game has " + lesson.game.length + " questions (need 6+)");
  [...lesson.tests.flat(), ...lesson.game].forEach((q) => {
    if (new Set(q.o).size !== q.o.length) problems.push(where + ": repeated option in: " + q.q);
  });
  if (!hasPython) return;
  const allBlocks = [...lesson.explain, ...lesson.examples, ...lesson.mistakes, ...lesson.tasks.map((t) => t.d)].flat();
  allBlocks.filter((b) => b.k === "anim").forEach((b) => {
    try {
      const frames = traceAnim(b.t);
      if (frames[frames.length - 1].e) problems.push(where + ": anim block raises " + frames[frames.length - 1].e + "\n" + b.t);
      if (frames.length >= 150) problems.push(where + ": anim block has too many steps (keep it under 150)\n" + b.t);
      ANIM[animKey(b.t)] = frames;
      (ANIM_OF[lesson.n] = ANIM_OF[lesson.n] || []).push(animKey(b.t));
    } catch (e) { problems.push(where + ": anim trace failed: " + e.message); }
  });
  lesson.tasks.forEach((t) => {
    const r = runPy(t.solution, t.input);
    checked++;
    if (!r.ok) problems.push(where + ` task "${t.t}": solution fails:\n${r.out}`);
    else if (t.expect != null && norm(r.out) !== norm(t.expect)) problems.push(where + ` task "${t.t}": expected\n${t.expect}\n--- got\n${r.out}`);
  });
  [...lesson.explain, ...lesson.examples].forEach((blocks) => {
    blocks.forEach((b, i) => {
      if (b.k !== "out") return;
      const code = blocks.slice(0, i).reverse().find((x) => x.k === "py");
      if (!code) return;
      const r = runPy(code.t, guessStdin(code.t));
      checked++;
      if (norm(r.out) !== norm(b.t)) problems.push(where + ` example output differs:\n${code.t}\n--- shown\n${b.t}\n--- real\n${r.out}`);
    });
  });
});
const numbers = lessons.map((l) => l.n).sort((a, b) => a - b);
numbers.forEach((n, i) => { if (n !== i + 1) problems.push("lesson numbers are not 1..N in order near " + n); });

if (problems.length) {
  console.error(problems.join("\n\n"));
  console.error(`\n${problems.length} problem(s).`);
  process.exitCode = 1;
}

let page = fs.readFileSync(path.join(dir, "src", "engine.html"), "utf8");
fs.rmSync(work, { recursive: true, force: true });
const numberOf = (text) => +(text.match(/^@lesson\s+(\d+)/) || [, 0])[1];
const isFree = (text) => noLock || DEMO.includes(numberOf(text));
const free = sources.filter((x) => isFree(x.text)), paid = sources.filter((x) => !isFree(x.text));
const publicAnim = {}, paidAnim = {};
Object.keys(ANIM_OF).forEach((n) => ANIM_OF[n].forEach((k) => { ((noLock || DEMO.includes(+n)) ? publicAnim : paidAnim)[k] = ANIM[k]; }));
let lockInfo = null;
if (!noLock) {
  const phone = (page.match(/<a href="tel:[^"]*">([^<]+)<\/a>/) || [, ""])[1];
  lockInfo = courseLock.makeLock(path.join(dir, "..", ".course-login"), "python", { src: paid.map((x) => x.text), anim: paidAnim },
    { prefix: "py_", phone, stubs: paid.map((x) => x.text.split("\n")[0]) });
}
const blocks = (lockInfo ? courseLock.lockScript(lockInfo.lock) + "\n" : "") + free.map(({ file, text }) => {
  if (/<\/script/i.test(text)) throw new Error(file + " contains </script");
  return `<script type="text/plain" class="lesson-src">\n${text}\n</script>`;
}).join("\n");
page = page.replace("/*ANIM*/{}", () => JSON.stringify(publicAnim).replace(/<\//g, "<\\/"));
page = page.replace("/*LOCK*/", () => courseLock.clientCode());
page = page.replace("<!--LESSONS-->", () => blocks).replace("/*PARSE*/", () => fs.readFileSync(path.join(dir, "src", "parse.js"), "utf8"));
const GUARD = `<script>(function(){
  var inField=function(e){return e.target&&e.target.closest&&e.target.closest("input,textarea")};
  document.addEventListener("contextmenu",function(e){if(!inField(e))e.preventDefault()});
  document.addEventListener("dragstart",function(e){if(e.target.tagName==="IMG")e.preventDefault()});
  document.addEventListener("keydown",function(e){
    var mod=e.ctrlKey||e.metaKey,code=e.code;
    if(e.key==="F12"||(mod&&(code==="KeyU"||code==="KeyS"))||(mod&&(e.shiftKey||e.altKey)&&(code==="KeyI"||code==="KeyJ"||code==="KeyC"))){e.preventDefault();e.stopPropagation();}
  },true);
})();</script>`;
const SHIFT = 73;
function protect(html) {
  if (!html.includes("</head>")) throw new Error("src/engine.html has no </head>");
  const bytes = Buffer.from(html.replace("</head>", () => GUARD + "</head>"), "utf8");
  const scrambled = Buffer.from(bytes.map((b) => (b + SHIFT) & 255)).toString("base64");
  const title = (html.match(/<title>([^<]*)<\/title>/) || [, "Python"])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)">/) || [, ""])[1];
  return `<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${desc}"><title>${title}</title></head><body><noscript>JavaScript kerak.</noscript><script>
(function(s){var b=atob(s),n=b.length,a=new Uint8Array(n);for(var i=0;i<n;i++)a[i]=(b.charCodeAt(i)-${SHIFT}+256)&255;
var h=new TextDecoder().decode(a);document.open();document.write(h);document.close();})("${scrambled}");
</script></body></html>`;
}
const out = plain ? page : protect(page);
fs.writeFileSync(path.join(dir, "index.html"), out);
courseLock.writeDist(path.join(dir, "dist"), out, lockInfo && lockInfo.proofHash);
const count = (f) => lessons.reduce((s, l) => s + f(l), 0);
console.log(`python/index.html and python/dist/: ${(out.length / 1024).toFixed(0)} KB, ${plain ? "READABLE (--plain), do not deploy" : "protected"}, ${lessons.length} lessons, ` +
  `${count((l) => l.tests.flat().length)} test questions, ${count((l) => l.fill.length)} fill-ins, ${count((l) => l.tasks.length)} tasks, ` +
  `${count((l) => l.game.length)} extra game questions` + (hasPython ? `, ${checked} code checks run, ${Object.keys(ANIM).length} animations` : ", code not run"));
console.log(lockInfo ? `DEMO: free lessons ${free.map((x) => numberOf(x.text)).join(" ")}, ${paid.length} locked (login "${lockInfo.login}", password in .course-login)` : "NO LOCK (--no-lock): every lesson is open, do not deploy");
