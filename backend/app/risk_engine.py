import json
import uuid
from pathlib import Path
from .models import QuestionnaireInput, RiskResult, RiskReason

RULES_PATH = Path(__file__).parent / 'config' / 'rules.json'
with open(RULES_PATH, 'r', encoding='utf-8') as f:
    RULES = json.load(f)

MAX_RAW_SUM = sum(r['weight'] for r in RULES)  # 17

def evaluate(input_data: QuestionnaireInput) -> RiskResult:
    triggered_reasons = []
    raw_sum = 0
    
    for rule in RULES:
        triggered = False
        if rule['id'] == 'RULE-01':
            triggered = not input_data.doctor_consulted
        elif rule['id'] == 'RULE-02':
            if input_data.days_completed is not None and input_data.days_prescribed is not None:
                if input_data.days_completed < input_data.days_prescribed:
                    triggered = True
        elif rule['id'] == 'RULE-03':
            triggered = input_data.self_medicated
        elif rule['id'] == 'RULE-04':
            symptoms_lower = {s.lower() for s in input_data.symptoms}
            viral_set = {'cold', 'cough', 'sore throat', 'runny nose', 'body ache', 'fever'}
            if symptoms_lower.issubset(viral_set) and len(symptoms_lower) > 0 and not input_data.doctor_consulted:
                triggered = True
        elif rule['id'] == 'RULE-05':
            triggered = input_data.doses_skipped
        elif rule['id'] == 'RULE-06':
            triggered = input_data.prior_use_6mo
        elif rule['id'] == 'RULE-07':
            triggered = input_data.shared_antibiotics
            
        if triggered:
            raw_sum += rule['weight']
            triggered_reasons.append(RiskReason(
                rule_id=rule['id'],
                description=rule['description'],
                weight=rule['weight'],
                guideline_ref=rule['guideline_ref']
            ))
            
    score = round((raw_sum / MAX_RAW_SUM) * 10, 1)
    
    if score <= 3:
        category = "Low"
    elif score <= 6:
        category = "Medium"
    else:
        category = "High"
        
    session_id = str(uuid.uuid4())
    
    return RiskResult(
        score=score,
        category=category,
        reasons=triggered_reasons,
        session_id=session_id
    )
