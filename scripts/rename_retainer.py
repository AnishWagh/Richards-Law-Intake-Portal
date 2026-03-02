import os
import shutil

src = "docs/Retainer Agreement - Richards & Law [Hackathon].docx"
dst = "docs/Richards_Law_Retainer.docx"

if os.path.exists(src):
    shutil.move(src, dst)
    print(f"Moved {src} to {dst}")
else:
    print(f"Source {src} not found")
