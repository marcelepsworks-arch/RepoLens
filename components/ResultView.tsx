import React from 'react';
import { AnalysisResult } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import FileBrowser from './FileBrowser';

interface ResultViewProps {
  data: AnalysisResult;
}

const ResultView: React.FC<ResultViewProps> = ({ data }) => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up pb-20">
      
      {/* 1. Project Files Browser (Top Priority) */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-primary">📦</span> V2 Assets & Migration Guide
        </h2>
        <p className="text-slate-400 mb-6 max-w-3xl">
          Explore the generated source code below. <br/>
          <span className="text-indigo-400 font-semibold">Tip:</span> Start by reading <code className="bg-slate-800 px-1 py-0.5 rounded text-xs border border-slate-700">MIGRATION_GUIDE.md</code> in the file browser.
        </p>
        
        <FileBrowser files={data.files} />
      </div>

      {/* 2. Analysis & Resumé Section */}
      <div className="bg-surface border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/50 p-6 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-secondary/20 p-2 rounded-lg text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">Upgrade Plan Resumé</h2>
               <p className="text-sm text-slate-400">Technical Improvement Breakdown</p>
             </div>
          </div>
          
          {data.sources.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span>Verified with {data.sources.length} sources</span>
            </div>
          )}
        </div>

        <div className="p-8 bg-gradient-to-b from-surface to-slate-900">
          <MarkdownRenderer content={data.improvementPlan} />
        </div>

        {data.sources.length > 0 && (
           <div className="bg-slate-900 p-6 border-t border-slate-700">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">References & Grounding</h4>
             <div className="flex flex-wrap gap-2">
               {data.sources.map((source, idx) => (
                 <a 
                   key={idx} 
                   href={source.uri} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-slate-300 transition-colors"
                 >
                   <span className="truncate max-w-[150px]">{source.title}</span>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                   </svg>
                 </a>
               ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ResultView;