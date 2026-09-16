import hashlib
import io
from typing import Tuple

def calculate_sha256(content_bytes: bytes) -> Tuple[str, str]:
    """
    Computes standard SHA-256 hex string and 0x-prefixed bytes32 representation.
    """
    sha256_hash = hashlib.sha256(content_bytes).hexdigest()
    doc_hash_bytes32 = f"0x{sha256_hash}"
    return sha256_hash, doc_hash_bytes32

def extract_text_from_pdf(content_bytes: bytes, filename: str = "") -> Tuple[str, int, int]:
    """
    Extracts plain text content, page count, and total word count from PDF or plain text file.
    """
    extracted_text = ""
    page_count = 1

    # Check if file is raw plain text or markdown fallback
    if filename.endswith(".txt") or filename.endswith(".md"):
        try:
            extracted_text = content_bytes.decode("utf-8")
            words = extracted_text.split()
            return extracted_text, 1, len(words)
        except Exception:
            pass

    # Try pdfplumber first
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(content_bytes)) as pdf:
            page_count = len(pdf.pages)
            pages_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
            extracted_text = "\n\n".join(pages_text)
    except Exception:
        # Fallback to PyPDF2
        try:
            import PyPDF2
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content_bytes))
            page_count = len(pdf_reader.pages)
            pages_text = []
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
            extracted_text = "\n\n".join(pages_text)
        except Exception:
            # If parsing binary fails, attempt text decode fallback
            extracted_text = content_bytes.decode("utf-8", errors="ignore")

    words = extracted_text.split()
    return extracted_text, max(page_count, 1), len(words)
