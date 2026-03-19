-- Supabase Database Migration
-- NutriMap India: Public Health Analytics Platform Schema

-- ============================================================================
-- 1. EXTENSIONS & ENUMS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE sanitation_type AS ENUM ('improved', 'unimproved', 'open_defecation');
CREATE TYPE water_source_type AS ENUM ('piped', 'well', 'tanker', 'surface');
CREATE TYPE education_level AS ENUM ('none', 'primary', 'secondary', 'higher');
CREATE TYPE stunting_status AS ENUM ('normal', 'moderate', 'severe');
CREATE TYPE anemia_status AS ENUM ('none', 'mild', 'moderate', 'severe');
CREATE TYPE sex_type AS ENUM ('male', 'female');
CREATE TYPE model_type AS ENUM ('logistic', 'multilevel', 'interaction');
CREATE TYPE outcome_type AS ENUM ('stunting', 'anemia');
CREATE TYPE upload_status AS ENUM ('pending', 'processing', 'completed', 'failed');


-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- Districts Metadata
CREATE TABLE districts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_code   VARCHAR(10) UNIQUE NOT NULL,   -- NFHS district code
  district_name   VARCHAR(100) NOT NULL,
  state_name      VARCHAR(100) NOT NULL,
  state_code      VARCHAR(10) NOT NULL,
  region          VARCHAR(50),                    -- North/South/East/West/Central/NE
  is_metro        BOOLEAN DEFAULT false,
  geojson         JSONB,                          -- GeoJSON polygon for map rendering
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- NFHS-5 Survey Clusters
CREATE TABLE survey_clusters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id      INTEGER UNIQUE NOT NULL,        -- NFHS cluster number
  district_id     UUID REFERENCES districts(id) ON DELETE CASCADE,
  is_slum         BOOLEAN DEFAULT false,
  cluster_type    VARCHAR(20),                    -- 'slum', 'non-slum', 'periurban'
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6)
);

-- Urban Households
CREATE TABLE households (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id        INTEGER NOT NULL,
  cluster_id          UUID REFERENCES survey_clusters(id) ON DELETE CASCADE,
  district_id         UUID REFERENCES districts(id) ON DELETE CASCADE,
  sanitation_access   sanitation_type,
  water_source        water_source_type,
  electricity_access  BOOLEAN,
  cooking_fuel        VARCHAR(50),
  household_size      SMALLINT,
  -- Asset variables
  has_television      BOOLEAN,
  has_refrigerator    BOOLEAN,
  has_bicycle         BOOLEAN,
  has_motorcycle      BOOLEAN,
  has_car             BOOLEAN,
  has_phone           BOOLEAN,
  floor_material      VARCHAR(50),
  wall_material       VARCHAR(50),
  roof_material       VARCHAR(50),
  wealth_quintile     SMALLINT CHECK (wealth_quintile BETWEEN 1 AND 5),
  wealth_score        DECIMAL(8,4),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Maternal Records
CREATE TABLE mothers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mother_id           INTEGER NOT NULL,
  household_id        UUID REFERENCES households(id) ON DELETE CASCADE,
  age_years           SMALLINT,
  education_level     education_level,
  bmi                 DECIMAL(5,2),
  anemia_status       BOOLEAN,
  antenatal_visits    SMALLINT,
  institutional_birth BOOLEAN
);

-- Child Level Records (Core Analytical Table)
CREATE TABLE children (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id            INTEGER NOT NULL,
  household_id        UUID REFERENCES households(id) ON DELETE CASCADE,
  district_id         UUID REFERENCES districts(id) ON DELETE CASCADE,
  cluster_id          UUID REFERENCES survey_clusters(id) ON DELETE CASCADE,
  mother_id           UUID REFERENCES mothers(id) ON DELETE CASCADE,
  age_months          SMALLINT,
  sex                 sex_type,
  birth_order         SMALLINT,
  -- Anthropometrics
  height_for_age_z    DECIMAL(6,3),
  weight_for_age_z    DECIMAL(6,3),
  weight_for_height_z DECIMAL(6,3),
  hemoglobin_level    DECIMAL(5,2),
  -- Generated Logic Outcomes
  is_stunted          BOOLEAN GENERATED ALWAYS AS (height_for_age_z < -2) STORED,
  is_severely_stunted BOOLEAN GENERATED ALWAYS AS (height_for_age_z < -3) STORED,
  is_anemic           BOOLEAN GENERATED ALWAYS AS (hemoglobin_level < 11.0) STORED,
  stunting_category   stunting_status,
  anemia_category     anemia_status,
  survey_weight       DECIMAL(10,6),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 3. ANALYSIS & MODELING TABLES
-- ============================================================================

-- District Summaries
CREATE TABLE district_summaries (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id             UUID REFERENCES districts(id) UNIQUE ON DELETE CASCADE,
  total_children          INTEGER,
  stunting_prevalence     DECIMAL(5,2),
  anemia_prevalence       DECIMAL(5,2),
  severe_stunting_prev    DECIMAL(5,2),
  mean_haz_score          DECIMAL(6,3),
  mean_hemoglobin         DECIMAL(5,2),
  mean_wealth_score       DECIMAL(8,4),
  pct_improved_sanitation DECIMAL(5,2),
  pct_higher_edu_mothers  DECIMAL(5,2),
  pct_slum_residence      DECIMAL(5,2),
  risk_level              VARCHAR(10),
  hotspot_rank            SMALLINT,
  morans_i_local          DECIMAL(8,6),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- R Model Run Logs
CREATE TABLE model_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_type      model_type NOT NULL,
  outcome         outcome_type NOT NULL,
  run_at          TIMESTAMPTZ DEFAULT NOW(),
  aic             DECIMAL(10,4),
  bic             DECIMAL(10,4),
  nagelkerke_r2   DECIMAL(6,4),
  icc             DECIMAL(6,4),
  model_params    JSONB,
  is_active       BOOLEAN DEFAULT true
);

-- Model Coefficients
CREATE TABLE model_coefficients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id        UUID REFERENCES model_results(id) ON DELETE CASCADE,
  predictor       VARCHAR(100) NOT NULL,
  odds_ratio      DECIMAL(10,6),
  ci_lower        DECIMAL(10,6),
  ci_upper        DECIMAL(10,6),
  p_value         DECIMAL(10,8),
  std_error       DECIMAL(10,6),
  z_value         DECIMAL(10,6),
  is_significant  BOOLEAN GENERATED ALWAYS AS (p_value < 0.05) STORED
);

-- PCA Analysis Config/Results
CREATE TABLE pca_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at          TIMESTAMPTZ DEFAULT NOW(),
  component       SMALLINT,
  variance_pct    DECIMAL(6,3),
  cumulative_pct  DECIMAL(6,3),
  is_active       BOOLEAN DEFAULT true
);

CREATE TABLE pca_loadings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pca_result_id   UUID REFERENCES pca_results(id) ON DELETE CASCADE,
  variable_name   VARCHAR(100),
  loading_pc1     DECIMAL(8,6),
  loading_pc2     DECIMAL(8,6),
  loading_pc3     DECIMAL(8,6)
);

-- Upload Tracing
CREATE TABLE data_uploads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename        VARCHAR(255),
  storage_path    TEXT,
  uploaded_by     UUID REFERENCES auth.users(id),
  status          upload_status DEFAULT 'pending',
  rows_processed  INTEGER DEFAULT 0,
  error_log       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);


-- ============================================================================
-- 4. INDEXES
-- ============================================================================
CREATE INDEX idx_children_district ON children(district_id);
CREATE INDEX idx_children_cluster ON children(cluster_id);
CREATE INDEX idx_children_stunted ON children(is_stunted) WHERE is_stunted = true;
CREATE INDEX idx_children_anemic ON children(is_anemic) WHERE is_anemic = true;
CREATE INDEX idx_households_district ON households(district_id);
CREATE INDEX idx_households_wealth ON households(wealth_quintile);
CREATE INDEX idx_district_summaries_risk ON district_summaries(risk_level, hotspot_rank);
CREATE INDEX idx_model_coefficients_model ON model_coefficients(model_id);
CREATE INDEX idx_districts_state ON districts(state_code);

-- GIN index for GeoJSON rendering optimization
CREATE INDEX idx_districts_geojson ON districts USING GIN(geojson);


-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE mothers ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_uploads ENABLE ROW LEVEL SECURITY;

-- Public read access for aggregated analytics
CREATE POLICY "Public read district summaries" ON district_summaries FOR SELECT USING (true);
CREATE POLICY "Public read model results" ON model_results FOR SELECT USING (true);
CREATE POLICY "Public read model coefficients" ON model_coefficients FOR SELECT USING (true);
CREATE POLICY "Public read districts" ON districts FOR SELECT USING (true);

-- API Read Access: Authenticated users only for microdata
CREATE POLICY "Auth read children" ON children FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read households" ON households FOR SELECT USING (auth.role() = 'authenticated');

-- Data Uploads (Users only see what they upload)
CREATE POLICY "Users see own uploads" ON data_uploads FOR SELECT USING (auth.uid() = uploaded_by);


-- ============================================================================
-- 6. MATERIALIZED VIEWS
-- ============================================================================
CREATE MATERIALIZED VIEW dashboard_kpis AS
SELECT
  COUNT(DISTINCT c.district_id)                   AS total_districts,
  COUNT(c.id)                                     AS total_children,
  ROUND((AVG(c.is_stunted::int) * 100)::numeric, 2) AS overall_stunting_pct,
  ROUND((AVG(c.is_anemic::int) * 100)::numeric, 2)  AS overall_anemia_pct,
  (SELECT district_name FROM districts d
   JOIN district_summaries ds ON d.id = ds.district_id
   ORDER BY ds.stunting_prevalence DESC NULLS LAST LIMIT 1) AS highest_risk_district
FROM children c;

CREATE UNIQUE INDEX ON dashboard_kpis((1));


-- ============================================================================
-- 7. SUPABASE STORAGE BUCKETS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('nfhs-uploads', 'nfhs-uploads', false),
  ('shapefiles', 'shapefiles', true),
  ('model-outputs', 'model-outputs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Configuration
CREATE POLICY "Public Shapefile Access" ON storage.objects FOR SELECT USING (bucket_id = 'shapefiles');
CREATE POLICY "Auth Upload CSVs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'nfhs-uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Read Models" ON storage.objects FOR SELECT USING (bucket_id = 'model-outputs' AND auth.role() = 'authenticated');


-- ============================================================================
-- 8. SEED DATA GENERATION (Structural Metadata)
-- ============================================================================
INSERT INTO districts (district_code, district_name, state_name, state_code, region, is_metro)
VALUES 
  ('UP01', 'Bahraich', 'Uttar Pradesh', 'UP', 'North', false),
  ('BR01', 'Sitamarhi', 'Bihar', 'BR', 'East', false),
  ('MH01', 'Mumbai', 'Maharashtra', 'MH', 'West', true),
  ('KA01', 'Bangalore Urban', 'Karnataka', 'KA', 'South', true),
  ('OR01', 'Khurda', 'Odisha', 'OR', 'East', false)
ON CONFLICT (district_code) DO NOTHING;
