/*  **********************************************************
                    Imports
    ********************************************************** */


/*  **********************************************************
                    Error Specialization
    ********************************************************** */
class ItemAlreadyExistsError extends Error {
    constructor (message) {
        super(message);
        this.name = 'ItemAlreadyExists';
    }
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = ItemAlreadyExistsError;