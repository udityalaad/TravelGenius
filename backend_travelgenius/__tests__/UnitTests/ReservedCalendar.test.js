const request = require('supertest');
const app = require('../../server');

/* ********* Allow more time for highly interactive elements ********* */
jest.setTimeout(500000);

/* ********* Explicit Mocks ********* */
jest.mock("../../Config/dbProperties.js");

/* ********* Test Data ********* */
let reservedCalendar = {
  listingId: "1",
  listingCalendar_Date: "2024-01-11",
  customerId: "1",
  paymentId: "3"
};

describe('ReservedCalendar POST API', () => {
    // Success
    test('New Record', async() => {
      const response = await request(app).post(`/api/reservedCalendar`).send(reservedCalendar);
      expect (response.statusCode).toEqual(200);
    });
    
    // Reserving an already reserved listingCalendar
    test('Existing ReservedCalendar', async() => {
      const response = await request(app).post(`/api/reservedCalendar`).send(reservedCalendar);
      expect (response.statusCode).toEqual(400);
      expect (response.body.message).toEqual(`ListingCalendar with identifier (${reservedCalendar.listingId}, ${reservedCalendar.listingCalendar_Date}) is alredy reserved.`);
    });

    // Missing fields
    test('Missing listingId', async() => {
      let invalidReservedCalendar = {
        listingCalendar_Date: "2024-02-21",
        customerId: String(2),
        paymentId: String(4),
      };

      const response = await request(app).post(`/api/reservedCalendar`).send(invalidReservedCalendar);
      expect (response.statusCode).toEqual(400);
      expect (response.body.message).toEqual(['listingId is Mandatory', 'listingId must be an integer']);
    });

    test('Missing listingCalendar_Date', async() => {
      let invalidReservedCalendar = {
        listingId: 2,
        customerId: String(2),
        paymentId: String(4)
      };

      const response = await request(app).post(`/api/reservedCalendar`).send(invalidReservedCalendar);
      expect (response.statusCode).toEqual(400);
      expect (response.body.message).toEqual(['listingCalendar_Date is Mandatory', 'listingCalendar_Date must be a Date']);
    });

    test('Missing customerId', async() => {
      let invalidReservedCalendar = {
        listingId: 2,
        listingCalendar_Date: "2024-02-21",
        paymentId: String(4)
      };

      const response = await request(app).post(`/api/reservedCalendar`).send(invalidReservedCalendar);
      expect (response.statusCode).toEqual(400);
      expect (response.body.message).toEqual(['customerId is Mandatory', 'customerId must be an integer']);
    });

    test('Missing paymentId', async() => {
      let invalidReservedCalendar = {
        listingId: 2,
        listingCalendar_Date: "2024-02-21",
        customerId: String(2)
      };

      const response = await request(app).post(`/api/reservedCalendar`).send(invalidReservedCalendar);
      expect (response.statusCode).toEqual(400);
      expect (response.body.message).toEqual(['paymentId is Mandatory', 'paymentId must be an integer']);
    });

    // ForeignKey Violations
    test('Nonexisting listingId', async() => {
      let invalidReservedCalendar = {
        listingId: 10,
        listingCalendar_Date: "2024-02-21",
        customerId: String(2),
        paymentId: String(4)
      };

      const response = await request(app).post(`/api/reservedCalendar`).send(invalidReservedCalendar);
      expect (response.statusCode).toEqual(404);
      expect (response.body.message).toEqual(`ListingCalendar with identifier (${invalidReservedCalendar.listingId}, ${invalidReservedCalendar.listingCalendar_Date}) does not exist.`);
    });

    test('Nonexisting customerId', async() => {
      let invalidReservedCalendar = {
        listingId: 2,
        listingCalendar_Date: "2024-02-21",
        customerId: String(10),
        paymentId: String(4)
      };

      const response = await request(app).post(`/api/reservedCalendar`).send(invalidReservedCalendar);
      expect (response.statusCode).toEqual(404);
      expect (response.body.message).toEqual(`Customer with id ${invalidReservedCalendar.customerId} does not exist.`);
    });

    test('Nonexisting paymentId', async() => {
      let invalidReservedCalendar = {
        listingId: 2,
        listingCalendar_Date: "2024-02-21",
        customerId: String(2),
        paymentId: String(10)
      };

      const response = await request(app).post(`/api/reservedCalendar`).send(invalidReservedCalendar);
      expect (response.statusCode).toEqual(404);
      expect (response.body.message).toEqual(`Payment with id ${invalidReservedCalendar.paymentId} does not exist.`);
    });

  // Data-Type checks
  test('Invalid Data-Type', async() => {
    let invalidReservedCalendar = {
      listingId: 'a',
      listingCalendar_Date: 1,
      customerId: 'a',
      paymentId: 'b'
    };
    
    const response = await request(app).post(`/api/reservedCalendar/`).send(invalidReservedCalendar);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([
      'listingId must be an integer',
      'listingCalendar_Date must be a Date',
      'customerId must be an integer',
      'paymentId must be an integer'
    ]);
  });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  Get ReservedCalendar(s) - 2 APIs
   ******************************************************************** */
// Get ReservedCalendar API
describe('ReservedCalendar GET API', () => {
  test('Existing Record', async() => {
    const response = await request(app).get(`/api/reservedCalendar/reservedCalendarByIdentifier/${reservedCalendar.listingId}/${reservedCalendar.listingCalendar_Date}`);
    expect (response.statusCode).toEqual(200);

    const result = response.body.reservedCalendar;
    expect(result.listingId).toEqual(String(reservedCalendar.listingId));
    expect(result.listingCalendar_Date.slice(0, 10)).toEqual(reservedCalendar.listingCalendar_Date);
    expect(result.customerId).toEqual(String(reservedCalendar.customerId));
    expect(result.paymentId).toEqual(String(reservedCalendar.paymentId));
  });

  test('Non existing record', async() => {
    const response = await request(app).get(`/api/reservedCalendar/reservedCalendarByIdentifier/${reservedCalendar.listingId + 100}/${reservedCalendar.listingCalendar_Date}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`ReservedCalendar with identifier (${reservedCalendar.listingId + 100}, ${reservedCalendar.listingCalendar_Date}) does not exist.`);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/reservedCalendar/reservedCalendarByIdentifier/${'a'}/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['listingId must be an integer', 'date must be a DATE']);
  });
})

// Get reservedCalendarsByListing API
describe('reservedCalendar Get reservedCalendarsByListing API', () => {
    test('Existing Records', async() => {
      const response = await request(app).get(`/api/reservedCalendar/reservedCalendarsByListing/${reservedCalendar.listingId}`);
      expect (response.statusCode).toEqual(200);
      expect(response.body.reservedCalendars.length).toEqual(2);
    });
  
    test('Non existing record', async() => {
        const response = await request(app).get(`/api/reservedCalendar/reservedCalendarsByListing/${100}`);
        expect (response.statusCode).toEqual(200);
        expect(response.body.reservedCalendars.length).toEqual(0);
    });

    test('Invalid Data-Type', async() => {
        const response = await request(app).get(`/api/reservedCalendar/reservedCalendarsByListing/${'a'}`);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingId must be an integer']);
    });
  })


  // Get reservedCalendarsByCustomer API
describe('reservedCalendar Get reservedCalendarsByCustomer API', () => {
  test('Existing Records', async() => {
    const response = await request(app).get(`/api/reservedCalendar/reservedCalendarsByCustomer/${reservedCalendar.customerId}`);
    expect (response.statusCode).toEqual(200);
    expect(response.body.reservedCalendars.length).toEqual(2);
  });

  test('Non existing record', async() => {
      const response = await request(app).get(`/api/reservedCalendar/reservedCalendarsByCustomer/${100}`);
      expect (response.statusCode).toEqual(200);
      expect(response.body.reservedCalendars.length).toEqual(0);
  });

  test('Invalid Data-Type', async() => {
      const response = await request(app).get(`/api/reservedCalendar/reservedCalendarsByCustomer/${'a'}`);
      expect (response.statusCode).toEqual(400);
      expect (response.body.message).toEqual(['userId must be an integer']);
  });
})
/* ********************************************************************
   ******************************************************************** */

