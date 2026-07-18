from .embeddings import get_embedding
from .vector_store import collection


def retrieve(query, k=5):
    query_embedding = get_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=k
    )

    return results["documents"][0], results["metadatas"][0]