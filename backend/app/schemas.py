from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class Source(BaseModel):
    source: str
    page: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]