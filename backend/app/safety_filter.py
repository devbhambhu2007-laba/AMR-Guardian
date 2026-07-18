import re
from typing import Tuple, List

DRUG_NAMES = [
    'Amoxicillin', 'Amoxyclav', 'Ampicillin', 'Azithromycin', 'Ceftriaxone', 
    'Cefixime', 'Cephalexin', 'Cefalexin', 'Ciprofloxacin', 'Clarithromycin', 
    'Clindamycin', 'Co-amoxiclav', 'Doxycycline', 'Erythromycin', 'Flucloxacillin', 
    'Gentamicin', 'Levofloxacin', 'Linezolid', 'Meropenem', 'Metronidazole', 
    'Minocycline', 'Moxifloxacin', 'Nitrofurantoin', 'Norfloxacin', 'Ofloxacin', 
    'Penicillin', 'Piperacillin', 'Rifampicin', 'Sulfamethoxazole', 'Tetracycline', 
    'Trimethoprim', 'Vancomycin', 'Augmentin', 'Bactrim', 'Zithromax', 'Cipro', 
    'Flagyl', 'Keflex', 'Levaquin', 'Zyvox'
]

DOSAGE_UNITS = [
    'mg', 'ml', 'mcg', 'microgram', 'milligram', 'milliliter', 'tablet', 
    'capsule', 'dose of', 'units', 'twice daily', 'three times daily', 
    'bid', 'tid', 'qid'
]

DIAGNOSTIC_PHRASES = [
    r'you have', r'you are suffering', r'you are infected', r'diagnosis is', 
    r'diagnosed with', r'your condition is', r"you've got"
]

DRUG_NAMES_PATTERN = re.compile(r'\b(?:' + '|'.join(re.escape(d) for d in DRUG_NAMES) + r')\b', re.IGNORECASE)
DOSAGE_UNITS_PATTERN = re.compile(r'\b(?:' + '|'.join(re.escape(d) for d in DOSAGE_UNITS) + r')\b', re.IGNORECASE)
DIAGNOSTIC_PHRASES_PATTERN = re.compile(r'\b(?:' + '|'.join(d for d in DIAGNOSTIC_PHRASES) + r')\b', re.IGNORECASE)

def check_safety(text: str) -> Tuple[bool, List[str]]:
    violations = []
    if DRUG_NAMES_PATTERN.search(text):
        violations.append("Mentioned drug names")
    if DOSAGE_UNITS_PATTERN.search(text):
        violations.append("Mentioned dosage units")
    if DIAGNOSTIC_PHRASES_PATTERN.search(text):
        violations.append("Contained diagnostic phrasing")
        
    return len(violations) == 0, violations

def filter_output(text: str) -> str | None:
    is_safe, violations = check_safety(text)
    if not is_safe:
        return None
    return text
