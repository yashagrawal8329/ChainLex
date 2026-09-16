export interface ClauseAnalysis {
  clause_type: string;
  text: string;
  risk_level: "HIGH" | "MEDIUM" | "LOW";
  explanation: string;
  recommendation: string;
}

export interface ContractMetadata {
  title: string;
  parties: string[];
  effective_date?: string;
  governing_law?: string;
  total_value?: string;
}

export interface ContractAnalysisResponse {
  filename: string;
  file_size_bytes: number;
  sha256_hash: string;
  doc_hash_bytes32: string;
  page_count: number;
  word_count: number;
  overall_risk_score: number;
  overall_risk_level: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  metadata: ContractMetadata;
  clauses: ClauseAnalysis[];
  summary: string;
  suggested_action: string;
}

export interface OnChainVerificationResult {
  exists: boolean;
  owner: string;
  timestamp: number;
  title: string;
  metadataURI: string;
  isMatch?: boolean;
}
