import { DELETE_LISTING_CALENDAR } from "./Endpoints";
// FIX THIS
async function DeleteListingCalendar(listingId, date) {
    try {
        return (await fetch(
            `${DELETE_LISTING_CALENDAR}/${listingId}/${date}`,
            {
                method: 'DELETE',
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

export default DeleteListingCalendar;
