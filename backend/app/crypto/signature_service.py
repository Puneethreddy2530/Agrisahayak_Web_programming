"""
Signature Service - Signs predictions and stores in Supabase
"""

import logging
from typing import Dict
from starlette.concurrency import run_in_threadpool
from app.crypto.pq_signer import sign_prediction, get_public_key, verify_signature as crypto_verify
from app.storage.supabase_client import store_signature

logger = logging.getLogger(__name__)


async def sign_and_store(
    entity_type: str,
    entity_id: str,
    data: Dict
) -> Dict:
    """
    Sign prediction data and store signature in Supabase
    
    Args:
        entity_type: 'disease', 'crop', 'yield'
        entity_id: Unique ID for this prediction
        data: Prediction data to sign
    
    Returns:
        Signature metadata
    """
    
    # Generate signature (blocking I/O — run off event loop)
    sig_metadata = await run_in_threadpool(sign_prediction, entity_type, entity_id, data)
    
    # Store in Supabase
    try:
        await store_signature(
            entity_type=entity_type,
            entity_id=entity_id,
            signature=sig_metadata["signature"],
            public_key=sig_metadata["public_key"],
            data_hash=sig_metadata["data_hash"]
        )
        logger.info(f"Signature stored for {entity_type}:{entity_id}")
    except Exception as e:
        logger.error(f"Failed to store signature: {e}")
        # Don't fail the prediction if signature storage fails
    
    return sig_metadata


async def verify_stored_signature(
    entity_type: str,
    entity_id: str,
    original_data: Dict = None
) -> bool:
    """
    Verify a signature from Supabase storage by performing
    real cryptographic verification — not just existence check.
    
    Args:
        entity_type: 'disease', 'crop', 'yield'
        entity_id: Unique ID for the prediction
        original_data: The original prediction data to verify against.
                       If None, only checks signature existence.
    
    Returns:
        True if signature is valid (or exists when no data provided)
    """
    from app.storage.supabase_client import verify_signature as get_stored_sig
    
    # Fetch signature record from Supabase
    sig_record = await get_stored_sig(entity_type, entity_id)
    
    if not sig_record:
        logger.warning(f"No signature found for {entity_type}:{entity_id}")
        return False
    
    # If original data provided, perform real cryptographic verification
    if original_data is not None:
        # Rebuild the same payload that was signed
        payload = {
            "type": entity_type,
            "id": entity_id,
            "data": original_data,
            "timestamp": sig_record.get("created_at", "")
        }
        
        is_valid = await run_in_threadpool(
            crypto_verify,
            payload,
            sig_record["signature"],
            sig_record.get("public_key")
        )
        
        if not is_valid:
            logger.warning(f"Signature verification FAILED for {entity_type}:{entity_id}")
        else:
            logger.debug(f"Signature verified for {entity_type}:{entity_id}")
        
        return is_valid
    
    # No original data — existence check only (log it)
    logger.debug(f"Signature exists for {entity_type}:{entity_id} (no data provided for full verification)")
    return True
