from loader import load_documents
from chunker import chunk_documents

docs = load_documents()

print(f"Loaded {len(docs)} pages")

chunks = chunk_documents(docs)

print(f"Created {len(chunks)} chunks")

print("\nFirst Chunk:\n")

print(chunks[0].page_content)