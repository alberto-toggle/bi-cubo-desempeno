import { AccessBoundary } from "@/features/auth/access-boundary";
import { AppShell } from "@/features/shell/app-shell";
import { DemoWidget } from "@/features/demo/demo-widget";
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccessBoundary>
      <AppShell>
        {children}
        <DemoWidget />
      </AppShell>
    </AccessBoundary>
  );
}
