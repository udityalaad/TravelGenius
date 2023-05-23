/*  **********************************************************
                    Imports
    ********************************************************** */


/*  **********************************************************
                    Error Specialization
    ********************************************************** */
    class InvalidDataFormatError extends Error {
        constructor (message) {
            super(message);
            this.name = 'InvalidDataFormatError';
        }
    }
    
    
    /*  **********************************************************
                        Exports
        ********************************************************** */
    module.exports = InvalidDataFormatError;