// One device at a time: each new login replaces the stored session, so the previous
// device is signed out on its next check. Needs no settings. The page also works
// without this function, but then the one-device rule is off.
import { getStore } from "@netlify/blobs";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

const PROOF_HASH = "__PROOF_HASH__"; // Filled in by scripts/build-site.js
const SESSION = "current";
const sha = (text) => createHash("sha256").update(String(text)).digest();
const sameText = (first, second) => timingSafeEqual(sha(first), sha(second));
const reply = (status, data) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export function createHandler(sessionStore, proofHash = PROOF_HASH) {
  return async (request) => {
    if (request.method !== "POST") return reply(405, { error: "method" });
    const body = await request.json().catch(() => ({}));
    const store = sessionStore();

    if (body.action === "login") {
      if (!sameText(sha(body.proof || "").toString("hex"), proofHash)) {
        await new Promise((resolve) => setTimeout(resolve, 900));
        return reply(401, { error: "wrong" });
      }
      const token = randomUUID();
      await store.setJSON(SESSION, { token, proofHash, at: Date.now() });
      return reply(200, { token });
    }

    const current = await store.get(SESSION, { type: "json" });
    const valid = !!current && typeof body.token === "string" && sameText(current.token, body.token) && current.proofHash === proofHash;
    if (body.action === "logout") {
      if (valid) await store.delete(SESSION);
      return reply(200, {});
    }
    if (body.action === "ping") return valid ? reply(200, {}) : reply(401, { error: "replaced" });
    return reply(400, { error: "action" });
  };
}

export default createHandler(() => getStore({ name: "course-sessions", consistency: "strong" }));

export const config = { path: "/api/session" };
