# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN PRICEHUNT (Flask + MySQL)

> **Tài liệu này hướng dẫn bạn chạy dự án từ A-Z trên Windows, KHÔNG cần môi trường ảo (venv).**

---

## 📋 Yêu Cầu Hệ Thống

| Phần mềm       | Phiên bản tối thiểu | Tải về                                                    |
|-----------------|---------------------|-----------------------------------------------------------|
| Python          | 3.10+               | [python.org](https://www.python.org/downloads/)            |
| XAMPP (MySQL)   | 8.0+                | [apachefriends.org](https://www.apachefriends.org/)        |
| Git (tùy chọn)  | 2.x                 | [git-scm.com](https://git-scm.com/)                       |

---

## Bước 1️⃣ — Khởi Động MySQL (XAMPP)

1. Mở **XAMPP Control Panel** (tìm kiếm "XAMPP" trong Start Menu).
2. Nhấn nút **Start** bên cạnh module **MySQL**.
3. Đợi cho đến khi cột **PID(s)** và **Port(s)** hiện số (thường là port `3306`).
4. ✅ MySQL đã sẵn sàng khi dòng MySQL chuyển sang **màu xanh lá**.

### ⚠️ Kiểm tra mật khẩu MySQL

Dự án sử dụng thông tin kết nối sau (trong file `CDIO/config/config.py`):

```python
DB_CONFIG = {
    "host":     "localhost",
    "user":     "root",
    "password": "123456789",   # ← Đổi cho khớp mật khẩu MySQL của bạn
    "database": "cdio",
    "charset":  "utf8mb4"
}
```

**Nếu MySQL của bạn KHÔNG có mật khẩu** (mặc định XAMPP), hãy sửa `"password"` thành `""`.

### Tạo Database `cdio`

Nếu chưa có database `cdio`, mở trình duyệt vào **phpMyAdmin** (`http://localhost/phpmyadmin`):

1. Click **"New"** (hoặc "Cơ sở dữ liệu mới") ở sidebar bên trái.
2. Nhập tên: `cdio`
3. Chọn Collation: `utf8mb4_general_ci`
4. Click **"Create"**

> 💡 Các bảng (`users`, `search_history`, `cart`, `orders`...) sẽ được **tự động tạo** khi app chạy lần đầu.

---

## Bước 2️⃣ — Cài Đặt Thư Viện Python

Mở **Terminal** (PowerShell hoặc CMD) và chạy lệnh sau:

```powershell
# Di chuyển đến thư mục dự án
cd F:\Project-CDIO\CDIO

# Cài đặt tất cả thư viện cần thiết
py -m pip install -r requirements.txt python-dotenv flask-apscheduler
```

> 💡 Chỉ cần chạy lệnh này **một lần** (hoặc khi có cập nhật thư viện mới).

---

## Bước 3️⃣ — Cấu Hình File `.env`

Kiểm tra file `CDIO/.env` đã có đủ các key sau chưa:

```env
SECRET_KEY=
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

- **SECRET_KEY**: Để trống hoặc đặt một chuỗi bất kỳ. Nếu trống, app sẽ dùng giá trị mặc định.
- **GROQ_API_KEY**: Lấy từ [console.groq.com](https://console.groq.com/) (cần cho tính năng AI chat).
- **GEMINI_API_KEY**: Lấy từ [aistudio.google.com](https://aistudio.google.com/apikey) (cần cho tính năng tìm kiếm bằng ảnh).

---

## Bước 4️⃣ — Chạy Ứng Dụng 🔥

```powershell
# Đảm bảo đang ở thư mục CDIO
cd F:\Project-CDIO\CDIO

# Set encoding UTF-8 (tránh lỗi emoji trên Windows)
$env:PYTHONIOENCODING='utf-8'

# Chạy app
py app.py
```

Nếu mọi thứ OK, bạn sẽ thấy output tương tự:

```
⏰ Background Scheduler đã được kích hoạt!
✅ Database đã được khởi tạo và nâng cấp thành công!
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

🌐 **Mở trình duyệt và truy cập**: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 🛑 Dừng Ứng Dụng

Nhấn tổ hợp `Ctrl + C` trong Terminal để dừng server Flask.

---

## 🔧 Xử Lý Lỗi Thường Gặp

### Lỗi 1: `Access denied for user 'root'@'localhost'`
**Nguyên nhân**: Mật khẩu MySQL không khớp.  
**Cách sửa**: Mở `CDIO/config/config.py` → sửa `"password"` cho đúng với mật khẩu MySQL của bạn.

### Lỗi 2: `UnicodeEncodeError: 'charmap' codec...`
**Nguyên nhân**: Terminal Windows không hỗ trợ emoji.  
**Cách sửa**: Thêm dòng `$env:PYTHONIOENCODING='utf-8'` trước khi chạy `py app.py` (như Bước 4).

### Lỗi 3: `ModuleNotFoundError: No module named 'xxx'`
**Nguyên nhân**: Thiếu thư viện.  
**Cách sửa**: Chạy lại `py -m pip install -r requirements.txt python-dotenv flask-apscheduler`

### Lỗi 4: `Can't connect to MySQL server`
**Nguyên nhân**: MySQL chưa được khởi động.  
**Cách sửa**: Quay lại **Bước 1** — mở XAMPP và Start MySQL.

### Lỗi 5: `Unknown database 'cdio'`
**Nguyên nhân**: Database chưa được tạo.  
**Cách sửa**: Vào phpMyAdmin (`http://localhost/phpmyadmin`) và tạo database tên `cdio`.

---

## ⚡ Lệnh Nhanh (Copy & Paste)

Sau khi đã cài đặt xong tất cả, mỗi lần muốn chạy app chỉ cần 3 dòng:

```powershell
cd F:\Project-CDIO\CDIO
$env:PYTHONIOENCODING='utf-8'
py app.py
```

---

## 📁 Cấu Trúc Dự Án

```
Project-CDIO/
├── CDIO/
│   ├── app.py              ← 🔑 File chạy chính
│   ├── .env                ← 🔐 Biến môi trường (API keys)
│   ├── requirements.txt    ← 📦 Danh sách thư viện
│   ├── config/
│   │   └── config.py       ← ⚙️ Cấu hình DB, stores, keys
│   ├── database/
│   │   └── db.py           ← 🗄️ Kết nối & thao tác MySQL
│   ├── routes/             ← 🛣️ Các route (search, auth, cart...)
│   ├── scrapers/           ← 🕷️ Bộ cào dữ liệu các cửa hàng
│   ├── services/           ← 🧠 Logic nghiệp vụ
│   ├── templates/          ← 🎨 Giao diện HTML (Jinja2)
│   ├── static/             ← 📂 CSS, JS, Images
│   └── utils/              ← 🔧 Hàm tiện ích
├── RUN_GUIDE.md            ← 📖 File hướng dẫn này
└── README.md
```

---

> 📝 **Ghi chú**: Dự án này chạy ở chế độ `debug=True` nên mỗi khi bạn sửa code, server sẽ **không tự động restart** (vì `use_reloader=False`). Bạn cần tắt (`Ctrl+C`) rồi chạy lại `py app.py`.
