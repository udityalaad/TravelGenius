const request = require('supertest');
const app = require('../../server');

/* ********* Allow more time for highly interactive elements ********* */
jest.setTimeout(500000);

/* ********* Explicit Mocks ********* */
jest.mock("../../Config/dbProperties.js");

/* ********* Test Data ********* */
userId = 1;
userEmail = 'customer1@email.com';
password = 'user1@password';

/* ********************************************************************
                  User 
   ******************************************************************** */
describe('Authenticate User API', () => {
  test('Successfull Authentication with userId', async() => {
    const response = await request(app).get(`/api/user/authenticateUser/${userId}/${password}`);
    expect (response.statusCode).toEqual(200);
    expect (`User Authentication Successfull`);
    expect(response.body.userId).toEqual(String(userId));
  });

  test('Successfull Authentication with userEmail', async() => {
    const response = await request(app).get(`/api/user/authenticateUser/${userEmail}/${password}`);
    expect (response.statusCode).toEqual(200);
    expect (`User Authentication Successfull`);
    expect(response.body.userId).toEqual(String(userId));
  });

  test('Unsuccessfull Authentication userId', async() => {
    const response = await request(app).get(`/api/user/authenticateUser/${userId}/${'rubbish'}__`);
    expect (response.statusCode).toEqual(401);
    expect (response.body.message).toEqual(`User authentication failed.`);
  });

  test('Unsuccessfull Authentication userEmail', async() => {
    const response = await request(app).get(`/api/user/authenticateUser/${userEmail}/${'rubbish'}__`);
    expect (response.statusCode).toEqual(401);
    expect (response.body.message).toEqual(`User authentication failed.`);
  });

  test('Unsuccessfull Authentication', async() => {
    const response = await request(app).get(`/api/user/authenticateUser/${'rubbish'}/${'rubbish'}__`);
    expect (response.statusCode).toEqual(401);
    expect (response.body.message).toEqual(`User authentication failed.`);
  });
})
/* ********************************************************************
   ******************************************************************** */
