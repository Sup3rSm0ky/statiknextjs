# 📦 Fase 1: Setup Tools

Sebelum bikin website, lo perlu install beberapa software dulu di laptop lo.

## ✅ Checklist (~30 menit)

- [ ] Install Node.js
- [ ] Install Visual Studio Code (code editor)
- [ ] Install Git
- [ ] Bikin akun GitHub
- [ ] Test instalasi

---

## 1. Install Node.js

**Apa itu Node.js?** Software yang dibutuhin buat jalanin JavaScript di laptop lo (di luar browser). Next.js butuh Node.js.

### Cara install:

1. Buka https://nodejs.org
2. Download versi **LTS** (Long Term Support) — biasanya nomor lebih kecil dari versi "Current"
3. Buka file installer yang baru di-download
4. Klik **Next** terus aja, pake setting default
5. Tunggu sampe selesai

### Verifikasi install:

Buka **Terminal** (Mac/Linux) atau **Command Prompt** / **PowerShell** (Windows). Ketik:

```bash
node --version
```

Harus muncul angka kayak `v20.x.x` atau `v22.x.x`. Kalau muncul "command not found", restart laptop dan coba lagi.

```bash
npm --version
```

Harus muncul angka kayak `10.x.x`. Ini namanya **npm** (Node Package Manager), bawaan Node.js.

---

## 2. Install Visual Studio Code

**Apa itu VS Code?** Code editor (kayak Notepad tapi khusus buat coding). Gratis dari Microsoft, paling populer untuk web dev.

### Cara install:

1. Buka https://code.visualstudio.com
2. Klik **Download** sesuai OS lo (Windows/Mac/Linux)
3. Install kayak biasa, pake setting default
4. Buka VS Code setelah selesai install

### Extension yang gw saranin install di VS Code:

Buka VS Code, klik icon kotak-kotak di kiri (Extensions), search dan install:

- **ES7+ React/Redux/React-Native snippets** (mempercepat ngetik kode React)
- **Tailwind CSS IntelliSense** (autocomplete untuk Tailwind)
- **Prettier - Code formatter** (auto-rapihin code)

---

## 3. Install Git

**Apa itu Git?** Software buat ngelacak perubahan code dan upload ke GitHub.

### Cara install:

**Windows:**
1. Download dari https://git-scm.com/download/win
2. Install pake setting default (Next terus aja)

**Mac:**
1. Buka Terminal
2. Ketik `git --version` — kalau belum ada, Mac otomatis tawarin install
3. Atau install via Homebrew: `brew install git`

**Linux:**
```bash
sudo apt install git    # Ubuntu/Debian
sudo dnf install git    # Fedora
```

### Verifikasi:

```bash
git --version
```

Harus muncul versi kayak `git version 2.x.x`.

### Konfigurasi awal Git:

Ketik di terminal (ganti dengan info lo):

```bash
git config --global user.name "Nama Lo"
git config --global user.email "email@lo.com"
```

---

## 4. Bikin Akun GitHub

**Apa itu GitHub?** Tempat nyimpen code lo online. Vercel butuh GitHub buat deploy.

1. Buka https://github.com
2. Klik **Sign up**
3. Pake email yang sama dengan yang lo set di Git tadi
4. Pilih plan **Free**
5. Verifikasi email lo

---

## 5. Test Final

Buka Terminal/Command Prompt, ketik satu per satu:

```bash
node --version
npm --version
git --version
```

Kalau 3-3nya muncul versi, lo udah siap lanjut ke Fase 2! 🎉

---

## ❓ Troubleshooting

**Q: `node` is not recognized (Windows)**
A: Restart laptop. Kalau masih error, install ulang Node.js dan pastikan centang "Add to PATH" pas install.

**Q: Lupa email/password GitHub**
A: Reset via https://github.com/password_reset

**Q: VS Code ga mau ke-buka**
A: Restart laptop.

---

## ➡️ Lanjut ke Fase 2

Kalau semua tools udah ke-install dan ke-test, buka **`docs/02-SUPABASE.md`** untuk setup database.
