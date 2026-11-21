# KasirPro — Aplikasi Kasir Digital Store

Aplikasi kasir (Point of Sale / POS) modern untuk digital store. Kelola produk, stok, transaksi, pelanggan, dan laporan penjualan dalam satu aplikasi yang cepat, aman, dan responsif.

> **Catatan teknologi:** Proyek ini dibangun dengan **Next.js 16 (App Router) + TypeScript + Prisma + NextAuth**, sebagai adaptasi modern dari spesifikasi POS. Struktur frontend/backend terpisah rapi (komponen UI, route API, schema database, autentikasi). Database menggunakan SQLite via Prisma (dapat dengan mudah diganti ke MySQL — lihat bagian Konfigurasi Database).

---

## Daftar Isi

1. [Fitur](#fitur)
2. [Teknologi](#teknologi)
3. [Struktur Folder](#struktur-folder)
4. [Panduan Instalasi](#panduan-instalasi)
5. [Konfigurasi Database](#konfigurasi-database)
6. [Menjalankan Website](#menjalankan-website)
7. [Akun Demo](#akun-demo)
8. [Cetak Struk & Printer Bluetooth](#cetak-struk--printer-bluetooth)
9. [Konfigurasi QRIS (Opsional)](#konfigurasi-qris-opsional)
10. [Keamanan](#keamanan)

---

## Fitur

### Admin
- **Login & Logout** dengan autentikasi aman (password di-hash dengan bcrypt).
- **Dashboard statistik**: total pendapatan, total transaksi, jumlah produk, jumlah pelanggan, pendapatan hari ini, dan produk stok menipis.
- **Grafik penjualan** 14 hari (area chart), metode pembayaran (pie chart), transaksi harian (bar chart), dan produk terlaris.
- **Manajemen Produk**: tambah, edit, hapus produk, upload gambar produk (dioptimasi otomatis), SKU unik, harga jual & modal, status aktif/nonaktif.
- **Manajemen Kategori**: tambah, edit, hapus kategori (dengan proteksi jika masih memiliki produk).
- **Manajemen Stok**: pantau stok menipis/habis, tambah/kurangi stok dengan cepat.
- **Manajemen Pelanggan**: CRUD pelanggan dengan riwayat transaksi.
- **Riwayat Transaksi**: pencarian, filter tanggal, pagination, detail transaksi, cetak ulang struk.
- **Laporan Penjualan** harian/mingguan/bulanan + rentang custom, ringkasan, grafik tren, produk terlaris, breakdown metode pembayaran.
- **Cetak Laporan PDF** (jsPDF) dengan tabel rapi dan kop laporan.
- **Pengaturan**: informasi toko, tarif pajak (PPN), pesan struk, konfigurasi QRIS.

### Kasir (POS)
- Tampilan daftar produk berbentuk kartu dengan gambar, harga, dan badge stok.
- **Pencarian produk** (nama/SKU) dan **filter kategori**.
- **Keranjang belanja**: tambah/kurangi jumlah, hapus item, atur quantity manual.
- Perhitungan **subtotal, diskon, pajak (dapat dikonfigurasi), dan total otomatis**.
- **Pembayaran Tunai** dengan input uang diterima, tombol uang cepat, dan **perhitungan kembalian**.
- **Pembayaran Transfer**.
- **Pembayaran QRIS** dengan menampilkan QR code.
- Validasi stok real-time, simpan transaksi (atomic transaction), dan **cetak struk**.

### Cetak Struk (58mm Thermal)
- Format kertas thermal **58mm** (lebar 32 karakter).
- Menampilkan nama toko, alamat, telepon, nomor invoice, tanggal/waktu, item, qty, harga satuan, total, metode pembayaran, uang diterima, kembalian, dan pesan terima kasih.
- **Cetak via browser** (`window.print()` dengan CSS `@page` 58mm).
- **Cetak via Web Bluetooth** untuk printer BLE seperti **RPP02N** (ESC/POS commands), dengan deteksi dukungan browser dan pesan fallback yang jelas.

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Prisma ORM (SQLite; siap MySQL) |
| Autentikasi | NextAuth.js v4 (Credentials, JWT, role-based) |
| State | Zustand (cart), TanStack Query (server state) |
| Charts | Recharts |
| PDF | jsPDF + jspdf-autotable |
| QR Code | qrcode |
| Password Hashing | bcryptjs |
| Ikon | Lucide React |

---

## Struktur Folder

```
kasirpro/
├── prisma/
│   ├── schema.prisma        # Skema database (User, Category, Product, Customer, Transaction, TransactionDetail, Payment, Setting)
│   └── seed.ts              # Data awal: admin, kasir, kategori, produk, pelanggan, transaksi contoh
├── public/
│   └── uploads/             # Gambar produk yang diunggah (di-ignore dari git)
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout + providers
│   │   ├── page.tsx         # Entry point (login / app shell berdasarkan sesi)
│   │   ├── globals.css      # Tema warna (biru tua + putih) & CSS cetak struk 58mm
│   │   └── api/             # Backend API routes
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── products/route.ts + [id]/route.ts
│   │       ├── categories/route.ts + [id]/route.ts
│   │       ├── customers/route.ts + [id]/route.ts
│   │       ├── transactions/route.ts + [id]/route.ts
│   │       ├── dashboard/route.ts
│   │       ├── reports/route.ts
│   │       ├── settings/route.ts
│   │       └── upload/route.ts
│   ├── components/
│   │   ├── auth/login-form.tsx
│   │   ├── layout/app-shell.tsx          # Sidebar + header + footer sticky
│   │   ├── admin/                        # dashboard, products, categories, stock, customers, transactions, reports, settings
│   │   ├── pos/                          # pos-view, payment-dialog, receipt
│   │   ├── providers/providers.tsx       # Session, QueryClient, Theme
│   │   └── ui/                           # shadcn/ui components
│   ├── hooks/                            # use-api, use-toast, use-mobile
│   ├── lib/                              # auth, db, format, api-auth, receipt-print (Web Bluetooth ESC/POS)
│   ├── store/                            # cart-store (Zustand), app-store
│   └── types/                            # Tipe TypeScript bersama
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Panduan Instalasi

### Prasyarat
- **Node.js 18+** atau **Bun** (direkomendasikan)
- Git

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/USERNAME/kasirpro.git
   cd kasirpro
   ```

2. **Install dependencies**
   ```bash
   # menggunakan bun (direkomendasikan)
   bun install
   # atau
   npm install
   ```

3. **Salin file environment**
   ```bash
   cp .env.example .env
   ```
   Lalu edit `.env`:
   - `NEXTAUTH_SECRET` — generate dengan `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `http://localhost:3000` (development)
   - `DATABASE_URL` — biarkan default (SQLite) atau ganti ke MySQL (lihat bagian Database)

4. **Inisialisasi database**
   ```bash
   # Push schema ke database
   bun run db:push        # atau: npx prisma db push

   # (Opsional) Isi data awal: admin, kasir, kategori, produk, pelanggan, transaksi contoh
   bun run db:seed        # atau: npx prisma db seed  / bun prisma/seed.ts
   ```

---

## Konfigurasi Database

### Opsi A: SQLite (default — paling mudah untuk development)
Tidak perlu instalasi tambahan. File database otomatis dibuat di `db/custom.db`.
```
DATABASE_URL="file:./db/custom.db"
```

### Opsi B: MySQL (untuk produksi)
1. Buat database MySQL, misalnya `kasirpro`.
2. Edit `prisma/schema.prisma`, ubah provider datasource:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` di `.env`:
   ```
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/kasirpro"
   ```
4. Jalankan `bun run db:push` lalu `bun run db:seed`.

### Skema Database
Tabel/Model:
- **User** — admin & kasir (id, name, email, password hash, role)
- **Category** — kategori produk
- **Product** — produk (SKU unik, harga, stok, gambar, relasi kategori)
- **Customer** — pelanggan
- **Transaction** — header transaksi (invoice, subtotal, diskon, pajak, total, kasir, pelanggan)
- **TransactionDetail** — item per transaksi (produk, qty, harga, subtotal)
- **Payment** — pembayaran (metode, uang diterima, kembalian, referensi)
- **Setting** — pengaturan toko (nama, alamat, pajak, QRIS, dll)

Relasi sudah didefinisikan di `prisma/schema.prisma` dengan `onDelete` yang aman (Cascade / Restrict / SetNull sesuai konteks).

---

## Menjalankan Website

```bash
# Development server (port 3000)
bun run dev
# atau
npm run dev
```

Buka aplikasi melalui **Preview Panel** (klik "Open in New Tab" untuk tab terpisah).

**Build untuk produksi:**
```bash
bun run build
bun run start
```

---

## Akun Demo

Setelah menjalankan `db:seed`, gunakan akun berikut:

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@kasirpro.id    | admin123   |
| Kasir | kasir@kasirpro.id    | kasir123   |

> **Penting:** Ganti password akun ini di lingkungan produksi.

---

## Cetak Struk & Printer Bluetooth

### Cetak via Browser
Klik tombol **"Browser"** pada dialog transaksi berhasil atau **"Cetak Ulang Struk"** di detail transaksi. Browser akan menampilkan dialog print dengan ukuran kertas 58mm. Pilih printer thermal yang terpasang.

### Cetak via Web Bluetooth (Printer BLE RPP02N)
1. Gunakan **Android Chrome** atau browser yang mendukung **Web Bluetooth API**.
2. Nyalakan printer RPP02N, pastikan Bluetooth aktif.
3. Klik tombol **"Bluetooth"** pada dialog transaksi berhasil.
4. Pilih printer dari dialog pairing browser.
5. Struk (format ESC/POS) akan dikirim ke printer.

Jika Web Bluetooth tidak didukung, tombol akan dinonaktifkan dan pesan alternatif ditampilkan (gunakan cetak via Browser).

Implementasi cetak Bluetooth ada di `src/lib/receipt-print.ts` (encoding ESC/POS + koneksi GATT ke karakteristik printer yang dapat ditulis).

---

## Konfigurasi QRIS (Opsional)

QRIS bersifat opsional. Untuk mengaktifkan:

1. Login sebagai Admin → menu **Pengaturan** → section **Pembayaran QRIS**.
2. Aktifkan toggle **"Aktifkan QRIS"**.
3. Isi **QRIS Merchant ID** dan **API Key Payment Gateway**.
4. Simpan.

API key disimpan di database dan **tidak ditampilkan kembali** (dimask). Jika ingin mengubah, isi ulang; jika ingin mempertahankan nilai lama, biarkan kosong.

> QR code yang ditampilkan adalah QRIS demo. Untuk produksi, hubungkan ke payment gateway resmi (Midtrans, Xendit, dll.) dengan API key yang valid.

---

## Keamanan

- **Password di-hash** menggunakan bcrypt (salt rounds 10).
- **Autentikasi** via NextAuth.js (JWT, http-only cookies).
- **Role-based access**: middleware `requireAdmin()` melindungi endpoint manajemen (produk, kategori, stok, pelanggan, laporan, pengaturan). Kasir hanya bisa mengakses POS & transaksi.
- **Validasi input** pada semua API route (required fields, tipe data, SKU unik, stok cukup).
- **Validasi upload gambar**: tipe file (JPG/PNG/WebP), ukuran maksimal 4MB, dioptimasi dengan sharp.
- **Atomic transaction** saat menyimpan penjualan (stok & detail ditulis dalam satu `db.$transaction`).
- **Environment variables** untuk kredensial (NEXTAUTH_SECRET, DATABASE_URL). File `.env` di-ignore dari git.
- **CSRF protection** bawaan Next.js API routes + NextAuth.
- **Tidak ada informasi sensitif** pada pesan error.
- File `.env.example` disertakan tanpa kredensial asli.

---

## Lisensi

MIT — bebas digunakan dan dikembangkan.
