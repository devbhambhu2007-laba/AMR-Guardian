import json
import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .models import QuestionnaireInput, RiskResult, GuidelineSnippet, ExplanationRequest, ExplanationResponse
from . import risk_engine
from . import session_store
from .llm_explain import generate_explanation

env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="AMR Awareness API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GUIDELINES_PATH = Path(__file__).parent / 'config' / 'guidelines.json'
with open(GUIDELINES_PATH, 'r', encoding='utf-8') as f:
    GUIDELINES = json.load(f)

@app.post("/assess", response_model=RiskResult)
def assess_risk(input_data: QuestionnaireInput):
    result = risk_engine.evaluate(input_data)
    rule_ids = [r.rule_id for r in result.reasons]
    session_store.create_session(result.session_id, result.score, result.category, rule_ids)
    return result

@app.get("/guideline/{ref_id}", response_model=GuidelineSnippet)
def get_guideline(ref_id: str):
    if ref_id not in GUIDELINES:
        raise HTTPException(status_code=404, detail="Guideline not found")
    data = GUIDELINES[ref_id]
    return GuidelineSnippet(title=data["title"], snippet=data["snippet"], source=data["source"])

@app.post("/explain", response_model=ExplanationResponse)
async def explain_risk(request: ExplanationRequest):
    return await generate_explanation(
        score=request.score,
        category=request.category,
        reasons=request.reasons,
        snippets=request.snippets
    )

@app.get("/health")
def health_check():
    return {"status": "ok"}
