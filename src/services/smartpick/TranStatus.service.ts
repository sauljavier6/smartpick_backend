// src/services/netSuiteService.ts
import { querySqlServer, sql } from '../../config/sqlServerClient';

export async function getStatusOrder() {
    const statusResult = await querySqlServer(
      `
        SELECT * FROM OPENQUERY(NS_CLIENTE, '
            SELECT * 
            FROM transactionstatus ts
            WHERE ts.trantype = ''TrnfrOrd''
        ');
      `,  
    );
  return await statusResult;
}
