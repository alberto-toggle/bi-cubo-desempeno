// Demo access and navigation wait for browser session restoration.
// Keep the access gate and skeleton; this route does not promise instant navigation.
export const instant = false;

import { UnitDetail } from "@/features/intelligence/unit-detail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UnitDetail id={id} />;
}
