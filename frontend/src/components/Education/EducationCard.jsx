import React, { useState } from 'react';

export default function EducationCard({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-64 perspective-1000 cursor-pointer animate-fade-in group"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`w-full h-full relative transform-style-3d transition-transform duration-500 ease-in-out ${flipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front */}
        <div className="absolute inset-0 backface-hidden glass-card flex flex-col justify-center items-center p-6 text-center group-hover:border-teal-400/50 transition-colors">
          <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mb-4 text-3xl">
            💡
          </div>
          <h3 className="text-xl font-bold text-white">{card.concept}</h3>
          <p className="text-sm text-teal-400 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Tap to flip ↺</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card-light p-6 flex flex-col justify-between border-t-4 border-t-cyan-500">
          <div>
            <h4 className="font-bold text-cyan-300 mb-2">{card.concept}</h4>
            <p className="text-sm text-slate-200">{card.explanation}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs font-semibold text-amber-400">{card.impact}</p>
            <p className="text-[10px] text-slate-400 mt-1 opacity-70">Source: {card.source}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
