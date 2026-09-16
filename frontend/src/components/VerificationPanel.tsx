"use client";

import React, { useState, useEffect } from "react";
import { Search, ShieldCheck, ShieldAlert, FileText, CheckCircle2, AlertTriangle, Hash, Calendar, User, ExternalLink } from "lucide-react";
import { calculateBrowserSHA256, verifyOnChain } from "@/lib/web3";
import { OnChainVerificationResult } from "@/types";

interface VerificationPanelProps {
  initialHash?: string;
}

export default function VerificationPanel({ initialHash }: VerificationPanelProps) {
  const [inputHash, setInputHash] = useState(initialHash || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<OnChainVerificationResult | null>(null);
  const [searchedHash, setSearchedHash] = useState<string | null>(null);

  useEffect(() => {
    if (initialHash) {
      handleVerifyHash(initialHash);
    }
  }, [initialHash]);

  const handleVerifyHash = async (hashToTest: string) => {
    if (!hashToTest || hashToTest.trim().length === 0) return;

    setIsVerifying(true);
    const cleanedHash = hashToTest.trim().toLowerCase();
    const docHashBytes32 = cleanedHash.startsWith("0x") ? cleanedHash : `0x${cleanedHash}`;
    setSearchedHash(cleanedHash);

    try {
      const res = await verifyOnChain(docHashBytes32);
      setResult(res);
    } catch (err) {
      console.error("Error verifying document on-chain:", err);
      setResult({
        exists: false,
        owner: "",
        timestamp: 0,
        title: "",
        metadataURI: "",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const { hashHex } = await calculateBrowserSHA256(file);
      setInputHash(hashHex);
      handleVerifyHash(hashHex);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-950/60 border border-teal-800/60 text-teal-300 text-xs font-semibold px-4 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Ethereum Blockchain Proof of Existence</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">On-Chain Legal Contract Verification</h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Verify tamper-proof contract authenticity against the immutable Ethereum blockchain registry. Upload any PDF file or paste its SHA-256 hash.
        </p>
      </div>

      {/* Input & Search Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-glass space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Hash className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputHash}
              onChange={(e) => setInputHash(e.target.value)}
              placeholder="Paste SHA-256 contract hash (e.g., e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition"
            />
          </div>
          <button
            onClick={() => handleVerifyHash(inputHash)}
            disabled={isVerifying || !inputHash}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold px-7 py-3.5 rounded-2xl transition shadow-glow disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{isVerifying ? "Verifying..." : "Verify Hash"}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2 text-xs text-slate-400">
          <span>Or upload file to compute hash:</span>
          <label className="cursor-pointer text-teal-400 hover:underline font-semibold flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Browse PDF File</span>
            <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Verification Result Display */}
      {result && (
        <div className="animate-fadeIn space-y-6">
          {result.exists ? (
            <div className="rounded-3xl bg-slate-900/90 border border-emerald-500/40 p-8 backdrop-blur-xl shadow-glow space-y-6">
              <div className="flex items-start justify-between border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-glow">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full">
                      Authentic & Verified On-Chain
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-2">{result.title || "Legal Contract"}</h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                  <User className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Anchored By Address</p>
                    <p className="text-xs font-mono text-cyan-300 truncate max-w-[240px]">{result.owner}</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Block Timestamp</p>
                    <p className="text-xs font-mono text-white">
                      {new Date(result.timestamp * 1000).toUTCString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Hash className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-cyan-300 truncate max-w-md">{searchedHash}</span>
                </div>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span>Match Confirmed</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-900/90 border border-rose-500/40 p-8 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded-full">
                    Document Not Found / Unverified
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">No Matching On-Chain Record</h3>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-18">
                The computed SHA-256 hash <code className="text-rose-300 font-mono text-xs">{searchedHash}</code> was not found on the smart contract registry. This contract has either not been anchored on-chain yet, or its file contents have been altered.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
