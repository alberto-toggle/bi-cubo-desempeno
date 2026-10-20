"use client";
import { useState } from "react";
import BranchedMenu from "./BranchedMenu";
export default function Demo() {
  const [selected, setSelected] = useState("install");
  return (
    <div className="rounded-2xl bg-[#101018] p-8 text-white">
      <BranchedMenu onSelect={setSelected} />
      <p className="mt-8 text-xs text-white/60" role="status">
        Seleccionado: {selected}
      </p>
    </div>
  );
}
