// Page behaviour without libraries: burger, directions scene, departments tabs/accordion,
// production route (once on enter), bottom contact bar after the first screen.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktop = window.matchMedia("(min-width: 1024px)");

/* Burger menu (< 1240px) */
const burger = document.querySelector<HTMLButtonElement>("[data-burger]");
const nav = document.querySelector<HTMLElement>("[data-nav]");
if (burger && nav) {
  const set = (open: boolean) => {
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => set(burger.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if ((e.target as HTMLElement).closest("a[href^='#']")) set(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") { set(false); burger.focus(); }
  });
  window.matchMedia("(min-width: 1240px)").addEventListener("change", (m) => { if (m.matches) set(false); });
}

/* Directions: hover/focus shows the direction on the scene (effect 3, crossfade in CSS) */
const frames = document.querySelectorAll<HTMLElement>("[data-frame]");
const dirs = document.querySelectorAll<HTMLElement>("[data-dir]");
const show = (i: string) => {
  frames.forEach((f) => f.classList.toggle("is-active", f.dataset.frame === i));
  dirs.forEach((d) => d.classList.toggle("is-active", d.dataset.dir === i));
};
dirs.forEach((d) => {
  const i = d.dataset.dir ?? "0";
  d.addEventListener("mouseenter", () => show(i));
  d.addEventListener("focus", () => show(i));
});

/* Departments: tabs on desktop, accordion on phone */
const root = document.querySelector<HTMLElement>("[data-routes]");
if (root) {
  const tablist = root.querySelector<HTMLElement>("[data-tablist]");
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-tab]"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-panel]"));
  tablist?.removeAttribute("hidden");
  panels.forEach((p) => { p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", `tab-${p.id}`); });
  const select = (id: string, focus = false) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => p.classList.toggle("is-active", p.id === id));
  };
  const open = (id: string, state?: boolean) => {
    const p = panels.find((x) => x.id === id);
    const b = p?.querySelector<HTMLButtonElement>("[data-toggle]");
    if (!p || !b) return;
    const next = state ?? !p.classList.contains("is-open");
    p.classList.toggle("is-open", next);
    b.setAttribute("aria-expanded", String(next));
  };
  if (panels[0]) open(panels[0].id, true);
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t.dataset.tab ?? ""));
    t.addEventListener("keydown", (e) => {
      const k = e.key;
      let n = -1;
      if (k === "ArrowDown" || k === "ArrowRight") n = (i + 1) % tabs.length;
      if (k === "ArrowUp" || k === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      if (k === "Home") n = 0;
      if (k === "End") n = tabs.length - 1;
      if (n >= 0) { e.preventDefault(); select(tabs[n].dataset.tab ?? "", true); }
    });
  });
  panels.forEach((p) => p.querySelector("[data-toggle]")?.addEventListener("click", () => open(p.id)));
  const fromHash = () => {
    const id = location.hash.slice(1);
    if (!panels.some((p) => p.id === id)) return;
    select(id);
    open(id, true);
    const target = desktop.matches ? document.getElementById("routes") : document.getElementById(id);
    requestAnimationFrame(() => target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  };
  window.addEventListener("hashchange", fromHash);
  document.querySelectorAll<HTMLAnchorElement>("a[href^='#routes-']").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (location.hash === a.hash) { e.preventDefault(); fromHash(); }
    }),
  );
  if (location.hash) fromHash();
}

/* Production route: draw once when it enters the screen (effect 4) */
const route = document.querySelector<HTMLElement>("[data-route]");
if (route) {
  if (reduce || !("IntersectionObserver" in window)) route.classList.add("is-run");
  else {
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { route.classList.add("is-run"); io.disconnect(); }
    }, { threshold: 0, rootMargin: "0px 0px -15% 0px" });
    io.observe(route);
  }
}

/* Bottom contact bar on phones: only after the first screen */
const bar = document.querySelector<HTMLElement>("[data-bottom-bar]");
const hero = document.getElementById("hero");
if (bar && hero && "IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => bar.classList.toggle("is-shown", !e.isIntersecting), { threshold: 0 }).observe(hero);
} else bar?.classList.add("is-shown");

/* Models ribbon is a keyboard stop only when it actually scrolls (phone/tablet) */
const ribbon = document.querySelector<HTMLElement>("[data-ribbon]");
if (ribbon) {
  const sync = () => {
    if (ribbon.scrollWidth > ribbon.clientWidth + 1) ribbon.tabIndex = 0;
    else ribbon.removeAttribute("tabindex");
  };
  sync();
  window.addEventListener("resize", sync, { passive: true });
}
