from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class Source(BaseModel):
    source: str
    page: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]

from typing import Optional


class AssessmentRequest(BaseModel):
    age: int

    symptoms: list[str] = []

    doctor_consulted: bool

    antibiotic_prescribed: Optional[str] = None

    days_prescribed: Optional[int] = None

    days_completed: Optional[int] = None

    doses_skipped: int = 0

    self_medicated: bool

    prior_use_6mo: bool


class Reason(BaseModel):
    rule_id: str
    description: str
    weight: int
    guideline_ref: str


class AssessmentResponse(BaseModel):
    score: int
    category: str
    reasons: list[Reason]
    session_id: str