import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown, Check, SlidersHorizontal, Map as MapIcon, BarChart3, AlertTriangle, Layers } from 'lucide-react';
import { useStore, type Outcome } from '../store/useStore';
import { cn } from '../lib/utils';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Fake KPI Card Component
const KPICard = ({ title, value, label, subLabel, trend, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    className="bg-surface border border-[#1B4332]/40 rounded-xl p-5 shadow-lg flex flex-col justify-between h-32 relative overflow-hidden group"
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
      {trend && (
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1", trend > 0 ? "bg-accent/20 text-accent" : "bg-green-500/20 text-green-400")}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="flex items-end gap-2">
      <span className="text-3xl font-mono font-bold text-white">{value}</span>
      {label && <span className="text-sm text-gray-500 font-medium mb-1">{label}</span>}
    </div>
    {subLabel && <div className="text-xs text-gray-500 mt-1 truncate">{subLabel}</div>}
    <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-secondary/10 rounded-full blur-xl group-hover:bg-accent/10 transition-colors"></div>
  </motion.div>
);

const FilterSidebar = () => {
  const { outcome, setOutcome, resetFilters } = useStore();
  
  return (
    <div className="w-80 bg-surface border-r border-[#1B4332]/40 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-[#1B4332]/40 flex items-center justify-between sticky top-0 bg-surface z-10">
        <div className="flex items-center gap-2 text-white font-medium">
          <Filter size={18} className="text-secondary-400" />
          Analytics Filters
        </div>
        <button onClick={resetFilters} className="text-xs text-accent hover:underline focus:outline-none">
          Reset All
        </button>
      </div>

      <div className="p-4 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
        {/* Outcome Goal */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Health Outcome</label>
          <div className="bg-[#0a1520] p-1 rounded-lg flex border border-gray-800">
            {(['stunting', 'anemia', 'both'] as Outcome[]).map((o) => (
              <button
                key={o}
                onClick={() => setOutcome(o)}
                className={cn(
                  "flex-1 py-1.5 text-sm rounded-md capitalize font-medium transition-all duration-200",
                  outcome === o ? "bg-secondary text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* State Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between">
            State / Region
            <span className="text-secondary-400">All India</span>
          </label>
          <div className="relative">
            <select className="w-full bg-[#0a1520] border border-gray-800 text-sm text-white rounded-md p-2 appearance-none outline-none focus:border-secondary transition-colors">
              <option value="">All States Selected (36)</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="BR">Bihar</option>
              <option value="MH">Maharashtra</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Wealth Quintile Slider Mock */}
        <div className="space-y-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between">
            Wealth Quintile
            <span className="text-gray-500 font-mono">1 - 5</span>
          </label>
          <div className="px-2">
             <div className="h-1.5 w-full bg-gray-800 rounded-full relative">
                <div className="absolute left-[0%] right-[0%] bottom-0 top-0 bg-secondary rounded-full"></div>
                <div className="absolute left-[0%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)] cursor-pointer"></div>
                <div className="absolute right-[0%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)] cursor-pointer"></div>
             </div>
             <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono">
               <span>Poorest (1)</span>
               <span>Richest (5)</span>
             </div>
          </div>
        </div>

        {/* Binary Toggles */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Demographics</label>
          
          <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-white/10">
            <div className="relative flex items-center">
              <input type="checkbox" className="sr-only" />
              <div className="w-10 h-5 bg-gray-700 rounded-full peer"></div>
              <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform"></div>
            </div>
            <span className="text-sm text-gray-300">Target Slum Communities</span>
          </label>
          
          <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-white/10">
            <div className="relative flex items-center">
              <input type="checkbox" className="sr-only" />
              <div className="w-10 h-5 bg-gray-700 rounded-full peer"></div>
              <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform"></div>
            </div>
            <span className="text-sm text-gray-300">Only Inadequate Sanitation</span>
          </label>
        </div>
      </div>
      
      <div className="p-4 border-t border-[#1B4332]/40 bg-surface">
        <button className="w-full bg-secondary hover:bg-secondary/80 text-white font-medium py-2.5 rounded-lg shadow-md transition-colors flex justify-center items-center gap-2 text-sm">
          <SlidersHorizontal size={16} />
          Apply Filters
        </button>
      </div>
    </div>
  );
};

// Fake Chart Data
const riskBarData = {
  labels: ['Bihar', 'UP', 'Jharkhand', 'MP', 'Assam', 'Rajasthan', 'Chhattisgarh', 'Odisha', 'Gujarat', 'Maharashtra'],
  datasets: [
    {
      label: 'Stunting %',
      data: [42.9, 39.7, 39.6, 35.7, 35.3, 31.8, 31.3, 31.0, 39.0, 35.2],
      backgroundColor: '#E63946',
      borderWidth: 0,
      borderRadius: 4,
    },
    {
      label: 'Anemia %',
      data: [69.4, 66.4, 67.5, 72.7, 68.4, 71.5, 67.2, 64.2, 79.7, 68.8],
      backgroundColor: '#1B4332',
      borderWidth: 0,
      borderRadius: 4,
    }
  ]
};

import { useQuery } from '@tanstack/react-query';
import { fetchKPIs } from '../lib/api';

const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '8px' };
const center = { lat: 22.5937, lng: 78.9629 };
const mapOptions = {
  disableDefaultUI: true,
  styles: [
    { "elementType": "geometry", "stylers": [{ "color": "#0a1520" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
    { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] },
    { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
    { "featureType": "administrative.neighborhood", "stylers": [{ "visibility": "off" }] },
    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#060c13" }] }
  ]
};

export default function Dashboard() {
  const { outcome } = useStore();
  
  const { data: kpiData, isLoading } = useQuery({
    queryKey: ['kpis', outcome],
    queryFn: () => fetchKPIs(outcome),
  });
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex overflow-hidden"
    >
      <FilterSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0a1520]/50 backdrop-blur-sm relative">
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-serif text-white tracking-wide mb-1 flex items-center gap-3">
                <MapIcon className="text-secondary-400" />
                National Risk Overview
              </h2>
              <p className="text-sm text-gray-400">Urban distribution across 640 districts (NFHS-5)</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 flex items-center gap-2">
                <Layers size={14} className="text-secondary" /> Slums: All
              </span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 flex items-center gap-2">
                <AlertTriangle size={14} className="text-accent" /> Outcome: {outcome}
              </span>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {isLoading ? (
               Array.from({length: 4}).map((_, i) => (
                 <div key={i} className="bg-surface/50 border border-gray-800 rounded-xl p-5 h-32 animate-pulse flex flex-col justify-between">
                    <div className="h-3 w-20 bg-gray-700/50 rounded mb-2"></div>
                    <div className="h-8 w-16 bg-gray-700/50 rounded mb-1"></div>
                 </div>
               ))
            ) : (
               <>
                  <KPICard title="Stunting Prev." value={kpiData?.prevalence} label="%" trend={-1.2} delay={0.1} subLabel="National Urban Average" />
                  <KPICard title="Anemia Prev." value={kpiData?.anemia} label="%" trend={2.4} delay={0.2} subLabel="Children 6-59 months" />
                  <KPICard title="Districts" value={kpiData?.districts} delay={0.3} subLabel="With valid survey data" />
                  <KPICard title="Highest Risk" value={kpiData?.highRisk?.name} delay={0.4} subLabel={`${kpiData?.highRisk?.val}% ${outcome}`} trend={0} />
               </>
            )}
          </div>

          {/* Map + Chart Split */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            
            {/* Fake Choropleth Map */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3 bg-surface border border-[#1B4332]/40 rounded-xl p-4 shadow-lg min-h-[400px] flex flex-col relative"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4 flex justify-between items-center">
                Spatial Distribution
                <button className="p-1 hover:bg-white/10 rounded"><BarChart3 size={16}/></button>
              </h3>
                            <div className="flex-1 border border-white/5 rounded block relative overflow-hidden bg-[#0A111F] flex items-center justify-center">
                 {isLoaded ? (
                   <GoogleMap
                     mapContainerStyle={mapContainerStyle}
                     center={center}
                     zoom={4.5}
                     options={mapOptions}
                   >
                     {/* Data Overlays will go here */}
                   </GoogleMap>
                 ) : (
                   <div className="text-gray-400 font-mono text-xs animate-pulse">Loading Google Maps Analytics Engine...</div>
                 )}
               </div>

              {/* Map Legend */}
              <div className="absolute bottom-6 right-6 bg-black/80 border border-white/10 backdrop-blur-md p-3 rounded-lg flex flex-col gap-1">
                <span className="text-[10px] uppercase text-gray-400 font-semibold mb-1">Prevalence %</span>
                <div className="flex gap-1 h-3">
                  <div className="w-6 bg-[#1B4332] rounded-l-sm"></div>
                  <div className="w-6 bg-[#2d6a4f]"></div>
                  <div className="w-6 bg-[#fcd5ce]"></div>
                  <div className="w-6 bg-[#f08080]"></div>
                  <div className="w-6 bg-[#E63946] rounded-r-sm"></div>
                </div>
                <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
                  <span>&lt;20</span>
                  <span>&gt;60</span>
                </div>
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="lg:col-span-2 bg-surface border border-[#1B4332]/40 rounded-xl p-4 shadow-lg flex flex-col"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                Top 10 High-Burden States
              </h3>
              <div className="flex-1 w-full min-h-[300px]">
                <Bar 
                  data={riskBarData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { grid: { color: '#ffffff10' }, ticks: { color: '#9ca3af', font: { family: 'IBM Plex Mono' } } },
                      x: { grid: { display: false }, ticks: { color: '#9ca3af', maxRotation: 45, minRotation: 45 } }
                    },
                    plugins: { legend: { labels: { color: '#e5e7eb', usePointStyle: true } } }
                  }} 
                />
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
