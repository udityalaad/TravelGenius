import {LISTING_CALENDAR} from "./Endpoints";

async function AddListingCalendar(payload) {
    try {
        return (await fetch(
            `${LISTING_CALENDAR}/`,
            {
                method: 'POST',
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

export default AddListingCalendar;
