# DESIGN.md

# Al Bayan Education

Design System Documentation

Version 1.0

---

# 1. Design Philosophy

Website Al Bayan Education tidak mengikuti template website sekolah konvensional.

Website dirancang agar memberikan kesan modern, bersih, profesional, tenang, dan elegan tanpa kehilangan identitas islami.

Seluruh pengalaman pengguna harus terasa ringan dan fokus kepada informasi.

Desain tidak boleh terlihat seperti dashboard admin lama atau template Bootstrap.

Website harus memiliki kesan seperti website startup modern, namun tetap sopan dan formal.

Inspirasi utama berasal dari:

• IKLA

• Vercel

• Home HSI

Namun website tetap memiliki identitas visual sendiri.

---

# 2. Brand Personality

Karakter website.

Modern.

Elegant.

Professional.

Islamic.

Minimalist.

Premium.

Friendly.

Readable.

Calm.

Simple.

Website harus membuat pengunjung merasa nyaman sejak pertama kali dibuka.

---

# 3. Visual Identity

Visual utama website terdiri dari.

Video.

Whitespace.

Typography.

Rounded Component.

Gradient Hijau.

Glass Effect ringan.

Shadow lembut.

Motion sederhana.

Tidak menggunakan ornamen berlebihan.

Tidak menggunakan efek neon.

Tidak menggunakan animasi ramai.

---

# 4. Color Palette

Primary

#14532D

Dark Green

Digunakan untuk.

Navbar

Button

Footer

Hero Overlay

Sidebar

Heading tertentu

---

Secondary

#22C55E

Digunakan untuk.

Hover

Badge

Progress

Highlight

---

Accent

#D4A017

Digunakan secara terbatas.

Icon.

Divider.

Callout.

Highlight tertentu.

Tidak digunakan sebagai warna utama.

---

Background

#FFFFFF

Sebagai background utama.

---

Section Background

#F8FAFC

Digunakan agar section tidak terlihat monoton.

---

Text Primary

#1E293B

---

Text Secondary

#64748B

---

Border

#E2E8F0

---

Danger

#EF4444

---

Warning

#F59E0B

---

Success

#16A34A

---

Info

#0EA5E9

---

# 5. Typography

Primary Font

Batangas Bold

Lokasi.

resources/fonts/

Digunakan untuk.

Hero Title.

Section Title.

Large Heading.

Tidak digunakan pada paragraph.

---

Body Font

Inter

atau

Plus Jakarta Sans

atau

Geist

Digunakan untuk.

Paragraph.

Description.

Form.

Button.

Navigation.

Card.

Dashboard.

---

# 6. Font Scale

Hero

56-72 px

Desktop

48 px

Tablet

40 px

Mobile

32 px

Section Title

40 px

Sub Heading

28 px

Card Title

22 px

Paragraph

16 px

Small Text

14 px

Caption

12 px

---

# 7. Font Weight

Hero

700

Heading

700

Sub Heading

600

Body

400

Button

600

Caption

400

---

# 8. Border Radius

Button

14 px

Input

14 px

Card

20 px

Modal

24 px

Image

18 px

Navbar

999 px

Badge

999 px

---

# 9. Shadow

Website menggunakan Soft Shadow.

Tidak menggunakan Shadow hitam pekat.

Card.

Shadow kecil.

Hover.

Shadow bertambah sedikit.

Navbar.

Shadow tipis.

Modal.

Shadow sedang.

Hero.

Tidak menggunakan shadow.

---

# 10. Spacing System

4

8

12

16

20

24

32

40

48

64

80

96

Mengikuti kelipatan empat.

Tidak menggunakan angka acak.

---

# 11. Grid System

Desktop.

12 Column.

Tablet.

8 Column.

Mobile.

4 Column.

Gap.

24 px.

---

# 12. Hero Design

Hero menggunakan tinggi penuh.

100vh.

Background.

public/image/background1.mp4

Video.

Loop.

Autoplay.

Muted.

Object Cover.

Overlay.

Hijau gelap.

Opacity sekitar lima puluh persen.

---

Hero terdiri dari.

Logo.

Heading.

Subtitle.

Button.

Scroll Indicator.

---

# 13. Navbar

Navbar Floating.

Margin Top.

20 px.

Rounded.

999 px.

Background transparan.

Backdrop Blur.

Saat scroll.

Navbar berubah putih.

Logo mengecil.

Shadow muncul.

Transition.

300 ms.

---

# 14. Buttons

Primary Button.

Hijau.

Text putih.

Rounded.

Hover lebih gelap.

Secondary Button.

Outline Hijau.

Background putih.

Ghost Button.

Tanpa background.

Hover abu muda.

Danger Button.

Merah.

Success Button.

Hijau terang.

---

# 15. Cards

Seluruh card memiliki.

Rounded.

Shadow.

Padding.

Hover.

Card tidak boleh datar.

Card Gallery.

Card Program.

Card Dashboard.

Card FAQ.

Card Announcement.

Semua memiliki style yang konsisten.

---

# 16. Forms

Input.

Rounded.

Background putih.

Border tipis.

Focus hijau.

Validation merah.

Error muncul di bawah input.

Tidak menggunakan alert browser.

---

# 17. Gallery

Desktop.

3 Kolom.

Tablet.

2 Kolom.

Mobile.

1 Kolom.

Hover.

Image Zoom.

Gradient Overlay.

Title muncul.

Klik membuka Lightbox.

---

# 18. Program Cards

Layout zig-zag.

Image.

Title.

Schedule.

Description.

Button.

Hover.

Scale 1.02

Transition.

300 ms.

---

# 19. Dashboard Design

Dashboard berbeda dari Landing.

Background.

Putih.

Sidebar.

Hijau tua.

Header.

Putih.

Card.

Putih.

Shadow tipis.

Radius 20 px.

Tidak menggunakan gradient berlebihan.

---

# 20. Animation Rules

Animation menggunakan Motion (sebelumnya Framer Motion).

Fade.

Slide.

Scale.

Opacity.

Duration.

0.3 - 0.5 detik.

Tidak menggunakan bounce.

Tidak menggunakan animation looping yang mengganggu.

---

# 21. Scroll Behaviour

Hero tertutup oleh section putih.

Tidak menggunakan efek fade.

Efek dibuat seperti layer naik.

Seluruh section menggunakan Smooth Scroll.

---

# 22. Icon Rules

Menggunakan.

Lucide React.

Ukuran.

20

24

32

Tidak mencampur icon library.

---

# 23. Image Rules

Seluruh gambar.

Rounded.

Lazy Load.

Compressed.

WebP jika memungkinkan.

Hero tetap menggunakan MP4.

---

# 24. Responsive Rules

Desktop.

≥1200

Laptop.

992

Tablet.

768

Mobile.

576

Semua komponen wajib responsive.

Tidak boleh Horizontal Scroll.

---

# 25. Accessibility

Alt Image.

Keyboard Navigation.

Visible Focus Ring.

Color Contrast.

Label Form.

ARIA jika diperlukan.

---

# 26. Motion Philosophy

Motion digunakan untuk membantu pengguna memahami perpindahan.

Bukan sebagai dekorasi.

Setiap animasi harus memiliki tujuan.

Jika animasi tidak membantu UX.

Hapus.

---

# 27. UI Principles

Satu halaman.

Satu tujuan.

Whitespace lebih penting daripada dekorasi.

Typography lebih penting daripada warna.

Konsistensi lebih penting daripada kreativitas.

Komponen harus reusable.

UI harus sederhana namun terasa premium.

---

# 28. Asset Rules

Logo.

public/image/logo.png

Hero Video.

public/image/background1.mp4

Gallery.

public/image/gallery/

Program.

public/image/program/

Seluruh asset mengikuti struktur folder yang telah ditentukan.

---

# End Design System

Semua halaman baru wajib mengikuti aturan pada dokumen ini.

Tidak diperbolehkan membuat style baru tanpa alasan yang jelas agar identitas visual Al Bayan Education tetap konsisten pada seluruh halaman.