/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getCustomerByIdDAO,
        getNonCurrentCustomerByFieldDAO,
        AddCustomerDAO,
        UpdateCustomerDAO,
        DeactivateCustomerDAO
    } = require("../DAO/CustomerDAO");
const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");
const { emailPattern } = require("../Helpers/CommonData");

// remote calls
const { getActiveReservedCalendarsForOrByDifferentEntitiesDAO } = require("../DAO/ReservedCalendarDAO");

/*  **********************************************************
                    Services
    ********************************************************** */
// 1. Get Customer By Id
const getCustomerByIdService = async (userId) => {
    const customer = await getCustomerByIdDAO(userId);
    if (customer.length == 0) {
        throw new NotFoundError(`Customer with id ${userId} does not exist.`);
    }
    
    return customer[0];
}

// 2. Add Customer
const AddCustomerService = async (customer) => {
    // Check for duplicate email
    const res = await getNonCurrentCustomerByFieldDAO(-1, 'userEmail', customer.userEmail);
    if (res.length != 0) {
        throw new ItemAlreadyExistsError(`Another customer with email ${customer.userEmail} already exist.`);
    }
    
    const result = await AddCustomerDAO(customer);
    return result;
}

// 3. Update Customer
const UpdateCustomerService = async (customer) => {
    // Check for duplicate email
    const res = await getNonCurrentCustomerByFieldDAO(customer.userId, 'userEmail', customer.userEmail);
    if (res.length != 0) {
        throw new ItemAlreadyExistsError(`Another customer with email ${customer.userEmail} already exist.`);
    }

    await getCustomerByIdService(customer.userId);
    await UpdateCustomerDAO(customer);
}

// 4. Deactivate Customer
const DeactivateCustomerService = async (userId) => {
    await getCustomerByIdService(userId);
    
    const activeReservations = await getActiveReservedCalendarsForOrByDifferentEntitiesDAO('customerId', userId);
    if (activeReservations.length > 0) {
        throw new ItemAlreadyExistsError(`There are active reservations for Customer with Id ${userId}. Please clear those first.`);
    }

    await DeactivateCustomerDAO(userId);
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getCustomerByIdService,
    AddCustomerService,
    UpdateCustomerService,
    DeactivateCustomerService
}

