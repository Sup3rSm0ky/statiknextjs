# 💻 Fase 3: Jalanin Project di Laptop

Sekarang waktunya download project ini dan jalanin di laptop lo.

## ✅ Checklist (~15 menit)

- [ ] Letakkan project folder di lokasi yang gampang diakses
- [ ] Install dependencies
- [ ] Setup environment variables
- [ ] Jalanin di localhost
- [ ] Test login

---

## 1. Pindahkan Project Folder

1. Pastikan lo udah download seluruh folder `catatduit-project` ke laptop
2. Pindahkan ke lokasi yang gampang, misal `Documents/catatduit/`
3. **Rename folder** dari `catatduit-project` jadi `catatduit` (opsional, biar pendek)

---

## 2. Buka Project di VS Code

1. Buka VS Code
2. **File** → **Open Folder**
3. Pilih folder `catatduit` lo
4. Klik **Yes, I trust the authors** kalau muncul

---

## 3. Buka Terminal Built-in di VS Code

1. Di VS Code, **Terminal** menu → **New Terminal** (atau tekan Ctrl+`)
2. Pastikan terminal terbuka **di dalam folder project** — harus muncul nama folder `catatduit` di prompt

---

## 4. Install Dependencies

Di terminal yang baru terbuka, ketik:

```bash
npm install
```

Ini bakal download semua library yang dibutuhin (Next.js, Supabase, Tailwind, dll). Tunggu 1-3 menit. Bakal muncul banyak teks — ignore aja, asalkan ga ada "ERROR" di akhir.

---

## 5. Setup Environment Variables

**Apa itu?** File yang nyimpen API keys rahasia (Supabase URL & key). File ini ga di-upload ke GitHub.

### Cara setup:

1. Di VS Code, lihat sidebar kiri (file explorer)
2. Cari file **`.env.local.example`**
3. **Copy** file itu, rename copy-an nya jadi **`.env.local`** (hilangin `.example`)
4. Buka file `.env.local`
5. Isi 2 baris ini pake nilai yang lo catat di Fase 2:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

6. **Save** (Ctrl+S)

---

## 6. Jalanin Server Development

Di terminal VS Code, ketik:

```bash
npm run dev
```

Tunggu 10-30 detik. Bakal muncul kayak gini:

```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Ready in 2.5s
```

Berarti project lo udah jalan!

---

## 7. Buka di Browser

1. Buka browser (Chrome/Firefox/Edge)
2. Buka **http://localhost:3000**
3. Harus muncul halaman login CatatDuit

---

## 8. Test Login Pertama Kali

### Kalau lo udah bikin user di Fase 2:
- Login pake email & password yang lo set di Supabase Authentication → Users

### Kalau belum bikin user:
1. Klik **"Daftar"** di halaman login
2. Isi nama, email, password
3. Submit
4. Lo bakal otomatis ke-redirect ke dashboard

---

## 9. Test Fitur

Coba flow lengkap:

1. **Tambah Rekening**: Tab Rekening → + Tambah Rekening → isi nama BCA, tipe Bank, saldo awal 5000000
2. **Tambah Transaksi**: Tab Transaksi → + Tambah Transaksi → pilih Pengeluaran, isi data
3. **Lihat Dashboard**: balik ke Dashboard, lihat saldo update, grafik muncul
4. **Set Budget**: Tab Budget → + Set Budget → pilih kategori, set limit
5. **Logout**: klik avatar pojok kanan → Keluar
6. **Login lagi**: data masih ada ✓

---

## 🛑 Stop Server

Kalau mau berhenti, di terminal tekan **Ctrl+C** (atau Cmd+C di Mac).

Kalau mau jalanin lagi, ketik `npm run dev` lagi.

---

## ❓ Troubleshooting

**Q: `npm install` gagal dengan banyak error**
A: Hapus folder `node_modules` (kalau ada) dan file `package-lock.json`, terus run `npm install` lagi.

**Q: Error "EADDRINUSE: address already in use :::3000"**
A: Port 3000 lagi dipake. Tutup terminal lain yg jalanin Next.js, atau pake port lain: `npm run dev -- -p 3001`

**Q: Halaman muncul tapi error "Invalid API key" / "Failed to fetch"**
A: Cek `.env.local` lo — pastikan URL dan key dari Supabase udah bener, ga ada typo, ga ada spasi. Restart server (Ctrl+C terus `npm run dev` lagi).

**Q: Login gagal "Invalid login credentials"**
A: Email/password salah, atau user belum di-confirm. Cek di Supabase → Authentication → Users.

**Q: Bisa login tapi data ga ke-save**
A: Cek di browser console (F12 → Console). Biasanya RLS policy error — pastikan SQL schema udah ke-run sukses.

---

## ➡️ Lanjut ke Fase 4

Project udah jalan di laptop! Sekarang setup email reset password biar bisa kirim email beneran. Buka **`docs/04-EMAIL-AUTH.md`**.
