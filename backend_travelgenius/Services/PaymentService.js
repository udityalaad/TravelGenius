/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getPaymentByIdDAO,
        AddPaymentDAO,
        UpdatePaymentStatusDAO
    } = require("../DAO/PaymentDAO");
const NotFoundError = require("../Errors/NotFoundError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");


/*  **********************************************************
                    Services
    ********************************************************** */
const predefinedStatus = ['Pending', 'Completed', 'Cancelled', 'Refunded'];

// 1. Get Payment By Id
const getPaymentByIdService = async (paymentId) => {
    const payment = await getPaymentByIdDAO(paymentId);
    if (payment.length == 0) {
        throw new NotFoundError(`Payment with id ${paymentId} does not exist.`);
    }
    
    return payment[0];
}

// 2. Add Payment
const AddPaymentService = async (payment) => {
    if (! predefinedStatus.includes(payment.paymentStatus)) {
        throw new InvalidDataFormatError(`Invalid PaymentStatus: Should be one of ${predefinedStatus}`);
    }
    
    const result = await AddPaymentDAO(payment);
    return result;
}

// 3. Update Payment Status
const UpdatePaymentStatusService = async (payment) => {
    if (! predefinedStatus.includes(payment.paymentStatus)) {
        throw new InvalidDataFormatError(`Invalid PaymentStatus: Should be one of ${predefinedStatus}`);
    }
    
    await getPaymentByIdService(payment.paymentId);
    await UpdatePaymentStatusDAO(payment);
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getPaymentByIdService,
    AddPaymentService,
    UpdatePaymentStatusService
}

