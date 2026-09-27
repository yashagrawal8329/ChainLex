import { ContractAnalysisResponse } from "@/types";

export interface ChainConfig {
  contract_address: string;
  rpc_url: string;
  chain_id: number;
  network_name: string;
  supabase_ready: boolean;
  explorer_tx_base: string;
  remix_url: string;
}

export async function fetchChainConfig(): Promise<ChainConfig | null> {
  try {
    const res = await fetch("/api/chain/config");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function persistAnchor(payload: {
  sha256_hash: string;
  doc_hash_bytes32?: string;
  tx_hash: string;
  wallet_address?: string | null;
  contract_address?: string;
  chain_id?: number;
  network?: string;
  filename?: string;
  title?: string;
}) {
  const res = await fetch("/api/contracts/anchor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to persist anchor to Supabase");
  }
  return res.json();
}

export async function analyzeContractFile(file: File): Promise<ContractAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/contracts/analyze", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Backend API returned error code ${response.status}`);
  }
  return response.json();
}
