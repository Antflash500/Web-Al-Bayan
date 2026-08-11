export function cropSquare(file: Blob, maxSize = 800): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            const side = Math.min(img.naturalWidth, img.naturalHeight);
            if (side <= 0) return reject(new Error('Invalid image'));
            const size = Math.min(maxSize, side);
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas tidak didukung'));
            const sx = (img.naturalWidth - side) / 2;
            const sy = (img.naturalHeight - side) / 2;
            ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
            canvas.toBlob(
                (b) => (b ? resolve(b) : reject(new Error('Gagal mengompres gambar'))),
                'image/jpeg',
                0.85
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Gagal memuat gambar'));
        };
        img.src = url;
    });
}

export function mediaUrl(src: string | null | undefined): string {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('/media')) return src;
    const name = src.split('/').pop();
    if (!name) return '';
    return `/media/programs/${name}`;
}