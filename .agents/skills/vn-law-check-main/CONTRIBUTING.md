# Góp ý cho vn-law-check

Cảm ơn bạn ghé qua. Repo này do dev viết, không phải luật sư, nên góp ý của người đọc luật kỹ là phần quý nhất.

## Không biết code? Vẫn giúp được

Phần lớn việc cần làm là đối chiếu với văn bản luật gốc, không cần code.

- **Có sẵn việc để nhận:** các issue gắn nhãn [`cần xác minh`](https://github.com/mhfed/vn-law-check/issues?q=is%3Aissue+is%3Aopen+label%3A%22c%E1%BA%A7n+x%C3%A1c+minh%22). Mỗi issue ghi rõ cần tìm điều luật nào. Bạn chỉ cần comment kèm link văn bản gốc và trích đúng điều, khoản.
- **Thấy chỗ sai:** [mở issue](https://github.com/mhfed/vn-law-check/issues/new/choose) theo mẫu "Báo sai". Ví dụ sai số điều, văn bản đã hết hiệu lực, mức phạt chưa đúng, cách hiểu chưa chuẩn.
- **Thấy chỗ thiếu:** mẫu "Đề xuất bổ sung". Ví dụ luật mới, lỗi hay gặp mà checklist chưa có.
- **Tool xếp nhầm site của bạn:** mẫu "Phân loại sai".

Nguồn nên dùng: [vbpl.vn](https://vbpl.vn), [thuvienphapluat.vn](https://thuvienphapluat.vn), Công báo ([congbao.chinhphu.vn](https://congbao.chinhphu.vn)). Bài của công ty luật, báo chí cũng được, nhưng ghi rõ là nguồn thứ cấp.

Góp ý được nhận sẽ ghi tên bạn trong bản cập nhật và trong [lịch sử đính chính](sources/legal-references.md#lịch-sử-đính-chính-nội-dung-luật).

## Gửi PR

1. Chỉ sửa **file nguồn gốc**: `AGENTS.md`, `SKILL.md`, `references/`, `sources/`, `examples/`, `scripts/`, `DISCLAIMER.md`.
2. Chạy `bash tools/sync.sh` để sinh lại các bản copy (`CLAUDE.md`, rules cho Cursor, Windsurf, Copilot, Cline, bản trong `plugins/`). Không sửa tay các bản copy.
3. Sửa `scripts/scan.sh` thì chạy `bash tests/run.sh`. Thêm tín hiệu mới thì thêm một site mẫu vào `tests/fixtures/`, kèm file `EXPECTED`.
4. CI kiểm tra đồng bộ, test và định dạng file. CI xanh là sẵn sàng review.

## Quy ước nội dung

- Mỗi mục checklist dẫn số hiệu văn bản, điều, khoản, kèm link nếu có.
- Chưa đối chiếu được với toàn văn thì ghi `CHƯA XÁC MINH`, không đoán số điều.
- Không tự điền mức phạt. Mức phạt chỉ ghi trong `references/08-penalties-reference.md`, có nguồn.
- Văn bản cũ bị thay thì ghi lại lịch sử (cũ → mới) ở `sources/legal-references.md`.
- Câu ngắn, dễ hiểu. Không dùng dấu gạch ngang dài.

## Hỏi đáp

Câu hỏi chung, ý tưởng chưa rõ ràng: cứ mở issue, gắn nhãn `question`.
