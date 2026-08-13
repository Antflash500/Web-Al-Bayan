export const SITE = {
    name: 'Al Bayan Education',
    tagline: 'Belajar Bahasa Arab dalam Lingkungan yang Kondusif',
    description:
        'Al Bayan Education menghadirkan pembelajaran Bahasa Arab serta hunian mahasiswa yang nyaman dalam satu lingkungan islami yang mendukung perkembangan akademik dan karakter.',
    logo: '/images/logo.png',
    logoAuth: '/images/logo2.png',
    heroVideo: '/images/background1.mp4',
    phone: '082332620365',
    whatsapp: '082332620365',
    whatsappUrl: 'https://wa.me/6282332620365',
    email: 'albayaneducation@gmail.com',
    address: {
        street: 'Perumahan Pemali, Blok D17',
        city: 'Jember',
        region: 'Jawa Timur, Indonesia',
    },
    mapsUrl: 'https://maps.google.com/?q=Perumahan+Pemali+Blok+D17+Jember',
} as const;

export const NAV_MENU = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang Kami', href: '/tentang' },
    { label: 'Program', href: '/programs' },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Kontak', href: '/kontak' },
] as const;

export const PROGRAMS = [
    {
        name: 'Bahasa Arab Intensif',
        schedule: 'Senin – Jumat',
        duration: '3 Bulan',
        description:
            'Program pembelajaran Bahasa Arab dasar hingga menengah dengan metode interaktif dan praktik harian.',
    },
    {
        name: 'Tahfidzul Quran',
        schedule: 'Setiap Hari',
        duration: '2 Tahun',
        description:
            'Hafalan Al-Quran dengan bimbingan hafizh bersanad, setoran rutin, dan evaluasi pekanan.',
    },
    {
        name: 'Mahad & Hunian Santri',
        schedule: '24 Jam',
        duration: 'Tahunan',
        description:
            'Hunian mahasiswa yang nyaman dalam lingkungan islami, dekat dengan kampus dan fasilitas umum.',
    },
    {
        name: 'Kelas Malam (BA)',
        schedule: 'Senin – Kamis',
        duration: '6 Bulan',
        description:
            'Kelas Bahasa Arab malam untuk mahasiswa dan umum yang memiliki aktivitas di siang hari.',
    },
    {
        name: 'Persiapan Beasiswa',
        schedule: 'Sabtu – Ahad',
        duration: '4 Bulan',
        description:
            'Program intensif persiapan tes Bahasa Arab untuk beasiswa kampus dalam dan luar negeri.',
    },
    {
        name: 'Pembinaan Karakter',
        schedule: 'Mingguan',
        duration: 'Berjalan',
        description:
            'Kajian rutin dan pembinaan adab serta akhlak sebagai bekal kehidupan para peserta.',
    },
] as const;

export const WHY_CHOOSE = [
    {
        icon: 'mosque',
        title: 'Lingkungan Islami',
        description:
            'Hunian dan aktivitas sehari-hari dalam suasana islami yang nyaman dan kondusif.',
    },
    {
        icon: 'map',
        title: 'Dekat Kampus STDI',
        description:
            'Lokasi strategis dengan akses mudah menuju kampus dan pusat kegiatan akademik.',
    },
    {
        icon: 'home',
        title: 'Hunian Nyaman',
        description: 'Fasilitas hunian bersih, aman, dan nyaman untuk mendukung fokus belajar.',
    },
    {
        icon: 'book',
        title: 'Program Bahasa Arab',
        description: 'Kurikulum Bahasa Arab terstruktur dengan pengajar berpengalaman.',
    },
    {
        icon: 'user',
        title: 'Pembinaan Intensif',
        description: 'Pendampingan dan pembinaan intensif bagi setiap peserta secara personal.',
    },
    {
        icon: 'wrench',
        title: 'Fasilitas Lengkap',
        description:
            'Dilengkapi berbagai fasilitas pendukung kegiatan belajar dan hunian sehari-hari.',
    },
] as const;

export const GALLERY = [
    {
        title: 'Ruang Tamu',
        description: 'Area penerimaan tamu yang bersih dan nyaman.',
        image: '/images/fasilitas/ruang_tamu.jpeg',
    },
    {
        title: 'Depan Asrama',
        description: 'Tampak depan hunian mahasiswa Al Bayan.',
        image: '/images/fasilitas/depan_asrama.jpeg',
    },
    {
        title: 'Kamar 1',
        description: 'Kamar tidur dengan pencahayaan alami yang baik.',
        image: '/images/fasilitas/kamar_1.jpeg',
    },
    {
        title: 'Kamar 2',
        description: 'Ruang istirahat yang tenang dan bersih.',
        image: '/images/fasilitas/kamar_2.jpeg',
    },
    {
        title: 'Kamar 3',
        description: 'Kamar dengan tata ruang yang rapi.',
        image: '/images/fasilitas/kamar_3.jpeg',
    },
    {
        title: 'Kamar 4',
        description: 'Salah satu kamar dengan kapasitas lebih besar.',
        image: '/images/fasilitas/kamar_4.jpeg',
    },
    {
        title: 'Kamar Mandi 1',
        description: 'Kamar mandi bersih dengan fasilitas lengkap.',
        image: '/images/fasilitas/kamar_mandi_1.jpeg',
    },
    {
        title: 'Kamar Mandi 2',
        description: 'Fasilitas kamar mandi tambahan untuk santri.',
        image: '/images/fasilitas/kamar_mandi_2.jpeg',
    },
    {
        title: 'Tempat Jemuran',
        description: 'Area jemuran yang luas dan cukup sinar matahari.',
        image: '/images/fasilitas/tempat_jemuran.jpeg',
    },
    {
        title: 'Garasi Motor',
        description: 'Tempat parkir motor yang aman dan tertutup.',
        image: '/images/fasilitas/garasi_motor.jpeg',
    },
    {
        title: 'Ruang Tengah',
        description: 'Ruang berkumpul santri untuk belajar bersama.',
        image: '/images/fasilitas/ruang_tengah.jpeg',
    },
    {
        title: 'Dapur Umum',
        description: 'Dapur bersama yang bersih dan terawat.',
        image: '/images/fasilitas/dapur_umum.jpeg',
    },
] as const;

export const FAQS = [
    {
        question: 'Apa itu Al Bayan Education?',
        answer: 'Al Bayan Education adalah lembaga pendidikan yang fokus pada pembelajaran Bahasa Arab serta penyediaan hunian mahasiswa yang nyaman dalam lingkungan islami.',
    },
    {
        question: 'Siapa saja yang dapat mendaftar?',
        answer: 'Pendaftaran terbuka bagi mahasiswa, calon mahasiswa, dan masyarakat umum yang ingin belajar Bahasa Arab dalam lingkungan yang kondusif.',
    },
    {
        question: 'Bagaimana cara mendaftar?',
        answer: 'Klik tombol Daftar di menu utama, ikuti proses registrasi multi-step, verifikasi email melalui OTP, lalu akun Anda siap digunakan.',
    },
    {
        question: 'Apa saja program yang tersedia?',
        answer: 'Kami menyediakan program Bahasa Arab Intensif, Tahfidzul Quran, Hunian Mahasiswa, Kelas Malam, Persiapan Beasiswa, dan Pembinaan Karakter.',
    },
    {
        question: 'Apakah tersedia hunian untuk mahasiswa?',
        answer: 'Ya, Al Bayan menyediakan hunian mahasiswa dengan fasilitas lengkap, dekat dengan kampus STDI, dan lingkungan yang islami.',
    },
    {
        question: 'Bagaimana cara menghubungi kami?',
        answer: 'Anda dapat menghubungi kami melalui WhatsApp di 082332620365 atau email albayaneducation@gmail.com.',
    },
] as const;

export const VISION =
    'Menjadi lembaga pendidikan Bahasa Arab terdepan yang melahirkan generasi berilmu, beradab, dan berkarakter islami dalam lingkungan yang kondusif dan profesional.';

export const MISSIONS = [
    {
        icon: 'book',
        title: 'Menyelenggarakan pembelajaran',
        description: 'Bahasa Arab berkualitas dengan metode modern dan tenaga pengajar kompeten.',
    },
    {
        icon: 'users',
        title: 'Membina karakter islami',
        description: 'Melalui pembinaan intensif dan keteladanan dalam kehidupan sehari-hari.',
    },
    {
        icon: 'home',
        title: 'Menyediakan hunian nyaman',
        description: 'Fasilitas hunian yang mendukung fokus belajar dan kegiatan akademik.',
    },
    {
        icon: 'heart',
        title: 'Membangun lingkungan kondusif',
        description: 'Ekosistem belajar yang islami, aman, dan menyenangkan bagi seluruh peserta.',
    },
    {
        icon: 'award',
        title: 'Menyiapkan masa depan',
        description: 'Memberikan bekal akademik dan spiritual untuk meraih prestasi terbaik.',
    },
] as const;
