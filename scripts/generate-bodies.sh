#!/usr/bin/env bash
# Regenerate all page body components from design HTML files.
# Usage: bash scripts/generate-bodies.sh

set -e

UPLOAD_DIR="/home/z/my-project/upload"
PAGES_DIR="/home/z/my-project/src/components/pages"
SCRIPT="/home/z/my-project/scripts/html-to-jsx.py"
TMP_DIR="/tmp/jsx-out"

mkdir -p "$TMP_DIR"

# Map: source file -> body component name
declare -A FILES=(
  ["Zedskillz_landing_page_ui.txt"]="landing-body"
  ["zedskillz_signin_page_ui.txt"]="signin-body"
  ["zedskillz_signup_page_ui.txt"]="signup-body"
  ["zedskillz_admin_dashboard_ui.txt"]="admin-body"
  ["zedskillz_couse_explorer_ui.txt"]="courses-body"
  ["zedskillz_my_courses_ui.txt"]="my-courses-body"
  ["zedskillz_leaderboard_ui.txt"]="leaderboard-body"
  ["zedskillz_community_page_ui.txt"]="community-body"
  ["zedskillz_individual_post_view.txt"]="post-body"
)

for src in "${!FILES[@]}"; do
  body="${FILES[$src]}"
  tmp="$TMP_DIR/${body}.tsx"
  echo "Converting $src -> $body"
  python3 "$SCRIPT" "$UPLOAD_DIR/$src" "$tmp"
  # Replace HTML entities
  sed -i 's/&amp;/\&/g; s/&quot;/'"'"'/g; s/&lt;/</g; s/&gt;/>/g; s/&nbsp;/ /g' "$tmp"
  # Wrap in component
  out="$PAGES_DIR/$body.tsx"
  cat > "$out" << HEADER
// AUTO-GENERATED from $src — DO NOT EDIT MANUALLY
// Conversion: HTML body → JSX (class=→className=, void tags self-closed, style attrs converted)

export function ${body^}() {
  return (
    <>
HEADER
  # Convert component name to PascalCase
  pascal=$(echo "$body" | awk -F- '{for(i=1;i<=NF;i++) printf "%s%s", toupper(substr($i,1,1)), substr($i,2); print ""}')
  # Rewrite header with correct component name
  cat > "$out" << HEADER
// AUTO-GENERATED from $src — DO NOT EDIT MANUALLY
// Conversion: HTML body → JSX (class=→className=, void tags self-closed, style attrs converted)

export function ${pascal}() {
  return (
    <>
HEADER
  sed 's/^/      /' "$tmp" >> "$out"
  cat >> "$out" << FOOTER
    </>
  );
}
FOOTER
  echo "  Wrote $out ($(wc -l < "$out") lines)"
done

echo "Done."
