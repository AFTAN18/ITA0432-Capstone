from supabase import create_client, Client
from app.config import settings

def get_db() -> Client:
    """Initialize and return the Supabase client using Service Role for server processes"""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
