// src/services/netSuiteService.ts
import { querySqlServer, sql } from '../../config/sqlServerClient';

export async function getReordenFormulado(idproveedor: string) {
    const orden = await querySqlServer(
      `
      SELECT * FROM OPENQUERY(NS_CLIENTE, '
            SELECT TOP 10
                i.id AS ID_Interno,
                Builtin.DF(ib.location) AS Ubicación,
                ib.location,
                i.itemid,
                i.displayname AS Descripcion,
                i.purchaseunit AS Unidad_de_Empaque,
                v.companyname AS Proveedor,
                SUM(ib.quantityavailable) AS Stock_Disponible
            FROM itemVendor iv
            INNER JOIN vendor v ON v.id = iv.vendor
            INNER JOIN item i ON iv.item = i.id
            LEFT JOIN InventoryBalance ib ON ib.item = i.id    
            WHERE iv.vendor = ''${idproveedor}''
            AND i.custitem_nso_enviar_pos = ''T''
            AND i.custitem_nso_habilitado_venta = ''T''
            AND i.isinactive = ''F''
            GROUP BY
                i.id, Builtin.DF(ib.location), ib.location, i.itemid, i.displayname,
                i.purchaseunit, v.companyname
        ')
      `, 
      [
        { name: 'ordencompra', type: sql.VarChar, value: idproveedor }
      ], 
    );
  return await orden;   
}