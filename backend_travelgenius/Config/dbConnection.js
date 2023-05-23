/*  **********************************************************
                    Imports
    ********************************************************** */
var mysql = require('mysql2/promise');
const dotenv = require("dotenv").config();
const { formatSQLresultToArray } = require("../Helpers/Conversions");
const { dbProperties } = require("./dbProperties.js");
const JSONbig = require('json-bigint');
const bigInt = require('big-integer');


/*  **********************************************************
                Connection & Generic Queries
    ********************************************************** */
// 1. HANDSHAKE:  Connect to DB (Invoke only once)
const connectToDB = async () => {
    const connectDb = await mysql.createConnection(JSONbig.parse(dbProperties));
    connectDb.end();
}

// 2. Generic Query Implementations  -->  [Used by multiple files in DAO layer]
const implementReadQuery = async (selectQuery) => {
    const connectDb = await mysql.createConnection(JSONbig.parse(dbProperties));

    const [rows, fields] = await connectDb.query(selectQuery);
    connectDb.end();

    return formatSQLresultToArray(rows);
}

const implementWriteQuery = async (writeQuery) => {
    const connectDb = await mysql.createConnection(JSONbig.parse(dbProperties));
    const [result] = await connectDb.query(writeQuery);
    connectDb.end();
}

const implementStoredProcedure = async (procedure, outParam) => {
    const connectDb = await mysql.createConnection(JSONbig.parse(dbProperties));

    const [rows, fields] = await connectDb.execute(procedure);
    const outValue = rows[0][0][outParam];
    connectDb.end()

    return String(bigInt(outValue));
} 

/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    connectToDB,
    implementReadQuery,
    implementWriteQuery,
    implementStoredProcedure
};

