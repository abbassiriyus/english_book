#!/usr/bin/env node
// Builds web/index.html (the Frontend course) from src/engine.html, src/parse.js, src/fmt.js
// and lessons/*.txt. It checks every lesson: the text format, and it runs with Node every
// JavaScript example that shows an output and every JS task solution, and compares the results.
// HTML/CSS/React tasks are checked in a browser with: node web/selftest.js
// The page is protected like the other courses: Ctrl+U shows only a short loader, the real page
// is scrambled inside it, and right click, F12, Ctrl+U, Ctrl+S and DevTools keys are blocked.
// This stops casual copying, not a determined developer.
// Sales demo: only the DEMO lessons are readable, the others are encrypted (scripts/course-lock.js)
// and open when the login and password from the root .course-login are typed (one login for all courses).
// Output: web/index.html and web/dist/ (the folder to deploy: index.html, _headers, session function).
// Usage: node web/build.js [--no-run] [--plain] [--no-lock]
//   --plain writes a readable page for debugging, --no-lock puts every lesson in the page openly
//   (needed for node web/selftest.js; never deploy either of them).
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { parseLesson } = require("./src/parse.js");
const courseLock = require("../scripts/course-lock.js");

// Lessons 1-3 and one stronger lesson (40, React useState) are free so buyers can try the course.
const DEMO = [1, 2, 3, 40];

const dir = __dirname;
const noRun = process.argv.includes("--no-run");
const plain = process.argv.includes("--plain");
const noLock = process.argv.includes("--no-lock");
const files = fs.readdirSync(path.join(dir, "lessons")).filter((f) => f.endsWith(".txt")).sort();
const sources = files.map((f) => ({ file: f, text: fs.readFileSync(path.join(dir, "lessons", f), "utf8") }));
const FMT = fs.readFileSync(path.join(dir, "src", "fmt.js"), "utf8");

// Same console, prompt() and alert() behaviour as the page's JS worker.
const RUNNER = FMT + `
const lines = process.argv[3] ? process.argv[3].split("\\n") : [];
const out = [];
["log", "info", "warn", "error", "debug", "table"].forEach((k) => { console[k] = function () { out.push(__fmtArgs(arguments)); }; });
globalThis.prompt = () => (lines.length ? lines.shift() : null);
globalThis.alert = (m) => out.push(String(m === undefined ? "" : m));
globalThis.confirm = () => { const v = lines.length ? lines.shift() : ""; return /^(ha|yes|true|1|ok)$/i.test(v.trim()); };
let err = null;
process.on("unhandledRejection", (e) => { err = err || e; });
process.on("uncaughtException", (e) => { err = err || e; });
process.on("exit", () => { process.stdout.write(JSON.stringify({ out: out.join("\\n"), err: err ? (err.name ? err.name + ": " + err.message : String(err)) : null })); });
const AF = (async () => {}).constructor;
(async () => { try { await new AF(require("fs").readFileSync(process.argv[2], "utf8"))(); } catch (e) { err = err || e; } })();
`;
const work = fs.mkdtempSync(path.join(os.tmpdir(), "webbook-"));
fs.writeFileSync(path.join(work, "runner.js"), RUNNER);
const norm = (s) => (s || "").replace(/\r/g, "").replace(/[\u00a0\u202f]/g, " ").split("\n").map((x) => x.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "").replace(/^\n+/, "");
const BROWSER_ONLY = /\b(document|window|fetch|axios|localStorage|sessionStorage|navigator|location|React|ReactDOM|addEventListener)\b|<[A-Za-z][\w.]*[\s/>]|from\s*["']vitest["']/;
function runJs(code, stdin) {
  const file = path.join(work, "main.js");
  fs.writeFileSync(file, code);
  const r = spawnSync(process.execPath, [path.join(work, "runner.js"), file, stdin || ""], { cwd: work, encoding: "utf8", timeout: 10000 });
  try { return JSON.parse(r.stdout); } catch (e) { return { out: "", err: "runner failed: " + (r.stderr || r.error || "timeout") }; }
}
function guessStdin(src) {
  const n = (src.match(/\bprompt\s*\(/g) || []).length;
  if (!n) return "";
  const m = src.match(/\/\/\s*kiritish:\s*(.+)/);
  if (m) return m[1].split(/\s*;\s*/).join("\n");
  return Array.from({ length: n }, (_, i) => String([5, 3, 7, 2, 9][i % 5])).join("\n");
}

const problems = [];
const lessons = [];
let checked = 0, skipped = 0;
sources.forEach(({ file, text }) => {
  let lesson;
  try { lesson = parseLesson(text); } catch (e) { problems.push(file + ": " + e.message); return; }
  lessons.push(lesson);
  const where = "lesson " + lesson.n;
  lesson.tests.forEach((t, i) => { if (t.length < 5) problems.push(where + ": test level " + (i + 1) + " has " + t.length + " questions (need 5+)"); });
  if (lesson.game.length < 6) problems.push(where + ": @game has " + lesson.game.length + " questions (need 6+)");
  if (lesson.fill.length < 4) problems.push(where + ": @fill has " + lesson.fill.length + " items (need 4+)");
  if (lesson.tasks.length < 3) problems.push(where + ": @tasks has " + lesson.tasks.length + " tasks (need 3+)");
  [...lesson.tests.flat(), ...lesson.game].forEach((q) => {
    if (new Set(q.o).size !== q.o.length) problems.push(where + ": repeated option in: " + q.q);
  });
  lesson.tasks.forEach((t) => {
    if (t.expect == null && !t.check.length) return;
    if (t.expect != null && t.check.length) problems.push(where + ` task "${t.t}": has both expect and check`);
    if (t.start.trim() === t.solution.trim()) problems.push(where + ` task "${t.t}": start equals solution`);
  });
  if (noRun) return;
  lesson.tasks.forEach((t) => {
    if (t.expect == null) return;
    if (BROWSER_ONLY.test(t.solution) || /^\s*(--[^\n]*\n\s*)*(SELECT|INSERT|UPDATE|DELETE|CREATE|WITH|DROP|ALTER)\b/i.test(t.solution)) { skipped++; return; }
    const r = runJs(t.solution, t.input);
    checked++;
    if (r.err) problems.push(where + ` task "${t.t}": solution fails: ${r.err}\n${r.out}`);
    else if (norm(r.out) !== norm(t.expect)) problems.push(where + ` task "${t.t}": expected\n${t.expect}\n--- got\n${r.out}`);
  });
  [...lesson.explain, ...lesson.examples].forEach((blocks) => {
    blocks.forEach((b, i) => {
      if (b.k !== "out") return;
      const code = blocks.slice(0, i).reverse().find((x) => x.k === "js");
      if (!code) return;
      if (BROWSER_ONLY.test(code.t)) { skipped++; return; }
      const r = runJs(code.t, guessStdin(code.t));
      checked++;
      const real = r.out + (r.err ? (r.out ? "\n" : "") + "Uncaught " + r.err : "");
      if (norm(real) !== norm(b.t)) problems.push(where + ` example output differs:\n${code.t}\n--- shown\n${b.t}\n--- real\n${real}`);
    });
  });
});
fs.rmSync(work, { recursive: true, force: true });
const numbers = lessons.map((l) => l.n).sort((a, b) => a - b);
numbers.forEach((n, i) => { if (n !== i + 1) problems.push("lesson numbers are not 1..N in order near " + n); });

if (problems.length) {
  console.error(problems.join("\n\n"));
  console.error(`\n${problems.length} problem(s).`);
  process.exitCode = 1;
}

let page = fs.readFileSync(path.join(dir, "src", "engine.html"), "utf8");
// Lessons go in as one JSON string array: their HTML examples contain </script> and <!-- .
const numberOf = (text) => +(text.match(/^@lesson\s+(\d+)/) || [, 0])[1];
const isFree = (text) => noLock || DEMO.includes(numberOf(text));
const free = sources.filter((x) => isFree(x.text)), paid = sources.filter((x) => !isFree(x.text));
let lockInfo = null;
if (!noLock) {
  const phone = (page.match(/<a href="tel:[^"]*">([^<]+)<\/a>/) || [, ""])[1];
  lockInfo = courseLock.makeLock(path.join(dir, "..", ".course-login"), "frontend", { src: paid.map((x) => x.text) },
    { prefix: "web_", phone, stubs: paid.map((x) => x.text.split("\n")[0]) });
}
const blocks = (lockInfo ? courseLock.lockScript(lockInfo.lock) : "") +
  "<script>window.LESSON_SRC=" + JSON.stringify(free.map((x) => x.text)).replace(/</g, "\\u003c") + ";</script>";
page = page.replace("/*LOCK*/", () => courseLock.clientCode());
page = page.replace('const FMT_SRC=/*FMT*/"";', () => "const FMT_SRC=" + JSON.stringify(FMT).replace(/<\//g, "<\\/") + ";\n" + FMT);
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
  const title = (html.match(/<title>([^<]*)<\/title>/) || [, "Frontend"])[1];
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
console.log(`web/index.html and web/dist/: ${(out.length / 1024).toFixed(0)} KB, ${plain ? "READABLE (--plain), do not deploy" : "protected"}, ` +
  `${lessons.length} lessons, ${count((l) => l.tests.flat().length)} test questions, ${count((l) => l.fill.length)} fill-ins, ${count((l) => l.tasks.length)} tasks, ` +
  `${count((l) => l.game.length)} extra game questions` + (noRun ? ", code not run" : `, ${checked} JS checks run, ${skipped} browser-only skipped`));
console.log(lockInfo ? `DEMO: free lessons ${free.map((x) => numberOf(x.text)).join(" ")}, ${paid.length} locked (login "${lockInfo.login}", password in .course-login)` : "NO LOCK (--no-lock): every lesson is open, do not deploy");
