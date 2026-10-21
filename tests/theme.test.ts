import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { themes, defaults, storageKey } from "../src/theme/config";
import { appearanceBootstrap, applyAppearance } from "../src/theme/browser";

test("every registered palette supplies the complete semantic contract", () => {
  const css = readFileSync(
    new URL("../src/theme/palettes.css", import.meta.url),
    "utf8",
  );
  const contract = [
    ...readFileSync(
      new URL("../src/theme/tokens.css", import.meta.url),
      "utf8",
    ).matchAll(/var\(--palette-([\w-]+)\)/g),
  ]
    .map((m) => m[1])
    .sort();
  for (const theme of themes) {
    const block = css.match(
      new RegExp(`\\[data-theme="${theme.id}"\\] \\{([^}]+)\\}`),
    )?.[1];
    assert.ok(block, theme.id);
    assert.deepEqual(
      [...block.matchAll(/--palette-([\w-]+):/g)].map((m) => m[1]).sort(),
      contract,
    );
  }
});

test("prepaint bootstrap and runtime adapter agree for every theme", () => {
  for (const theme of themes) {
    const createElement = () => ({
      dataset: {} as Record<string, string>,
      dark: false,
      classList: {
        toggle(_name: string, dark: boolean) {
          thisElement.dark = dark;
        },
      },
    });
    let thisElement = createElement();
    const value = { theme: theme.id, font: defaults.font, finish: defaults.finish };
    applyAppearance(thisElement as unknown as HTMLElement, value);
    const expected = {
      dataset: { ...thisElement.dataset },
      dark: thisElement.dark,
    };
    thisElement = createElement();
    runInNewContext(appearanceBootstrap(), {
      document: { documentElement: thisElement },
      localStorage: {
        getItem(key: string) {
          assert.equal(key, storageKey);
          return JSON.stringify(value);
        },
      },
    });
    assert.deepEqual(
      { dataset: thisElement.dataset, dark: thisElement.dark },
      expected,
    );
  }
});

import { fonts, finishes, validateAppearance } from "../src/theme/config";
test("palette, font and finish remain independent through restoration and bootstrap", () => {
  for (const theme of themes) for (const font of fonts) for (const finish of finishes) {
    const value = { theme: theme.id, font: font.id, finish: finish.id };
    assert.deepEqual(validateAppearance(value), value);
    const element = { dataset: {} as Record<string, string>, classList: { toggle() {} } };
    runInNewContext(appearanceBootstrap(), {
      document: { documentElement: element },
      localStorage: { getItem: () => JSON.stringify(value) },
    });
    assert.deepEqual(element.dataset, value);
  }
});
test("legacy Orbit preferences migrate to Prisma without changing the font", () => {
  const legacy = { theme: "violet", font: "patria" };
  const expected = { theme: "prism", font: "patria", finish: "original" };
  assert.deepEqual(validateAppearance(legacy), expected);
  const element = { dataset: {}, classList: { toggle() {} } };
  runInNewContext(appearanceBootstrap(), {
    document: { documentElement: element }, localStorage: { getItem: () => JSON.stringify(legacy) },
  });
  assert.deepEqual(element.dataset, expected);
  assert.deepEqual(validateAppearance({ ...expected, finish: "unsupported" }), expected);
});
