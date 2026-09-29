import { track } from "@vercel/analytics";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

// ---- theme toggle ----
const isDark = () => root.dataset.theme === "dark";
const themeLabel = document.getElementById("theme-label");
const syncLabel = () => themeLabel && (themeLabel.textContent = isDark() ? "Dark" : "Light");
syncLabel();
document.getElementById("theme-toggle")?.addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch {}
  syncLabel();
});

const send = (name: string, props?: Record<string, string | number>) => { try { track(name, props); } catch {} };

// ---- nav background on scroll ----
const nav = document.getElementById("nav");
const depths = new Set<number>();
let ticking = false;
// one rAF-throttled scroll handler; layout reads (scrollHeight) happen at most once per frame
const onScroll = () => {
  ticking = false;
  nav?.classList.toggle("scrolled", scrollY > 24);
  if (depths.size === 4) return;
  const pct = ((scrollY + innerHeight) / document.documentElement.scrollHeight) * 100;
  [25, 50, 75, 100].forEach((d) => { if (pct >= d - 1 && !depths.has(d)) { depths.add(d); send("scroll_depth", { percent: d }); } });
};
onScroll();
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

// ---- split text into masked words ----
let idx = 0;
const splitNode = (node: Node) => {
  [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      (n.textContent || "").split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(" ");
        const w = document.createElement("span");
        w.className = "w";
        const wi = document.createElement("span");
        wi.className = "wi";
        wi.style.setProperty("--i", String(idx++));
        wi.textContent = part;
        w.append(wi);
        frag.append(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1) splitNode(n);
  });
};
document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
  idx = 0;
  el.setAttribute("aria-label", el.textContent || "");
  splitNode(el);
});

// ---- self-assembling components: reveal data-step pieces in order, hold, repeat ----
const assemble = (box: HTMLElement) => {
  const pieces = [...box.querySelectorAll<HTMLElement>("[data-step]")];
  const max = Math.max(...pieces.map((p) => Number(p.dataset.step)));
  const gap = Number(box.dataset.gap || 650);
  const loop = box.dataset.loop !== "false";
  let step = 0;
  const run = () => {
    step++;
    pieces.forEach((p) => p.classList.toggle("on", Number(p.dataset.step) <= step));
    if (step < max) setTimeout(run, gap);
    else if (loop) setTimeout(() => { step = 0; pieces.forEach((p) => p.classList.remove("on")); setTimeout(run, 900); }, 4500);
  };
  run();
};

// ---- reveal on scroll ----
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      el.classList.add("in");
      if (el.hasAttribute("data-assemble") && !reduce) assemble(el);
      io.unobserve(el);
    }),
  { threshold: 0.25, rootMargin: "0px 0px -6% 0px" }
);
document.querySelectorAll("[data-split], [data-fade], [data-assemble]").forEach((el) => io.observe(el));
if (reduce) document.querySelectorAll("[data-step]").forEach((el) => el.classList.add("on"));

// ---- copy buttons ----
document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) =>
  btn.addEventListener("click", async () => {
    const text = document.querySelector(btn.dataset.copy!)?.textContent?.trim() || "";
    try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; } catch { btn.textContent = "Press ⌘C"; }
    setTimeout(() => (btn.textContent = "Copy"), 1800);
  })
);

// ---- analytics (custom events; pageviews come from <Analytics />) ----
document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href="#waitlist"]');
  if (a) send("cta_click", { location: a.closest("#nav") ? "nav" : "hero" });
});

// ---- waitlist forms (hero + footer; saved via /api/waitlist -> Buttondown API) ----
document.querySelectorAll<HTMLFormElement>("form[data-waitlist]").forEach((form) => {
  const input = form.querySelector<HTMLInputElement>('input[type="email"]')!;
  const submit = form.querySelector<HTMLButtonElement>("button")!;
  const labels = [...submit.querySelectorAll<HTMLElement>(".btn-l")];
  const idleLabels = labels.map((l) => l.textContent);
  const msg = form.parentElement!.querySelector<HTMLElement>("[data-waitlist-msg]")!;
  const t = form.dataset;
  const source = t.source!;
  const say = (ok: boolean, text: string) => { msg.className = ok ? "form-msg ok" : "form-msg err"; msg.textContent = text; };
  const busy = (on: boolean) => { submit.disabled = on; labels.forEach((l, i) => (l.textContent = on ? t.loading! : idleLabels[i])); };
  input.addEventListener("focus", () => send("waitlist_focus", { source }), { once: true });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    input.setAttribute("aria-invalid", String(!valid));
    if (!valid) { send("waitlist_submit", { source, result: "invalid" }); say(false, v ? t.errorInvalid! : t.errorEmpty!); return input.focus(); }
    // Honeypot: bots fill the hidden field; pretend it worked and send nothing.
    if ((form.elements.namedItem("website") as HTMLInputElement).value) return say(true, t.success!);
    busy(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v, website: (form.elements.namedItem("website") as HTMLInputElement).value }),
      });
      if (res.status === 400) { send("waitlist_submit", { source, result: "invalid" }); return say(false, t.errorInvalid!); }
      if (res.status === 403) { send("waitlist_submit", { source, result: "blocked" }); return say(false, t.errorBlocked!); }
      if (!res.ok) throw new Error(String(res.status));
      send("waitlist_submit", { source, result: "success" });
      say(true, t.success!);
      form.reset();
      form.hidden = true;
    } catch {
      send("waitlist_submit", { source, result: "error" });
      say(false, t.errorFailed!);
    } finally {
      busy(false);
    }
  });
});

// ---- pixel trail in the hero ----
const canvas = document.getElementById("pixel-trail") as HTMLCanvasElement | null;
const hero = document.getElementById("hero");
if (canvas && hero && !reduce) {
  const ctx = canvas.getContext("2d")!;
  const SIZE = 44;
  let cols = 0, rows = 0, cells = new Float32Array(0), colors = ["#E8480C", "#2F6FD6"], frame = 0, last = -1;
  const resize = () => {
    const r = hero.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(r.width / SIZE);
    rows = Math.ceil(r.height / SIZE);
    cells = new Float32Array(cols * rows);
  };
  resize();
  addEventListener("resize", resize);
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    const c = Math.floor((e.clientX - r.left) / SIZE);
    const rw = Math.floor((e.clientY - r.top) / SIZE);
    const i = rw * cols + c;
    if (i === last || c < 0 || rw < 0 || c >= cols || rw >= rows) return;
    last = i;
    cells[i] = 1;
  });
  let running = false;
  const loop = () => {
    if (frame++ % 20 === 0) {
      const cs = getComputedStyle(root);
      colors = [cs.getPropertyValue("--primary").trim(), cs.getPropertyValue("--secondary").trim()];
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (let i = 0; i < cells.length; i++) {
      const a = cells[i];
      if (a <= 0.01) continue;
      alive = true;
      ctx.globalAlpha = a * 0.5;
      ctx.fillStyle = colors[(i + Math.floor(i / cols)) % 2];
      ctx.fillRect((i % cols) * SIZE, Math.floor(i / cols) * SIZE, SIZE - 1, SIZE - 1);
      cells[i] = a * 0.94;
    }
    if (alive) requestAnimationFrame(loop);
    else running = false;
  };
  const start = () => { if (!running) { running = true; requestAnimationFrame(loop); } };
  hero.addEventListener("pointermove", start);
}
