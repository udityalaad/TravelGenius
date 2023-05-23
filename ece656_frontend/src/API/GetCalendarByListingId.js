import { CALENDAR_BY_LISTING_ID } from "./Endpoints";

async function GetCalendarByListingId(id) {
    try {
        return (await fetch(
            `${CALENDAR_BY_LISTING_ID}/${id}`,
            {
                method: 'GET'
            }
        )).json()
    }catch(error){
        return {
           'Error': error
        }
    }
}

export default GetCalendarByListingId;