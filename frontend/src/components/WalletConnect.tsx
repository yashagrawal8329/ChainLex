"use client";

import React, { useState, useEffect } from "react";
import { Wallet, CheckCircle2, AlertCircle } from "lucide-react";
import { ethers } from "ethers";

interface WalletConnectProps {
  onAccountChange?: (account: string | null) => void;
}

export default function WalletConnect({ onAccountChange }: WalletConnectProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkName, setNetworkName] = useState<string>("Localhost 8545");

  useEffect(() => {
    checkConnectedAccount();
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        const acc = accounts.length > 0 ? accounts[0] : null;
        setAccount(acc);
        if (onAccountChange) onAccountChange(acc);
      });
    }
  }, []);

  const checkConnectedAccount = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const acc = accounts[0].address;
          setAccount(acc);
          if (onAccountChange) onAccountChange(acc);
        }
      } catch (err) {
        console.error("Error checking wallet connection", err);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("MetaMask or Web3 Wallet not detected. Please install a Web3 wallet extension.");
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        if (onAccountChange) onAccountChange(accounts[0]);
      }
    } catch (err: any) {
      console.error("Failed to connect wallet", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-3">
      {account ? (
        <div className="flex items-center gap-2 bg-slate-900/80 border border-teal-500/30 rounded-full px-4 py-2 text-sm font-medium text-teal-300 shadow-glow">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{formatAddress(account)}</span>
          <span className="text-xs bg-teal-950 text-teal-400 border border-teal-800 rounded-md px-1.5 py-0.5 ml-1">
            {networkName}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-glow hover:shadow-cyan-500/25 active:scale-95 disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
        </button>
      )}
    </div>
  );
}
