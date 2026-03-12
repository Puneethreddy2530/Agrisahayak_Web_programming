"""
Analytics Endpoints - DuckDB powered
High-performance OLAP analytics for agricultural data
"""

from fastapi import APIRouter, Query, HTTPException, Path, Depends
from typing import Optional, List, Dict
import asyncio
from pydantic import BaseModel

from app.api.v1.endpoints.auth import get_current_user, require_role

from app.analytics.duckdb_engine import (
    init_duckdb,
    get_disease_heatmap,
    get_disease_trends,
    get_disease_by_crop,
    get_district_health_score,
    get_price_trends,
    get_market_comparison,
    get_yield_summary,
    get_seasonal_patterns,
    get_outbreak_alerts,
    sync_disease_data,
    sync_price_data,
    sync_yield_data,
    run_stress_test,
    create_sample_data
)

router = APIRouter()

# Ensure DuckDB is initialized at module load
init_duckdb()


# ==================================================
# SYNC ENDPOINTS
# ==================================================

@router.post("/sync", dependencies=[Depends(require_role("admin"))])
async def sync_analytics():
    """
    Sync data from PostgreSQL to DuckDB
    
    Run this periodically (e.g., every 6 hours)
    """
    # In production, fetch from your PostgreSQL database
    # For now, this is a placeholder
    
    return {
        "message": "Sync triggered",
        "note": "Connect to PostgreSQL to sync real data"
    }


@router.post("/sync/demo-data", dependencies=[Depends(require_role("admin"))])
async def sync_demo_data(count: int = Query(1000, le=100000)):
    """
    Generate and sync demo data for testing
    
    Creates sample disease records
    """
    try:
        # Offload heavy simulation/sync to a background thread to avoid blocking loop
        sample_data = await asyncio.to_thread(create_sample_data, count)
        synced = await asyncio.to_thread(sync_disease_data, sample_data)
        
        return {
            "message": f"Generated and synced {synced} demo records",
            "count": synced
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/sync/reset", dependencies=[Depends(require_role("admin"))])
async def reset_demo_data():
    """
    Reset/clear all demo data from analytics
    
    Removes all disease records from DuckDB
    """
    try:
        from app.analytics.duckdb_engine import get_duckdb
        conn = get_duckdb()
        
        # Get count before reset
        count_before = conn.execute("SELECT COUNT(*) FROM disease_analytics").fetchone()[0]
        
        # Delete all records
        conn.execute("DELETE FROM disease_analytics")
        
        return {
            "message": f"Reset complete. Deleted {count_before} records.",
            "deleted_count": count_before
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================================================
# DISEASE ANALYTICS
# ==================================================

@router.get("/disease-heatmap")
async def disease_heatmap(days: int = Query(30, le=365)):
    """
    Get disease outbreak heatmap

    Returns district-wise disease concentration.
    Auto-seeds 500 demo records on first call if DuckDB is empty.
    """
    try:
        heatmap = await asyncio.to_thread(get_disease_heatmap, days)
        # Auto-seed demo data on first call so analytics are never blank
        if not heatmap:
            sample_data = await asyncio.to_thread(create_sample_data, 500)
            await asyncio.to_thread(sync_disease_data, sample_data)
            heatmap = await asyncio.to_thread(get_disease_heatmap, days)
        return {
            "period_days": days,
            "total_hotspots": len(heatmap),
            "heatmap": heatmap
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/disease-trends")
async def disease_trends(
    disease: Optional[str] = None,
    days: int = Query(90, le=365)
):
    """
    Get disease trends over time
    
    Returns weekly aggregation
    """
    try:
        trends = await asyncio.to_thread(get_disease_trends, disease, days)
        return {
            "disease": disease or "All diseases",
            "period_days": days,
            "data_points": len(trends),
            "trends": trends
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/disease-by-crop")
async def disease_by_crop(days: int = Query(30, le=365)):
    """
    Get disease distribution by crop type
    
    Shows which diseases affect which crops
    """
    try:
        data = await asyncio.to_thread(get_disease_by_crop, days)
        return {
            "period_days": days,
            "total_records": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/district-health/{district}")
async def district_health(district: str = Path(..., max_length=100)):
    """
    Get health score for a district
    
    Score: 0-100 (100 = healthy)
    """
    try:
        score = await asyncio.to_thread(get_district_health_score, district)
        return score
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/outbreak-alerts")
async def outbreak_alerts(
    threshold: int = Query(10, ge=1, le=100),
    days: int = Query(7, le=30)
):
    """
    Get potential disease outbreak alerts
    
    Detects clusters of disease cases
    """
    try:
        alerts = await asyncio.to_thread(get_outbreak_alerts, threshold, days)
        return {
            "threshold": threshold,
            "period_days": days,
            "alert_count": len(alerts),
            "alerts": alerts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/seasonal-patterns")
async def seasonal_patterns(crop: Optional[str] = None):
    """
    Analyze seasonal disease patterns
    
    Shows month-wise disease distribution
    """
    try:
        patterns = await asyncio.to_thread(get_seasonal_patterns, crop)
        return {
            "crop": crop or "All crops",
            "data_points": len(patterns),
            "patterns": patterns
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================================================
# PRICE ANALYTICS
# ==================================================

@router.get("/price-trends/{commodity}")
async def price_trends(
    commodity: str = Path(..., max_length=100),
    days: int = Query(30, le=365)
):
    """
    Get price trends for a commodity
    
    Shows daily price movements
    """
    try:
        trends = await asyncio.to_thread(get_price_trends, commodity, days)
        return {
            "commodity": commodity,
            "period_days": days,
            "data_points": len(trends),
            "trends": trends
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market-comparison/{commodity}")
async def market_comparison(commodity: str = Path(..., max_length=100)):
    """
    Compare prices across markets
    
    Find best selling locations
    """
    try:
        markets = await asyncio.to_thread(get_market_comparison, commodity)
        return {
            "commodity": commodity,
            "market_count": len(markets),
            "markets": markets
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================================================
# YIELD ANALYTICS
# ==================================================

@router.get("/yield-summary")
async def yield_summary(
    crop: Optional[str] = None,
    state: Optional[str] = None
):
    """
    Get yield prediction summary
    
    Aggregated yield statistics
    """
    try:
        summary = await asyncio.to_thread(get_yield_summary, crop, state)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================================================
# SYSTEM ENDPOINTS
# ==================================================

@router.get("/stress-test", dependencies=[Depends(require_role("admin"))])
async def analytics_stress_test():
    """
    Run DuckDB stress test
    
    Demonstrates high-performance analytics
    """
    try:
        # Run heavy stress test in a background thread
        result = await asyncio.to_thread(run_stress_test)
        return {
            "message": "Stress test complete",
            "result": result,
            "note": "Check server logs for detailed results"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def analytics_health(user=Depends(get_current_user)):
    """
    Check analytics engine health
    """
    try:
        from app.analytics.duckdb_engine import get_duckdb
        conn = get_duckdb()
        
        # Quick health check query
        result = conn.execute("SELECT 1 as health").fetchone()
        
        # Get table stats
        tables = conn.execute("""
            SELECT table_name, estimated_size 
            FROM duckdb_tables()
        """).fetchall()
        
        return {
            "status": "healthy",
            "engine": "DuckDB",
            "version": conn.execute("SELECT version()").fetchone()[0],
            "tables": [{"name": t[0], "size": t[1]} for t in tables]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
