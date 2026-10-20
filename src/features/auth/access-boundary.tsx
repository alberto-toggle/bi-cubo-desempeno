"use client";
import { ViewSkeleton, viewKind } from "@/features/loading/skeletons";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { canManage } from "./access";
export function AccessBoundary({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAppSelector((s) => s.auth),
    router = useRouter(),
    path = usePathname();
  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);
  if (!ready || !session)
    return (
      <div className="mx-auto max-w-6xl p-8">
        <ViewSkeleton kind={viewKind(path)} />
      </div>
    );
  if (
    (path.startsWith("/settings") || path.startsWith("/catalogs")) &&
    !canManage(session.role)
  )
    return (
      <div className="mx-auto max-w-lg p-10 pt-32">
        <ShieldCheck className="mb-6 text-primary" />
        <h1 className="page-title">Acceso reservado</h1>
        <p className="page-copy">
          Esta sección está disponible para el administrador en esta
          demostración.
        </p>
        <Link className="primary-button mt-6" href="/">
          Volver a mi panorama
        </Link>
      </div>
    );
  return children;
}
