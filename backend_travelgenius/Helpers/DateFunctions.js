/*  **********************************************************
                    Imports
    ********************************************************** */


/*  **********************************************************
                    Conversion Methods
    ********************************************************** */
const getCurrentDateOnly = () => {
    var today = new Date();

    var month = today.getMonth() + 1;
    month = month < 10 ? ('0' + month) : month;

    var day = today.getDate();
    day = day < 10 ? ('0' + day): day;
    
    return (today.getFullYear() + '-' + month + '-' + day);
}

/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getCurrentDateOnly
};