// src/services/netSuiteService.ts
import { querySqlServer, sql } from '../../config/sqlServerClient';

export async function getUser(idUser: number, email: string) {
    const loginResult = await querySqlServer(
      `
      SELECT * FROM OPENQUERY(NS_CLIENTE, '
          SELECT *
          FROM Employee
          WHERE custentity_nso_numero_empleado_nomina=''${idUser}'' and
          email=''${email}''
      ')
      `, 
      [
        { name: 'iduser', type: sql.VarChar, value: idUser },
        { name: 'email', type: sql.VarChar, value: email }
      ], 
    );
  return await loginResult?.[0];
}
