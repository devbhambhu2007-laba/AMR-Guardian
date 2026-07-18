from app.rag.retriever import retrieve

query = "Can antibiotics treat viral infections?"

results = retrieve(query)

print("=" * 80)
print("Top Result:")
print("=" * 80)

print(results["documents"][0][0])

print("\nMetadata:")
print(results["metadatas"][0][0])