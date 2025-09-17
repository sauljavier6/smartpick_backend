// src/services/netSuiteService.ts
import { querySqlServer, sql } from '../../config/sqlServerClient';

export async function getOrdersTraslate(idEstado: string) {
    const orden = await querySqlServer(
      `
          SELECT * FROM OPENQUERY(NS_CLIENTE, '
          SELECT TOP 50 
              t.tranid,
              t.trandate,
              t.location,
              l.fullname AS transferlocation,
              t.employee,
              t.firmed,
              t.useitemcostastransfercost,
              ts.name AS status
          FROM transaction t
          INNER JOIN location l ON t.transferlocation = l.id
          INNER JOIN transactionstatus ts 
              ON t.status = ts.id 
              AND ts.trantype = ''TrnfrOrd''
          WHERE 
              ts.id = ''${idEstado}'' 
              AND t.abbrevtype = ''TRNFRORD''
          ORDER BY t.trandate DESC
      ')
      `,
      [
        { name: 'ordencompra', type: sql.VarChar, value: idEstado }
      ], 
    );
  return await orden;   
}


export async function getOrderTraslate(id: string) {
    const orden = await querySqlServer(
      `
      SELECT * FROM OPENQUERY(NS_CLIENTE, '
          SELECT t.tranid, t.trandate, t.location, l.fullname transferlocation, t.employee, t.firmed, t.useitemcostastransfercost, ts.name status
          FROM transaction t
          INNER JOIN location l on t.transferlocation=l.id
          INNER JOIN transactionstatus ts on t.status=ts.id and ts.trantype = ''TrnfrOrd''
          WHERE 
          t.tranid=''${id}'' and 
          t.abbrevtype=''TRNFRORD''
      ')
      `,
      [
        { name: 'ordencompra', type: sql.VarChar, value: id }
      ], 
    );
  return await orden[0];   
}

export async function getOrdersItems(id: string) {
    const orden = await querySqlServer(
      `
      SELECT * FROM OPENQUERY(NS_CLIENTE, '
          SELECT tl.item,tl.memo, tl.quantity, i.upccode, Builtin.DF(i.custitem_nso_categoria_articulo) categoria, i.custitem_nso_codigo_citadel, 
          Builtin.DF(i.custitem_nso_departamento_articulo) departamento, i.custitem_nso_departamento_articulo iddepartamento
          FROM transactionline tl
          Inner join transaction t on tl.transaction=t.id
          Inner join item i on tl.item=i.id
          WHERE 
          t.tranid=''${id}''
          and tl.itemtype in(''InvtPart'')
          and t.abbrevtype=''TRNFRORD'' 
          and Builtin.DF(tl.transactionlinetype)=''Orden de traslado: Recepción''
      ')
      `,
      [
        { name: 'ordencompra', type: sql.VarChar, value: id }
      ], 
    );
  return await orden;   
}