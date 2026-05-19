# 📧 Fase 4: Setup Email Auth & Reset Password

Default-nya Supabase pake email dari `noreply@supabase.io` buat kirim email. Untuk personal use ini udah cukup, tapi kalau lo mau email reset password masuk ke email tertentu (kayak `supersmoky87@gmail.com`), ada beberapa setting penting.

## ✅ Checklist

- [ ] Aktifkan email confirmation
- [ ] Setup template email (Indonesia)
- [ ] Test flow reset password lengkap

---

## 1. Aktifkan Email Confirmation (Opsional tapi Recommended)

Email confirmation = user wajib klik link di email sebelum bisa login pertama kali. Lebih aman.

1. Buka **Supabase Dashboard** → **Authentication** → **Providers**
2. Klik **Email**
3. **Enable Email Confirmations**: ON
4. **Confirm email change**: ON
5. **Save**

---

## 2. Customize Email Templates (Bahasa Indonesia)

Default email Supabase bahasa Inggris. Gw kasih template bahasa Indonesia.

### A. Reset Password Email

1. **Authentication** → **Email Templates**
2. Klik **Reset Password**
3. **Subject**: `Reset Password CatatDuit Lo`
4. **Body** (HTML), paste:

```html
<h2>Reset Password CatatDuit</h2>
<p>Halo,</p>
<p>Lo barusan minta reset password buat akun CatatDuit. Klik link di bawah buat bikin password baru:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password Sekarang</a></p>
<p>Link ini valid 1 jam. Kalau lo ga minta reset password, abaikan email ini.</p>
<p>—</p>
<p style="color:#888;font-size:12px">CatatDuit · Personal Finance Tracker</p>
```

5. Klik **Save**

### B. Confirmation Email (Sign Up)

1. Klik **Confirm signup**
2. **Subject**: `Konfirmasi Akun CatatDuit Lo`
3. **Body**:

```html
<h2>Welcome to CatatDuit!</h2>
<p>Halo,</p>
<p>Terima kasih udah daftar di CatatDuit. Klik link di bawah buat konfirmasi email lo:</p>
<p><a href="{{ .ConfirmationURL }}">Konfirmasi Email</a></p>
<p>—</p>
<p style="color:#888;font-size:12px">CatatDuit · Personal Finance Tracker</p>
```

4. **Save**

---

## 3. Setup Redirect URL

Supabase perlu tau URL aplikasi lo biar link email-nya bener.

1. **Authentication** → **URL Configuration**
2. **Site URL**: `http://localhost:3000` (untuk testing local)
3. **Redirect URLs** (klik **+ Add URL**, tambah satu-satu):
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/update-password`
4. **Save**

⚠️ Nanti pas deploy ke Vercel di Fase 5, lo wajib tambah URL production juga (misal `https://catatduit.vercel.app/auth/callback` dan `https://catatduit.vercel.app/update-password`).

---

## 4. Test Flow Reset Password

1. Buka app lo di `http://localhost:3000`
2. Di login page, klik **"Lupa password?"**
3. Masukin email yg terdaftar
4. Klik **"Kirim Link Reset"**
5. Cek email lo (cek juga **folder Spam**!)
6. Klik link di email → bakal ke-redirect ke halaman "Password Baru"
7. Set password baru → submit
8. Otomatis login ke dashboard ✓

---

## 5. Custom Domain Email (Opsional, Advanced)

Mau email reset masuk dari `noreply@catatduit.com` bukan `noreply@supabase.io`? Lo butuh:

1. Beli custom domain (di Namecheap, GoDaddy, dll)
2. Setup SMTP custom di Supabase (pake SendGrid/Resend/Mailgun)
3. Verifikasi domain

Ini lumayan ribet dan butuh paid service. Untuk personal use, default Supabase udah cukup.

**Quick guide kalau lo mau setup:**
- Resend.com (3,000 email/bulan gratis)
- Daftar Resend, verifikasi domain lo
- Copy API key
- Di Supabase: **Project Settings** → **Auth** → **SMTP Settings**
- Isi SMTP host, port, user (API key dari Resend), dll

---

## ❓ Troubleshooting

**Q: Email reset password ga masuk**
A: Cek folder **Spam** dan **Promotions**. Default email Supabase sering ke-filter. Tunggu 5 menit.

**Q: Link di email error "Token expired"**
A: Link cuma valid 1 jam. Minta link baru.

**Q: "URL is not allowed for redirect" error**
A: Tambah URL nya di Authentication → URL Configuration → Redirect URLs.

**Q: Email masuk tapi pas klik link langsung ke login, ga ke update-password**
A: Pastikan **Site URL** di Supabase udah bener (`http://localhost:3000` untuk local), dan **Redirect URLs** udah include `http://localhost:3000/update-password`.

---

## ➡️ Lanjut ke Fase 5

App udah jalan komplit di local dengan auth + reset password beneran via email. Sekarang waktunya publish ke internet biar bisa diakses dari HP atau device lain. Buka **`docs/05-DEPLOY.md`**.
