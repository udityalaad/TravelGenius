import {CUSTOMER_API} from "./Endpoints";

async function DeactivateCustomer(id) {
    console.log("Deactivate " + id)
    try {
        return (await fetch(
            `${CUSTOMER_API}/${id}`,
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

export default DeactivateCustomer;
