import React, { useState } from 'react';
import RiskGauge from './RiskGauge';
import ReasonCard from './ReasonCard';

export default function RiskResult({ data }) {
  const [showMath, setShowMath] = useState(false);
  if (!data) return null;

  const rawSum = data.reasons ? data.reasons.reduce((sum, r) => sum + r.weight, 0) : 0;

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in mb-8">
      <h2 className="text-2xl font-bold font-heading text-center mb-8 text-white">Assessment Results</h2>
      
      <div className="flex justify-center mb-10">
        <RiskGauge score={data.score} size={240} />
      </div>

      <div className="text-center mb-6">
        <button
          onClick={() => setShowMath(!showMath)}
          className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors inline-flex items-center gap-1.5 focus:outline-none"
        >
          <svg className={`w-4 h-4 transition-transform duration-200 ${showMath ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showMath ? "Hide Score Calculation Details" : "How is this score calculated?"}
        </button>
        
        {showMath && (
          <div className="mt-4 p-4 rounded-lg bg-slate-800/40 border border-slate-700/50 text-left text-sm text-slate-300 animate-slide-up max-w-lg mx-auto">
            <h4 className="font-semibold text-white mb-2">Deterministic Scoring Engine Math:</h4>
            <p className="mb-2">
              Your score is calculated based on WHO/CDC risk weightings.
              Your score is based on 7 risk rules derived from WHO/CDC/ICMR guidelines.
              The maximum possible raw risk sum is <strong>17 points</strong>.
            </p>
            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 font-mono text-xs text-teal-300 mb-3">
              Triggered Raw Sum = {rawSum} / 17 max points <br />
              Formula: ({rawSum} / 17) × 10 = {data.score}
            </div>
            <p className="text-xs text-slate-400">
              *Note: Having symptoms does not directly add points. Symptoms are only checked to determine if you used antibiotics for a likely viral infection.
            </p>
          </div>
        )}
      </div>

      {data.reasons && data.reasons.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Risk Factors Identified
          </h3>
          <div className="space-y-1">
            {data.reasons.map((reason, idx) => (
              <ReasonCard key={idx} reason={reason} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
