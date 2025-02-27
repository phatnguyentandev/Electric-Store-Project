  # Electronic Store Management System
  
  ## Giới thiệu
  
    Electronic Store Management System là hệ thống quản lý cửa hàng bán đồ điện - điện tử, hỗ trợ quản lý sản phẩm, giám sát tồn kho, xử lý đơn hàng và theo dõi doanh thu. Hệ thống gồm ba phân quyền chính: **Admin**, **User**, **Staff**.
  
  ## Cấu trúc thư mục
    ```
    project-root/
    │-- client/  # Giao diện người dùng (ReactJS)
    │-- server/  # Backend API (Node.js, ExpressJS, MongoDB)
    │-- backup-database-mongodb.json  # Dữ liệu sao lưu MongoDB
    │-- README.md  # Hướng dẫn sử dụng
    ```
  
  ## Chức năng chính
  ### 1. Admin
    - Quản lý sản phẩm, kho, nhập hàng, nhà cung cấp
    - Quản lý hóa đơn, thông tin người dùng, tài khoản, công ty giao hàng
    - Thống kê doanh thu, sản phẩm bán chạy
  
  ### 2. User
    - Đăng ký, đăng nhập, cập nhật thông tin cá nhân
    - Tìm kiếm, xem chi tiết sản phẩm, quản lý giỏ hàng
    - Đặt hàng, theo dõi trạng thái đơn hàng
  
  ### 3. Staff
    - Nhận và xác nhận đơn hàng giao thành công
  
  ## Cài đặt và chạy project
  ### 1. Cài đặt server
    ```bash
    cd server
    npm install
    npm run dev
    ```
  ### 2. Cài đặt client
    ```bash
    cd client
    npm install
    npm start
    ```
  
  ## Cấu hình MongoDB (Replica Set)
  1. Mở file cấu hình MongoDB (`/etc/mongod.conf` hoặc `mongod.cfg`).
  2. Thêm dòng sau:
    ```yaml
    replication:
      replSetName: "rs0"
    ```
  3. Khởi động lại MongoDB:
    ```bash
    sudo systemctl restart mongod  # Linux
    ```
  4. Khởi tạo replica set:
    ```bash
    mongo --eval "rs.initiate()"
    ```
  5. Kiểm tra trạng thái:
    ```bash
    mongo --eval "rs.status()"
    ```
  
  ## Nhập dữ liệu từ file backup
  1. Mở **Mongo Compass**.
  2. Import file `backup-database-mongodb.json` vào MongoDB.
  
  ## Tài khoản mẫu
    - **Admin**: `nhanhuynhly244@gmail.com` / `12345`
    - **Nhân viên**: `nextgofori@gmail.com` / `12345`
    - **User**: `21110566@student.hcmute.edu.vn` / `12345`
  
  ## Liên hệ
  Nếu có bất kỳ vấn đề gì, vui lòng liên hệ nhóm phát triển để được hỗ trợ.

