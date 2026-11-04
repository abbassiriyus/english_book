#!/usr/bin/env node
// Builds index.html and the dist/ folder for Netlify from src/course.html and deploy/.
// The first lessons stay readable as a public demo. All other lessons are encrypted with
// AES-GCM using a key derived from the login and password in .course-login.
// Nothing written to dist/ contains the password or the key.
// Round Up pages are Pearson's, so they are copied to dist/ only with WITH_ROUNDUP=1.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const credentialsFile = path.join(root, ".course-login");
const DEMO_LESSONS = [1, 2, 3, 32]; // 32 is Present Perfect 1, a stronger lesson to interest buyers
const ITERATIONS = 250000;
const SHIFT = 73;

const GUARD = `<script>(function(){
  var inField=function(e){return e.target&&e.target.closest&&e.target.closest("input,textarea")};
  document.addEventListener("contextmenu",function(e){if(!inField(e))e.preventDefault()});
  document.addEventListener("dragstart",function(e){if(e.target.tagName==="IMG")e.preventDefault()});
  document.addEventListener("keydown",function(e){
    var mod=e.ctrlKey||e.metaKey,code=e.code;
    if(e.key==="F12"||(mod&&(code==="KeyU"||code==="KeyS"))||(mod&&(e.shiftKey||e.altKey)&&(code==="KeyI"||code==="KeyJ"||code==="KeyC"))){e.preventDefault();e.stopPropagation();}
  },true);
})();</script>`;

function readCredentials() {
  const values = {};
  fs.readFileSync(credentialsFile, "utf8").split(/\r?\n/).forEach((line) => {
    const at = line.indexOf("=");
    if (at > 0) values[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  });
  if (!values.login || !values.password) throw new Error(".course-login needs login=... and password=... lines");
  if (!values.salt) {
    values.salt = crypto.randomBytes(16).toString("base64");
    fs.appendFileSync(credentialsFile, `salt=${values.salt}\n`);
  }
  return values;
}

const sha256 = (data) => crypto.createHash("sha256").update(data).digest();

function encrypt(text, key, salt) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(text, "utf8"), cipher.final(), cipher.getAuthTag()]);
  return { salt, iterations: ITERATIONS, iv: iv.toString("base64"), data: data.toString("base64") };
}

const lessonStub = (lesson) => ({
  n: lesson.n, type: lesson.type, icon: lesson.icon, title: lesson.title, loc_title: lesson.loc_title,
  locked: true, formula: [], ex: {}, dlg: [], tests: [], pics: [],
});
const safeJson = (value) => JSON.stringify(value).replace(/<\//g, "<\\/");

let source = fs.readFileSync(path.join(root, "src", "course.html"), "utf8");
const courseMatch = source.match(/^const ALL = (\{.*\});$/m);
const extraMatch = source.match(/^const BAAM_EXTRA=(\{[\s\S]*?\});$/m);
if (!courseMatch || !extraMatch || !source.includes("</head>")) throw new Error("src/course.html has an unexpected layout");
const course = JSON.parse(courseMatch[1]);
const extra = JSON.parse(extraMatch[1]);

const isDemo = (lesson) => DEMO_LESSONS.includes(lesson.n);
const hidden = { lessons: {}, extra: {} };
Object.keys(course).forEach((lang) => {
  hidden.lessons[lang] = course[lang].lessons.filter((lesson) => !isDemo(lesson));
  course[lang].lessons = course[lang].lessons.map((lesson) => (isDemo(lesson) ? lesson : lessonStub(lesson)));
});
const publicExtra = {};
Object.keys(extra).forEach((n) => { (DEMO_LESSONS.includes(Number(n)) ? publicExtra : hidden.extra)[n] = extra[n]; });

const credentials = readCredentials();
const key = crypto.pbkdf2Sync(`${credentials.login.toLowerCase()}:${credentials.password}`, Buffer.from(credentials.salt, "base64"), ITERATIONS, 32, "sha256");
const lock = encrypt(JSON.stringify(hidden), key, credentials.salt);
const proofHash = sha256(sha256(key).toString("hex")).toString("hex");
source = source
  .replace(courseMatch[0], () => `window.COURSE_LOCK=${JSON.stringify(lock)};\nconst ALL = ${safeJson(course)};`)
  .replace(extraMatch[0], () => `const BAAM_EXTRA=${safeJson(publicExtra)};`)
  .replace("</head>", () => GUARD + "</head>");

const page = Buffer.from(source, "utf8");
const scrambled = Buffer.from(page.map((byte) => (byte + SHIFT) & 255)).toString("base64");
const loader = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Ingliz tili kursi: o‘zbek va rus tilida darslar, testlar va o‘yinlar."><title>English Course UZ / RU</title></head><body><noscript>JavaScript is required.</noscript><script>
(function(s){var b=atob(s),n=b.length,a=new Uint8Array(n);for(var i=0;i<n;i++)a[i]=(b.charCodeAt(i)-${SHIFT}+256)&255;
var h=new TextDecoder().decode(a);document.open();document.write(h);document.close();})("${scrambled}");
</script></body></html>`;

fs.writeFileSync(path.join(root, "index.html"), loader);
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(path.join(root, "deploy"), dist, { recursive: true });
fs.writeFileSync(path.join(dist, "index.html"), loader);
const functionFile = path.join(dist, "netlify", "functions", "session.mjs");
fs.writeFileSync(functionFile, fs.readFileSync(functionFile, "utf8").replace("__PROOF_HASH__", proofHash));
const withRoundUp = process.env.WITH_ROUNDUP === "1" && fs.existsSync(path.join(root, "roundup"));
if (withRoundUp) fs.cpSync(path.join(root, "roundup"), path.join(dist, "roundup"), { recursive: true });
console.log(`index.html: ${(loader.length / 1048576).toFixed(2)} MB, demo lessons: ${DEMO_LESSONS.join(" ")}, Round Up pages in dist: ${withRoundUp ? "included" : "not included"}`);
