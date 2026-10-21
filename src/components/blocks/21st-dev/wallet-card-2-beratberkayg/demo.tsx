import WalletCard from "./component";
export default function Demo() {
  return (
    <div
      className="w-full p-3 sm:p-8"
      style={{
        backgroundImage: "radial-gradient(#aaa4 1px, transparent 1px)",
        backgroundSize: "6px 6px",
      }}
    >
      <WalletCard />
    </div>
  );
}
