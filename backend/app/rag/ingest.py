from .loader import load_documents
from .chunker import chunk_documents
from .embeddings import get_embedding
from .vector_store import collection

docs = load_documents()
chunks = chunk_documents(docs)

for i, chunk in enumerate(chunks):

    embedding = get_embedding(chunk.page_content)

    collection.add(
        ids=[str(i)],
        embeddings=[embedding],
        documents=[chunk.page_content],
        metadatas=[chunk.metadata]
    )

print(f"Stored {len(chunks)} chunks!")