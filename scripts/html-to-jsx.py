#!/usr/bin/env python3
"""Convert Zedskillz design HTML files to React/TSX body content."""

import re
import sys

# HTML void (self-closing) elements
VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input",
             "link", "meta", "param", "source", "track", "wbr"}


def validate_tag_balance(html: str, filename: str = "<unknown>") -> list[str]:
    """
    Check that all non-void HTML tags are properly balanced.
    Prints warnings/errors to stderr. Returns True if any unclosed tags
    were found (ERROR level), False otherwise.
    """
    warnings = []
    # Remove HTML comments before scanning
    cleaned = re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)
    # Remove script/style blocks (they may contain < or > that would confuse the scanner)
    cleaned = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", "", cleaned, flags=re.DOTALL)

    # Extract all tags
    tag_pattern = re.compile(r"</?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>")
    stack = []
    line_counter = 1
    pos = 0

    for m in tag_pattern.finditer(cleaned):
        # Track line number for better error messages
        newlines = cleaned.count("\n", pos, m.start())
        line_counter += newlines
        pos = m.start()

        tag_name = m.group(1).lower()
        tag_text = m.group(0)

        if tag_name in VOID_TAGS:
            continue

        if tag_text.startswith("</"):
            # Closing tag
            if stack and stack[-1][0] == tag_name:
                stack.pop()
            else:
                expected = stack[-1][0] if stack else "nothing"
                warnings.append(
                    f"  WARNING: Unexpected closing </{tag_name}> at ~line {line_counter} "
                    f"(expected </{expected}>)"
                )
        else:
            # Opening tag
            # Check if self-closing (ends with />)
            if tag_text.rstrip().endswith("/>"):
                continue
            stack.append((tag_name, line_counter))

    # Report any unclosed tags
    for tag_name, line in reversed(stack):
        warnings.append(
            f"  ERROR: <{tag_name}> opened at ~line {line} has no matching closing tag"
        )

    if warnings:
        print(f"\n  TAG BALANCE ISSUES in {filename}:", file=sys.stderr)
        for w in warnings:
            print(w, file=sys.stderr)

    return any(w.startswith("  ERROR:") for w in warnings)


def convert_html_to_jsx(html: str) -> str:
    # Remove comments
    html = re.sub(r'<!--[^>]*-->', '', html)
    # class= -> className=
    html = re.sub(r'\bclass=', 'className=', html)
    # for= -> htmlFor=
    html = re.sub(r'\bfor=', 'htmlFor=', html)
    # Self-close void elements
    for tag in ['img', 'input', 'br', 'hr', 'meta', 'link']:
        html = re.sub(
            rf'<({tag})(\s[^>]*?)?>(?!.*?</{tag}>)',
            lambda m: f'<{m.group(1)}{m.group(2) or ""} />',
            html,
            flags=re.DOTALL
        )
    # Replace &quot; with '
    html = html.replace('&quot;', "'")
    # Convert style="..." with FILL quotes to JSX
    def style_replacer(m):
        style_val = m.group(1)
        if 'FILL' in style_val:
            return 'style={{ fontVariationSettings: \'"FILL" 1\' }}'
        # Convert CSS style string to JSX object
        # Handle background-image: url('...') patterns
        if 'url(' in style_val or ':' in style_val:
            # Split on ; but be careful with url() that may contain ;
            parts = []
            current = ''
            in_url = False
            for char in style_val:
                if char == '(':
                    in_url = True
                    current += char
                elif char == ')':
                    in_url = False
                    current += char
                elif char == ';' and not in_url:
                    if current.strip():
                        parts.append(current.strip())
                    current = ''
                else:
                    current += char
            if current.strip():
                parts.append(current.strip())
            jsx_parts = []
            for part in parts:
                if ':' in part:
                    key, val = part.split(':', 1)
                    key = key.strip()
                    val = val.strip()
                    # Convert kebab-case to camelCase
                    key = re.sub(r'-(\w)', lambda m: m.group(1).upper(), key)
                    # Preserve quotes for url() values
                    if val.startswith("'") or val.startswith('"'):
                        jsx_parts.append(f'{key}: {val}')
                    else:
                        jsx_parts.append(f'{key}: "{val}"')
            if jsx_parts:
                joined = ", ".join(jsx_parts)
                return f'style={{{{{joined}}}}}'
        return m.group(0)
    html = re.sub(r'style="([^"]*)"', style_replacer, html)
    # Remove data-* attributes
    html = re.sub(r'\sdata-alt="[^"]*"', '', html)
    html = re.sub(r'\sdata-icon="[^"]*"', '', html)
    # tabindex -> tabIndex
    html = re.sub(r'\btabindex=', 'tabIndex=', html)
    # readonly -> readOnly
    html = re.sub(r'\breadonly\b', 'readOnly', html)
    return html


def extract_body(filename: str) -> str:
    with open(filename, 'r') as f:
        html = f.read()
    body_match = re.search(r'<body[^>]*>(.*?)(?:<script|<pixiebrix|</body>)', html, re.DOTALL)
    return body_match.group(1) if body_match else ''


if __name__ == '__main__':
    source_file = sys.argv[1]
    out_file = sys.argv[2]

    body = extract_body(source_file)
    if not body:
        print(f"WARNING: No body content found in {source_file}", file=sys.stderr)

    # Validate tag balance before conversion
    has_errors = validate_tag_balance(body, source_file)

    if has_errors:
        print(f"ERROR: Tag balance validation failed for {source_file} — aborting.", file=sys.stderr)
        sys.exit(1)

    jsx = convert_html_to_jsx(body)

    with open(out_file, 'w') as f:
        f.write(jsx)
    print(f"Converted {source_file} -> {out_file} ({len(jsx)} chars)")
