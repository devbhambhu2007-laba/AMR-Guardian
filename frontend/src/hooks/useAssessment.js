import { useState } from 'react'
import { submitAssessment, getGuideline, getExplanation } from '../utils/api'

export function useAssessment() {
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(1)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [riskResult, setRiskResult] = useState(null)
  const [explanation, setExplanation] = useState(null)

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const updateFormData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data
    }))
  }


  const submit = async (finalData) => {

    if (loading) return

    setLoading(true)
    setError(null)

    try {

      // Merge all form steps
      const merged = {
        ...formData,
        ...finalData
      }


      // Convert frontend data -> backend schema
      const payload = {
        age: Number(merged.age || 0),

        symptoms: Array.isArray(merged.symptoms)
          ? merged.symptoms.map((s) => s.toLowerCase())
          : [],

        doctor_consulted: Boolean(
          merged.doctor_consulted
        ),

        antibiotic_prescribed:
          merged.antibiotic_name || null,

        days_prescribed:
          merged.days_prescribed
            ? Number(merged.days_prescribed)
            : null,

        days_completed:
          merged.days_completed
            ? Number(merged.days_completed)
            : null,

        doses_skipped:
          Number(merged.doses_skipped || 0),

        self_medicated:
          Boolean(merged.self_medicated),

        prior_use_6mo:
          Boolean(merged.prior_use_6mo)
      }



      /*
        STEP 1:
        Submit assessment
        Backend response:
        {
          score,
          category,
          reasons,
          session_id
        }
      */

      const assessData = await submitAssessment(payload)



      /*
        STEP 2:
        Fetch guideline snippets
      */

      const snippetsMap = {}

      let enrichedReasons = []


      if (
        Array.isArray(assessData.reasons) &&
        assessData.reasons.length > 0
      ) {


        const guidelinePromises =
          assessData.reasons
            .filter(
              (reason) => reason.guideline_ref
            )
            .map(async (reason) => {

              try {

                const guideline =
                  await getGuideline(
                    reason.guideline_ref
                  )


                return {
                  ref: reason.guideline_ref,
                  snippet:
                    guideline.snippet || "",
                  source:
                    guideline.source || "",
                  title:
                    guideline.title || ""
                }

              } catch {

                return {
                  ref: reason.guideline_ref,
                  snippet: "",
                  source: "",
                  title: ""
                }

              }

            })


        const guidelines =
          await Promise.all(
            guidelinePromises
          )



        guidelines.forEach((g) => {

          if (g.snippet) {

            snippetsMap[g.ref] =
              g.snippet

          }

        })



        // Add guideline information
        enrichedReasons =
          assessData.reasons.map((reason) => {

            const guideline =
              guidelines.find(
                (g) =>
                  g.ref === reason.guideline_ref
              )


            return {
              ...reason,

              snippet:
                guideline?.snippet || "",

              source:
                guideline?.source || "",

              title:
                guideline?.title || ""
            }

          })


      } else {

        enrichedReasons =
          assessData.reasons || []

      }



      const updatedAssessment = {

        ...assessData,

        reasons: enrichedReasons

      }


      setRiskResult(updatedAssessment)




      /*
        STEP 3:
        Generate AI explanation
      */


      try {


        const explainPayload = {

          score:
            updatedAssessment.score,

          category:
            updatedAssessment.category,


          reasons:
            enrichedReasons.map((reason) => ({

              rule_id:
                reason.rule_id,

              description:
                reason.description,

              weight:
                reason.weight,

              guideline_ref:
                reason.guideline_ref

            })),


          snippets:
            snippetsMap

        }



        const explainData =
          await getExplanation(
            explainPayload
          )


        setExplanation(explainData)


        return {
          assessData: updatedAssessment,
          explainData
        }


      } catch (explainError) {


        console.error(
          "Explanation error:",
          explainError
        )


        const fallbackExplanation = {

          explanation:
            "Assessment completed. AI explanation unavailable."

        }


        setExplanation(
          fallbackExplanation
        )


        return {
          assessData: updatedAssessment,
          explainData: fallbackExplanation
        }

      }



    } catch (err) {


      console.error(
        "Assessment error:",
        err
      )


      setError(
        err.message ||
        "Something went wrong"
      )


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