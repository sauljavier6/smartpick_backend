// src/services/netSuiteService.ts
import { querySqlServer, sql } from '../../config/sqlServerClient';

export async function getProduct(upccode: string) {
    const product = await querySqlServer(
      `
        SELECT * FROM OPENQUERY(NS_CLIENTE, '
          SELECT TOP 50 
             i.description, i.upccode, i.custitem_nso_marca_articulo, i.custitem_nso_origen_articulo, i.custitem_nso_categoria_articulo
          FROM item i
          WHERE 
              i.upccode=''0724836004024''
      ')
      `,
      [
        { name: 'ordencompra', type: sql.VarChar, value: upccode }
      ],
    );
  return await product;   
}
