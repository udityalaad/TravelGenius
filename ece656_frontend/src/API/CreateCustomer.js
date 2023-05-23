import { CUSTOMER_API } from "./Endpoints";
// FIX THIS
async function CreateCustomer(customer) {
    try {
        return (await fetch(
            `${CUSTOMER_API}/`,
            {
                method: 'POST',
                body: JSON.stringify(customer),
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

export default CreateCustomer;
