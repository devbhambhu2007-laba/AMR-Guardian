from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader


def load_documents(documents_folder="documents"):
    docs = []

    documents_path = Path(documents_folder)

    pdf_files = documents_path.rglob("*.pdf")

    for pdf in pdf_files:
        print(f"Loading {pdf.name}")

        loader = PyPDFLoader(str(pdf))
        docs.extend(loader.load())

    return docs