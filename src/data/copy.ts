// All page copy lives here. Edit text in this file; components only lay it out.
export const copy = {
  brand: "Teressa",
  nav: {
    links: [
      { label: "How it works", href: "#how" },
      { label: "Features", href: "#features" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Join the waitlist",
  },
  hero: {
    kicker: "Design, publish, get feedback",
    title: "Better UI components, built together.",
    sub: "Design, publish and get feedback on UI components, or build one with a friend in a live pair session. Copy the code or install it with one command.",
    primary: "Join the waitlist",
    secondary: "See how it works",
    mockCaption: "An illustration of the editor. Teressa hasn't launched yet.",
  },
  promise: {
    eyebrow: "The problem",
    title: "Good components are hard to find. Honest feedback is harder.",
    body: [
      "Components that are accessible, well built and true to your theme are rare. Many look fine in one mode, break in the other, and skip the small details.",
      "And when you make one yourself, real feedback is just as hard to come by. Teressa is a place to publish components that pass a quality bar and hear what people think: the focus ring, the empty state, the way it behaves in dark mode, how it works from a keyboard.",
    ],
    chips: ["Focus states", "Empty states", "Dark mode", "Keyboard use"],
  },
  how: {
    eyebrow: "How it works",
    title: "Build it. Publish it. Hear what people think.",
    steps: [
      { n: "01", title: "Build", body: "Open the editor and write your component against your themes. The preview updates as you type, and drafts save as you go." },
      { n: "02", title: "Publish", body: "Pass the quality checklist and publish under MIT. Anyone can copy the code or install it with one command." },
      { n: "03", title: "Get feedback", body: "Readers comment on specific lines or answer guided questions on accessibility, API design and polish. You mark what you've addressed." },
    ],
    pair: "Prefer company? Invite one person into a live pair session and build it together.",
  },
  features: {
    eyebrow: "Features",
    title: "Everything you need to make one component well",
    pair: {
      eyebrow: "Live pair sessions",
      title: "Build a component with someone, in the same editor.",
      body: "Invite one person to a draft. You both edit the same file with your own cursors, see the same live preview, and talk in a side panel. When it's ready, publish it with both of you credited as co-authors.",
      points: [
        { t: "One invite", d: "Pairs are two people. Send a link to a draft and they're in." },
        { t: "One preview", d: "You both see the component render as either of you types." },
        { t: "Shared credit", d: "Publish with both names on it. Co-authors are listed on the page." },
      ],
      chat: [
        { who: "Ana", msg: "Focus ring looks off on the dark theme." },
        { who: "Sam", msg: "Switching it to the ring token now." },
        { who: "Ana", msg: "Nice. Ready to run the checklist?" },
      ],
    },
    rows: [
      {
        id: "editor",
        eyebrow: "Solo editor",
        title: "A code editor with the preview right beside it.",
        body: "Write in TypeScript and watch the component render against your themes. Flip between light and dark whenever you like. Drafts autosave, and every version is kept so you can go back.",
        bullets: ["Live preview against your themes", "Light and dark toggle", "Autosaved drafts with version history"],
      },
      {
        id: "publish",
        eyebrow: "Publishing",
        title: "A checklist before anything goes live.",
        body: "Publishing isn't a button press. Your component has to clear a short list of checks first, so what people install is something they can rely on. MIT is the default license.",
        bullets: ["TypeScript compiles", "Accessibility check passes", "Theme tokens, not hardcoded colors", "Works in light and dark mode"],
      },
      {
        id: "browse",
        eyebrow: "Browse and use",
        title: "Find something, try it, take it.",
        body: "Search the gallery, preview any component with a theme switcher, and copy the code in one click. Or install it with one command. Want to change it? Fork it. The original author stays credited.",
        bullets: ["Searchable gallery", "Live preview with theme switcher", "One-click copy and registry install link", "Dependency list on every page", "Fork and remix with attribution"],
      },
      {
        id: "feedback",
        eyebrow: "Feedback",
        title: "Comments that point at the actual code.",
        body: "Readers can pin a comment to a line, or answer a structured question about accessibility, API design or visual polish. Authors mark feedback as addressed, so everyone can see what changed.",
        bullets: ["Structured questions", "Inline comments pinned to lines", "Mark feedback as addressed"],
      },
    ],
  },
  quality: {
    eyebrow: "Quality standards",
    title: "A quality bar that keeps rising.",
    lead: "Every published component clears the same checks. Feedback then keeps improving it after it ships.",
    pillars: [
      { t: "Accessible", d: "Each component passes an accessibility check before it can be published." },
      { t: "Theme-aware", d: "Theme tokens instead of hardcoded colors, and it has to work in both light and dark mode." },
      { t: "Always improving", d: "Readers pin comments to lines and answer structured questions. Authors mark feedback as addressed, and version history shows what changed." },
    ],
  },
  dev: {
    eyebrow: "For developers",
    title: "Copy it, or install it.",
    body: "Install with one command and the files land in your project, dependencies included. Or copy the code and paste it in.",
    bullets: ["MIT licensed by default", "Uses your theme tokens, so it matches your app", "Dependencies listed before you install"],
    install: "npx shadcn add https://teressa.example/r/notification-card.json",
    installNote: "Placeholder URL. The real address will be announced at launch.",
    usageFile: "app/page.tsx",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered.",
    items: [
      { q: "What license are components published under?", a: "MIT by default. That means you can use them in personal and commercial projects, keep the copyright notice, and there's no warranty. Each component page shows its license." },
      { q: "How much does it cost?", a: "Pricing isn't set yet. Join the waitlist and we'll email you the details when Teressa opens." },
      { q: "Who can publish?", a: "Anyone with an account who passes the quality checklist." },
      { q: "How do pair sessions work?", a: "Invite one person to a draft with a link. You both edit the same file with your own cursors, see the same live preview and talk in a side panel. When it's ready, publish it with both of you credited as co-authors." },
    ],
  },
  cta: {
    title: "Be there when we open.",
    body: "Join the waitlist and we'll send one email when Teressa is ready. Nothing else.",
    label: "Email address",
    placeholder: "you@example.com",
    button: "Join the waitlist",
    errorEmpty: "Enter your email address.",
    errorInvalid: "That doesn't look like an email address. Check it and try again.",
    errorBlocked: "We couldn't add that address. Try a different email.",
    errorFailed: "Something went wrong and your email wasn't sent. Try again in a moment.",
    success: "You're on the list. We'll email you once when Teressa opens.",
  },
  footer: {
    tag: "Design, publish and improve UI components.",
    links: [
      { label: "Guidelines", href: "#" },
      { label: "License", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
};
