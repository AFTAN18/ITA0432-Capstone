from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import routers
from app.routers import kpis, models, children, spatial, pca, districts, policy, upload

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="NutriMap India API", version="1.0.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
origins = ["http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect Routers
app.include_router(kpis.router, prefix="/api/v1/kpis", tags=["KPIs"])
app.include_router(models.router, prefix="/api/v1/models", tags=["Statistical Models"])
app.include_router(children.router, prefix="/api/v1/children", tags=["Children Microdata"])
app.include_router(spatial.router, prefix="/api/v1/spatial", tags=["Spatial Analytics"])
app.include_router(pca.router, prefix="/api/v1/pca", tags=["PCA Wealth Explorer"])
app.include_router(districts.router, prefix="/api/v1/districts", tags=["Districts"])
app.include_router(policy.router, prefix="/api/v1/policy", tags=["Policy Synthesis"])
app.include_router(upload.router, prefix="/api/v1/upload", tags=["Upload Processor"])

@app.get("/")
@limiter.limit("100/minute")
def read_root(request: Request):
    return {"message": "Welcome to NutriMap India API. Documentation available at /docs"}
