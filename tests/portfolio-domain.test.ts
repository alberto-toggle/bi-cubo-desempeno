import { test } from "node:test";
import assert from "node:assert/strict";
import fixture from "../public/demo/portfolio.json";
import geometry from "../src/components/maps/mexico-paths.json";
import {
  parsePortfolio,
  initialFilters,
  aggregate,
} from "../src/features/intelligence/model";
import { filterUnits } from "../src/features/intelligence/queries";
import {
  cafeteriaScenario as scenario,
  reconcileSettlement,
} from "../src/features/intelligence/traceability/scenario";
import {
  catalogRecords,
  validateProposals,
} from "../src/features/catalog-management/catalog-model";
const { units } = parsePortfolio(fixture);
test("documented universe has 54 unique units, six regions and twelve states represented in the map", () => {
  assert.equal(units.length, 54);
  assert.equal(new Set(units.map((u) => u.code)).size, 54);
  assert.equal(new Set(units.map((u) => u.region)).size, 6);
  assert.equal(new Set(units.map((u) => u.stateCode)).size, 12);
  assert.equal(geometry.states.length, 32);
  for (const u of units)
    assert.ok(geometry.states.some((s) => s.id === u.stateCode));
  assert.equal(catalogRecords.length, 201);
});
test("operational segment projects center totals without double counting its host unit", () => {
  const segment = units.find((u) => u.centers.length > 1)!.centers[1].segment;
  const result = filterUnits(units, { ...initialFilters, segment }, "full");
  assert.ok(result.length > 0);
  assert.ok(result.every((u) => u.centers.every((c) => c.segment === segment)));
  const expected = units
    .flatMap((u) => u.centers)
    .filter((c) => c.segment === segment)
    .flatMap((c) => c.monthly)
    .reduce((s, m) => s + m.revenue, 0);
  assert.equal(aggregate(result).revenue, expected);
  assert.equal(new Set(result.map((u) => u.id)).size, result.length);
});
test("hidden geographical filters cannot narrow staff results", () => {
  assert.equal(
    filterUnits(
      units,
      { ...initialFilters, state: "MXCMX", region: "invalid" },
      "alias",
    ).length,
    54,
  );
  assert.equal(
    filterUnits(units, { ...initialFilters, state: "invalid" }, "full").length,
    0,
  );
});
test("inconsistent unit and center financial totals are rejected", () => {
  const corrupted = structuredClone(fixture);
  corrupted.units[0].centers[0].monthly[0].revenue += 1;
  assert.throws(() => parsePortfolio(corrupted));
});
test("cafeteria policies balance and reconcile to the documented contribution and stock", () => {
  for (const stage of scenario.stages)
    assert.equal(
      stage.entries.reduce((s, e) => s + e.debit - e.credit, 0),
      0,
      stage.id,
    );
  assert.equal(scenario.sales - scenario.cost - scenario.commission, 8700);
  assert.equal((scenario.purchased - scenario.sold) * scenario.unitCost, 4000);
  assert.equal(reconcileSettlement(15000, 14700, 300), 0);
  assert.equal(reconcileSettlement(15000, 14200, 300), 500);
  assert.deepEqual(validateProposals([null, {}, { action: "delete" }]), []);
});
