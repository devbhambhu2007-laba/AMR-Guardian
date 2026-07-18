from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ChatRequest, ChatResponse, Source
from app.rag.retriever import retrieve
from app.rag.generator import generate_answer

app = FastAPI(title="AMR Guardian API")

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AMR Guardian Backend Running 🚀"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    docs, metadata = retrieve(request.message)

    answer = generate_answer(request.message, docs)

    sources = []

    for item in metadata:
        sources.append(
            Source(
                source=item["source"],
                page=item["page"] + 1
            )
        )

    return ChatResponse(
        answer=answer,
        sources=sources
    )