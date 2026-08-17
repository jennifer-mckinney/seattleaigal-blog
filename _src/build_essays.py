import os
from build_site import head, header, footer, FOOT_SCRIPT, chip, card, SITE_NAME, month_day_year
from build_content import ESSAYS

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_HTML = os.path.join(BASE, "_src", "content_html")

by_slug = {m["slug"]: m for m in ESSAYS}


def related_for(meta, n=2):
    others = [m for m in ESSAYS if m["slug"] != meta["slug"]]
    # prefer same category first
    same = [m for m in others if m["category"] == meta["category"]]
    rest = [m for m in others if m["category"] != meta["category"]]
    ordered = same + rest
    return ordered[:n]


os.makedirs(os.path.join(BASE, "essays"), exist_ok=True)

for meta in ESSAYS:
    body_html = open(os.path.join(CONTENT_HTML, meta["slug"] + ".body.html")).read()
    sources_html = open(os.path.join(CONTENT_HTML, meta["slug"] + ".sources.html")).read()

    page = head(
        f"{meta['title']} — {SITE_NAME}",
        meta["dek"],
        prefix="../",
    )
    page += header(prefix="../", active="writing")
    page += f"""
<main>
  <article>
    <header class="article-head container--narrow container">
      {chip(meta['category'])} <span class="chip" style="color:var(--color-text-faint);">&middot; {meta['type']}</span>
      <h1>{meta['title']}</h1>
      <p class="dek">{meta['dek']}</p>
      <div class="byline">
        <div class="byline__avatar">JM</div>
        <div><strong>{SITE_NAME}</strong><br/>{month_day_year(meta['date'])} &middot; {meta['read_time']} min {meta['type'].lower()}</div>
      </div>
      <div class="article-actions">
        <a class="btn btn--primary" href="../pdfs/{meta['slug']}.pdf">Download PDF</a>
        <a class="btn btn--ghost" href="../writing.html">Back to all writing</a>
      </div>
    </header>

    <div class="article-body container" data-essay="{meta['slug']}">
      {body_html}

      <hr/>
      <h3>Sources</h3>
      <ul class="sources-list">
        {sources_html.replace('<ul>','').replace('</ul>','').replace('<li>','<li>').strip()}
      </ul>
    </div>
  </article>

  <section class="related container">
    <div class="section-head reveal" style="margin-top: var(--space-16);">
      <h2>Continue reading</h2>
    </div>
    <div class="card-grid">
      {''.join(card(m, prefix='../') for m in related_for(meta))}
    </div>
  </section>
</main>
"""
    page += footer(prefix="../")
    page += FOOT_SCRIPT.format(prefix="../")
    open(os.path.join(BASE, "essays", meta["slug"] + ".html"), "w").write(page)
    print("Built essays/" + meta["slug"] + ".html")
