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
// 1. Get Payment By Id
const getPaymentByIdDAO = async (paymentId) => {
    var sqlQuery = `SELECT * FROM Payment
                    WHERE paymentId = ${paymentId}`;
                    
    var result = await implementReadQuery(sqlQuery)

    return result;
}


// 2. Add Payment
const AddPaymentDAO = async (payment) => {
    var outParam = "out_paymentId";
    var values = [
                    "'" + payment.interacId + "'",
                    "'" + payment.paymentStatus + "'",
                    '@' + outParam
                   ].join(',');
    var procedure = 'CALL procedure_insertPayment(' + values + ')';
    procedure = procedure.replace(/'undefined'/g, `null`).replace(/'null'/g, `null`);

    var result = await implementStoredProcedure(procedure, outParam);
    return result;
}

// 3. Update Payment Status
const UpdatePaymentStatusDAO = async (payment) => {
    var sqlQuery = `UPDATE Payment
                    SET
                        paymentStatus = '${payment.paymentStatus}'
                    WHERE paymentId = ${payment.paymentId}`;
    
    await implementWriteQuery(sqlQuery);
}

/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getPaymentByIdDAO,
    AddPaymentDAO,
    UpdatePaymentStatusDAO
};

