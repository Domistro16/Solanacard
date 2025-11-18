import { useEffect, useRef } from 'react';
import { WalletAnalysis } from '../types';
import BlankImage from '../assets/Blank.png';

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

  // Load and draw background image
  const bgImage = new Image();
  bgImage.src = BlankImage;
  bgImage.onload = () => {
    // Draw the background image
    ctx.drawImage(bgImage, 0, 0, width, height);

    // Continue with the rest of the drawing
    drawCardContent(ctx, width, height, data);
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

  drawStatBox(ctx, 40, 180, 180, 60, 'ERA JOINED',
    getEraLabel(data.ogStatus.firstTransactionDate),
    '#14f195'
  );

  // Last Seen
  drawStatBox(ctx, 310, 235, 180, 60, 'LAST SEEN',
    data.lastSeen.daysSinceLast !== null
      ? data.lastSeen.daysSinceLast === 0
        ? 'Today'
        : `${data.lastSeen.daysSinceLast}d ago`
      : 'Unknown',
    '#14f195'
  );

  // Archetype (Whale Status)
  drawStatBox(ctx, 40, 300, 180, 60, 'ARCHETYPE',
    data.whaleStatus.tier,
    '#14f195'
  );

  // Top Holdings (TOP BAGS)
  drawStatBox(ctx, 40, 345, 180, 60, 'TOP BAGS',
    data.topHoldings.length > 0
      ? `${data.topHoldings[0].name}\n${data.topHoldings[0].symbol}`
      : 'None',
    '#14f195'
  );

  // Top Ecosystems (ECOSYSTEM DEPTH)
  drawStatBox(ctx, 40, 390, 180, 60, 'ECOSYSTEM DEPTH',
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
