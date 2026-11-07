#!/usr/bin/env node
// Opens web/index.html?selftest in headless Chrome (real time, over the DevTools protocol)
// and prints the report: every task solution must pass its checks or expected output, the
// start code of HTML tasks must not pass, and runnable examples must not throw.
// Needs Chromium or Chrome and internet (React, Bootstrap, picsum, jsonplaceholder).
// Build the full page first: node web/build.js --no-lock (the demo build has only the free lessons).
// Usage: node web/selftest.js [lesson numbers, e.g. 1,2,3]
const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const browser = ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"].find((b) => spawnSync("which", [b]).status === 0);
if (!browser) { console.error("Chromium/Chrome not found"); process.exit(2); }
const only = process.argv[2] ? "=" + process.argv[2] : "";
const url = "file://" + path.join(__dirname, "index.html") + "?selftest" + only;
const port = 9300 + Math.floor(Math.random() * 600);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "selftest-"));
const chrome = spawn(browser, ["--headless=new", "--no-sandbox", "--disable-gpu", "--remote-debugging-port=" + port,
  "--user-data-dir=" + profile, "--window-size=1280,900", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let page = null;
  for (let i = 0; i < 50 && !page; i++) {
    await sleep(200);
    try { page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch (e) {}
  }
  if (!page) throw new Error("Chrome did not start");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const waiting = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } };
  const send = (method, params) => new Promise((r) => { const n = ++id; waiting.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  await send("Page.navigate", { url });
  const started = Date.now();
  while (Date.now() - started < 30 * 60 * 1000) {
    await sleep(1500);
    const r = await send("Runtime.evaluate", { expression: "document.getElementById('selftest') && document.getElementById('selftest').textContent", returnByValue: true });
    const text = r.result && r.result.result && r.result.result.value;
    if (text) return text;
  }
  throw new Error("selftest did not finish in 30 minutes");
}
main().then((text) => {
  console.log(text);
  process.exitCode = text.startsWith("SELFTEST OK") ? 0 : 1;
}, (e) => { console.error(e.message); process.exitCode = 2; }).finally(() => {
  chrome.kill();
  setTimeout(() => fs.rmSync(profile, { recursive: true, force: true }), 500);
});
