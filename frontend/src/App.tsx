import { useState } from "react";
import axios from "axios";
import { WalletAnalysis } from "./types";
import SolPackEntryPage from "./components/SolPackEntryPage";
import SolPackFinalPage from "./components/SolPackFinalPage";

type Stage = "entry" | "loading" | "final";

function App() {
  const [stage, setStage] = useState<Stage>("entry");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WalletAnalysis | null>(null);

  const handleContinue = async (walletAddress: string) => {
    if (!walletAddress.trim()) {
      setError("Please enter a Solana wallet address");
      return;
    }

    setAddress(walletAddress.trim());
    setStage("loading");
    setError(null);
    setData(null);

    try {
      const response = await axios.get(
        `https://solanacard.up.railway.app/api/analyze/${walletAddress.trim()}`
      );

      if (response.data.success) {
        setData(response.data.data);
        setStage("final");
      } else {
        setError(response.data.message || "Failed to analyze wallet");
        setStage("entry");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to analyze wallet. Please check the address and try again."
      );
      setStage("entry");
    }
  };

  const handleRestart = () => {
    setStage("entry");
    setAddress("");
    setData(null);
    setError(null);
  };

  // Loading state
  if (stage === "loading") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-slate-300">Analyzing wallet on Solana blockchain...</p>
          {error && <div className="error mt-4 max-w-md">{error}</div>}
        </div>
      </div>
    );
  }

  // Final stage
  if (stage === "final" && data) {
    return <SolPackFinalPage wallet={address} data={data} onRestart={handleRestart} />;
  }

  // Entry stage (default)
  return (
    <>
      <SolPackEntryPage onContinue={handleContinue} />
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 error max-w-md">
          {error}
        </div>
      )}
    </>
  );
}

export default App;
