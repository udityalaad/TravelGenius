import { PAYMENT_API } from "./Endpoints";
// FIX THIS
async function MakePayment(payment) {
    try {
        return (await fetch(
            `${PAYMENT_API}/`,
            {
                method: 'POST',
                body: JSON.stringify(payment),
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

export default MakePayment;
