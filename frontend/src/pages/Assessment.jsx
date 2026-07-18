import React from 'react';
import { useNavigate } from 'react-router-dom';
import Questionnaire from '../components/Questionnaire/Questionnaire';
import { useAssessment } from '../hooks/useAssessment';

export default function Assessment() {
  const navigate = useNavigate();
  const { submit, loading, error } = useAssessment();

  const handleAssessmentSubmit = async (data) => {
    try {
      const results = await submit(data);
      // results contains assessData and explainData
      navigate('/results', { state: results });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 w-full py-10 flex-grow">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-heading mb-3">Risk Assessment</h1>
        <p className="text-slate-300">Complete this short questionnaire to evaluate your antibiotic usage habits.</p>
      </div>

      {error && (
        <div className="glass-card border-l-4 border-l-coral-500 p-4 mb-6 flex items-start gap-3 text-coral-200">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-bold">Submission Error</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <Questionnaire onSubmit={handleAssessmentSubmit} loading={loading} />
    </div>
  );
}
