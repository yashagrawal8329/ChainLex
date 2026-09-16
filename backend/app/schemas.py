from typing import List, Optional
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
