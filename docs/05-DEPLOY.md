# 🚀 Fase 5: Deploy ke Internet (Vercel)

Sekarang waktunya bikin app lo bisa diakses dari mana aja (HP, laptop lain, kasih ke temen, dll).

## ✅ Checklist (~30 menit)

- [ ] Upload code ke GitHub
- [ ] Daftar Vercel
- [ ] Connect Vercel ke GitHub
- [ ] Setup environment variables di Vercel
- [ ] Deploy
- [ ] Update Supabase redirect URLs

---

## 1. Upload Code ke GitHub

### A. Bikin Repository Baru

1. Buka https://github.com
2. Klik **+** di pojok kanan atas → **New repository**
3. **Repository name**: `catatduit`
4. **Visibility**: pilih **Private** (biar code lo ga keliatan publik)
5. **JANGAN** centang "Add README" / "Add .gitignore" / "Add license"
6. Klik **Create repository**

### B. Push Code dari Laptop

Di terminal VS Code (di folder project), jalanin satu per satu:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

Sekarang copy command yang muncul di halaman GitHub baru lo (bagian "…or push an existing repository"). Bentuknya kayak gini:

```bash
git remote add origin https://github.com/USERNAME-LO/catatduit.git
git push -u origin main
```

**Pertama kali push, lo bakal diminta login GitHub.** Pake:
- Username: username GitHub lo
- Password: bukan password GitHub, tapi **Personal Access Token**!

### Cara bikin Personal Access Token:

1. Di GitHub, klik **profile photo** (pojok kanan atas) → **Settings**
2. Scroll bawah, sidebar kiri → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. Note: `catatduit-deploy`
6. Expiration: `No expiration` (atau yang lo mau)
7. Scopes: centang **`repo`** (semua sub-checkbox)
8. Klik **Generate token**
9. **COPY TOKEN YANG MUNCUL** — ga akan muncul lagi!
10. Pake token ini sebagai password pas push

Setelah berhasil push, refresh halaman GitHub repo lo. File-file harusnya udah muncul.

### ⚠️ Verifikasi `.env.local` GA ke-upload!

Buka repo GitHub lo, scroll file list. Pastikan **`.env.local` GA muncul**. Yang muncul cuma `.env.local.example`. Kalau `.env.local` muncul, **API key lo bocor** — segera regenerate keys di Supabase.

---

## 2. Daftar Vercel

1. Buka https://vercel.com
2. **Sign up** pake **GitHub** (bukan email)
3. Authorize Vercel buat akses repos lo

---

## 3. Deploy Project

1. Di dashboard Vercel, klik **Add New** → **Project**
2. Cari repo `catatduit`, klik **Import**
3. **Framework Preset**: harusnya udah otomatis ke-detect "Next.js" ✓
4. **Root Directory**: biarkan `./`
5. **Build settings**: biarkan default
6. Scroll ke **Environment Variables**, **ini WAJIB diisi:**

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | (paste dari Supabase project lo) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (paste dari Supabase project lo) |

7. Klik **Deploy**
8. Tunggu 1-3 menit

---

## 4. Lihat App Lo Online!

Setelah build selesai, Vercel kasih URL kayak:
```
https://catatduit-xxxxx.vercel.app
```

Klik URL itu — selamat, app lo udah online! 🎉

Tapi tunggu, ada 1 step penting lagi sebelum reset password jalan...

---

## 5. Update Supabase Redirect URLs

Karena URL production lo beda sama localhost, lo wajib tambahin URL production ke Supabase.

1. **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. **Site URL**: ganti jadi URL Vercel lo (misal `https://catatduit-xxxxx.vercel.app`)
3. **Redirect URLs**: tambah dengan klik **+ Add URL**:
   - `https://catatduit-xxxxx.vercel.app/auth/callback`
   - `https://catatduit-xxxxx.vercel.app/update-password`
4. **Save**

⚠️ **Jangan hapus localhost URLs** kalau lo masih mau test di local!

---

## 6. Test di HP

1. Buka URL Vercel lo di HP
2. Login
3. Coba semua fitur — harusnya jalan sama persis kayak di laptop
4. Test reset password — email harus masuk

---

## 7. Custom Domain (Opsional)

Mau pake domain sendiri kayak `catatduit.com`?

1. Beli domain di **Namecheap** / **Cloudflare** / **GoDaddy** (~Rp 150rb-200rb/tahun)
2. Di Vercel project lo → **Settings** → **Domains**
3. **Add Domain** → masukin domain lo
4. Ikutin instruksi Vercel buat update DNS di registrar lo
5. Tunggu propagasi (5 menit - 1 jam)
6. SSL auto-generate ✓
7. Update Supabase URL Configuration dengan domain baru

---

## 8. Auto-Deploy

Bonus: setiap kali lo `git push` perubahan, Vercel otomatis deploy ulang. Lo ga perlu manual deploy lagi.

```bash
# Edit code di VS Code...
git add .
git commit -m "Update warna button"
git push
# Tunggu 1 menit, perubahan udah live!
```

---

## ❓ Troubleshooting

**Q: Build di Vercel error "Cannot find module"**
A: Pastikan `package.json` udah ke-commit ke GitHub. Cek `git status`.

**Q: App online tapi error "Invalid API key"**
A: Cek environment variables di Vercel project → **Settings** → **Environment Variables**. Pastikan nilai-nya bener.

**Q: Reset password redirect ke localhost padahal udah di production**
A: Update Site URL di Supabase ke URL production lo.

**Q: Domain udah dibeli tapi belum work**
A: DNS propagasi bisa 24 jam. Sabar, atau gunakan Cloudflare DNS yang lebih cepet.

---

## ➡️ Lanjut ke Fase 6

App lo udah online! Buka **`docs/06-CUSTOM.md`** untuk tips customize dan develop lebih lanjut.
