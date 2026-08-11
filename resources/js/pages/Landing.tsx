import { useEffect, useRef } from 'react';
import LandingLayout from '@/layouts/LandingLayout';
import { Hero } from '@/components/landing/Hero';
import { About } from '@/components/landing/About';
import { VisionMission } from '@/components/landing/VisionMission';
import { WhyChoose } from '@/components/landing/WhyChoose';
import { Programs } from '@/components/landing/Programs';
import { Gallery } from '@/components/landing/Gallery';
import { Contact } from '@/components/landing/Contact';
import { FAQ } from '@/components/landing/FAQ';
import type { ProgramKursus } from '@/types/models';

export default function Landing({
    programs,
    initialSection,
}: {
    programs: ProgramKursus[];
    initialSection?: string;
}) {
    const firstLoad = useRef(true);

    useEffect(() => {
        const anchors = (
            [
                ['beranda', '/'],
                ['tentang', '/tentang'],
                ['program', '/programs'],
                ['galeri', '/galeri'],
                ['kontak', '/kontak'],
            ] as const
        ).map(([id, route]) => ({
            route,
            el: document.getElementById(id),
        }));

        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const y = window.scrollY + 140;
                let current = { path: '/', url: window.location.origin };

                for (const a of anchors) {
                    if (a.el && a.el.offsetTop <= y) {
                        current = {
                            path: a.route,
                            url: a.route === '/' ? window.location.origin : a.route,
                        };
                    }
                }

                if (window.location.pathname !== current.path) {
                    history.replaceState(history.state, '', current.url);
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            const top = () => window.scrollTo(0, 0);
            top();
            requestAnimationFrame(top);
            const t = window.setTimeout(top, 150);
            return () => window.clearTimeout(t);
        }

        if (!initialSection) {
            window.scrollTo(0, 0);
            return;
        }

        const timer = window.setTimeout(() => {
            document.getElementById(initialSection)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 80);

        return () => window.clearTimeout(timer);
    }, [initialSection]);

    return (
        <LandingLayout>
            <Hero />
            <About />
            <VisionMission />
            <WhyChoose />
            <Programs programs={programs} />
            <Gallery />
            <FAQ />
            <Contact />
        </LandingLayout>
    );
}
