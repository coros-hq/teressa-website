import type { APIRoute } from "astro";

export const prerender = false;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export const POST: APIRoute = async ({ request }) => {
  let email = "", honeypot = "";
  try {
    const form = await request.formData();
    email = String(form.get("email") ?? "").trim().toLowerCase();
    honeypot = String(form.get("website") ?? "");
  } catch {
    return json({ ok: false, error: "bad-request" }, 400);
  }
  if (honeypot) return json({ ok: true }); // bot: pretend it worked, send nothing
  if (email.length > 254 || !EMAIL.test(email)) return json({ ok: false, error: "invalid" }, 400);

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    console.error("BUTTONDOWN_API_KEY is not set");
    return json({ ok: false, error: "server" }, 500);
  }

  try {
    const res = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: email }),
    });
    if (res.ok) return json({ ok: true });
    const body = await res.json().catch(() => ({}));
    // Already subscribed counts as success from the visitor's point of view.
    if (body?.code === "email_already_exists") return json({ ok: true });
    console.error("Buttondown rejected signup", res.status, JSON.stringify(body));
    return json({ ok: false, error: body?.code === "email_invalid" ? "invalid" : "server" }, res.status === 400 ? 400 : 502);
  } catch (err) {
    console.error("Buttondown request failed", err);
    return json({ ok: false, error: "server" }, 502);
  }
};
