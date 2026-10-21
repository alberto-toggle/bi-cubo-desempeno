import { Orb, type OrbLook } from "./thinking-orbs";

const lines: (OrbLook & { label: string })[] = [
  { state: "working", label: "Working" },
  { state: "reasoning", label: "Thinking" },
  { state: "searching", label: "Searching web" },
  { state: "background", label: "2 Background Tasks" },
  { state: "compacting", label: "Compacting context" },
  { state: "retrying", label: "Retrying — attempt 2 of 10" },
  { state: "waiting", label: "Waiting for usage limit to reset" },
];

export default function Demo() {
  return (
    <div className="flex flex-col gap-3 p-10 text-sm text-foreground">
      {lines.map(({ label, ...look }) => (
        <div key={look.state} className="flex items-center gap-2">
          <Orb {...look} />
          <span className="text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
