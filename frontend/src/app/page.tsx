"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import ContractUpload from "@/components/ContractUpload";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import VerificationPanel from "@/components/VerificationPanel";
import { ContractAnalysisResponse } from "@/types";
import { Shield, Sparkles, Scale, Cpu, FileCheck } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"analyze" | "verify">("analyze");
  const [account, setAccount] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisResponse | null>(null);
  const [targetVerifyHash, setTargetVerifyHash] = useState<string>("");

  const handleAnalysisComplete = (result: ContractAnalysisResponse, file: File) => {
    setAnalysisResult(result);
  };

  const handleSwitchToVerify = (hash: string) => {
    setTargetVerifyHash(hash);
    setActiveTab("verify");
  };

  const handleResetAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] relative selection:bg-teal-500 selection:text-slate-950">
      {/* Background Decorative Lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAccountChange={(acc) => setAccount(acc)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 relative z-10 space-y-12">
        {activeTab === "analyze" ? (
          <>
            {!analysisResult ? (
              <div className="space-y-10 animate-fadeIn">
                {/* Hero Title Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-950 to-cyan-950 border border-teal-500/30 text-teal-300 text-xs font-semibold px-4 py-1.5 rounded-full shadow-glow">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>AI Legal Risk Engine & On-Chain Proof of Existence</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    Smart Legal Contract Analysis &{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-500">
                      Blockchain Verification
                    </span>
                  </h1>
                  <p className="text-base text-slate-400 leading-relaxed">
                    Upload contract PDFs to immediately extract risky clauses, calculate cryptographic SHA-256 hashes, and anchor immutable proof onto Ethereum.
                  </p>
                </div>

                {/* File Upload Component */}
                <ContractUpload onAnalysisComplete={handleAnalysisComplete} />

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">AI Clause Redlining</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Automatically detects indemnity, liability caps, non-competes, and termination penalties with actionable redlines.
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">SHA-256 Fingerprint</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Generates unique 256-bit cryptographic digest of contract bytes before any on-chain submission.
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                      <Scale className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">Ethereum Registry</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Anchors contract hash, signatory wallet address, and timestamp into Hardhat/Ethereum Solidity smart contract.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleResetAnalysis}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition"
                  >
                    <span>← Upload Another Contract</span>
                  </button>
                  <span className="text-xs text-teal-400 font-semibold bg-teal-950 border border-teal-800 px-3 py-1 rounded-full">
                    Analysis Active
                  </span>
                </div>
                <AnalysisDashboard
                  analysis={analysisResult}
                  account={account}
                  onSwitchToVerify={handleSwitchToVerify}
                />
              </div>
            )}
          </>
        ) : (
          <VerificationPanel initialHash={targetVerifyHash} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ChainLex</span>
            <span>— Full-Stack Legal Tech & Blockchain Verification Platform</span>
          </div>
          <div>
            <span>Powered by Solidity • Hardhat • FastAPI • Next.js 14</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
