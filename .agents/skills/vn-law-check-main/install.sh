#!/usr/bin/env bash
# Cài vn-law-check vào project hiện tại (hoặc thư mục chỉ định).
#   curl -fsSL https://raw.githubusercontent.com/mhfed/vn-law-check/main/install.sh | bash
#   ./install.sh /path/to/project
#
# Toàn bộ checklist được cài vào .vn-law-check/ để không lẫn với file của project.
# File rules ở root (AGENTS.md, CLAUDE.md, ...) KHÔNG bị ghi đè:
#   - chưa có thì tạo mới với 1 đoạn trỏ tới .vn-law-check/
#   - có rồi thì chèn thêm đoạn đó vào cuối (chạy lại nhiều lần không bị chèn trùng)

set -euo pipefail

REPO="https://github.com/mhfed/vn-law-check"
TARGET="${1:-.}"
KIT_DIR="$TARGET/.vn-law-check"
MARK_START="<!-- vn-law-check:start -->"
MARK_END="<!-- vn-law-check:end -->"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

if [ ! -d "$TARGET" ]; then
  echo "Không tìm thấy thư mục: $TARGET" >&2
  exit 1
fi

echo "Đang tải vn-law-check..."
git clone --depth 1 --quiet "$REPO" "$TMP/repo"
SRC="$TMP/repo"

# 1. Cài (hoặc cập nhật) bộ checklist vào .vn-law-check/
rm -rf "$KIT_DIR"
mkdir -p "$KIT_DIR"
cp "$SRC/AGENTS.md" "$SRC/DISCLAIMER.md" "$KIT_DIR/"
cp -r "$SRC/references" "$SRC/sources" "$SRC/examples" "$SRC/scripts" "$KIT_DIR/"

# 2. Gắn đoạn trỏ tới .vn-law-check/ vào file rules của từng tool, không ghi đè
POINTER="$MARK_START
## Audit pháp lý website theo luật Việt Nam (vn-law-check)

Khi được yêu cầu audit/rà soát pháp lý website theo luật Việt Nam, đọc và làm theo \`.vn-law-check/AGENTS.md\`. Mọi đường dẫn trong file đó tính từ thư mục \`.vn-law-check/\`.
$MARK_END"

add_pointer() {
  local file="$1"
  mkdir -p "$(dirname "$file")"
  if [ -f "$file" ] && grep -qF "$MARK_START" "$file"; then
    echo "  bỏ qua  $file (đã có)"
  elif [ -f "$file" ]; then
    printf '\n%s\n' "$POINTER" >> "$file"
    echo "  chèn    $file"
  else
    printf '%s\n' "$POINTER" > "$file"
    echo "  tạo     $file"
  fi
}

for f in AGENTS.md CLAUDE.md .windsurfrules .clinerules .github/copilot-instructions.md; do
  add_pointer "$TARGET/$f"
done

# Cursor dùng file riêng trong .cursor/rules/ nên ghi thẳng, không đụng rule khác
mkdir -p "$TARGET/.cursor/rules"
cat > "$TARGET/.cursor/rules/vn-law-check.mdc" <<EOF
---
description: Audit pháp lý website theo luật Việt Nam (dữ liệu cá nhân, TMĐT, an ninh mạng, bảo vệ NTD, quảng cáo, giao dịch điện tử, AI)
globs:
alwaysApply: false
---

$POINTER
EOF
echo "  tạo     $TARGET/.cursor/rules/vn-law-check.mdc"

echo
echo "Xong. Checklist nằm ở $KIT_DIR"
echo "Mở agent/IDE của bạn và yêu cầu: \"Audit pháp lý website này theo luật Việt Nam\""
