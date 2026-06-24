from __future__ import annotations

import json
import re
from pathlib import Path
from posixpath import join, normpath
from zipfile import ZipFile
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DESKTOP = Path.home() / "OneDrive" / "Desktop"
SOURCE = DESKTOP / "india_entrance_exams_final.xlsx"
OUTPUT = ROOT / "data" / "entrance-exams.json"

NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "").replace("\u00a0", " ")).strip()


def shared_strings(zf: ZipFile) -> list[str]:
    try:
        root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return ["".join(t.text or "" for t in item.findall(".//a:t", NS)) for item in root.findall("a:si", NS)]


def column_index(cell_ref: str) -> int:
    index = 0
    for letter in "".join(ch for ch in cell_ref if ch.isalpha()):
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


def worksheet_paths(zf: ZipFile) -> list[tuple[str, str]]:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}
    sheets: list[tuple[str, str]] = []
    for sheet in workbook.findall("a:sheets/a:sheet", NS):
        rel_id = sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
        target = rel_map[rel_id].lstrip("/")
        path = normpath(target if target.startswith("xl/") else join("xl", target))
        sheets.append((sheet.attrib.get("name", "Sheet"), path))
    return sheets


def rows_from_sheet(zf: ZipFile, path: str, strings: list[str]) -> list[list[str]]:
    root = ET.fromstring(zf.read(path))
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


def normalize_url(value: str) -> str:
    site = clean(value)
    if not site or site in {"-", "--", "NA", "N/A", "Nil", "null"}:
        return ""
    site = site.replace(" ", "")
    return site if site.lower().startswith(("http://", "https://")) else f"https://{site}"


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def normalize_record(sheet_name: str, raw: dict[str, str]) -> dict[str, str]:
    return {
        "id": slug(f"{sheet_name}-{raw.get('Exam', '')}"),
        "exam": clean(raw.get("Exam")),
        "fullName": clean(raw.get("Full Name")),
        "category": sheet_name,
        "level": clean(raw.get("Level")) or "Specialized",
        "conductingBody": clean(raw.get("Conducting Body")),
        "programme": clean(raw.get("Programme") or raw.get("Role/Programme") or raw.get("Posts/Service") or raw.get("Posts") or raw.get("For")),
        "eligibility": clean(raw.get("Eligibility")),
        "scope": clean(raw.get("Scope/State") or raw.get("Scope") or raw.get("Stream") or raw.get("Branch/Service")),
        "frequency": clean(raw.get("Frequency")),
        "website": normalize_url(raw.get("Website", "")),
    }


def build() -> dict[str, object]:
    exams: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()
    with ZipFile(SOURCE) as zf:
        strings = shared_strings(zf)
        for sheet_name, path in worksheet_paths(zf):
            rows = rows_from_sheet(zf, path, strings)
            if not rows:
                continue
            headers = rows[0]
            for row in rows[1:]:
                raw = {headers[i]: row[i] if i < len(row) else "" for i in range(len(headers))}
                record = normalize_record(sheet_name, raw)
                key = (record["exam"].lower(), record["category"].lower())
                if not record["exam"] or key in seen:
                    continue
                seen.add(key)
                exams.append(record)

    exams.sort(key=lambda item: (item["category"], item["level"], item["exam"]))
    return {
        "generatedAt": "2026-06-09",
        "source": SOURCE.name,
        "count": len(exams),
        "exams": exams,
    }


if __name__ == "__main__":
    OUTPUT.write_text(json.dumps(build(), ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT}")
