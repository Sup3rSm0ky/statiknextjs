# 🎨 Fase 6: Tips Customize & Develop Lebih Lanjut

App lo udah online dan jalan. Sekarang gimana kalo lo mau modifikasi atau nambahin fitur?

---

## 🎨 Ganti Warna Tema

File: `app/globals.css`

Cari bagian `:root { ... }`. Ganti nilai CSS variables:

```css
:root {
  --accent: #c4ff3f;        /* Warna utama (lime green) */
  --bg: #0a0a0f;            /* Background (hampir hitam) */
  --green: #4ade80;         /* Income */
  --red: #ff5577;           /* Expense */
}
```

**Contoh tema lain:**

```css
/* Tema biru ocean */
--accent: #38bdf8;
--bg: #0c1929;

/* Tema purple */
--accent: #a78bfa;
--bg: #1a0a2e;

/* Tema light mode */
--bg: #faf8f3;
--ink: #1a1815;
--bg-card: #ffffff;
```

Setelah edit, save dan refresh browser. Bisa langsung keliatan.

---

## 📝 Tambah Kategori Default

File: `supabase/schema.sql`

Cari function `create_default_categories()`. Tambah atau edit kategori:

```sql
INSERT INTO categories (user_id, name, type) VALUES
  (NEW.id, 'Makan', 'expense'),
  (NEW.id, 'Kopi', 'expense'),       -- tambah baru
  (NEW.id, 'Donasi', 'expense'),     -- tambah baru
  -- dst
```

**Catat**: kalau lo udah ada user existing, kategori baru ga otomatis nambah. Cuma user yang baru daftar setelah edit ini yang dapet.

Untuk tambahin kategori ke user yang udah ada, jalanin SQL ini di Supabase SQL Editor:

```sql
INSERT INTO categories (user_id, name, type)
SELECT id, 'Kopi', 'expense' FROM auth.users;
```

---

## 💡 Ide Fitur Tambahan

### Mudah (1-2 jam coding)

- **Export ke CSV** — tombol di dashboard, download semua transaksi sebagai .csv
- **Search transaksi** — text input di halaman transactions, filter berdasarkan deskripsi
- **Dark/Light mode toggle** — pake CSS variable swap
- **Total per kategori** — chart pie/bar di dashboard

### Sedang (1-2 hari coding)

- **Recurring transactions** — tagihan bulanan (gaji, Netflix, dll) auto-insert tiap tanggal tertentu
- **Multi-currency** — selain Rupiah, support USD/EUR
- **Notes per transaksi** — field rich text untuk detail
- **Photo struk** — upload foto, simpan di Supabase Storage

### Susah (butuh research)

- **Email reminder budget** — kalau budget hampir habis, kirim email
- **AI categorization** — auto-detect kategori dari deskripsi
- **OCR scan struk** — foto struk, otomatis ekstrak total
- **Mobile app native** — pake React Native, share code dengan Next.js

---

## 🔧 Cara Edit Code

### Workflow standar:

1. Buka VS Code di folder project
2. Edit file yang mau diubah
3. Save (Ctrl+S) — kalau dev server jalan, browser otomatis refresh
4. Test di `http://localhost:3000`
5. Kalau udah ok, commit ke GitHub:

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

6. Vercel otomatis deploy ulang dalam 1-2 menit

---

## 📚 Belajar Lebih Lanjut

Stack yang dipake di project ini:

**Next.js** — framework React untuk web app
- Tutorial resmi: https://nextjs.org/learn
- App Router (yang dipake project ini): https://nextjs.org/docs/app

**Supabase** — backend (database + auth)
- Docs: https://supabase.com/docs
- Video tutorial: search "Supabase Next.js tutorial" di YouTube

**TypeScript** — JavaScript dengan type checking
- Beginner-friendly: https://www.typescriptlang.org/docs/handbook/intro.html

**React** — library frontend
- Docs baru (lebih bagus): https://react.dev/learn

---

## 🆘 Stuck atau Butuh Bantuan?

1. **Cari di Google** dulu — biasanya ada Stack Overflow yang udah jawab
2. **AI chatbot** — Claude, ChatGPT, GitHub Copilot bisa bantu debug
3. **Discord komunitas**:
   - Next.js: https://discord.gg/nextjs
   - Supabase: https://discord.supabase.com
4. **Stack Overflow** — tag dengan `next.js`, `supabase`, `react`

---

## 🎯 Closing

Lo udah punya:
- ✅ Personal finance tracker yang full-featured
- ✅ Database secure (RLS)
- ✅ Auth dengan email reset password
- ✅ Live di internet (deploy gratis)
- ✅ Source code yang lo kontrol sepenuhnya

Selamat! 🎉

Pake terus, develop sesuai kebutuhan lo. Kalau ada bug atau mau tambah fitur, balik lagi ke Claude, paste kode yang error/file yang mau diubah, gw bantu.
