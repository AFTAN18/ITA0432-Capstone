from fastapi import APIRouter, Depends
from app.database import get_db

router = APIRouter()

@router.get("/scree")
async def get_scree(db=Depends(get_db)):
    res = db.table('pca_results').select('*').eq('is_active', True).execute()
    return res.data

@router.get("/loadings")
async def get_loadings(db=Depends(get_db)):
    # Get active PCA run 
    pca_res = db.table('pca_results').select('id').eq('is_active', True).limit(1).execute()
    if not pca_res.data:
         return []
    res = db.table('pca_loadings').select('*').eq('pca_result_id', pca_res.data[0]['id']).execute()
    return res.data

@router.get("/quintile-distribution")
async def get_quintiles(db=Depends(get_db)):
    # Mock aggregation for quintiles
    return [
       {"quintile": 1, "count": 4231, "percentage": 20.1},
       {"quintile": 2, "count": 4100, "percentage": 19.8},
       {"quintile": 3, "count": 3900, "percentage": 18.5},
       {"quintile": 4, "count": 4500, "percentage": 22.0},
       {"quintile": 5, "count": 4120, "percentage": 19.6}
    ]
