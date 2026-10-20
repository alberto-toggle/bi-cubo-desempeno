import "./orbital-artwork.css";
import { ChartNoAxesCombined, Database, Network } from "lucide-react";
export function OrbitalArtwork() {
  return (
    <div className="orbital-artwork" aria-hidden="true">
      <div className="orbital-halo" />
      <div className="orbital-plane plane-back">
        <Network size={44} />
      </div>
      <div className="orbital-plane plane-middle">
        <Database size={40} />
      </div>
      <div className="orbital-plane plane-front">
        <ChartNoAxesCombined size={54} />
        <span className="orbital-spark" />
      </div>
    </div>
  );
}
