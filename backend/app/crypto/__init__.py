"""
Cryptography module for ECC signatures (classical ECDSA, not post-quantum)
"""

from .pq_signer import (
    init_keypair,
    sign_data,
    verify_signature,
    sign_prediction,
    load_keypair,
    get_public_key
)
from .neoshield_pqc import NeoShieldPQC, PQSignature

__all__ = [
    'init_keypair',
    'sign_data',
    'verify_signature',
    'sign_prediction',
    'load_keypair',
    'get_public_key',
    'NeoShieldPQC',
    'PQSignature'
]
