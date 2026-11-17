"use client";
import { useState } from "react";
import { hotelVenues } from "@/features/demo/event-spaces";
import { demoStays } from "@/services/demo-occupancy";
import { FilterSelect } from "@/features/intelligence/filters";
import { ReportMetrics } from "@/features/reporting/report-layout";
import { dateKey, stayStatus, type OccupancyPeriod } from "./model";
import { useOccupancyAccess } from "./use-occupancy-access";
export function StaysScreen({
  unitId,
  period,
}: {
  unitId?: string;
  period: OccupancyPeriod;
}) {
  const [status, setStatus] = useState("all");
  const access = useOccupancyAccess();
  const now = `${dateKey(period, 15)}T12:00`;
  const rows = demoStays(period).filter((s) => !unitId || s.venueId === unitId);
  const statuses = [
    "Por llegar",
    "Arribo pendiente",
    "En estancia",
    "Salida pendiente",
    "Salida registrada",
  ];
  const display = (value: string | null) =>
    value ? value.replace("T", " · ") : "Sin registro";
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold">Llegadas y salidas</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Personas y movimientos ficticios. Corte simulado: {display(now)}.
          Consulta de estancias; no registra movimientos reales.
        </p>
      </div>
      <ReportMetrics
        items={[
          "Arribo pendiente",
          "En estancia",
          "Salida pendiente",
          "Salida registrada",
        ].map((label) => ({
          label,
          note: "Al corte simulado",
          value: String(
            rows.filter((s) => stayStatus(s, now) === label).length,
          ),
        }))}
      />
      <FilterSelect
        label="Estado de estancia"
        value={status}
        onChange={setStatus}
        options={[
          { value: "all", label: "Todas las estancias" },
          ...statuses.map((value) => ({ value, label: value })),
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {rows
          .filter((s) => status === "all" || stayStatus(s, now) === status)
          .map((s) => (
            <article key={s.id} className="surface p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <h4 className="font-semibold">
                  {access.person(s.guest, s.alias)}
                </h4>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {stayStatus(s, now)}
                </span>
              </div>
              <p className="my-3 text-sm text-muted-foreground">
                {hotelVenues.find((v) => v.id === s.venueId)?.name} · Habitación{" "}
                {s.room}
              </p>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Llegada prevista", s.expectedArrival],
                  ["Llegada registrada", s.actualArrival],
                  ["Salida prevista", s.expectedDeparture],
                  ["Salida registrada", s.actualDeparture],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="mt-1 font-medium">{display(value)}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
      </div>
      {!rows.some((s) => status === "all" || stayStatus(s, now) === status) && (
        <p className="surface p-5">Sin estancias para este filtro.</p>
      )}
    </section>
  );
}
