from agents.ocr_agent import extract_text

url = "https://res.cloudinary.com/dzl5iczuv/raw/upload/v1773595375/loan_documents/qdorxucmj6l8o1tbxbcb"

text = extract_text(url)

print(text)