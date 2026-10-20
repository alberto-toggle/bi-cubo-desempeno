"use client";
import { useState } from "react";
import InfiniteMenu from "./InfiniteMenu";
const items = ["blue", "violet", "copper", "teal", "rose", "slate"].map(
  (name, i) => ({
    image: `/images/playground/${name}.svg`,
    title: ["Océano", "Violeta", "Cobre", "Turquesa", "Rosa", "Pizarra"][i],
    description: "Arrastra la esfera o usa las flechas del teclado.",
  }),
);
export default function Demo() {
  const [selected, setSelected] = useState("");
  return (
    <>
      <div className="h-[560px] overflow-hidden rounded-2xl">
        <InfiniteMenu
          items={items}
          onItemClick={(item) => setSelected(item.title)}
          backgroundColor="#101018"
        />
      </div>
      <p role="status" className="mt-4 text-sm text-muted-foreground">
        {selected
          ? `Seleccionado: ${selected}`
          : "Demostración visual · sin navegación externa."}
      </p>
    </>
  );
}
