import requests
import tempfile
import os
import pytesseract
from pdf2image import convert_from_path

# Windows path to tesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

POPPLER_PATH = r"C:\poppler\Library\bin"


def extract_text(document_url):

    # download PDF from cloudinary
    response = requests.get(document_url)

    if response.status_code != 200:
        raise Exception("Failed to download document")

    # save temporary PDF
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as f:
        f.write(response.content)
        pdf_path = f.name

    # convert pdf → images
    images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)

    text = ""

    for img in images:
        page_text = pytesseract.image_to_string(img)
        text += page_text + "\n"

    os.remove(pdf_path)

    return text