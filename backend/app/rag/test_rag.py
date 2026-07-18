from app.rag.retriever import retrieve
from app.rag.generator import generate_answer

question = "Can antibiotics cure viral infections?"

docs, metadata = retrieve(question)

answer = generate_answer(question, docs)

print("=" * 80)
print("QUESTION")
print("=" * 80)
print(question)

print("\n" + "=" * 80)
print("ANSWER")
print("=" * 80)
print(answer)

print("\n" + "=" * 80)
print("SOURCES")
print("=" * 80)

for source in metadata:
    print(f"{source['source']}  |  Page {source['page'] + 1}")