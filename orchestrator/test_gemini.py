from agents.ocr_agent import extract_text

url = "https://res.cloudinary.com/dzl5iczuv/raw/upload/v1773682537/loan_documents/dmz59kemdg0k5maztw9d"

text = extract_text(url)

print(text)