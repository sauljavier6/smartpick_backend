// src/services/netSuiteService.ts
import { querySqlServer, sql } from '../../config/sqlServerClient';

export async function getProveedoresFromNetSuite(proveedor: string) {
    const searsProveedorResult = await querySqlServer(
      `
      SELECT * FROM OPENQUERY(NS_CLIENTE, '
        select distinct iv.vendor as iv_vendor, v.altname as v_altname,v.companyname as v_companyname from itemVendor iv 
            left join vendor v on v.id=iv.vendor
            where v.isinactive=''F'' and  v.custentityes_acreedor=''1''
            AND v.companyname LIKE ''%${proveedor}%''
      ')
      `, 
      [
        { name: 'ticket', type: sql.VarChar, value: proveedor }
      ], 
    );
  return await searsProveedorResult;   
}
