import { Globe, Mail, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react';
import { PROGRAMS, SITE } from '@/lib/constants';
import { scrollToSection } from '@/lib/scroll';

const QUICK_LINKS = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang Kami', href: '/tentang' },
    { label: 'Program', href: '/programs' },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Kontak', href: '/kontak' },
];

export function Footer() {
    return (
        <footer className="bg-primary text-white">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={SITE.logo}
                                alt={`Logo ${SITE.name}`}
                                className="h-10 w-10 rounded-full object-cover"
                                width={40}
                                height={40}
                            />
                            <span className="font-display text-xl">{SITE.name}</span>
                        </div>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
                            Lembaga pendidikan Bahasa Arab dengan hunian mahasiswa yang nyaman dalam
                            lingkungan islami yang kondusif.
                        </p>
                        <div className="mt-6 flex gap-3">
                            {[Globe, Share2, MessageCircle].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    aria-label="Media sosial"
                                    className="grid size-10 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-secondary hover:text-white"
                                >
                                    <Icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                            Quick Link
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(link.href);
                                        }}
                                        className="text-sm text-white/70 transition hover:text-secondary"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                            Program
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {PROGRAMS.slice(0, 5).map((program) => (
                                <li key={program.name}>
                                    <a
                                        href="/programs"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection('/programs');
                                        }}
                                        className="text-sm text-white/70 transition hover:text-secondary"
                                    >
                                        {program.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                            Kontak
                        </h3>
                        <ul className="mt-4 space-y-4 text-sm text-white/70">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" />
                                <span>
                                    {SITE.address.street}
                                    <br />
                                    {SITE.address.city}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="size-4 shrink-0 text-secondary" />
                                <a
                                    href="tel:082332620365"
                                    className="transition hover:text-secondary"
                                >
                                    {SITE.phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircle className="size-4 shrink-0 text-secondary" />
                                <a
                                    href={SITE.whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition hover:text-secondary"
                                >
                                    {SITE.whatsapp}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="size-4 shrink-0 text-secondary" />
                                <a
                                    href={`mailto:${SITE.email}`}
                                    className="transition hover:text-secondary"
                                >
                                    {SITE.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                    <p className="text-sm text-white/50">
                        © {new Date().getFullYear()} {SITE.name}. Hak cipta dilindungi.
                    </p>
                    <div className="flex gap-6 text-sm text-white/50">
                        <a href="#" className="transition hover:text-secondary">
                            Kebijakan Privasi
                        </a>
                        <a href="#" className="transition hover:text-secondary">
                            Syarat & Ketentuan
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
