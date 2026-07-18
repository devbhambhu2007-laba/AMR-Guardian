const API_BASE = ''  // Uses Vite proxy

export async function submitAssessment(data) {
  const res = await fetch(`${API_BASE}/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Assessment failed')
  return res.json()
}

export async function getGuideline(refId) {
  const res = await fetch(`${API_BASE}/guideline/${refId}`)
  if (!res.ok) throw new Error('Guideline not found')
  return res.json()
}

export async function getExplanation(data) {
  const res = await fetch(`${API_BASE}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Explanation failed')
  return res.json()
}
