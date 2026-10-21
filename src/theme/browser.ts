import {
  defaults,
  fonts,
  finishes,
  themeAliases,
  storageKey,
  themes,
  type Appearance,
} from "./config";

/** DOM adapter: no dependency on React, Redux or product features. */
export function applyAppearance(element: HTMLElement, value: Appearance) {
  element.dataset.theme = value.theme;
  element.dataset.font = value.font;
  element.dataset.finish = value.finish;
  element.classList.toggle(
    "dark",
    themes.find((theme) => theme.id === value.theme)?.colorScheme === "dark",
  );
}

/** Runs before paint. The catalog and defaults come from the same registry as settings. */
export function appearanceBootstrap() {
  const catalog = JSON.stringify({
    themes,
    fonts,
    finishes,
    themeAliases,
    defaults,
    storageKey,
  }).replace(/</g, "\\u003c");
  return `(()=>{const c=${catalog};try{const a=JSON.parse(localStorage.getItem(c.storageKey)||'null')||{};const t=c.themes.find(t=>t.id===(c.themeAliases[a.theme]||a.theme))||c.themes.find(t=>t.id===c.defaults.theme);const f=c.fonts.find(f=>f.id===a.font)||c.fonts.find(f=>f.id===c.defaults.font);const finish=c.finishes.find(f=>f.id===a.finish)||c.finishes.find(f=>f.id===c.defaults.finish);const e=document.documentElement;e.dataset.theme=t.id;e.dataset.font=f.id;e.dataset.finish=finish.id;e.classList.toggle('dark',t.colorScheme==='dark');}catch{}})()`;
}
