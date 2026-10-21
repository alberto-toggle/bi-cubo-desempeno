// Demo access and navigation wait for browser session restoration.
// Keep the access gate and skeleton; this route does not promise instant navigation.
export const instant = false;

import { CatalogsScreen } from "@/features/intelligence/catalogs";
export default function Page() {
  return <CatalogsScreen />;
}
