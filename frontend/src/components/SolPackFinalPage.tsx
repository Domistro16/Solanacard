import { useRef } from "react";
import html2canvas from "html2canvas";
import { WalletAnalysis } from "../types";
import { WalletCard } from "./WalletCard";

interface SolPackFinalPageProps {
  wallet: string;
  data: WalletAnalysis;
  onRestart: () => void;
}

export default function SolPackFinalPage({ wallet, data, onRestart }: SolPackFinalPageProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "solpack.png";
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleShare = () => {
    const baseText = "Just generated my SolPack wallet vibe card on Solana.";
    const walletSnippet =
      wallet && wallet.length > 8
        ? ` Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}`
        : "";
    const text = encodeURIComponent(baseText + walletSnippet + " #SolPack #Solana");
    const url = encodeURIComponent("https://your-solpack-site.xyz"); // update later
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="min-h-screen w-full relative px-6 py-16 md:py-24 font-[Inter,system-ui] text-white overflow-hidden bg-black flex items-center justify-center">
      {/* Background layers (same vibe as entry page) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-black/80 to-black opacity-90" />
      <div className="absolute -top-20 -left-20 h-72 w-72 bg-cyan-500/20 blur-2xl rounded-full opacity-40" />
      <div className="absolute bottom-0 right-0 h-80 w-80 bg-fuchsia-500/20 blur-2xl rounded-full opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/40 opacity-40 mix-blend-soft-light" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center space-y-8 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Your SolPack Is Ready
        </h1>

        {/* Large SolPack Square with WalletCard */}
        <div
          ref={cardRef}
          className="relative flex items-center justify-center rounded-2xl overflow-hidden"
        >
          <WalletCard data={data} />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            className="rounded-lg bg-white text-black font-semibold py-3 px-6 text-sm shadow-md hover:bg-gray-200 transition"
            onClick={handleDownload}
          >
            Download Your SolPack
          </button>

          <button
            className="rounded-lg bg-[#e0a000] text-black font-semibold py-3 px-6 text-sm shadow-md hover:bg-[#e0a000] transition"
            onClick={handleShare}
          >
            Share On X With Frens
          </button>
        </div>

        {/* Helper line + restart */}
        <div className="flex flex-col items-center gap-2 mt-4 text-xs md:text-sm text-slate-400">
          <p>
            Want to try a different wallet? You can generate another SolPack.
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="text-solYellow hover:underline"
          >
            Generate Another Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
