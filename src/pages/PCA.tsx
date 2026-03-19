import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, ComposedChart } from 'recharts';
import { Coins, Sigma, Target, Network, CheckCircle, PieChart as PieIcon, LineChart as LineChartIcon } from 'lucide-react';
import { cn } from '../lib/utils';

// Fake Data for PCA
const screeData = [
  { component: 'PC1', variance: 42.5, cumulative: 42.5 },
  { component: 'PC2', variance: 15.2, cumulative: 57.7 },
  { component: 'PC3', variance: 8.4, cumulative: 66.1 },
  { component: 'PC4', variance: 6.1, cumulative: 72.2 },
  { component: 'PC5', variance: 4.8, cumulative: 77.0 },
  { component: 'PC6', variance: 3.2, cumulative: 80.2 },
  { component: 'PC7', variance: 2.5, cumulative: 82.7 },
  { component: 'PC8', variance: 1.9, cumulative: 84.6 },
];

const loadings = [
  { item: 'Has Refrigerator', weight: 0.812 },
  { item: 'Has Motorcycle/Scooter', weight: 0.754 },
  { item: 'House Pucca (Bricks/Cement)', weight: 0.721 },
  { item: 'Has Television', weight: 0.698 },
  { item: 'Uses Clean Fuel (LPG/Electric)', weight: 0.645 },
  { item: 'Has Agricultural Land', weight: -0.321 },
  { item: 'Shares Toilet Facility', weight: -0.456 },
  { item: 'Earth/Sand Floor', weight: -0.582 },
];

export default function PCA() {
  return (
    <div className="p-8 h-full overflow-auto custom-scrollbar bg-grain flex flex-col">
      <div className="max-w-7xl mx-auto w-full">
         
         <div className="mb-8 flex items-end justify-between">
            <div>
               <motion.span 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="inline-block py-1 px-3 rounded text-xs font-mono font-bold tracking-widest uppercase bg-secondary/20 text-secondary-300 border border-secondary/30 mb-4"
               >
                 Methodology Module
               </motion.span>
               <h1 className="text-4xl font-serif text-white tracking-wide mb-2 flex items-center gap-3">
                 <PieIcon className="text-secondary" size={32} />
                 Wealth Index PCA
               </h1>
               <p className="text-gray-400 font-light max-w-3xl">
                 Principal Component Analysis derived from 28 household asset indicators. The primary component (PC1) explains internal socio-economic stratification directly mapped into relative wealth quintiles.
               </p>
            </div>
            
            <div className="text-right border border-gray-800 bg-surface/50 p-4 rounded-xl backdrop-blur-md">
               <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Index Construct Validated</div>
               <div className="flex items-center gap-2 justify-end text-white font-mono text-xl font-bold">
                 KMO: 0.86 <CheckCircle className="text-secondary" size={16}/>
               </div>
               <div className="text-xs text-gray-400 mt-1">Kaiser-Meyer-Olkin Test</div>
            </div>
         </div>

         {/* Charts Row */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Scree Plot */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
               className="bg-surface border border-gray-800 rounded-xl p-6 shadow-xl relative"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-1 flex items-center gap-2">
                <LineChartIcon className="text-secondary-400" size={18}/> Scree Plot (Variance Explained)
              </h3>
              <p className="text-xs text-gray-500 mb-6">Elbow at PC2 confirms uni-dimensional asset index validity</p>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={screeData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVariance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E63946" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E63946" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                    <XAxis dataKey="component" tick={{fill: '#9ca3af', fontSize: 12, fontFamily: 'IBM Plex Mono'}} axisLine={{stroke: '#4b5563'}} />
                    <YAxis tick={{fill: '#9ca3af', fontSize: 12, fontFamily: 'IBM Plex Mono'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#112240', borderColor: '#1B4332', color: '#fff' }} 
                      itemStyle={{ color: '#E63946' }}
                    />
                    <Area type="monotone" dataKey="variance" stroke="#E63946" fillOpacity={1} fill="url(#colorVariance)" />
                    <Line type="monotone" dataKey="cumulative" stroke="#1B4332" strokeWidth={3} dot={{ fill: '#1B4332', strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex gap-6 text-xs font-mono justify-center text-gray-400">
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-accent/50 border border-accent rounded-sm inline-block"></span> Variance %</div>
                <div className="flex items-center gap-2"><span className="w-4 h-1 bg-secondary rounded-full inline-block"></span> Cumulative Var.</div>
              </div>
            </motion.div>

            {/* Loadings Matrix */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="bg-surface border border-gray-800 rounded-xl p-6 shadow-xl flex flex-col"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-1 flex items-center gap-2">
                <Network className="text-secondary-400" size={18}/> Component 1 Object Loadings
              </h3>
              <p className="text-xs text-gray-500 mb-6">Variables ordered by eigen-vector coefficient magnitude</p>
              
              <div className="flex-1 overflow-auto custom-scrollbar pr-2">
                 <div className="space-y-3 font-mono text-sm">
                    {loadings.map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-gray-800/80 pb-2 hover:bg-white/5 transition-colors group px-2 rounded -mx-2">
                        <span className="text-gray-300 font-sans group-hover:text-white">{item.item}</span>
                        <div className="flex items-center gap-4">
                           {/* Loading Bar Visualizer */}
                           <div className="w-24 h-1.5 bg-black rounded relative flex">
                              {item.weight > 0 ? (
                                <div className="h-full bg-secondary rounded-r absolute right-0 left-1/2" style={{ right: `${50 - (item.weight * 50)}%` }}></div>
                              ) : (
                                <div className="h-full bg-accent rounded-l absolute left-0 right-1/2" style={{ left: `${50 - (Math.abs(item.weight) * 50)}%` }}></div>
                              )}
                              {/* Axis line */}
                              <div className="w-[1px] h-3 bg-gray-500 absolute left-1/2 -top-[3px]"></div>
                           </div>
                           <span className={cn("w-12 text-right font-bold", item.weight > 0 ? "text-secondary-400" : "text-accent")}>
                             {item.weight > 0 ? '+' : ''}{item.weight.toFixed(3)}
                           </span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800 text-[10px] text-gray-500 leading-tight uppercase tracking-widest font-semibold flex justify-between">
                <span>Negative = Poverty Correlate</span>
                <span>Positive = Wealth Correlate</span>
              </div>
            </motion.div>
         </div>

      </div>
    </div>
  );
}
