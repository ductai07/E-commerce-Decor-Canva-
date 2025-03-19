# Hướng dẫn chạy DucTai-Decor Web Application

## Cách 1: Chạy đồng thời cả Frontend và Backend (Đề xuất)

1. Mở terminal (Command Prompt hoặc PowerShell) trong thư mục gốc của dự án:
   ```
   c:/Users/ASUS/Desktop/PROJECT WEB
   ```

2. Cài đặt các gói cần thiết cho cả dự án:
   ```
   npm install
   ```

3. Cài đặt gói concurrently để chạy cả frontend và backend cùng lúc:
   ```
   npm install concurrently --save
   ```

4. Cài đặt tất cả các dependencies cho cả frontend và backend:
   ```
   npm run install-all
   ```
   (Lệnh này sẽ cài đặt dependencies cho cả dự án chính, frontend và backend)

5. Chạy cả frontend và backend:
   ```
   npm run dev
   ```

   Frontend sẽ khởi chạy tại: http://localhost:5173/
   Backend sẽ khởi chạy tại: http://localhost:5000/

## Cách 2: Chạy Frontend và Backend riêng biệt

### Khởi động Backend

1. Mở terminal và di chuyển đến thư mục server:
   ```
   cd "c:/Users/ASUS/Desktop/PROJECT WEB/server"
   ```

2. Cài đặt các dependencies:
   ```
   npm install
   ```

3. Khởi động server:
   ```
   npm start
   ```
   hoặc để tự động khởi động lại khi có thay đổi:
   ```
   npm run dev
   ```

   Backend sẽ chạy tại: http://localhost:5000/

### Khởi động Frontend

1. Mở terminal mới và di chuyển đến thư mục client:
   ```
   cd "c:/Users/ASUS/Desktop/PROJECT WEB/client"
   ```

2. Cài đặt các dependencies:
   ```
   npm install
   ```

3. Khởi động ứng dụng React:
   ```
   npm run dev
   ```

   Frontend sẽ chạy tại: http://localhost:5173/

## Xử lý lỗi thường gặp

### Lỗi "Port already in use"

Nếu bạn nhận được thông báo lỗi cổng đã được sử dụng:

1. Kiểm tra xem có tiến trình nào đang chạy trên cổng 5000 hoặc 5173:
   ```
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   ```

2. Kết thúc tiến trình bằng ID (PID) được hiển thị:
   ```
   taskkill /F /PID <PID>
   ```

### Lỗi kết nối MongoDB

Nếu bạn gặp lỗi kết nối MongoDB:

1. Kiểm tra lại URL kết nối trong file `.env` tại thư mục server
2. Nếu bạn đang sử dụng MongoDB cục bộ, hãy đảm bảo dịch vụ MongoDB đang chạy:
   ```
   net start MongoDB
   ```

### Lỗi CORS

Nếu bạn gặp lỗi CORS khi kết nối frontend với backend:

1. Kiểm tra cài đặt CORS trong file `server.js`
2. Đảm bảo rằng origin được cấu hình đúng với URL frontend của bạn

## Thông tin đăng nhập mẫu

Bạn có thể sử dụng tài khoản mẫu sau để đăng nhập và kiểm tra chức năng:

- Email: admin@example.com
- Mật khẩu: 123456 