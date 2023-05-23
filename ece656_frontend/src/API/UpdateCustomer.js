import { CUSTOMER_API } from "./Endpoints";

async function UpdateCustomer(payload) {
    try {
        return (await fetch(
            `${CUSTOMER_API}/`,
            {
                method: 'PUT',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).json()
    }catch(error){
        return {
            'Error': error
        }
    }
}

export default UpdateCustomer;