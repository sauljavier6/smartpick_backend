import { querySqlServerDP, sql } from "../../config/sqlServerClientDP";

export async function listarArticulos(op: { buscar: string; pagina: number; limite: number; exacto?: boolean }) {
  const { buscar, pagina, limite, exacto = false } = op;
  const offset = (pagina - 1) * limite;
  const query = `
    WITH Articulos AS (
      SELECT articulo, nombre, Precio_Venta, tecla, upc, nombreProveedor,
        ROW_NUMBER() OVER (PARTITION BY articulo ORDER BY Precio_Venta DESC, nombreProveedor ASC) AS rn
      FROM interfaces_netsuite.dbo.articuloExistencia
      WHERE (@exacto = 1 AND (CAST(articulo AS VARCHAR(80)) = @buscar OR CAST(upc AS VARCHAR(80)) = @buscar))
         OR (@exacto = 0 AND (@buscar = '' OR CAST(articulo AS VARCHAR(80)) LIKE '%' + @buscar + '%'
        OR CAST(upc AS VARCHAR(80)) LIKE '%' + @buscar + '%'))
    ),
    Promociones AS (
      SELECT * FROM OPENQUERY(DPC_CLIENTE, '
        WITH promociones AS (
          SELECT P.description, RI.item_code, IT.description AS DESCRIPCION,
            RT.description AS TIPO_PROMO, CAST(R.value AS DECIMAL(18,2)) AS PRECIO_ESPECIAL,
            CONVERT(VARCHAR, P.startDate, 105) AS Fecha_Ini,
            CONVERT(VARCHAR, P.endDate, 105) AS Fecha_Fin,
            ROW_NUMBER() OVER (PARTITION BY RI.item_code ORDER BY
              CAST(R.value AS DECIMAL(18,2)) ASC, P.endDate ASC) AS rn
          FROM rewards R
          INNER JOIN reward_types RT ON RT.code = R.rewardType
          INNER JOIN promotions P ON P.promotionId = R.promotionId
          INNER JOIN records I ON I.promotionId = R.promotionId
          INNER JOIN record_included_items RI ON RI.record_id = I.id
          INNER JOIN items IT ON IT.code = RI.item_code
          WHERE P.startDate <= GETDATE() AND P.endDate >= CAST(GETDATE() AS DATE)
            AND RT.description <> ''Item Gratis''
            AND (P.description LIKE ''LIQ %'' OR RT.description = ''Precio Fijo'')
        )
        SELECT * FROM promociones WHERE rn = 1
      ')
    ),
    Resultado AS (
      SELECT a.articulo AS item_code, COALESCE(NULLIF(LTRIM(RTRIM(a.nombre)), ''), p.DESCRIPCION) AS DESCRIPCION,
        a.Precio_Venta, p.PRECIO_ESPECIAL, p.TIPO_PROMO,
        p.description AS PROMOCION, p.Fecha_Ini, p.Fecha_Fin,
        a.tecla, a.upc, a.nombreProveedor,
        CASE WHEN p.item_code IS NULL THEN 0 ELSE 1 END AS TIENE_PROMOCION,
        CASE WHEN p.item_code IS NULL THEN a.Precio_Venta
             WHEN p.TIPO_PROMO = 'Precio Fijo' THEN p.PRECIO_ESPECIAL
             ELSE a.Precio_Venta - a.Precio_Venta * p.PRECIO_ESPECIAL / 100
        END AS PRECIO_FINAL
      FROM Articulos a LEFT JOIN Promociones p ON p.item_code = a.articulo
      WHERE a.rn = 1
    )
    SELECT *, COUNT(*) OVER() AS total FROM Resultado
    ORDER BY item_code DESC OFFSET @offset ROWS FETCH NEXT @limite ROWS ONLY;
  `;
  const data = await querySqlServerDP(query, [
    { name: "buscar", type: sql.VarChar(80), value: buscar },
    { name: "exacto", type: sql.Bit, value: exacto },
    { name: "offset", type: sql.Int, value: offset },
    { name: "limite", type: sql.Int, value: limite },
  ]);
  return { data, total: data[0]?.total ?? 0, pagina, limite };
}
