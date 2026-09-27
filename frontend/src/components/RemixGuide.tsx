"use client";

import React, { useState } from "react";
import { Blocks, Copy, Check, ExternalLink } from "lucide-react";

const STEPS = [
  {
    title: "Open Remix IDE",
    body: "Go to https://remix.ethereum.org — no install, no API key.",
  },
  {
    title: "Create the contract file",
    body: "In File Explorer create contracts/ChainLexRegistry.sol and paste the Solidity source from hardhat/contracts/ChainLexRegistry.sol.",
  },
  {
    title: "Compile",
    body: "Open Solidity Compiler, set compiler to 0.8.24, then click Compile ChainLexRegistry.sol.",
  },
  {
    title: "Connect MetaMask",
    body: "In Deploy & Run Transactions set Environment to Injected Provider - MetaMask. Switch MetaMask to Sepolia.",
  },
  {
    title: "Get free Sepolia ETH",
    body: "Use a free faucet such as https://sepoliafaucet.com then confirm Deploy in MetaMask.",
  },
  {
    title: "Copy the address",
    body: "After success, copy the deployed contract address from Remix Deployed Contracts and send it so backend CONTRACT_ADDRESS can be set.",
  },
];

export default function RemixGuide() {
  const [copied, setCopied] = useState(false);

  const copyPath = async () => {
    await navigator.clipboard.writeText("hardhat/contracts/ChainLexRegistry.sol");
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300">
            <Blocks className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Remix IDE deploy process</h2>
            <p className="text-xs text-slate-400">Free public Sepolia RPC. No Infura or Alchemy key required.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyPath}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy contract path</span>
          </button>
          <a
            href="https://remix.ethereum.org"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-teal-500 text-slate-950 flex items-center gap-1.5"
          >
            <span>Open Remix</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {STEPS.map((step, idx) => (
          <li key={step.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-1">Step {idx + 1}</p>
            <p className="text-sm font-semibold text-white">{step.title}</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
