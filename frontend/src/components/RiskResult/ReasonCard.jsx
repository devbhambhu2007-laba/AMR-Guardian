import React, { useState } from 'react';

export default function ReasonCard({ reason }) {
  const [expanded, setExpanded] = useState(false);

  // Determine border color based on weight
  let borderColor = 'border-l-emerald-500';
  let badgeColor = 'bg-emerald-500/20 text-emerald-400';
  
  if (reason.weight > 1 && reason.weight <= 3) {
    borderColor = 'border-l-amber-500';
    badgeColor = 'bg-amber-500/20 text-amber-400';
  } else if (reason.weight > 3) {
    borderColor = 'border-l-coral-500';
    badgeColor = 'bg-coral-500/20 text-coral-400';
  }

  return (
    <div className={`glass-card-light mb-3 border-l-4 ${borderColor} overflow-hidden transition-all duration-300`}>
      <div 
        className="p-4 cursor-pointer flex justify-between items-start gap-4 hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <p className="font-medium text-slate-200">{reason.description}</p>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className={`text-xs font-bold px-2 py-1 rounded ${badgeColor}`}>
            +{reason.weight} pts
          </span>
          {reason.snippet && (
            <svg 
              className={`w-4 h-4 text-slate-400 transform transition-transform ${expanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {expanded && reason.snippet && (
        <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-black/20">
          <div className="flex gap-2 mb-2">
            <svg className="w-4 h-4 text-cyan-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Guideline Reference</span>
          </div>
          <p className="text-sm text-slate-300 italic pl-6 border-l-2 border-cyan-900/50 py-1">
            "{reason.snippet}"
          </p>
        </div>
      )}
    </div>
  );
}
