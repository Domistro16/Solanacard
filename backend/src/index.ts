import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { HeliusService } from './services/helius.service';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

if (!HELIUS_API_KEY) {
  console.error('Error: HELIUS_API_KEY is not set in environment variables');
  process.exit(1);
}

// Initialize Helius service
const heliusService = new HeliusService(HELIUS_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Solana Card API is running' });
});

// Main endpoint to analyze a wallet
app.get('/api/analyze/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    // Basic validation for Solana address (32-44 characters, base58)
    if (!address || address.length < 32 || address.length > 44) {
      return res.status(400).json({
        error: 'Invalid Solana address',
        message: 'Please provide a valid Solana wallet address',
      });
    }

    console.log(`Analyzing wallet: ${address}`);

    // Get wallet analysis
    const analysis = await heliusService.analyzeWallet(address);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    console.error('Error analyzing wallet:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'Failed to analyze wallet',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/analyze/:address`);
});
