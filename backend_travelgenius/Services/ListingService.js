/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getListingByIdDAO,
        getListingByHostIdDAO,
        getListingByFieldDAO,
        getListingAmenitiesByListingIdDAO,
        AddListingDAO,
        UpdateListingLicenseDAO,
        DeleteListingDAO
    } = require("../DAO/ListingDAO");
const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const RuleViolationError = require("../Errors/RuleViolationError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");
const { urlPattern } = require("../Helpers/CommonData");


/*  **********************************************************
                    Services
    ********************************************************** */
// 1.1. Get Listing By Id
const getListingByIdService = async (listingId) => {
    const listing = await getListingByIdDAO(listingId);
    if (listing.length == 0) {
        throw new NotFoundError(`Listing with id ${listingId} does not exist.`);
    }
    
    return listing[0];
}

// 1.2. Get Listing By HostId
const getListingByHostIdService = async (hostId) => {
    const listings = await getListingByHostIdDAO(hostId);
    return listings;
}

// 1.3. Get ListingAmenities By ListingId
const getListingAmenitiesService = async (listingId) => {
    const amenities = await getListingAmenitiesByListingIdDAO(listingId);
    return amenities;
}

// 2. Add Listing
const AddListingService = async (listing) => {
    await duplicateCheck(listing, -1);

    const result = await AddListingDAO(listing);
    return result;
}

// 3.1 Update Listing License
const UpdateListingLicenseService = async (listingId, listingLicense) => {
    await getListingByIdService(listingId);
    await UpdateListingLicenseDAO(listingId, listingLicense);
}


// 4. Delete Listing
const DeleteListingService = async (listingId) => {
    await getListingByIdService(listingId);
    await DeleteListingDAO(listingId);
}


// Common Functions
const duplicateCheck = async (listing, listingId) => {
    var res = await getListingByFieldDAO(listingId, 'listingUrl', listing.listingUrl);
    if (res.length != 0) {
        throw new ItemAlreadyExistsError(`Another listing with listingUrl ${listing.listingUrl} already exist.`);
    }

    res = await getListingByFieldDAO(listingId, 'listingPictureUrl', listing.listingPictureUrl);
    if (res.length != 0) {
        throw new ItemAlreadyExistsError(`Another listing with listingPictureUrl ${listing.listingPictureUrl} already exist.`);
    }
}

/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getListingByIdService,
    getListingByHostIdService,
    getListingAmenitiesService,
    AddListingService,
    UpdateListingLicenseService,
    DeleteListingService
}

