import React from 'react';
import Disclaimer from '../Disclaimer/Disclaimer';

export default function Explanation({ explanation, loading }) {
  if (loading) {
    return (
      <div className="glass-card p-6 border-t-4 border-cyan-500 animate-pulse mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="h-5 bg-slate-700 rounded w-48"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          <div className="h-4 bg-slate-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="glass-card p-6 border-t-4 border-cyan-500 mt-6 animate-fade-in shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold font-heading text-white">AI Analysis & Guidance</h3>
        {explanation.filtered && (
          <span className="ml-auto text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-800 px-2 py-1 rounded">
            Static Fallback
          </span>
        )}
      </div>
      
      <div className="prose prose-invert prose-sm max-w-none text-slate-300 mb-6 leading-relaxed">
        {explanation.explanation.split('\n').map((paragraph, idx) => (
          paragraph.trim() ? <p key={idx} className="mb-3">{paragraph}</p> : null
        ))}
      </div>

      <Disclaimer variant="inline" />
    </div>
  );
}
