import PyPDF2

pdf_path = r"C:\Users\aftan\Downloads\ddi-documentation-english_microdata-4482.pdf"
try:
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        print(f"Total Pages: {len(reader.pages)}")
        text = ""
        for i in range(min(5, len(reader.pages))):
            text += reader.pages[i].extract_text() + "\n"
        print(text[:2000])
except Exception as e:
    print(f"Error reading PDF: {e}")
