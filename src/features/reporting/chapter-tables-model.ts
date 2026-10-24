import type { ReportUnitRow } from "./model";

export type ChapterCell =
  | { type: "text"; lines: string[] }
  | { type: "percent"; value: number | null }
  | { type: "money"; value: number; percent?: number | null; note?: string }
  | {
      type: "parts";
      parts: { label: string; value: number; percent?: number | null }[];
    };
export type ChapterTable = {
  title: string;
  description: string;
  columns: string[];
  rows: {
    id: string;
    label: string;
    color: string;
    labelColor?: string;
    cells: ChapterCell[];
  }[];
};
export type OccupancyRow = {
  id: string;
  label: string;
  color: string;
  average: number;
  current: number;
};
export type ChapterTablesData = {
  main: ChapterTable;
  supplementary: ChapterTable | null;
  occupancy: OccupancyRow[];
  target: number;
  actual: number;
  advance: number | null;
  pending: number | null;
};
export type ChapterUnitResult = ReportUnitRow & { color: string };
