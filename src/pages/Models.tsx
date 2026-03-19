import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Beaker, GitBranch, Info, AlertTriangle, Layers, Percent } from 'lucide-react';

const tabs = [
  { id: 'logistic', label: 'Logistic Regression', icon: Activity },
  { id: 'multilevel', label: 'Multilevel Model', icon: Layers },
  { id: 'interaction', label: 'Interaction Effects', icon: GitBranch },
];

const logisticData = [
  { variable: '(Intercept)', or: '0.84', ci: '0.71—0.99', p: '0.041', sig: '*' },
  { variable: 'Age (6-23 vs 24-59m)', or: '1.42', ci: '1.25—1.61', p: '<0.001', sig: '***' },
  { variable: 'Female (vs Male)', or: '0.91', ci: '0.84—0.99', p: '0.038', sig: '*' },
  { variable: 'Wealth (Poorest vs Richest)', or: '2.14', ci: '1.81—2.54', p: '<0.001', sig: '***' },
  { variable: 'Maternal Edu (None vs Higher)', or: '1.85', ci: '1.45—2.37', p: '<0.001', sig: '***' },
  { variable: 'Slum Residence (Yes vs No)', or: '1.38', ci: '1.14—1.67', p: '0.001', sig: '**' },
  { variable: 'Sanitation (Unimproved vs Imp)', or: '1.27', ci: '1.08—1.49', p: '0.004', sig: '**' },
];

const ForestPlotRow = ({ label, or, lower, upper }: { label: string, or: number, lower: number, upper: number }) => {
  const scale = 50; // pixels per OR unit
  const center = 100; // x-coord for OR=1
  
  return (
    <div className="flex items-center gap-4 text-sm font-mono border-b border-gray-800 py-3 hover:bg-white/5 transition-colors group">
      <div className="w-56 truncate text-gray-300 group-hover:text-white font-sans">{label}</div>
      <div className="flex-1 h-8 relative flex items-center">
         {/* Vertical reference line at OR=1 */}
         <div className="absolute left-[100px] top-0 bottom-0 w-[1px] bg-secondary-400 border-r border-dashed border-gray-600"></div>
         
         {/* SVG Plot Line */}
         <svg className="w-full h-full overflow-visible absolute top-0 left-0 hover:z-10">
           {/* CI Whiskers */}
           <line x1={center + (lower - 1) * scale} y1="16" x2={center + (upper - 1) * scale} y2="16" className="stroke-accent stroke-2" />
           {/* Whisker Caps */}
           <line x1={center + (lower - 1) * scale} y1="12" x2={center + (lower - 1) * scale} y2="20" className="stroke-accent stroke-2" />
           <line x1={center + (upper - 1) * scale} y1="12" x2={center + (upper - 1) * scale} y2="20" className="stroke-accent stroke-2" />
           {/* Point Estimate */}
           <rect x={center + (or - 1) * scale - 4} y="12" width="8" height="8" className="fill-white group-hover:fill-accent transition-colors" />
         </svg>
      </div>
      <div className="w-24 text-right text-gray-400 font-bold">{or.toFixed(2)}</div>
    </div>
  );
};

export default function Models() {
  const [activeTab, setActiveTab] = useState('logistic');

  return (
    <div className="p-8 h-full flex flex-col bg-grain overflow-auto custom-scrollbar">
      
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-white tracking-wide mb-2 flex items-center gap-3">
          <Beaker className="text-accent" size={32} />
          Inferential Models
        </h1>
        <p className="text-gray-400 font-light max-w-3xl">
          Multivariate regression models quantifying structural determinants of urban child stunting. Controlling for age, gender, and mother's BMI.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-px mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all relative ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? 'text-secondary-400' : ''} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="model-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-surface border border-gray-800 rounded-xl p-6 shadow-xl relative min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {activeTab === 'logistic' && (
            <motion.div
              key="logistic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-6 font-semibold flex items-center gap-2">
                  <Activity size={16}/> Coefficient Table
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-black/30 text-gray-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">Variable Reference</th>
                        <th className="px-4 py-3 font-medium font-mono">Adj. OR</th>
                        <th className="px-4 py-3 font-medium font-mono">95% CI</th>
                        <th className="px-4 py-3 font-medium font-mono">p-value</th>
                        <th className="px-4 py-3">Sig</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logisticData.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 font-mono">
                          <td className="px-4 py-3 font-sans text-gray-300">{row.variable}</td>
                          <td className="px-4 py-3 font-bold text-white">{row.or}</td>
                          <td className="px-4 py-3 text-gray-500">{row.ci}</td>
                          <td className="px-4 py-3 text-gray-400">{row.p}</td>
                          <td className="px-4 py-3 text-accent font-bold">{row.sig}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-xs text-gray-600 font-mono">* p&lt;0.05, ** p&lt;0.01, *** p&lt;0.001</div>
                </div>
              </div>

              <div>
                 <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-6 font-semibold flex items-center gap-2 justify-between">
                   <span>Forest Plot (OR with 95% CI)</span>
                   <div className="flex gap-4 text-xs font-mono font-normal">
                      <span><span className="inline-block w-2 bg-secondary mr-1"></span> Protective</span>
                      <span><span className="inline-block w-2 bg-accent mr-1"></span> Risk Factor</span>
                   </div>
                 </h3>
                 <div className="bg-black/20 p-6 rounded-lg border border-gray-800/60 mt-2">
                   {/* Header */}
                   <div className="flex items-center gap-4 text-xs font-mono border-b border-gray-800 pb-2 mb-2 text-gray-500 uppercase tracking-widest">
                     <div className="w-56">Factor</div>
                     <div className="flex-1 relative">
                       <span className="absolute left-[70px]">0.5</span>
                       <span className="absolute left-[100px] text-white">1.0</span>
                       <span className="absolute left-[150px]">2.0</span>
                       <span className="absolute left-[200px]">3.0</span>
                     </div>
                     <div className="w-24 text-right">Odds Ratio</div>
                   </div>
                   
                   {/* Data Rows */}
                   <ForestPlotRow label="Age (6-23 vs 24-59m)" or={1.42} lower={1.25} upper={1.61} />
                   <ForestPlotRow label="Female (vs Male)" or={0.91} lower={0.84} upper={0.99} />
                   <ForestPlotRow label="Wealth (Poorest)" or={2.14} lower={1.81} upper={2.54} />
                   <ForestPlotRow label="Maternal Edu (None)" or={1.85} lower={1.45} upper={2.37} />
                   <ForestPlotRow label="Slum Residence (Yes)" or={1.38} lower={1.14} upper={1.67} />
                   <ForestPlotRow label="Sanitation (Unimproved)" or={1.27} lower={1.08} upper={1.49} />
                 </div>
                 
                 {/* Model metrics */}
                 <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded border border-gray-800 bg-black/10 flex flex-col items-center">
                       <span className="text-gray-500 font-mono text-xs uppercase mb-1">Nagelkerke R²</span>
                       <span className="text-xl font-bold font-mono">0.246</span>
                    </div>
                    <div className="p-4 rounded border border-gray-800 bg-black/10 flex flex-col items-center">
                       <span className="text-gray-500 font-mono text-xs uppercase mb-1">AIC</span>
                       <span className="text-xl font-bold font-mono">15243.8</span>
                    </div>
                    <div className="p-4 rounded border border-gray-800 bg-black/10 flex flex-col items-center">
                       <span className="text-gray-500 font-mono text-xs uppercase mb-1">Observations</span>
                       <span className="text-xl font-bold font-mono">24,512</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'multilevel' && (
            <motion.div
              key="multilevel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 rounded-full border border-dashed border-gray-700 flex items-center justify-center mb-6 text-gray-500 bg-black/20">
                 <Layers size={40} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">Hierarchical Mixed-Effects Model</h3>
              <p className="text-gray-400 max-w-lg mx-auto mb-8 font-light">
                Random intercepts for states and districts to account for spatial nesting and unobserved intra-cluster correlations. Null intra-class correlation coefficient (ICC) validates spatial heterogeneity.
              </p>
              
              <div className="grid grid-cols-2 gap-8 w-full max-w-2xl text-left">
                 <div className="bg-black/30 border border-gray-800 rounded-xl p-6">
                   <h4 className="text-xs uppercase text-gray-500 font-semibold mb-4 tracking-widest flex justify-between">Random Effects Variance <span>Std.Dev</span></h4>
                   <div className="space-y-4 font-mono text-sm">
                      <div className="flex justify-between border-b border-gray-800/50 pb-2">
                        <span className="text-gray-300">State Level (Intercept)</span>
                        <span className="text-white">0.428</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800/50 pb-2">
                        <span className="text-gray-300">District Level (Intercept)</span>
                        <span className="text-white">0.215</span>
                      </div>
                   </div>
                 </div>
                 
                 <div className="bg-[#1B4332]/20 border border-secondary/50 rounded-xl p-6 relative overflow-hidden flex flex-col justify-center items-center">
                    <Percent className="absolute -right-6 -top-6 w-32 h-32 text-secondary/30 rotate-12" />
                    <span className="text-secondary-400 text-sm font-bold uppercase tracking-widest mb-2 z-10">District ICC</span>
                    <span className="text-5xl font-serif text-white z-10 drop-shadow-lg">11.4%</span>
                    <span className="text-xs text-gray-300 mt-2 z-10 text-center">Variance in stunting attributed to purely geographic differences</span>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'interaction' && (
            <motion.div
              key="interaction"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex justify-center items-center h-full min-h-[400px]"
            >
              <div className="text-center p-8 border border-dashed border-gray-700 rounded-xl bg-black/20">
                <AlertTriangle className="mx-auto text-accent mb-4" size={32} />
                <h3 className="text-xl font-medium text-white mb-2">Interaction Effect Modeling</h3>
                <p className="text-gray-400 max-w-md">The interaction module requires server connection to process live subset permutations in R. Currently running in disconnected mock mode.</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
