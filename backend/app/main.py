from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.clause_analyzer import analyze_contract_text
from app.config import CHAIN_ID, CONTRACT_ADDRESS, NETWORK_NAME, RPC_URL
from app.pdf_parser import calculate_sha256, extract_text_from_pdf
from app.schemas import (
    AnchorRequest,
    AnchorResponse,
    ChainConfigResponse,
    ContractAnalysisResponse,
)
from app.supabase_client import (
    get_contract_by_hash,
    list_contracts,
    mark_anchored,
    supabase_ready,
    upsert_contract,
)

app = FastAPI(
    title="ChainLex AI Legal API",
    description="Backend API for parsing PDF legal contracts, computing SHA-256 checksums, and performing AI clause risk analysis.",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXPLORER_TX_BASE = {
    "sepolia": "https://sepolia.etherscan.io/tx/",
    "mainnet": "https://etherscan.io/tx/",
    "localhost": "",
    "remix-vm": "",
}


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ChainLex Legal API",
        "version": "1.1.0",
        "supabase": supabase_ready(),
        "contract_address": CONTRACT_ADDRESS or None,
        "network": NETWORK_NAME,
    }


@app.get("/api/chain/config", response_model=ChainConfigResponse)
def chain_config():
    return ChainConfigResponse(
        contract_address=CONTRACT_ADDRESS,
        rpc_url=RPC_URL,
        chain_id=CHAIN_ID,
        network_name=NETWORK_NAME,
        supabase_ready=supabase_ready(),
        explorer_tx_base=EXPLORER_TX_BASE.get(NETWORK_NAME, "https://sepolia.etherscan.io/tx/"),
    )


@app.post("/api/contracts/analyze", response_model=ContractAnalysisResponse)
async def analyze_contract(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")

    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        filename = file.filename or "contract.pdf"
        file_size = len(content)
        sha256_hash, doc_hash_bytes32 = calculate_sha256(content)
        extracted_text, page_count, word_count = extract_text_from_pdf(content, filename)
        metadata, clauses, overall_score, risk_level, summary, suggested_action = analyze_contract_text(
            extracted_text, filename
        )

        persisted = False
        existing = None
        if supabase_ready():
            existing = get_contract_by_hash(sha256_hash)
            row = {
                "filename": filename,
                "sha256_hash": sha256_hash,
                "doc_hash_bytes32": doc_hash_bytes32,
                "file_size_bytes": file_size,
                "page_count": page_count,
                "word_count": word_count,
                "title": metadata.title,
                "parties": metadata.parties,
                "governing_law": metadata.governing_law,
                "overall_risk_score": overall_score,
                "overall_risk_level": risk_level,
                "summary": summary,
                "suggested_action": suggested_action,
                "analysis": {
                    "metadata": metadata.model_dump(),
                    "clauses": [c.model_dump() for c in clauses],
                },
            }
            saved = upsert_contract(row)
            persisted = saved is not None
            if saved:
                existing = saved

        return ContractAnalysisResponse(
            id=(existing or {}).get("id") if existing else None,
            filename=filename,
            file_size_bytes=file_size,
            sha256_hash=sha256_hash,
            doc_hash_bytes32=doc_hash_bytes32,
            page_count=page_count,
            word_count=word_count,
            overall_risk_score=overall_score,
            overall_risk_level=risk_level,
            metadata=metadata,
            clauses=clauses,
            summary=summary,
            suggested_action=suggested_action,
            persisted=persisted,
            anchored=bool((existing or {}).get("anchored")),
            tx_hash=(existing or {}).get("tx_hash"),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process contract: {str(e)}")


@app.get("/api/contracts")
def contracts_index(limit: int = 50):
    if not supabase_ready():
        return {"items": [], "supabase": False}
    return {"items": list_contracts(limit), "supabase": True}


@app.get("/api/contracts/{sha256_hash}")
def contract_by_hash(sha256_hash: str):
    record = get_contract_by_hash(sha256_hash)
    if not record:
        raise HTTPException(status_code=404, detail="Contract hash not found in Supabase")
    return record


@app.post("/api/contracts/anchor", response_model=AnchorResponse)
def persist_anchor(body: AnchorRequest):
    cleaned = body.sha256_hash.lower().replace("0x", "")
    payload = {
        "sha256_hash": cleaned,
        "doc_hash_bytes32": body.doc_hash_bytes32 or f"0x{cleaned}",
        "tx_hash": body.tx_hash,
        "wallet_address": body.wallet_address,
        "contract_address": body.contract_address or CONTRACT_ADDRESS,
        "chain_id": body.chain_id or CHAIN_ID,
        "network": body.network or NETWORK_NAME,
        "filename": body.filename,
        "title": body.title,
    }
    record = mark_anchored(cleaned, payload) if supabase_ready() else None
    return AnchorResponse(
        ok=True,
        sha256_hash=cleaned,
        tx_hash=body.tx_hash,
        persisted=record is not None,
        record=record,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
