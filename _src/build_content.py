import re, os, sys
import markdown as md

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.dirname(os.path.abspath(__file__))

ESSAYS = [
    {
        "slug": "built-in-not-bolted-on",
        "file": "01-built-in-not-bolted-on.md",
        "category": "Architecture",
        "secondary": "Compliance",
        "type": "Essay",
        "date": "2026-07-22",
        "dek": "Constraints, safety, and provenance are load-bearing structure, not paperwork bolted on after launch. A design stance for building AI systems that cannot be configured into failure.",
        "image": "img/essay-architecture.png",
    },
    {
        "slug": "the-governance-gap",
        "file": "02-the-governance-gap.md",
        "category": "Compliance",
        "secondary": "Architecture",
        "type": "Essay",
        "date": "2026-08-15",
        "dek": "The data on AI vendor risk tells a less dramatic, more useful story than the sales pitch: a real coverage gap, real procurement friction, and very little evidence anyone is writing large new checks.",
        "image": "img/essay-compliance.png",
    },
    {
        "slug": "what-store-managers-taught-me",
        "file": "03-what-store-managers-taught-me.md",
        "category": "AI Ethics",
        "secondary": "Labor",
        "type": "Essay",
        "date": "2026-06-10",
        "dek": "A reflection on leading AI governance for a hiring system used across a large multi-brand retail footprint, and what consent, bias, and dignity look like from the applicant's side of the screen.",
        "image": "img/essay-ethics.png",
    },
    {
        "slug": "compliance-by-construction",
        "file": "04-compliance-by-construction.md",
        "category": "Architecture",
        "secondary": "Compliance",
        "type": "Technical Paper",
        "date": "2026-07-29",
        "dek": "Inside an open-source terms-of-service risk engine built to run entirely on local, on-device models, and what it means to make a governance idea operational.",
        "image": "img/essay-technical.png",
    },
    {
        "slug": "program-management-ai-governance",
        "file": "05-program-management-ai-governance.md",
        "category": "Labor",
        "secondary": "AI Ethics",
        "type": "Essay",
        "date": "2026-08-08",
        "dek": "AI governance keeps landing on program managers' desks whether the org chart says so or not. A case for treating the discipline as architecture, not administration.",
        "image": "img/essay-labor.png",
    },
    {
        "slug": "constraints-in-orbit-heat",
        "file": "06a-constraints-in-orbit-heat.md",
        "category": "Architecture",
        "secondary": "Compliance",
        "type": "Technical Paper",
        "date": "2026-08-15",
        "dek": "Part I of III. Orbital AI data centers don't have a bandwidth problem, they have a heat problem: a thermodynamic law no one can bargain with, hiding one layer beneath the laser downlinks everyone argues about.",
        "image": "img/essay-orbital.png",
    },
    {
        "slug": "constraints-in-orbit-jurisdiction",
        "file": "06b-constraints-in-orbit-jurisdiction.md",
        "category": "Compliance",
        "secondary": "Architecture",
        "type": "Technical Paper",
        "date": "2026-08-15",
        "dek": "Part II of III. Going to orbit doesn't subtract a regulator, it stacks several incompatible sovereigns onto one moving object, and the seams between their legal theories are where accountability dies.",
        "image": "img/essay-orbital.png",
    },
    {
        "slug": "constraints-in-orbit-governance",
        "file": "06c-constraints-in-orbit-governance.md",
        "category": "Compliance",
        "secondary": "AI Ethics",
        "type": "Technical Paper",
        "date": "2026-08-15",
        "dek": "Part III of III. The governance gap orbit creates is filled by nothing but operator discretion, and the analysts we'd use to check that discretion are paid by the same people whose discretion is in question.",
        "image": "img/essay-orbital.png",
    },
    # HIDDEN: essay 07 pulled from listings for further work — restore by uncommenting
    # {
    #     "slug": "generational-digital-divide",
    #     "file": "07-generational-digital-divide.md",
    #     "category": "AI Ethics",
    #     "secondary": "Compliance",
    #     "type": "Research Paper",
    #     "date": "2026-08-13",
    #     "dek": "A generational fault line is forming around synthetic media: one cohort adapts to a post-authentic internet while another retreats into smaller, verified circles. What that split means for platform trust, and how long the window for intervention stays open.",
    #     "image": "img/essay-deepfakes.png",
    # },
]

CAT_CLASS = {
    "Architecture": "architecture",
    "Compliance": "compliance",
    "AI Ethics": "ethics",
    "Labor": "labor",
}


def read_essay(meta):
    path = os.path.join(SRC, "content", meta["file"])
    text = open(path, encoding="utf-8").read()
    # strip front matter
    text = re.sub(r"^---.*?---\s*", "", text, flags=re.S)
    # strip the leading H1 (rendered separately in the page header)
    text = re.sub(r"^#\s+.*\n", "", text, count=1)
    return text


def split_sources(text):
    parts = re.split(r"\n##\s*Sources\s*\n", text, maxsplit=1)
    body = parts[0].strip()
    sources = parts[1].strip() if len(parts) > 1 else ""
    return body, sources


def to_html(text):
    return md.markdown(text, extensions=["extra", "sane_lists"])


def word_count(text):
    return len(re.findall(r"\w+", text))


def read_time(words):
    return max(1, round(words / 200))


def process_all(verbose=False):
    out_dir = os.path.join(SRC, "content_html")
    os.makedirs(out_dir, exist_ok=True)
    for meta in ESSAYS:
        raw = read_essay(meta)
        body_md, sources_md = split_sources(raw)
        body_html = to_html(body_md)
        sources_html = to_html(sources_md) if sources_md else ""
        wc = word_count(body_md)
        rt = read_time(wc)
        with open(os.path.join(out_dir, meta["slug"] + ".body.html"), "w") as f:
            f.write(body_html)
        with open(os.path.join(out_dir, meta["slug"] + ".sources.html"), "w") as f:
            f.write(sources_html)
        meta["word_count"] = wc
        meta["read_time"] = rt
        if verbose:
            print(meta["slug"], wc, "words,", rt, "min read")
    return ESSAYS


# Always compute on import so downstream builders have word_count/read_time populated.
process_all()

if __name__ == "__main__":
    process_all(verbose=True)
