#!/usr/bin/env bash

set -euo pipefail

INPUT_DIR="originals"
OUTPUT_DIR="assets/images"

MAX_WIDTH=2200
QUALITY=84
WEBP_METHOD=6

if ! command -v magick >/dev/null 2>&1; then
    echo "Error: ImageMagick is not installed."
    echo "Install it with: brew install imagemagick"
    exit 1
fi

if [[ ! -d "$INPUT_DIR" ]]; then
    echo "Error: input directory '$INPUT_DIR' does not exist."
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

processed=0
skipped=0

while IFS= read -r -d '' input_file; do
    relative_path="${input_file#"$INPUT_DIR"/}"
    relative_dir="$(dirname "$relative_path")"
    filename="$(basename "$relative_path")"
    filename_without_extension="${filename%.*}"

    output_dir="$OUTPUT_DIR/$relative_dir"
    output_file="$output_dir/$filename_without_extension.webp"

    mkdir -p "$output_dir"

    # Skip rebuilding when the output is newer than its source.
    if [[ -f "$output_file" && "$output_file" -nt "$input_file" ]]; then
        echo "Skipping unchanged: $relative_path"
        ((skipped += 1))
        continue
    fi

    echo "Optimising: $relative_path"

    magick "$input_file" \
        -auto-orient \
        -strip \
        -resize "${MAX_WIDTH}x>" \
        -quality "$QUALITY" \
        -define webp:method="$WEBP_METHOD" \
        -define webp:thread-level=1 \
        "$output_file"

    original_size=$(stat -f%z "$input_file")
    output_size=$(stat -f%z "$output_file")

    original_kb=$((original_size / 1024))
    output_kb=$((output_size / 1024))

    echo "  ${original_kb} KB → ${output_kb} KB"
    ((processed += 1))

done < <(
    find "$INPUT_DIR" -type f \
        \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) \
        -print0
)

echo
echo "Finished."
echo "Processed: $processed"
echo "Skipped:   $skipped"
echo "Output:    $OUTPUT_DIR"