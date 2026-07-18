from pydantic import BaseModel
from typing import List, Optional, Dict


class QuestionnaireInput(BaseModel):
    age: int
    symptoms: List[str]
    doctor_consulted: bool
    antibiotic_prescribed: Optional[str] = None
    days_prescribed: Optional[int] = None
    days_completed: Optional[int] = None
    doses_skipped: bool
    self_medicated: bool
    prior_use_6mo: bool
    shared_antibiotics: bool = False

class RiskReason(BaseModel):
    rule_id: str
    description: str
    weight: int
    guideline_ref: str

class RiskResult(BaseModel):
    score: float
    category: str

    summary: str
    explanation: str

    positives: List[str]
    recommendations: List[str]

    reasons: List[RiskReason]

    session_id: str

class ExplanationRequest(BaseModel):
    score: float
    category: str
    reasons: List[RiskReason]
    snippets: Dict[str, str]

class ExplanationResponse(BaseModel):
    explanation: str
    disclaimer: str
    filtered: bool

class GuidelineSnippet(BaseModel):
    title: str
    snippet: str
    source: str
