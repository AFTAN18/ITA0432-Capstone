from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db

router = APIRouter()

@router.get("/")
async def get_kpis(db=Depends(get_db)):
    """Returns Top Level Analytical Definitions mapping against Supabase"""
    res = db.table('dashboard_kpis').select('*').limit(1).execute()
    
    if len(res.data) == 0:
        return {"total_districts": 0, "total_children": 0, "overall_stunting_pct": 0, "overall_anemia_pct": 0, "highest_risk_district": "N/A"}
        
    kpi_data = res.data[0]
    return {
        "total_districts": kpi_data.get("total_districts"),
        "total_children": kpi_data.get("total_children"),
        "overall_stunting_pct": kpi_data.get("overall_stunting_pct"),
        "overall_anemia_pct": kpi_data.get("overall_anemia_pct"),
        "highest_risk_district": kpi_data.get("highest_risk_district")
    }
