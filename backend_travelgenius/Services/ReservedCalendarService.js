/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getReservedCalendarByIdentifierDAO,
        getReservedCalendarsForOrByDifferentEntitiesDAO,
        getActiveReservedCalendarsForOrByDifferentEntitiesDAO,
        AddReservedCalendarDAO
    } = require("../DAO/ReservedCalendarDAO");
const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");

// Remote Calls
const { getListingCalendarByIdentifierService } = require("./ListingCalendarService");
const { getCustomerByIdService } = require("./CustomerService");
const { getPaymentByIdService } = require("./PaymentService");

/*  **********************************************************
                    Services
    ********************************************************** */
// 1. Get ReservedCalendar By Identifier
const getReservedCalendarByIdentifierService = async (listingId, listingCalendar_Date) => {
    const reservedCalendar = await getReservedCalendarByIdentifierDAO(listingId, listingCalendar_Date);
    if (reservedCalendar.length == 0) {
        throw new NotFoundError(`ReservedCalendar with identifier (${listingId}, ${listingCalendar_Date}) does not exist.`);
    }
    
    return reservedCalendar[0];
}

// 1.2 Get ReservedCalendars By Listing
const getReservedCalendarsByListingService = async (listingId) => {    
    const reservedCalendars = await getReservedCalendarsForOrByDifferentEntitiesDAO('listingId', listingId);
    return reservedCalendars;
}

// 1.3 Get ReservedCalendars By Customer
const getReservedCalendarsByCustomerService = async (userId) => {    
    const reservedCalendars = await getReservedCalendarsForOrByDifferentEntitiesDAO('customerId', userId);
    return reservedCalendars;
}

// 1.4 Get Active ReservedCalendars By Host
const getActiveReservedCalendarsByHostService = async (userId) => {    
    const reservedCalendars = await getActiveReservedCalendarsForOrByDifferentEntitiesDAO('hostId', userId);
    return reservedCalendars;
}

// 1.5 Get Active ReservedCalendars By Customer
const getActiveReservedCalendarsByCustomerService = async (userId) => {
    const reservedCalendars = await getActiveReservedCalendarsForOrByDifferentEntitiesDAO('customerId', userId);
    return reservedCalendars;
}

// 2. Add ReservedCalendar
const AddReservedCalendarService = async (reservedCalendar) => {
    // Check for foreign entity existence
    await getListingCalendarByIdentifierService(reservedCalendar.listingId, reservedCalendar.listingCalendar_Date);
    await getCustomerByIdService(reservedCalendar.customerId);
    await getPaymentByIdService(reservedCalendar.paymentId);

    // Check for duplicate (listingId, listingCalendar_Date)
    const res = await getReservedCalendarByIdentifierDAO(reservedCalendar.listingId, reservedCalendar.listingCalendar_Date);
    if (res.length != 0) {
        throw new ItemAlreadyExistsError(`ListingCalendar with identifier (${reservedCalendar.listingId}, ${reservedCalendar.listingCalendar_Date}) is alredy reserved.`);
    }
    
    const result = await AddReservedCalendarDAO(reservedCalendar);
    return result;
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getReservedCalendarByIdentifierService,
    getReservedCalendarsByListingService,
    getReservedCalendarsByCustomerService,
    getActiveReservedCalendarsByHostService,
    getActiveReservedCalendarsByCustomerService,
    AddReservedCalendarService
}

