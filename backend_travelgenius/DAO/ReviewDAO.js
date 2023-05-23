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
// 1. Get Review By Id
const getReviewByIdDAO = async (reviewId) => {
    var sqlQuery = `SELECT * FROM Review
                    WHERE reviewId = ${reviewId}`;
    
    var result = await implementReadQuery(sqlQuery)

    return result;
}

// 1.2 Get Reviews By/For Different Entities
const getReviewsForOrByDifferentEntitiesDAO = async (field, fieldValue) => {
    var sqlQuery = `SELECT * FROM ReviewEntities
                    WHERE ${field} = '${fieldValue}'`;
    
    var result = await implementReadQuery(sqlQuery);

    return result;
}


// 2. Add Review
const AddReviewDAO = async (review) => {
    var outParam = "out_reviewId";
    var values = ["'" + review.listingId + "'",
                    "'" + review.reviewerId + "'",
                    "'" + review.reviewComments + "'",
                    '@' + outParam
                   ].join(',');
    var procedure = 'CALL procedure_insertReview(' + values + ')';
    procedure = procedure.replace(/'undefined'/g, `null`).replace(/'null'/g, `null`);
    
    var result = await implementStoredProcedure(procedure, outParam);
    return result;
}


// 4. Delete Review
const DeleteReviewDAO = async (reviewId) => {
    var sqlQuery = `DELETE FROM Review
                        WHERE reviewId = ${reviewId}`;
    await implementWriteQuery(sqlQuery);
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getReviewByIdDAO,
    getReviewsForOrByDifferentEntitiesDAO,
    AddReviewDAO,
    DeleteReviewDAO
};

