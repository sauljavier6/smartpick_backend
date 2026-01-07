// @/services/upc.service.ts
import UpcQueue, { UpcQueueStatus } from "../../models/products/UpcQueue";
import Products from "../../models/products/Products";
import sequelize from "../../config/database";
import axios from "axios";
import * as cheerio from "cheerio";
import { fetchOpenFoodFacts } from "./openfoodfacts.service";

interface OpenFoodFactsData {
  // contenido neto
  net_quantity?: string | null;
  net_quantity_value?: number | null;
  net_quantity_unit?: string | null;

  // porciones
  serving_size_text?: string | null;
  serving_size_value?: number | null;
  serving_size_unit?: string | null;
  servings_per_container?: number | null;
  serving_confidence?: "exact" | "estimated" | "unknown" | null;

  // extras
  ingredients?: string | null;
  country?: string | null;
  language?: string | null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Fuente base: go-upc (scraping)
 */
export async function fetchProductData(upc: string) {
  const url = `https://go-upc.com/search?q=${upc}`;
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  return {
    upc,
    ean: $("table.table tr:contains('EAN') td:nth-child(2)").text().trim() || null,
    product_name: $("h1.product-name").text().trim() || "Sin nombre",
    description: $("div:has(h2:contains('Description')) span").text().trim() || null,
    ingredients: $("div:has(h2:contains('Ingredients')) span").text().trim() || null,
    brand: $("table.table tr:contains('Brand') td:nth-child(2)").text().trim() || null,
    category: $("table.table tr:contains('Category') td:nth-child(2)").text().trim() || null,
    manufacturer: $("ul li:contains('Manufacturer')").text().replace("Manufacturer:", "").trim() || null,
    campaign_id: $("ul li:contains('Campaign ID')").text().replace("Campaign ID:", "").trim() || null,
    affiliate_ad_id: $("ul li:contains('Affiliates Ad ID')").text().replace("Affiliates Ad ID:", "").trim() || null,
    department: $("ul li:contains('Department')").text().replace("Department:", "").trim() || null,
    allergens: $("ul li:contains('Allergens')").text().replace("Allergens:", "").trim() || null,
    image_url: $("figure.product-image img").attr("src") ?? null,
  };
}

export async function processUpcs(limit: number) {
  console.log("📦 Buscando UPCs pendientes...");

  const upcs = await UpcQueue.findAll({
    where: { status: UpcQueueStatus.PENDING },
    limit,
    order: [["created_at", "ASC"]],
  });

  if (!upcs.length) return;

  for (const item of upcs) {
    console.log(`🔍 Procesando UPC: ${item.upc}`);
    const transaction = await sequelize.transaction();

    try {
      item.status = UpcQueueStatus.PROCESSING;
      item.attempts += 1;
      await item.save({ transaction });

      // 1️⃣ Fuente base
      const productData = await fetchProductData(item.upc);

      // 2️⃣ Enriquecimiento (solo OpenFoodFacts)
      const offResult = await fetchOpenFoodFacts(
        item.upc,
        productData.category ?? undefined
      );

      const enrich: OpenFoodFactsData = offResult ?? {};
      console.log(`   📝 Enriquecimiento OFF:`, enrich);

      // 3️⃣ Guardado
      await Products.upsert(
        {
          upc: item.upc,
          product_name: productData.product_name,
          description: productData.description,

          ingredients: enrich.ingredients ?? productData.ingredients,

          brand: productData.brand,
          category: productData.category,
          ean: productData.ean,

          image_url: productData.image_url,

          // 🌍 OpenFoodFacts
          net_quantity: enrich.net_quantity,
          net_quantity_value: enrich.net_quantity_value,
          net_quantity_unit: enrich.net_quantity_unit,

          serving_size_text: enrich.serving_size_text,
          serving_size_value: enrich.serving_size_value,
          serving_size_unit: enrich.serving_size_unit,

          servings_per_container: enrich.servings_per_container,
          serving_confidence: enrich.serving_confidence,

          country: enrich.country,
          language: enrich.language,

          source: "go-upc + openfoodfacts",
        },
        { transaction }
      );

      item.status = UpcQueueStatus.DONE;
      item.last_error = null;
      await item.save({ transaction });

      await transaction.commit();
      await sleep(randomBetween(3000, 5000));

    } catch (error: any) {
      await transaction.rollback();

      item.status = UpcQueueStatus.ERROR;
      item.last_error = error.message?.slice(0, 500);
      await item.save();

      console.error(`❌ UPC ${item.upc} falló:`, error.message);
    }
  }
}
