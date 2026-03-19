from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks, HTTPException
import uuid
import pandas as pd
from app.database import get_db
from app.middleware.auth import verify_supabase_jwt
from app.config import settings

router = APIRouter()

@router.post("/csv")
async def upload_csv(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    db=Depends(get_db), 
    current_user=Depends(verify_supabase_jwt)
):
    """CSV upload and Supabase Storage logic"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
        
    upload_id = str(uuid.uuid4())
    storage_path = f"urban_data/{upload_id}_{file.filename}"
    
    # In production, actually stream the file bytes to Supabase storage buffer.
    # For now, simulate reading it temporarily to mock processing context.
    
    # 1. Log tracking entry to data_uploads
    db.table("data_uploads").insert({
        "id": upload_id,
        "filename": file.filename,
        "storage_path": storage_path,
        "uploaded_by": current_user.get('sub'),
        "status": "pending"
    }).execute()
    
    # 2. Add Background Task to handle raw ingestion pipeline
    def process_data(uid: str, s_path: str):
        print(f"Began background processing simulation for {uid}")
        # Mark processing
        db.table("data_uploads").update({"status": "processing"}).eq("id", uid).execute()
        # Mock ingestion completion
        db.table("data_uploads").update({"status": "completed", "rows_processed": 5000}).eq("id", uid).execute()

    background_tasks.add_task(process_data, upload_id, storage_path)
    
    return {"upload_id": upload_id, "status": "processing_queued"}

@router.get("/{upload_id}/status")
async def get_upload_status(upload_id: str, db=Depends(get_db), current_user=Depends(verify_supabase_jwt)):
    res = db.table("data_uploads").select('status, rows_processed, error_log').eq('id', upload_id).single().execute()
    return res.data
