#!/usr/bin/env python3
"""
Extract exact body HTML markup and all Google AIDA image URLs from
Zedskillz design HTML files (saved as .txt).

Output: /home/z/my-project/zedskillz_exact_html.md
"""

import os
import re
import hashlib

UPLOAD_DIR = "/home/z/my-project/upload"
OUTPUT_FILE = "/home/z/my-project/zedskillz_exact_html.md"

# File order from the task
FILES = [
    "Zedskillz_landing_page_ui.txt",
    "zedskillz_signin_page_ui.txt",
    "zedskillz_signup_page_ui.txt",
    "zedskillz_admin_dashboard_ui.txt",
    "zedskillz_couse_explorer_ui.txt",
    "zedskillz_my_courses_ui.txt",
    "zedskillz_leaderboard_ui.txt",
    "zedskillz_community_page_ui.txt",
    "zedskillz_individual_post_view.txt",
    "zedskillz_sholarconnect_ui.txt",
]

AIDA_RE = re.compile(r"https://lh3\.googleusercontent\.com/aida-public/[A-Za-z0-9_-]+")


def md5(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def find_enclosing_tag(content, url_pos):
    """
    Given a position of an AIDA URL in content, walk backwards to find the
    opening tag (<img ...> or <div ... style="background-image: url(&quot;URL&quot;)...">)
    that contains this URL. Return (tag_text, tag_start, tag_end, tag_name).
    """
    # Find the start of the tag containing this URL.
    # Walk back to find '<' that begins a tag.
    # The URL may appear inside an attribute value, so we walk back to the
    # most recent '<' followed by a tag name char.
    i = url_pos
    while i > 0:
        if content[i] == "<":
            # Check this is a tag start (next char is letter)
            if i + 1 < len(content) and (content[i + 1].isalpha()):
                break
        i -= 1
    tag_start = i
    # Find the closing '>' of this tag (naive — assumes no '>' inside attribute values,
    # which is true for these files since they use &quot; not raw quotes inside styles).
    # But CSS url() with &quot; should not contain '>'. Still, to be safe, scan for
    # the first '>' that is not inside a quoted attribute. For simplicity (the source
    # HTML uses &quot; entities and no raw '>' in attributes), we just find the next '>'.
    j = tag_start
    # We need to skip over attribute values that might contain '>'. In these files,
    # attributes use double quotes for delimiters, and '>' would only appear inside
    # a quoted string. So we track quote state.
    in_dq = False
    in_sq = False
    while j < len(content):
        c = content[j]
        if not in_dq and not in_sq:
            if c == '"':
                in_dq = True
            elif c == "'":
                in_sq = True
            elif c == ">":
                tag_end = j + 1
                break
        else:
            if in_dq and c == '"':
                in_dq = False
            elif in_sq and c == "'":
                in_sq = False
        j += 1
    else:
        tag_end = j
    tag_text = content[tag_start:tag_end]
    m = re.match(r"<([a-zA-Z0-9]+)", tag_text)
    tag_name = m.group(1) if m else ""
    return tag_text, tag_start, tag_end, tag_name


def extract_image_info(content, url, url_pos):
    """Extract data-alt, alt, class, and inferred usage for an AIDA URL."""
    tag_text, tag_start, tag_end, tag_name = find_enclosing_tag(content, url_pos)

    # Extract attributes
    data_alt_m = re.search(r'data-alt="([^"]*)"', tag_text)
    alt_m = re.search(r'\salt="([^"]*)"', tag_text)
    class_m = re.search(r'class="([^"]*)"', tag_text)
    style_m = re.search(r'style="([^"]*)"', tag_text)

    data_alt = data_alt_m.group(1) if data_alt_m else ""
    alt = alt_m.group(1) if alt_m else ""
    cls = class_m.group(1) if class_m else ""
    style = style_m.group(1) if style_m else ""

    # Infer usage from surrounding context (300 chars before and after the tag)
    ctx_start = max(0, tag_start - 400)
    ctx_end = min(len(content), tag_end + 400)
    before = content[ctx_start:tag_start]
    after = content[tag_end:ctx_end]
    ctx = before + " || " + after

    usage = infer_usage(tag_name, cls, alt, data_alt, ctx)

    return {
        "url": url,
        "tag": tag_name,
        "data_alt": data_alt,
        "alt": alt,
        "class": cls,
        "style": style if "background-image" in style else "",
        "usage": usage,
    }


def infer_usage(tag, cls, alt, data_alt, ctx):
    """Heuristic to determine what an image is used for."""
    c = (cls or "").lower()
    a = (alt or "").lower()
    ctx_l = ctx.lower()

    # Logo detection
    if "zedskillz hub" in a and ("object-contain" in c and "h-10" in c):
        return "Logo (Zedskillz Hub brand mark)"
    if "logo" in c or "brand" in c:
        return "Logo / brand mark"
    if "object-contain" in c and "h-10" in c:
        return "Logo / brand mark (header)"

    # Avatar detection
    if "avatar" in c or "rounded-full" in c or "profile-pic" in c:
        if "w-8" in c or "w-10" in c or "w-12" in c or "h-8" in c or "h-10" in c:
            return "User avatar / profile picture"

    # Hero / background section
    if "background-image" in c or "bg-cover" in c or "bg-center" in c:
        if "hero" in ctx_l or "<!-- hero" in ctx_l:
            return "Hero section background image"
        if "cta" in ctx_l or "call-to-action" in ctx_l:
            return "Call-to-action section background"
        if "community" in ctx_l:
            return "Community section background image"
        return "Section background image (bg-cover)"

    # Course thumbnails — typically "w-full h-full object-cover" + group-hover:scale
    if "group-hover:scale" in c and "object-cover" in c:
        # Look for course title in surrounding context
        # Try to extract a course name from nearby heading text
        m = re.search(r'>([A-Z][A-Za-z ]{2,40}(?:Mathematics|Coding|Agriculture|Healthcare|Programming|Science|English|Business|Finance|Engineering|Design|Data|AI|Cybersecurity|Web Development|Mobile|Cloud))<', ctx)
        if m:
            return f"Course thumbnail — {m.group(1).strip()}"
        # Look for nearby category badge
        cat_m = re.search(r'badge[^>]*>([A-Za-z &;]+)<', ctx, re.IGNORECASE)
        if cat_m:
            return f"Course thumbnail (category: {cat_m.group(1).strip()})"
        return "Course thumbnail"

    # Generic object-cover image (often hero or feature)
    if "object-cover" in c and "w-full" in c and "h-full" in c:
        return "Full-bleed image (object-cover)"

    # Zambian AI Tutor style inline image
    if "zambian ai tutor" in a:
        return "Inline brand image (Zambian AI Tutor text-as-image)"

    # Fallback: search context for keywords
    if "hero" in ctx_l:
        return "Hero section image"
    if "course" in ctx_l:
        return "Course-related image"
    if "avatar" in ctx_l or "profile" in ctx_l:
        return "User avatar / profile picture"

    return "Image (see class/alt for context)"


def extract_body(content):
    """Extract content between <body...> and </body>, removing <script> blocks
    and <pixiebrix-widget> browser-extension artifacts."""
    body_open_m = re.search(r"<body[^>]*>", content)
    body_close_idx = content.rfind("</body>")
    if not body_open_m or body_close_idx == -1:
        return content, "WARNING: body tags not found"
    body_open_end = body_open_m.end()
    body_open_tag = body_open_m.group(0)
    body_inner = content[body_open_end:body_close_idx]

    # Remove <script>...</script> blocks (including the closing footer scripts)
    body_inner = re.sub(r"<script\b[^>]*>.*?</script>", "", body_inner, flags=re.DOTALL)
    # Also remove any stray <script ...> without closing tag (self-closing or empty)
    body_inner = re.sub(r"<script\b[^>]*/?>", "", body_inner)
    # Remove <noscript>...</noscript> as well? The user didn't say. Keep noscript.
    # Remove <pixiebrix-widget>...</pixiebrix-widget> browser-extension artifacts.
    body_inner = re.sub(
        r"<pixiebrix-widget\b[^>]*>.*?</pixiebrix-widget>",
        "",
        body_inner,
        flags=re.DOTALL,
    )
    # Self-closing or unclosed pixiebrix-widget
    body_inner = re.sub(r"<pixiebrix-widget\b[^>]*/?>", "", body_inner)
    # Also remove trailing stray text content (whitespace) left after pixiebrix removal
    # — leave whitespace alone; it's harmless.

    return body_open_tag + body_inner + "</body>", None


def extract_images(content):
    """Return a list of dicts with image info for each AIDA URL in document order."""
    images = []
    seen_positions = set()
    for m in AIDA_RE.finditer(content):
        url = m.group(0)
        info = extract_image_info(content, url, m.start())
        # Deduplicate by (url, tag_start) in case the same URL appears twice
        # but we still want each occurrence listed if it appears multiple times.
        images.append(info)
    return images


def main():
    out_lines = []
    out_lines.append("# Zedskillz Design HTML — Exact Extraction")
    out_lines.append("")
    out_lines.append(
        "This document contains the verbatim body HTML and all Google AIDA image URLs "
        "extracted from the 10 Zedskillz design files in `/home/z/my-project/upload/`."
    )
    out_lines.append("")
    out_lines.append("## Deduplication (md5sum)")
    out_lines.append("")
    out_lines.append("| File | MD5 | Status |")
    out_lines.append("|------|-----|--------|")

    md5s = {f: md5(os.path.join(UPLOAD_DIR, f)) for f in FILES}
    seen = {}
    for f in FILES:
        if md5s[f] in seen:
            out_lines.append(f"| `{f}` | `{md5s[f]}` | Duplicate of `{seen[md5s[f]]}` — skipped |")
        else:
            seen[md5s[f]] = f
            out_lines.append(f"| `{f}` | `{md5s[f]}` | Unique |")
    out_lines.append("")
    out_lines.append("---")
    out_lines.append("")

    for f in FILES:
        path = os.path.join(UPLOAD_DIR, f)
        out_lines.append(f"## FILE: `{f}`")
        out_lines.append("")
        if md5s[f] in seen and seen[md5s[f]] != f:
            out_lines.append(
                f"This file is **byte-identical** to `{seen[md5s[f]]}` (same MD5: "
                f"`{md5s[f]}`). See that file's section above for the full extraction."
            )
            out_lines.append("")
            out_lines.append("---")
            out_lines.append("")
            continue

        with open(path, "r", encoding="utf-8") as fh:
            content = fh.read()

        # --- Task 1: Image URLs ---
        images = extract_images(content)
        out_lines.append("### Image URLs (with descriptions)")
        out_lines.append("")
        if not images:
            out_lines.append("_No Google AIDA image URLs found in this file._")
            out_lines.append("")
        else:
            for i, img in enumerate(images, 1):
                out_lines.append(f"**{i}.** URL: `{img['url']}`")
                out_lines.append("")
                if img["data_alt"]:
                    out_lines.append(f"   - **data-alt (AI generation prompt):** \"{img['data_alt']}\"")
                if img["alt"]:
                    out_lines.append(f"   - **alt:** \"{img['alt']}\"")
                out_lines.append(f"   - **Tag:** `<{img['tag']}>`")
                if img["class"]:
                    out_lines.append(f"   - **class:** `{img['class']}`")
                if img["style"]:
                    out_lines.append(f"   - **style:** `{img['style']}`")
                out_lines.append(f"   - **Used for:** {img['usage']}")
                out_lines.append("")
        out_lines.append("")

        # --- Task 2: Body HTML ---
        body_html, warn = extract_body(content)
        out_lines.append("### Body HTML (verbatim, ready for JSX conversion)")
        out_lines.append("")
        if warn:
            out_lines.append(f"_⚠️ {warn}_")
            out_lines.append("")
        out_lines.append("```html")
        out_lines.append(body_html)
        out_lines.append("```")
        out_lines.append("")
        out_lines.append("---")
        out_lines.append("")

    output = "\n".join(out_lines)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write(output)

    print(f"Wrote {OUTPUT_FILE}")
    print(f"Total size: {len(output)} bytes")
    print(f"Total images extracted: {sum(len(extract_images(open(os.path.join(UPLOAD_DIR, f)).read())) for f in FILES if md5s[f] in seen and seen[md5s[f]] == f)}")


if __name__ == "__main__":
    main()
