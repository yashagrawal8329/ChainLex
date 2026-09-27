from typing import Any, Dict, List, Optional

from app.config import SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL

_client = None


def get_supabase():
    global _client
    if _client is not None:
        return _client
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        return None
    from supabase import create_client

    _client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _client


def supabase_ready() -> bool:
    return get_supabase() is not None


def upsert_contract(row: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    client = get_supabase()
    if client is None:
        return None
    result = client.table("contracts").upsert(row, on_conflict="sha256_hash").execute()
    return result.data[0] if result.data else None


def get_contract_by_hash(sha256_hash: str) -> Optional[Dict[str, Any]]:
    client = get_supabase()
    if client is None:
        return None
    cleaned = sha256_hash.lower().replace("0x", "")
    result = (
        client.table("contracts")
        .select("*")
        .eq("sha256_hash", cleaned)
        .limit(1)
        .execute()
    )
    return result.data[0] if result.data else None


def list_contracts(limit: int = 50) -> List[Dict[str, Any]]:
    client = get_supabase()
    if client is None:
        return []
    result = (
        client.table("contracts")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data or []


def mark_anchored(sha256_hash: str, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    client = get_supabase()
    if client is None:
        return None
    cleaned = sha256_hash.lower().replace("0x", "")
    existing = get_contract_by_hash(cleaned)
    update_row = {
        "anchored": True,
        "tx_hash": payload.get("tx_hash"),
        "wallet_address": payload.get("wallet_address"),
        "contract_address": payload.get("contract_address"),
        "chain_id": payload.get("chain_id"),
    }
    if existing:
        client.table("contracts").update(update_row).eq("id", existing["id"]).execute()
        client.table("anchors").insert(
            {
                "contract_id": existing["id"],
                "sha256_hash": cleaned,
                "tx_hash": payload.get("tx_hash"),
                "wallet_address": payload.get("wallet_address"),
                "contract_address": payload.get("contract_address"),
                "chain_id": payload.get("chain_id"),
                "network": payload.get("network"),
            }
        ).execute()
        return {**existing, **update_row}
    inserted = upsert_contract(
        {
            "filename": payload.get("filename") or "unknown",
            "sha256_hash": cleaned,
            "doc_hash_bytes32": payload.get("doc_hash_bytes32") or f"0x{cleaned}",
            **update_row,
        }
    )
    if inserted:
        client.table("anchors").insert(
            {
                "contract_id": inserted["id"],
                "sha256_hash": cleaned,
                "tx_hash": payload.get("tx_hash"),
                "wallet_address": payload.get("wallet_address"),
                "contract_address": payload.get("contract_address"),
                "chain_id": payload.get("chain_id"),
                "network": payload.get("network"),
            }
        ).execute()
    return inserted
