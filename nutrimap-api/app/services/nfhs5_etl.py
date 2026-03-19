import pandas as pd
import numpy as np

# Column Mappings directly derived from:
# NFHS-5 (2019-2021) Variable Dictionary -> ddi-documentation-english_microdata-4482.pdf
NFHS5_RECODE_MAPPING = {
    # 1. Base Identifiers
    'caseid': 'id',               # Unique Respondent ID
    'v001': 'cluster_number',     # Cluster number
    'v002': 'household_number',   # Household number
    'v024': 'state_region',       # State/Region (1=JK, 9=UP, etc.)
    'v025': 'urban_rural',        # Type of place of residence (1=Urban, 2=Rural)
    
    # 2. Socio-Economic Status (Wealth)
    'v190': 'wealth_quintile',    # Wealth index (1=Poorest ... 5=Richest)
    'v106': 'highest_education',  # Highest educational level reached
    
    # 3. Anthropometric Outcomes (Nutrition)
    'hw70': 'haz_score',          # Height/Age standard deviation (new WHO)
    'hw71': 'waz_score',          # Weight/Age standard deviation (new WHO)
    'hw57': 'anemia_level',       # Anemia level (1=Severe, 2=Moderate, 3=Mild, 4=Not anemic)
    
    # 4. Urban Slum Specific Demographics
    's191u': 'slum_residence',    # Urban Ward Slum Residence 
    
    # 5. WASH Architecture
    'v113': 'drinking_water',     # Source of drinking water
    'v116': 'type_of_toilet',     # Type of toilet facility
}

def parse_nfhs5_to_nutrimap(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforms wide-format raw NFHS-5 survey microdata (PR/KR files) 
    using the formal `microdata-4482.pdf` data dictionary standards 
    into the clean schema required by the NutriMap Supabase structure.
    """
    
    # 1. Filter only mapping columns that exist in the payload
    cols_to_keep = {k: v for k, v in NFHS5_RECODE_MAPPING.items() if k in df.columns or k.upper() in df.columns}
    
    # Auto-lower columns for safety just in case Stata .dta was imported capitalized
    df.columns = df.columns.str.lower()
    
    # 2. Extract and Rename
    clean_df = df[list(cols_to_keep.keys())].rename(columns=cols_to_keep)
    
    # 3. Compute Clinical Target Variables (WHO Standards)
    if 'haz_score' in clean_df.columns:
        # HAZ Scores below -200 (WHO standards represent -2.0 SD) = Stunted
        # NFHS-5 codes 9996/9998/9999 as missing/flagged values.
        clean_df['is_stunted'] = np.where(
            (clean_df['haz_score'] < 9990) & (clean_df['haz_score'] < -200), True, False
        )
        
    if 'anemia_level' in clean_df.columns:
        # Anemia levels 1, 2, 3 represent Severe, Moderate, Mild Anemia. 4 = Not anemic.
        clean_df['is_anemic'] = np.where(
            clean_df['anemia_level'].isin([1, 2, 3]), True, False
        )
        
    # 4. Filter strictly for URBAN domains (v025 == 1) for the NutriMap capstone focus
    if 'urban_rural' in clean_df.columns:
        clean_df = clean_df[clean_df['urban_rural'] == 1].copy()
        
    return clean_df

def generate_district_aggregates(clean_df: pd.DataFrame) -> pd.DataFrame:
    """Pipelines the NFHS-5 Child Recodes into District-Level KPIs for the Spatial Analytics"""
    
    aggregates = clean_df.groupby('cluster_number').agg({
        'is_stunted': 'mean',
        'is_anemic': 'mean',
        'id': 'count'
    }).rename(columns={'id': 'total_surveyed'})
    
    aggregates['stunting_prevalence'] = aggregates['is_stunted'] * 100
    aggregates['anemia_prevalence'] = aggregates['is_anemic'] * 100
    
    return aggregates
