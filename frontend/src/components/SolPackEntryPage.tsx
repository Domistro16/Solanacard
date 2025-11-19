import { useState } from "react";
import BlankImage from "../assets/Blank.png"; // ✅ Use the truly blank template
interface SolPackEntryPageProps {
  onContinue: (wallet: string) => void;
}

export default function SolPackEntryPage({ onContinue }: SolPackEntryPageProps) {
  const [wallet, setWallet] = useState("");

  return (
    <div className="min-h-screen w-full px-6 md:py-16 py-32 flex flex-col items-center text-white bg-black relative overflow-hidden">
      {/* Spotlight / background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-black/80 to-black opacity-90" />
      <div className="absolute -top-20 -left-20 h-72 w-72 bg-cyan-500/20 blur-2xl rounded-full opacity-40" />
      <div className="absolute bottom-0 right-0 h-80 w-80 bg-fuchsia-500/20 blur-2xl rounded-full opacity-40" />

      <div className="relative z-10 flex flex-col items-center space-y-6  text-center">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          Your Wallet Has A Personality,
          <br />
          <span className="opacity-90 italic">Let&apos;s Reveal It</span>
        </h1>

        <p className="text-slate-300 text-sm md:text-base">
          Enter your wallet address below.
        </p>

        {/* Default SolPack box */}
        <img src={BlankImage} className="h-56 w-56 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md text-slate-400 text-sm" />
     
        {/* Input + Button */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-4 max-w-md">
          <input
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Enter Solana address"
            className="flex-1 rounded-xl border border-white/20 bg-black/40 px-4 py-3 outline-none text-sm placeholder:text-slate-500"
          />

          <button
            onClick={() => onContinue(wallet)}
            className="rounded-xl bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-slate-200 transition"
          >
            Check
          </button>
        </div>
      </div>
    </div>
  );
}
