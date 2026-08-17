import os
from build_site import head, header, footer, FOOT_SCRIPT, chip, card, SITE_NAME, month_day_year
from build_content import ESSAYS

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

by_slug = {m["slug"]: m for m in ESSAYS}
featured = by_slug["built-in-not-bolted-on"]
rest = [m for m in ESSAYS if m["slug"] != featured["slug"]]
# order rest by date desc
rest_sorted = sorted(rest, key=lambda m: m["date"], reverse=True)

BLUEPRINT_SVG = """
<svg class="blueprint" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="1" opacity="0.16" style="color: var(--color-text-faint);">
    <path d="M0 650 Q 300 480 600 650 T 1200 650" />
    <circle cx="960" cy="140" r="90" stroke-dasharray="2 6"/>
    <circle cx="960" cy="140" r="130" stroke-dasharray="2 6"/>
    <line x1="960" y1="10" x2="960" y2="270"/>
    <line x1="830" y1="140" x2="1090" y2="140"/>
    <path d="M120 650 V420 Q120 340 300 340 Q480 340 480 420 V650" />
    <path d="M540 650 V460 Q540 380 700 380 Q860 380 860 460 V650" />
  </g>
</svg>
"""

# ---------------------------------------------------------------- HOME
home = head(
    f"{SITE_NAME} — Essays &amp; Papers on AI Ethics, Labor, Compliance, and Architecture",
    "Essays and technical papers by Jennifer McKinney on AI ethics, compliance, and architecture, with downloadable PDFs.",
)
home += header(active="home")
home += f"""
<main>
  <section class="hero">
    <div class="hero__bg" aria-hidden="true"><img src="img/hero-blueprint.png" alt="" /></div>
    {BLUEPRINT_SVG}
    <div class="container hero__grid">
      <div>
        <p class="hero__eyebrow">Essays &amp; technical papers</p>
        <h1>Constraints are <em>structure,</em><br/>not paperwork.</h1>
        <p class="hero__lede">I write about the design decisions that make AI systems trustworthy by construction: architecture, compliance, and the ethics of automating decisions about people.</p>
      </div>
      <div class="hero__meta">
        <p>By Jennifer McKinney — Strategic Technology Leader, founder of Croí AI, and founder &amp; board VP of the AI Ethics Consortium.</p>
      </div>
    </div>
  </section>

  <section class="container">
    <div class="section-head reveal">
      <h2>Featured</h2>
      <span class="section-head__num">01</span>
    </div>
    <article class="feature reveal">
      <a class="feature__art" href="essays/{featured['slug']}.html"><img src="{featured['image']}" alt="" /></a>
      <div class="feature__body">
        {chip(featured['category'])}
        <h3><a href="essays/{featured['slug']}.html">{featured['title']}</a></h3>
        <p class="dek">{featured['dek']}</p>
        <div class="feature__foot">
          <a class="btn btn--ghost btn--sm" href="essays/{featured['slug']}.html">Read the essay</a>
          <a class="btn btn--ghost btn--sm" href="pdfs/{featured['slug']}.pdf">Download PDF</a>
        </div>
      </div>
    </article>
  </section>

  <section class="container">
    <div class="section-head reveal">
      <h2>Recent writing</h2>
      <span class="section-head__num">02</span>
    </div>
    <div class="card-grid">
      {''.join(card(m) for m in rest_sorted)}
    </div>
  </section>

  <section class="container">
    <div class="contact-strip reveal">
      <h2>Sharing this with a recruiter, client, or collaborator?</h2>
      <div class="contact-links">
        <a class="btn btn--primary" href="about.html#contact">Get in touch</a>
        <a class="btn btn--ghost" href="about.html">Read my background</a>
      </div>
    </div>
  </section>
</main>
"""
home += footer()
home += FOOT_SCRIPT.format(prefix="")
open(os.path.join(BASE, "index.html"), "w").write(home)

# ---------------------------------------------------------------- WRITING INDEX
all_sorted = sorted(ESSAYS, key=lambda m: m["date"], reverse=True)
writing = head(
    f"Writing — {SITE_NAME}",
    "The full archive of essays and technical papers on AI ethics, compliance, and architecture.",
)
writing += header(active="writing")
writing += f"""
<main>
  <section class="article-head container">
    <p class="hero__eyebrow">Archive</p>
    <h1 style="font-size: var(--text-2xl); max-width: 26ch;">Every essay and paper, in one place.</h1>
    <p class="dek">{len(ESSAYS)} pieces so far, spanning architecture, compliance, and AI ethics. Filter by theme, or read the whole archive top to bottom.</p>
  </section>
  <section class="container">
    <div class="filters" role="group" aria-label="Filter by category">
      <button class="filter-btn is-active" data-filter="all" type="button">All</button>
      <button class="filter-btn" data-filter="Architecture" type="button" id="architecture">Architecture</button>
      <button class="filter-btn" data-filter="Compliance" type="button" id="compliance">Compliance</button>
      <button class="filter-btn" data-filter="AI Ethics" type="button" id="ai-ethics">AI Ethics</button>
      <button class="filter-btn" data-filter="Labor" type="button" id="labor">Labor</button>
    </div>
    <div class="card-grid">
      {''.join(card(m) for m in all_sorted)}
    </div>
  </section>
</main>
"""
writing += footer()
writing += FOOT_SCRIPT.format(prefix="")
open(os.path.join(BASE, "writing.html"), "w").write(writing)

print("Built index.html and writing.html")
