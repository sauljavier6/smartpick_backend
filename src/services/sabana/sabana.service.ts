// src/services/netSuiteService.ts
import { querySqlServerBCT, sql } from '../../config/sqlServerClientBCT';

export async function getSabanaData(proveedor: string) {
    const sanabadata = await querySqlServerBCT(
      `
        SELECT distinct ve.cajero, SUM(vp.importePagado) AS total_pagado,  SUM(CASE WHEN pfc.description = 'EFECTIVO' THEN vp.importePagado ELSE 0 END) AS total_efectivo,
            SUM(CASE WHEN pfc.description = 'TARJETA CREDITO' THEN vp.importePagado ELSE 0 END) AS total_tarjeta_credito,
            SUM(CASE WHEN pfc.description = 'TARJETA DEBITO' THEN vp.importePagado ELSE 0 END) AS total_tarjeta_debito,
            SUM(CASE WHEN pfc.description = 'CHEQUE' THEN vp.importePagado ELSE 0 END) AS total_cheque,
            SUM(CASE WHEN pfc.description = 'VALES CALIMAX' THEN vp.importePagado ELSE 0 END) AS total_vales_calimax
        FROM ventas_encabezado ve 
        inner join ventas_pagos vp on ve.id=vp.id
        left join PAY_FORMS_CFDI pfc on vp.tipoPago=pfc.id_tender_ncr
        WHERE ve.sucursal='422' and ve.fecha='2025-08-17' and ve.cajero='15318'
        GROUP BY ve.cajero
        ORDER BY ve.cajero;
      `, 
      [
        { name: 'sabanas', type: sql.VarChar, value: proveedor }
      ], 
    );
  return await sanabadata;   
}