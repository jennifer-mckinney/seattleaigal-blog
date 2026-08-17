import os
from io import BytesIO
from xhtml2pdf import pisa
from build_content import ESSAYS
from build_site import month_day_year

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_HTML = os.path.join(BASE, "_src", "content_html")
PDF_DIR = os.path.join(BASE, "pdfs")
os.makedirs(PDF_DIR, exist_ok=True)

PDF_CSS = """
<style>
/* xhtml2pdf (pisa) renderer — no @import or @page rules supported */
@page { size: a4 portrait; margin: 26mm 22mm 24mm 22mm; }
* { box-sizing: border-box; }
body { font-family: Helvetica, Arial, sans-serif; color: #201c15; font-size: 11pt; line-height: 1.6; }
.kicker { font-size: 9pt; text-transform: uppercase; color: #233350; font-weight: 700; margin-bottom: 10pt; }
h1.title { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: 28pt; line-height: 1.1; color: #16130f; margin: 0 0 10pt 0; }
p.dek { font-size: 13pt; color: #6b6353; font-family: Georgia, 'Times New Roman', serif; font-style: italic; margin: 0 0 14pt 0; }
.meta { font-size: 9.5pt; color: #6b6353; border-top: 0.75pt solid #d6cdb6; border-bottom: 0.75pt solid #d6cdb6; padding: 7pt 0; margin-bottom: 20pt; }
h2 { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: 18pt; margin: 20pt 0 8pt 0; color: #16130f; }
h3 { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: 15pt; margin: 16pt 0 6pt 0; color: #16130f; }
p { margin: 0 0 9pt 0; text-align: left; }
a { color: #233350; text-decoration: underline; }
table { width: 100%; border-collapse: collapse; margin: 12pt 0; font-size: 9.5pt; }
th, td { text-align: left; padding: 5pt 8pt; border-bottom: 0.75pt solid #e2dccb; vertical-align: top; }
th { color: #6b6353; text-transform: uppercase; font-size: 8pt; }
ul, ol { margin: 0 0 9pt 18pt; padding: 0; }
li { margin-bottom: 4pt; }
hr { border-top: 0.75pt solid #d6cdb6; margin: 16pt 0; }
.sources { font-size: 9pt; color: #6b6353; }
.sources li { word-break: break-all; }
.footer-brand { margin-top: 26pt; padding-top: 10pt; border-top: 0.75pt solid #d6cdb6; font-size: 8.5pt; color: #a49b86; }
</style>
"""

for meta in ESSAYS:
    body_html = open(os.path.join(CONTENT_HTML, meta["slug"] + ".body.html")).read()
    sources_html = open(os.path.join(CONTENT_HTML, meta["slug"] + ".sources.html")).read()
    html = f"""<!doctype html><html><head><meta charset="utf-8">{PDF_CSS}</head><body>
    <div class="kicker">{meta['category']} &middot; {meta['type']}</div>
    <h1 class="title">{meta['title']}</h1>
    <p class="dek">{meta['dek']}</p>
    <div class="meta">Jennifer McKinney &middot; {month_day_year(meta['date'])} &middot; {meta['read_time']} min read</div>
    {body_html}
    <hr/>
    <h2>Sources</h2>
    <div class="sources">{sources_html}</div>
    <div class="footer-brand">jennifermckinney.com &mdash; writing on AI ethics, labor, compliance &amp; architecture</div>
    </body></html>"""
    out_path = os.path.join(PDF_DIR, meta["slug"] + ".pdf")
    # Use xhtml2pdf (pisa) — pure-Python renderer, no system library deps
    with open(out_path, "wb") as fh:
        result = pisa.CreatePDF(html, dest=fh)
    if result.err:
        print(f"WARNING: {out_path} had {result.err} error(s) during render")
    else:
        print("Wrote", out_path)
