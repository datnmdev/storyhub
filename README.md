# 📖 StoryHub
Một website đọc truyện tranh trực tuyến với giao diện mượt mà và trải nghiệm người dùng tuyệt vời.
## 🏁 Giới Thiệu
Đây là nền tảng đọc truyện trực tuyến cho phép người dùng dễ dàng truy cập, đọc và quản lý các câu chuyện, truyện tranh, tiểu thuyết. Hệ thống hỗ trợ tác giả chia sẻ tác phẩm, giúp độc giả tiếp cận nội dung phong phú, đồng thời cung cấp công cụ quản lý cho kiểm duyệt viên và quản trị viên.
## 🚀 Tính Năng
- Đọc truyện: Đọc truyện online, quản lý lịch sử, theo dõi truyện.
- Đánh giá và bình luận: Chấm điểm, bình luận, tương tác với cộng đồng.
- Tìm kiếm và xếp hạng: Tìm kiếm theo từ khóa, thể loại, hiển thị bảng xếp hạng.
- Thanh toán và giao dịch: Nạp tiền, thanh toán để mở khóa nội dung.
- Quản lý tác phẩm: Tác giả đăng tải, chỉnh sửa, quản lý chương truyện.
- Kiểm duyệt và dịch thuật: Kiểm duyệt và quản lý bản dịch.
- Quản lý nhân viên: Phân quyền và theo dõi hoạt động nhân viên.
- Thống kê: Báo cáo doanh thu, lượt đọc, lượt tương tác.
## 🛠️ Công Nghệ Sử Dụng
- Frontend: ReactJS, TypeScript, Tailwind CSS
- Backend: NestJS, Websocket
- Database: MySQL, Redis
- Authentication: JWT, OAuth2
- Message queue: BullMQ
- Infrastructure: Google Cloud, Docker
## 📥 Cài đặt và chạy dự án (chạy trong môi trường phát triển)
- Clone mã nguồn về local
  ```bash
  git clone https://github.com/datnmdev/storyhub.git
  ```
- Chạy backend
  ```bash
  cd ./backend
  ```
  ```bash
  yarn install
  ```
  ```bash
  yarn start:dev
  ```
- Chạy frontend
  ```bash
  cd ../frontend
  ```
  ```bash
  yarn install
  ```
  ```bash
  yarn dev
  ```
## 📚 Các Tài Liệu Có Liên Quan
- Các bản thiết kế giao diện: [Nhấn vào đây để mở](https://www.figma.com/design/UFqnNKeuVgebbuyVTUt0dj/Website?node-id=0-1&t=D4AzFqVTrbI9Iueq-1)
- Các bản thiết kế UML: [Nhấn vào đây để mở](https://drive.google.com/file/d/1LV1bGV4E6ogvMclcCF_XEVC7NgvBtvNG/view?usp=sharing)
- Tài liệu báo cáo: [Nhấn vào đây để mở](https://docs.google.com/document/d/1ntPBYvCi-kAZL86T5kwXPHmJhq7hicAd/edit?usp=sharing&ouid=103410879762918091663&rtpof=true&sd=true)
- Tài liệu hướng dẫn phát triển: [Nhấn vào đây để mở](./DEVELOPMENT_GUIDE.md)