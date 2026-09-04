import pypdfium2 as pdfium
import re

pdf = pdfium.PdfDocument('/home/ubuntu/workspace/Redbook/textbook/textbook.pdf')
print("Total pages:", len(pdf))

# Let's extract text of pages 2 to 7 (TOC)
toc_text = ""
for page_idx in range(1, 8):
    text = pdf[page_idx].get_textpage().get_text_range()
    print(f"--- Page {page_idx+1} ---")
    print(text[:500])
    toc_text += f"\n=== Page {page_idx+1} ===\n" + text

with open('/home/ubuntu/workspace/Redbook/textbook/toc_extracted.txt', 'w', encoding='utf-8') as f:
    f.write(toc_text)
print("Saved toc_extracted.txt")
