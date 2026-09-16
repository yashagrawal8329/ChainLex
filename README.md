# ChainLex 🛡️⚖️

**ChainLex** is a full-stack legal technology application that combines AI contract analysis, PDF parsing, and Ethereum blockchain hash anchoring to verify the authenticity and risk profile of legal documents.

---

## Features

- 🧠 **AI Legal Clause Risk Analysis**: Scans contracts for critical provisions (Indemnity, Liability Caps, Termination, Non-Compete, Governing Law) and calculates an overall Risk Score Index with actionable redlines.
- 🔐 **Cryptographic SHA-256 Fingerprinting**: Computes 256-bit cryptographic digest of contract files directly in the browser and backend.
- ⛓️ **On-Chain Hash Anchoring**: Connects via Web3 (MetaMask / Ethers.js) to anchor document hashes and metadata on an Ethereum Solidity smart contract (`ChainLexRegistry.sol`).
- 🔎 **Tamper-Proof Verification Panel**: Allows users to upload any contract PDF or paste a SHA-256 hash to instantly verify proof of existence and check if contract content has been modified.
- 🎨 **Modern Glassmorphic Dashboard**: Next.js 14 frontend built with Tailwind CSS, custom dark mode aesthetic, micro-animations, and responsive layout.

---

## Monorepo Architecture

```
ChainLex/
├── hardhat/                # Hardhat Solidity smart contract project
│   ├── contracts/
│   │   └── ChainLexRegistry.sol   # On-chain contract registry
│   ├── scripts/
│   │   └── deploy.ts              # Deployment script
│   └── test/
│       └── ChainLexRegistry.test.ts # Hardhat unit tests (6 passing tests)
├── backend/                # Python FastAPI API server for AI & PDF parsing
│   ├── app/
│   │   ├── main.py                # FastAPI routes & CORS setup
│   │   ├── pdf_parser.py          # PDF text extraction & SHA-256 calculation
│   │   ├── clause_analyzer.py     # Legal NLP risk engine & redline generator
│   │   └── schemas.py             # Pydantic data schemas
│   └── requirements.txt
└── frontend/               # Next.js 14 Web3 frontend dashboard
    ├── src/
    │   ├── app/                   # App Router (page, layout, globals.css)
    │   ├── components/            # Upload, Analysis Dashboard, Verification Panel, Navbar
    │   ├── lib/                   # Web3 contract interactions & SHA-256 helpers
    │   └── types/                 # TypeScript interfaces
    └── package.json
```

---

## Quick Start Guide

### 1. Smart Contract (Hardhat)
```bash
cd hardhat

# Install dependencies & run test suite
npm install
npx hardhat test

# Run local Hardhat blockchain node & deploy contract
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

### 2. Backend API (FastAPI)
```bash
cd backend

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI dev server on http://localhost:8000
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Dashboard (Next.js)
```bash
cd frontend

# Install dependencies & start dev server
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

---

## Verification & Testing Status

- **Smart Contract**: 6/6 unit tests passing (`ChainLexRegistry.test.ts`).
- **Backend API**: Python SHA-256 checksum calculator and legal NLP clause analyzer verified.
- **Frontend Dashboard**: Web3 wallet connector, drag-and-drop uploader, AI report view, and on-chain verification panel configured.
