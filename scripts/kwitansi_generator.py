"""Kwitansi generator (non-interactive).

Dipanggil oleh aplikasi web (Laravel) dengan dua argumen:
    1. path ke file JSON berisi data kwitansi
    2. path output file PNG

Struktur JSON:
    {
        "template": "/abs/path/template_kwitansi.jpg",
        "font_custom": "/abs/path/font_template.otf",
        "font_regular": "/abs/path/arial.ttf",
        "font_bold": "/abs/path/arialbd.ttf",
        "recipient": "Nama Siswa",
        "amount": 4500000,
        "payment": "QRIS" | "Transfer",
        "programs": [1, 3],
        "receipt_number": 7,
        "day": 10,
        "month": 8,
        "output": "/abs/path/out.png"
    }
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import json
import sys

TEMPLATE_WIDTH, TEMPLATE_HEIGHT = 1600, 800

TEXT_COLOR = (35, 35, 35)
GREEN_COLOR = (0, 82, 48)
CUSTOM_GREEN = "#163923"

# Koordinat template (sama dengan generator_kwitansi.py)
POS_PENERIMA = (335, 288)
POS_UANG = (300, 398)
POS_TERBILANG = (298, 503)
POS_NOMOR = (1397, 160)
CHECK_QRIS = (366, 618)
CHECK_TRANSFER = (510, 618)
CHECK_PROGRAMS = [
    (1140, 271),
    (1140, 323),
    (1140, 376),
    (1140, 429),
    (1140, 482),
    (1140, 536),
]
POS_DATE = (1110, 617)

MONTHS = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]


def load_font(path, size, bold_path=None):
    if bold_path and not Path(path).exists():
        path = bold_path
    if Path(path).exists():
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def format_rupiah(amount):
    return "Rp " + f"{amount:,}".replace(",", ".")


def terbilang(number):
    angka = [
        "", "satu", "dua", "tiga", "empat", "lima",
        "enam", "tujuh", "delapan", "sembilan",
        "sepuluh", "sebelas"
    ]
    if number < 12:
        return angka[number]
    if number < 20:
        return terbilang(number - 10) + " belas"
    if number < 100:
        return terbilang(number // 10) + " puluh " + terbilang(number % 10)
    if number < 200:
        return "seratus " + terbilang(number - 100)
    if number < 1000:
        return terbilang(number // 100) + " ratus " + terbilang(number % 100)
    if number < 2000:
        return "seribu " + terbilang(number - 1000)
    if number < 1_000_000:
        return terbilang(number // 1000) + " ribu " + terbilang(number % 1000)
    if number < 2_000_000:
        return "satu juta " + terbilang(number - 1_000_000)
    if number < 1_000_000_000:
        return terbilang(number // 1_000_000) + " juta " + terbilang(number % 1_000_000)
    if number < 2_000_000_000:
        return "satu milyar " + terbilang(number - 1_000_000_000)
    if number < 1_000_000_000_000:
        return terbilang(number // 1_000_000_000) + " milyar " + terbilang(number % 1_000_000_000)
    return str(number)


def draw_check(draw, x, y):
    draw.line(
        [(x + 4, y + 11), (x + 9, y + 17), (x + 19, y + 4)],
        fill=GREEN_COLOR,
        width=3
    )


def split_terbilang(text, max_characters=76):
    if len(text) <= max_characters:
        return [text]
    first = text[:max_characters]
    pos = first.rfind(" ")
    if pos <= 0:
        pos = max_characters
    return [text[:pos].strip(), text[pos:].strip()]


def generate(data):
    for key in ("template", "font_custom", "font_regular", "font_bold"):
        if not Path(data[key]).exists():
            raise FileNotFoundError(f"File tidak ditemukan: {data[key]}")

    output_path = Path(data["output"])
    output_path.parent.mkdir(parents=True, exist_ok=True)

    image = Image.open(data["template"]).convert("RGB")
    if image.size != (TEMPLATE_WIDTH, TEMPLATE_HEIGHT):
        raise ValueError(
            f"Ukuran template harus {TEMPLATE_WIDTH}x{TEMPLATE_HEIGHT}. "
            f"Sekarang {image.width}x{image.height}."
        )

    draw = ImageDraw.Draw(image)

    font_recipient = load_font(data["font_regular"], 25)
    font_amount = load_font(data["font_bold"], 36, bold_path=data["font_regular"])
    font_terbilang = load_font(data["font_regular"], 21)
    font_custom_number = ImageFont.truetype(data["font_custom"], 21)
    font_custom_date = ImageFont.truetype(data["font_custom"], 20)

    # 1. Nama penerima
    recipient_text = data["recipient"].strip()
    if len(recipient_text) > 60:
        recipient_text = recipient_text[:57] + "..."
    draw.text(
        POS_PENERIMA,
        recipient_text,
        font=font_recipient,
        fill=TEXT_COLOR,
        anchor="ls"
    )

    # 2. Nominal
    amount = int(data["amount"])
    draw.text(
        POS_UANG,
        format_rupiah(amount),
        font=font_amount,
        fill=TEXT_COLOR,
        anchor="lm"
    )

    # 3. Terbilang
    words = terbilang(amount).strip()
    if words:
        words = words[0].upper() + words[1:]
    words += " rupiah"
    current_y = POS_TERBILANG[1]
    for line in split_terbilang(words)[:2]:
        draw.text(
            (POS_TERBILANG[0], current_y),
            line,
            font=font_terbilang,
            fill=TEXT_COLOR,
            anchor="ls"
        )
        current_y += 48

    # 4. Nomor kwitansi (4 digit saja, "AB/2026/" dari template)
    draw.text(
        POS_NOMOR,
        f"{int(data['receipt_number']):04d}",
        font=font_custom_number,
        fill=CUSTOM_GREEN,
        anchor="ls"
    )

    # 5. Metode pembayaran
    if data["payment"] == "QRIS":
        draw_check(draw, *CHECK_QRIS)
    elif data["payment"] == "Transfer":
        draw_check(draw, *CHECK_TRANSFER)

    # 6. Program yang dicentang
    for program_index in data.get("programs", []):
        index = int(program_index)
        if 1 <= index <= len(CHECK_PROGRAMS):
            draw_check(draw, *CHECK_PROGRAMS[index - 1])

    # 7. Tanggal + bulan
    day = int(data["day"])
    month = int(data["month"])
    month_name = MONTHS[month] if 1 <= month <= 12 else ""
    draw.text(
        POS_DATE,
        f"{day} {month_name}",
        font=font_custom_date,
        fill=CUSTOM_GREEN,
        anchor="ls"
    )

    image.save(data["output"], format="PNG")
    return data["output"]


def main():
    if len(sys.argv) < 3:
        print("Penggunaan: python kwitansi_generator.py <data.json> <output.png>")
        sys.exit(2)

    try:
        data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8-sig"))
        data["output"] = sys.argv[2]
        generate(data)
    except Exception as error:
        print("KWITANSI ERROR:", error)
        sys.exit(1)


if __name__ == "__main__":
    main()