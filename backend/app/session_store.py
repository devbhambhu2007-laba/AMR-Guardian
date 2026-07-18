from datetime import datetime
from typing import List, Dict, Optional

_SESSIONS = {}

def create_session(session_id: str, score: float, category: str, rule_ids: List[str]) -> Dict:
    session_data = {
        "session_id": session_id,
        "timestamp": datetime.utcnow().isoformat(),
        "risk_score": score,
        "risk_category": category,
        "triggered_rule_ids": rule_ids
    }
    _SESSIONS[session_id] = session_data
    return session_data

def get_session(session_id: str) -> Optional[Dict]:
    return _SESSIONS.get(session_id)
