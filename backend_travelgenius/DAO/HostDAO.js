/*  **********************************************************
                    Imports
    ********************************************************** */
const {
    implementReadQuery,
    implementWriteQuery,
    implementStoredProcedure
} = require("../Config/dbConnection");



/*  **********************************************************
                    DAO Implementation
    ********************************************************** */
// 1. Get Host By Id
const getHostByIdDAO = async (userId) => {
    var sqlQuery = `SELECT * FROM Host
                    WHERE userId = '${userId}'`;
                    
    var result = await implementReadQuery(sqlQuery)

    return result;
}

// 1.2 Get potential-duplicates
const getNonCurrentHostByFieldDAO = async (userId, field, fieldValue) => {
    var sqlQuery = `SELECT * FROM Host
                    WHERE userId <> '${userId}'
                            AND ${field} = '${fieldValue}'`;
                              
    var result = await implementReadQuery(sqlQuery);

    return result;
}


// 2. Add Host
const AddHostDAO = async (host) => {
    var outParam = "out_userId";
    var values = ["'" + host.userName + "'",
                    "'" + host.userEmail + "'",
                    "'" + host.password + "'",
                    "'" + host.hostAbout + "'",
                    host.isSuperhost,
                    "'" + host.hostThumbnailUrl + "'",
                    "'" + host.hostPictureUrl + "'",
                    "'" + host.hostLocation + "'",
                    "'" + host.hostNeighbourhood + "'",
                    '@' + outParam
                   ].join(',');
    var procedure = 'CALL procedure_insertHost(' + values + ')';
    procedure = procedure.replace(/'undefined'/g, `null`).replace(/'null'/g, `null`);

    var result = await implementStoredProcedure(procedure, outParam);
    return result;
}


// 3. Update Host
const UpdateHostDAO = async (host) => {
    var outParam = "out_userId";
    var values = ["'" + host.userId + "'",
                    "'" + host.userName + "'",
                    "'" + host.userEmail + "'",
                    "'" + host.hostAbout + "'",
                    host.isSuperhost,
                    "'" + host.hostThumbnailUrl + "'",
                    "'" + host.hostPictureUrl + "'",
                    "'" + host.hostLocation + "'",
                    "'" + host.hostNeighbourhood + "'",
                    '@' + outParam
                   ].join(',');
    var procedure = 'CALL procedure_updateHost(' + values + ')';
    procedure = procedure.replace(/'undefined'/g, `null`).replace(/'null'/g, `null`);
    
    await implementWriteQuery(procedure);
}

// 4. Delete Host
const DeleteHostDAO = async (userId) => {
    var sqlQuery = `UPDATE HostAccount
                        SET isHostAccountActive = '0'
                        WHERE userId = '${userId}'`;
    await implementWriteQuery(sqlQuery);
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getHostByIdDAO,
    getNonCurrentHostByFieldDAO,
    AddHostDAO,
    UpdateHostDAO,
    DeleteHostDAO
};

