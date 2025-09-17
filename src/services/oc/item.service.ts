// src/services/netSuiteService.ts
import { querySqlServer, sql } from '../../config/sqlServerClient';

export async function getItemsFromNetSuite() {
    const ticketResult = await querySqlServer(
      `
      SELECT top 10 * FROM OPENQUERY(NS_CLIENTE, '
        SELECT i.itemid, i.id, i.displayname, Builtin.DF(ib.location), SUM(ib.quantityavailable)
        FROM item i 
        LEFT JOIN InventoryBalance ib ON ib.item = i.id      
        WHERE i.isinactive=''F''
        AND i.custitem_nso_habilitado_venta=''T''
        GROUP BY i.itemid, i.id, i.displayname, Builtin.DF(ib.location)
        ORDER BY 2, 4
      ')
      `, 
    );
  return await ticketResult;
}
