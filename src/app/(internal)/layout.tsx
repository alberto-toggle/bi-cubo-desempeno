import { AppShell } from "@/features/shell/app-shell";
import { PlaygroundSidebar } from "@/features/playground/playground-sidebar";
export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell internal sidebar={<PlaygroundSidebar />}>
      {children}
    </AppShell>
  );
}
