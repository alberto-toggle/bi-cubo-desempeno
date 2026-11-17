import { ReportScreen } from "@/features/reporting/report-screen";
export const instant = false;
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string }>;
}) {
  const query = await searchParams;
  return (
    <ReportScreen
      initialChapter={query.chapter === "salons" ? "salons" : "all"}
    />
  );
}
