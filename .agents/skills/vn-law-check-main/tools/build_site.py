#!/usr/bin/env python3
"""Sinh trang tĩnh cho GitHub Pages vào docs/.

Chạy: python3 tools/build_site.py
Nội dung lấy từ references/ (đã đối chiếu). Sửa nội dung luật ở references/ trước, rồi sửa trang ở đây cho khớp.
"""
import html, json, pathlib

BASE = "https://mhfed.github.io/vn-law-check/"
REPO = "https://github.com/mhfed/vn-law-check"
UPDATED = "05/11/2026"
OUT = pathlib.Path(__file__).resolve().parent.parent / "docs"

CSS = """
:root{--fg:#1d1d1f;--muted:#5b5b66;--line:#e6e6eb;--bg:#fbfbfd;--accent:#c2410c;--soft:#fff4ed}
*{box-sizing:border-box}
body{margin:0;font:17px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:var(--fg);background:var(--bg)}
a{color:var(--accent)}
header,main,footer{max-width:760px;margin:0 auto;padding:0 20px}
header{display:flex;justify-content:space-between;align-items:center;padding-top:20px;padding-bottom:12px;border-bottom:1px solid var(--line)}
header a{text-decoration:none;color:var(--fg);font-weight:600}
header nav a{font-weight:400;color:var(--muted);margin-left:16px;font-size:15px}
h1{font-size:34px;line-height:1.2;margin:36px 0 12px;letter-spacing:-.01em}
h2{font-size:23px;margin:36px 0 8px}
h3{font-size:18px;margin:24px 0 6px}
.lead{font-size:19px;color:var(--muted);margin:0 0 20px}
.meta{font-size:14px;color:var(--muted)}
.note{background:var(--soft);border-left:3px solid var(--accent);padding:12px 16px;border-radius:6px;font-size:15px;margin:20px 0}
.cta{display:inline-block;background:var(--fg);color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;margin:6px 8px 6px 0}
.cta.alt{background:#fff;color:var(--fg);border:1px solid var(--line)}
pre{background:#16161a;color:#f4f4f5;padding:14px 16px;border-radius:8px;overflow-x:auto;font-size:14px;line-height:1.5}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.92em}
p code,li code{background:#f0f0f3;padding:1px 5px;border-radius:4px}
table{border-collapse:collapse;width:100%;font-size:15px;margin:12px 0}
th,td{border-bottom:1px solid var(--line);padding:8px 6px;text-align:left;vertical-align:top}
th{font-weight:600}
ul.check{list-style:none;padding-left:0}
ul.check li{padding-left:28px;position:relative;margin:8px 0}
ul.check li:before{content:"☐";position:absolute;left:2px;color:var(--accent)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;margin:16px 0}
.card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px 16px;text-decoration:none;color:var(--fg)}
.card b{display:block;margin-bottom:4px}
.card span{color:var(--muted);font-size:14px}
footer{margin-top:48px;padding-top:16px;padding-bottom:40px;border-top:1px solid var(--line);font-size:14px;color:var(--muted)}
@media (max-width:600px){h1{font-size:28px}header nav{display:none}}
"""

FOOT_NOTE = (
    '<div class="note">Nội dung do một dev tổng hợp và đối chiếu với văn bản gốc, '
    f'cập nhật {UPDATED}. Chỉ để tham khảo, không phải ý kiến pháp lý. '
    'Thấy chỗ sai, <a href="' + REPO + '/issues/new/choose">báo giúp mình</a>.</div>'
)

TOOL_CTA = f"""
<h2>Tự kiểm tra website của bạn</h2>
<p><b>vn-law-check</b> là bộ hướng dẫn mã nguồn mở cho AI coding agent (Claude Code, Cursor, Copilot, Windsurf, Cline, Codex). Bạn gõ "audit pháp lý site này", agent quét code rồi chỉ ra file, dòng cần sửa kèm điều luật liên quan. Miễn phí.</p>
<pre><code>/plugin marketplace add mhfed/vn-law-check
/plugin install vn-law-check</code></pre>
<p class="meta">Lệnh trên dùng trong Claude Code. Cursor, Copilot và các tool khác: xem <a href="{REPO}#dùng-thế-nào">hướng dẫn cài</a>.</p>
<a class="cta" href="{REPO}">Xem trên GitHub</a>
"""

def page(slug, title, desc, body, faq=None):
    url = BASE + ("" if slug == "index" else slug + ".html")
    ld = [{"@context": "https://schema.org", "@type": "Article", "headline": title,
           "description": desc, "inLanguage": "vi", "dateModified": "2026-11-05",
           "author": {"@type": "Person", "name": "mhfed", "url": "https://github.com/mhfed"}}]
    if faq:
        ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]})
    faq_html = ""
    if faq:
        faq_html = "<h2>Hỏi nhanh</h2>" + "".join(f"<h3>{html.escape(q)}</h3><p>{html.escape(a)}</p>" for q, a in faq)
    doc = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="https://raw.githubusercontent.com/mhfed/vn-law-check/main/demo/social-preview.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<style>{CSS}</style>
</head>
<body>
<header><a href="./">vn-law-check</a><nav><a href="checklist-du-lieu-ca-nhan-website.html">Checklist</a><a href="muc-phat-du-lieu-ca-nhan.html">Mức phạt</a><a href="{REPO}">GitHub</a></nav></header>
<main>
{body}
{faq_html}
{FOOT_NOTE}
{"" if slug == "index" else TOOL_CTA}
</main>
<footer>vn-law-check · mã nguồn mở, MIT · <a href="{REPO}">github.com/mhfed/vn-law-check</a> · <a href="{REPO}#mời-mình-ly-cà-phê">Mời mình ly cà phê ☕</a> · Văn bản pháp luật được dẫn là tài liệu công khai của Nhà nước.</footer>
</body>
</html>
"""
    (OUT / ("index.html" if slug == "index" else slug + ".html")).write_text(doc, encoding="utf-8")
    return url

PAGES = []

# ---------- Trang chủ ----------
PAGES.append(("index",
"Kiểm tra website có đúng luật Việt Nam không | vn-law-check",
"Công cụ mã nguồn mở giúp AI agent rà soát website, mobile app theo Luật Bảo vệ dữ liệu cá nhân 91/2025, NĐ 356/2025, Luật TMĐT 2025. Chỉ đúng file, dòng cần sửa.",
f"""
<h1>Website của bạn có đúng luật Việt Nam không?</h1>
<p class="lead">Site có ô nhập email, số điện thoại, gắn Google Analytics hay có giỏ hàng là đã thuộc phạm vi Luật Bảo vệ dữ liệu cá nhân 91/2025. vn-law-check giúp AI agent soi code và chỉ ra chỗ cần sửa.</p>
<a class="cta" href="{REPO}">Dùng miễn phí trên GitHub</a><a class="cta alt" href="checklist-du-lieu-ca-nhan-website.html">Xem checklist</a>

<h2>Cách dùng</h2>
<ol>
<li>Cài vào Claude Code, Cursor, Copilot, Windsurf, Cline hoặc Codex.</li>
<li>Gõ <code>audit pháp lý website này theo luật Việt Nam</code>. Không có code thì đưa địa chỉ web.</li>
<li>Nhận báo cáo 🔴🟡🟢 kèm file, dòng và điều luật liên quan. Bảo agent sửa luôn.</li>
</ol>
<pre><code>/plugin marketplace add mhfed/vn-law-check
/plugin install vn-law-check</code></pre>

<h2>Hướng dẫn theo câu hỏi</h2>
<div class="cards">
<a class="card" href="checklist-du-lieu-ca-nhan-website.html"><b>Checklist dữ liệu cá nhân cho website</b><span>Luật 91/2025 và NĐ 356/2025 áp vào website cụ thể thế nào</span></a>
<a class="card" href="mau-chinh-sach-bao-mat.html"><b>Chính sách bảo mật cần có gì</b><span>Các mục bắt buộc, form đồng ý, banner cookie</span></a>
<a class="card" href="muc-phat-du-lieu-ca-nhan.html"><b>Mức phạt vi phạm dữ liệu cá nhân</b><span>Bảng NĐ 330/2026, tổ chức và hộ kinh doanh</span></a>
<a class="card" href="shop-nho-ho-kinh-doanh.html"><b>Shop nhỏ, hộ kinh doanh được miễn gì</b><span>Điều 38 Luật 91/2025 nói gì, việc nào vẫn phải làm</span></a>
</div>

<h2>Theo luật nào</h2>
<ul>
<li>Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (thay Nghị định 13/2023)</li>
<li>Nghị định 330/2026/NĐ-CP xử phạt an ninh mạng và dữ liệu cá nhân</li>
<li>Luật Thương mại điện tử 122/2025/QH15 và Nghị định 248/2026/NĐ-CP</li>
<li>Luật An ninh mạng 116/2025/QH15, Luật Bảo vệ quyền lợi người tiêu dùng 19/2023/QH15, Luật Quảng cáo sửa đổi 75/2025/QH15, Luật Trí tuệ nhân tạo 134/2025/QH15</li>
</ul>
""", None))

# ---------- Checklist ----------
PAGES.append(("checklist-du-lieu-ca-nhan-website",
"Checklist bảo vệ dữ liệu cá nhân cho website theo Luật 91/2025 và NĐ 356/2025",
"Website cần làm gì theo Luật Bảo vệ dữ liệu cá nhân 91/2025 và Nghị định 356/2025: chính sách, ô đồng ý, banner cookie, thời hạn xử lý yêu cầu. Có dẫn điều khoản.",
"""
<h1>Checklist dữ liệu cá nhân cho website</h1>
<p class="lead">Từ 01/01/2026, Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP có hiệu lực, thay Nghị định 13/2023. Đây là những việc một website thu thập dữ liệu cần kiểm tra, xếp theo thứ tự nên làm.</p>
<p class="meta">Site không có form, không có tracking, không bán hàng thì gần như không phát sinh nghĩa vụ gì đáng kể.</p>

<h2>1. Xin đồng ý đúng cách</h2>
<ul class="check">
<li>Ô đồng ý <b>không tích sẵn</b>, không có chỉ dẫn gây nhầm giữa đồng ý và không đồng ý (khoản 3 Điều 6 NĐ 356/2025).</li>
<li>Không coi im lặng hay "tiếp tục sử dụng website" là đồng ý (điểm d khoản 4 Điều 9 Luật 91/2025).</li>
<li>Đồng ý riêng cho từng mục đích. Không gộp việc nhận quảng cáo vào điều khoản dịch vụ (điểm a, b khoản 4 Điều 9).</li>
<li>Lưu được ai đồng ý, lúc nào, với nội dung gì. Khi có tranh chấp, chủ site phải chứng minh (khoản 1, 2 Điều 6 NĐ 356/2025).</li>
<li>Người dùng rút lại đồng ý được, bằng văn bản hoặc dạng điện tử (khoản 2 Điều 10 Luật 91/2025).</li>
</ul>

<h2>2. Cookie và tracking</h2>
<ul class="check">
<li>Google Analytics, Facebook Pixel, TikTok Pixel chỉ chạy <b>sau khi</b> người dùng bấm đồng ý trên banner.</li>
<li>Từ chối cookie không thiết yếu mà vẫn dùng được site.</li>
<li>Theo dõi website để quảng cáo theo hành vi chỉ được làm khi có đồng ý, phải có cách từ chối, xác định thời gian lưu (khoản 8 Điều 28 Luật 91/2025).</li>
<li>Dữ liệu theo dõi hành vi trên không gian mạng được xếp vào nhóm dữ liệu nhạy cảm (điểm l khoản 1 Điều 4 NĐ 356/2025).</li>
</ul>

<h2>3. Trang chính sách bảo mật</h2>
<ul class="check">
<li>Có trang chính sách công khai, link ở footer và ngay tại form thu thập dữ liệu.</li>
<li>Nêu loại dữ liệu, mục đích, bên nhận dữ liệu (Google, Meta, Firebase, OpenAI...), thời gian lưu.</li>
<li>Nêu quyền của người dùng: được biết, đồng ý, rút đồng ý, xem, sửa, xóa, hạn chế xử lý, khiếu nại (khoản 1 Điều 4 Luật 91/2025).</li>
<li>Không còn dẫn Nghị định 13/2023, văn bản đã hết hiệu lực từ 01/01/2026.</li>
</ul>
<p><a href="mau-chinh-sach-bao-mat.html">Chính sách bảo mật cần có những mục gì →</a></p>

<h2>4. Thời hạn xử lý yêu cầu của người dùng</h2>
<p>Theo Điều 5 NĐ 356/2025:</p>
<table>
<tr><th>Yêu cầu</th><th>Thời hạn</th><th>Nếu cần bên thứ ba cùng xử lý</th></tr>
<tr><td>Xác nhận đã nhận, hướng dẫn thủ tục</td><td>2 ngày làm việc</td><td></td></tr>
<tr><td>Xem, sửa, cung cấp dữ liệu</td><td>10 ngày</td><td>15 ngày</td></tr>
<tr><td>Rút đồng ý, hạn chế, phản đối xử lý</td><td>15 ngày</td><td>20 ngày</td></tr>
<tr><td>Xóa dữ liệu</td><td>20 ngày</td><td>30 ngày</td></tr>
</table>
<p class="meta">Yêu cầu phức tạp được gia hạn một lần, phải báo lý do cho người yêu cầu.</p>

<h2>5. Giấy tờ: để sau, nên hỏi người làm luật</h2>
<p>Hồ sơ đánh giá tác động, hồ sơ chuyển dữ liệu ra nước ngoài (khi dùng Firebase, Vercel, dịch vụ đặt ở nước ngoài), chỉ định nhân sự bảo vệ dữ liệu. Hộ kinh doanh, doanh nghiệp siêu nhỏ được miễn một phần (<a href="shop-nho-ho-kinh-doanh.html">xem chi tiết</a>). Với site nhỏ, nên sửa xong các mục 1-3 trước, rồi hỏi người làm luật phần này.</p>
""",
[("Website không có form thì có phải làm gì không?", "Site tĩnh không có form, không gắn tracking, không bán hàng thì gần như không thu thập dữ liệu cá nhân, nên không phát sinh nghĩa vụ đáng kể theo Luật 91/2025."),
 ("Nghị định 13/2023 còn dùng được không?", "Không. Nghị định 13/2023/NĐ-CP hết hiệu lực từ 01/01/2026, được thay bằng Nghị định 356/2025/NĐ-CP. Chính sách bảo mật còn dẫn Nghị định 13 nên cập nhật."),
 ("Gắn Google Analytics có cần xin đồng ý không?", "Nên xin. Dữ liệu theo dõi hành vi trên không gian mạng được NĐ 356/2025 xếp vào nhóm nhạy cảm, và Luật 91/2025 yêu cầu xin đồng ý trước khi thu thập. Cách an toàn là chỉ nạp Google Analytics sau khi người dùng bấm đồng ý trên banner cookie.")]))

# ---------- Chính sách ----------
PAGES.append(("mau-chinh-sach-bao-mat",
"Chính sách bảo mật website cần có những gì theo Luật 91/2025",
"Các mục một chính sách bảo vệ dữ liệu cá nhân cần có theo Luật 91/2025 và NĐ 356/2025, kèm mẫu form đồng ý và banner cookie. Không dẫn Nghị định 13 nữa.",
f"""
<h1>Chính sách bảo mật cần có những gì</h1>
<p class="lead">Nhiều site vẫn dùng chính sách copy từ đâu đó, dẫn Nghị định 13/2023 đã hết hiệu lực. Dưới đây là những mục nên có theo Luật 91/2025/QH15 và NĐ 356/2025/NĐ-CP.</p>

<h2>Các mục nên có</h2>
<ol>
<li><b>Ai là bên kiểm soát dữ liệu:</b> tên đơn vị, địa chỉ, email nhận yêu cầu (điểm b khoản 2 Điều 9 Luật 91/2025).</li>
<li><b>Thu dữ liệu gì, để làm gì:</b> chỉ ghi những gì site thật sự thu (điểm a khoản 2 Điều 9).</li>
<li><b>Dữ liệu nhạy cảm</b> nếu có, và nói rõ đó là dữ liệu nhạy cảm (khoản 4 Điều 6 NĐ 356/2025).</li>
<li><b>Bên thứ ba nhận dữ liệu:</b> Google Analytics, Facebook Pixel, Firebase, OpenAI, đơn vị vận chuyển...</li>
<li><b>Lưu ở đâu, bao lâu:</b> nếu dùng dịch vụ đặt ở nước ngoài thì đó là chuyển dữ liệu xuyên biên giới (khoản 1 Điều 20 Luật 91/2025).</li>
<li><b>Cookie:</b> loại nào luôn bật, loại nào chỉ bật khi đồng ý, cách đổi lựa chọn.</li>
<li><b>Quyền của người dùng và cách yêu cầu,</b> kèm thời hạn theo Điều 5 NĐ 356/2025.</li>
<li><b>Khi có sự cố:</b> thông báo cơ quan chuyên trách trong 72 giờ (khoản 1 Điều 23 Luật 91/2025).</li>
</ol>
<p>Không viết "chúng tôi tuân thủ đầy đủ pháp luật" hay hứa biện pháp bảo mật mà site không có.</p>

<h2>Form đồng ý mẫu</h2>
<pre><code>{html.escape('''<label>
  <input type="checkbox" name="consent_order" required>
  Tôi đồng ý để [Tên đơn vị] dùng họ tên, số điện thoại để giao hàng,
  theo <a href="/chinh-sach-bao-mat">chính sách bảo vệ dữ liệu cá nhân</a>.
</label>
<label>
  <input type="checkbox" name="consent_marketing">
  Gửi tôi tin khuyến mãi (không bắt buộc, hủy bất cứ lúc nào).
</label>''')}</code></pre>
<p>Hai ô riêng, không tích sẵn. Ở server, lưu thời điểm, mục đích và phiên bản chính sách mỗi lần người dùng đồng ý.</p>

<h2>Để AI soạn giúp từ code của bạn</h2>
<p>Cài vn-law-check rồi gõ <code>soạn chính sách bảo mật cho dự án này</code>. Agent đọc code để biết site thu dữ liệu gì, gửi cho dịch vụ nào, rồi soạn bản nháp và sửa luôn form đồng ý, banner cookie. Thông tin không có trong code như mã số thuế thì để trống cho bạn điền. Xem <a href="{REPO}/blob/main/examples/privacy-policy-template.md">khung chính sách đầy đủ</a>.</p>
""",
[("Có mẫu chính sách bảo mật dùng ngay được không?", "Có khung mẫu trong repo vn-law-check, nhưng mỗi site thu dữ liệu khác nhau nên cần điền theo đúng thực tế. Agent có thể đọc code và soạn bản nháp khớp với site của bạn."),
 ("Chính sách cũ dẫn Nghị định 13 có sao không?", "Nghị định 13/2023 đã hết hiệu lực từ 01/01/2026. Nên cập nhật căn cứ thành Luật 91/2025 và Nghị định 356/2025.")]))

# ---------- Mức phạt ----------
PAGES.append(("muc-phat-du-lieu-ca-nhan",
"Mức phạt vi phạm bảo vệ dữ liệu cá nhân theo Nghị định 330/2026",
"Bảng mức phạt vi phạm dữ liệu cá nhân theo NĐ 330/2026: xử lý không có đồng ý, ô tích sẵn, quảng cáo nhắm mục tiêu. Tổ chức và cá nhân, hộ kinh doanh. Khác gì NĐ 363/2026.",
"""
<h1>Mức phạt vi phạm dữ liệu cá nhân</h1>
<p class="lead">Nghị định 330/2026/NĐ-CP (hiệu lực 19/08/2026) quy định xử phạt vi phạm an ninh mạng và bảo vệ dữ liệu cá nhân. Điều nhiều người đọc nhầm: mức ghi trong phần dữ liệu cá nhân là mức cho <b>tổ chức</b>.</p>

<div class="note"><b>Cá nhân và hộ kinh doanh chịu 1/2 mức của tổ chức</b> (khoản 1 Điều 7, khoản 3 Điều 2 NĐ 330/2026). Trần chung: 3 tỷ đồng với tổ chức, 1,5 tỷ với cá nhân. Mức 5% doanh thu chỉ áp cho vi phạm chuyển dữ liệu xuyên biên giới, không áp cho mọi lỗi.</div>

<table>
<tr><th>Hành vi</th><th>Tổ chức</th><th>Cá nhân, hộ KD</th><th>Căn cứ</th></tr>
<tr><td>Xử lý dữ liệu khi chưa có đồng ý; đặt mặc định đồng ý; không xin theo từng mục đích; không lưu bằng chứng đồng ý</td><td>30-50 triệu</td><td>15-25 triệu</td><td>Điều 43 khoản 1</td></tr>
<tr><td>Coi im lặng là đồng ý; cố ý tiếp tục xử lý sau khi bị yêu cầu dừng</td><td>50-70 triệu</td><td>25-35 triệu</td><td>Điều 43 khoản 2</td></tr>
<tr><td>Từ chối cung cấp dữ liệu cho chính người dùng khi có yêu cầu hợp lệ</td><td>10-20 triệu</td><td>5-10 triệu</td><td>Điều 49 khoản 1</td></tr>
<tr><td>Quảng cáo: dùng dữ liệu khi chưa có đồng ý, không có cách từ chối, mặc định đồng ý chia sẻ cho mạng quảng cáo</td><td>30-50 triệu</td><td>15-25 triệu</td><td>Điều 63 khoản 1</td></tr>
<tr><td>Quảng cáo: theo dõi trên website để quảng cáo theo hành vi khi chưa có đồng ý; dùng dữ liệu nhạy cảm</td><td>50-70 triệu</td><td>25-35 triệu</td><td>Điều 63 khoản 2</td></tr>
</table>
<p class="meta">Mức cụ thể lấy từ ít nhất hai nguồn thứ cấp trùng khớp (Luật Việt An, LSVN, LuatVietnam), chưa đối chiếu câu chữ tiếng Việt gốc. Nguyên tắc tổ chức và cá nhân đã đối chiếu với bản dịch toàn văn.</p>

<h2>Đáng lo hơn tiền phạt: biện pháp khắc phục</h2>
<p>Ngoài tiền phạt, có thể bị buộc xóa dữ liệu thu thập trái phép đến mức không khôi phục được (Điều 5 NĐ 330/2026). Với site đã gom danh sách khách hàng nhiều năm, đây mới là thiệt hại lớn.</p>

<h2>NĐ 330 khác gì NĐ 363?</h2>
<p>Nghị định 363/2026/NĐ-CP (hiệu lực 11/11/2026) xử phạt trong lĩnh vực <b>dữ liệu</b> nói chung theo Luật Dữ liệu, chủ yếu nhắm vào dữ liệu quan trọng, cơ sở dữ liệu nhà nước, dịch vụ xác thực dữ liệu. Ở NĐ 363, mức ghi là của cá nhân, tổ chức gấp đôi. Với website bán hàng, landing page thông thường, nghị định cần để ý vẫn là NĐ 330.</p>
""",
[("Hộ kinh doanh bị phạt bao nhiêu nếu không xin đồng ý?", "Theo NĐ 330/2026, hộ kinh doanh bị phạt như cá nhân, bằng 1/2 mức của tổ chức. Với lỗi xử lý dữ liệu khi chưa có đồng ý, mức tham khảo là 15-25 triệu đồng."),
 ("Phạt 5% doanh thu áp dụng khi nào?", "Chỉ với vi phạm quy định về chuyển dữ liệu cá nhân xuyên biên giới (Điều 8 khoản 4 Luật 91/2025, khoản 4 Điều 7 NĐ 330/2026). Các lỗi khác có trần 3 tỷ đồng với tổ chức.")]))

# ---------- Shop nhỏ ----------
PAGES.append(("shop-nho-ho-kinh-doanh",
"Shop nhỏ, hộ kinh doanh được miễn gì theo Luật Bảo vệ dữ liệu cá nhân 2025",
"Điều 38 Luật 91/2025 miễn cho hộ kinh doanh, doanh nghiệp siêu nhỏ những nghĩa vụ nào, việc nào vẫn phải làm, khi nào mất miễn trừ. Viết cho shop online nhỏ.",
"""
<h1>Shop nhỏ, hộ kinh doanh được miễn gì?</h1>
<p class="lead">Ngắn gọn: được miễn phần lớn giấy tờ, nhưng vẫn phải xin đồng ý đúng cách và có chính sách bảo mật. Mà mấy việc đó sửa trong code vài giờ là xong.</p>

<h2>Được miễn (khoản 3 Điều 38 Luật 91/2025)</h2>
<p>Hộ kinh doanh và doanh nghiệp siêu nhỏ không phải làm:</p>
<ul>
<li>Hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (Điều 21)</li>
<li>Cập nhật hồ sơ đánh giá tác động (Điều 22)</li>
<li>Chỉ định bộ phận, nhân sự bảo vệ dữ liệu (khoản 2 Điều 33)</li>
</ul>
<p>Doanh nghiệp nhỏ và doanh nghiệp khởi nghiệp được chọn chưa làm các việc trên trong 5 năm kể từ 01/01/2026 (khoản 2 Điều 38).</p>

<h2>Không được miễn</h2>
<ul>
<li><b>Xin đồng ý, có chính sách bảo mật, tôn trọng quyền của khách.</b> Đây là việc chính và sửa được ngay.</li>
<li><b>Hồ sơ chuyển dữ liệu ra nước ngoài</b> (khoản 2 Điều 20): về lý thuyết vẫn áp dụng nếu dữ liệu khách lưu trên dịch vụ đặt ở nước ngoài. Shop nhỏ nên hỏi người làm luật xem có cần làm không, không cần hoảng.</li>
</ul>

<h2>Khi nào mất miễn trừ</h2>
<p>Khoản 3 Điều 38 loại trừ ba trường hợp: kinh doanh dịch vụ xử lý dữ liệu, trực tiếp xử lý dữ liệu nhạy cảm, hoặc xử lý dữ liệu của số lượng lớn người (theo nguồn thứ cấp là từ 100.000 người, quy định ở Điều 41 NĐ 356/2025).</p>
<p>Còn một điểm chưa rõ: NĐ 356/2025 xếp dữ liệu theo dõi hành vi trên mạng vào nhóm nhạy cảm, nên shop gắn Google Analytics, Facebook Pixel có bị coi là "trực tiếp xử lý dữ liệu nhạy cảm" không thì chưa có hướng dẫn. Nếu bạn làm luật và biết câu trả lời, <a href="https://github.com/mhfed/vn-law-check/issues/4">góp ý giúp ở đây</a>.</p>

<h2>Shop nhỏ nên làm theo thứ tự này</h2>
<ol>
<li>Bỏ ô đồng ý tích sẵn, bỏ câu "tiếp tục sử dụng là đồng ý".</li>
<li>Chỉ chạy Google Analytics, Pixel sau khi khách bấm đồng ý.</li>
<li>Viết lại chính sách bảo mật theo Luật 91/2025, liệt kê đủ dịch vụ nhận dữ liệu.</li>
<li>Rồi mới hỏi người làm luật phần giấy tờ.</li>
</ol>
""",
[("Hộ kinh doanh có phải chỉ định người bảo vệ dữ liệu không?", "Không, theo khoản 3 Điều 38 Luật 91/2025, trừ khi kinh doanh dịch vụ xử lý dữ liệu, trực tiếp xử lý dữ liệu nhạy cảm hoặc xử lý dữ liệu của số lượng lớn người."),
 ("Cá nhân bán hàng online có được miễn như hộ kinh doanh không?", "Điều 38 chỉ nhắc hộ kinh doanh, doanh nghiệp siêu nhỏ, doanh nghiệp nhỏ và khởi nghiệp, không nhắc cá nhân. Luật 91/2025 vẫn áp dụng với cá nhân có thu thập dữ liệu của người khác, nên hỏi người làm luật cho trường hợp cụ thể.")]))


def main():
    OUT.mkdir(exist_ok=True)
    urls = [page(*p) for p in PAGES]
    (OUT / ".nojekyll").write_text("")
    (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n")
    items = "".join(f"<url><loc>{u}</loc><lastmod>2026-11-05</lastmod></url>" for u in urls)
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{items}</urlset>\n')
    print("\n".join(urls))

if __name__ == "__main__":
    main()
