from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.pdf_parser import calculate_sha256, extract_text_from_pdf
from app.clause_analyzer import analyze_contract_text
from app.schemas import ContractAnalysisResponse

app = FastAPI(
    title="ChainLex AI Legal API",
    description="Backend API for parsing PDF legal contracts, computing SHA-256 checksums, and performing AI clause risk analysis.",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ChainLex Legal API",
        "version": "1.0.0"
    }

@app.post("/api/contracts/analyze", response_model=ContractAnalysisResponse)
async def analyze_contract(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")

    try:
        content = await file.read()
        if not content or len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        filename = file.filename or "contract.pdf"
        file_size = len(content)

        # 1. Compute SHA-256 hash
        sha256_hash, doc_hash_bytes32 = calculate_sha256(content)

        # 2. Extract text & stats
        extracted_text, page_count, word_count = extract_text_from_pdf(content, filename)

        # 3. Analyze clauses & calculate risk score
        metadata, clauses, overall_score, risk_level, summary, suggested_action = analyze_contract_text(
            extracted_text, filename
        )

        return ContractAnalysisResponse(
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
            suggested_action=suggested_action
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process contract: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
