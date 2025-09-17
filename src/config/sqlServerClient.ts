// src/config/sqlServerClient.ts
import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const sqlServerConfig: sql.config = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  server: process.env.SQLSERVER_SERVER!,
  database: process.env.SQLSERVER_DATABASE!,
  options: {
    encrypt: false,//true, desactivado solo en red local
    trustServerCertificate: true
  }
};

export async function querySqlServer(query: string, params: { name: string, type: any, value: any }[] = []) {
  try {
    const pool = await sql.connect(sqlServerConfig);
    const request = pool.request();

    params.forEach(({ name, type, value }) => {
      request.input(name, type, value);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Error en SQL Server:', err);
    throw err;
  }
}

export { sql };
