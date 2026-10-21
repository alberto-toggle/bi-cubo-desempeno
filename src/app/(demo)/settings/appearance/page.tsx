// Demo access and navigation wait for browser session restoration.
// Keep the access gate and skeleton; this route does not promise instant navigation.
export const instant = false;

import { AppearanceScreen } from "@/features/appearance/appearance-screen";
export default function Page() {
  return <AppearanceScreen />;
}
