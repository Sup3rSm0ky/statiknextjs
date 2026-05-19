# 🗄️ Fase 2: Setup Supabase (Database + Auth)

Supabase = database + authentication, semua dalam satu platform. Free tier-nya cukup banget buat finance tracker pribadi.

## ✅ Checklist (~20 menit)

- [ ] Daftar akun Supabase
- [ ] Bikin project baru
- [ ] Jalanin SQL schema
- [ ] Catat API keys

---

## 1. Daftar Supabase

1. Buka https://supabase.com
2. Klik **Start your project**
3. Sign in pake **GitHub** (lebih cepet)
4. Authorize Supabase buat akses GitHub lo

---

## 2. Bikin Project Baru

1. Klik **New project**
2. Isi form:
   - **Name**: `catatduit` (terserah lo)
   - **Database Password**: bikin password yg kuat — **SIMPAN BAIK-BAIK**, nanti dibutuhin
   - **Region**: pilih **Southeast Asia (Singapore)** biar cepet dari Indonesia
   - **Pricing Plan**: **Free**
3. Klik **Create new project**
4. Tunggu 1-2 menit sampe project ready

---

## 3. Jalanin SQL Schema

Sekarang lo bakal bikin struktur database (tabel-tabel buat nyimpen data).

1. Di dashboard Supabase, klik **SQL Editor** di sidebar kiri (icon `</>`)
2. Klik **+ New query**
3. Buka file **`supabase/schema.sql`** di project ini
4. Copy semua isinya
5. Paste ke SQL Editor
6. Klik **Run** (atau tekan Ctrl+Enter / Cmd+Enter)
7. Harus muncul "Success. No rows returned"

**Apa yang barusan dijalanin?**
- Bikin 4 tabel: `accounts`, `transactions`, `budgets`, `categories`
- Bikin Row Level Security (RLS) policies — biar data tiap user terisolasi
- Bikin trigger otomatis bikin profile pas user daftar

---

## 4. Verifikasi Tabel Udah Ada

1. Klik **Table Editor** di sidebar kiri (icon table)
2. Lo bakal lihat 4 tabel: `accounts`, `transactions`, `budgets`, `categories`
3. Klik salah satu — harus ada kolom-kolom kayak `id`, `user_id`, `name`, dll

---

## 5. Catat API Keys

Sekarang lo butuh 2 nilai dari Supabase buat di-paste ke project Next.js nanti:

1. Di dashboard Supabase, klik **Project Settings** (icon gear di bawah sidebar)
2. Klik **API** di submenu
3. Catat 2 nilai ini di Notepad (jangan share ke siapa-siapa):

**Project URL** (mulai dengan `https://xxxxx.supabase.co`)
```
Project URL: _______________________
```

**anon public key** (string panjang banget)
```
anon key: _______________________
```

⚠️ **PENTING**: Yang lo catat itu **anon public key**, BUKAN `service_role`. `service_role` itu rahasia banget, jangan pernah di-share atau di-commit ke GitHub.

---

## 6. Setup Email Authentication

1. Di sidebar Supabase, klik **Authentication** (icon orang)
2. Klik **Providers**
3. Pastikan **Email** udah enabled (defaultnya udah ON)
4. Scroll ke bawah, **Enable Email Confirmations** — toggle OFF dulu biar ga ribet pas testing (nanti di Fase 4 kita aktifin balik)
5. Klik **Save**

---

## 7. (Opsional) Bikin User Test

Mau langsung punya akun test? Bikin manual:

1. Di sidebar **Authentication** → **Users**
2. Klik **Add user** → **Create new user**
3. Email: `supersmoky87@gmail.com` (atau email lo)
4. Password: bikin password yg lo inget
5. **Auto Confirm User**: ON
6. Klik **Create user**

Ini bakal kepake nanti buat login pertama kali.

---

## ❓ Troubleshooting

**Q: SQL Editor error "permission denied"**
A: Pastikan lo login pake akun yang bikin project. Refresh halaman.

**Q: Project stuck "Setting up"**
A: Tunggu 5 menit, refresh. Kalau tetep stuck, hapus project dan bikin lagi.

**Q: Lupa database password**
A: Bisa di-reset di Project Settings → Database → Reset database password

---

## ➡️ Lanjut ke Fase 3

Database udah siap. Sekarang waktunya jalanin project Next.js di laptop lo. Buka **`docs/03-LOCAL-RUN.md`**.
