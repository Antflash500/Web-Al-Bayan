import { Head, Link } from '@inertiajs/react';
import { Award, ArrowRight } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';
import { EmptyState } from '@/pages/Portal/parts';
import type { Sertifikat } from '@/types/models';

export default function PortalSertifikat({
    certificates,
}: {
    certificates: Sertifikat[];
}) {
    return (
        <StudentPortalLayout>
            <Head title="Sertifikat" />
            <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <h1 className="font-display text-3xl text-foreground sm:text-4xl">Sertifikat</h1>
                <p className="mt-2 max-w-xl text-muted">
                    Sertifikat terbit otomatis setelah Anda menyelesaikan seluruh materi dan lulus
                    evaluasi program.
                </p>

                <div className="mt-8">
                    {certificates.length === 0 ? (
                        <EmptyState
                            title="Belum Ada Sertifikat"
                            description="Anda belum menyelesaikan program pembelajaran. Lanjutkan belajar untuk meraih sertifikat pertama Anda."
                            actionHref="/program"
                            actionLabel="Lanjut Belajar"
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {certificates.map((c) => (
                                <div
                                    key={c.id}
                                    className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft"
                                >
                                    <span className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
                                        <Award className="size-6" />
                                    </span>
                                    <h2 className="mt-4 font-display text-lg text-foreground">
                                        {c.program?.nama_program}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted">{c.nomor_sertifikat}</p>
                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <span className="text-xs text-muted">
                                            {c.tanggal_terbit
                                                ? new Date(c.tanggal_terbit).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          day: 'numeric',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      }
                                                  )
                                                : '—'}
                                        </span>
                                        <Link
                                            href="#"
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-secondary"
                                        >
                                            Unduh <ArrowRight className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StudentPortalLayout>
    );
}