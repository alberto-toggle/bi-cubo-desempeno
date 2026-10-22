"use client";
import { useFinancialPrivacy } from "@/features/privacy/use-financial-privacy";
import { PrivateChartNotice } from "@/features/privacy/privacy-control";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { intelligenceLayout } from "@/features/intelligence/layout";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  BookOpen,
  Palette,
  ShieldCheck,
} from "lucide-react";
import {
  presentIdentity,
  type IdentityMode,
} from "@/features/demo/identity-policy";
import type { DemoRole } from "@/features/auth/access";
import { money as originalMoney, unitTotals, type BusinessUnit } from "./model";
import { Metrics, TrendChart } from "./presentation";

function ContributionRanking({
  units,
  period,
  mode,
}: {
  units: BusinessUnit[];
  period: string;
  mode: IdentityMode;
}) {
  const { hidden } = useFinancialPrivacy();
  const money = usePrivateFormatter(originalMoney);
  if (hidden) return <PrivateChartNotice />;
  const rows = units
    .map((unit) => ({ unit, value: unitTotals(unit, period).contribution }))
    .sort((a, b) => b.value - a.value);
  const scale = Math.max(...rows.map((row) => Math.abs(row.value)), 1);
  return (
    <section className={intelligenceLayout.bentoCard}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Contribución por unidad</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Primeras 6 unidades · Ingresos menos costos · MXN
          </p>
        </div>
        <span className="rounded-md bg-muted px-2 py-1 text-xs tabular-nums">
          {rows.length}
        </span>
      </div>
      <ol className="mt-6 space-y-4">
        {rows.slice(0, 6).map(({ unit, value }, index) => (
          <li key={unit.id}>
            <Link
              href={`/establishments/${unit.id}`}
              className="group block rounded-sm"
            >
              <div className="mb-2 flex items-center gap-2 text-xs">
                <span className="w-4 shrink-0 tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate group-hover:text-primary">
                  {presentIdentity(unit, mode).name}
                </span>
                <span className="shrink-0 tabular-nums">{money(value)}</span>
              </div>
              <div
                className="ml-6 h-1 rounded-full bg-muted"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-chart-1"
                  style={{ width: `${(Math.abs(value) / scale) * 100}%` }}
                />
              </div>
            </Link>
          </li>
        ))}
      </ol>
      {!rows.length && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Sin unidades para esta selección.
        </p>
      )}
    </section>
  );
}

function WorkspaceLinks({ role }: { role: DemoRole | undefined }) {
  const links = [
    {
      href: "/establishments",
      title: "Establecimientos",
      note: "Consultar unidades",
      icon: Building2,
    },
    ...(role === "admin"
      ? [
          {
            href: "/catalogs",
            title: "Catálogos",
            note: "Revisar estructura",
            icon: BookOpen,
          },
          {
            href: "/settings/appearance",
            title: "Apariencia",
            note: "Tema y tipografía",
            icon: Palette,
          },
        ]
      : []),
  ];
  return (
    <section className={intelligenceLayout.bentoCard}>
      <h2 className="text-sm font-semibold">Accesos de trabajo</h2>
      <div className={intelligenceLayout.workspaceLinks}>
        {links.map(({ href, title, note, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <Icon size={17} className="shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium">{title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>
            </div>
            <ArrowUpRight
              size={13}
              className="shrink-0 text-muted-foreground"
            />
          </Link>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck size={13} />
        {role === "admin"
          ? "Acceso administrador"
          : "Acceso staff · Identidades protegidas"}
      </p>
    </section>
  );
}

export function OperationalBento({
  units,
  period,
  mode,
  role,
}: {
  units: BusinessUnit[];
  period: string;
  mode: IdentityMode;
  role: DemoRole | undefined;
}) {
  const pending = units.filter(
    (unit) => unit.status === "Por conciliar",
  ).length;
  return (
    <div className="space-y-4">
      <Metrics units={units} period={period} />
      <div className={intelligenceLayout.bento}>
        <TrendChart units={units} period={period} />
        <ContributionRanking units={units} period={period} mode={mode} />
        <WorkspaceLinks role={role} />
        <section className={intelligenceLayout.bentoCard}>
          <h2 className="text-sm font-semibold">Estado de conciliación</h2>
          <div className="mt-4 grid grid-cols-2 divide-x divide-border">
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {units.length - pending}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Al día</p>
            </div>
            <div className="pl-5">
              <p className="text-2xl font-semibold tabular-nums text-warning">
                {pending}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Por conciliar
              </p>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Estado registrado de las unidades filtradas.
          </p>
        </section>
      </div>
    </div>
  );
}
