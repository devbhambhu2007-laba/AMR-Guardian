import json
import uuid
from pathlib import Path
from .models import QuestionnaireInput, RiskResult, RiskReason

RULES_PATH = Path(__file__).parent / "config" / "rules.json"

with open(RULES_PATH, "r", encoding="utf-8") as f:
    RULES = json.load(f)

MAX_RAW_SUM = sum(r["weight"] for r in RULES)


def evaluate(input_data: QuestionnaireInput) -> RiskResult:
    triggered_reasons = []
    raw_sum = 0

    for rule in RULES:
        triggered = False

        if rule["id"] == "RULE-01":
            triggered = not input_data.doctor_consulted

        elif rule["id"] == "RULE-02":
            if (
                input_data.days_completed is not None
                and input_data.days_prescribed is not None
                and input_data.days_completed < input_data.days_prescribed
            ):
                triggered = True

        elif rule["id"] == "RULE-03":
            triggered = input_data.self_medicated

        elif rule["id"] == "RULE-04":
            symptoms_lower = {s.lower() for s in input_data.symptoms}
            viral_set = {
                "cold",
                "cough",
                "sore throat",
                "runny nose",
                "body ache",
                "fever",
            }

            if (
                len(symptoms_lower) > 0
                and symptoms_lower.issubset(viral_set)
                and not input_data.doctor_consulted
            ):
                triggered = True

        elif rule["id"] == "RULE-05":
            triggered = input_data.doses_skipped

        elif rule["id"] == "RULE-06":
            triggered = input_data.prior_use_6mo

        elif rule["id"] == "RULE-07":
            triggered = input_data.shared_antibiotics

        if triggered:
            raw_sum += rule["weight"]

            triggered_reasons.append(
                RiskReason(
                    rule_id=rule["id"],
                    description=rule["description"],
                    weight=rule["weight"],
                    guideline_ref=rule["guideline_ref"],
                )
            )

    # ---------------- Score ---------------- #

    score = round((raw_sum / MAX_RAW_SUM) * 10, 1)

    if score <= 3:
        category = "Low"
    elif score <= 6:
        category = "Medium"
    else:
        category = "High"

    # ---------------- Summary ---------------- #

    if category == "Low":
        summary = (
            "Your responses indicate a low risk of antibiotic misuse. "
            "You generally follow responsible antibiotic practices."
        )

    elif category == "Medium":
        summary = (
            "Your answers indicate a moderate risk of antibiotic misuse. "
            "Some of your habits may increase the chance of antimicrobial resistance."
        )

    else:
        summary = (
            "Your responses indicate a high risk of antibiotic misuse. "
            "Several practices reported in this assessment are associated with the development of antimicrobial resistance."
        )

    # ---------------- Positives ---------------- #

    positives = []

    if input_data.doctor_consulted:
        positives.append(
            "You consulted a healthcare professional before using antibiotics."
        )

    if not input_data.self_medicated:
        positives.append(
            "You avoided self-medicating with antibiotics."
        )

    if not input_data.shared_antibiotics:
        positives.append(
            "You did not share antibiotics with others."
        )

    if not input_data.doses_skipped:
        positives.append(
            "You reported taking your antibiotic doses on time."
        )

    if (
        input_data.days_completed is not None
        and input_data.days_prescribed is not None
        and input_data.days_completed >= input_data.days_prescribed
    ):
        positives.append(
            "You completed the prescribed antibiotic course."
        )

    # ---------------- Recommendations ---------------- #

    recommendations = []

    if not input_data.doctor_consulted:
        recommendations.append(
            "Consult a qualified healthcare professional before taking antibiotics."
        )

    if input_data.self_medicated:
        recommendations.append(
            "Avoid self-medication and only use antibiotics when prescribed."
        )

    if (
        input_data.days_completed is not None
        and input_data.days_prescribed is not None
        and input_data.days_completed < input_data.days_prescribed
    ):
        recommendations.append(
            "Complete the full prescribed antibiotic course even if you feel better."
        )

    if input_data.doses_skipped:
        recommendations.append(
            "Take every antibiotic dose at the prescribed time."
        )

    if input_data.prior_use_6mo:
        recommendations.append(
            "Avoid unnecessary repeated antibiotic use within short periods."
        )

    if input_data.shared_antibiotics:
        recommendations.append(
            "Never share antibiotics with family members or friends."
        )

    # ---------------- Explanation ---------------- #

    if len(triggered_reasons) == 0:
        explanation = (
            "No major antibiotic misuse behaviours were detected based on your responses. "
            "Continue following safe antibiotic practices and always seek medical advice when needed."
        )

    else:
        explanation = (
            "This assessment identified behaviours that may contribute to antimicrobial resistance. "
            "The main factors affecting your score were: "
            + ", ".join(reason.description for reason in triggered_reasons)
            + ". Improving these habits can significantly reduce your future risk."
        )

    session_id = str(uuid.uuid4())

    return RiskResult(
        score=score,
        category=category,
        summary=summary,
        explanation=explanation,
        positives=positives,
        recommendations=recommendations,
        reasons=triggered_reasons,
        session_id=session_id,
    )