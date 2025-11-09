# Solana Card - Wallet Profile Generator

A beautiful web application that generates shareable profile cards for Solana wallets, displaying key metrics like OG status, whale tier, holdings, and ecosystem interactions.

![Solana Card](https://img.shields.io/badge/Solana-Card-blueviolet)

## Features

- **OG Status**: Shows how long the wallet has been active on Solana
- **Last Seen**: Displays the most recent transaction date
- **Whale Status**: Categorizes wallets into tiers (Kraken, Whale, Shark, Dolphin, Fish) based on SOL balance
- **Top Holdings**: Lists the wallet's main token holdings
- **Ecosystem Interactions**: Shows the top 2 ecosystems the wallet has interacted with in the last 30 days
- **Canvas Generation**: Creates a beautiful, downloadable image card
- **Dark Theme**: Modern, eye-friendly dark UI

## Tech Stack

### Backend
- Express.js with TypeScript
- Helius API for Solana blockchain data
- CORS enabled for cross-origin requests

### Frontend
- Vite + React + TypeScript
- HTML5 Canvas for image generation
- Axios for API communication
- Custom dark theme CSS

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Helius API key (get one at [helius.dev](https://helius.dev))

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Solanacard
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env` and add your Helius API key:

```env
HELIUS_API_KEY=your_helius_api_key_here
PORT=3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

You need to run both the backend and frontend servers.

### Start the Backend

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000`

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter a Solana wallet address in the input field
3. Click "Generate Card" or press Enter
4. Wait for the analysis to complete
5. View your generated wallet card
6. Click "Download Card" to save the image

## API Endpoints

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "Solana Card API is running"
}
```

### `GET /api/analyze/:address`
Analyze a Solana wallet address

**Parameters:**
- `address` - Solana wallet address (32-44 characters)

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "...",
    "ogStatus": {
      "firstTransactionDate": "2021-03-15T10:30:00.000Z",
      "daysSinceFirst": 1335
    },
    "lastSeen": {
      "lastTransactionDate": "2024-11-09T08:15:00.000Z",
      "daysSinceLast": 0
    },
    "whaleStatus": {
      "tier": "Whale",
      "solBalance": 12500.5
    },
    "topHoldings": [...],
    "topEcosystems": [...]
  }
}
```

## Whale Tier Thresholds

- **Kraken**: ≥ 100,000 SOL
- **Whale**: ≥ 10,000 SOL
- **Shark**: ≥ 1,000 SOL
- **Dolphin**: ≥ 100 SOL
- **Fish**: < 100 SOL

## Supported Ecosystems

The app tracks interactions with major Solana ecosystems:

- **DeFi**: Jupiter, Orca, Raydium, Marinade, Solend
- **NFT**: Magic Eden, Solanart, Metaplex, Candy Machine
- **Gaming**: Star Atlas, Genopets, Aurory
- **Lending**: Solend, Port Finance, Jet Protocol
- **Social**: Dialect, SNS, Bonfida
- **Staking**: Marinade, Lido, Jito

## Project Structure

```
Solanacard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── ecosystems.ts       # Ecosystem definitions
│   │   ├── services/
│   │   │   └── helius.service.ts   # Helius API integration
│   │   └── index.ts                # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── WalletCard.tsx      # Canvas card generator
│   │   ├── App.tsx                 # Main app component
│   │   ├── App.css                 # Dark theme styles
│   │   ├── main.tsx                # Entry point
│   │   └── types.ts                # TypeScript types
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

The built files will be in `frontend/dist/`

## Environment Variables

### Backend `.env`

```env
HELIUS_API_KEY=your_helius_api_key_here
PORT=3000
```

## Troubleshooting

### Issue: "HELIUS_API_KEY is not set"
- Make sure you've created a `.env` file in the `backend` directory
- Ensure your Helius API key is correctly set

### Issue: "Failed to analyze wallet"
- Check if the wallet address is valid
- Verify your Helius API key has sufficient quota
- Check the backend console for detailed error messages

### Issue: Canvas not displaying
- Ensure your browser supports HTML5 Canvas
- Check the browser console for JavaScript errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- [Helius](https://helius.dev) for providing the Solana API
- [Solana](https://solana.com) blockchain
- The amazing Solana community

## Future Enhancements

- [ ] Add USD values for token holdings (integrate price API)
- [ ] Support for NFT display
- [ ] Historical wallet activity graphs
- [ ] Social sharing integration
- [ ] Multiple card themes
- [ ] Batch processing for multiple wallets
- [ ] Caching layer for frequently queried addresses

## Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for the Solana community
