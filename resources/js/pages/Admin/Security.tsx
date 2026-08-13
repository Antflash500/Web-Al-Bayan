import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Activity,
    AlertTriangle,
    Ban,
    CheckCircle2,
    Clock,
    Cpu,
    Fingerprint,
    Globe,
    HardDrive,
    KeyRound,
    Lock,
    LogOut,
    Monitor,
    Network,
    Radio,
    RefreshCcw,
    ScanSearch,
    Server,
    ShieldAlert,
    ShieldCheck,
    ShieldX,
    Smartphone,
    Timer,
    Unlock,
    UserCheck,
    UserX,
    Users,
    XCircle,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import type {
    ActiveSession,
    BannedIp,
    DeviceSummary,
    MetricPoint,
    PortScan,
    PortScanResult,
    SecurityLogEntry,
    SecurityPosture,
    SecuritySummary,
    ServerStatus,
    WafSelfTest,
} from '@/types/models';

type Tab = 'ringkasan' | 'monitoring' | 'login' | 'ports' | 'firewall';

const TABS: { key: Tab; label: string; icon: typeof Activity }[] = [
    { key: 'ringkasan', label: 'Ringkasan', icon: Activity },
    { key: 'monitoring', label: 'Monitoring', icon: Server },
    { key: 'login', label: 'Aktivitas Login', icon: Fingerprint },
    { key: 'ports', label: 'Scanner Port', icon: ScanSearch },
    { key: 'firewall', label: 'Firewall IP', icon: ShieldCheck },
];

const RISK_TONE: Record<PortScanResult['risiko'], string> = {
    rendah: 'bg-secondary/10 text-secondary',
    sedang: 'bg-warning/10 text-warning',
    tinggi: 'bg-accent/10 text-accent',
    kritis: 'bg-danger/10 text-danger',
};

function fmtTime(iso: string | null | undefined): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function fmtBytes(bytes: number | null | undefined): string {
    if (bytes === null || bytes === undefined) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unit = 'B';
    for (const u of units) {
        value /= 1024;
        unit = u;
        if (value < 1024) break;
    }
    return `${value.toFixed(1)} ${unit}`;
}

function fmtUptime(seconds: number | null | undefined): string {
    if (seconds === null || seconds === undefined) return '—';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}h ${hours}j`;
    if (hours > 0) return `${hours}j ${minutes}m`;
    return `${minutes} mnt`;
}

function isMobile(os: string | null | undefined): boolean {
    return !!(os && /android|ios|ipad|iphone/i.test(os));
}

function RoleBadge({ role }: { role: SecurityLogEntry['role'] }) {
    if (!role) return null;
    return role === 'admin' ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            <ShieldCheck className="size-3" /> Admin
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
            <UserCheck className="size-3" /> Siswa
        </span>
    );
}

function StatusBadge({ tipe }: { tipe: string }) {
    const map: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
        login_sukses: { label: 'Berhasil', cls: 'bg-secondary/10 text-secondary', icon: CheckCircle2 },
        login_gagal: { label: 'Gagal', cls: 'bg-danger/10 text-danger', icon: XCircle },
        diblokir: { label: 'Diblokir', cls: 'bg-warning/10 text-warning', icon: ShieldX },
        banned: { label: 'Diban', cls: 'bg-danger/10 text-danger', icon: Ban },
        unbanned: { label: 'Di-unban', cls: 'bg-info/10 text-info', icon: Unlock },
        port_scan: { label: 'Port Scan', cls: 'bg-info/10 text-info', icon: Radio },
    };
    const item = map[tipe] ?? { label: tipe, cls: 'bg-surface text-muted', icon: AlertTriangle };
    const Icon = item.icon;
    return (
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', item.cls)}>
            <Icon className="size-3.5" /> {item.label}
        </span>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    tone = 'primary',
}: {
    icon: typeof Users;
    label: string;
    value: number | string;
    tone?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'muted';
}) {
    const tones = {
        primary: 'bg-primary text-white',
        success: 'bg-secondary/15 text-secondary',
        danger: 'bg-danger/10 text-danger',
        warning: 'bg-warning/10 text-warning',
        info: 'bg-info/10 text-info',
        muted: 'bg-surface text-muted',
    };
    return (
        <div className="rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
                <span className={cn('grid size-11 place-items-center rounded-xl', tones[tone])}>
                    <Icon className="size-5" />
                </span>
            </div>
            <p className="mt-4 font-display text-3xl text-foreground">{value}</p>
            <p className="text-sm text-muted">{label}</p>
        </div>
    );
}

function PosturePanel({ posture }: { posture: SecurityPosture }) {
    const ring = 2 * Math.PI * 44;
    const offset = ring - (posture.score / 100) * ring;

    return (
        <section aria-label="Skor keamanan" className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <div className="relative grid size-28 shrink-0 place-items-center">
                    <svg viewBox="0 0 100 100" className="size-28 -rotate-90">
                        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-surface)" strokeWidth="10" />
                        <circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={ring}
                            strokeDashoffset={offset}
                        />
                    </svg>
                    <span className="absolute font-display text-2xl text-foreground">{posture.score}</span>
                </div>
                <div>
                    <h2 className="font-display text-xl text-foreground">Skor Postur Keamanan</h2>
                    <p className="mt-1 max-w-md text-sm text-muted">
                        {posture.passed} dari {posture.total} kontrol standar menengah lulus. Skor dihitung dari
                        konfigurasi aktif saat ini.
                    </p>
                    {posture.score >= 80 ? (
                        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                            <ShieldCheck className="size-4" /> Bonafide — siap produksi
                        </p>
                    ) : posture.score >= 50 ? (
                        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                            <AlertTriangle className="size-4" /> Cukup — beberapa rekomendasi belum diterapkan
                        </p>
                    ) : (
                        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
                            <ShieldX className="size-4" /> Perlu peningkatan segera
                        </p>
                    )}
                </div>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {posture.checks.map((check) => (
                    <li
                        key={check.key}
                        className="flex items-start gap-3 rounded-xl border border-border bg-surface/40 p-4"
                    >
                        {check.ok ? (
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary" />
                        ) : (
                            <XCircle className="mt-0.5 size-5 shrink-0 text-danger" />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{check.label}</p>
                            <p className="text-xs text-muted">{check.value}</p>
                            {!check.ok && <p className="mt-1 text-xs text-danger">{check.hint}</p>}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function SessionsPanel({ sessions }: { sessions: ActiveSession[] }) {
    return (
        <section
            aria-label="Perangkat aktif"
            className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-soft"
        >
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                    <h2 className="flex items-center gap-2 font-semibold text-foreground">
                        <Monitor className="size-4 text-secondary" /> Perangkat Aktif (Sesi Login)
                    </h2>
                    <p className="mt-0.5 text-xs text-muted">
                        Browser, sistem operasi, dan IP dari tiap sesi yang masih aktif.
                    </p>
                </div>
                <span className="shrink-0 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                    <Users className="mr-1 inline size-3.5" />
                    {sessions.length} online
                </span>
            </div>
            {sessions.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-muted">
                    Tidak ada sesi aktif saat ini.
                </div>
            ) : (
                <ul className="divide-y divide-border">
                    {sessions.map((s) => (
                        <li key={s.session_id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                                {s.nama.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-medium text-foreground">{s.nama}</p>
                                    {s.is_current && (
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                            <Activity className="size-3" /> Sesi ini
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted">@{s.username ?? '-'}</p>
                            </div>
                            <div className="flex min-w-0 items-center gap-2">
                                {isMobile(s.sistem_operasi) ? (
                                    <Smartphone className="size-4 shrink-0 text-muted" />
                                ) : (
                                    <Monitor className="size-4 shrink-0 text-muted" />
                                )}
                                <div className="leading-tight">
                                    <p className="text-xs font-medium text-foreground">{s.browser ?? '—'}</p>
                                    <p className="text-xs text-muted">{s.sistem_operasi ?? '—'}</p>
                                </div>
                            </div>
                            {s.ip && (
                                <code className="rounded-md bg-surface px-2 py-1 text-xs text-foreground">{s.ip}</code>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted">
                                <Clock className="size-3.5" />
                                {fmtTime(s.last_activity)}
                            </div>
                            <RoleBadge role={s.role} />
                            {!s.is_current && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!confirm(`Cabut sesi milik ${s.nama} dari daftar perangkat?`)) return;
                                        router.post(
                                            '/admin/security/session/terminate',
                                            { session_id: s.session_id },
                                            { preserveScroll: true }
                                        );
                                    }}
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-button)] border border-danger/30 px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger hover:text-white"
                                    title="Cabut paksa perangkat ini"
                                >
                                    <LogOut className="size-3.5" /> Cabut
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function LoginHistoryTable({ history }: { history: SecurityLogEntry[] }) {
    return (
        <section className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-soft">
            <div className="border-b border-border px-5 py-4">
                <h2 className="flex items-center gap-2 font-semibold text-foreground">
                    <Fingerprint className="size-4 text-secondary" /> Riwayat Login
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                    IP, perangkat, dan waktu akses dashboard siswa / admin.
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-border bg-surface/60 text-xs uppercase tracking-wider text-muted">
                            <th scope="col" className="px-5 py-3.5 font-semibold">Pengguna</th>
                            <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
                            <th scope="col" className="px-5 py-3.5 font-semibold">IP</th>
                            <th scope="col" className="px-5 py-3.5 font-semibold">Perangkat</th>
                            <th scope="col" className="px-5 py-3.5 font-semibold">Waktu Akses</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {history.map((log) => (
                            <tr key={log.id} className="transition hover:bg-surface/40">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                                            {log.nama.charAt(0).toUpperCase()}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-foreground">{log.nama}</p>
                                            <RoleBadge role={log.role} />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <StatusBadge tipe={log.tipe} />
                                </td>
                                <td className="px-5 py-4">
                                    <code className="rounded-md bg-surface px-2 py-1 text-xs text-foreground">
                                        {log.ip ?? '—'}
                                    </code>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        {log.sistem_operasi &&
                                        /android|iphone|ipad/i.test(log.sistem_operasi) ? (
                                            <Smartphone className="size-4 text-muted" />
                                        ) : (
                                            <Monitor className="size-4 text-muted" />
                                        )}
                                        <div className="leading-tight">
                                            <p className="text-xs font-medium text-foreground">{log.browser}</p>
                                            <p className="text-xs text-muted">{log.sistem_operasi}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-xs text-muted">{fmtTime(log.waktu)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {history.length === 0 && (
                <div className="px-6 py-12 text-center text-sm text-muted">
                    Belum ada aktivitas login tercatat.
                </div>
            )}
        </section>
    );
}

function PortScanner() {
    const { portScan } = usePage<{ portScan?: PortScan | null }>().props;
    const [scanning, setScanning] = useState(false);

    const runScan = () => {
        setScanning(true);
        router.post('/admin/security/scan-ports', {}, {
            preserveScroll: true,
            onFinish: () => setScanning(false),
        });
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft xl:col-span-2">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="flex items-center gap-2 font-display text-xl text-foreground">
                            <ScanSearch className="size-5 text-secondary" /> Scanner Port Rentan
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            Periksa port layanan umum pada host server untuk mendeteksi pintu yang tidak semestinya
                            terbuka ke publik.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={runScan}
                        disabled={scanning}
                        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Radio className={cn('size-4', scanning && 'animate-pulse')} />
                        {scanning ? 'Memindai...' : 'Pindai Sekarang'}
                    </button>
                </div>

                {!portScan ? (
                    <div className="mt-8 grid place-items-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-14 text-center">
                        <Server className="size-10 text-muted" />
                        <p className="mt-3 font-display text-lg text-foreground">Belum ada pemindaian</p>
                        <p className="mt-1 max-w-sm text-sm text-muted">
                            Klik "Pindai Sekarang" untuk menjalankan pengecekan port pada host server.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 overflow-hidden rounded-xl border border-border">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/40 px-4 py-3">
                            <p className="flex items-center gap-2 text-xs text-muted">
                                <Globe className="size-3.5" /> Host: <code className="text-foreground">{portScan.host}</code>
                            </p>
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                                    portScan.open_count > 0
                                        ? 'bg-danger/10 text-danger'
                                        : 'bg-secondary/10 text-secondary'
                                )}
                            >
                                {portScan.open_count > 0 ? (
                                    <AlertTriangle className="size-3.5" />
                                ) : (
                                    <CheckCircle2 className="size-3.5" />
                                )}
                                {portScan.open_count} terbuka / {portScan.total} port ({fmtTime(portScan.scanned_at)})
                            </span>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border bg-surface/60 text-xs uppercase tracking-wider text-muted">
                                    <th scope="col" className="px-4 py-3 font-semibold">Port</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Layanan</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Risiko</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {portScan.results.map((p) => (
                                    <tr key={p.port} className="transition hover:bg-surface/40">
                                        <td className="px-4 py-3">
                                            <code className="rounded-md bg-surface px-2 py-1 text-xs text-foreground">
                                                {p.port}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-foreground">{p.layanan}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium capitalize', RISK_TONE[p.risiko])}>
                                                {p.risiko}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.status === 'terbuka' ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger">
                                                    <AlertTriangle className="size-3.5" /> Terbuka
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
                                                    <Lock className="size-3.5" /> Tertutup / Filtered
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
                <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
                    <ShieldAlert className="size-5 text-warning" /> Rekomendasi
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                    <li className="flex gap-2.5">
                        <KeyRound className="mt-0.5 size-4 shrink-0 text-secondary" />
                        Tutup port basis data (MySQL 3306, PostgreSQL 5432, Redis 6379, MongoDB 27017) agar tidak
                        dapat diakses dari internet.
                    </li>
                    <li className="flex gap-2.5">
                        <Lock className="mt-0.5 size-4 shrink-0 text-secondary" />
                        Batasi SSH (22) hanya untuk IP admin, dan gunakan key-based authentication.
                    </li>
                    <li className="flex gap-2.5">
                        <Server className="mt-0.5 size-4 shrink-0 text-secondary" />
                        Gunakan firewall OS (UFW/firewalld) untuk menolak port yang tidak dibutuhkan.
                    </li>
                    <li className="flex gap-2.5">
                        <Network className="mt-0.5 size-4 shrink-0 text-secondary" />
                        Arahkan traffic publik hanya lewat Nginx di port 80/443 di belakang Cloudflare.
                    </li>
                </ul>
            </section>
        </div>
    );
}

function FirewallPanel({ bannedIps, events }: { bannedIps: BannedIp[]; events: SecurityLogEntry[] }) {
    const [ip, setIp] = useState('');

    const submitBan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ip.trim()) return;
        router.post('/admin/security/ban', { ip: ip.trim() }, {
            onSuccess: () => setIp(''),
            preserveScroll: true,
        });
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-[var(--radius-card)] border border-border bg-white shadow-soft">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h2 className="flex items-center gap-2 font-semibold text-foreground">
                        <Ban className="size-4 text-danger" /> IP Diban Aktif
                    </h2>
                    <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-medium text-danger">
                        {bannedIps.length} aktif
                    </span>
                </div>

                <form onSubmit={submitBan} className="flex gap-2 border-b border-border px-5 py-4">
                    <input
                        type="text"
                        aria-label="IP baru untuk diblokir"
                        placeholder="Ban IP sementara, mis. 203.0.113.7"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        className="min-w-0 flex-1 rounded-[var(--radius-input)] border border-input bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                    />
                    <button
                        type="submit"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-button)] bg-danger px-4 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        <Ban className="size-4" /> Ban
                    </button>
                </form>

                {bannedIps.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <ShieldCheck className="mx-auto size-10 text-secondary" />
                        <p className="mt-3 font-display text-lg text-foreground">Tidak ada IP diban</p>
                        <p className="mt-1 text-sm text-muted">
                            IP akan otomatis diban saat melewati ambang firewall, atau dapat diblokir manual di atas.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-border">
                        {bannedIps.map((b) => (
                            <li key={b.ip} className="flex items-center gap-3 px-5 py-3.5">
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-danger/10 text-danger">
                                    <Ban className="size-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <code className="text-sm font-semibold text-foreground">{b.ip}</code>
                                    <p className="truncate text-xs text-muted">{b.reason ?? 'Tanpa alasan'}</p>
                                </div>
                                <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                                    <Timer className="size-3.5" /> {b.remaining_minutes} mnt
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post('/admin/security/unban', { ip: b.ip }, { preserveScroll: true })
                                    }
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-xs font-medium transition hover:bg-surface"
                                >
                                    <Unlock className="size-3.5" /> Unban
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-soft">
                <div className="border-b border-border px-5 py-4">
                    <h2 className="flex items-center gap-2 font-semibold text-foreground">
                        <Activity className="size-4 text-warning" /> Jejak Keamanan
                    </h2>
                    <p className="mt-0.5 text-xs text-muted">
                        Insiden diblokir, ban, unban, dan pemindaian port.
                    </p>
                </div>
                <ul className="divide-y divide-border">
                    {events.map((e) => (
                        <li key={e.id} className="px-5 py-3.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge tipe={e.tipe} />
                                <span className="text-sm">
                                    <span className="font-medium text-foreground">{e.nama}</span>
                                </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs text-muted">{e.keterangan}</p>
                            {e.ip && (
                                <code className="mt-1 inline-block rounded-md bg-surface px-2 py-0.5 text-[11px] text-foreground">
                                    {e.ip}
                                </code>
                            )}
                            <p className="mt-1 text-[11px] text-muted">{fmtTime(e.waktu)}</p>
                        </li>
                    ))}
                </ul>
                {events.length === 0 && (
                    <div className="px-6 py-12 text-center text-sm text-muted">
                        Belum ada insiden keamanan tercatat.
                    </div>
                )}
            </section>
        </div>
    );
}

function UsageBar({
    label,
    value,
    detail,
    tone = 'bg-secondary',
}: {
    label: string;
    value: number | null;
    detail?: string;
    tone?: string;
}) {
    const clamped = Math.max(0, Math.min(100, value ?? 0));

    return (
        <div>
            <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-muted">
                    {detail ?? (value === null ? 'N/A' : `${Math.round(value)}%`)}
                </span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface">
                <div
                    className={cn('h-full rounded-full transition-all', value === null ? 'bg-surface' : tone)}
                    style={{ width: `${clamped}%` }}
                />
            </div>
        </div>
    );
}

function loadTone(percent: number | null): string {
    if (percent === null) return 'bg-surface';
    if (percent >= 90) return 'bg-danger';
    if (percent >= 75) return 'bg-warning';
    return 'bg-secondary';
}

function MetricsChart({ history }: { history: MetricPoint[] }) {
    const points = history.slice(-60);

    if (points.length === 0) {
        return (
            <div className="grid place-items-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
                <Cpu className="size-10 text-muted" />
                <p className="mt-3 font-display text-lg text-foreground">Belum ada snapshot metrik</p>
                <p className="mt-1 max-w-sm text-sm text-muted">
                    Klik "Catat Snapshot" pada panel monitor, atau jalankan scheduler{' '}
                        <code className="rounded bg-surface px-1.5 py-0.5 text-xs">php artisan security:metrics</code>{' '}
                    agar grafik terisi otomatis setiap 5 menit.
                </p>
            </div>
        );
    }

    const fmtLabel = (iso: string | null) =>
        iso
            ? new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            : '—';

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Tren 24 jam terakhir</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary" /> CPU</span>
                    <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-secondary" /> Memori</span>
                    <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-warning" /> Disk</span>
                </div>
            </div>
            <div className="flex h-36 items-end gap-0.5">
                {points.map((p) => (
                    <div
                        key={p.id}
                        className="flex h-full flex-1 flex-col justify-end gap-0.5"
                        title={`${fmtLabel(p.recorded_at)} — CPU ${p.cpu_load ?? 'N/A'}, Mem ${p.memory_percent ?? 'N/A'}%, Disk ${p.disk_percent ?? 'N/A'}%`}
                    >
                        <div
                            className={cn('w-full rounded-t-[3px]', loadTone(p.cpu_load === null ? null : Math.min(100, p.cpu_load * 10)))}
                            style={{ height: `${Math.max(3, Math.min(100, (p.cpu_load ?? 0) * 10))}%` }}
                        />
                        <div
                            className={cn('w-full rounded-t-[3px]', loadTone(p.memory_percent))}
                            style={{ height: `${Math.max(3, Math.min(100, p.memory_percent ?? 0))}%` }}
                        />
                        <div
                            className={cn('w-full rounded-t-[3px]', loadTone(p.disk_percent))}
                            style={{ height: `${Math.max(3, Math.min(100, p.disk_percent ?? 0))}%` }}
                        />
                    </div>
                ))}
            </div>
            {points.length > 1 && (
                <div className="mt-2 flex justify-between text-[11px] text-muted">
                    <span>{fmtLabel(points[0].recorded_at)}</span>
                    <span>{fmtLabel(points[points.length - 1].recorded_at)}</span>
                </div>
            )}
        </div>
    );
}

function ServerMonitorPanel({ status, history }: { status: ServerStatus; history: MetricPoint[] }) {
    const [saving, setSaving] = useState(false);

    const saveSnapshot = () => {
        setSaving(true);
        router.post('/admin/security/monitor', {}, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const stats = [
        { label: 'Hostname', value: status.hostname, icon: Server },
        { label: 'Sistem Operasi', value: status.os, icon: HardDrive },
        { label: 'PHP / Server', value: `${status.php} · ${status.server || '—'}`, icon: Cpu },
        { label: 'Environment', value: status.app_env, icon: Activity },
        { label: 'Uptime', value: fmtUptime(status.uptime), icon: Clock },
        { label: 'Zona Waktu', value: status.timezone, icon: Globe },
        { label: 'CPU Load (1/5/15 mnt)', value: status.cpu_load !== null ? `${status.cpu_load} / ${status.cpu_load_5} / ${status.cpu_load_15}` : 'N/A', icon: Monitor },
    ];

    return (
        <section className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="flex items-center gap-2 font-display text-xl text-foreground">
                        <Server className="size-5 text-secondary" /> Monitoring Server
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                        Utilisasi CPU, memori, dan disk pada host saat ini beserta riwayat snapshot.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={saveSnapshot}
                    disabled={saving}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCcw className={cn('size-4', saving && 'animate-spin')} />
                    {saving ? 'Menyimpan...' : 'Catat Snapshot'}
                </button>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {stats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-border bg-surface/40 p-4">
                        <dt className="flex items-center gap-1.5 text-xs text-muted">
                            <Icon className="size-3.5" /> {label}
                        </dt>
                        <dd className="mt-1.5 truncate text-sm font-semibold text-foreground">{value}</dd>
                    </div>
                ))}
            </dl>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <UsageBar
                        label="Memori"
                        value={status.memory_percent}
                        detail={`${fmtBytes(status.memory_used)} dari ${fmtBytes(status.memory_total)}`}
                        tone={loadTone(status.memory_percent)}
                    />
                    <UsageBar
                        label="Penyimpanan Disk"
                        value={status.disk_percent}
                        detail={`${fmtBytes(status.disk_free)} tersisa dari ${fmtBytes(status.disk_total)}`}
                        tone={loadTone(status.disk_percent)}
                    />
                </div>
                <div className="rounded-xl border border-border bg-surface/40 p-4">
                    <MetricsChart history={history} />
                </div>
            </div>
        </section>
    );
}

function DevicePanel({ devices }: { devices: DeviceSummary }) {
    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
                            <Globe className="size-5 text-secondary" /> Peramban (7 hari)
                        </h2>
                        <p className="mt-0.5 text-xs text-muted">
                            Distribusi browser dari riwayat login masuk.
                        </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">
                        {devices.total} masuk
                    </span>
                </div>
                {devices.browsers.length === 0 ? (
                    <div className="mt-6 grid place-items-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
                        <Monitor className="size-10 text-muted" />
                        <p className="mt-3 text-sm text-muted">Belum ada data peramban.</p>
                    </div>
                ) : (
                    <div className="mt-5 space-y-4">
                        {devices.browsers.map((b) => (
                            <UsageBar
                                key={b.label}
                                label={b.label}
                                value={b.percent}
                                detail={`${b.count} (${b.percent}%)`}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
                            <Smartphone className="size-5 text-secondary" /> Sistem Operasi (7 hari)
                        </h2>
                        <p className="mt-0.5 text-xs text-muted">
                            Distribusi perangkat (mobile / desktop) dari riwayat login.
                        </p>
                    </div>
                </div>
                {devices.oses.length === 0 ? (
                    <div className="mt-6 grid place-items-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
                        <Smartphone className="size-10 text-muted" />
                        <p className="mt-3 text-sm text-muted">Belum ada data sistem operasi.</p>
                    </div>
                ) : (
                    <div className="mt-5 space-y-4">
                        {devices.oses.map((o) => (
                            <UsageBar
                                key={o.label}
                                label={o.label}
                                value={o.percent}
                                detail={`${o.count} (${o.percent}%)`}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function SelfTestPanel({ selfTest }: { selfTest?: WafSelfTest | null }) {
    const [running, setRunning] = useState(false);

    const runTest = () => {
        setRunning(true);
        router.post('/admin/security/self-test', {}, {
            preserveScroll: true,
            onFinish: () => setRunning(false),
        });
    };

    const blockedAll = selfTest ? selfTest.diblokir === selfTest.total : false;

    return (
        <section className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="flex items-center gap-2 font-display text-xl text-foreground">
                        <ScanSearch className="size-5 text-secondary" /> Self-Test Web Firewall
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                        Kirim payload serangan umum (SQLi, XSS, traversal, scanner) ke pemindai dan pastikan semuanya
                        diblokir.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={runTest}
                    disabled={running}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <ShieldAlert className={cn('size-4', running && 'animate-pulse')} />
                    {running ? 'Menguji...' : 'Jalankan Uji'}
                </button>
            </div>

            {selfTest ? (
                <>
                    <div
                        className={cn(
                            'mt-6 flex items-center gap-3 rounded-xl px-4 py-3',
                            blockedAll ? 'bg-secondary/10' : 'bg-warning/10'
                        )}
                    >
                        {blockedAll ? (
                            <CheckCircle2 className="size-5 shrink-0 text-secondary" />
                        ) : (
                            <AlertTriangle className="size-5 shrink-0 text-warning" />
                        )}
                        <p className="text-sm text-foreground">
                            <span className="font-semibold">{selfTest.diblokir} dari {selfTest.total}</span> payload
                            berhasil diblokir.
                        </p>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border bg-surface/60 text-xs uppercase tracking-wider text-muted">
                                    <th scope="col" className="px-4 py-3 font-semibold">Bagian</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Payload</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Hasil</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {selfTest.results.map((r) => (
                                    <tr key={`${r.bagian}-${r.label}`} className="transition hover:bg-surface/40">
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                                                {r.bagian}
                                            </span>
                                        </td>
                                        <td className="max-w-md px-4 py-3">
                                            <p className="truncate text-xs text-muted" title={r.payload}>
                                                <code className="text-xs text-foreground">{r.label}</code>
                                                <span className="ml-2 text-muted">{r.payload}</span>
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {r.diblokir ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
                                                    <CheckCircle2 className="size-3.5" /> Diblokir
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger">
                                                    <XCircle className="size-3.5" /> Lolos
                                                </span>
                                            )}
                                            {r.penyebab && (
                                                <p className="mt-0.5 text-[11px] text-muted">aturan: {r.penyebab}</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="mt-8 grid place-items-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-14 text-center">
                    <ShieldCheck className="size-10 text-muted" />
                    <p className="mt-3 font-display text-lg text-foreground">Belum pernah diuji</p>
                    <p className="mt-1 max-w-sm text-sm text-muted">
                        Klik "Jalankan Uji" untuk melihat hasil pindai firewall terhadap payload berbahaya.
                    </p>
                </div>
            )}
        </section>
    );
}

export default function Security({
    summary,
    sessions,
    serverStatus,
    metricsHistory,
    devices,
    selfTest,
    loginHistory,
    events,
    bannedIps,
    posture,
    flash,
}: {
    summary: SecuritySummary;
    sessions: ActiveSession[];
    serverStatus: ServerStatus;
    metricsHistory: MetricPoint[];
    devices: DeviceSummary;
    selfTest?: WafSelfTest | null;
    loginHistory: SecurityLogEntry[];
    events: SecurityLogEntry[];
    bannedIps: BannedIp[];
    posture: SecurityPosture;
    portScan?: PortScan | null;
    flash?: { success?: string; error?: string };
}) {
    const [tab, setTab] = useState<Tab>('ringkasan');

    return (
        <AdminLayout>
            <Head title="Admin | Keamanan" />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-display text-2xl text-foreground sm:text-3xl">Keamanan</h1>
                    <p className="mt-1 text-sm text-muted">
                        Pengawasan riwayat login, perangkat, monitoring server, firewall, dan standar keamanan situs.
                    </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    <ShieldCheck className="size-4" /> Skor keamanan: {posture.score}/100
                </span>
            </div>

            {flash?.success && (
                <p role="status" className="mt-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary">
                    {flash.success}
                </p>
            )}
            {flash?.error && (
                <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                    {flash.error}
                </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
                <StatCard icon={UserCheck} label="Login Berhasil (7h)" value={summary.login_sukses_7hari} tone="success" />
                <StatCard icon={UserX} label="Login Gagal (7h)" value={summary.login_gagal_7hari} tone="danger" />
                <StatCard icon={ShieldX} label="Diblokir (7h)" value={summary.diblokir_7hari} tone="warning" />
                <StatCard icon={Ban} label="IP Diban Aktif" value={summary.banned_aktif} tone="danger" />
                <StatCard icon={Globe} label="IP Unik (7h)" value={summary.ip_unik_7hari} tone="info" />
                <StatCard icon={Fingerprint} label="Masuk (7h)" value={summary.pengguna_masuk_7hari} tone="primary" />
            </div>

            <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Bagian keamanan">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={tab === key}
                        onClick={() => setTab(key)}
                        className={cn(
                            'inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] px-4 text-sm font-semibold transition',
                            tab === key
                                ? 'bg-primary text-white shadow-soft'
                                : 'border border-border bg-white text-muted hover:bg-surface hover:text-foreground'
                        )}
                    >
                        <Icon className="size-4" /> {label}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {tab === 'ringkasan' && (
                    <div className="space-y-6">
                        <PosturePanel posture={posture} />
                        <SessionsPanel sessions={sessions} />
                    </div>
                )}
                {tab === 'monitoring' && (
                    <div className="space-y-6">
                        <ServerMonitorPanel status={serverStatus} history={metricsHistory} />
                        <SelfTestPanel selfTest={selfTest} />
                        <DevicePanel devices={devices} />
                    </div>
                )}
                {tab === 'login' && <LoginHistoryTable history={loginHistory} />}
                {tab === 'ports' && <PortScanner />}
                {tab === 'firewall' && <FirewallPanel bannedIps={bannedIps} events={events} />}
            </div>
        </AdminLayout>
    );
}