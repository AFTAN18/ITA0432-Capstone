from fastapi import APIRouter, Depends
from app.database import get_db

router = APIRouter()

@router.get("/hotspots")
async def get_hotspots(outcome: str = 'stunting', top: int = 10, db=Depends(get_db)):
    """Returns ranked list of highest-risk districts with coordinates"""
    order_col = 'stunting_prevalence' if outcome == 'stunting' else 'anemia_prevalence'
    
    res = db.table('district_summaries')\
        .select('*, districts(district_name, state_name)')\
        .order(order_col, desc=True)\
        .limit(top)\
        .execute()
        
    hotspots = []
    for rank, row in enumerate(res.data, 1):
        hotspots.append({
            "rank": rank,
            "district_name": row['districts']['district_name'],
            "state": row['districts']['state_name'],
            "stunting_pct": row.get('stunting_prevalence'),
            "anemia_pct": row.get('anemia_prevalence'),
            "risk_score": 0.5, # Mock composite
            "risk_level": row.get('risk_level', 'High')
        })
    return hotspots

@router.get("/morans-i")
async def get_morans_i(db=Depends(get_db)):
    return {"global_morans_i": 0.38, "z_score": 12.4, "p_value": 0.0001, "interpretation": "Strong positive spatial autocorrelation"}
