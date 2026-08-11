import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { Reveal } from '@/components/share-motion';
import { SectionHeader } from '@/components/landing/SectionHeader';

const CONTACTS = [
    {
        icon: MapPin,
        label: 'Alamat',
        value: `${SITE.address.street}, ${SITE.address.city}`,
        href: SITE.mapsUrl,
    },
    { icon: Phone, label: 'Telepon', value: SITE.phone, href: 'tel:082332620365' },
    {
        icon: MessageCircle,
        label: 'WhatsApp',
        value: SITE.whatsapp,
        href: SITE.whatsappUrl,
    },
    { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Clock, label: 'Jam Operasional', value: 'Senin – Sabtu, 08.00 – 20.00 WIB' },
];

export function Contact() {
    return (
        <section id="kontak" className="scroll-mt-24 bg-white py-24 sm:py-32">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
                <SectionHeader
                    title="Hubungi Kami"
                    description="Informasi pendaftaran dan layanan lainnya selalu terbuka untuk Anda."
                />

                <div className="mt-14 grid gap-12 border-t border-border pt-12 lg:grid-cols-2 lg:gap-20">
                    <div className="divide-y divide-border">
                        {CONTACTS.map((c) => {
                            const Icon = c.icon;
                            const inner = (
                                <>
                                    <Icon className="size-5 shrink-0 text-secondary" />
                                    <div>
                                        <p className="text-sm font-medium text-muted">{c.label}</p>
                                        <p className="mt-0.5 font-medium text-foreground">
                                            {c.value}
                                        </p>
                                    </div>
                                </>
                            );
                            return c.href ? (
                                <a
                                    key={c.label}
                                    href={c.href}
                                    target={c.href.startsWith('http') ? '_blank' : undefined}
                                    rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                                    className="flex items-center gap-5 py-6 transition-colors hover:text-primary"
                                >
                                    {inner}
                                </a>
                            ) : (
                                <div key={c.label} className="flex items-center gap-5 py-6">
                                    {inner}
                                </div>
                            );
                        })}
                    </div>

                    <Reveal delay={0.1}>
                        <div className="overflow-hidden rounded-[20px] border border-border shadow-soft">
                            <iframe
                                title={`Lokasi ${SITE.name}`}
                                src="https://www.google.com/maps?q=Jember%2C%20Jawa%20Timur&output=embed"
                                className="h-full min-h-[360px] w-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
