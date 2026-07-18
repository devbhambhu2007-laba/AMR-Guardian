import React, { useState } from 'react';

export default function MythFactCard({ data }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div 
      className="glass-card p-5 mb-4 cursor-pointer hover:border-white/20 transition-all"
      onClick={() => setRevealed(!revealed)}
    >
      <div className="flex justify-between items-center gap-4">
        <h4 className="text-lg font-medium text-slate-100">{data.claim}</h4>
        {!revealed ? (
          <span className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded-md whitespace-nowrap text-cyan-400">Myth or Fact?</span>
        ) : (
          <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${data.is_true ? 'bg-emerald-500/20 text-emerald-400' : 'bg-coral-500/20 text-coral-400'}`}>
            {data.is_true ? 'FACT' : 'MYTH'}
          </span>
        )}
      </div>

      {revealed && (
        <div className="mt-4 pt-4 border-t border-white/10 animate-slide-up">
          <p className="text-sm text-slate-300 leading-relaxed">
            {data.correction}
          </p>
          <p className="text-xs text-slate-500 mt-3">
            Source: {data.source_ref}
          </p>
        </div>
      )}
    </div>
  );
}
