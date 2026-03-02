from docx import Document
import os

def replace_placeholders(file_path, output_path):
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return

    doc = Document(file_path)
    
    replacements = {
        "[Client Name]": "{{ matter.client.name }}",
        "[Law Firm Name]": "Richards & Law",
        "[Date of Accident]": "{{ matter.custom_fields.accident_date }}",
        "[Defendant Name]": "{{ matter.custom_fields.opposing_party_name }}",
        "[Accident Location]": "{{ matter.custom_fields.accident_location }}",
        "[Registration Plate Number of the Client’s Car]": "{{ matter.custom_fields.vehicle_registration_plate }}",
        "[Statute of Limitations Date]": "{{ matter.custom_fields.statute_of_limitations_date }}",
        "[Name of Client]": "{{ matter.client.name }}",
        "[Name of Attorney]": "{{ matter.responsible_staff.name }}",
        # Gender handling - using names for now as Clio's gender fields are tricky
        "[his/her]": "the Client's",
        "[he/she]": "the Client",
    }

    # Handling paragraphs
    for para in doc.paragraphs:
        for old, new in replacements.items():
            if old in para.text:
                para.text = para.text.replace(old, new)
        
        # Handle conditional logic sections
        # Note: Clio uses liquid-like syntax for conditionals if configured, 
        # but often it's easier to just put the text and let the user delete if needed, 
        # OR use the proper {% if %} syntax if we know the field name.
        if "{Include this Paragraph if No. Injured in the Police Report > 0}" in para.text:
            para.text = para.text.replace("{Include this Paragraph if No. Injured in the Police Report > 0}", "{% if matter.custom_fields.number_injured > 0 %}")
            # We need to find the end of this logic later, or just wrap the paragraph.
            # For simplicity in this hackathon, we will wrap the specific sentence.
            para.text = para.text + " {% endif %}"
            
        if "{Include this Paragraph if No. Injured in the Police Report = 0}" in para.text:
            para.text = para.text.replace("{Include this Paragraph if No. Injured in the Police Report = 0}", "{% if matter.custom_fields.number_injured == 0 %}")
            para.text = para.text + " {% endif %}"

    doc.save(output_path)
    print(f"Saved processed template to {output_path}")

if __name__ == "__main__":
    replace_placeholders("docs/Richards_Law_Retainer.docx", "docs/Richards_Law_Retainer_Final.docx")
