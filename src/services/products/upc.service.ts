// @/services/upc.service.ts
import UpcQueue, { UpcQueueStatus } from "../../models/products/UpcQueue";
import { Transaction } from "sequelize";
import Products from "../../models/products/Products";
import sequelize from "../../config/database";
import axios from "axios";
import * as cheerio from "cheerio"; // ✅ Import seguro

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function fetchProductData(upc: string){
  const url = `https://go-upc.com/search?q=${upc}`;
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  const product_name = $("h1.product-name").text().trim() || 'Sin nombre';
  const description = $("div:has(h2:contains('Description')) span").text().trim() || null;
  const ingredients = $("div:has(h2:contains('Ingredients')) span").text().trim() || null;

  const brand = $("table.table tr:contains('Brand') td:nth-child(2)").text().trim() || null;
  const category = $("table.table tr:contains('Category') td:nth-child(2)").text().trim() || null;
  const ean = $("table.table tr:contains('EAN') td:nth-child(2)").text().trim() || null;

  // Additional Attributes
  const manufacturer = $("ul li:contains('Manufacturer')").text().replace("Manufacturer:", "").trim() || null;
  const campaign_id = $("ul li:contains('Campaign ID')").text().replace("Campaign ID:", "").trim() || null;
  const affiliate_ad_id = $("ul li:contains('Affiliates Ad ID')").text().replace("Affiliates Ad ID:", "").trim() || null;
  const department = $("ul li:contains('Department')").text().replace("Department:", "").trim() || null;
  const allergens = $("ul li:contains('Allergens')").text().replace("Allergens:", "").trim() || null;

  // Image
  const image_url = $("figure.product-image img").attr("src") ?? null;

  return {
    upc,
    ean,
    product_name,
    description,
    ingredients,
    brand,
    category,
    manufacturer,
    campaign_id,
    affiliate_ad_id,
    department,
    allergens,
    image_url,
  };
}


export async function processUpcs(limit: number) {
  console.log("📦 Buscando UPCs pendientes...");

  const upcs = await UpcQueue.findAll({
    where: { status: UpcQueueStatus.PENDING },
    limit,
    order: [["created_at", "ASC"]],
  });

  console.log(`📦 UPCs encontrados: ${upcs.length}`);

  if (!upcs.length) {
    console.log("⚠️ No hay UPCs pendientes");
    return;
  }

  for (const item of upcs) {
    console.log(`🔍 Procesando UPC: ${item.upc}`);

    const transaction: Transaction = await sequelize.transaction();

    try {
      item.status = UpcQueueStatus.PROCESSING;
      item.attempts += 1;
      await item.save({ transaction });

      const productData = await fetchProductData(item.upc);

        await Products.upsert(
        {
            upc: item.upc,
            product_name: productData?.product_name ?? "Sin nombre",
            description: productData?.description ?? null,
            ingredients: productData?.ingredients ?? null,
            brand: productData?.brand ?? null,
            category: productData?.category ?? null,
            ean: productData?.ean ?? null,
            manufacturer: productData?.manufacturer ?? null,
            campaign_id: productData?.campaign_id ?? null,
            affiliate_ad_id: productData?.affiliate_ad_id ?? null,
            department: productData?.department ?? null,
            allergens: productData?.allergens ?? null,
            image_url: productData?.image_url ?? null,
            source: "gotoupc",
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
