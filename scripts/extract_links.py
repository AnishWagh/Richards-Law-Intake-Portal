import pdfplumber

def extract_links(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        all_links = []
        for i, page in enumerate(pdf.pages):
            links = page.hyperlinks
            if links:
                for link in links:
                    # pdfplumber hyperlinks usually have 'uri' or 'url'
                    uri = link.get('uri') or link.get('url')
                    if uri:
                        all_links.append({"page": i+1, "uri": uri})
        return all_links

if __name__ == "__main__":
    pdf_path = "reference/Swans_Hackathon_Challenge_Brief.pdf"
    links = extract_links(pdf_path)
    for link in links:
        print(f"Page {link['page']}: {link['uri']}")
