const request = require('supertest');
const app = require('../../server');

/* ********* Allow more time for highly interactive elements ********* */
jest.setTimeout(500000);

/* ********* Explicit Mocks ********* */
jest.mock("../../Config/dbProperties.js");

/* ********* Test Data ********* */
let reviewId = 5;
let review = {
  listingId: "1",
  reviewerId: "1",
  reviewComments: "ReviewComments5",
};


/* ********************************************************************
                  Create Review 
   ******************************************************************** */
describe('Review POST API', () => {
  // Success
  test('New Record', async() => {
    const response = await request(app).post(`/api/review`).send(review);
    expect (response.statusCode).toEqual(200);
    expect(response.body.reviewId).toEqual(String(reviewId));
  });

  // Missing fields
  test('Missing listingId', async() => {
    let invalidReview = {
      reviewerId: String(1),
      reviewComments: "ReviewComments6",
    };

    const response = await request(app).post(`/api/review`).send(invalidReview);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([`listingId is Mandatory`, 'listingId must be an integer']);
  });

  test('Missing reviewerId', async() => {
    let invalidReview = {
      listingId: String(1),
      reviewComments: "ReviewComments6",
    };

    const response = await request(app).post(`/api/review`).send(invalidReview);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([`reviewerId is Mandatory`, 'reviewerId must be an integer']);
  });

  test('Missing reviewComments', async() => {
    let invalidReview = {
      listingId: String(1),
      reviewerId: String(1),
    };

    const response = await request(app).post(`/api/review`).send(invalidReview);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([`reviewComments is Mandatory`, 'reviewComments must be a string']);
  });

  // Data-Type checks
  test('Invalid Data-Type', async() => {
    let invalidReview = {
      listingId: "ReviewComments6",
      reviewerId: "ReviewComments6",
      reviewComments: 1,
    };
    
    const response = await request(app).post(`/api/review`).send(invalidReview);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['listingId must be an integer', 'reviewerId must be an integer', 'reviewComments must be a string']);
  });
  
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  Get Review(s)
   ******************************************************************** */
describe('Review GET API', () => {
  test('Existing Record', async() => {
    const response = await request(app).get(`/api/review/${reviewId}`);

    expect (response.statusCode).toEqual(200);

    var checkReview = JSON.parse(JSON.stringify(review));
    checkReview.reviewId = String(reviewId);
    checkReview.reviewDate = response.body.review.reviewDate;

    expect(response.body.review).toEqual(checkReview);
  });

  test('Non existing record', async() => {
    let nonExisting_reviewId = reviewId + 10;
    const response = await request(app).get(`/api/review/${nonExisting_reviewId}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Review with id ${nonExisting_reviewId} does not exist.`);
  });
  
  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/review/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['id must be an integer']);
  });
})

describe('Review GetByCustomer API', () => {
  test('Existing Records', async() => {
    const response = await request(app).get(`/api/review/reviewsByCustomer/${1}`);
    expect (response.statusCode).toEqual(200);
    expect(response.body.reviews.length).toEqual(3);
  });

  test('Non existing record', async() => {
    const response = await request(app).get(`/api/review/reviewsByCustomer/${100}`);
    expect (response.statusCode).toEqual(200);
    expect(response.body.reviews.length).toEqual(0);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/review/reviewsByCustomer/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['reviewerId must be an integer']);
  });
})

describe('Review GetForHost API', () => {
  test('Existing Records', async() => {
    const response = await request(app).get(`/api/review/reviewsForHost/${3}`);
    expect (response.statusCode).toEqual(200);
    expect(response.body.reviews.length).toEqual(3);
  });

  test('Non existing record', async() => {
    const response = await request(app).get(`/api/review/reviewsForHost/${100}`);
    expect (response.statusCode).toEqual(200);
    expect(response.body.reviews.length).toEqual(0);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/review/reviewsForHost/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['hostId must be an integer']);
  });
})

describe('Review GetForListing API', () => {
  test('Existing Records', async() => {
    const response = await request(app).get(`/api/review/reviewsForListing/${1}`);
    expect (response.statusCode).toEqual(200);
    expect(response.body.reviews.length).toEqual(3);
  });

  test('Non existing record', async() => {
    const response = await request(app).get(`/api/review/reviewsForListing/${100}`);
    expect (response.statusCode).toEqual(200);
    expect(response.body.reviews.length).toEqual(0);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/review/reviewsForListing/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['listingId must be an integer']);
  });
})
/* ********************************************************************
   ******************************************************************** */



/* ********************************************************************
                  Delete Review
   ******************************************************************** */
describe('Review DELETE API', () => {
  test('Existing Record', async() => {
    const response = await request(app).delete(`/api/review/${reviewId}`);
    expect (response.statusCode).toEqual(200);
  });

  test('Non existing reviewId', async() => {
    const response = await request(app).delete(`/api/review/${reviewId}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Review with id ${reviewId} does not exist.`);
  });
})
/* ********************************************************************
   ******************************************************************** */