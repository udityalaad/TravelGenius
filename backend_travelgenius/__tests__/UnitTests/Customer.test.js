const request = require('supertest');
const app = require('../../server');

/* ********* Allow more time for highly interactive elements ********* */
jest.setTimeout(500000);

/* ********* Explicit Mocks ********* */
jest.mock("../../Config/dbProperties.js");

/* ********* Test Data ********* */
let userId = 7;
let customer = {
  userName: "customer4",
  userEmail: "customer4@email.com",
  password: "user7@password"
};


/* ********************************************************************
                  Create Customer 
   ******************************************************************** */
describe('Customer POST API', () => {
  // Success
  test('New Record', async() => {
    const response = await request(app).post(`/api/customer`).send(customer);
    expect (response.statusCode).toEqual(200);
    expect(response.body.userId).toEqual(String(userId));
  });

  // Duplicate fields
  test('Existing Email Id', async() => {
    const response = await request(app).post(`/api/customer`).send(customer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Another customer with email ${customer.userEmail} already exist.`);
  });

  // Missing fields
  test('Missing userEmail', async() => {
    let invalidCustomer = {
      userName: "customer4",
      password: customer.password
    };

    const response = await request(app).post(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([`userEmail is Mandatory`, 'Invalid Email Id']);
  });

  test('Missing Username', async() => {
    let invalidCustomer = {
      userEmail: "customer@4email.com",
      password: customer.password
    };

    const response = await request(app).post(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([`userName is Mandatory`, 'userName must be an string']);
  });

  test('Missing password', async() => {
    let invalidCustomer = {
      userName: "customer4",
      userEmail: "customer@4email.com"
    };

    const response = await request(app).post(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([`password is Mandatory`, 'password must be an string', 'password requirements not met']);
  });

  // Invalid Format
  test('Invalid Email Id', async() => {
    let invalidCustomer = {
      userName: "customer4",
      userEmail: "customer4email.com",
      password: customer.password
    };
    const response = await request(app).post(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid Email Id"]);
  });

  // Invalid Format
  test('Invalid Password', async() => {
    let invalidCustomer = {
      userName: "customer4",
      userEmail: "customer4@email.com",
      password: "new_"
    };
    const response = await request(app).post(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["password requirements not met"]);
  });

  // Data-Type checks
  test('Invalid Data-Type', async() => {
    let invalidCustomer = {
      userName: 1,
      userEmail: 1,
      password: 1
    };
    
    const response = await request(app).post(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['Invalid Email Id', 'userName must be an string', 'password must be an string', 'password requirements not met']);
  });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  Get Customer By Id
   ******************************************************************** */
describe('Customer GET API', () => {
  test('Existing Record', async() => {
    const response = await request(app).get(`/api/customer/${userId}`);

    expect (response.statusCode).toEqual(200);

    const resCust = response.body.customer;
    expect(resCust.userId).toEqual(String(userId));
    expect(resCust.userName).toEqual(customer.userName);
    expect(resCust.userEmail).toEqual(customer.userEmail);
    expect(resCust.isCustomerAccountActive).toEqual(1);
  });

  test('Non existing record', async() => {
    let nonExisting_userId = 4;
    const response = await request(app).get(`/api/customer/${nonExisting_userId}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Customer with id ${nonExisting_userId} does not exist.`);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/customer/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['id must be an integer']);
  });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  PUT call (Update Customer)
   ******************************************************************** */
describe('Customer PUT API', () => {
  // Success
  test('Valid Record', async() => {
    let updateCustomer = {
      userId: String(userId),
      userName: "new_" + customer.userName,
      userEmail: "new_" + customer.userEmail
    };

    const response = await request(app).put(`/api/customer`).send(updateCustomer);
    expect (response.statusCode).toEqual(200);

    // cross-check
    const res = await request(app).get(`/api/customer/${userId}`);
    expect (res.statusCode).toEqual(200);

    const resCust = res.body.customer;
    expect(resCust.userId).toEqual(String(userId));
    expect(resCust.userName).toEqual(updateCustomer.userName);
    expect(resCust.userEmail).toEqual(updateCustomer.userEmail);
    expect(resCust.isCustomerAccountActive).toEqual(1);
  });

  // Missing fields
  test('Missing userId', async() => {
    let updateCustomer = {
      userName: "new_" + customer.userName,
      userEmail: "new_" + customer.userEmail
    };
    const response = await request(app).put(`/api/customer`).send(updateCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([`userId is Mandatory`, 'userId must be an integer']);
  });

  test('Missing Email Id', async() => {
    let invalidCustomer = {
      userId: String(userId),
      userName:  "new_" + customer.userName
    };

    const response = await request(app).put(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([`userEmail is Mandatory`, 'Invalid Email Id']);
  });

  test('Missing Username', async() => {
    let invalidCustomer = {
      userId: String(userId),
      userEmail: "new_" + customer.userEmail
    };

    const response = await request(app).put(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([`userName is Mandatory`, 'userName must be an string']);
  });

  // Invalid Format
  test('Invalid Email Id', async() => {
    let invalidCustomer = {
      userId: String(userId),
      userName:  "new_" + customer.userName,
      userEmail: "customer4email.com"
    };
    const response = await request(app).put(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid Email Id"]);
  });

  // Non Exiting Record
  test('Non Existing Id', async() => {
    let invalidCustomer = {
      userId: String(userId + 6),
      userName:  "new_1" + customer.userName,
      userEmail: "new_1" + customer.userEmail
    };

    const response = await request(app).put(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Customer with id ${invalidCustomer.userId} does not exist.`);
  });

  // Duplicates
  test('Existing Email', async() => {
    let invalidCustomer = {
      userId: String(1),
      userName:  "new_" + customer.userName,
      userEmail: "new_" + customer.userEmail
    };

    const response = await request(app).put(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Another customer with email ${invalidCustomer.userEmail} already exist.`);
  });

  // Data-Type checks
  test('Invalid Data-Type', async() => {
    let invalidCustomer = {
      userId: 'a',
      userName: 1,
      userEmail: 1
    };
    
    const response = await request(app).put(`/api/customer`).send(invalidCustomer);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['userId must be an integer', 'Invalid Email Id', 'userName must be an string']);
  });
})
/* ********************************************************************
   ******************************************************************** */



/* ********************************************************************
                  Deactivate Customer
   ******************************************************************** */
describe('Customer DELETE API', () => {
  test('Existing Record', async() => {
    const response = await request(app).delete(`/api/customer/${userId}`);
    expect (response.statusCode).toEqual(200);

    // cross-check
    const res = await request(app).get(`/api/customer/${userId}`);
    expect (res.statusCode).toEqual(200);
    expect(res.body.customer.isCustomerAccountActive).toEqual(0);
  });

  test('Non existing userId', async() => {
    let nonExisting_userId = String(4);
    const response = await request(app).delete(`/api/customer/${nonExisting_userId}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Customer with id ${nonExisting_userId} does not exist.`);
  });

  test('Has a current and/or future reservation', async() => {
    let relevant_userId = String(5); 
    const response = await request(app).delete(`/api/customer/${relevant_userId}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`There are active reservations for Customer with Id ${relevant_userId}. Please clear those first.`);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).delete(`/api/customer/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['id must be an integer']);
  });
})
/* ********************************************************************
   ******************************************************************** */