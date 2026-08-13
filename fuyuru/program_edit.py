from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import re

# ============================================================
# GENERATOR BIODATA SISWA - AL-BAYAN EDUCATION
# TEMPLATE : program_6.png
# UKURAN   : 1055 x 1491 px
#
# PENTING:
# - program_6.png adalah BACKGROUND/TEMPLATE KOSONG.
# - User mengisi data secara manual melalui terminal.
# - x dan y pada konfigurasi di bawah adalah POSISI POJOK KIRI ATAS
#   area teks, bukan baseline.
# - Layout, ukuran, font dan background mengikuti template.
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
TEMPLATE = BASE_DIR / "program_6.png"
OUTPUT_DIR = BASE_DIR / "hasil_biodata"
OUTPUT_DIR.mkdir(exist_ok=True)

TEMPLATE_WIDTH = 1055
TEMPLATE_HEIGHT = 1491
TEXT_COLOR = (28, 28, 28)

# ============================================================
# ISI DATA SESUAI KEBUTUHAN
# Nilai ini menjadi default ketika user menekan Enter.
# ============================================================

DATA = {
    "teks_1": "Teks 1",
    "teks_2": "Teks 2",
    "teks_3": "Teks 3",
    "teks_4": "Teks 4",
    "teks_5": "Teks 5",
    "teks_6": "Teks 6",
    "teks_7": "Teks 7",
    "teks_8": "Teks 8",
    "teks_9": "Teks 9",
    "teks_10": "Teks 10",
    "teks_11": "Teks 11",
    "teks_12": "Teks 12",
    "teks_13": "Teks 13",
    "teks_14": "Teks 14",
    "teks_15": "Teks 15",
    "teks_16": "Teks 16",
    "teks_17": "Teks 17",
    "teks_18": "Teks 18",
    "teks_19": "Teks 19",
    "teks_20": "Teks 20",
    "teks_21": "Teks 21",
    "teks_22": "Teks 22",
    "teks_23": "Teks 23",
    "teks_24": "Teks 24",
    "teks_25": "Teks 25",
    "teks_26": "Teks 26",
    "teks_27": "Teks 27",
    "teks_28": "Teks 28",
    "teks_29": "Teks 29",
    "teks_30": "Teks 30",
    "teks_31": "Teks 31",
    "teks_32": "Teks 32",
    "teks_33": "Teks 33",
    "teks_34": "Teks 34",
    "teks_35": "Teks 35",
    "teks_36": "Teks 36",
    "teks_37": "Teks 37",
    "teks_38": "Teks 38",
}

# ============================================================
# FONT
# Tetap menggunakan font regular dari generator asli.
# ============================================================

WINDOWS_REGULAR_FONTS = [
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\calibri.ttf",
    r"C:\Windows\Fonts\tahoma.ttf",
]

LINUX_REGULAR_FONTS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
]


def load_font(size):
    for path in WINDOWS_REGULAR_FONTS + LINUX_REGULAR_FONTS:
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
# LABEL INPUT USER
# ============================================================

FIELD_LABELS = {
    "teks_1": "Nama Lengkap",
    "teks_2": "NIK",
    "teks_3": "Tanggal Lahir",
    "teks_4": "Jenis Kelamin",
    "teks_5": "Nomor HP / WhatsApp",
    "teks_6": "Alamat Lengkap",
    "teks_11": "Nama Ayah",
    "teks_12": "Alamat Ayah",
    "teks_15": "Pekerjaan Ayah",
    "teks_16": "Nomor HP Ayah",
    "teks_17": "Nama Ibu",
    "teks_18": "Alamat Ibu",
    "teks_21": "Pekerjaan Ibu",
    "teks_22": "Nomor HP Ibu",
    "teks_23": "Nama Program 1",
    "teks_24": "Nama Program 2",
    "teks_25": "Nama Program 3",
    "teks_26": "Nama Program 4",
    "teks_27": "Nama Program 5",
    "teks_28": "Nama Program 6",
    "teks_29": "Status Program 1",
    "teks_30": "Status Program 2",
    "teks_31": "Status Program 3",
    "teks_32": "Status Program 4",
    "teks_33": "Status Program 5",
    "teks_34": "Status Program 6",
    "teks_35": "Rumah",
    "teks_36": "Kamar",
    "teks_37": "Ranjang",
    "teks_38": "Kasur",
}


# Hanya field yang memang mempunyai koordinat pada layout yang diberikan.
RENDERED_FIELDS = list(FIELDS.keys()) + list(MULTILINE_FIELDS.keys())


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

    # x,y = TOP-LEFT, sesuai koordinat yang diberikan.
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

    # Fallback, tetap jangan melebihi jumlah baris.
    return lines[:max_lines]


def draw_multiline(draw, text, positions):
    text = str(text).strip()

    if not text:
        return

    lines = split_text(draw, text, positions)

    for line, config in zip(lines, positions):
        draw_value(draw, line, config)


# ============================================================
# INPUT MANUAL
# ============================================================

def ask(field_name):
    label = FIELD_LABELS.get(
        field_name,
        field_name.replace("_", " ").title()
    )

    default = DATA[field_name]

    value = input(f"{label} [{default}]: ").strip()

    return value if value else default


def input_data():
    print()
    print("=" * 72)
    print("                 BIODATA SISWA")
    print("                AL-BAYAN EDUCATION")
    print("=" * 72)
    print("Isi data secara manual.")
    print("Tekan ENTER jika ingin memakai nilai default.")
    print()

    data = DATA.copy()

    # Hanya meminta field yang benar-benar tampil pada template.
    for field_name in RENDERED_FIELDS:
        data[field_name] = ask(field_name)

    return data


# ============================================================
# GENERATE
# ============================================================

def generate_biodata(data):
    if not TEMPLATE.exists():
        raise FileNotFoundError(
            f"Template tidak ditemukan:\n{TEMPLATE}\n\n"
            "Letakkan file program_6.png satu folder dengan "
            "file Python ini."
        )

    img = Image.open(TEMPLATE).convert("RGBA")

    if img.size != (TEMPLATE_WIDTH, TEMPLATE_HEIGHT):
        raise ValueError(
            "Ukuran program_6.png harus "
            f"{TEMPLATE_WIDTH}x{TEMPLATE_HEIGHT}px. "
            f"Ukuran file saat ini: {img.size[0]}x{img.size[1]}px."
        )

    draw = ImageDraw.Draw(img)

    # Single-line
    for field_name, config in FIELDS.items():
        draw_value(
            draw,
            data.get(field_name, ""),
            config,
        )

    # Multiline
    for field_name, positions in MULTILINE_FIELDS.items():
        draw_multiline(
            draw,
            data.get(field_name, ""),
            positions,
        )

    filename = (
        "biodata_"
        + safe_filename(data.get("teks_1", "tanpa_nama"))
        + ".png"
    )

    output_file = OUTPUT_DIR / filename
    img.save(output_file, format="PNG")

    return output_file


def safe_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', "_", str(name))
    return re.sub(r"\s+", "_", name.strip()) or "tanpa_nama"


# ============================================================
# MAIN
# ============================================================

def main():
    try:
        data = input_data()
        output_file = generate_biodata(data)

        print()
        print("=" * 72)
        print("              BIODATA BERHASIL DIBUAT")
        print("=" * 72)
        print(f"Nama    : {data['teks_1']}")
        print(f"Program : {data['teks_23']}")
        print(f"Asrama  : {data['teks_35']}")
        print(f"File    : {output_file}")
        print("=" * 72)

    except Exception as error:
        print()
        print("=" * 72)
        print("                 GAGAL MEMBUAT")
        print("=" * 72)
        print(error)
        print("=" * 72)


if __name__ == "__main__":
    main()
