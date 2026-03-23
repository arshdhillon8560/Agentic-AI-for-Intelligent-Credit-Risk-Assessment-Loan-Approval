from agents.ocr_agent import extract_text

url = "https://res.cloudinary.com/dzl5iczuv/raw/upload/v1774269414/loan_documents/yarsrsncoulr7owwsp6u"

text = extract_text(url)

print(text)