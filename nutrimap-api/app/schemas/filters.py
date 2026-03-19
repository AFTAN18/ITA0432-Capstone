from pydantic import BaseModel
from typing import Optional, List

class ChildFilter(BaseModel):
    district_id: Optional[str] = None
    state: Optional[str] = None
    is_stunted: Optional[bool] = None
    is_anemic: Optional[bool] = None
    wealth_quintile: Optional[int] = None
    education_level: Optional[str] = None
    sanitation_access: Optional[str] = None
    is_slum: Optional[bool] = None
    page: int = 1
    limit: int = 50
