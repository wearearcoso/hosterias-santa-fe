#!/bin/bash
# ================================================
# process-images.sh — Download & Optimize for Web
# ================================================
# Usage: ./process-images.sh <url> <output-name> [width]
# Example: ./process-images.sh "https://example.com/photo.jpg" hotel-mariscal 800
#
# Steps:
# 1. Download image from URL
# 2. Crop 2-5% off edges (simulates screenshot framing)
# 3. Resize to target width (default 800px)
# 4. Add subtle noise texture (makes Google see it as new)
# 5. Convert to WebP @ quality optimized for <90KB
# 6. Output to assets/images/
# ================================================

set -e

URL="$1"
NAME="$2"
WIDTH="${3:-800}"
OUTDIR="$(dirname "$0")/../assets/images"
TMPDIR="/tmp/hsfa-img-$$"

if [ -z "$URL" ] || [ -z "$NAME" ]; then
  echo "Usage: $0 <image-url> <output-name> [width]"
  echo "Example: $0 'https://example.com/img.jpg' hosteria-florida 800"
  exit 1
fi

mkdir -p "$OUTDIR" "$TMPDIR"

EXT="${URL##*.}"
EXT="${EXT%%\?*}"
EXT=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')
case "$EXT" in
  jpg|jpeg|png|webp|gif|bmp) ;;
  *) EXT="jpg" ;;
esac

ORIGINAL="$TMPDIR/original.$EXT"

echo "📥 Downloading: $URL"
curl -sSL --max-time 30 -o "$ORIGINAL" "$URL" || {
  echo "❌ Download failed for $URL"
  rm -rf "$TMPDIR"
  exit 1
}

FILE_SIZE=$(stat -f%z "$ORIGINAL" 2>/dev/null || stat -c%s "$ORIGINAL" 2>/dev/null)
if [ "$FILE_SIZE" -lt 1000 ]; then
  echo "❌ Downloaded file too small ($FILE_SIZE bytes) — likely an error page"
  rm -rf "$TMPDIR"
  exit 1
fi
echo "   Size: $FILE_SIZE bytes"

# Get dimensions
DIMS=$(magick identify -format "%wx%h" "$ORIGINAL" 2>/dev/null)
echo "   Dimensions: $DIMS"

# Step 1: Crop 2-3% off edges (simulates screenshot framing)
CROPPED="$TMPDIR/cropped.png"
magick "$ORIGINAL" \
  -gravity center \
  -crop 96%x96%+0+0 +repage \
  "$CROPPED"

# Step 2: Resize to target width
RESIZED="$TMPDIR/resized.png"
magick "$CROPPED" -resize "${WIDTH}x" "$RESIZED"

# Step 3: Add subtle noise/grain texture overlay
# This creates a unique fingerprint so Google doesn't flag as duplicate
TEXTURED="$TMPDIR/textured.png"
magick "$RESIZED" \
  \( +clone -function polynomial 0.8,0 \
     -attenuate 0.03 +noise Gaussian \
     -colorspace gray \
  \) \
  -compose overlay -composite \
  "$TEXTURED"

# Step 4: Convert to WebP with optimized quality
# Target: under 90KB. Start at quality 82, check size, reduce if needed.
OUTPUT="$OUTDIR/${NAME}.webp"
QUALITY=82

cwebp -q $QUALITY -m 6 -pass 10 -mt \
  "$TEXTURED" -o "$OUTPUT" 2>/dev/null

# Iteratively reduce quality if still over 90KB
MAX_KB=90
for i in $(seq 1 10); do
  SIZE=$(stat -f%z "$OUTPUT" 2>/dev/null || stat -c%s "$OUTPUT" 2>/dev/null)
  SIZE_KB=$((SIZE / 1024))
  if [ "$SIZE_KB" -le "$MAX_KB" ]; then
    break
  fi
  QUALITY=$((QUALITY - 5))
  if [ "$QUALITY" -lt 20 ]; then
    echo "⚠️  Quality floor reached (q=$QUALITY), stopping"
    break
  fi
  cwebp -q $QUALITY -m 6 -pass 5 -mt \
    "$TEXTURED" -o "$OUTPUT" 2>/dev/null
done

SIZE=$(stat -f%z "$OUTPUT" 2>/dev/null || stat -c%s "$OUTPUT" 2>/dev/null)
SIZE_KB=$((SIZE / 1024))
FINAL_DIMS=$(magick identify -format "%wx%h" "$OUTPUT" 2>/dev/null)

echo "✅ Created: $OUTPUT"
echo "   WebP: ${SIZE_KB}KB @ q${QUALITY} | Dimensions: ${FINAL_DIMS}"

# Generate a 16:9 social preview if this is a hero/banner image
if [[ "$NAME" == *"hero"* ]] || [[ "$NAME" == *"og-"* ]] || [[ "$NAME" == *"banner"* ]]; then
  SOCIAL="$OUTDIR/${NAME}-social.webp"
  magick "$TEXTURED" \
    -gravity center \
    -extent 1200x630 \
    -background "#0A0A0A" \
    "$TMPDIR/social.png"
  cwebp -q 75 -m 6 "$TMPDIR/social.png" -o "$SOCIAL" 2>/dev/null
  echo "   Social preview (1200x630): $SOCIAL"
fi

rm -rf "$TMPDIR"
