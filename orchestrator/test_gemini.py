from agents.ocr_agent import extract_text

url = "https://res.cloudinary.com/dzl5iczuv/raw/upload/v1773603144/loan_documents/file.pdf"

text = extract_text(url)

print(text)