import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  validateAppearance,
  defaults,
} from "../src/features/appearance/config";
import { parseOverview, summarize } from "../src/features/overview/types";
import { makeStore } from "../src/store/store";
import { loadOverview } from "../src/features/overview/overview-slice";
const fixture = JSON.parse(
  readFileSync(
    new URL("../public/demo/overview.json", import.meta.url),
    "utf8",
  ),
);
test("validates persisted preferences and rejects unknown theme/font", () => {
  assert.deepEqual(
    validateAppearance({ theme: "unknown", font: "unsafe" }),
    defaults,
  );
  assert.deepEqual(validateAppearance({ theme: "night", font: "plex" }), {
    theme: "night",
    font: "plex",
  });
  assert.deepEqual(validateAppearance(null), defaults);
});
test("summary derives consistent totals from the JSON rather than separate mock cards", () => {
  const d = parseOverview(fixture),
    s = summarize(d);
  assert.equal(s.revenue, 2392000);
  assert.equal(s.cost, 1530880);
  assert.equal(s.contribution, 861120);
  assert.equal(s.margin, 36);
  assert.equal(
    d.activities.reduce((n, x) => n + x.value, 0),
    100,
  );
  assert.equal(summarize({ ...d, monthly: [] }).margin, 0);
  assert.throws(() =>
    parseOverview({
      ...fixture,
      monthly: [{ month: "Ene", revenue: -1, cost: 0 }],
    }),
  );
});
test("repository is replaceable; rejected request is retryable", async () => {
  let fail = true;
  const store = makeStore({
    async load() {
      if (fail) throw new Error("Sin conexión");
      return parseOverview(fixture);
    },
  });
  await store.dispatch(loadOverview());
  assert.equal(store.getState().overview.status, "failed");
  fail = false;
  await store.dispatch(loadOverview());
  assert.equal(store.getState().overview.status, "succeeded");
  assert.equal(store.getState().overview.error, null);
});
test("stale response cannot overwrite the latest request", async () => {
  let resolveFirst!: (v: ReturnType<typeof parseOverview>) => void;
  let calls = 0;
  const store = makeStore({
    load() {
      calls++;
      return calls === 1
        ? new Promise((resolve) => {
            resolveFirst = resolve;
          })
        : Promise.resolve({ ...fixture, period: "Nuevo" });
    },
  });
  const first = store.dispatch(loadOverview());
  await store.dispatch(loadOverview());
  resolveFirst({ ...fixture, period: "Anterior" });
  await first;
  assert.equal(store.getState().overview.data?.period, "Nuevo");
});
test("aborted request does not leave the screen in failed state", async () => {
  const store = makeStore({ load: () => new Promise(() => {}) });
  const task = store.dispatch(loadOverview());
  task.abort();
  await task;
  assert.equal(store.getState().overview.status, "idle");
  assert.equal(store.getState().overview.error, null);
});

import { presentIdentity } from "../src/features/demo/identity-policy";
const identity = {
  id: "demo",
  name: "Nombre ficticio sensible",
  location: "Ubicación ficticia sensible",
  alias: "Unidad Alfa",
};
test("identity modes expose only the intended fields and fail closed", () => {
  assert.deepEqual(presentIdentity(identity, "full"), {
    name: identity.name,
    location: identity.location,
  });
  const alias = presentIdentity(identity, "alias");
  assert.equal(alias.name, "Unidad Alfa");
  assert.equal(alias.location, "Ubicación reservada");
  const hidden = presentIdentity(identity, "hidden");
  assert.equal(hidden.name, "••••••••");
  assert.equal(JSON.stringify(hidden).includes(identity.name), false);
  assert.equal(JSON.stringify(alias).includes(identity.location), false);
  assert.deepEqual(presentIdentity(identity, "unknown" as never), hidden);
});

import {
  authenticateDemo,
  restoreSession,
  canManage,
} from "../src/features/auth/access";
import {
  effectiveIdentity,
  aggregate,
  parsePortfolio,
  initialFilters,
} from "../src/features/intelligence/model";
import { filterUnits, buildCsv } from "../src/features/intelligence/queries";
import portfolioFixture from "../public/demo/portfolio.json";
test("demo accounts and expiry validate without accepting unknown roles", () => {
  assert.equal(
    authenticateDemo(" ADMIN@PANORAMA.DEMO ", "Panorama2026!"),
    "admin",
  );
  assert.equal(authenticateDemo("staff@panorama.demo", "wrong"), null);
  assert.equal(canManage("staff"), false);
  assert.equal(restoreSession({ role: "admin", expiresAt: 999 }, 1000), null);
  assert.equal(restoreSession({ role: "owner", expiresAt: 2000 }, 1000), null);
  assert.equal(
    restoreSession({ role: "staff", expiresAt: 2000 }, 1000)?.role,
    "staff",
  );
});
test("staff cannot reveal identities via search, requested mode or CSV", () => {
  const data = parsePortfolio(portfolioFixture),
    mode = effectiveIdentity("staff", "full");
  assert.equal(mode, "alias");
  assert.equal(
    filterUnits(
      data.units,
      { ...initialFilters, query: data.units[0].name },
      mode,
    ).length,
    0,
  );
  assert.equal(
    filterUnits(data.units, { ...initialFilters, query: "Unidad Alfa" }, mode)
      .length,
    1,
  );
  const csv = buildCsv(data.units, mode, "Jun");
  for (const u of data.units) {
    assert.equal(csv.includes(u.name), false);
    assert.equal(csv.includes(u.location), false);
  }
  assert.equal(csv.includes("Unidad Alfa"), true);
  assert.equal(
    buildCsv(data.units, "hidden", "all").includes("Unidad Alfa"),
    false,
  );
});
test("portfolio filters and totals agree across dashboard, detail and export", () => {
  const data = parsePortfolio(portfolioFixture),
    units = filterUnits(
      data.units,
      { ...initialFilters, segment: "Comercio" },
      "full",
    );
  assert.equal(units.length, 2);
  const sum = aggregate(units, "Jun");
  assert.equal(sum.contribution, sum.revenue - sum.cost);
  assert.ok(sum.revenue < aggregate(units).revenue);
  assert.equal(aggregate([]).revenue, 0);
  assert.throws(() => parsePortfolio({ units: [{}], updatedAt: "today" }));
});

import {
  createChallenge,
  checkChallenge,
} from "../src/features/auth/two-factor";
import { validateDemoPreferences } from "../src/features/demo/preferences";
test("two factor demo validates code, expiry and attempt limit", () => {
  const c = createChallenge("admin", "admin@panorama.demo", 1000);
  assert.equal(checkChallenge(c, "123456", 2000), "valid");
  assert.equal(checkChallenge(c, "654321", 2000), "invalid");
  assert.equal(checkChallenge(c, "123456", 121000), "expired");
  assert.equal(checkChallenge({ ...c, attempts: 5 }, "123456", 2000), "locked");
  assert.equal(c.role, "admin");
});
test("demo preferences only accept a boolean two-factor flag", () => {
  assert.deepEqual(validateDemoPreferences({ twoFactor: true }), {
    twoFactor: true,
    showHelp: true,
  });
  assert.deepEqual(validateDemoPreferences({ twoFactor: "true" }), {
    twoFactor: false,
    showHelp: true,
  });
  assert.deepEqual(validateDemoPreferences(null), {
    twoFactor: false,
    showHelp: true,
  });
});

test("demo hints can be hidden without disabling two factor", () => {
  assert.deepEqual(
    validateDemoPreferences({ twoFactor: true, showHelp: false }),
    { twoFactor: true, showHelp: false },
  );
});
