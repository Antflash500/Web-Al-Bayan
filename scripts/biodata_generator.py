"""Generator biodata siswa (non-interactive).

Dipanggil oleh aplikasi web (Laravel) dengan dua argumen:
    1. path ke file JSON berisi data biodata
    2. path output file PNG

Struktur JSON:
    {
        "template": "/abs/path/template_biodata.png",
        "font_regular": "/abs/path/arial.ttf",
        "output": "/abs/path/out.png",
        "teks_1": "Nama Lengkap",
        "teks_2": "NIK",
        "teks_3": "Tanggal Lahir",
        "teks_4": "Jenis Kelamin",
        "teks_5": "Nomor HP",
        "teks_6": "Alamat Lengkap",
        "teks_11": "Nama Ayah",
        "teks_12": "Alamat Ayah",
        "teks_15": "Pekerjaan Ayah",
        "teks_16": "Nomor HP Ayah",
        "teks_17": "Nama Ibu",
        "teks_18": "Alamat Ibu",
        "teks_21": "Pekerjaan Ibu",
        "teks_22": "Nomor HP Ibu",
        "teks_23".."teks_28": "Nama Program 1..6",
        "teks_29".."teks_34": "Status Program 1..6",
        "teks_35": "Rumah",
        "teks_36": "Kamar",
        "teks_37": "Ranjang",
        "teks_38": "Kasur"
    }

Koordinat, font, dan ukuran mengikuti template program.png (1055x1491).
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import json
import sys

TEMPLATE_WIDTH = 1055
TEMPLATE_HEIGHT = 1491
TEXT_COLOR = (28, 28, 28)

WINDOWS_REGULAR_FONTS = [
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\calibri.ttf",
    r"C:\Windows\Fonts\tahoma.ttf",
]

LINUX_REGULAR_FONTS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
]

# Isi ulang setiap pemanggilan generate() berdasarkan font_regular di payload.
_FONT_CANDIDATES = []


def load_font(size):
    for path in _FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)

    return ImageFont.load_default()


# ============================================================
# SINGLE LINE FIELDS
# x,y = POJOK KIRI ATAS area teks
# ============================================================

FIELDS = {
    "teks_1": {"x":257,"y":452,"w":229,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_2": {"x":257,"y":504,"w":228,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_3": {"x":257,"y":570,"w":229,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_4": {"x":257,"y":633,"w":230,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_5": {"x":778,"y":451,"w":213,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_11": {"x":231,"y":811,"w":236,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_15": {"x":230,"y":948,"w":236,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_16": {"x":230,"y":983,"w":232,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_17": {"x":713,"y":812,"w":250,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_21": {"x":712,"y":947,"w":253,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_22": {"x":712,"y":982,"w":252,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_23": {"x":272,"y":1076,"w":327,"h":28,"size":18,"font":"Arial","align":"left"},
    "teks_24": {"x":273,"y":1108,"w":329,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_25": {"x":273,"y":1139,"w":326,"h":30,"size":18,"font":"Arial","align":"left"},
    "teks_26": {"x":273,"y":1169,"w":324,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_27": {"x":273,"y":1201,"w":322,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_28": {"x":273,"y":1232,"w":323,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_29": {"x":814,"y":1076,"w":182,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_30": {"x":814,"y":1107,"w":181,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_31": {"x":814,"y":1138,"w":181,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_32": {"x":814,"y":1170,"w":181,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_33": {"x":814,"y":1201,"w":181,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_34": {"x":814,"y":1233,"w":181,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_35": {"x":169,"y":1334,"w":101,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_36": {"x":418,"y":1335,"w":97,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_37": {"x":665,"y":1334,"w":97,"h":32,"size":18,"font":"Arial","align":"left"},
    "teks_38": {"x":892,"y":1335,"w":97,"h":32,"size":18,"font":"Arial","align":"left"},
}

# ============================================================
# MULTILINE FIELDS
# Semua x,y di sini juga POJOK KIRI ATAS.
# ============================================================

MULTILINE_FIELDS = {
    "teks_6": [
        {"x":778,"y":504,"w":209,"h":32,"size":18,"font":"Arial","align":"left"},
        {"x":575,"y":548,"w":422,"h":32,"size":18,"font":"Arial","align":"left"},
        {"x":575,"y":578,"w":420,"h":32,"size":18,"font":"Arial","align":"left"},
        {"x":575,"y":608,"w":421,"h":32,"size":18,"font":"Arial","align":"left"},
        {"x":575,"y":635,"w":420,"h":32,"size":18,"font":"Arial","align":"left"},
    ],
    "teks_12": [
        {"x":231,"y":843,"w":236,"h":27,"size":18,"font":"Arial","align":"left"},
        {"x":231,"y":865,"w":238,"h":25,"size":18,"font":"Arial","align":"left"},
        {"x":231,"y":889,"w":237,"h":24,"size":18,"font":"Arial","align":"left"},
    ],
    "teks_18": [
        {"x":712,"y":844,"w":253,"h":32,"size":18,"font":"Arial","align":"left"},
        {"x":712,"y":866,"w":252,"h":27,"size":18,"font":"Arial","align":"left"},
        {"x":712,"y":890,"w":252,"h":27,"size":18,"font":"Arial","align":"left"},
    ],
}


# ============================================================
# TEXT UTILITIES
# ============================================================

def text_size(draw, text, font):
    box = draw.textbbox((0, 0), str(text), font=font)
    return box[2] - box[0], box[3] - box[1]


def fit_font(draw, text, max_width, max_height, start_size=18, min_size=10):
    text = str(text)

    for size in range(start_size, min_size - 1, -1):
        font = load_font(size)
        width, height = text_size(draw, text, font)

        if width <= max_width and height <= max_height:
            return font

    return load_font(min_size)


def draw_value(draw, text, config):
    if text is None:
        return

    text = str(text).strip()

    if not text:
        return

    font = fit_font(
        draw,
        text,
        max_width=config["w"],
        max_height=config["h"],
        start_size=config.get("size", 18),
        min_size=10,
    )

    draw.text(
        (config["x"], config["y"]),
        text,
        font=font,
        fill=TEXT_COLOR,
    )


def split_text(draw, text, positions):
    text = " ".join(str(text).split())

    if not text:
        return []

    max_lines = len(positions)

    for size in range(18, 9, -1):
        font = load_font(size)
        lines = []
        current = ""

        for word in text.split():
            candidate = word if not current else current + " " + word
            width, _ = text_size(draw, candidate, font)

            current_width = positions[len(lines)]["w"] if len(lines) < max_lines else positions[-1]["w"]

            if width <= current_width:
                current = candidate
            else:
                if current:
                    lines.append(current)

                if len(lines) >= max_lines:
                    break

                current = word

        if current and len(lines) < max_lines:
            lines.append(current)

        if len(lines) <= max_lines:
            return lines

    return lines[:max_lines]


def draw_multiline(draw, text, positions):
    if text is None:
        return

    text = str(text).strip()

    if not text:
        return

    lines = split_text(draw, text, positions)

    for line, config in zip(lines, positions):
        draw_value(draw, line, config)


def generate(data):
    template_path = Path(data["template"])
    if not template_path.exists():
        raise FileNotFoundError(f"File tidak ditemukan: {template_path}")

    output_path = Path(data["output"])
    output_path.parent.mkdir(parents=True, exist_ok=True)

    image = Image.open(template_path).convert("RGBA")
    if image.size != (TEMPLATE_WIDTH, TEMPLATE_HEIGHT):
        raise ValueError(
            f"Ukuran template harus {TEMPLATE_WIDTH}x{TEMPLATE_HEIGHT}. "
            f"Sekarang {image.width}x{image.height}."
        )

    global _FONT_CANDIDATES
    font_bold = str(data.get("font_bold") or "")
    font_regular = str(data.get("font_regular") or "")
    _FONT_CANDIDATES = (
        ([font_bold] if font_bold else [])
        + ([font_regular] if font_regular else [])
        + WINDOWS_REGULAR_FONTS
        + LINUX_REGULAR_FONTS
    )

    draw = ImageDraw.Draw(image)

    for field_name, config in FIELDS.items():
        draw_value(draw, data.get(field_name, ""), config)

    for field_name, positions in MULTILINE_FIELDS.items():
        draw_multiline(draw, data.get(field_name, ""), positions)

    image.save(str(output_path), format="PNG")
    return str(output_path)


def main():
    if len(sys.argv) < 3:
        print("Penggunaan: python biodata_generator.py <data.json> <output.png>")
        sys.exit(2)

    try:
        data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8-sig"))
        data["output"] = sys.argv[2]
        generate(data)
    except Exception as error:
        print("BIODATA ERROR:", error)
        sys.exit(1)


if __name__ == "__main__":
    main()