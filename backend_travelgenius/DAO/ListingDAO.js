/*  **********************************************************
                    Imports
    ********************************************************** */
const {
    implementReadQuery,
    implementWriteQuery,
    implementStoredProcedure
} = require("../Config/dbConnection");

const bigInt = require('big-integer');

/*  **********************************************************
                    DAO Implementation
    ********************************************************** */
// 1.1. Get Listing By Id
const getListingByIdDAO = async (listingId) => {
    // Get Listing
    var sqlQuery1 = `SELECT * FROM ListingInfo
                    WHERE listingId = '${listingId}'`;
    var result = await implementReadQuery(sqlQuery1);
    
    if (result.length > 0) {
        result[0].amenities = await getListingAmenitiesByListingIdDAO(listingId);
    }
    
    return result;
}

// 1.2. Get Listing By Host Id
const getListingByHostIdDAO = async (hostId) => {
    // Get Listing
    var sqlQuery1 = `SELECT * FROM ListingInfo
                    WHERE hostId = '${hostId}'`;
    var result = await implementReadQuery(sqlQuery1)
    
    return result;
}

// 1.3. Get ListingAmenities By ListingId
const getListingAmenitiesByListingIdDAO = async (listingId) => {
    // Get Property Amentities
    var sqlQuery2 = `SELECT amenity FROM PropertyAmenities
                    WHERE listingId = '${listingId}'`;
    var amenities = await implementReadQuery(sqlQuery2)
    amenities = amenities.map(row => (row.amenity))
    
    return amenities;
}


// 1.4. Check for potential duplicates
const getListingByFieldDAO = async (listingId, field, fieldValue) => {
    var sqlQuery = `SELECT * FROM ListingInfo
                    WHERE listingId <> '${listingId}'
                            AND ${field} = '${fieldValue}'`;
    var result = await implementReadQuery(sqlQuery);

    return result;
}


// 2. Add Listing
const AddListingDAO = async (listing) => {
    var outParam = "out_listingId";
    var values = [  "'" + listing.listingName + "'",
                    "'" + listing.listingDescription + "'",
                    "'" + listing.listingPictureUrl + "'",
                    "'" + listing.listingLicense + "'",
                    "'" + listing.listingInstantBookable + "'",
                    "'" + listing.listingMinimumNights + "'",
                    "'" + listing.listingMaximumNights + "'",
                    "'" + listing.hostId + "'",
                    
                    "'" + listing.propertyType + "'",
                    "'" + listing.roomType + "'",
                    "'" + listing.accommodates + "'",
                    "'" + listing.noBathrooms + "'",
                    "'" + listing.bathroomType + "'",
                    "'" + listing.noBedrooms + "'",
                    "'" + listing.noBeds + "'",
                    "'" + listing.amenities + "'",
                    "'" + listing.propertyNeighbourhood + "'",
                    "'" + listing.propertyNeighborhoodOverview + "'",
                    "'" + listing.propertyNeighbourhoodCleansed + "'",
			        "'" + listing.propertyCoordinates.x + "'",
                    "'" + listing.propertyCoordinates.y + "'",
                    '@' + outParam
                   ].join(',');
    var procedure = 'CALL procedure_insertListing(' + values + ')';
    procedure = procedure.replace(/'undefined'/g, `null`).replace(/'null'/g, `null`);

    var result = await implementStoredProcedure(procedure, outParam);
    return result;
}

// 3.1. Update Listing
const UpdateListingLicenseDAO = async (listingId, listingLicense) => {
    var sqlQuery = `UPDATE Listing
                    SET
                        listingLicense = '${listingLicense}'
                    WHERE listingId = '${listingId}'`;
    
    await implementWriteQuery(sqlQuery);
}


// 4. Delete Listing
const DeleteListingDAO = async (listingId) => {
    var outParam = "out_listingId";
    var values = ["'" + listingId + "'",
                    '@' + outParam
                   ].join(',');
    var procedure = 'CALL procedure_deleteListing(' + values + ')';
    procedure = procedure.replace(/'undefined'/g, `null`).replace(/'null'/g, `null`);
    
    var result = await implementStoredProcedure(procedure, outParam);
    return result;
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getListingByIdDAO,
    getListingByHostIdDAO,
    getListingByFieldDAO,
    getListingAmenitiesByListingIdDAO,
    AddListingDAO,
    UpdateListingLicenseDAO,
    DeleteListingDAO
};

