import { appearanceBootstrap } from "@/theme/browser";
import { defaults } from "@/theme/config";
import { Suspense } from "react";
import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "@fontsource-variable/ibm-plex-sans";
import "./globals.css";
import { SessionLifecycle } from "@/features/auth/session-lifecycle";
import { StoreProvider } from "@/store/provider";

import { TooltipProvider } from "@/components/ui/tooltip";
export const metadata: Metadata = {
  title: { default: "Panorama GTyG", template: "%s · Panorama GTyG" },
  description:
    "Inteligencia operativa y financiera. Plataforma de demostración.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-theme={defaults.theme}
      data-font={defaults.font}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: appearanceBootstrap() }} />
      </head>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-background focus:p-4"
        >
          Saltar al contenido
        </a>
        <Suspense
          fallback={
            <div className="p-8" role="status">
              Cargando Panorama…
            </div>
          }
        >
          <StoreProvider>
            <TooltipProvider>
              <SessionLifecycle />
              {children}
            </TooltipProvider>
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
