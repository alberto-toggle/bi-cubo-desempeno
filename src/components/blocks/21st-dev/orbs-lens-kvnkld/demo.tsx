import { Orb, LENS_VARIANTS, ORB_TASKS } from "./component";

export default function Demo() {
  return (
    <div className="rounded-xl bg-[#fafafa] p-4 text-[#1a1a1a] sm:p-8">
      <div className="flex min-h-[240px] items-center justify-center">
        <Orb variant="B5" size={40} label="Routing" pill />
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {LENS_VARIANTS.map((variant) => (
          <li
            key={variant}
            className="flex min-h-32 flex-col items-center justify-center gap-4 rounded-xl border border-black/10 bg-white p-3"
          >
            <Orb variant={variant} size={48} />
            <span className="text-xs">{ORB_TASKS[variant]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
