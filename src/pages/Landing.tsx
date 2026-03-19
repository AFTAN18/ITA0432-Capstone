import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, delay }: { title: string, value: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-surface/80 border border-secondary/40 backdrop-blur-md p-6 rounded-xl flex flex-col justify-center items-start shadow-xl relative overflow-hidden group hover:border-accent/40 transition-colors"
  >
    <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all duration-500"></div>
    <div className="text-4xl font-mono text-white mb-2 tracking-tight">
      {value}
    </div>
    <div className="text-sm text-gray-400 font-sans tracking-wide uppercase">
      {title}
    </div>
  </motion.div>
);

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background glowing India map simulation (CSS/SVG) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-20">
         <motion.svg 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           width="60%" height="80%" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(27,67,50,0.8)] fill-none stroke-secondary stroke-[0.5]"
         >
           {/* Abstract polygon representing map */}
           <polygon points="30,10 70,10 80,40 50,90 20,60" />
           <motion.circle cx="35" cy="30" r="1.5" className="fill-accent 0 pulse shadow-[0_0_10px_#E63946]" />
           <motion.circle cx="45" cy="45" r="2.5" className="fill-accent 0 pulse shadow-[0_0_15px_#E63946]" />
           <motion.circle cx="65" cy="20" r="1" className="fill-accent/60" />
           <motion.circle cx="50" cy="70" r="2" className="fill-accent shadow-[0_0_10px_#E63946]" />
           <motion.circle cx="25" cy="50" r="1.5" className="fill-accent/80" />
         </motion.svg>
      </div>

      <div className="z-10 container mx-auto px-10 flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/30 border border-secondary text-secondary-50 text-xs font-semibold tracking-wider mb-6 text-green-400 uppercase">
            Clinical Precision &bull; Social Urgency
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-white leading-tight mb-4 drop-shadow-xl font-bold">
            Urban <span className="text-accent underline decoration-4 underline-offset-8">Stunting</span> <br/>
            & Anemia Mapper
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Public health analytics dashboard for visualizing structural determinants of child malnutrition across India using NFHS-5 survey data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
          <StatCard title="Stunted Urban Children" value="7.2M" delay={0.2} />
          <StatCard title="Demographic Source" value="NFHS-5" delay={0.4} />
          <StatCard title="Districts Analyzed" value="640+" delay={0.6} />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-[0_0_20px_rgba(230,57,70,0.4)] transition-all"
        >
          Explore Dashboard
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </motion.button>
      </div>
    </div>
  );
}
