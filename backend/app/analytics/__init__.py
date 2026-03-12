"""
AgriSahayak Analytics Module
DuckDB-powered high-performance analytics
"""

from .duckdb_engine import (
    get_duckdb,
    init_duckdb,
    sync_disease_data,
    get_disease_heatmap,
    get_disease_trends,
    get_district_health_score,
    run_stress_test
)

__all__ = [
    "get_duckdb",
    "init_duckdb",
    "sync_disease_data",
    "get_disease_heatmap",
    "get_disease_trends",
    "get_district_health_score",
    "run_stress_test"
]
