from fastapi import APIRouter, HTTPException, Depends, Query
from app.database import get_db
from app.middleware.auth import verify_supabase_jwt

router = APIRouter()

@router.get("/")
async def get_children(
    district_id: str = None,
    state: str = None,
    is_stunted: bool = None,
    is_anemic: bool = None,
    wealth_quintile: int = None,
    page: int = 1,
    limit: int = 50,
    db=Depends(get_db),
    current_user=Depends(verify_supabase_jwt)
):
    """Returns paginated child records (PII-free) - Requires Auth"""
    offset = (page - 1) * limit
    
    query = db.table('children').select('child_id, age_months, sex, is_stunted, is_anemic, height_for_age_z, hemoglobin_level, households!inner(wealth_quintile, sanitation_access), districts!inner(district_name, state_name)', count='exact')
    
    if is_stunted is not None:
        query = query.eq('is_stunted', is_stunted)
    if is_anemic is not None:
        query = query.eq('is_anemic', is_anemic)
    if district_id:
        query = query.eq('district_id', district_id)
    if wealth_quintile:
        query = query.eq('households.wealth_quintile', wealth_quintile)
        
    res = query.range(offset, offset + limit - 1).execute()
    
    return {
        "data": res.data,
        "page": page,
        "total": res.count
    }

@router.get("/export")
async def export_children(db=Depends(get_db), current_user=Depends(verify_supabase_jwt)):
    """Mock CSV Export endpoint"""
    return {"message": "CSV export string placeholder"}
