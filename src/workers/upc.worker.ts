// src/workers/upc.worker.ts
import cron from "node-cron";
import { processUpcs } from "../services/products/upc.service";

console.log("🟢 UPC Worker iniciado", new Date().toLocaleString());

//DETERMINA EL TIEMPO DE EJECUCIÓN: CADA HORA
cron.schedule("0 * * * *", async () => {
//cron.schedule("*/1 * * * *", async () => {

  console.log("⏰ CRON disparado:", new Date().toLocaleString());

  try {
    //DETERMINA NUMERO DE UPC A PROCESAR
    await processUpcs(20);
    console.log("✅ Ciclo de UPC terminado:", new Date().toLocaleString());
  } catch (error) {
    console.error("❌ Error en worker UPC:", error);
  }
});
   