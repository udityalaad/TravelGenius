import {RESERVED_CALENDAR_BY_USER_ID} from "./Endpoints";

async function GetReservedCalendarByUserId(id) {
    try {
        return (await fetch(
            `${RESERVED_CALENDAR_BY_USER_ID}/${id}`,
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

export default GetReservedCalendarByUserId;