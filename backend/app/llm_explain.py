import os
import asyncio
from google import genai
from dotenv import load_dotenv
from .models import ExplanationResponse
from .safety_filter import filter_output

SYSTEM_PROMPT = """You generate a short, plain-language explanation of antimicrobial resistance risk for a general audience.
You will be given: a risk score, a list of triggered risk reasons, and a paraphrased public-health guideline snippet for each reason.
Rules:
- Under 100 words.
- Do not diagnose any illness as bacterial or viral.
- Do not name or suggest any antibiotic, drug, or dosage.
- Do not give any treatment instruction.
- Always end with: "Please consult a registered medical practitioner."
- Explain only why the reported behavior is associated with antimicrobial resistance, based on the provided guideline snippet."""

STRICTER_FALLBACK_PROMPT = SYSTEM_PROMPT + "\nCRITICAL: You must not mention any medication name, dosage, or diagnostic statement under any circumstances. Respond ONLY about behavioral risk factors."

STATIC_FALLBACK = "Based on the assessment, your antibiotic usage patterns may contribute to antimicrobial resistance risk. Please consult a registered medical practitioner for personalized guidance."
DISCLAIMER = "This application is not a diagnostic tool. It cannot identify bacterial infection or prescribe treatment. Always consult a registered medical practitioner."

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 10


async def _call_gemini(api_key, user_prompt, system_prompt):
    """Call Gemini API with automatic retry on 429 rate-limit errors."""
    client = genai.Client(api_key=api_key)
    
    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model='gemini-2.0-flash-lite',
                contents=user_prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                )
            )
            return response.text
        except Exception as e:
            error_str = str(e)
            if '429' in error_str or 'RESOURCE_EXHAUSTED' in error_str:
                if attempt < MAX_RETRIES - 1:
                    wait_time = RETRY_DELAY_SECONDS * (attempt + 1)
                    print(f"DEBUG [Gemini]: Rate limited (attempt {attempt+1}/{MAX_RETRIES}), retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    print(f"DEBUG [Gemini]: Rate limit exhausted after {MAX_RETRIES} retries")
                    return None
            else:
                print(f"DEBUG [Gemini]: API error - {e}")
                return None
    return None


async def generate_explanation(score: float, category: str, reasons: list, snippets: dict) -> ExplanationResponse:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("DEBUG: GEMINI_API_KEY not found in environment")
        return ExplanationResponse(explanation=STATIC_FALLBACK, disclaimer=DISCLAIMER, filtered=True)

    user_prompt = f"Risk Score: {score}/10 ({category} Risk)\nTriggered Risk Factors:\n"
    for r in reasons:
        user_prompt += f"- {r.description} (+{r.weight} pts)\n"
    user_prompt += "\nRelevant WHO/CDC/ICMR Guidelines:\n"
    for ref_id, snippet in snippets.items():
        user_prompt += f"[{ref_id}]: {snippet}\n"

    try:
        # Attempt 1: Primary prompt
        explanation_text = await _call_gemini(api_key, user_prompt, SYSTEM_PROMPT)
        
        if explanation_text:
            filtered_text = filter_output(explanation_text)
            if filtered_text:
                return ExplanationResponse(explanation=filtered_text, disclaimer=DISCLAIMER, filtered=False)
            print("DEBUG: First output failed safety filter, retrying with stricter prompt")
        
        # Attempt 2: Stricter prompt
        retry_text = await _call_gemini(api_key, user_prompt, STRICTER_FALLBACK_PROMPT)
        
        if retry_text:
            filtered_retry = filter_output(retry_text)
            if filtered_retry:
                return ExplanationResponse(explanation=filtered_retry, disclaimer=DISCLAIMER, filtered=False)
            print("DEBUG: Second output also failed safety filter")
        
        print("DEBUG: All attempts failed. Returning static fallback.")
        return ExplanationResponse(explanation=STATIC_FALLBACK, disclaimer=DISCLAIMER, filtered=True)

    except Exception as e:
        print(f"DEBUG: Exception: {e}")
        return ExplanationResponse(explanation=STATIC_FALLBACK, disclaimer=DISCLAIMER, filtered=True)
