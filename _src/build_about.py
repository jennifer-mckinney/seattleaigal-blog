import os
from build_site import head, header, footer, FOOT_SCRIPT, SITE_NAME

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

page = head(
    f"About — {SITE_NAME}",
    "Jennifer McKinney is a strategic technology leader, founder of Croí AI, and founder & board VP of the AI Ethics Consortium, writing on AI ethics, compliance, and architecture.",
)
page += header(active="about")
page += """
<main>
  <section class="container" style="padding-top: clamp(var(--space-16), 8vw, var(--space-24));">
    <div class="about-grid">
      <div class="about-portrait">
        <img src="img/about-pattern.png" alt="Abstract architectural line drawing" />
      </div>
      <div>
        <p class="hero__eyebrow">About</p>
        <h1 style="font-size: var(--text-2xl); max-width: 20ch; margin-bottom: var(--space-6);">Jennifer McKinney</h1>
        <p class="dek" style="margin-bottom: var(--space-8);">Strategic Technology Leader. Founder, Croí AI. Founder &amp; Board VP, AI Ethics Consortium. I write about the point where architecture, compliance, and ethics meet.</p>

        <p style="font-size: var(--text-base); line-height: 1.75; max-width: 68ch;">I spend most of my working life in the space between strategy and execution: turning ambitious, ambiguous AI initiatives into systems that ship, hold up under audit, and treat the people affected by them with some care. That work sits at the intersection of technical program management, AI governance, and architecture, and it is the subject of most of what I write here.</p>

        <p style="font-size: var(--text-base); line-height: 1.75; max-width: 68ch; margin-top: var(--space-5);">Before founding <strong>Croí AI</strong>, an AI strategy, governance, and architecture consultancy, I led enterprise technical programs for over fifteen years, including a large-scale conversational hiring-AI governance program for a national, multi-brand retailer, spanning thousands of store locations across multiple countries. That program, and the risk register, consent design, and human-review thresholds it required, shaped how I think about the ethics of automating decisions about people, and it is the basis for one of the essays in this collection.</p>

        <p style="font-size: var(--text-base); line-height: 1.75; max-width: 68ch; margin-top: var(--space-5);">I currently serve as founder and board VP of the <strong>AI Ethics Consortium</strong>, and hold a patent-pending filing for a Constraint-Native AI / Compliance-Native AI Platform, the architectural philosophy behind the title essay in this collection. I also build and maintain <a href="https://github.com/jennifer-mckinney/terms-analysis" target="_blank" rel="noopener">an open-source terms-of-service risk engine</a> that runs entirely on local, on-device language models, which I write about as a working example of constraint-native design rather than just a theory.</p>

        <ul class="credential-list">
          <li><strong>Current</strong><span>Founder, Croí AI &mdash; AI strategy, governance &amp; architecture</span></li>
          <li><strong>Board role</strong><span>Founder &amp; VP, AI Ethics Consortium</span></li>
          <li><strong>IP</strong><span>Patent-pending, Constraint-Native AI / Compliance-Native AI Platform</span></li>
          <li><strong>Open source</strong><span>AI Terms &amp; Policies Reviewer &mdash; on-device ToS/privacy-policy risk engine</span></li>
          <li><strong>Background</strong><span>15+ years enterprise technical program management, including large-scale AI governance delivery</span></li>
          <li><strong>Focus areas</strong><span>Constraint-native architecture, AI governance, compliance &amp; the ethics of automated decisions</span></li>
        </ul>
      </div>
    </div>
  </section>

  <section class="container" id="contact">
    <div class="contact-strip reveal">
      <h2>Recruiters, clients, and collaborators are all welcome to reach out.</h2>
      <div class="contact-links">
        <a class="btn btn--primary" href="mailto:jennifer.mckinney@croiai.com">jennifer.mckinney@croiai.com</a>
        <a class="btn btn--ghost" href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>
  </section>
</main>
"""
page += footer()
page += FOOT_SCRIPT.format(prefix="")
open(os.path.join(BASE, "about.html"), "w").write(page)
print("Built about.html")
