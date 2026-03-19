from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.services.r_runner import run_r_model
from app.middleware.auth import verify_supabase_jwt

router = APIRouter()

class RunModelRequest(BaseModel):
    model_type: str
    outcome: str
    filters: Optional[dict] = None

@router.get("/")
async def list_models(db=Depends(get_db)):
    """Returns list of all model runs (latest active per type/outcome)"""
    res = db.table('model_results').select('*').eq('is_active', True).execute()
    return res.data

@router.get("/{model_id}")
async def get_model(model_id: str, db=Depends(get_db)):
    """Returns full model result"""
    res = db.table('model_results').select('*').eq('id', model_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Model result not found")
    return res.data

@router.get("/coefficients/")
async def get_coefficients(model_type: str, outcome: str, db=Depends(get_db)):
    """Returns coefficient table rows for the active model"""
    model_res = db.table('model_results').select('id').eq('model_type', model_type).eq('outcome', outcome).eq('is_active', True).limit(1).execute()
    if not model_res.data:
        raise HTTPException(status_code=404, detail="Active model not found for specified parameters")
    
    coef_res = db.table('model_coefficients').select('*').eq('model_id', model_res.data[0]['id']).execute()
    return coef_res.data

@router.post("/run")
async def trigger_run(request: RunModelRequest, background_tasks: BackgroundTasks, current_user=Depends(verify_supabase_jwt)):
    """Triggers R script execution via subprocess background queue"""
    
    # Optional logic: save parameters to db to track 'queued' state
    # Job tracking would be handled by DB or Redis in Production.
    
    def r_process_runner(m_type: str, out: str):
        import asyncio
        data_path = "/tmp/local_cache.csv"  # Mock file pointer for R script
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(run_r_model(m_type, out, data_path))
            print(f"R Run Success: {result}")
            # Insert result back into model_results...
        except Exception as e:
            print(f"R Run Failure: {str(e)}")

    background_tasks.add_task(r_process_runner, request.model_type, request.outcome)
    return {"job_id": "fastapi-background", "status": "queued"}
