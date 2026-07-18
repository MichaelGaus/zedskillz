#!/usr/bin/env python3
"""Convert Zedskillz design HTML files to React/TSX body content."""

import re
import sys

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
    body = extract_body(sys.argv[1])
    jsx = convert_html_to_jsx(body)
    with open(sys.argv[2], 'w') as f:
        f.write(jsx)
    print(f"Converted {sys.argv[1]} -> {sys.argv[2]} ({len(jsx)} chars)")
