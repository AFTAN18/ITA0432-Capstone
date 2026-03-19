import React, { useMemo, useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  flexRender, 
  getSortedRowModel,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table';
import { Database, Search, Download, UploadCloud, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

type ChildData = {
  id: string;
  state: string;
  district: string;
  stunted: string;
  anemic: string;
  wealth: number;
  edu: string;
  slum: string;
};

// Mock Data
const data: ChildData[] = Array.from({ length: 50 }, (_, i) => ({
  id: `CH-${(1000 + i).toString()}`,
  state: ['Uttar Pradesh', 'Bihar', 'Maharashtra', 'Karnataka', 'Odisha'][i % 5],
  district: ['Bahraich', 'Patna', 'Mumbai', 'Bangalore Urban', 'Khurda'][i % 5],
  stunted: i % 3 === 0 ? 'Yes' : 'No',
  anemic: i % 2 === 0 ? 'Yes' : 'No',
  wealth: [1, 2, 3, 4, 5][i % 5],
  edu: ['None', 'Primary', 'Secondary', 'Higher'][i % 4],
  slum: i % 4 === 0 ? 'Yes' : 'No',
}));

export default function DataExplorer() {
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const columns = useMemo<ColumnDef<ChildData>[]>(() => [
    { header: 'Child ID', accessorKey: 'id', cell: (info) => <span className="font-mono text-gray-300">{info.getValue() as string}</span> },
    { header: 'State', accessorKey: 'state' },
    { header: 'District', accessorKey: 'district' },
    { 
      header: 'Stunted', 
      accessorKey: 'stunted',
      cell: (info) => (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${info.getValue() === 'Yes' ? 'bg-accent/20 text-accent' : 'bg-gray-800 text-gray-400'}`}>
          {info.getValue() as string}
        </span>
      )
    },
    { 
      header: 'Anemic', 
      accessorKey: 'anemic',
      cell: (info) => (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${info.getValue() === 'Yes' ? 'bg-[#fcd5ce]/20 text-[#fcd5ce]' : 'bg-gray-800 text-gray-400'}`}>
          {info.getValue() as string}
        </span>
      )
    },
    { header: 'Wealth Q.', accessorKey: 'wealth', cell: (info) => <span className="font-mono">{info.getValue() as number}</span> },
    { header: 'Maternal Edu', accessorKey: 'edu' },
    { header: 'Urban Slum', accessorKey: 'slum' },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-8 h-full bg-grain overflow-auto custom-scrollbar flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-4xl font-serif text-white tracking-wide mb-2 flex items-center gap-3">
             <Database className="text-secondary" size={32} />
             Dataset Explorer
           </h1>
           <p className="text-gray-400 font-light">Query, filter, and export the raw synthesized NFHS-5 sub-sample data.</p>
        </div>
        
        <div className="flex gap-4">
           {/* Upload Container */}
           <div className="border border-dashed border-gray-600 rounded-lg flex items-center gap-3 px-4 py-2 hover:bg-white/5 cursor-pointer bg-black/20 text-sm font-medium text-gray-300 transition-colors">
              <UploadCloud size={18} className="text-secondary" />
              Upload Latest DHS CSV
           </div>
           
           <button className="bg-white hover:bg-gray-200 text-black font-semibold rounded-lg flex items-center gap-2 px-5 py-2 text-sm transition-colors shadow-lg">
              <Download size={16} />
              Export CSV
           </button>
        </div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-surface border border-gray-800 rounded-xl shadow-xl flex-1 flex flex-col overflow-hidden"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-800 flex justify-between bg-black/20">
           <div className="relative w-72">
             <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
             <input type="text" placeholder="Search District or ID..." className="w-full bg-[#0a1520] border border-gray-700 rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors" />
           </div>
           <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-[#0a1520] px-3 py-1.5 rounded-md border border-gray-800">
             <CheckCircle2 size={14} className="text-green-500" />
             Data Quality: 99.8% Complete
           </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-400 uppercase bg-black/40 sticky top-0 z-10 backdrop-blur-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th 
                      key={header.id} 
                      className="px-6 py-4 font-semibold tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-800">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-3 font-sans text-gray-300">
                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between text-sm bg-black/20 text-gray-400">
           <div className="font-mono">
             Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
           </div>
           <div className="flex gap-2">
             <button 
               onClick={() => table.previousPage()} 
               disabled={!table.getCanPreviousPage()}
               className="p-1 px-3 bg-[#0a1520] border border-gray-700 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <ChevronLeft size={16} />
             </button>
             <button 
               onClick={() => table.nextPage()} 
               disabled={!table.getCanNextPage()}
               className="p-1 px-3 bg-[#0a1520] border border-gray-700 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <ChevronRight size={16} />
             </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
