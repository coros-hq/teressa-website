// Vercel Node function: POST /api/waitlist  { email, website }
// Adds the email to Buttondown using the server-only BUTTONDOWN_API_KEY env var.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const email = String(body.email ?? "").trim().toLowerCase();

  if (body.website) return res.status(200).json({ ok: true }); // honeypot: bot, send nothing
  if (email.length > 254 || !EMAIL.test(email)) return res.status(400).json({ ok: false, error: "invalid" });

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    console.error("BUTTONDOWN_API_KEY is not set");
    return res.status(500).json({ ok: false, error: "server" });
  }

  // Forward the visitor's IP so Buttondown's firewall judges them, not our Vercel server.
  const ip = String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim();

  try {
    const r = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: email, ...(ip && { ip_address: ip }) }),
    });
    if (r.ok) return res.status(200).json({ ok: true });
    const data = await r.json().catch(() => ({}));
    if (data?.code === "email_already_exists") return res.status(200).json({ ok: true });
    console.error("Buttondown rejected signup", r.status, JSON.stringify(data));
    if (data?.code === "subscriber_blocked") return res.status(403).json({ ok: false, error: "blocked" });
    if (data?.code === "email_invalid") return res.status(400).json({ ok: false, error: "invalid" });
    return res.status(502).json({ ok: false, error: "server" });
  } catch (err) {
    console.error("Buttondown request failed", err);
    return res.status(502).json({ ok: false, error: "server" });
  }
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
