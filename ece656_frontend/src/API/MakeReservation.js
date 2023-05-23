import { RESERVED_CALENDAR } from "./Endpoints";
// FIX THIS
async function MakeReservation(reservationDetail) {
    try {
        return (await fetch(
            `${RESERVED_CALENDAR}/`,
            {
                method: 'POST',
                body: JSON.stringify(reservationDetail),
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

export default MakeReservation;
