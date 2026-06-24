from __future__ import annotations

import json
import re
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DESKTOP = Path.home() / "OneDrive" / "Desktop"
DATA_DIR = ROOT / "data"
OUTPUT = ROOT / "data" / "aishe-institutions.json"
WEBSITE_OVERRIDES = ROOT / "data" / "website-overrides.json"


def source_path(filename: str) -> Path:
    local = DATA_DIR / filename
    return local if local.exists() else DESKTOP / filename

SOURCES = [
    {
        "path": source_path("College-ALL COLLEGE (1).xlsx"),
        "sourceType": "College",
        "fieldMap": {
            "Aishe Code": "id",
            "Name": "name",
            "State": "state",
            "District": "district",
            "Website": "website",
            "Year Of Establishment": "yearEstablished",
            "College Type": "institutionType",
            "Manegement": "managementType",
            "University Type": "universityType",
        },
    },
    {
        "path": source_path("University-ALL UNIVERSITIES.xlsx"),
        "sourceType": "University",
        "fieldMap": {
            "Aishe Code": "id",
            "Name": "name",
            "State": "state",
            "District": "district",
            "Website": "website",
            "Year Of Establishment": "yearEstablished",
        },
    },
    {
        "path": source_path("Standalone-ALL STANDALONE.xlsx"),
        "sourceType": "Standalone",
        "fieldMap": {
            "Aishe Code": "id",
            "Name": "name",
            "State": "state",
            "District": "district",
            "Year Of Establishment": "yearEstablished",
            "Standalone Type": "institutionType",
            "Manegement": "managementType",
        },
    },
]

NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

CATEGORY_RULES = [
    ("Engineering", re.compile(r"\b(engineering|technology|iit|nit|iiit|polytechnic)\b", re.I)),
    ("Medical", re.compile(r"\b(medical|health sciences|nursing)\b", re.I)),
    ("Pharmacy", re.compile(r"\b(pharmacy|pharmaceutical)\b", re.I)),
    ("Management", re.compile(r"\b(management|business school|mba)\b", re.I)),
    ("Law", re.compile(r"\b(law|legal)\b", re.I)),
    ("Agriculture", re.compile(r"\b(agriculture|agricultural)\b", re.I)),
]


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "").replace("\u00a0", " ")).strip()


def shared_strings(zf: ZipFile) -> list[str]:
    try:
        root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return ["".join(t.text or "" for t in item.findall(".//a:t", NS)) for item in root.findall("a:si", NS)]


def column_index(cell_ref: str) -> int:
    letters = "".join(ch for ch in cell_ref if ch.isalpha())
    index = 0
    for letter in letters:
        index = index * 26 + ord(letter.upper()) - 64
    return index - 1


def cell_text(cell: ET.Element, strings: list[str]) -> str:
    value = cell.find("a:v", NS)
    if value is None:
        inline = cell.find("a:is", NS)
        if inline is None:
            return ""
        return clean("".join(t.text or "" for t in inline.findall(".//a:t", NS)))
    raw = value.text or ""
    if cell.attrib.get("t") == "s":
        return clean(strings[int(raw)]) if raw.isdigit() and int(raw) < len(strings) else ""
    return clean(raw)


def worksheet_path(zf: ZipFile) -> str:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    first_sheet = workbook.find("a:sheets/a:sheet", NS)
    if first_sheet is None:
        raise RuntimeError("Workbook has no sheets")
    rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}
    rel_id = first_sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
    return "xl/" + rel_map[rel_id].lstrip("/")


def rows_from_xlsx(path: Path) -> list[list[str]]:
    with ZipFile(path) as zf:
        strings = shared_strings(zf)
        root = ET.fromstring(zf.read(worksheet_path(zf)))
        rows: list[list[str]] = []
        for row in root.findall("a:sheetData/a:row", NS):
            values: list[str] = []
            for cell in row.findall("a:c", NS):
                index = column_index(cell.attrib.get("r", "A1"))
                while len(values) < index:
                    values.append("")
                values.append(cell_text(cell, strings))
            rows.append(values)
        return rows


def normalize_website(value: str) -> str:
    site = clean(value)
    if not site or site in {"-", "--", "NA", "N/A", "Nil", "null"}:
        return ""
    site = site.replace(" ", "")
    if site.lower().startswith(("http://", "https://")):
        return site
    return f"https://{site}"


def category_for(record: dict[str, str]) -> str:
    name = record.get("name", "")
    institution_type = record.get("institutionType", "")
    source_type = record.get("_sourceType", "")
    standalone_type = institution_type if source_type == "Standalone" else ""
    combined = f"{name} {institution_type}"

    if re.search(r"technical", standalone_type, re.I):
        return "Engineering"
    for category, pattern in CATEGORY_RULES:
        if pattern.search(combined):
            return category
    if re.search(r"university", combined, re.I) or source_type == "University":
        return "University"
    return "Degree"


def build() -> dict[str, object]:
    institutions: list[dict[str, str]] = []
    seen: set[str] = set()

    for source in SOURCES:
        rows = rows_from_xlsx(source["path"])
        header_index = next(i for i, row in enumerate(rows) if "Aishe Code" in row and "Name" in row)
        headers = rows[header_index]
        field_map = source["fieldMap"]

        for row in rows[header_index + 1 :]:
            raw = {headers[i]: row[i] if i < len(row) else "" for i in range(len(headers))}
            record = {
                "id": "",
                "name": "",
                "state": "",
                "district": "",
                "website": "",
                "category": "",
                "managementType": "",
                "institutionType": source["sourceType"],
                "yearEstablished": "",
                "_sourceType": source["sourceType"],
            }
            for original, target in field_map.items():
                value = normalize_website(raw.get(original, "")) if target == "website" else clean(raw.get(original, ""))
                if value:
                    record[target] = value
            if not record["id"] or record["id"] in seen:
                continue
            if source["sourceType"] == "University" and record["institutionType"] == "University":
                record["institutionType"] = "University"
            record["category"] = category_for(record)
            standard_keys = ["id", "name", "state", "district", "website", "category", "managementType", "institutionType", "yearEstablished"]
            record = {key: record.get(key, "") for key in standard_keys}
            seen.add(record["id"])
            institutions.append(record)

    institutions.sort(key=lambda item: (item.get("state", ""), item.get("district", ""), item.get("name", "")))
    apply_website_overrides(institutions)
    return {
        "generatedAt": "2026-06-08",
        "source": "AISHE College, University, and Standalone Institution exports",
        "count": len(institutions),
        "institutions": institutions,
    }


def apply_website_overrides(institutions: list[dict[str, str]]) -> None:
    if not WEBSITE_OVERRIDES.exists():
        return
    overrides = {
        clean(item.get("id")): normalize_website(item.get("website", ""))
        for item in json.loads(WEBSITE_OVERRIDES.read_text(encoding="utf-8"))
        if clean(item.get("id")) and clean(item.get("website"))
    }
    for institution in institutions:
        website = overrides.get(institution.get("id", ""))
        if website:
            institution["website"] = website


if __name__ == "__main__":
    data = build()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Generated {data['count']} institutions -> {OUTPUT}")

