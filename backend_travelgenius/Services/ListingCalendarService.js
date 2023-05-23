/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getListingCalendarByIdentifierDAO,
        getListingCalendarsForOrByDifferentEntitiesDAO,
        getAvailableListingCalendarsForTheSearchQueryDAO,
        AddListingCalendarDAO,
        UpdateAvailableListingCalendarDAO,
        DeleteAvailableListingCalendarDAO
    } = require("../DAO/ListingCalendarDAO");
const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");
const RuleViolationError = require("../Errors/RuleViolationError");

/*  **********************************************************
                    Services
    ********************************************************** */
// 1. Get ListingCalendar By Identifier
const getListingCalendarByIdentifierService = async (listingId, ListingCalendar_Date) => {
    const listingCalendar = await getListingCalendarByIdentifierDAO(listingId, ListingCalendar_Date);
    if (listingCalendar.length == 0) {
        throw new NotFoundError(`ListingCalendar with identifier (${listingId}, ${ListingCalendar_Date}) does not exist.`);
    }
    
    return listingCalendar[0];
}

// 1.2 Get ListingCalendars By Listing
const getListingCalendarsByListingService = async (listingId) => {    
    const listingCalendars = await getListingCalendarsForOrByDifferentEntitiesDAO('listingId', listingId);
    return listingCalendars;
}

// 1.3 Get ListingCalendars By Listing
const getListingCalendarsByHostService = async (hostId) => {
    const listingCalendars = await getListingCalendarsForOrByDifferentEntitiesDAO('hostId', hostId);
    return listingCalendars;
}


// 1.4 Search query
const getAvailableListingCalendarsForTheSearchQueryService = async (input) => {
    if (new Date(input.dateRange.lowerBound) > new Date(input.dateRange.upperBound)) {
        throw new RuleViolationError("dateRange error: lowerBound must be <= upperBound");
    } else if (parseInt(input.priceRange.lowerBound) > parseInt(input.priceRange.upperBound)) {
        throw new RuleViolationError("priceRange error: lowerBound must be <= upperBound");
    } else if (parseInt(input.noBeds.lowerBound) > parseInt(input.noBeds.upperBound)) {
        throw new RuleViolationError("noBeds error: lowerBound must be <= upperBound");
    }

    const listingCalendars = await getAvailableListingCalendarsForTheSearchQueryDAO(input);
    return listingCalendars;
}


// 2. Add ListingCalendar
const AddListingCalendarService = async (listingCalendar) => {
    // Rule Violations 
    if ((new Date(listingCalendar.listingCalendar_Date) < (new Date()))) {
        throw new RuleViolationError("listingCalendar must be a future date");
    } else if (parseFloat(listingCalendar.listingCalendar_AdjustedPrice) > parseFloat(listingCalendar.listingCalendar_Price)) {
        throw new RuleViolationError("AdjustedPrice cannot be more than OriginalPrice");
    }

    checkForPriceRange(listingCalendar);

    // Check for duplicate (listingId, listingCalendar_Date)
    const res = await getListingCalendarByIdentifierDAO(listingCalendar.listingId, listingCalendar.listingCalendar_Date);
    if (res.length != 0) {
        throw new ItemAlreadyExistsError(`ListingCalendar with identifier (${listingCalendar.listingId}, ${listingCalendar.listingCalendar_Date}) already exists.`);
    }
    
    const result = await AddListingCalendarDAO(listingCalendar);
    return result;
}

// 3. Update Available ListingCalendar
const UpdateAvailableListingCalendarService = async (listingCalendar) => {
    // Rule Violations 
    if (parseFloat(listingCalendar.listingCalendar_AdjustedPrice) > parseFloat(listingCalendar.listingCalendar_Price)) {
        throw new RuleViolationError("AdjustedPrice cannot be more than OriginalPrice");
    }

    checkForPriceRange(listingCalendar);
    
    const res = await getListingCalendarByIdentifierService(listingCalendar.listingId, listingCalendar.listingCalendar_Date);
    if (res.listingCalendar_isAvailable == 0) {
        throw new RuleViolationError("This listingCalendar is already reserved. Hence, currently, no changes can be made.");
    }
    
    await UpdateAvailableListingCalendarDAO(listingCalendar);
}

// 4. Delete Available ListingCalendar
const DeleteAvailableListingCalendarService = async (listingId, ListingCalendar_Date) => {
    const res = await getListingCalendarByIdentifierService(listingId, ListingCalendar_Date);
    if (res.listingCalendar_isAvailable == 0) {
        throw new RuleViolationError("This listingCalendar is already reserved. Hence, currently, cannot be deleted.");
    }
    
    await DeleteAvailableListingCalendarDAO(listingId, ListingCalendar_Date);
}


// Common Functions
const checkForPriceRange = (listingCalendar) => {
    if (!(0 < listingCalendar.listingCalendar_Price  &&  listingCalendar.listingCalendar_Price < 50000)) {
        throw new RuleViolationError('listingPrice must be in the range (0, 50000)')
    }

    if (!(0 < listingCalendar.listingCalendar_AdjustedPrice  &&  listingCalendar.listingCalendar_AdjustedPrice < 50000)) {
        throw new RuleViolationError('AdjustedPrice must be in the range (0, 50000)')
    }
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getListingCalendarByIdentifierService,
    getListingCalendarsByListingService,
    getListingCalendarsByHostService,
    getAvailableListingCalendarsForTheSearchQueryService,
    AddListingCalendarService,
    UpdateAvailableListingCalendarService,
    DeleteAvailableListingCalendarService
}

