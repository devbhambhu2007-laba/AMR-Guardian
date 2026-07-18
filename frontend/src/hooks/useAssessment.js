import { useState } from 'react'
import { submitAssessment, getGuideline, getExplanation } from '../utils/api'

export function useAssessment() {
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [riskResult, setRiskResult] = useState(null)
  const [explanation, setExplanation] = useState(null)

  const handleNext = () => setCurrentStep((prev) => prev + 1)
  const handleBack = () => setCurrentStep((prev) => prev - 1)
  const updateFormData = (data) => setFormData((prev) => ({ ...prev, ...data }))

  const submit = async (finalData) => {
    setLoading(true)
    setError(null)
    const merged = { ...formData, ...finalData }
    
    // Map frontend field names to backend schema
    const payload = {
      age: merged.age,
      symptoms: merged.symptoms.map(s => s.toLowerCase()),
      doctor_consulted: merged.doctor_consulted,
      antibiotic_prescribed: merged.antibiotic_name || null,
      days_prescribed: merged.days_prescribed || null,
      days_completed: merged.days_completed || null,
      doses_skipped: merged.doses_skipped,
      self_medicated: merged.self_medicated,
      prior_use_6mo: merged.prior_use_6mo
    }

    try {
      // 1. Submit Assessment — backend returns { score, category, reasons, session_id }
      const assessData = await submitAssessment(payload)
      
      // 2. Fetch guideline snippets for each triggered reason
      const snippetsMap = {}
      if (assessData.reasons && assessData.reasons.length > 0) {
        const guidelinePromises = assessData.reasons
          .filter(r => r.guideline_ref)
          .map(async (r) => {
            try {
              const g = await getGuideline(r.guideline_ref)
              return { ref: r.guideline_ref, snippet: g.snippet, source: g.source, title: g.title }
            } catch {
              return { ref: r.guideline_ref, snippet: '', source: '', title: '' }
            }
          })
        
        const guidelines = await Promise.all(guidelinePromises)
        guidelines.forEach(g => {
          if (g.snippet) {
            snippetsMap[g.ref] = g.snippet
          }
        })

        // Attach snippet info to each reason for the ReasonCard to display
        assessData.reasons.forEach(r => {
          const g = guidelines.find(gl => gl.ref === r.guideline_ref)
          if (g) {
            r.snippet = g.snippet
            r.source = g.source
            r.title = g.title
          }
        })
      }
      
      setRiskResult(assessData)

      // 3. Get LLM explanation — backend expects { score, category, reasons: [RiskReason], snippets: {ref_id: text} }
      const explainPayload = {
        score: assessData.score,
        category: assessData.category,
        reasons: assessData.reasons.map(r => ({
          rule_id: r.rule_id,
          description: r.description,
          weight: r.weight,
          guideline_ref: r.guideline_ref
        })),
        snippets: snippetsMap
      }
      const explainData = await getExplanation(explainPayload)
      setExplanation(explainData)
      
      return { assessData, explainData }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    updateFormData,
    currentStep,
    handleNext,
    handleBack,
    submit,
    loading,
    error,
    riskResult,
    explanation
  }
}
