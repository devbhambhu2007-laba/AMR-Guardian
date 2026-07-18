from sentence_transformers import SentenceTransformer

# Load embedding model only once
embedding_model = SentenceTransformer("BAAI/bge-small-en-v1.5")


def get_embedding(text: str):
    return embedding_model.encode(text).tolist()