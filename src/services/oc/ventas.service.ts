// src/services/netSuiteService.ts
import { querySqlServer, sql } from '../../config/sqlServerClient';

export async function getVentas(iditem: string, idlocation: string, inicioStr: string, finStr: string) {

    const orden = await querySqlServer(
      `
        SELECT * FROM OPENQUERY(NS_CLIENTE, '
            SELECT SUM(tl.quantity) Quantity
            FROM transactionline tl
            Inner join transaction t on tl.transaction=t.id 
            WHERE tl.item =''${iditem}'' and 
            tl.location=''${idlocation}'' and
            t.type=''CustInvc'' and 
            tl.itemtype=''InvtPart'' and 
            t.TranDate BETWEEN TO_DATE( ''${inicioStr}'' , ''YYYY-MM-DD'' ) AND TO_DATE( ''${finStr}'' , ''YYYY-MM-DD'' ) and 
            accountinglinetype=''INCOME''
        ')
      `,
      [
        { name: 'iditem', type: sql.VarChar, value: iditem },
        { name: 'idlocation', type: sql.VarChar, value: idlocation },
        { name: 'inicioStr', type: sql.VarChar, value: inicioStr },
        { name: 'finStr', type: sql.VarChar, value: finStr }
      ], 
    );
  return await orden[0]?.Quantity ?? 0;
}