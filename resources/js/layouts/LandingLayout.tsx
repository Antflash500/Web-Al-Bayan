import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default function LandingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-white">
            <Head title="Beranda">
                <meta
                    name="description"
                    content="Al Bayan Education menghadirkan pembelajaran Bahasa Arab serta hunian mahasiswa yang nyaman dalam satu lingkungan islami."
                />
            </Head>
            <Navbar />
            <main className="relative">{children}</main>
            <Footer />
        </div>
    );
}
