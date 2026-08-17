import os
from build_content import ESSAYS, CAT_CLASS

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_NAME = "Jennifer McKinney"
TAGLINE = "Essays &amp; papers on AI ethics, labor, compliance, and architecture."

def logo_mark(prefix=""):
    return f'<img class="wordmark__mark" src="{prefix}img/logo-mark.png" alt="" width="30" height="30" loading="eager" decoding="async" />'


def month_day_year(iso):
    y, m, d = iso.split("-")
    months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    return f"{months[int(m)-1]} {int(d)}, {y}"


def head(title, description, prefix="", canonical=""):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script>
(function () {{
  var t = null;
  try {{
    var params = new URLSearchParams(window.location.search);
    var qt = params.get('theme');
    if (qt === 'light' || qt === 'dark') t = qt;
  }} catch (e) {{}}
  if (t !== 'light' && t !== 'dark') {{
    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }}
  document.documentElement.setAttribute('data-theme', t);
}})();
</script>
<title>{title}</title>
<meta name="description" content="{description}" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="{prefix}img/hero-blueprint.png" />
<link rel="icon" href="data:image/svg+xml,{"%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 26V15.5C4 10.8 9.4 7 16 7C22.6 7 28 10.8 28 15.5V26' fill='none' stroke='%23233350' stroke-width='2.4'/%3E%3Cpath d='M4 26H28' stroke='%23233350' stroke-width='2.4'/%3E%3C/svg%3E"}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&amp;family=Inter:ital,wght@0,300..800;1,300..800&amp;display=swap" rel="stylesheet" />
<link rel="stylesheet" href="{prefix}css/tokens.css?v=2" />
<link rel="stylesheet" href="{prefix}css/base.css?v=2" />
<link rel="stylesheet" href="{prefix}css/site.css?v=2" />
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
</head>
<body>
"""


FOOT_SCRIPT = "<script src=\"{prefix}js/main.js\"></script>\n<script src=\"{prefix}js/charts.js\"></script>\n</body>\n</html>\n"


def header(prefix="", active=""):
    def cur(name):
        return ' aria-current="page"' if active == name else ""
    return f"""
<header class="site-header">
  <div class="container site-header__inner">
    <a class="wordmark" href="{prefix}index.html">
      {logo_mark(prefix)}
      <span>{SITE_NAME}<br/><small>Writing on AI Ethics, Architecture &amp; Governance</small></span>
    </a>
    <nav class="main-nav" aria-label="Primary" data-main-nav data-open="false">
      <button class="nav-toggle" data-nav-toggle type="button" aria-label="Open navigation" aria-expanded="false">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <line x1="2" y1="5" x2="18" y2="5"/>
          <line x1="2" y1="10" x2="18" y2="10"/>
          <line x1="2" y1="15" x2="18" y2="15"/>
        </svg>
      </button>
      <ul>
        <li><a href="{prefix}index.html"{cur('home')}>Home</a></li>
        <li><a href="{prefix}writing.html"{cur('writing')}>Writing</a></li>
        <li><a href="{prefix}about.html"{cur('about')}>About</a></li>
        <li><a href="{prefix}about.html#contact">Contact</a></li>
      </ul>
      <button class="theme-toggle" data-theme-toggle type="button" aria-label="Switch to dark mode"></button>
    </nav>
  </div>
</header>
"""


def footer(prefix=""):
    return f"""
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a class="wordmark" href="{prefix}index.html">{logo_mark(prefix)}<span>{SITE_NAME}</span></a>
      <p class="footer-note">{TAGLINE}</p>
    </div>
    <div class="footer-links">
      <div>
        <h4>Read</h4>
        <ul>
          <li><a href="{prefix}writing.html">All writing</a></li>
          <li><a href="{prefix}writing.html#architecture">Architecture</a></li>
          <li><a href="{prefix}writing.html#compliance">Compliance</a></li>
          <li><a href="{prefix}writing.html#ai-ethics">AI Ethics</a></li>
          <li><a href="{prefix}writing.html#labor">Labor</a></li>
        </ul>
      </div>
      <div>
        <h4>Connect</h4>
        <ul>
          <li><a href="{prefix}about.html">About</a></li>
          <li><a href="mailto:jennifer.mckinney@croiai.com">Email</a></li>
          <li><a href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>&copy; 2026 {SITE_NAME}. All essays and papers are original work. All views, opinions, and positions expressed are my own and my sole responsibility. AI assisted in structural editing and citation verification.</span>
    <span>Built on a constraint-native design stance.</span>
  </div>
</footer>
"""


def chip(cat):
    cls = CAT_CLASS.get(cat, "architecture")
    return f'<span class="chip chip--{cls}">{cat}</span>'


def card(meta, prefix=""):
    href = f"{prefix}essays/{meta['slug']}.html"
    img = f"{prefix}{meta['image']}"
    return f"""
      <article class="card reveal" data-category="{meta['category']} {meta['secondary']}">
        <a class="card__art" href="{href}"><img src="{img}" alt="{meta['title']}" loading="lazy" /></a>
        <div class="chip-row">{chip(meta['category'])}{chip(meta['secondary']) if meta.get('secondary') and meta['secondary'] != meta['category'] else ''}</div>
        <h3><a href="{href}">{meta['title']}</a></h3>
        <p class="dek">{meta['dek']}</p>
        <div class="card__meta"><span>{month_day_year(meta['date'])}</span><span class="dot"></span><span>{meta['read_time']} min {meta['type'].lower()}</span></div>
      </article>
"""


TITLES = {
    "built-in-not-bolted-on": "Built In, Not Bolted On: Constraint-Native Architecture as a Design Stance",
    "the-governance-gap": "The Governance Gap: What AI Vendor Risk Actually Costs Mid-Market Companies",
    "what-store-managers-taught-me": "What Store Managers Taught Me About Automating Hiring Decisions",
    "compliance-by-construction": "Compliance by Construction: Building a Terms-of-Service Risk Engine That Runs Entirely On-Device",
    "program-management-ai-governance": "Program Management Is Becoming an AI Governance Discipline, Whether We Call It That or Not",
    "constraints-in-orbit-heat": "The Constraints We Put in Orbit, Part I: The Heat Problem We Keep Calling a Bandwidth Problem",
    "constraints-in-orbit-jurisdiction": "The Constraints We Put in Orbit, Part II: Sovereignty Doesn't Subtract in Orbit, It Stacks",
    "constraints-in-orbit-governance": "The Constraints We Put in Orbit, Part III: The Governance Gap Is Filled by Discretion",
    "generational-digital-divide": "The Generational Digital Divide: AI-Generated Deepfakes and Their Differential Impact on Social Media Platform Trust Across Age Cohorts",
}

for m in ESSAYS:
    m["title"] = TITLES[m["slug"]]

print("Loaded", len(ESSAYS), "essays")
