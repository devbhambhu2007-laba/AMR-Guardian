from google import genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_answer(question, retrieved_docs):
    """
    Generates an answer using Gemini based only on the retrieved RAG context.
    """

    # Combine retrieved chunks into one context
    context = "\n\n".join(retrieved_docs)

    prompt = f"""
You are AMR Guardian, an AI assistant that educates users about antibiotic use and antimicrobial resistance.

IMPORTANT RULES:
- Answer ONLY using the provided context.
- If the answer is not available in the context, reply:
  "I don't have enough verified information in my knowledge base to answer that."
- Never diagnose diseases.
- Never prescribe antibiotics.
- Never recommend antibiotic dosages.
- Never tell users to start or stop medications.
- Encourage users to consult a qualified healthcare professional for medical advice.
- Explain concepts in simple, easy-to-understand language.
- Keep answers under 200 words.
- Be factual, concise, and educational.

======================
CONTEXT
======================
{context}

======================
QUESTION
======================
{question}
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-3.5-flash",
            contents=prompt,
        )

        return response.text

    except Exception as e:
        return f"Error generating response: {e}"