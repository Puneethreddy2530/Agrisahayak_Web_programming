"""
Storage module - Local SQLite storage
"""

from .supabase_client import (
    init_local_storage,
    close_local_storage,
    init_supabase,
    get_supabase,
    create_disease_alert,
    get_recent_alerts,
    save_chat,
    get_chat_history,
    upload_disease_image,
    store_signature,
    verify_signature,
    get_cached_analytics,
    cache_analytics
)

__all__ = [
    'init_local_storage',
    'close_local_storage',
    'init_supabase',
    'get_supabase',
    'create_disease_alert',
    'get_recent_alerts',
    'save_chat',
    'get_chat_history',
    'upload_disease_image',
    'store_signature',
    'verify_signature',
    'get_cached_analytics',
    'cache_analytics'
]
