"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ViewSkeleton, viewKind, type ViewKind } from "./skeletons";
function Transition({
  children,
  kind,
}: {
  children: React.ReactNode;
  kind: ViewKind;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(timer);
  }, []);
  return ready ? (
    <div className="view-enter">{children}</div>
  ) : (
    <ViewSkeleton kind={kind} />
  );
}
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <Transition key={path} kind={viewKind(path)}>
      {children}
    </Transition>
  );
}
