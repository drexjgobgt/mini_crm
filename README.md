# 📊 Mini CRM UMKM

Sistem Customer Relationship Management (CRM) sederhana yang dirancang khusus untuk Usaha Mikro, Kecil, dan Menengah (UMKM). Aplikasi ini membantu UMKM mengelola data pelanggan, pesanan, dan jadwal follow-up dengan antarmuka yang mudah digunakan.

## ✨ Fitur

- **📋 Manajemen Pelanggan**: Tambah, edit, hapus, dan lihat detail pelanggan
- **🛒 Manajemen Pesanan**: Catat dan kelola pesanan pelanggan
- **⏰ Follow-up Reminder**: Kelola jadwal follow-up dengan pelanggan
- **📊 Dashboard**: Lihat statistik ringkas (total pelanggan, pesanan, follow-up pending)
- **📥 Export Excel**: Export data follow-up ke format Excel
- **🎨 UI Modern**: Antarmuka yang responsif dan modern menggunakan Tailwind CSS

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** dengan **Express.js**
- **PostgreSQL** sebagai database
- **dotenv** untuk manajemen environment variables
- **ExcelJS** untuk export ke Excel

### Frontend
- **React** dengan **Vite**
- **React Router** untuk routing
- **Axios** untuk HTTP requests
- **Tailwind CSS** untuk styling

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (v16 atau lebih baru)
- **PostgreSQL** (v12 atau lebih baru)
- **npm** atau **yarn**

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/drexjgobgt/mini_crm
cd "mini CRM UMKM"
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend` dengan konfigurasi berikut (atau copy dari `.env.example`):

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nama_database_anda
DB_USER=postgres
DB_PASSWORD=password_database_anda
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Penting**: File `.env` tidak akan ter-commit ke Git karena sudah di-ignore. Pastikan untuk membuat file ini secara manual.

### Setup Frontend Environment

Buat file `.env` di folder `frontend` (atau copy dari `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Setup Database

Buat database PostgreSQL dan jalankan query berikut untuk membuat tabel:

```sql
-- Tabel Customers
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Followups
CREATE TABLE followups (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    followup_date DATE NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_followups_customer_id ON followups(customer_id);
CREATE INDEX idx_followups_status ON followups(status);
CREATE INDEX idx_followups_followup_date ON followups(followup_date);
```

### 4. Install Dependencies Backend

```bash
cd backend
npm install
```

**Catatan**: Dependencies baru yang ditambahkan untuk security:
- `express-rate-limit`: Rate limiting
- `express-validator`: Input validation
- `helmet`: Security headers
- `xss`: XSS protection

### 5. Setup Frontend

```bash
cd ../frontend
npm install
```

## 🏃 Menjalankan Aplikasi

### Menjalankan Backend

```bash
cd backend
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### Menjalankan Frontend

Buka terminal baru:

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (atau port lain yang tersedia)

## 📁 Struktur Project

```
mini CRM UMKM/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # Konfigurasi database
│   │   ├── controllers/
│   │   │   ├── customerController.js
│   │   │   ├── orderController.js
│   │   │   └── followupController.js
│   │   ├── routes/
│   │   │   ├── customers.js
│   │   │   ├── orders.js
│   │   │   └── followups.js
│   │   └── app.js               # Entry point backend
│   ├── .env                     # Environment variables (tidak di-commit)
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerList.jsx
│   │   │   ├── CustomerDetail.jsx
│   │   │   ├── CustomerForm.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FollowupList.jsx
│   │   │   └── OrderHistory.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service
│   │   ├── app.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .gitignore
│   └── package.json
│
├── .gitignore                   # Root gitignore
└── README.md
```

## 🔌 API Endpoints

### Customers
- `GET /api/customers` - Ambil semua pelanggan
- `GET /api/customers/:id` - Ambil detail pelanggan
- `POST /api/customers` - Tambah pelanggan baru
- `PUT /api/customers/:id` - Update pelanggan
- `DELETE /api/customers/:id` - Hapus pelanggan

### Orders
- `GET /api/orders` - Ambil semua pesanan
- `GET /api/orders/customer/:customerId` - Ambil pesanan berdasarkan pelanggan
- `POST /api/orders` - Tambah pesanan baru

### Followups
- `GET /api/followups` - Ambil semua follow-up
- `POST /api/followups` - Tambah follow-up baru
- `PATCH /api/followups/:id/complete` - Tandai follow-up sebagai selesai
- `GET /api/followups/export` - Export follow-up ke Excel

## 🔒 Keamanan

Project ini telah dilengkapi dengan berbagai fitur keamanan:

### Security Features yang Diimplementasikan:

1. **Input Validation & Sanitization**
   - Semua input divalidasi menggunakan `express-validator`
   - XSS protection dengan sanitization
   - Email dan phone number validation
   - SQL injection prevention dengan parameterized queries

2. **Rate Limiting**
   - API rate limiting: 100 requests per 15 menit
   - Strict rate limiting untuk create/update/delete: 20 requests per 15 menit
   - Export rate limiting: 10 requests per jam

3. **CORS Protection**
   - CORS dikonfigurasi untuk hanya mengizinkan origin tertentu
   - Dapat dikonfigurasi melalui environment variable `ALLOWED_ORIGINS`

4. **Security Headers**
   - Menggunakan Helmet.js untuk security headers
   - Content Security Policy (CSP)
   - XSS protection headers

5. **Error Handling**
   - Error messages tidak mengekspos informasi sensitif
   - Database errors tidak langsung ditampilkan ke client
   - Proper error logging untuk debugging

6. **Request Size Limits**
   - Body parser limit: 10MB
   - Mencegah abuse dengan request besar

7. **Database Security**
   - Connection pooling dengan limit
   - Connection timeout handling
   - Environment variable validation

8. **Frontend Security**
   - Input sanitization di client-side
   - ID validation sebelum API calls
   - Proper error handling

### Best Practices:

- File `.env` tidak akan ter-commit ke repository Git
- Pastikan untuk tidak membagikan file `.env` Anda
- Gunakan password yang kuat untuk database PostgreSQL
- Untuk production, pertimbangkan untuk menggunakan HTTPS
- Update dependencies secara berkala
- Gunakan environment variables untuk semua konfigurasi sensitif

## 📝 Catatan Penting

1. **Environment Variables**: File `.env` harus dibuat manual di folder `backend`. File ini berisi informasi sensitif dan tidak akan ter-commit ke Git.

2. **Database**: Pastikan PostgreSQL sudah berjalan sebelum menjalankan backend.

3. **Port**: Default port backend adalah 5000 dan frontend adalah 5173. Jika port tersebut sudah digunakan, Vite akan otomatis menggunakan port lain.

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch untuk fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 Lisensi

Project ini menggunakan lisensi MIT.

## 👤 Author

Dibuat dengan ❤️ untuk membantu UMKM mengelola bisnis mereka dengan lebih baik.

---

**Catatan**: Pastikan untuk membuat file `.env` di folder `backend` sebelum menjalankan aplikasi. File ini berisi konfigurasi database dan tidak akan ter-commit ke Git untuk keamanan.

