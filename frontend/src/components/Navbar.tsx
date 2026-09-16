"use client";

import React from "react";
import { ShieldCheck, FileSearch, Anchor } from "lucide-react";
import WalletConnect from "./WalletConnect";

interface NavbarProps {
  activeTab: "analyze" | "verify";
  setActiveTab: (tab: "analyze" | "verify") => void;
  onAccountChange?: (account: string | null) => void;
}

export default function Navbar({ activeTab, setActiveTab, onAccountChange }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Header */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("analyze")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-glow">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-teal-300">
                ChainLex
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-teal-950 text-teal-400 border border-teal-800/60 px-2 py-0.5 rounded-full">
                v1.0 Legal AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Verifiable Smart Legal Contracts</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 p-1.5 rounded-full">
          <button
            onClick={() => setActiveTab("analyze")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === "analyze"
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>Contract AI Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === "verify"
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Anchor className="w-4 h-4" />
            <span>On-Chain Verification</span>
          </button>
        </div>

        {/* Web3 Wallet Connect */}
        <WalletConnect onAccountChange={onAccountChange} />
      </div>
    </nav>
  );
}
