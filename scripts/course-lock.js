// Demo lock shared by python/build.js and web/build.js (the English course has its own copy in
// scripts/build-site.js). The demo lessons stay readable; all other lessons are encrypted with
// AES-256-GCM. The key is PBKDF2(login:password) and is never written to the page, so the
// locked lessons open only when the login and password are typed correctly.
// The browser side is course-lock-client.js, inlined into the page at /*LOCK*/.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ITERATIONS = 250000;
const root = path.join(__dirname, "..");
const sha256 = (data) => crypto.createHash("sha256").update(data).digest();

// Reads login=, password= and salt= lines. A missing file is created with a random password.
// The courses share the root .course-login, so one login and password open all of them.
function readCredentials(file, defaultLogin) {
  if (!fs.existsSync(file)) {
    const letters = "abcdefghjkmnpqrstuvwxyz23456789";
    const password = Array.from(crypto.randomBytes(12), (b) => letters[b % letters.length]).join("");
    fs.writeFileSync(file, `login=${defaultLogin}\npassword=${password}\n`, { mode: 0o600 });
    console.log(`Created ${path.relative(root, file)} with a new login and password (keep it private).`);
  }
  const values = {};
  fs.readFileSync(file, "utf8").split(/\r?\n/).forEach((line) => {
    const at = line.indexOf("=");
    if (at > 0) values[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  });
  if (!values.login || !values.password) throw new Error(file + " needs login=... and password=... lines");
  if (!values.salt) {
    values.salt = crypto.randomBytes(16).toString("base64");
    fs.appendFileSync(file, `salt=${values.salt}\n`);
  }
  return values;
}

// payload: any JSON value, it comes back from the page's unlock step unchanged.
// extra: public fields for the page (stubs, prefix, phone...).
function makeLock(credentialsFile, defaultLogin, payload, extra) {
  const c = readCredentials(credentialsFile, defaultLogin);
  const key = crypto.pbkdf2Sync(`${c.login.toLowerCase()}:${c.password}`, Buffer.from(c.salt, "base64"), ITERATIONS, 32, "sha256");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final(), cipher.getAuthTag()]);
  const lock = { ...extra, salt: c.salt, iterations: ITERATIONS, iv: iv.toString("base64"), data: data.toString("base64") };
  // The session service stores only a hash of the proof the page sends (sha256 of the key).
  const proofHash = sha256(sha256(key).toString("hex")).toString("hex");
  return { lock, proofHash, login: c.login };
}

const lockScript = (lock) => "<script>window.COURSE_LOCK=" + JSON.stringify(lock).replace(/</g, "\\u003c") + ";</script>";
const clientCode = () => fs.readFileSync(path.join(__dirname, "course-lock-client.js"), "utf8");

// Writes the deploy folder: the page plus deploy/ (Netlify headers and the one-device session
// function with this course's proof hash). Without the function the page still works.
function writeDist(dist, page, proofHash) {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.cpSync(path.join(root, "deploy"), dist, { recursive: true });
  fs.writeFileSync(path.join(dist, "index.html"), page);
  const fn = path.join(dist, "netlify", "functions", "session.mjs");
  fs.writeFileSync(fn, fs.readFileSync(fn, "utf8").replace("__PROOF_HASH__", proofHash || "none"));
}

module.exports = { makeLock, lockScript, clientCode, writeDist };
