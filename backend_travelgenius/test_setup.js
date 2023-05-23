const mysql = require('mysql2/promise');
const dotenv = require("dotenv").config();
const fs = require('fs');
const JSONbig = require('json-bigint');

async function createMockDatabase() {
  const dbProperties = JSONbig.parse(process.env.MOCK_CONNECTION_STRING);

  const connection = await mysql.createConnection ({
    host: dbProperties.host,
    port: dbProperties.port,
    user: dbProperties.user,
    password: dbProperties.password
  });

  await connection.query(`DROP DATABASE IF EXISTS ${dbProperties.database}`);
  await connection.query(`CREATE DATABASE ${dbProperties.database}`);
  connection.end();
}


async function setupMockDatabase() {
  const dbProperties = JSONbig.parse(process.env.MOCK_CONNECTION_STRING);
  dbProperties["multipleStatements"] = true;

  const connection = await mysql.createConnection(dbProperties);

  const script1 = fs.readFileSync("./__data__/1_RelationalModel.sql", "utf8")
                      .replaceAll('DELIMITER @@', '')
                      .replaceAll('DELIMITER ;', '')
                      .replaceAll('DELIMITER', '')
                      .replaceAll('@@', '');
  await connection.query(script1);

  const script2 = fs.readFileSync("./__data__/2_ViewsAndStoredProcedures.sql", "utf8")
                      .replaceAll('DELIMITER @@', '')
                      .replaceAll('DELIMITER ;', '')
                      .replaceAll('DELIMITER', '')
                      .replaceAll('@@', '');
  await connection.query(script2);
  
  connection.end();
}

async function loadData() {
  const dbProperties = JSONbig.parse(process.env.MOCK_CONNECTION_STRING);
  dbProperties["multipleStatements"] = true;
  
  const connection = await mysql.createConnection(dbProperties);

  const script = fs.readFileSync("./__tests__/MockData/3_LoadData.sql", "utf8");
  await connection.query(script);
  connection.end();
}

async function setup() {
  await createMockDatabase();
  await setupMockDatabase();
  await loadData();
}

module.exports = setup;
