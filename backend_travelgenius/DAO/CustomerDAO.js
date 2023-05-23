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
// 1. Get Customer By Id
const getCustomerByIdDAO = async (userId) => {
    var sqlQuery = `SELECT * FROM Customer
                    WHERE userId = '${userId}'`;
                    
    var result = await implementReadQuery(sqlQuery);
    
    return result;
}

// 1.2 Check for potential duplicates
const getNonCurrentCustomerByFieldDAO = async (userId, field, fieldValue) => {
    var sqlQuery = `SELECT * FROM Customer
                    WHERE userId <> '${userId}'
                            AND ${field} = '${fieldValue}'`;                              
    var result = await implementReadQuery(sqlQuery);

    return result;
}


// 2. Add Customer
const AddCustomerDAO = async (customer) => {
    var outParam = "out_userId";
    var values = ["'" + customer.userName + "'",
                    "'" + customer.userEmail + "'",
                    "'" + customer.password + "'",
                    '@' + outParam
                   ].join(',');
    var procedure = 'CALL procedure_insertCustomer(' + values + ')';
    procedure = procedure.replace(/'undefined'/g, `null`).replace(/'null'/g, `null`);
    
    var result = await implementStoredProcedure(procedure, outParam);
    return result;
}

// 3. Update Customer
const UpdateCustomerDAO = async (customer) => {
    var sqlQuery = `UPDATE UserAccount
                    SET
                        userName = '${customer.userName}',
                        userEmail = '${customer.userEmail}'
                    WHERE userId = ${customer.userId}`;
    
    await implementWriteQuery(sqlQuery);
}

// 4. Deactivate Customer
const DeactivateCustomerDAO = async (userId) => {
    var sqlQuery = `UPDATE CustomerAccount
                        SET isCustomerAccountActive = '0'
                        WHERE userId = '${userId}'`;
    await implementWriteQuery(sqlQuery);
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getCustomerByIdDAO,
    getNonCurrentCustomerByFieldDAO,
    AddCustomerDAO,
    UpdateCustomerDAO,
    DeactivateCustomerDAO
};

