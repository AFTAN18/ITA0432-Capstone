export const VITE_API_BASE_URL = 'http://localhost:5173/api';

// Simulated Network Request
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function fetchKPIs(outcome: string) {
  await delay(800); // skeleton loading duration
  
  if (outcome === 'stunting') {
    return { prevalence: 35.5, anemia: 67.1, districts: 640, highRisk: { name: 'Bahraich', val: 64.1 } };
  } else if (outcome === 'anemia') {
    return { prevalence: 67.1, anemia: 67.1, districts: 640, highRisk: { name: 'Gujarat', val: 79.7 } };
  } else {
    return { prevalence: 45.0, anemia: 68.0, districts: 640, highRisk: { name: 'Bahraich', val: 68.0 } };
  }
}

export async function fetchMapData(filters: any) {
  await delay(1200);
  // Using static mock data for map in this demo, but the hook setup works
  return []; 
}
