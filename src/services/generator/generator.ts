// src/services/netSuiteService.ts
import { querySqlServerDP, sql } from "../../config/sqlServerClientDP";

/**
 * Obtiene las ofertas activas desde el linked server DPC_CLIENTE
 * combinando datos de promociones, recompensas y artículos.
 *
 * @returns {Promise<any>} Lista de ofertas con precios, fechas y datos del producto.
 */
export async function getOfertasdata(sucursal: string) {
  const promociones = await querySqlServerDP(
        `
        SELECT *
        FROM OPENQUERY(DPC_CLIENTE, '
            WITH prom_ordered AS (
                SELECT 
                    P.description,
                    RI.item_code,
                    IT.description AS DESCRIPCION,
                    RT.description AS TIPO_PROMO,
                    CAST(R.value AS DECIMAL(18,2)) AS PRECIO_ESPECIAL,
                    CONVERT(VARCHAR, P.startDate, 105) AS Fecha_Ini,
                    CONVERT(VARCHAR, P.endDate, 105) AS Fecha_Fin,
                    P.startDate,
                    P.endDate,
                    bp.branchId,
                    ROW_NUMBER() OVER (
                        PARTITION BY RI.item_code 
                        ORDER BY CAST(R.value AS DECIMAL(18,2)) ASC, P.endDate ASC
                    ) AS rn
                FROM rewards R 
                INNER JOIN reward_types RT ON RT.code = R.rewardType
                INNER JOIN promotions P ON P.promotionId = R.promotionId
                INNER JOIN branch_promotions bp ON bp.promotionId = P.promotionId
                INNER JOIN branches b ON b.id = bp.branchId
                INNER JOIN records I ON i.promotionId = R.promotionId
                INNER JOIN record_included_items RI ON RI.record_id = I.id
                INNER JOIN items IT ON IT.code = RI.item_code
                WHERE 
                    P.endDate >= CAST(GETDATE() AS DATE) 
                    AND b.initials IN (''${sucursal}'')
                    AND RT.description <> ''Item Gratis''
            )
            SELECT *
            FROM prom_ordered
            WHERE rn = 1
        ') t
        LEFT JOIN (
            SELECT articulo, Precio_Venta, tecla, upc, nombreProveedor
            FROM (
                SELECT 
                    articulo,
                    Precio_Venta,
                    tecla,
                    upc,
                    nombreProveedor,
                    ROW_NUMBER() OVER (PARTITION BY articulo ORDER BY Precio_Venta DESC, nombreProveedor ASC) AS rn
                FROM articuloExistencia
            ) t1
            WHERE rn = 1
        ) a
        ON a.articulo = t.item_code
        ORDER BY t.item_code DESC;
      `,
      [
        { name: 'promociones', type: sql.VarChar, value: sucursal }
      ], 
    );

  return await promociones;   
}

export async function getOfertasByIddata(sucursal: string) {
  const promociones = await querySqlServerDP(
        `
        SELECT *
        FROM OPENQUERY(DPC_CLIENTE, '
            WITH prom_ordered AS (
                SELECT 
                    P.description,
                    RI.item_code,
                    IT.description AS DESCRIPCION,
                    RT.description AS TIPO_PROMO,
                    CAST(R.value AS DECIMAL(18,2)) AS PRECIO_ESPECIAL,
                    CONVERT(VARCHAR, P.startDate, 105) AS Fecha_Ini,
                    CONVERT(VARCHAR, P.endDate, 105) AS Fecha_Fin,
                    P.startDate,
                    P.endDate,
                    bp.branchId,
                    ROW_NUMBER() OVER (
                        PARTITION BY RI.item_code 
                        ORDER BY CAST(R.value AS DECIMAL(18,2)) ASC, P.endDate ASC
                    ) AS rn
                FROM rewards R 
                INNER JOIN reward_types RT ON RT.code = R.rewardType
                INNER JOIN promotions P ON P.promotionId = R.promotionId
                INNER JOIN branch_promotions bp ON bp.promotionId = P.promotionId
                INNER JOIN branches b ON b.id = bp.branchId
                INNER JOIN records I ON i.promotionId = R.promotionId
                INNER JOIN record_included_items RI ON RI.record_id = I.id
                INNER JOIN items IT ON IT.code = RI.item_code
                WHERE 
                    P.endDate >= CAST(GETDATE() AS DATE) 
                    AND b.initials IN (''${sucursal}'')
                    AND RT.description <> ''Item Gratis''
            )
            SELECT *
            FROM prom_ordered
            WHERE rn = 1
        ') t
        LEFT JOIN (
            SELECT articulo, Precio_Venta, tecla, upc, nombreProveedor
            FROM (
                SELECT 
                    articulo,
                    Precio_Venta,
                    tecla,
                    upc,
                    nombreProveedor,
                    ROW_NUMBER() OVER (PARTITION BY articulo ORDER BY Precio_Venta DESC, nombreProveedor ASC) AS rn
                FROM articuloExistencia
            ) t1
            WHERE rn = 1
        ) a
        ON a.articulo = t.item_code
        ORDER BY t.item_code DESC;
      `,
      [
        { name: 'promociones', type: sql.VarChar, value: sucursal }
      ], 
    );

  return await promociones;   
}



export async function getIdByUpc(upc: string) {
  const articulo = await querySqlServerDP(
        `
        SELECT *
        FROM OPENQUERY(DPC_CLIENTE, '
            WITH prom_ordered AS (
                SELECT 
                    P.description,
                    RI.item_code,
                    IT.description AS DESCRIPCION,
                    RT.description AS TIPO_PROMO,
                    CAST(R.value AS DECIMAL(18,2)) AS PRECIO_ESPECIAL,
                    CONVERT(VARCHAR, P.startDate, 105) AS Fecha_Ini,
                    CONVERT(VARCHAR, P.endDate, 105) AS Fecha_Fin,
                    P.startDate,
                    P.endDate,
                    bp.branchId,
                    ROW_NUMBER() OVER (
                        PARTITION BY RI.item_code 
                        ORDER BY CAST(R.value AS DECIMAL(18,2)) ASC, P.endDate ASC
                    ) AS rn
                FROM rewards R 
                INNER JOIN reward_types RT ON RT.code = R.rewardType
                INNER JOIN promotions P ON P.promotionId = R.promotionId
                INNER JOIN branch_promotions bp ON bp.promotionId = P.promotionId
                INNER JOIN branches b ON b.id = bp.branchId
                INNER JOIN records I ON i.promotionId = R.promotionId
                INNER JOIN record_included_items RI ON RI.record_id = I.id
                INNER JOIN items IT ON IT.code = RI.item_code
                WHERE 
                    P.endDate >= CAST(GETDATE() AS DATE) 
                    AND RT.description <> ''Item Gratis''
            )
            SELECT *
            FROM prom_ordered
            WHERE rn = 1
        ') t
        INNER JOIN (
            SELECT articulo, Precio_Venta, tecla, upc, nombreProveedor
            FROM (
                SELECT 
                    articulo,
                    Precio_Venta,
                    tecla,
                    upc,
                    nombreProveedor,
                    ROW_NUMBER() OVER (PARTITION BY articulo ORDER BY Precio_Venta DESC, nombreProveedor ASC) AS rn
                FROM articuloExistencia
            ) t1
            WHERE rn = 1
        ) a
        ON a.articulo = t.item_code
        WHERE a.upc  = '${upc}'
        ORDER BY t.item_code DESC;
      `,
      [
        { name: 'articulo', type: sql.VarChar, value: upc }
      ], 
    );

  return await articulo[0];   
}