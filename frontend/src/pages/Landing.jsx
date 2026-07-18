import React from 'react';
import { useNavigate } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer/Disclaimer';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col justify-center animate-fade-in pb-12">
      <div className="max-w-4xl mx-auto px-4 w-full pt-10">
        
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-semibold tracking-wide">
            One Health Initiative
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Understanding <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              Antimicrobial Resistance
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Assess your risk of antibiotic misuse, learn how your habits contribute to the global AMR crisis, and discover how to protect our future.
          </p>
          
          <button 
            onClick={() => navigate('/assessment')}
            className="btn-primary text-lg px-8 py-4 flex items-center gap-2 mx-auto"
          >
            Start Assessment
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <div className="mb-12">
          <Disclaimer variant="inline" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="glass-card p-6 text-center hover:border-teal-400/30 transition-colors">
            <div className="text-3xl mb-3">🦠</div>
            <h3 className="font-bold text-xl mb-2 text-white">700K+</h3>
            <p className="text-sm text-slate-300">Deaths annually worldwide attributed to drug-resistant infections.</p>
          </div>
          <div className="glass-card p-6 text-center hover:border-amber-400/30 transition-colors">
            <div className="text-3xl mb-3">💊</div>
            <h3 className="font-bold text-xl mb-2 text-white">30%</h3>
            <p className="text-sm text-slate-300">Of antibiotic prescriptions in outpatient settings are completely unnecessary.</p>
          </div>
          <div className="glass-card p-6 text-center hover:border-coral-400/30 transition-colors">
            <div className="text-3xl mb-3">📉</div>
            <h3 className="font-bold text-xl mb-2 text-white">$100T</h3>
            <p className="text-sm text-slate-300">Potential economic cost by 2050 if no action is taken globally.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
