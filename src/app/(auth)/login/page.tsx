import type { Metadata } from "next";
export const metadata: Metadata = {
  title: { absolute: "Acceso" },
  description: "Acceso restringido.",
};
import { LoginScreen } from "@/features/auth/login-screen";
export default function Page() {
  return <LoginScreen />;
}
