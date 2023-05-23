const request = require('supertest');
const app = require('../../server');

/* ********* Allow more time for highly interactive elements ********* */
jest.setTimeout(500000);

/* ********* Explicit Mocks ********* */
jest.mock("../../Config/dbProperties.js");

/* ********* Test Data ********* */
let paymentId = 5;
let payment = {
  interacId: "interac5@email.com",
  paymentStatus: "Completed"
};
const predefinedStatus = ['Pending', 'Completed', 'Cancelled', 'Refunded'];

/* ********************************************************************
                  Create Payment 
   ******************************************************************** */
describe('Payment POST API', () => {
  // Success
  test('New Record', async() => {
    const response = await request(app).post(`/api/payment`).send(payment);
    expect (response.statusCode).toEqual(200);
    expect(response.body.paymentId).toEqual(String(paymentId));
  });

  // Missing fields
  test('Missing interacId', async() => {
    let invalidPayment = {
      paymentStatus: "Completed"
    };

    const response = await request(app).post(`/api/payment`).send(invalidPayment);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['interacId is Mandatory', 'Invalid interacId']);
  });

  test('Missing paymentStatus', async() => {
    let invalidPayment = {
      interacId: "interac6@email.com"
    };
    
    const response = await request(app).post(`/api/payment`).send(invalidPayment);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['paymentStatus is Mandatory', 'paymentStatus must be a string']);
  });
  
  // Invalid Format
  test('Invalid InteracId', async() => {
    let invalidPayment = {
      interacId: "interac6email.com",
      paymentStatus: "Completed"
    };
    const response = await request(app).post(`/api/payment`).send(invalidPayment);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid interacId"]);
  });

  test('Invalid paymentStatus', async() => {
    let invalidPayment = {
      interacId: "interac6@email.com",
      paymentStatus: "Rubbish"
    };
    const response = await request(app).post(`/api/payment`).send(invalidPayment);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Invalid PaymentStatus: Should be one of ${predefinedStatus}`);
  });

  // Data-Type checks
  test('Invalid Data-Type', async() => {
    let invalidPayment = {
      interacId: 1,
      paymentStatus: 1
    };
    
    const response = await request(app).post(`/api/payment/`).send(invalidPayment);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([
      'Invalid interacId',
      'paymentStatus must be a string'
    ]);
  });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  Get Payment By Id
   ******************************************************************** */
describe('Payment GET API', () => {
  test('Existing Record', async() => {
    const response = await request(app).get(`/api/payment/${paymentId}`);

    expect (response.statusCode).toEqual(200);

    const result = response.body.payment;
    expect(result.paymentId).toEqual(String(paymentId));
    expect(result.interacId).toEqual(payment.interacId);
    expect(result.paymentStatus).toEqual(payment.paymentStatus);
  });

  test('Non existing record', async() => {
    let nonExisting_paymentId = 100;
    const response = await request(app).get(`/api/payment/${nonExisting_paymentId}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Payment with id ${nonExisting_paymentId} does not exist.`);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/payment/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['id must be an integer']);
  });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  PUT call (Update Payment)
   ******************************************************************** */
describe('Payment PUT API', () => {
  // Success
  test('Valid Record', async() => {
    let updatePayment = {
      paymentId: String(1),
      paymentStatus: "Pending"
    };

    const response = await request(app).put(`/api/payment`).send(updatePayment);
    expect (response.statusCode).toEqual(200);

    // cross-check
    const res = await request(app).get(`/api/payment/${updatePayment.paymentId}`);
    expect (res.statusCode).toEqual(200);

    const result = res.body.payment;
    expect(result.paymentId).toEqual(String(updatePayment.paymentId));
    expect(result.paymentStatus).toEqual(updatePayment.paymentStatus);
  });

  // Missing fields
  test('Missing paymentId', async() => {
    let invalidPayment = {
      paymentStatus: "Completed"
    };

    const response = await request(app).put(`/api/payment`).send(invalidPayment);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['paymentId is Mandatory', 'paymentId must be an integer']);
  });

  test('Missing paymentStatus', async() => {
    let invalidPayment = {
      paymentId: String(2),
    };
    
    const response = await request(app).put(`/api/payment`).send(invalidPayment);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['paymentStatus is Mandatory', 'paymentStatus must be a string']);
  });

  // Invalid Format
  test('Invalid paymentStatus', async() => {
    let invalidPayment = {
      paymentId: String(1),
      paymentStatus: "Rubbish"
    };
    const response = await request(app).put(`/api/payment`).send(invalidPayment);

    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Invalid PaymentStatus: Should be one of ${predefinedStatus}`);
  });

  // Non Existing Record
  test('Non Existing Id', async() => {
    let invalidPayment = {
      paymentId: String(100),
      paymentStatus: "Completed"
    };

    const response = await request(app).put(`/api/payment`).send(invalidPayment);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Payment with id ${invalidPayment.paymentId} does not exist.`);
  });
})
/* ********************************************************************
   ******************************************************************** */
