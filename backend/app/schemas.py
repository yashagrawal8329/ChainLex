from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ClauseAnalysis(BaseModel):
    clause_type: str = Field(..., description="Category of clause e.g. Indemnity, Liability")
    text: str = Field(..., description="Extract snippet from contract")
    risk_level: str = Field(..., description="HIGH, MEDIUM, or LOW")
    explanation: str = Field(..., description="Explanation of identified risk")
    recommendation: str = Field(..., description="Suggested redline or recommendation")


class ContractMetadata(BaseModel):
    title: str = Field(default="Legal Agreement")
    parties: List[str] = Field(default_factory=list)
    effective_date: Optional[str] = None
    governing_law: Optional[str] = None
    total_value: Optional[str] = None


class ContractAnalysisResponse(BaseModel):
    id: Optional[str] = None
    filename: str
    file_size_bytes: int
    sha256_hash: str
    doc_hash_bytes32: str
    page_count: int
    word_count: int
    overall_risk_score: int
    overall_risk_level: str
    metadata: ContractMetadata
    clauses: List[ClauseAnalysis]
    summary: str
    suggested_action: str
    persisted: bool = False
    anchored: bool = False
    tx_hash: Optional[str] = None


class AnchorRequest(BaseModel):
    sha256_hash: str
    doc_hash_bytes32: Optional[str] = None
    tx_hash: str
    wallet_address: Optional[str] = None
    contract_address: Optional[str] = None
    chain_id: Optional[int] = None
    network: Optional[str] = None
    filename: Optional[str] = None
    title: Optional[str] = None


class AnchorResponse(BaseModel):
    ok: bool
    sha256_hash: str
    tx_hash: str
    persisted: bool
    record: Optional[Dict[str, Any]] = None


class ChainConfigResponse(BaseModel):
    contract_address: str
    rpc_url: str
    chain_id: int
    network_name: str
    supabase_ready: bool
    explorer_tx_base: str
    remix_url: str = "https://remix.ethereum.org"
