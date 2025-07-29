tính tiền nguyên liệu 
có option danh mục (Bao bì, Nguyên liệu chính, Phát sinh)có thể thêm xóa sửa
 
 trong mỗi option sẽ có 
- STT
- Tên nguyên liệu
- Số lượng
- Thành tiền 
- Tổng tiền
- Ghi chú
( có thể thêm mới, sửa, xóa)

có thêm mục doanh thu có các cột sau 
- STT
- Ngày tháng năm
- Mặt hành đã bán
- Giá
- Tổng tiền bán được
- Chi phí mua nguyên liệu
- Phí phát sinh
- Thành tiền sau khi trừ các chi phí 


sau khi nhập xong các mục thên thì tự động (auto) tính tiền 

có thêm mục tính toán chi phí nằm cạnh button danh mục
- tiền quỹ đầu tư ( thêm , xóa , sửa tại có nhiều người góp quỹ đầu tư)
- thống kê tiền đã chi mua nguyên liệu
- thống kê tiền đã bán 
- thống kê liền lời sau khi trừ chi phí 
- tính lương cho nhân viên ( sau khi trừ các chi phí, nhập số lượng nhân viên và chia auto) 
- 

## Hướng dẫn chạy trang web

1. Mở thư mục dự án này.
2. Nhấn đúp vào file `index.html` hoặc chuột phải chọn "Open with" > trình duyệt bất kỳ (Chrome, Edge, Firefox...).
3. Trang web sẽ hoạt động ngay trên máy, không cần cài đặt thêm.

Nếu muốn dùng server (tùy chọn):
- Mở terminal tại thư mục này và chạy lệnh:
  ```bash
  python -m http.server
  ```
  Sau đó truy cập địa chỉ http://localhost:8000 bằng trình duyệt.
