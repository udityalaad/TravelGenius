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
// 1. Get ListingCalendar By Id
const getListingCalendarByIdentifierDAO = async (listingId, ListingCalendar_Date) => {
    var sqlQuery = `SELECT * FROM ListingCalendarInfo
                    WHERE listingId = ${listingId} and listingCalendar_Date = '${ListingCalendar_Date}'`;

    var result = await implementReadQuery(sqlQuery)

    return result;
}


// 1.2 Get ListingCalendar By/For Different Entities
const getListingCalendarsForOrByDifferentEntitiesDAO = async (field, fieldValue) => {
    var sqlQuery = `SELECT * FROM ListingCalendarInfo
                    WHERE ${field} = '${fieldValue}'`;
    
    var result = await implementReadQuery(sqlQuery);
    return result;
}


// 1.3. Search Query
const getAvailableListingCalendarsForTheSearchQueryDAO = async (input) => {
    var sqlQuery = `SELECT * FROM ListingCalendarInfo
        WHERE listingCalendar_isAvailable = 1
            AND (listingCalendar_Date BETWEEN '${input.dateRange.lowerBound}' AND '${input.dateRange.upperBound}')
            AND ( (listingCalendar_AdjustedPrice BETWEEN ${input.priceRange.lowerBound}  AND  ${input.priceRange.upperBound})
                    OR 
                    (listingCalendar_Price BETWEEN ${input.priceRange.lowerBound}  AND  ${input.priceRange.upperBound})
                )
            AND (noBeds BETWEEN ${input.noBeds.lowerBound} AND ${input.noBeds.upperBound})
            AND ST_Distance(propertyCoordinates, ST_GeomFromText('POINT(${input.location.position.x} ${input.location.position.y})'))  BETWEEN ${-input.location.maxRange / 100} AND ${input.location.maxRange / 100}`;
    
    var result = await implementReadQuery(sqlQuery);
    
    return result;
}

// 2. Add ListingCalendar
const AddListingCalendarDAO = async (listingCalendar) => {
    var outParam = "out_listingId";
    var values = ["'" + listingCalendar.listingId + "'",
                    "'" + listingCalendar.listingCalendar_Date + "'",
                    "'" + listingCalendar.listingCalendar_Price + "'",
                    "'" + listingCalendar.listingCalendar_AdjustedPrice + "'",
                    '@' + outParam
                   ].join(',');
    var procedure = 'CALL procedure_insertListingCalendar(' + values + ')';
    procedure = procedure.replace(/'undefined'/g, `null`).replace(/'null'/g, `null`);
    
    var result = await implementStoredProcedure(procedure, outParam);
    return result;
}

// 3. Update Available ListingCalendarDAO
const UpdateAvailableListingCalendarDAO = async (listingCalendar) => {
    var sqlQuery = `UPDATE ListingCalendar
                    SET
                        listingId = '${listingCalendar.listingId}',
                        listingCalendar_Date = '${listingCalendar.listingCalendar_Date}',
                        listingCalendar_Price = '${listingCalendar.listingCalendar_Price}',
                        listingCalendar_AdjustedPrice = '${listingCalendar.listingCalendar_AdjustedPrice}'
                    WHERE listingId = '${listingCalendar.listingId}'
                            AND  listingCalendar_Date = '${listingCalendar.listingCalendar_Date}'`;

    await implementWriteQuery(sqlQuery);
}

// 4. Delete ListingCalendar
const DeleteAvailableListingCalendarDAO = async (listingId, ListingCalendar_Date) => {
    var sqlQuery = `DELETE FROM ListingCalendar
                    WHERE listingId = '${listingId}'
                            AND  listingCalendar_Date = '${ListingCalendar_Date}'`;
    await implementWriteQuery(sqlQuery);
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getListingCalendarByIdentifierDAO,
    getListingCalendarsForOrByDifferentEntitiesDAO,
    getAvailableListingCalendarsForTheSearchQueryDAO,
    AddListingCalendarDAO,
    UpdateAvailableListingCalendarDAO,
    DeleteAvailableListingCalendarDAO
};

