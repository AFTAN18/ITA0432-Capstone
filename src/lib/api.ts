import { supabase } from './supabase';

export const VITE_API_BASE_URL = 'http://localhost:5173/api';

/**
 * Fetch KPIs from the materialized view and district summaries
 */
export async function fetchKPIs(outcome: string) {
  
  // Actually grab real data from our materialized view dashboard_kpis
  const { data: kpiData, error: kpiError } = await supabase
    .from('dashboard_kpis')
    .select('*')
    .single();

  if (kpiError) {
    console.error('Error fetching KPIs:', kpiError);
    // Silent fail fallback for frontend skeleton
    return {
       prevalence: 0, anemia: 0, districts: 0, highRisk: { name: 'Unknown', val: 0 }
    };
  }

  // Get the topmost district for specifically this outcome (Stunting or Anemia)
  const isStunting = outcome === 'stunting';
  const orderCol = isStunting ? 'stunting_prevalence' : 'anemia_prevalence';
  
  const { data: topDistrict, error: topErr } = await supabase
    .from('district_summaries')
    .select(`district_id, ${orderCol}, districts(district_name, state_code)`)
    .order(orderCol, { ascending: false })
    .limit(1)
    .single();

  let highestRisk = { name: kpiData.highest_risk_district, val: isStunting ? kpiData.overall_stunting_pct : kpiData.overall_anemia_pct };
  
  if (!topErr && topDistrict && topDistrict.districts) {
     highestRisk = {
       name: `${(topDistrict.districts as any).district_name} (${(topDistrict.districts as any).state_code})`,
       val: (topDistrict as any)[orderCol]
     };
  }

  return { 
    prevalence: kpiData.overall_stunting_pct, 
    anemia: kpiData.overall_anemia_pct, 
    districts: kpiData.total_districts, 
    highRisk: highestRisk 
  };
}

/**
 * Fetch generic Map data from Supabase
 */
export async function fetchMapData(filters: any) {
  const { data, error } = await supabase
    .from('district_summaries')
    .select('*, districts(geojson, district_name, state_code)');
    
  if (error) throw error;
  return data || [];
}
