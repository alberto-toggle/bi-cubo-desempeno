"use client";
import { PanoramaMark } from "@/components/brand/panorama-mark";
import { RouteTransition } from "@/features/loading/route-transition";
import Link from "next/link";
import { BranchedNavigation } from "@/components/navigation/branched-navigation";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSession } from "@/features/auth/auth-slice";
import { DemoHelp } from "@/features/demo/demo-controls";
import {
  ArrowUpRight,
  Compass,
  Layers3,
  Building2,
  BookOpen,
  LogOut,
  Menu,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
export function AppShell({
  children,
  internal = false,
  sidebar,
}: {
  children: React.ReactNode;
  internal?: boolean;
  sidebar?: React.ReactNode;
}) {
  const pathname = usePathname();
  const session = useAppSelector((s) => s.auth.session),
    dispatch = useAppDispatch();
  const admin = session?.role === "admin";
  const isPlayground = internal;
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false);
  const items = [
    { href: "/", label: "Vista general", icon: Compass },
    ...(internal
      ? [{ href: "/playground", label: "Playground", icon: Layers3 }]
      : []),
    ...(!internal
      ? [
          {
            href: "/establishments",
            label: "Establecimientos",
            icon: Building2,
          },
        ]
      : []),
    ...(admin && !internal
      ? [
          { href: "/catalogs", label: "Catálogos maestros", icon: BookOpen },
          { href: "/settings/appearance", label: "Apariencia", icon: Palette },
        ]
      : []),
  ];
  return (
    <div className="app-shell" data-collapsed={collapsed}>
      {mobile && (
        <button
          className="fixed inset-0 z-30 bg-overlay md:hidden"
          aria-label="Cerrar navegación"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        className={"app-sidebar " + (mobile ? "mobile-open" : "")}
        aria-label="Navegación principal"
      >
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
            title="Panorama GTyG"
          >
            <PanoramaMark title="Panorama GTyG" width={38} height={43} />
            {!collapsed && (
              <span className="text-lg">
                panorama<span className="text-sidebar-accent">.</span>
              </span>
            )}
          </Link>
          <button
            aria-label="Cerrar menú"
            className="md:hidden"
            onClick={() => setMobile(false)}
          >
            <X size={20} />
          </button>
        </div>
        {!collapsed && (
          <p className="mt-8 mb-3 text-[10px] font-semibold uppercase tracking-[.18em] text-sidebar-muted">
            Espacio de trabajo
          </p>
        )}
        {!internal && !collapsed ? (
          <BranchedNavigation
            groups={[
              {
                label: "Consulta",
                links: items.filter(
                  (item) =>
                    item.href === "/" || item.href === "/establishments",
                ),
              },
              ...(admin
                ? [
                    {
                      label: "Administración",
                      links: items.filter(
                        (item) =>
                          item.href === "/catalogs" ||
                          item.href.startsWith("/settings"),
                      ),
                    },
                  ]
                : []),
            ]}
            pathname={pathname}
            onNavigate={() => setMobile(false)}
          />
        ) : (
          <nav className="mt-4 space-y-1">
            {items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                title={label}
                onClick={() => setMobile(false)}
                aria-current={
                  (href === "/" ? pathname === "/" : pathname.startsWith(href))
                    ? "page"
                    : undefined
                }
                className="sidebar-link"
              >
                <Icon size={18} />
                {!collapsed && label}
              </Link>
            ))}
          </nav>
        )}
        {!collapsed && sidebar}
        <div className="mt-auto pt-10">
          {!collapsed && (
            <div className="mb-5 rounded-xl border border-sidebar-border p-3">
              <p className="text-xs font-medium">Grupo de Tiendas y Granjas</p>
              <p className="mt-2 text-[11px] leading-relaxed text-sidebar-muted">
                Consulta operativa y financiera.
              </p>
            </div>
          )}
          <button
            className="sidebar-link hidden w-full md:flex"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            aria-label={
              collapsed ? "Expandir barra lateral" : "Contraer barra lateral"
            }
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}{" "}
            {!collapsed && "Contraer menú"}
          </button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="app-topbar">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              aria-label="Abrir navegación"
              onClick={() => {
                setCollapsed(false);
                setMobile(true);
              }}
            >
              <Menu size={20} />
            </button>
            <span className="text-sm text-muted-foreground">
              GTyG <span className="mx-2 opacity-40">/</span>{" "}
              <span className="text-foreground">
                {isPlayground
                  ? "Laboratorio visual"
                  : pathname.includes("settings")
                    ? "Configuración"
                    : pathname.includes("establishments")
                      ? "Establecimientos"
                      : pathname.includes("catalogs")
                        ? "Catálogos"
                        : "Panorama"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DemoHelp>Entorno de demostración</DemoHelp>
            {admin && !internal && (
              <Link
                href="/settings/appearance"
                aria-label="Personalizar apariencia"
                className="rounded-full border border-border p-2"
              >
                <Palette size={16} />
              </Link>
            )}
            {!internal && session && (
              <>
                <span className="hidden text-xs sm:inline">
                  {admin ? "Administrador" : "Staff"}
                </span>
                <button
                  aria-label="Cerrar sesión"
                  className="rounded-full border border-border p-2"
                  onClick={() => {
                    dispatch(setSession(null));
                  }}
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>
        </header>
        <main
          id="contenido"
          className="mx-auto w-full max-w-[1600px] p-5 sm:p-8 xl:p-10"
        >
          {internal ? children : <RouteTransition>{children}</RouteTransition>}
        </main>
        <footer className="flex flex-wrap justify-between gap-2 border-t border-border px-8 py-5 text-xs text-muted-foreground">
          <span>Panorama GTyG</span>
          {internal && (
            <Link href="/playground" className="flex items-center gap-1">
              Biblioteca de componentes <ArrowUpRight size={12} />
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}
