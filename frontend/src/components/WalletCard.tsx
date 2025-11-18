import { useEffect, useRef } from 'react';
import { WalletAnalysis } from '../types';
import BlankImage from '../assets/Blank.png';
import Pers1 from '../assets/Pers1.png';
import pers2 from '../assets/pers2.png';
import pers3 from '../assets/pers3.png';
import pers4 from '../assets/pers4.png';
import pers5 from '../assets/pers5.png';
import pers6 from '../assets/pers6.png';
import pers7 from '../assets/pers7.png';
import pers8 from '../assets/pers8.png';
import pers9 from '../assets/pers9.png';

const persImages = [Pers1, pers2, pers3, pers4, pers5, pers6, pers7, pers8, pers9];

interface WalletCardProps {
  data: WalletAnalysis;
}

export function WalletCard({ data }: WalletCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCard(canvasRef.current, data);
    }
  }, [data]);

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `solana-card-${data.address.slice(0, 8)}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div>
      <div className="canvas-container">
        <canvas ref={canvasRef} width={540} height={630} />
      </div>
      <button className="btn download-btn" onClick={downloadImage}>
        Download Card
      </button>
    </div>
  );
}

function drawCard(canvas: HTMLCanvasElement, data: WalletAnalysis) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Select a random pers image
  const randomPersImage = persImages[Math.floor(Math.random() * persImages.length)];

  // Load and draw background image
  const bgImage = new Image();
  bgImage.src = BlankImage;
  bgImage.onload = () => {
    // Draw the background image
    ctx.drawImage(bgImage, 0, 0, width, height);

    // Load and draw the pers image
    const persImg = new Image();
    persImg.src = randomPersImage;
    persImg.onload = () => {
      // Draw pers image centered below the header
      const persSize = 100; // Size of the pers image
      const persX = (width - persSize) / 2;
      const persY = 160; // Position below the address
      ctx.drawImage(persImg, persX, persY, persSize, persSize);

      // Continue with the rest of the drawing
      drawCardContent(ctx, width, height, data);
    };
  };
}

function drawCardContent(ctx: CanvasRenderingContext2D, width: number, height: number, data: WalletAnalysis) {

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('SolPack', width / 2, 120);
  ctx.textAlign = 'center';

  // Address
  ctx.fillStyle = '#a0a0b0';
  ctx.font = '12px monospace';
  const shortAddress = `${data.address.slice(0, 6)}...${data.address.slice(-6)}`;
  ctx.fillText(shortAddress, width / 2, 145);
  ctx.textAlign = 'left';

  // Stats Section - Positioned to match the template layout

  // OG Status (ERA JOINED)
  const getEraLabel = (firstTransactionDate: string | null): string => {
    if (!firstTransactionDate) return 'Unknown';

    const year = new Date(firstTransactionDate).getFullYear();

    if (year <= 2021) return 'EARLY-OG';
    if (year === 2022) return 'SURVIVOR';
    if (year === 2023) return 'SEASONED';
    if (year === 2024) return 'LEARNER';
    if (year === 2025) return 'NEWBIE';
    return 'FRESHER'; // 2026 or later
  };

  drawStatBox(ctx, 40, 280, 180, 60, 'ERA JOINED',
    getEraLabel(data.ogStatus.firstTransactionDate),
    '#14f195'
  );

  // Last Seen
  drawStatBox(ctx, 310, 280, 180, 60, 'LAST SEEN',
    data.lastSeen.daysSinceLast !== null
      ? data.lastSeen.daysSinceLast === 0
        ? 'Today'
        : `${data.lastSeen.daysSinceLast}d ago`
      : 'Unknown',
    '#14f195'
  );

  // Archetype (Whale Status)
  drawStatBox(ctx, 40, 350, 180, 60, 'ARCHETYPE',
    data.whaleStatus.tier,
    '#14f195'
  );

  // Top Holdings (TOP BAGS)
  drawStatBox(ctx, 40, 420, 180, 60, 'TOP BAGS',
    data.topHoldings.length > 0
      ? `${data.topHoldings[0].name}\n${data.topHoldings[0].symbol}`
      : 'None',
    '#14f195'
  );

  // Top Ecosystems (ECOSYSTEM DEPTH)
  drawStatBox(ctx, 40, 490, 180, 60, 'ECOSYSTEM DEPTH',
    data.topEcosystems.length > 0
      ? data.topEcosystems[0].name
      : 'None',
    '#14f195'
  );

  // Footer
  ctx.fillStyle = '#14f195';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Every wallet has a personality.', width / 2, height - 50);
  ctx.fillText('Check yours at level3labs.fun', width / 2, height - 35);
  ctx.textAlign = 'left';
}

function drawStatBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  value: string,
  accentColor: string
) {
  // Label
  ctx.fillStyle = accentColor;
  ctx.font = '10px Arial';
  ctx.fillText(label, x, y);

  // Value
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';

  const lines = value.split('\n');
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + 20 + (index * 16));
  });
}
