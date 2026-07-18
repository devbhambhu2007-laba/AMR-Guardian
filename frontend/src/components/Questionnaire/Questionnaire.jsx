import React, { useState, useMemo } from 'react';

const SYMPTOMS = ["Fever", "Cough", "Cold", "Sore throat", "Runny nose", "Body ache", "Diarrhea", "Stomach ache", "Urinary pain", "Skin infection", "Wound/Cut", "Other"];
const ANTIBIOTICS = [
  "Amoxicillin (e.g. Mox, Augmentin)", 
  "Azithromycin (e.g. Azee, Zithromax)", 
  "Ciprofloxacin (e.g. Cifran)", 
  "Metronidazole (e.g. Flagyl)", 
  "Doxycycline / Tetracycline", 
  "Cephalosporin (e.g. Taxim, Ceftum)", 
  "Other / Don't know"
];

const YesNoCard = ({ label, description, value, onChange }) => (
  <div className="space-y-3">
    <p className="font-medium text-lg text-white mb-1">{label}</p>
    {description && <p className="text-sm text-slate-400 mb-3">{description}</p>}
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onChange(true); }}
        className={`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
          value === true 
            ? 'border-teal-400 bg-teal-500/20 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
            : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
        }`}
      >
        ✓ Yes
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onChange(false); }}
        className={`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
          value === false 
            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
            : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
        }`}
      >
        ✗ No
      </button>
    </div>
  </div>
);

export default function Questionnaire({ onSubmit, loading }) {
  const [data, setData] = useState({
    age: '',
    symptoms: [],
    doctor_consulted: null,
    antibiotic_prescribed: '',
    self_medicated: null,
    days_prescribed: '',
    days_completed: '',
    doses_skipped: null,
    prior_use_6mo: null,
    shared_antibiotics: null,
  });

  const update = (fields) => setData(prev => ({ ...prev, ...fields }));

  const toggleSymptom = (sym) => {
    if (data.symptoms.includes(sym)) {
      update({ symptoms: data.symptoms.filter(s => s !== sym) });
    } else {
      update({ symptoms: [...data.symptoms, sym] });
    }
  };

  // ── Dynamic step list: changes based on answers ──
  const steps = useMemo(() => {
    const s = [];

    // Step 1: Always — symptoms & age
    s.push({ id: 'symptoms', label: 'Your Symptoms' });

    // Step 2: Always — doctor consultation
    s.push({ id: 'doctor', label: 'Doctor Consultation' });

    // Step 3: Only if NO doctor → ask about self-medication
    if (data.doctor_consulted === false) {
      s.push({ id: 'self_med', label: 'Self-Medication' });
    }

    // Step 4: Only if they actually took antibiotics (prescribed OR self-medicated)
    const tookAntibiotics = data.doctor_consulted === true || data.self_medicated === true;
    if (tookAntibiotics) {
      s.push({ id: 'course', label: 'Course Completion' });
      s.push({ id: 'doses', label: 'Dose Adherence' });
    }

    // Step N: Always — history
    s.push({ id: 'history', label: 'Antibiotic History' });

    return s;
  }, [data.doctor_consulted, data.self_medicated]);

  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[stepIdx] || steps[0];
  const totalSteps = steps.length;
  const isLastStep = stepIdx === totalSteps - 1;

  const handleNext = () => {
    if (stepIdx < totalSteps - 1) {
      setStepIdx(i => i + 1);
    }
  };
  const handleBack = () => {
    if (stepIdx > 0) {
      setStepIdx(i => i - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...data,
      age: parseInt(data.age, 10),
      doctor_consulted: data.doctor_consulted === true,
      self_medicated: data.self_medicated === true,
      doses_skipped: data.doses_skipped === true,
      prior_use_6mo: data.prior_use_6mo === true,
      shared_antibiotics: data.shared_antibiotics === true,
      days_prescribed: data.days_prescribed ? parseInt(data.days_prescribed, 10) : null,
      days_completed: data.days_completed ? parseInt(data.days_completed, 10) : null,
    });
  };

  // ── Validation per step ──
  const canProceed = () => {
    switch (currentStep.id) {
      case 'symptoms': return data.age > 0 && data.symptoms.length > 0;
      case 'doctor': return data.doctor_consulted !== null;
      case 'self_med': return data.self_medicated !== null;
      case 'course': return true;
      case 'doses': return data.doses_skipped !== null;
      case 'history': return data.prior_use_6mo !== null && data.shared_antibiotics !== null;
      default: return true;
    }
  };

  // ── Info bar: shows why a step was skipped ──
  const getSkipNote = () => {
    if (currentStep.id === 'history' && data.doctor_consulted === true && data.self_medicated !== true) {
      return "✅ You consulted a doctor — self-medication question was skipped.";
    }
    if (currentStep.id === 'course' && data.doctor_consulted === true) {
      return "📋 Since you were prescribed antibiotics, let's check if the course was completed.";
    }
    if (currentStep.id === 'self_med') {
      return "⚠️ Since you didn't consult a doctor, we need to check if you self-medicated.";
    }
    return null;
  };

  const skipNote = getSkipNote();

  return (
    <div className="glass-card max-w-2xl mx-auto p-6 md:p-8 animate-fade-in relative overflow-hidden">
      {/* Question counter */}
      <div className="mb-2 text-center">
        <span className="text-xs uppercase tracking-widest text-teal-400 font-semibold">
          Question {stepIdx + 1} of {totalSteps}
          {totalSteps < 6 && <span className="text-slate-500 ml-2">(adaptive)</span>}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
          <span>{currentStep.label}</span>
          <span>{Math.round(((stepIdx + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${((stepIdx + 1) / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      {/* Skip note */}
      {skipNote && (
        <div className="mb-4 text-xs text-slate-400 bg-slate-800/30 rounded-lg p-2.5 border border-slate-700/30">
          {skipNote}
        </div>
      )}

      <div className="min-h-[320px] flex flex-col justify-between">
        <div className="flex-grow">

          {/* ── SYMPTOMS ── */}
          {currentStep.id === 'symptoms' && (
            <div className="animate-slide-right" key="symptoms">
              <h2 className="text-2xl font-semibold mb-6">What symptoms are you experiencing?</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Age</label>
                <input 
                  type="number" min="1" max="120"
                  value={data.age}
                  onChange={e => update({ age: e.target.value })}
                  onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Symptoms (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map(sym => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`chip ${data.symptoms.includes(sym) ? 'selected' : ''}`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── DOCTOR ── */}
          {currentStep.id === 'doctor' && (
            <div className="animate-slide-right" key="doctor">
              <h2 className="text-2xl font-semibold mb-6">Did you consult a doctor?</h2>
              
              <YesNoCard
                label="Have you consulted a doctor before taking any antibiotic for this illness?"
                description="Using antibiotics without medical guidance is a major driver of antimicrobial resistance."
                value={data.doctor_consulted}
                onChange={(v) => update({ doctor_consulted: v, antibiotic_prescribed: '' })}
              />

              {data.doctor_consulted === true && (
                <div className="animate-slide-up mt-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Which antibiotic was prescribed?</label>
                  <select 
                    value={data.antibiotic_prescribed}
                    onChange={e => update({ antibiotic_prescribed: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="" disabled>Select an option</option>
                    {ANTIBIOTICS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* ── SELF-MEDICATION (only if no doctor) ── */}
          {currentStep.id === 'self_med' && (
            <div className="animate-slide-right" key="self_med">
              <h2 className="text-2xl font-semibold mb-6">Self-Medication Check</h2>
              
              <YesNoCard
                label="Did you take antibiotics without a prescription, or use leftover antibiotics from an older illness?"
                description="Self-medication with antibiotics—especially leftover ones—often means the wrong drug, wrong dose, or expired medicine, all of which accelerate resistance."
                value={data.self_medicated}
                onChange={(v) => update({ self_medicated: v })}
              />
            </div>
          )}

          {/* ── COURSE COMPLETION (only if took antibiotics) ── */}
          {currentStep.id === 'course' && (
            <div className="animate-slide-right" key="course">
              <h2 className="text-2xl font-semibold mb-6">Did you complete the full course?</h2>
              <p className="text-sm text-slate-400 mb-6">Stopping antibiotics early—even if you feel better—allows partially resistant bacteria to survive and multiply.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Days Prescribed</label>
                  <input 
                    type="number" min="0"
                    value={data.days_prescribed}
                    onChange={e => update({ days_prescribed: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. 7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Days Actually Completed</label>
                  <input 
                    type="number" min="0"
                    value={data.days_completed}
                    onChange={e => update({ days_completed: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. 3"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">Leave blank if you don't remember.</p>
            </div>
          )}

          {/* ── DOSE ADHERENCE (only if took antibiotics) ── */}
          {currentStep.id === 'doses' && (
            <div className="animate-slide-right" key="doses">
              <h2 className="text-2xl font-semibold mb-6">Did you skip any doses?</h2>
              
              <YesNoCard
                label="Have you missed or skipped one or more doses during your antibiotic course?"
                description="Skipping doses creates sub-therapeutic drug levels in your body, giving bacteria the perfect window to develop resistance."
                value={data.doses_skipped}
                onChange={(v) => update({ doses_skipped: v })}
              />
            </div>
          )}

          {/* ── HISTORY (always last) ── */}
          {currentStep.id === 'history' && (
            <div className="animate-slide-right" key="history">
              <h2 className="text-2xl font-semibold mb-6">Antibiotic History</h2>
              
              <div className="space-y-6">
                <YesNoCard
                  label="Have you taken antibiotics in the last 6 months (for a different illness)?"
                  description="Frequent antibiotic use within short periods increases selective pressure on bacteria."
                  value={data.prior_use_6mo}
                  onChange={(v) => update({ prior_use_6mo: v })}
                />

                <div className="border-t border-slate-700/50 pt-6">
                  <YesNoCard
                    label="Have you ever shared your antibiotics with a family member or friend?"
                    description="Sharing antibiotics means the wrong drug for the wrong person—a dangerous practice that fuels AMR."
                    value={data.shared_antibiotics}
                    onChange={(v) => update({ shared_antibiotics: v })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation — no <form>, just buttons */}
        <div className="mt-8 flex justify-between pt-4 border-t border-slate-700/50">
          {stepIdx > 0 ? (
            <button type="button" onClick={handleBack} className="btn-secondary">
              ← Back
            </button>
          ) : <div></div>}
          
          {!isLastStep ? (
            <button 
              type="button" 
              onClick={handleNext} 
              disabled={!canProceed()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question →
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
              className="btn-primary relative disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : "🔬 Calculate My Risk"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
