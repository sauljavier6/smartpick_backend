// @/services/openfoodfacts.service.ts
import axios from "axios";

function extractGrams(text?: string): number | null {
  if (!text) return null;
  const match = text.match(/([\d.]+)\s*g/i);
  return match ? parseFloat(match[1]) : null;
}

function fallbackServingByCategory(category?: string): number | null {
  if (!category) return null;

  const c = category.toLowerCase();

  if (c.includes("cereal")) return 28;
  if (c.includes("granola")) return 30;
  if (c.includes("snack")) return 30;
  if (c.includes("cookie")) return 30;
  if (c.includes("beverage")) return 240;
  if (c.includes("drink")) return 240;

  return null;
}

export async function fetchOpenFoodFacts(
  upc: string,
  category?: string
) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${upc}.json`;
  const { data } = await axios.get(url, { timeout: 10000 });

  if (data.status !== 1) return null;

  const p = data.product;

  const netGrams = extractGrams(p.quantity);
  const servingFromApi = extractGrams(p.serving_size);
  const servingFallback = fallbackServingByCategory(category);

  const servingGrams = servingFromApi ?? servingFallback ?? null;

  let servings: number | null = null;
  let confidence: "exact" | "estimated" | "unknown" = "unknown";

  if (netGrams && servingGrams) {
    servings = Math.round(netGrams / servingGrams);
    confidence = servingFromApi ? "exact" : "estimated";
  }

  return {
    // Contenido neto
    net_quantity: p.quantity ?? null,
    net_quantity_value: netGrams,
    net_quantity_unit: netGrams ? "g" : null,

    // Porción
    serving_size_text: p.serving_size ?? null,
    serving_size_value: servingGrams,
    serving_size_unit: servingGrams ? "g" : null,

    servings_per_container: servings,
    serving_confidence: confidence,

    // Extras
    ingredients:
      p.ingredients_text_es ||
      p.ingredients_text ||
      null,

    country:
      p.countries_tags?.[0]?.replace("en:", "").toUpperCase() ?? null,

    language: p.lang ?? null,
  };
}
