import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 22.5937,
  lng: 78.9629
};

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
import { Layers, Map as MapIcon, ArrowUpRight, Flame, ShieldAlert, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';

// Fake Top 10 High Risk Districts
const hotspots = [
  { name: 'Bahraich', state: 'Uttar Pradesh', stunting: 64.1, anemia: 72.4, risk: 'High' },
  { name: 'Sitamarhi', state: 'Bihar', stunting: 62.8, anemia: 71.1, risk: 'High' },
  { name: 'Shravasti', state: 'Uttar Pradesh', stunting: 61.5, anemia: 70.8, risk: 'High' },
  { name: 'Purnia', state: 'Bihar', stunting: 60.1, anemia: 68.2, risk: 'High' },
  { name: 'Balrampur', state: 'Uttar Pradesh', stunting: 59.4, anemia: 69.5, risk: 'High' },
  { name: 'Araria', state: 'Bihar', stunting: 58.7, anemia: 67.9, risk: 'High' },
  { name: 'Koppal', state: 'Karnataka', stunting: 56.4, anemia: 65.1, risk: 'High' },
  { name: 'Yadgir', state: 'Karnataka', stunting: 55.2, anemia: 64.8, risk: 'Med' },
  { name: 'Nandurbar', state: 'Maharashtra', stunting: 54.8, anemia: 66.2, risk: 'Med' },
  { name: 'Dhubri', state: 'Assam', stunting: 54.1, anemia: 63.5, risk: 'Med' },
];

const RiskBadge = ({ risk }: { risk: string }) => {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
      risk === 'High' ? "bg-accent/20 text-accent border-accent/30" : "bg-orange-500/20 text-orange-400 border-orange-500/30"
    )}>
      {risk}
    </span>
  );
};

export default function Spatial() {
  const [activeLayer, setActiveLayer] = useState('stunting');
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  return (
    <div className="flex h-full bg-surface overflow-hidden">
      
      {/* Map Container - Full Width Area */}
      <div className="flex-1 relative border-r border-gray-800">
         {/* Map Overlay Controls */}
         <div className="absolute top-6 left-6 z-[1000] drop-shadow-2xl">
            <h1 className="text-4xl font-serif text-white tracking-wide mb-2 flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <MapIcon className="text-accent" size={32} />
              Spatial Risk Mapping
            </h1>
            <p className="text-gray-200 font-medium bg-black/40 backdrop-blur-md px-3 py-1 text-sm rounded-md border border-white/10 w-fit">
              Interactive Hotspot Analysis (Local Moran's I)
            </p>
         </div>
         
         {/* Top Right Controls */}
         <div className="absolute top-6 right-6 z-[1000] bg-surface/90 backdrop-blur-md border border-gray-700/60 p-4 rounded-xl shadow-2xl w-64">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4 flex items-center gap-2">
              <Layers size={14}/> Base Layers
            </h3>
            
            <div className="space-y-4">
               <div>
                  <label className="text-xs text-gray-500 mb-2 block uppercase">Health Outcome</label>
                  <div className="flex bg-[#0a1520] p-1 rounded-md border border-gray-800">
                    <button 
                      onClick={() => setActiveLayer('stunting')}
                      className={cn("flex-1 py-1 text-xs rounded transition-colors font-medium", activeLayer === 'stunting' ? "bg-accent text-white" : "text-gray-400 hover:text-white")}
                    >Stunting</button>
                    <button 
                      onClick={() => setActiveLayer('anemia')}
                      className={cn("flex-1 py-1 text-xs rounded transition-colors font-medium", activeLayer === 'anemia' ? "bg-accent text-white" : "text-gray-400 hover:text-white")}
                    >Anemia</button>
                  </div>
               </div>
               
               <div>
                  <label className="text-xs text-gray-500 mb-2 block uppercase">Socioeconomic Overlays</label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 py-1 hover:text-white cursor-pointer transition-colors border-b border-gray-800/50">
                    <input type="checkbox" className="accent-secondary bg-transparent" /> Wealth Quintile 1 & 2
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 py-1 hover:text-white cursor-pointer transition-colors border-b border-gray-800/50">
                    <input type="checkbox" className="accent-secondary" /> Inadequate Sanitation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 py-1 hover:text-white cursor-pointer transition-colors">
                    <input type="checkbox" className="accent-secondary" /> High Slum Density
                  </label>
               </div>
            </div>
         </div>

         {/* Bottom Left Legend & Stats */}
         <div className="absolute bottom-6 left-6 z-[1000] flex gap-4">
            <div className="bg-surface/90 backdrop-blur-md border border-gray-700/60 p-4 rounded-xl shadow-2xl w-48 font-mono">
               <h3 className="text-[10px] uppercase text-gray-500 font-bold mb-2">Global Moran's I</h3>
               <div className="text-2xl font-bold text-white mb-1">0.42</div>
               <div className="text-xs text-accent font-sans">p {'<'} 0.001 (Clustered)</div>
               <div className="mt-3 pt-3 border-t border-gray-700/50 text-xs text-gray-400">
                  Significant spatial autocorrelation detected across contiguous urban wards.
               </div>
            </div>
         </div>

         {/* Actual Map Area */}
         <div className="w-full h-full bg-[#0a1520] relative">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={5}
                options={mapOptions}
              >
                 {/* Google Maps Data layer can be injected here for GeoJSON */}
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-accent/50 font-mono text-sm tracking-widest gap-2">
                 <div className="animate-spin h-6 w-6 border-2 border-accent/20 border-t-accent rounded-full"></div>
                 Loading Google Map Engine...
              </div>
            )}
            
            {/* Map Centering Hint overlay styling */}
            <div className="pointer-events-none absolute inset-0 z-[400] shadow-[inset_0_0_100px_rgba(10,21,32,0.9)]"></div>
         </div>
      </div>

      {/* Hotspots Sidebar */}
      <div className="w-[380px] bg-surface flex flex-col shrink-0 custom-scrollbar z-[1000] relative drop-shadow-2xl border-l border-white/5">
        <div className="p-6 border-b border-gray-800 bg-[#0a1520]/50 sticky top-0 backdrop-blur-md z-10">
           <h2 className="text-lg font-serif text-white tracking-wide flex items-center gap-2 mb-1">
             <Flame className="text-accent" size={20}/>
             High Burden Hotspots
           </h2>
           <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex justify-between">
             Top 10 Districts <span className="text-secondary-400">LISA Priority</span>
           </p>
        </div>
        
        <div className="p-4 space-y-3 flex-1 overflow-y-auto w-full custom-scrollbar bg-grain">
           {hotspots.map((district, i) => (
              <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.05 }}
                 key={i} 
                 className="bg-black/30 border border-gray-800 rounded-lg p-4 hover:border-accent/40 hover:bg-black/40 transition-all cursor-pointer group"
              >
                 <div className="flex justify-between items-start mb-2">
                    <div>
                       <div className="text-white font-serif font-medium text-lg group-hover:text-accent transition-colors">{district.name}</div>
                       <div className="text-xs text-gray-500 flex items-center gap-1"><Navigation size={10}/> {district.state}</div>
                    </div>
                    <RiskBadge risk={district.risk} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mt-4 text-sm font-mono focus:outline-none">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gray-500 uppercase tracking-widest font-sans mb-1">Stunting</span>
                       <span className={cn("font-bold text-white", district.stunting > 60 ? "text-accent" : "")}>{district.stunting}%</span>
                    </div>
                    <div className="flex flex-col border-l border-gray-800/50 pl-4">
                       <span className="text-[10px] text-gray-500 uppercase tracking-widest font-sans mb-1">Anemia</span>
                       <span className={cn("font-bold text-white", district.anemia > 70 ? "text-[#fcd5ce]" : "")}>{district.anemia}%</span>
                    </div>
                 </div>
                 
                 <div className="mt-4 pt-3 border-t border-gray-800/50 flex justify-between items-center text-xs text-secondary-400 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity font-medium pointer-events-none">
                    View Intervention Profile <ArrowUpRight size={14}/>
                 </div>
              </motion.div>
           ))}
        </div>
      </div>

    </div>
  );
}
