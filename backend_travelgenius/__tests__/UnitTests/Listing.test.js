const request = require('supertest');
const app = require('../../server');

/* ********* Allow more time for highly interactive elements ********* */
jest.setTimeout(500000);

/* ********* Explicit Mocks ********* */
jest.mock("../../Config/dbProperties.js");

/* ********* Test Data ********* */
let listingId = 4;
let listing = {
  listingName: "listingName_4",
  listingDescription: "listingDescription_4",
  listingPictureUrl: "https://a0.muscache.com/pictures/76206750/d64440e4_original/listing4.jpg",
  listingLicense: "",
  listingInstantBookable: 0,
  listingMinimumNights: 1,
  listingMaximumNights: 4,
  hostId: "3",
  propertyType: "propertyType3",
  roomType: "Entire home/apt",
  accommodates: 3,
  noBathrooms: '3.0',
  bathroomType:  "private bath",
  noBedrooms: 3,
  noBeds: 3,
  amenities: ["amenity1" , "amenity2" , "amenity3"],
  propertyNeighbourhood: "propertyNeighbourhood3",
  propertyNeighborhoodOverview: "propertyNeighborhoodOverview3",
  propertyNeighbourhoodCleansed: "propertyNeighbourhoodCleansed3",
  propertyCoordinates: {
    x: 43.6459,
    y: -79.42423
  }
};


/* ********************************************************************
                  Create Listing 
   ******************************************************************** */
describe('Listing POST API', () => {
  // Success
  test('New Record', async() => {
    const response = await request(app).post(`/api/listing`).send(listing);
    expect (response.statusCode).toEqual(200);
    expect(response.body.listingId).toEqual(String(listingId));
  });

  test('New Record (With minimal fields)', async() => {
    let new_listing = {
      listingPictureUrl: "https://a0.muscache.com/pictures/76206750/d64330e4_original/listing4.jpg",
      listingInstantBookable: 0,
      hostId: String(4),
      propertyType: "propertyType4",
      roomType: "Entire home/apt",
      accommodates: 4,
      propertyCoordinates: {
        x: 44.44,
        y: -44.4
      }
    };
    
    const response = await request(app).post(`/api/listing`).send(new_listing);

    expect (response.statusCode).toEqual(200);
    expect(response.body.listingId).toEqual(String(listingId + 1));
  });


  // Duplicate fields
  test('Existing listingPictureUrl', async() => {
    let new_listing = {
      listingUrl: "https://www.airbnb.com/rooms/listing5",
      listingPictureUrl: "https://a0.muscache.com/pictures/76206750/d64330e4_original/listing4.jpg",
      listingInstantBookable: 0,
      hostId: String(5),
      propertyType: "propertyType5",
      roomType: "Entire home/apt",
      accommodates: 5,
      propertyCoordinates: {
        x: 44.44,
        y: -44.4
      }
    };

    const response = await request(app).post(`/api/listing`).send(new_listing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Another listing with listingPictureUrl ${new_listing.listingPictureUrl} already exist.`);
  });


  // Missing fields
  test('Missing listingPictureUrl', async() => {
    let invalidListing = {
      listingUrl: "https://www.airbnb.com/rooms/listing5",
      listingInstantBookable: 0,
      hostId: String(4),
      propertyType: "propertyType5",
      roomType: "Entire home/apt",
      accommodates: 4,
      propertyCoordinates: {
        x: 44.44,
        y: -44.4
      }
    };

    const response = await request(app).post(`/api/listing`).send(invalidListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['listingPictureUrl is Mandatory', 'Invalid listingPictureUrl']);
  });

  test('Missing listingInstantBookable', async() => {
    let invalidListing = {
      listingUrl: "https://www.airbnb.com/rooms/listing5",
      listingPictureUrl: "https://a0.muscache.com/pictures/76206750/d64330e4_original/listing5.jpg",
      hostId: String(4),
      propertyType: "propertyType5",
      roomType: "Entire home/apt",
      accommodates: 4,
      propertyCoordinates: {
        x: 44.44,
        y: -44.4
      }
    };

    const response = await request(app).post(`/api/listing`).send(invalidListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['listingInstantBookable is Mandatory', 'listingInstantBookable must be an binary']);
  });

  test('Missing hostId', async() => {
    let invalidListing = {
      listingUrl: "https://www.airbnb.com/rooms/listing5",
      listingPictureUrl: "https://a0.muscache.com/pictures/76206750/d64330e4_original/listing5.jpg",
      listingInstantBookable: 0,
      propertyType: "propertyType5",
      roomType: "Entire home/apt",
      accommodates: 4,
      propertyCoordinates: {
        x: 44.44,
        y: -44.4
      }
    };

    const response = await request(app).post(`/api/listing`).send(invalidListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['hostId is Mandatory', 'hostId must be an integer']);
  });

  test('Missing propertyType', async() => {
    let invalidListing = {
      listingUrl: "https://www.airbnb.com/rooms/listing5",
      listingPictureUrl: "https://a0.muscache.com/pictures/76206750/d64330e4_original/listing5.jpg",
      listingInstantBookable: 0,
      hostId: String(4),
      roomType: "Entire home/apt",
      accommodates: 4,
      propertyCoordinates: {
        x: 44.44,
        y: -44.4
      }
    };

    const response = await request(app).post(`/api/listing`).send(invalidListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['propertyType is Mandatory', 'propertyType must be a string']);
  });

  test('Missing roomType', async() => {
    let invalidListing = {
      listingUrl: "https://www.airbnb.com/rooms/listing5",
      listingPictureUrl: "https://a0.muscache.com/pictures/76206750/d64330e4_original/listing5.jpg",
      listingInstantBookable: 0,
      hostId: String(4),
      propertyType: "propertyType5",
      accommodates: 4,
      propertyCoordinates: {
        x: 44.44,
        y: -44.4
      }
    };

    const response = await request(app).post(`/api/listing`).send(invalidListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['roomType is Mandatory', 'roomType must be a string']);
  });

  test('Missing accommodates', async() => {
    let invalidListing = {
      listingUrl: "https://www.airbnb.com/rooms/listing5",
      listingPictureUrl: "https://a0.muscache.com/pictures/76206750/d64330e4_original/listing5.jpg",
      listingInstantBookable: 0,
      hostId: String(4),
      propertyType: "propertyType5",
      roomType: "Entire home/apt",
      propertyCoordinates: {
        x: 44.44,
        y: -44.4
      }
    };

    const response = await request(app).post(`/api/listing`).send(invalidListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['accommodates is Mandatory', 'accommodates must be an integer']);
  });

  test('Missing propertyCoordinates', async() => {
    let invalidListing = {
      listingUrl: "https://www.airbnb.com/rooms/listing5",
      listingPictureUrl: "https://a0.muscache.com/pictures/76206750/d64330e4_original/listing5.jpg",
      listingInstantBookable: 0,
      hostId: String(4),
      propertyType: "propertyType5",
      roomType: "Entire home/apt",
      accommodates: 4
    };

    const response = await request(app).post(`/api/listing`).send(invalidListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([
                'propertyCoordinates is Mandatory',
                // 'propertyCoordinates must be of the form {x: decimal, y: decimal}'
              ]);
  });


  test('Invalid listingPictureUrl', async() => {
    let new_listing = {
      listingUrl: "https://www.airbnb.com/rooms/listing5",
      listingPictureUrl: "https/76206750/d64330e4_original/listing5.jpg",
      listingInstantBookable: 0,
      hostId: String(4),
      propertyType: "propertyType5",
      roomType: "Entire home/apt",
      accommodates: 5,
      propertyCoordinates: {
        x: 5.55,
        y: -55.5
      }
    };

    const response = await request(app).post(`/api/listing`).send(new_listing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid listingPictureUrl"]);
  });

  // Data-Type checks
  test('Invalid Data-Type', async() => {
    let invalidListing = {
      listingUrl: 1,
      listingName: 1,
      listingDescription: 1,
      listingPictureUrl: 1,
      listingLicense: 1,
      listingInstantBookable: 34,
      listingMinimumNights: 'a',
      listingMaximumNights: 'a',
      hostId: 'a',
      propertyType: 1,
      roomType: 1,
      accommodates: 'a',
      noBathrooms: 'a',
      bathroomType:  1,
      noBedrooms: 'a',
      noBeds: 'a',
      amenities: 1,
      propertyNeighbourhood: 1,
      propertyNeighborhoodOverview: 1,
      propertyNeighbourhoodCleansed: 1,
      propertyCoordinates: 1
    };
    
    const response = await request(app).post(`/api/listing/`).send(invalidListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([
      'listingMinimumNights must be an integer',
      'listingMaximumNights must be an integer',
      'noBathrooms must be an decimal',
      'noBedrooms must be an integer',
      'noBeds must be an integer',
      'listingName must be a string',
      'listingDescription must be a string',
      'listingLicense must be a string',
      'bathroomType must be a string',
      'amenities must be an array',
      'propertyNeighbourhood must be a string',
      'propertyNeighborhoodOverview must be a string',
      'propertyNeighbourhoodCleansed must be a string',
      'Invalid listingPictureUrl',
      'listingInstantBookable must be an binary',
      'hostId must be an integer',
      'accommodates must be an integer',
      'propertyType must be a string',
      'roomType must be a string'
    ]);
  });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  Get Listing By Id
   ******************************************************************** */
describe('Listing GET API', () => {
  test('Existing Record', async() => {
    const response = await request(app).get(`/api/listing/${listingId}`);
    expect (response.statusCode).toEqual(200);
    
    var checkListing = JSON.parse(JSON.stringify(listing));
    checkListing.listingId = String(listingId);
    checkListing.listingUrl = "https://www.airbnb.com/rooms/" + listingId,
    expect(response.body.listing).toEqual(checkListing);
  });

  test('Non existing record', async() => {
    let nonExisting_listingId = String(listingId + 10);
    const response = await request(app).get(`/api/listing/${nonExisting_listingId}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Listing with id ${nonExisting_listingId} does not exist.`);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/listing/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['id must be an integer']);
  });
})


describe('Listing By Host GET API', () => {
  test('Existing Record', async() => {
    const response = await request(app).get(`/api/listing/listingByHost/${listing.hostId}`);
    expect (response.statusCode).toEqual(200);
    
    var checkListing = JSON.parse(JSON.stringify(listing));
    checkListing.listingId = String(listingId);
    checkListing.listingUrl = "https://www.airbnb.com/rooms/" + listingId,
    expect(response.body.listings.length).toEqual(2);
  });

  test('Non existing record', async() => {
    const response = await request(app).get(`/api/listing/listingByHost/${11001100}`);
    expect (response.statusCode).toEqual(200);
    
    var checkListing = JSON.parse(JSON.stringify(listing));
    checkListing.listingId = String(listingId);
    checkListing.listingUrl = "https://www.airbnb.com/rooms/" + listingId,
    expect(response.body.listings.length).toEqual(0);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/listing/listingByHost/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['hostId must be an integer']);
  });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  PUT call (Update ListingLicense)
   ******************************************************************** */
describe('Listing PUT API', () => {
  // Success
  test('Valid Record', async() => {
    let updateListing = {
      listingId: String(listingId),
      listingLicense: 'listingLicense-1-1-1-1' + listingId
    };

    const response = await request(app).put(`/api/listing/updateLicense/`).send(updateListing);
    expect (response.statusCode).toEqual(200);

    // cross-check
    const res = await request(app).get(`/api/listing/${listingId}`);
    expect (res.statusCode).toEqual(200);
    
    const resCust = res.body.listing;
    expect(resCust.listingLicense).toEqual(updateListing.listingLicense);
    expect(resCust.userEmail).toEqual(updateListing.userEmail);
  });

  // Missing fields
  test('Missing listingId', async() => {
    let updateListing = {
      listingLicense: 'listingLicense-1-1-1-1' + listingId
    };
    const response = await request(app).put(`/api/listing/updateLicense/`).send(updateListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['listingId is Mandatory', 'listingId must be an integer']);
  });

  test('Missing listingLicense', async() => {
    let updateListing = {
      listingId: String(listingId)
    };

    const response = await request(app).put(`/api/listing/updateLicense/`).send(updateListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['listingLicense is Mandatory', 'listingLicense must be a string']);
  });

  // Non Exiting Record
  test('Non Existing Id', async() => {
    let invalidListing = {
      listingId: String(listingId + 10),
      listingLicense: 'listingLicense-1-1-1-1' + listingId
    };

    const response = await request(app).put(`/api/listing/updateLicense/`).send(invalidListing);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Listing with id ${invalidListing.listingId} does not exist.`);
  });

  // Data-Type checks
  test('Invalid Data-Type', async() => {
    let invalidListing = {
      listingId: 'a',
      listingLicense: 2
    };
    
    const response = await request(app).put(`/api/listing/updateLicense/`).send(invalidListing);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['listingId must be an integer', 'listingLicense must be a string']);
  });
})
/* ********************************************************************
   ******************************************************************** */



/* ********************************************************************
                  DELETE Listing
   ******************************************************************** */
describe('Listing DELETE API', () => {
  test('Existing Record', async() => {
    const response = await request(app).delete(`/api/listing/${listingId}`);
    expect (response.statusCode).toEqual(200);
  });

  test('Non existing listingId', async() => {
    const response = await request(app).delete(`/api/listing/${listingId}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Listing with id ${listingId} does not exist.`);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).delete(`/api/listing/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['id must be an integer']);
  });
})
/* ********************************************************************
   ******************************************************************** */



