#!/usr/bin/env python3
"""
Recursively compress inspiration images in place.

Requires:
    python3 -m pip install Pillow

Default usage:
    python3 scripts/compress_inspiracion_images.py

Preview only:
    python3 scripts/compress_inspiracion_images.py --dry-run
"""

from __future__ import annotations

import argparse
import os
import shutil
import sys
import tempfile
from pathlib import Path

Image = None
ImageOps = None


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_IMAGE_DIR = PROJECT_ROOT / "public" / "inspiracion"


def load_pillow() -> None:
    global Image, ImageOps

    try:
        from PIL import Image as pillow_image
        from PIL import ImageOps as pillow_image_ops
    except ModuleNotFoundError:
        print(
            "Missing dependency: Pillow. Install it with `python3 -m pip install Pillow`.",
            file=sys.stderr,
        )
        raise SystemExit(1)

    Image = pillow_image
    ImageOps = pillow_image_ops


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compress images recursively, preserving file names and formats."
    )
    parser.add_argument(
        "path",
        nargs="?",
        default=str(DEFAULT_IMAGE_DIR),
        help="Directory to scan recursively. Defaults to public/inspiracion.",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=45,
        help="Lossy quality for JPG/WebP files, from 1 to 95. Defaults to 45.",
    )
    parser.add_argument(
        "--max-width",
        type=int,
        default=1280,
        help="Maximum image width in pixels. Defaults to 1280.",
    )
    parser.add_argument(
        "--max-height",
        type=int,
        default=1280,
        help="Maximum image height in pixels. Defaults to 1280.",
    )
    parser.add_argument(
        "--png-colors",
        type=int,
        default=96,
        help="Maximum colors for PNG quantization. Defaults to 96.",
    )
    parser.add_argument(
        "--backup-dir",
        type=Path,
        default=None,
        help="Optional directory where original files are copied before replacing.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be compressed without replacing files.",
    )
    return parser.parse_args()


def iter_images(root: Path) -> list[Path]:
    return sorted(
        path
        for path in root.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )


def resize_for_mobile(image: Image.Image, max_size: tuple[int, int]) -> Image.Image:
    image = ImageOps.exif_transpose(image)
    image.thumbnail(max_size, Image.Resampling.LANCZOS)
    return image


def prepare_for_jpeg(image: Image.Image) -> Image.Image:
    if image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    ):
        background = Image.new("RGB", image.size, (255, 255, 255))
        background.paste(image, mask=image.convert("RGBA").split()[-1])
        return background

    if image.mode != "RGB":
        return image.convert("RGB")

    return image


def compress_png(image: Image.Image, output_path: Path, colors: int) -> None:
    has_alpha = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )

    if has_alpha:
        image = image.convert("RGBA")
        quantized = image.quantize(colors=colors, method=Image.Quantize.FASTOCTREE)
    else:
        image = image.convert("RGB")
        quantized = image.quantize(colors=colors, method=Image.Quantize.MEDIANCUT)

    quantized.save(output_path, format="PNG", optimize=True, compress_level=9)


def compress_image(
    image_path: Path,
    quality: int,
    max_size: tuple[int, int],
    png_colors: int,
) -> tuple[int, int]:
    original_size = image_path.stat().st_size

    with Image.open(image_path) as source:
        image = resize_for_mobile(source.copy(), max_size)
        suffix = image_path.suffix.lower()

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=image_path.suffix,
            dir=str(image_path.parent),
        ) as temp_file:
            temp_path = Path(temp_file.name)

        try:
            if suffix in (".jpg", ".jpeg"):
                image = prepare_for_jpeg(image)
                image.save(
                    temp_path,
                    format="JPEG",
                    quality=quality,
                    optimize=True,
                    progressive=True,
                )
            elif suffix == ".webp":
                image.save(temp_path, format="WEBP", quality=quality, method=6)
            elif suffix == ".png":
                compress_png(image, temp_path, png_colors)
            else:
                raise ValueError(f"Unsupported image format: {image_path.suffix}")

            compressed_size = temp_path.stat().st_size

            if compressed_size < original_size:
                os.replace(temp_path, image_path)
            else:
                temp_path.unlink(missing_ok=True)
                compressed_size = original_size

            return original_size, compressed_size
        except Exception:
            temp_path.unlink(missing_ok=True)
            raise


def backup_original(image_path: Path, root: Path, backup_dir: Path) -> None:
    relative_path = image_path.relative_to(root)
    destination = backup_dir / relative_path
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(image_path, destination)


def format_bytes(size: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024

    return f"{size:.1f} TB"


def main() -> int:
    args = parse_args()
    root = Path(args.path).expanduser().resolve()

    if not root.exists() or not root.is_dir():
        print(f"Directory not found: {root}", file=sys.stderr)
        return 1

    images = iter_images(root)
    if not images:
        print(f"No supported images found in {root}")
        return 0

    quality = max(1, min(args.quality, 95))
    png_colors = max(2, min(args.png_colors, 256))
    max_size = (args.max_width, args.max_height)
    total_before = 0
    total_after = 0

    print(f"Found {len(images)} image(s) in {root}")

    if args.dry_run:
        for image_path in images:
            print(f"[dry-run] {image_path}")
        return 0

    load_pillow()

    if args.backup_dir:
        args.backup_dir.mkdir(parents=True, exist_ok=True)

    for image_path in images:
        if args.backup_dir:
            backup_original(image_path, root, args.backup_dir)

        before, after = compress_image(
            image_path=image_path,
            quality=quality,
            max_size=max_size,
            png_colors=png_colors,
        )
        total_before += before
        total_after += after

        saved = before - after
        print(
            f"{image_path}: {format_bytes(before)} -> {format_bytes(after)} "
            f"saved {format_bytes(saved)}"
        )

    if total_before == 0:
        print("Nothing to compress.")
        return 0

    percent = (1 - (total_after / total_before)) * 100
    print(
        f"Total: {format_bytes(total_before)} -> {format_bytes(total_after)} "
        f"saved {percent:.1f}%"
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
