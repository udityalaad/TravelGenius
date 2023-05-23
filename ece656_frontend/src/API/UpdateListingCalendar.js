import {LISTING_CALENDAR} from "./Endpoints";

async function UpdateListingCalendar(payload) {
    try {
        return (await fetch(
            `${LISTING_CALENDAR}/`,
            {
                method: 'PUT',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            },
        )).json()
    }catch(error){
        return {
            'Error': error
        }
    }
}

export default UpdateListingCalendar;
