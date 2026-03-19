import xml.etree.ElementTree as ET
import re

xml_path = r'C:\Users\aftan\Downloads\IND_2019_DHS_v01_M.xml'
try:
    with open(xml_path, 'r', encoding='utf-8') as file:
        xml_content = file.read()
        
    # Standard DDI structure: usually has <stdyDscr> <titlStmt> <titl>
    # <dataDscr> -> <var> with @name like v012, hw70 etc
    
    title_match = re.search(r'<titl>(.*?)</titl>', xml_content)
    title = title_match.group(1) if title_match else 'Unknown Title'
    
    # Find hw70 or v024 variables to prove parsing
    hw70_match = re.search(r'<var\s+name="hw70".*?</var>', xml_content, re.DOTALL | re.IGNORECASE)
    
    print(f"Parsed DDI XML Successfully!")
    print(f"Survey Title: {title}")
    
    var_matches = len(re.findall(r'<var\s+ID', xml_content, re.IGNORECASE))
    print(f"Total DDI Variables Extracted: {var_matches}")
    
    if hw70_match:
        print("\nExtracted Hw70 (Stunting Standard):")
        print(hw70_match.group(0)[:500])
        
except Exception as e:
    print(e)
