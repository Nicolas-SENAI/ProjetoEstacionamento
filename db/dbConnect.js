// Este arquivo é responsavel por todas as conexões com o banco de dados
// Se estiver usando banco de dados local garanta que : 
//  - O banco (CREATE DATABASE) já tenha sido criado.
//  - O banco esteja no ar.
//  - O XAMPP MySQL esteja iniciado

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function executarQuery(query, params = []) {
  
  console.log('=====================================================================');
  console.log('dbConnect.js','executarQuery()');
  console.log('Query:', query);
  console.log('Params:', params);

  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(query, params);
    console.log('=====================================================================');
    return rows;
  } catch (err) {
    console.error('Erro ao executar query:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { executarQuery, pool };

