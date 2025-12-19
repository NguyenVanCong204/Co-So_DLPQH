# Thiên Đường Gia Dụng - Fullstack E-Commerce Platform

Dự án Thương mại điện tử (E-Commerce) hoàn chỉnh được phát triển bởi nhóm sinh viên thực tập tại **SafeHorizons Software**. Hệ thống bao gồm cả giải pháp Frontend và Backend chuyên nghiệp.

## 👥 Sinh viên thực hiện

-   **Nguyễn Đăng Chiến**
-   **Nguyễn Văn Công**
-   **Ngô Văn Dương**

---

## � Video Demo

[![Xem Video Demo](https://img.youtube.com/vi/CgLrueBmr_4/0.jpg)](https://www.youtube.com/watch?v=CgLrueBmr_4)
_Nhấn vào ảnh để xem video demo thực hành các tính năng của dự án._

---

## �🚀 Tính năng hệ thống

### 🛠 Backend (Node.js & MongoDB)

-   **Kiến trúc**: Xây dựng theo mô hình MVC (Model-View-Controller) giúp dễ dàng quản lý và mở rộng.
-   **Authentication**: Xác thực người dùng bằng JWT (JSON Web Token), hỗ trợ cơ chế Refresh Token để bảo mật cao hơn.
-   **Quản lý dữ liệu**: Sử dụng Mongoose để giao tiếp với MongoDB, lưu trữ thông tin sản phẩm, đơn hàng, khách hàng và danh mục.
-   **Xử lý tệp tin**: Tích hợp Multer để quản lý upload hình ảnh sản phẩm và avatar người dùng.
-   **Email Service**: Sử dụng Nodemailer kết hợp Mailtrap/Gmail để gửi mã xác thực OTP 6 số khi đăng ký.
-   **Database**: Sử dụng MongoDB với Mongoose (có tích hợp xóa mềm - Soft Delete).

### 🎨 Frontend (ReactJS)

-   **Giao diện**: Responsive trên Desktop, Tablet và Mobile bằng Bootstrap 5 và Sass.
-   **Quản lý State**: Sử dụng Redux Toolkit cho giỏ hàng, tìm kiếm và Context API cho thông tin người dùng.
-   **Trải nghiệm người dùng**:
    -   Tìm kiếm và lọc sản phẩm (Category, Brand, Price) thông minh.
    -   Hệ thống bình luận, đánh giá (Rating & Reviews) 5 sao.
    -   Phân trang dạng "Load More" tối ưu hiệu năng.
-   **Thanh toán**: Tích hợp thanh toán quốc tế PayPal và hệ thống Voucher cho người dùng mới.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

| Thành phần   | Công nghệ                                                            |
| :----------- | :------------------------------------------------------------------- |
| **Frontend** | React 19, Redux Toolkit, React Router DOM, Axios, Sass, Bootstrap 5. |
| **Backend**  | Node.js, Express.js, JWT, Nodemailer.                                |
| **Database** | MongoDB (Mongoose), Prisma (Optional).                               |
| **Tools**    | Formik, Yup, SweetAlert2, React-Toastify.                            |

---

## 📦 Cài đặt dự án

### 1. Yêu cầu hệ thống

-   Đã cài đặt Node.js (phiên bản 18+).
-   Đã cài đặt và đang chạy MongoDB (Local hoặc MongoDB Atlas).

### 2. Khởi chạy Backend

1. Truy cập vào thư mục `backend`.
2. Chạy lệnh: `npm install`
3. Tạo file `.env` và cấu hình các biến: `PORT`, `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`.
4. Chạy lệnh: `npm start` (Sử dụng nodemon).

### 3. Khởi chạy Frontend

1. Truy cập vào thư mục `frontend`.
2. Chạy lệnh: `npm install`
3. Chạy lệnh: `npm start`
4. Truy cập: `http://localhost:3000`

---

**SafeHorizons Software - Internship Project 2025**
