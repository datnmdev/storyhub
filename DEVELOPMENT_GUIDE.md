## Quy tắc lập trình
- Đặt tên biến, hàm và class chuẩn:
  - Dùng camelCase cho tên biến và hàm
  - Dùng PascalCase cho tên class và component
  - Đặt tên rõ nghĩa, tránh viết tắt nếu không cần thiết
- Giới hạn độ dài hàm và class
  - Hàm không quá 30 dòng
  - Class không quá 300 dòng
  - Chia nhỏ nếu vượt quá giới hạn
- Viết comment đúng cách
  - Giải thích TẠI SAO làm vậy thay vì LÀM GÌ
  - Không viết comment dư thừa
  - Dùng comment khi logic phức tạp hoặc có thuật toán đặc biệt
- Kiểm tra đầu vào và xử lý lỗi
  - Luôn kiểm tra đầu vào trước khi xử lý
  - Sử dụng try-catch để xử lý lỗi
  - Trả về lỗi rõ ràng để dễ debug
- Sử dụng const và let thay vì var
  - Dùng const cho giá trị không thay đổi
  - Dùng let cho giá trị có thể thay đổi
  - Tránh dùng var vì dễ gây lỗi khi hoisting
- Sử dụng async/await thay vì Promise
  - Dùng async/await cho code đơn giản và dễ đọc hơn
  - Xử lý lỗi bằng try-catch
- Không dùng any trong TypeScript
  - Dùng kiểu dữ liệu rõ ràng
  - Nếu không chắc kiểu dữ liệu, dùng unknown thay vì any
- Giữ đúng định dạng code bằng Prettier hoặc ESLint
- Giới hạn độ dài dòng code
  - Code không dài quá 100 ký tự một dòng
  - Dùng dấu \ hoặc xuống dòng để chia nhỏ khi cần
- Quy ước viết Import/Export
  - Import thứ tự theo: thư viện > module nội bộ > file cục bộ
  - Dùng export default cho component, export const cho utils hoặc constants
- Tránh hard code: Đưa hằng số vào file config hoặc biến môi trường .env.**
- Không dùng console.log trên Production: Tắt console.log trong môi trường production

# Một số điều cần nắm rõ khi làm việc với git
- Nhánh main (nhánh chính): Nhánh ổn định chứa code đã được kiểm tra và sẵn sàng để phát hành hoặc triển khai. Code trên main phải sạch, không có lỗi và chỉ được merge vào từ dev qua Pull Request. Tuyệt đối không commit hoặc push trực tiếp vào main. Mỗi lần merge vào main cần tạo tag hoặc release rõ ràng để theo dõi phiên bản
- Nhánh dev (nhánh chính): nhánh để phát triển, nơi các thành viên merge code từ các nhánh feature/*, fix/*, hotfix/*. Code trên dev phải được kiểm tra kỹ trước khi merge vào main. Không được commit hoặc push trực tiếp vào dev, chỉ được merge qua Pull Request. Trước khi merge, cần thực hiện rebase từ dev để tránh xung đột
- Các nhánh khác (nhánh phụ trợ):
  - feature/* - Dùng để phát triển tính năng mới, tạo từ dev và merge vào dev khi hoàn thành
  - fix/* – Dùng để sửa lỗi trong quá trình phát triển, tạo từ dev và merge vào dev sau khi fix xong
  - hotfix/* – Dùng để sửa lỗi khẩn cấp trên production, tạo từ main và merge thẳng vào main sau khi fix xong, sau đó backport vào dev

# Quy trình làm việc với Git (Git Workflow)
- Trưởng nhóm giao việc cho các thành viên bằng cách tạo các công việc trong phần "Issues" trên Github, bao gồm:
  - Title: Ngắn gọn nhưng ý nghĩa
  - Description: Ghi rõ chi tiết các yêu cầu mà trưởng nhóm mong muốn người được giao hoàn thành nó
  - Assignees: Chỉ định những người sẽ đảm nhận công việc này.
  - Labels: Mô tả công việc này thuộc chủ đề nào, giúp lập trình viên nhận dạng nhanh chóng về công việc của mình.
- Các thành viên trong nhóm nhận công việc đã giao, đọc kĩ các yêu cầu trong phần mô tả và hoàn thành nó, nếu có điều gì chưa rõ thì có thể liên hệ với trưởng nhóm thông qua chức năng comment ở phía dưới phần mô tả. Khi làm việc, các thành viên cần lưu ý:
  - Trước khi thực hiện một công việc gì thì đều phải thực hiện pull nhánh dev để lấy dữ liệu mới nhất từ kho lưu trữ
  - Sau đó, tạo nhánh làm việc từ nhánh dev (quy tắc về việc tạo nhánh được đề cập ở mục quy tắc ở phía dưới) và các thay đổi code được commit trên nhánh vừa tạo
  - Sau khi công việc đã xong, phải thực hiện rebase lại nhánh làm việc từ nhánh dev. Nếu trong quá trình rebase có xảy ra xung đột (conflict) thì hãy cẩn thận xử lý nó để không làm ảnh hưởng đến các tính năng hoặc hoạt động khác của hệ thống
- Để thông báo cho trưởng nhóm công việc đã hoàn thành, người thực hiện công việc phải thực hiện các yêu cầu sau:
  - Đẩy nhánh đã code lên kho lưu trữ
  - Tạo một Pull Request yêu cầu trưởng nhóm xem xét code và tiến hành merge code vào nhánh dev. Khi tạo bắt buộc phải thực hiện các hành động sau:
    - Chỉ định nhánh base: Chọn nhánh mà code sẽ được merge vào đó, cụ thể ở đây là nhánh dev
    - Chỉ dịnh nhánh compare: Chọn nhánh chứa code liên quan đến công việc này, cụ thể ở đây là nhánh code vừa đẩy lên
    - Chỉ định reviewers: Chọn người sẽ tiến hành xem xét code và merge code vào nhánh dev, cụ thể ở đây là trưởng nhóm
    - Chỉ định assignees: Chọn người đã đảm nhận công việc này, cụ thể ở đây chính là bản thân người tạo Pull Request
    - Trong phần description (mô tả) hãy viết vào đó dòng thông điệp có định dạng "Closes #id-issue", với id-issue là một con số định danh của issue (có thể nhìn thấy nó sau tiêu đề của issue)
- Tiếp theo, phải theo dõi sát sao Pull Request, nếu trưởng nhóm có để lại vấn đề gì cần giải quyết trong mục comment trong Pull Request thì người thực hiện công việc này phải giải quyết triệt để và sau đó gửi lại yêu cầu để trưởng nhóm review lại code.

# Một số quy tắc cần lưu ý khi làm việc với git
## Quy tắc đặt tiêu đề issue
📌 Cấu trúc tổng quát
```plaintext
[Type] Short description of the issue
```
| Thành phần         | Ý nghĩa                                              | Ví dụ                  |
|--------------------|-----------------------------------------------------|------------------------|
| `[Type]`           | Loại công việc (feature, bug, fix, refactor, hotfix, chore, ...) | `[Feature]`, `[Bug]`   |
| `Short description`| Mô tả ngắn gọn nội dung của issue                   | `Implement login API`  |

## Quy tắc đặt tên nhánh
📌 Cấu trúc tổng quát
```plaintext
[type]/[issue-number]-[short-description]
```
| Thành phần         | Ý nghĩa                                                                          | Ví dụ                  |
|--------------------|---------------------------------------------------------------------------------|------------------------|
| `type`             | Loại công việc (feature, bugfix, hotfix, chore, refactor, docs, test)           | `feature`, `bugfix`, `hotfix` |
| `issue-number`     | Số issue tương ứng                                                     | `#23`                  |
| `short-description`| Mô tả ngắn gọn, viết bằng kebab-case (chữ thường, cách nhau bằng `-`)           | `add-login-api`        |

🚀 Các loại type cho nhánh
| Type      | Ý nghĩa                                              | Ví dụ                               |
|-----------|------------------------------------------------------|-------------------------------------|
| `feature`  | Phát triển tính năng mới                              | `feature/23-add-login-api`          |
| `bugfix`   | Sửa lỗi                                               | `bugfix/45-fix-header-layout`       |
| `hotfix`   | Sửa lỗi khẩn cấp trên production                      | `hotfix/78-fix-payment-crash`       |
| `refactor` | Tái cấu trúc code mà không thay đổi logic              | `refactor/56-optimize-redux-store`  |
| `chore`    | Công việc bảo trì, không liên quan đến logic            | `chore/34-update-dependencies`      |
| `docs`     | Cập nhật tài liệu                                      | `docs/12-update-readme`             |
| `test`     | Thêm hoặc sửa test case                                 | `test/67-add-unit-test-login`        |

## Quy tắc đặt commit
📌 Cấu trúc tổng quát
```plaintext
[type]: [description] (#issue-number)
```
| Thành phần    | Ý nghĩa                                                                 | Ví dụ                |
|-------------------|------------------------------------------------------------------------------|--------------------------|
| **type**          | Loại công việc (*feat*, *fix*, *hotfix*, *refactor*, *chore*, *docs*, *test*) | feat, fix, hotfix        |
| **description**   | Mô tả ngắn gọn về nội dung commit, viết ở dạng thì hiện tại                  | add login API            |
| **#issue-number** | Số issue tương ứng                                                   | (#23)                    |


🚀 Các loại type cho commit
| Loại commit | Ý nghĩa                                          | Ví dụ                                      |
|-------------|--------------------------------------------------|--------------------------------------------|
| `feat`       | Thêm tính năng mới                                | `feat: add login API (#23)`               |
| `fix`        | Sửa lỗi                                           | `fix: fix missing token in header (#45)`  |
| `hotfix`     | Sửa lỗi khẩn cấp                                   | `hotfix: fix crash on checkout (#78)`     |
| `refactor`   | Cải tiến code mà không thay đổi logic              | `refactor: remove unused Redux action (#56)` |
| `chore`      | Công việc bảo trì, không thay đổi logic            | `chore: update npm dependencies (#34)`     |
| `docs`       | Cập nhật tài liệu                                  | `docs: update API documentation (#12)`     |
| `test`       | Thêm hoặc sửa test case                             | `test: add unit test for login API (#67)`  |

# Một số lệnh cần biết với git
## 🏁 Nhóm lệnh khởi tạo và cấu hình
Sao chép kho Git từ remote
```bash
git clone <url>
```
Thiết lập tên người dùng toàn cục
```bash
git config --global user.name "<Tên của bạn>"
```
Thiết lập email người dùng toàn cục
```bash
git config --global user.email "<Email của bạn>"
```
## 📂 Nhóm lệnh trạng thái và kiểm tra
Kiểm tra trạng thái của các tệp
```bash
git status
```
Xem lịch sử commit dưới dạng rút gọn
```bash
git log --oneline <tên-nhánh>
```
Xem lịch sử commit dưới dạng rút gọn một cách trực quan
```bash
git log --oneline --graph <tên-nhánh>
```
Hiển thị chi tiết của một commit cụ thể
```bash
git show <commit-id>
```
## ➕ Nhóm lệnh thêm và xác nhận thay đổi
Thêm tệp vào vùng chờ để commit
```bash
git add <file>
```
Thêm tất cả các tệp vào vùng chờ
```bash
git add .
```
Commit các thay đổi đã thêm vào vùng chờ
```bash
git commit -s
```
Sửa đổi commit cuối cùng
```bash
git commit --amend
```
## 🌲 Nhóm lệnh quản lý nhánh
Liệt kê các nhánh hiện có
```bash
git branch
```
Tạo nhánh mới
```bash
git branch <tên-nhánh>
```
Chuyển sang nhánh khác
```bash
git checkout <tên-nhánh>
```
Tạo và chuyển sang nhánh mới
```bash
git checkout -b <tên-nhánh>
```
Xóa nhánh (đã merge)
```bash
git branch -d <tên-nhánh>
```
Xóa nhánh (chưa merge)
```bash
git branch -D <tên-nhánh>
```
Chuyển nhanh sang nhánh khác
```bash
git switch <tên-nhánh>
```
## 🔄 Nhóm lệnh gộp và Rebase
Gộp nhánh vào nhánh hiện tại
```bash
git merge <tên-nhánh>
```
Rebase nhánh hiện tại lên nhánh khác
```bash
git rebase <tên-nhánh>
```
Áp dụng thay đổi của một commit vào nhánh hiện tại
```bash
git cherry-pick <commit-id>
```
## 🚀 Nhóm lệnh push và pull
Đẩy nhánh và các thay đổi của nhánh lên remote
```bash
git push <tên-remote> <tên-nhánh>
```
Kéo các thay đổi của một nhánh nào đó từ remote về
```bash
git pull <tên-nhánh>
```
## 🧹 Nhóm lệnh hoàn tác và reset
Quay lại trạng thái của một commit (giữ thay đổi)
```bash
git reset --soft <commit-id>
```
Quay lại trạng thái của một commit (xóa thay đổi)
```bash
git reset --hard <commit-id>
```
Tạo commit mới để hoàn tác commit trước đó
```bash
git revert <commit-id>
```
## 🌐 Nhóm lệnh remote
Hiển thị các remote hiện tại
```bash
git remote -v
```
Thêm remote mới
```bash
git remote add <tên-remote> <url>
```
Xóa remote
```bash
git remote remove <tên-remote>
```
Đặt lại URL của remote
```bash
git remote set-url <tên-remote> <url>
```
## 🏷️ Nhóm lệnh quản lý tag
Tạo tag mới
```bash
git tag <tên-tag>
```
Tạo tag với thông điệp
```bash
git tag -a <tên-tag> -m "<Thông điệp>"
```
Đẩy tag lên remote
```bash
git push origin <tên-tag>
```
Xóa tag cục bộ
```bash
git tag -d <tên-tag>
```
Xóa tag trên remote
```bash
git push origin --delete <tên-tag>
```