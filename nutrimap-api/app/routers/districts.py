from fastapi import APIRouter, Depends
from app.database import get_db

router = APIRouter()

@router.get("/")
async def list_districts(limit: int = 100, offset: int = 0, db=Depends(get_db)):
    res = db.table('districts').select('*, district_summaries(*)').range(offset, offset + limit - 1).execute()
    return res.data

@router.get("/geojson")
async def get_geojson(outcome: str = 'stunting', db=Depends(get_db)):
    res = db.table('districts').select('id, district_name, geojson, district_summaries(stunting_prevalence, anemia_prevalence)').execute()
    
    features = []
    for row in res.data:
        if row.get('geojson'):
            feature = row['geojson']
            # inject properties for choropleth mapping
            if 'properties' not in feature:
                feature['properties'] = {}
            feature['properties']['name'] = row['district_name']
            
            summary = row.get('district_summaries')
            if summary:
               feature['properties']['metric'] = summary['stunting_prevalence'] if outcome == 'stunting' else summary['anemia_prevalence']
            features.append(feature)
            
    return {
        "type": "FeatureCollection",
        "features": features
    }
