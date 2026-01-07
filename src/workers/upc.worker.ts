// src/workers/upc.worker.ts
import cron from "node-cron";
import { processUpcs } from "../services/products/upc.service";

let isRunning = false;

cron.schedule("0 * * * *", async () => {
  if (isRunning) {
    console.log("⏭️ Cron saltado: proceso aún en ejecución");
    return;
  }

  isRunning = true;
  console.log("⏰ CRON disparado:", new Date().toLocaleString());

  try {
    await processUpcs(20); // o el batch que quieras
  } catch (error) {
    console.error("❌ Error en cron UPC:", error);
  } finally {
    isRunning = false;
    console.log("✅ Ciclo de UPC terminado:", new Date().toLocaleString());
  }
});
