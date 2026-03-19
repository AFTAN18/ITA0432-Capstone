from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os
from app.database import get_db

router = APIRouter()

@router.get("/recommendations")
async def get_recommendations(top_n_districts: int = 10, outcome: str = 'stunting', db=Depends(get_db)):
    """Returns Top N districts mapped with dynamic qualitative policy strategies"""
    order_col = 'stunting_prevalence' if outcome == 'stunting' else 'anemia_prevalence'
    
    res = db.table('district_summaries')\
        .select('district_id, pct_slum_residence, pct_improved_sanitation, pct_higher_edu_mothers, districts(district_name)')\
        .order(order_col, desc=True)\
        .limit(top_n_districts)\
        .execute()
        
    recommendations = []
    for row in res.data:
        interventions = ["General Nutrition Supply"]
        risk_factors = []
        if row.get('pct_slum_residence', 0) > 40:
            interventions.append("Targeted Slum Outreach")
            risk_factors.append("High Slum Density")
        if row.get('pct_improved_sanitation', 100) < 50:
            interventions.append("WASH Infrastructure Modernization")
            risk_factors.append("Low Sanitation Coverage")
        if row.get('pct_higher_edu_mothers', 100) < 20:
            interventions.append("Maternal Literacy & Health Programs")
            risk_factors.append("Low Maternal Education")
            
        recommendations.append({
            "district": row['districts']['district_name'],
            "key_risk_factors": risk_factors if risk_factors else ["Economic Constraints"],
            "recommended_interventions": interventions
        })
    return recommendations

@router.get("/pdf")
async def export_policy_pdf():
    """Dynamically generates PDF Policy Brief using ReportLab"""
    filename = "/tmp/national_policy_brief.pdf"
    
    c = canvas.Canvas(filename, pagesize=letter)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(72, 720, "NutriMap India - Automated Policy Brief")
    
    c.setFont("Helvetica", 12)
    c.drawString(72, 690, "Generated exactly by the analytics pipeline for immediate intervention deployment.")
    c.drawString(72, 660, "CONFIDENTIAL & URGENT")
    c.save()
    
    if not os.path.exists(filename):
        raise HTTPException(status_code=500, detail="Failed to generate PDF")
        
    return FileResponse(filename, media_type='application/pdf', filename="NutriMap_Policy_Brief.pdf")
