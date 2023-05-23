/*  **********************************************************
                    Imports
    ********************************************************** */
const {
    implementReadQuery,
    implementWriteQuery,
    implementStoredProcedure
} = require("../Config/dbConnection");

const { getCurrentDateOnly } = require("../Helpers/DateFunctions");

/*  **********************************************************
                    DAO Implementation
    ********************************************************** */
// 1. Get ReservedCalendar By Identifier
const getReservedCalendarByIdentifierDAO = async (listingId, listingCalendar_Date) => {
    var sqlQuery = `SELECT * FROM ReservedCalendarInfo
                    WHERE listingId = ${listingId} and listingCalendar_Date = '${listingCalendar_Date}'`;
    var result = await implementReadQuery(sqlQuery)

    return result;
}

// 1.2 Get ReservedCalendar By/For Different Entities
const getReservedCalendarsForOrByDifferentEntitiesDAO = async (field, fieldValue) => {
    var sqlQuery = `SELECT * FROM ReservedCalendarInfo
                    WHERE ${field} = '${fieldValue}'`;
    
    var result = await implementReadQuery(sqlQuery);

    return result;
}

// 1.2 Get Active ReservedCalendar By/For Different Entities
const getActiveReservedCalendarsForOrByDifferentEntitiesDAO = async (field, fieldValue) => {
    const today = getCurrentDateOnly();
    var sqlQuery = `SELECT * FROM ReservedCalendarInfo
                    WHERE ${field} = '${fieldValue}'
                         AND listingCalendar_Date >= '${today}'` ;
    
    var result = await implementReadQuery(sqlQuery);
    
    return result;
}


// 2. Add ReservedCalendar
const AddReservedCalendarDAO = async (reservedCalendar) => {
    var outParam = "out_listingId";
    var values = ["'" + reservedCalendar.listingId + "'",
                    "'" + reservedCalendar.listingCalendar_Date + "'",
                    "'" + reservedCalendar.customerId + "'",
                    "'" + reservedCalendar.paymentId + "'",
                    '@' + outParam
                   ].join(',');
    var procedure = 'CALL procedure_insertReservedCalendar(' + values + ')';
    procedure = procedure.replace(/'undefined'/g, `null`).replace(/'null'/g, `null`);
    
    var result = await implementStoredProcedure(procedure, outParam);
    return result;
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getReservedCalendarByIdentifierDAO,
    getReservedCalendarsForOrByDifferentEntitiesDAO,
    getActiveReservedCalendarsForOrByDifferentEntitiesDAO,
    AddReservedCalendarDAO
};

