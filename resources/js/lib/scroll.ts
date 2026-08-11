const SECTION_BY_ROUTE: Record<string, string | null> = {
    '/': 'beranda',
    '/tentang': 'tentang',
    '/programs': 'program',
    '/galeri': 'galeri',
    '/kontak': 'kontak',
};

/**
 * Smoothly scrolls to a landing section identified by its route path.
 * Used on the landing nav/footer so section clicks glide in-place
 * instead of performing a page navigation (no "refresh" feel).
 */
export function scrollToSection(route: string): void {
    const id = SECTION_BY_ROUTE[route];

    if (!id || id === 'beranda') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    window.location.assign(route);
}