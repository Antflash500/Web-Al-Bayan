export interface StudentProfile {
    id: number;
    user_id: number;
    full_name: string;
    nim: string | null;
    nik: string | null;
    birth_date: string;
    gender: 'male' | 'female';
    phone: string | null;
    address: string | null;
    avatar: string | null;
    agreed_terms: boolean;
    registration_status: 'pending' | 'approved' | 'rejected';
}

export interface Program {
    id: number;
    name: string;
    slug: string;
    schedule: string;
    duration: string;
    description: string;
    thumbnail: string | null;
    is_active: boolean;
    sort_order: number;
}

export interface Gallery {
    id: number;
    title: string;
    image: string;
    description: string | null;
    sort_order: number;
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    published_at: string | null;
    is_active: boolean;
}

export interface KategoriProgram {
    id: number;
    nama_kategori: string;
    slug: string;
}

export interface ProgramKursus {
    id: number;
    kategori_program_id: number | null;
    nama_program: string;
    slug: string;
    deskripsi: string | null;
    thumbnail: string | null;
    cover: string | null;
    instruktur: string | null;
    tingkat: 'pemula' | 'menengah' | 'lanjutan';
    durasi_jam: number;
    jumlah_materi: number;
    status: 'aktif' | 'nonaktif' | 'draft';
    sort_order: number;
    harga?: number | string | null;
    requires_dorm?: boolean;
    kategori?: KategoriProgram | null;
    materi_list?: Materi[];
    materi_list_count?: number;
}

export interface Materi {
    id: number;
    program_id: number;
    judul: string;
    slug: string;
    deskripsi: string | null;
    urutan: number;
    estimasi_menit: number;
    status: 'aktif' | 'draft' | 'arsip';
    program?: Pick<ProgramKursus, 'id' | 'nama_program' | 'slug' | 'thumbnail'> | null;
    videos?: Video[];
    pdfs?: Pdf[];
    audios?: Audio[];
    quizes?: Quiz[];
    kontens?: MateriKonten[];
    gambar_url?: string | null;
    gambar_name?: string | null;
    gambar_size?: number | null;
    pdf_url?: string | null;
    pdf_name?: string | null;
    pdf_size?: number | null;
    video_url?: string | null;
    video_name?: string | null;
    video_size?: number | null;
}

export interface MateriKonten {
    id: number;
    materi_id: number;
    tipe: 'teks' | 'pdf' | 'video' | 'gambar' | 'video_link';
    judul: string | null;
    konten: string | null;
    url: string | null;
    file_path: string | null;
    file_name: string | null;
    file_size: number | null;
    urutan: number;
    status: 'aktif';
    media_url?: string | null;
}

export interface Video {
    id: number;
    judul_video: string;
    deskripsi: string | null;
    url_video: string;
    durasi: string | null;
    thumbnail: string | null;
}

export interface Pdf {
    id: number;
    judul_file: string;
    nama_file: string;
    ukuran_file: string | null;
    jumlah_halaman: number;
}

export interface Audio {
    id: number;
    judul_audio: string;
    nama_file: string;
    durasi: string | null;
}

export interface Quiz {
    id: number;
    judul: string;
    deskripsi: string | null;
    nilai_minimum: number;
    durasi_menit: number;
}

export interface Pengumuman {
    id: number;
    judul: string;
    isi: string;
    gambar: string | null;
    tanggal_publish: string | null;
    status: string;
}

export interface ContinueLearning {
    program: ProgramKursus;
    status: string;
    progress: number;
    lesson_terakhir?: string | null;
}

export interface Sertifikat {
    id: number;
    pengguna_id: number;
    program_id: number;
    nomor_sertifikat: string;
    tanggal_terbit: string | null;
    program?: Pick<ProgramKursus, 'id' | 'nama_program' | 'slug'> | null;
}

export interface BiodataSiswa {
    id: number;
    pengguna_id: number;
    nama_lengkap: string;
    nama_panggilan: string | null;
    jenis_kelamin: string;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    nomor_hp: string | null;
    alamat: string | null;
    nik?: string | null;
    kota: string | null;
    provinsi: string | null;
    foto: string | null;
    agreed_terms: boolean;
}

export interface Pengguna {
    id: number;
    email: string;
    username: string | null;
    password?: string;
    program_ids?: number[];
    role: 'siswa' | 'admin';
    status: 'aktif' | 'nonaktif' | 'ditangguhkan';
    email_terverifikasi: boolean;
    terakhir_login: string | null;
    created_at: string | null;
    biodata?: BiodataSiswa | null;
}

export interface SecuritySummary {
    login_sukses_7hari: number;
    login_gagal_7hari: number;
    diblokir_7hari: number;
    banned_aktif: number;
    ip_unik_7hari: number;
    pengguna_masuk_7hari: number;
}

export interface ActiveSession {
    session_id: string;
    user_id: number;
    nama: string;
    role: 'admin' | 'siswa';
    username: string | null;
    ip: string | null;
    browser: string | null;
    sistem_operasi: string | null;
    last_activity: string;
    is_current: boolean;
}

export interface SecurityLogEntry {
    id: number;
    tipe: string;
    nama: string;
    role: 'admin' | 'siswa' | null;
    ip: string | null;
    browser: string | null;
    sistem_operasi: string | null;
    keterangan: string | null;
    path: string | null;
    waktu: string;
}

export interface BannedIp {
    ip: string;
    reason: string | null;
    banned_at: string;
    remaining_minutes: number;
}

export interface PostureCheck {
    key: string;
    label: string;
    ok: boolean;
    value: string;
    hint: string;
}

export interface SecurityPosture {
    score: number;
    passed: number;
    total: number;
    checks: PostureCheck[];
}

export interface PortScanResult {
    port: number;
    layanan: string;
    risiko: 'rendah' | 'sedang' | 'tinggi' | 'kritis';
    status: 'terbuka' | 'tertutup';
}

export interface PortScan {
    host: string;
    scanned_at: string;
    open_count: number;
    total: number;
    results: PortScanResult[];
}

export interface ServerStatus {
    hostname: string;
    os: string;
    php: string;
    server: string;
    app_env: string;
    timezone: string;
    cpu_load: number | null;
    cpu_load_5: number | null;
    cpu_load_15: number | null;
    memory_total: number | null;
    memory_used: number | null;
    memory_percent: number | null;
    disk_total: number | null;
    disk_free: number | null;
    disk_percent: number | null;
    uptime: number | null;
}

export interface MetricPoint {
    id: number;
    recorded_at: string | null;
    cpu_load: number | null;
    memory_percent: number | null;
    disk_percent: number | null;
}

export interface DeviceSlice {
    label: string;
    count: number;
    percent: number;
}

export interface DeviceSummary {
    total: number;
    browsers: DeviceSlice[];
    oses: DeviceSlice[];
}

export interface SelfTestResult {
    bagian: string;
    label: string;
    payload: string;
    diblokir: boolean;
    penyebab: string | null;
}

export interface WafSelfTest {
    total: number;
    diblokir: number;
    results: SelfTestResult[];
}
