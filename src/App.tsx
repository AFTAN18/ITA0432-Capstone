import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, BarChart2, Map as MapIcon, Database, PieChart, FileText } from 'lucide-react';
import { cn } from './lib/utils';
import { AnimatePresence } from 'framer-motion';

// Page Mocks (will implement fully later)
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Models from './pages/Models';
import Spatial from './pages/Spatial';
import DataExplorer from './pages/DataExplorer';
import PCA from './pages/PCA';
import PolicyInsights from './pages/PolicyInsights';

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const location = useLocation();
  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Statistical Models', icon: BarChart2, path: '/models' },
    { label: 'Spatial Risk', icon: MapIcon, path: '/spatial' },
    { label: 'Data Explorer', icon: Database, path: '/data' },
    { label: 'Wealth PCA', icon: PieChart, path: '/pca' },
    { label: 'Policy Insights', icon: FileText, path: '/policy' },
  ];

  if (location.pathname === '/') return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 z-50 w-64 bg-surface border-r border-[#1B4332]/30 flex flex-col p-4 shadow-xl transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-10 px-2 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(230,57,70,0.5)]">
              <span className="font-serif font-bold text-white leading-none">N</span>
            </div>
            <div className="font-serif text-xl font-bold tracking-wide text-white">NutriMap</div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 group relative",
                  isActive 
                    ? "bg-secondary text-white font-medium shadow-[inset_4px_0_0_#E63946]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-accent" : "text-gray-400 group-hover:text-gray-300")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto px-2 py-4 border-t border-white/5 text-xs text-gray-500">
          NFHS-5 Urban Dashboard v1.2
        </div>
      </aside>
    </>
  );
}

import { Menu } from 'lucide-react';

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isLanding = location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans bg-grain relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className={cn(
        "flex-1 h-screen overflow-y-auto w-full transition-all duration-300 relative",
        !isLanding ? "md:ml-64" : ""
      )}>
        
        {/* Mobile Header */}
        {!isLanding && (
          <div className="md:hidden sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-[#1B4332]/30 px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 hover:bg-white/10 rounded-md text-gray-300"
            >
              <Menu size={20} />
            </button>
            <div className="font-serif font-bold tracking-wide text-white text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs shadow-[0_0_10px_rgba(230,57,70,0.5)]">N</span>
              NutriMap
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/models" element={<Models />} />
            <Route path="/spatial" element={<Spatial />} />
            <Route path="/data" element={<DataExplorer />} />
            <Route path="/pca" element={<PCA />} />
            <Route path="/policy" element={<PolicyInsights />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
