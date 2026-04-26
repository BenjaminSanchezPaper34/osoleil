#!/bin/bash
# Optimisation photos : resize 1920px max + WebP qualité 78 + versions responsive 800w/1280w
# Renomme avec des noms SEO-friendly

set -e
cd "$(dirname "$0")/img"
mkdir -p web

# Mapping : fichier_source → nom_cible (sans extension)
declare -a MAPPINGS=(
  "DJI_20260426113725_0012_D-DxO_DeepPRIME XD3.jpg|hero-port-marseillan"
  "DJI_20260426113159_0002_D-DxO_DeepPRIME XD3.jpg|drone-marseillan"
  "DJI_20260426113755_0013_D-DxO_DeepPRIME XD3.jpg|drone-port-large"
  "A7502351-DxO_DeepPRIME XD3.jpg|moules-pesto"
  "A7502409-DxO_DeepPRIME XD3.jpg|plateau-fruits-de-mer"
  "A7502277-DxO_DeepPRIME XD3.jpg|seiches-grillees"
  "A7502379-DxO_DeepPRIME XD3.jpg|daurade-plancha"
  "A7502220-DxO_DeepPRIME XD3.jpg|terrasse-soiree"
  "A7502229-DxO_DeepPRIME XD3.jpg|terrasse-parasols"
  "A7502272-DxO_DeepPRIME XD3.jpg|aperol-spritz"
  "A7502273-DxO_DeepPRIME XD3.jpg|biere-pression"
  "A7502278-DxO_DeepPRIME XD3.jpg|salade-foie-gras"
  "A7502384-DxO_DeepPRIME XD3.jpg|soupe-poisson"
  "A7502316-DxO_DeepPRIME XD3.jpg|tiramisu-osoleil"
  "A7502387-DxO_DeepPRIME XD3.jpg|baba-rhum"
  "A7502161-DxO_DeepPRIME XD3.jpg|facade-port"
  "A7502250-DxO_DeepPRIME XD3.jpg|service-vin"
  "A7502392-DxO_DeepPRIME XD3.jpg|cliente-carte"
  "A7502425-DxO_DeepPRIME XD3.jpg|ambiance-conviviale"
  "A7502328-DxO_DeepPRIME XD3.jpg|service-terrasse"
)

# Tailles cibles : 800w (mobile), 1280w (tablette/desktop std), 1920w (retina)
# Compression agressive : WebP q72, JPG q75
SIZES=(800 1280 1920)

for entry in "${MAPPINGS[@]}"; do
  src="${entry%%|*}"
  out="${entry##*|}"
  if [ ! -f "$src" ]; then
    echo "❌ Manque : $src"
    continue
  fi
  echo "🖼  $src → $out"
  for w in "${SIZES[@]}"; do
    tmp_jpg="/tmp/osoleil-${out}-${w}.jpg"
    sips --resampleWidth "$w" "$src" --out "$tmp_jpg" >/dev/null 2>&1
    cwebp -q 72 -m 6 -mt -quiet "$tmp_jpg" -o "web/${out}-${w}.webp"
    rm -f "$tmp_jpg"
  done
  # Fallback JPG : 1280w qualité 75
  sips --resampleWidth 1280 -s format jpeg -s formatOptions 75 "$src" --out "web/${out}-1280.jpg" >/dev/null 2>&1
done

echo ""
echo "✅ Total :"
ls -lh web/ | awk 'NR>1 {sum+=$5} END {print NR-1" fichiers"}'
du -sh web/
