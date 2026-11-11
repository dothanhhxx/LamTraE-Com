#!/usr/bin/env bash
# Sinh lại mọi bản copy từ nguồn gốc ở root repo.
#
#   tools/sync.sh           ghi đè các bản copy cho khớp với nguồn
#   tools/sync.sh --check   chỉ kiểm tra, trả về lỗi nếu có bản copy bị lệch (dùng trong CI)
#
# Nguồn gốc (chỉ sửa ở đây):
#   AGENTS.md, SKILL.md, DISCLAIMER.md, LICENSE, references/, sources/, examples/, scripts/
# Bản copy (không sửa tay):
#   CLAUDE.md, .windsurfrules, .clinerules, .github/copilot-instructions.md,
#   .cursor/rules/vn-legal-compliance.mdc, plugins/vn-law-check/skills/vn-law-check/*,
#   plugins/vn-law-check/LICENSE

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

CURSOR_FRONTMATTER='---
description: Rà soát / audit website theo pháp luật Việt Nam (bảo vệ dữ liệu cá nhân, TMĐT, an ninh mạng, bảo vệ NTD, quảng cáo, giao dịch điện tử, AI)
globs:
alwaysApply: false
---'
RULE_COPIES=(CLAUDE.md .windsurfrules .clinerules .github/copilot-instructions.md)
CURSOR_RULE=.cursor/rules/vn-legal-compliance.mdc
PLUGIN_DIR=plugins/vn-law-check
SKILL_DIR=$PLUGIN_DIR/skills/vn-law-check
SKILL_ITEMS=(SKILL.md DISCLAIMER.md references sources examples scripts)

GENERATED=("${RULE_COPIES[@]}" "$CURSOR_RULE" "$SKILL_DIR" "$PLUGIN_DIR/LICENSE")

generate() {
  local out="$1"
  for f in "${RULE_COPIES[@]}"; do
    mkdir -p "$(dirname "$out/$f")"
    cp "$ROOT/AGENTS.md" "$out/$f"
  done

  mkdir -p "$(dirname "$out/$CURSOR_RULE")"
  { printf '%s\n\n' "$CURSOR_FRONTMATTER"; cat "$ROOT/AGENTS.md"; } > "$out/$CURSOR_RULE"

  # Plugin phải chứa file thật (Claude plugin directory không nhận symlink)
  rm -rf "${out:?}/$SKILL_DIR"
  mkdir -p "$out/$SKILL_DIR"
  for item in "${SKILL_ITEMS[@]}"; do
    cp -r "$ROOT/$item" "$out/$SKILL_DIR/"
  done
  cp "$ROOT/LICENSE" "$out/$PLUGIN_DIR/LICENSE"
}

if [ "${1:-}" = "--check" ]; then
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  generate "$tmp"
  drift=0
  for p in "${GENERATED[@]}"; do
    if ! diff -r "$ROOT/$p" "$tmp/$p" > /dev/null 2>&1; then
      echo "LỆCH: $p. Chạy tools/sync.sh rồi commit lại"
      drift=1
    fi
  done
  [ "$drift" = 0 ] && echo "Đồng bộ OK"
  exit $drift
fi

generate "$ROOT"
echo "Đã sinh lại các bản copy từ nguồn gốc."
