import { useEffect, useRef } from "react";
import { WalletAnalysis } from "../types";
import BlankImage from "../assets/Blank.png"; // ✅ Use the truly blank template
import Pers1 from "../assets/Pers1.png";
import pers2 from "../assets/pers2.png";
import pers3 from "../assets/pers3.png";
import pers4 from "../assets/pers4.png";
import pers5 from "../assets/pers5.png";
import pers6 from "../assets/pers6.png";
import pers7 from "../assets/pers7.png";
import pers8 from "../assets/pers8.png";
import pers9 from "../assets/pers9.png";
import Verd1 from "../assets/Verd1.png";
import Verd2 from "../assets/Verd2.png";
import Verd3 from "../assets/Verd3.png";
import Verd4 from "../assets/Verd4.png";
import Verd5 from "../assets/Verd5.png";
import Verd6 from "../assets/Verd6.png";
import Verd7 from "../assets/Verd7.png";
import Verd8 from "../assets/Verd8.png";

const persImages = [
  Pers1,
  pers2,
  pers3,
  pers4,
  pers5,
  pers6,
  pers7,
  pers8,
  pers9,
];

const verdImages = [Verd1, Verd2, Verd3, Verd4, Verd5, Verd6, Verd7, Verd8];

interface WalletCardProps {
  data: WalletAnalysis;
}

export function WalletCard({ data }: WalletCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCard(canvasRef.current, data);
    }
    async function loadFonts() {
      const font = new FontFace(
        "Grotesk",
        'url("https://fonts.gstatic.com/s/schibstedgrotesk/v7/Jqz55SSPQuCQF3t8uOwiUL-taUTtap9GayojdSFO.woff2") format("woff2")',
        { weight: "700", style: "normal" }
      );

      // load them before drawing anything
      await Promise.all([font.load()]);
      document.fonts.add(font);

      // ensure the browser has them ready (request a specific weight)
      await document.fonts.load('400 16px "Grotesk"');
      await document.fonts.ready;
    }
    loadFonts();
  }, [data]);

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `solpack-card-${data.address.slice(0, 8)}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={650}
          height={650}
          style={{ width: "650px", height: "650px" }} // Display size
        />
      </div>
      <button className="btn download-btn" onClick={downloadImage}>
        Download Card
      </button>
    </div>
  );
}

function drawCard(canvas: HTMLCanvasElement, data: WalletAnalysis) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const scale = 3; // Try 2 or 3 for best results
  const width = 650;
  const height = 650;

  canvas.width = width * scale;
  canvas.height = height * scale;

  // ✅ Scale the context to match
  ctx.scale(scale, scale);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Select a random pers image
  const randomPersImage =
    persImages[Math.floor(Math.random() * persImages.length)];
  const randomVerd = verdImages[Math.floor(Math.random() * verdImages.length)];
  // Load and draw background image
  const bgImage = new Image();
  bgImage.src = BlankImage;
  bgImage.onload = () => {
    // Draw the background image
    ctx.drawImage(bgImage, 0, 0, width, height);

    // Load and draw the pers image
    const verdImg = new Image();
    verdImg.src = randomVerd;
    const persImg = new Image();
    persImg.src = randomPersImage;
    const statusImg = new Image();
    statusImg.src = `/${data.whaleStatus.tier.toLowerCase()}.png`;
    verdImg.onload = () => {
      ctx.drawImage(verdImg, 340, 343, 140, 100);
    };
    statusImg.onload = () => {
      ctx.drawImage(statusImg, 165, 220, 150, 100);
    };
    persImg.onload = () => {
      // Draw pers image in the rounded square
      const persY = 150; // Positioned in the rounded square
      ctx.drawImage(persImg, 180, persY, 310, 35);

      // // Continue with the rest of the drawing
      drawCardContent(ctx, width, height, data);
    };
  };
}

function drawCardContent(
  ctx: CanvasRenderingContext2D,
  width: number,
  _height: number,
  data: WalletAnalysis
) {
  // Address - positioned below tagline
  ctx.fillStyle = "#fff";
  ctx.font = "14px Grotesk";
  ctx.textAlign = "center";
  const shortAddress = `${data.address.slice(0, 4)}...${data.address.slice(
    -3
  )}`;
  ctx.fillText(shortAddress, width / 3, 195, 90);

  // Stats Section - Right side positioning to match template

  // Era Joined
  const getEraLabel = (firstTransactionDate: string | null): string => {
    if (!firstTransactionDate) return "Unknown";
    const year = new Date(firstTransactionDate).getFullYear();
    if (year <= 2021) return "EARLY-OG";
    if (year === 2022) return "SURVIVOR";
    if (year === 2023) return "SEASONED";
    if (year === 2024) return "LEARNER";
    if (year === 2025) return "NUB 2025";
    return "FRESHER";
  };

  drawStatItem(
    ctx,
    375,
    220,
    getEraLabel(data.ogStatus.firstTransactionDate),
    "#6B8AFF"
  );

  // Last Seen
  drawStatItem(
    ctx,
    375,
    282,
    data.lastSeen.daysSinceLast !== null
      ? data.lastSeen.daysSinceLast === 0
        ? "ACTIVE TODAY"
        : `${data.lastSeen.daysSinceLast}d ago`
      : "Unknown",
    "#6B8AFF"
  );

  // Archetype
  drawStatItem(ctx, 220, 360, data.whaleStatus.tier.toUpperCase(), "#fff");

  // Top Bags
  drawStatItem(
    ctx,
    225,
    420,
    data.topHoldings.length > 0 ? `$${data.topHoldings[0].symbol} ` : "None",
    "#6B8AFF"
  );

  // Ecosystem Depth
  drawStatItem(
    ctx,
    230,
    480,
    data.topEcosystems.length > 0
      ? data.topEcosystems
          .slice(0, 1)
          .map((e) => e.name.toUpperCase())
          .join(" + ")
      : "None",
    "#6B8AFF"
  );
}

function drawStatItem(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  value: string,
  _accentColor: string
) {
  // Label in accent color
  ctx.font = "11px Grotesk";
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px Grotesk";
  ctx.fillText(value, x, y + 25);
}
