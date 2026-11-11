# vn-law-check

Skill cho Claude giúp audit sơ bộ pháp lý website và mobile app theo quy định Việt Nam hiện hành: bảo vệ dữ liệu cá nhân, thương mại điện tử, an ninh mạng, bảo vệ người tiêu dùng, quảng cáo trực tuyến, giao dịch điện tử, và minh bạch AI.

Khi plugin này được kích hoạt, Claude sẽ đọc code/nội dung website thực tế (footer, trang chính sách, cookie banner, form thu thập dữ liệu...), đối chiếu với 8 bộ checklist dựa trên văn bản pháp luật hiện hành, rồi xuất báo cáo phân loại mức độ rủi ro (cần xử lý ngay / nên cải thiện / đạt yêu cầu / không áp dụng). Mỗi phát hiện đều kèm số hiệu văn bản pháp luật cụ thể để người dùng tự xác minh lại.

Trước khi mở checklist, Claude phân loại website theo 4 mức (tĩnh, thu thập nhẹ, bán hàng, nền tảng quy mô) và chỉ áp dụng những checklist phù hợp. Blog cá nhân hay trang tĩnh không thu thập dữ liệu thì chỉ nhận một kết luận ngắn, không phải báo cáo dài.

Plugin gồm:
- các file markdown: checklist, rules, mẫu báo cáo, danh sách nguồn luật
- hai script bash trong `skills/vn-law-check/scripts/`

`scan.sh` quét website hoặc mobile app bằng `grep` để tìm form, script theo dõi, giỏ hàng, đăng nhập, chatbot AI, dấu hiệu hosting, quyền truy cập và SDK của app, rồi in kết quả ra màn hình:
- Khi đưa vào một thư mục source code: chỉ đọc file local, không gọi mạng.
- Khi đưa vào một URL: gọi `fetch-site.sh`. Script này dùng `curl` gửi request GET tới **chính URL người dùng đưa vào**, tải trang chủ, tối đa 15 trang cùng tên miền được link từ trang chủ (chính sách, liên hệ, sản phẩm, giỏ hàng, đăng nhập) và tối đa 20 file JavaScript cùng tên miền, mỗi file không quá 5 MB, vào một thư mục tạm trên máy người dùng. Request có User-Agent `vn-law-check (+https://github.com/mhfed/vn-law-check)`.

Hai script không gửi dữ liệu đi đâu khác, không đọc biến môi trường hay credential, không sửa file của người dùng.

Plugin không chạy MCP server, không có hook, không cần cấu hình gì thêm.

Lưu ý quan trọng: đây là công cụ hỗ trợ rà soát ban đầu, **không phải tư vấn pháp lý chính thức**. Luật Việt Nam về mảng này đang trong giai đoạn chuyển tiếp mạnh (nhiều luật mới 2025 có hiệu lực năm 2026). Xem thêm chi tiết và giới hạn tại `skills/vn-law-check/DISCLAIMER.md`.

Mã nguồn đầy đủ và tài liệu: https://github.com/mhfed/vn-law-check
