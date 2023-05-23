const request = require('supertest');
const app = require('../../server');
const { convertJsonToParamString_listingCalendarsBySearchQuery } = require('../../Helpers/BasicTest')

/* ********* Allow more time for highly interactive elements ********* */
jest.setTimeout(500000);

/* ********* Explicit Mocks ********* */
jest.mock("../../Config/dbProperties.js");

/* ********* Test Data ********* */
let listingId = 1;
let listingCalendar_Date = "2024-01-13";
let listingCalendar = {
  listingId: "1",
  listingCalendar_Date: "2024-01-13",
  listingCalendar_Price: "100.00",
  listingCalendar_AdjustedPrice: "75.00"
};

describe('ListingCalendar POST API', () => {
    // Success
    test('New Record', async() => {
      const response = await request(app).post(`/api/listingCalendar`).send(listingCalendar);
      expect (response.statusCode).toEqual(200);
    });
    
    // Duplicate identifier
    test('Existing ListingCalendar', async() => {
      const response = await request(app).post(`/api/listingCalendar`).send(listingCalendar);
      expect (response.statusCode).toEqual(400);
      expect (response.body.message).toEqual(`ListingCalendar with identifier (${listingId}, ${listingCalendar_Date}) already exists.`);
    });

    // Missing fields
    test('Missing listingId', async() => {
        let invalidListingCalendar = {
            listingCalendar_Date: "2024-01-14",
            listingCalendar_Price: "100.00",
            listingCalendar_AdjustedPrice: "75.00"
        };

        const response = await request(app).post(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingId is Mandatory', 'listingId must be an integer']);
    });

    test('Missing listingCalendar_Date', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Price: "100.00",
            listingCalendar_AdjustedPrice: "75.00"
        };

        const response = await request(app).post(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingCalendar_Date is Mandatory', 'listingCalendar_Date must be a Date']);
    });

    test('Missing listingCalendar_Price', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-14",
            listingCalendar_AdjustedPrice: "75.00"
        };

        const response = await request(app).post(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingCalendar_Price is Mandatory', 'listingCalendar_Price must be a decimal']);
    });

    test('Missing listingCalendar_AdjustedPrice', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-14",
            listingCalendar_Price: "100.00",
        };

        const response = await request(app).post(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingCalendar_AdjustedPrice is Mandatory', 'listingCalendar_AdjustedPrice must be a decimal']);
    });

    // Rule Violations
    test('Inconsistent original & expected prices', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-14",
            listingCalendar_Price: "75.00",
            listingCalendar_AdjustedPrice: "100.00"
        };

        const response = await request(app).post(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual("AdjustedPrice cannot be more than OriginalPrice");
    });

    test('Earlier Date', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2021-01-14",
            listingCalendar_Price: "100.00",
            listingCalendar_AdjustedPrice: "75.00"
        };

        const response = await request(app).post(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual("listingCalendar must be a future date");
    });


    test('Incorrect Price', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-14",
            listingCalendar_Price: "50001.00",
            listingCalendar_AdjustedPrice: "100.00"
        };

        const response = await request(app).post(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual("listingPrice must be in the range (0, 50000)");
    });

    test('Incorrect Adjusted Price', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-14",
            listingCalendar_Price: "100.00",
            listingCalendar_AdjustedPrice: -1
        };

        const response = await request(app).post(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual("AdjustedPrice must be in the range (0, 50000)");
    });

    // Data-Type checks
    test('Invalid Data-Type', async() => {
        let invalidListingCalendar = {
        listingId: 'a',
        listingCalendar_Date: 1,
        listingCalendar_Price: 'a',
        listingCalendar_AdjustedPrice: 'b'
        };
        
        const response = await request(app).post(`/api/listingCalendar/`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual([
        'listingId must be an integer',
        'listingCalendar_Date must be a Date',
        'listingCalendar_Price must be a decimal',
        'listingCalendar_AdjustedPrice must be a decimal'
        ]);
    });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  Get ListingCalendar(s) by identifiers - 3 APIs
   ******************************************************************** */
// Get ListingCalendar API
describe('ListingCalendar GET API', () => {
  test('Existing Record', async() => {
    const response = await request(app).get(`/api/listingCalendar/listingCalendarByIdentifier/${listingId}/${listingCalendar_Date}`);
    expect (response.statusCode).toEqual(200);

    const result = response.body.listingCalendar;
    expect(result.listingId).toEqual(String(listingId));
    expect(result.listingCalendar_Date.slice(0, 10)).toEqual(listingCalendar.listingCalendar_Date);
    expect(result.listingCalendar_isAvailable).toEqual(1);
    expect(result.listingCalendar_Price).toEqual(listingCalendar.listingCalendar_Price);
    expect(result.listingCalendar_AdjustedPrice).toEqual(listingCalendar.listingCalendar_AdjustedPrice);
  });

  test('Non existing record', async() => {
    const response = await request(app).get(`/api/listingCalendar/listingCalendarByIdentifier/${listingId + 1}/${listingCalendar_Date}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`ListingCalendar with identifier (${listingId + 1}, ${listingCalendar_Date}) does not exist.`);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/listingCalendar/listingCalendarByIdentifier/${'a'}/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['listingId must be an integer', 'date must be a DATE']);
  });
})  

// Get ListingCalendarsByListing API
describe('listingCalendar Get ListingCalendarsByListing API', () => {
    test('Existing Records', async() => {
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsByListing/${listingId}`);
      expect (response.statusCode).toEqual(200);
      expect(response.body.listingCalendars.length).toEqual(3);
    });
  
    test('Non existing record', async() => {
        const response = await request(app).get(`/api/listingCalendar/listingCalendarsByListing/${100}`);
        expect (response.statusCode).toEqual(200);
      expect(response.body.listingCalendars.length).toEqual(0);
    });

    test('Invalid Data-Type', async() => {
        const response = await request(app).get(`/api/listingCalendar/listingCalendarsByListing/${'a'}`);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingId must be an integer']);
    });
})

// Get ListingCalendarsByHost API
describe('listingCalendar Get ListingCalendarsByHost API', () => {
    test('Existing Records', async() => {
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsByHost/${3}`);
      expect (response.statusCode).toEqual(200);
      expect(response.body.listingCalendars.length).toEqual(3);
    });
  
    test('Non existing record', async() => {
        const response = await request(app).get(`/api/listingCalendar/listingCalendarsByHost/${100}`);
        expect (response.statusCode).toEqual(200);
      expect(response.body.listingCalendars.length).toEqual(0);
    });

    test('Invalid Data-Type', async() => {
        const response = await request(app).get(`/api/listingCalendar/listingCalendarsByHost/${'a'}`);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['hostId must be an integer']);
    });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  Get ListingCalendar(s) by Search Query
   ******************************************************************** */
// Get ListingCalendar(s) by SearchQuery API
describe('ListingCalendar(s) by Search Query API', () => {
    test('Universal Criterias', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "1000000000000000000"
            }
          };
        
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
      expect (response.statusCode).toEqual(200);
      
      const result = response.body.listingCalendars;
      expect(result.length).toEqual(4);
    });

    test('Check for dateRange', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2024-01-11",
              "upperBound": "2024-01-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "10"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "100000000000000000.0"
            }
          };
        
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
      expect (response.statusCode).toEqual(200);
      
      const result = response.body.listingCalendars;
      expect(result.length).toEqual(1);

      expect(result[0].listingId).toEqual(String(1));
      expect(result[0].listingCalendar_Date.substring(0, 10)).toEqual('2024-01-11');
    });

    test('Check for priceRange', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "30.0",
              "upperBound": "40.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "10"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "100000000000000000.0"
            }
          };
        
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
      expect (response.statusCode).toEqual(200);
      
      const result = response.body.listingCalendars;
      expect(result.length).toEqual(1);

      expect(result[0].listingId).toEqual(String(3));
      expect(result[0].listingCalendar_Date.substring(0, 10)).toEqual('2024-03-21');
    });

    test('Check for noBeds', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "2",
              "upperBound": "2"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "1000000000000000000"
            }
          };
        
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
      expect (response.statusCode).toEqual(200);
      
      const result = response.body.listingCalendars;
      expect(result.length).toEqual(1);

      expect(result[0].listingId).toEqual(String(2));
      expect(result[0].listingCalendar_Date.substring(0, 10)).toEqual('2024-02-21');
    });


    test('Check location 1', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "1000"
            }
          };
        
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
      expect (response.statusCode).toEqual(200);
      
      const result = response.body.listingCalendars;
      expect(result.length).toEqual(3);
    });


    test('Check location 2', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "100"
            }
          };
        
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
      expect (response.statusCode).toEqual(200);
      
      const result = response.body.listingCalendars;
      expect(result.length).toEqual(1);

      expect(result[0].listingId).toEqual(String(2));
      expect(result[0].listingCalendar_Date.substring(0, 10)).toEqual('2024-02-21');
    });
    
    test('Test All Criterias', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2022-01-20",
              "upperBound": "2025-02-12"
            },
            "priceRange": {
              "lowerBound": "20.0",
              "upperBound": "50.0"
            },
            "noBeds": {
              "lowerBound": "1",
              "upperBound": "2"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "100.0"
            }
          };
        
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
      expect (response.statusCode).toEqual(200);
      
      const result = response.body.listingCalendars;
      expect(result.length).toEqual(1);
      expect(result[0].listingId).toEqual(String(2));
    });
    
    test('Non existing record', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2022-01-20",
              "upperBound": "2025-02-12"
            },
            "priceRange": {
              "lowerBound": "20.0",
              "upperBound": "50.0"
            },
            "noBeds": {
              "lowerBound": "10",
              "upperBound": "20"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "10.0"
            }
          };
        
      const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
      expect (response.statusCode).toEqual(200);
      
      const result = response.body.listingCalendars;
      expect(result.length).toEqual(0);
    });

    // Missing fields
    test('Missing dateRange.lowerBound', async() => {
        const queryInput = {
            "dateRange": {
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "1000000000000000000"
            }
          };

          const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
          expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['dateRange.lowerBound must be a Date']);
    });

    test('Missing dateRange.upperBound', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "1000000000000000000"
            }
          };

          const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
          expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['dateRange.upperBound must be a Date']);
    });


    test('Missing priceRange.lowerBound', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "1000000000000000000"
            }
          };

          const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
          expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['priceRange.lowerBound must be a Decimal']);
    });

    test('Missing priceRange.upperBound', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "1000000000000000000"
            }
          };

          const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
          expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['priceRange.upperBound must be a Decimal']);
    });


    test('Missing noBeds.lowerBound', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "1000000000000000000"
            }
          };

          const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
          expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['noBeds.lowerBound must be an Integer']);
    });


    test('Missing noBeds.upperBound', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              },
              "maxRange": "1000000000000000000"
            }
          };

          const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
          expect (response.statusCode).toEqual(400);
          expect (response.body.message).toEqual(['noBeds.upperBound must be an Integer']);
        });


    test('Missing location.position.x', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "y": "11"
              },
              "maxRange": "1000000000000000000"
            }
          };

          const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
          expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['location.position.x must be a Decimal']);
    });


    test('Missing location.position.y', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22"
              },
              "maxRange": "1000000000000000000"
            }
          };

          const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
          expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['location.position.y must be a Decimal']);
    });


    test('Missing location.maxRange', async() => {
        const queryInput = {
            "dateRange": {
              "lowerBound": "2023-05-20",
              "upperBound": "2035-02-12"
            },
            "priceRange": {
              "lowerBound": "0.0",
              "upperBound": "10000.0"
            },
            "noBeds": {
              "lowerBound": "0",
              "upperBound": "1000"
            },
            "location": {
              "position": {
                "x": "22",
                "y": "11"
              }
            }
          };

          const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
          expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['location.maxRange must be a Decimal']);
    });


    // Rule Violations
    test('dateRange: Inconsistent lowerBound & upperBound', async() => {
        const queryInput = {
            "dateRange": {
                "lowerBound": "2035-05-20",
                "upperBound": "2023-02-12"
            },
            "priceRange": {
                "lowerBound": "0.0",
                "upperBound": "10000.0"
            },
            "noBeds": {
                "lowerBound": "0",
                "upperBound": "1000"
            },
            "location": {
                "position": {
                    "x": "22",
                    "y": "11"
                },
                "maxRange": "1000000000000000000"
            }
        };
        
        const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual("dateRange error: lowerBound must be <= upperBound");
    });


    test('priceRange: Inconsistent lowerBound & upperBound', async() => {
        const queryInput = {
            "dateRange": {
                "lowerBound": "2023-05-20",
                "upperBound": "2035-02-12"
            },
            "priceRange": {
                "lowerBound": "10000.0",
                "upperBound": "0.0"
            },
            "noBeds": {
                "lowerBound": "0",
                "upperBound": "1000"
            },
            "location": {
                "position": {
                    "x": "22",
                    "y": "11"
                },
                "maxRange": "1000000000000000000"
            }
        };
        
        const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual("priceRange error: lowerBound must be <= upperBound");
    });


    test('noBeds: Inconsistent lowerBound & upperBound', async() => {
        const queryInput = {
            "dateRange": {
                "lowerBound": "2023-05-20",
                "upperBound": "2035-02-12"
            },
            "priceRange": {
                "lowerBound": "0.0",
                "upperBound": "10000.0"
            },
            "noBeds": {
                "lowerBound": "1000",
                "upperBound": "0"
            },
            "location": {
                "position": {
                    "x": "22",
                    "y": "11"
                },
                "maxRange": "1000000000000000000"
            }
        };
        
        const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual("noBeds error: lowerBound must be <= upperBound");
    });


    // Invalid Data Types
    test('Invalid Data Types', async() => {
        const queryInput = {
            "dateRange": {
                "lowerBound": "1",
                "upperBound": "1"
            },
            "priceRange": {
                "lowerBound": "a",
                "upperBound": "b"
            },
            "noBeds": {
                "lowerBound": "a",
                "upperBound": "b"
            },
            "location": {
                "position": {
                    "x": "a",
                    "y": "b"
                },
                "maxRange": "a"
            }
        };

        const response = await request(app).get(`/api/listingCalendar/listingCalendarsBySearchQuery/` + 
                            `${convertJsonToParamString_listingCalendarsBySearchQuery(queryInput)}`);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual([
            'dateRange.lowerBound must be a Date',
            'dateRange.upperBound must be a Date',
            'priceRange.lowerBound must be a Decimal',
            'priceRange.upperBound must be a Decimal',
            'noBeds.lowerBound must be an Integer',
            'noBeds.upperBound must be an Integer',
            'location.position.x must be a Decimal',
            'location.position.y must be a Decimal',
            'location.maxRange must be a Decimal'
        ]);
    });
})
  /* ********************************************************************
     ******************************************************************** */


/* ********************************************************************
                  PUT call (Update ListingCalendar)
   ******************************************************************** */
describe('ListingCalendar PUT API', () => {
    // Success
    test('Valid Record', async() => {
        let updateListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-13",
            listingCalendar_Price: "10.00",
            listingCalendar_AdjustedPrice: "8.00"
        };

        const response = await request(app).put(`/api/listingCalendar`).send(updateListingCalendar);
        expect (response.statusCode).toEqual(200);

        // cross-check
        const res = await request(app).get(`/api/listingCalendar/listingCalendarByIdentifier/${updateListingCalendar.listingId}/${updateListingCalendar.listingCalendar_Date}`);
        expect (res.statusCode).toEqual(200);
        
        const result = res.body.listingCalendar;
        expect(result.listingId).toEqual(String(updateListingCalendar.listingId));
        expect(result.listingCalendar_Date.slice(0, 10)).toEqual(updateListingCalendar.listingCalendar_Date);
        expect(result.listingCalendar_isAvailable).toEqual(1);
        expect(result.listingCalendar_Price).toEqual(updateListingCalendar.listingCalendar_Price);
        expect(result.listingCalendar_AdjustedPrice).toEqual(updateListingCalendar.listingCalendar_AdjustedPrice);
    });

    // Missing fields
    test('Missing listingId', async() => {
        let invalidListingCalendar = {
            listingCalendar_Date: "2024-01-14",
            listingCalendar_Price: "22.00",
            listingCalendar_AdjustedPrice: "20.00"
        };

        const response = await request(app).put(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingId is Mandatory', 'listingId must be an integer']);
    });

    test('Missing listingCalendar_Date', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Price: "22.00",
            listingCalendar_AdjustedPrice: "20.00"
        };

        const response = await request(app).put(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingCalendar_Date is Mandatory', 'listingCalendar_Date must be a Date']);
    });

    test('Missing listingCalendar_Price', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-14",
            listingCalendar_AdjustedPrice: "20.00"
        };

        const response = await request(app).put(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingCalendar_Price is Mandatory', 'listingCalendar_Price must be a decimal']);
    });

    test('Missing listingCalendar_AdjustedPrice', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-14",
            listingCalendar_Price: "22.00",
        };

        const response = await request(app).put(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(['listingCalendar_AdjustedPrice is Mandatory', 'listingCalendar_AdjustedPrice must be a decimal']);
    });

    // Rule Violations
    test('Inconsistent original & expected prices', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-14",
            listingCalendar_Price: "22.00",
            listingCalendar_AdjustedPrice: "25.00"
        };

        const response = await request(app).put(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual("AdjustedPrice cannot be more than OriginalPrice");
    });

    test('Unavailable listingCalendar', async() => {
        let invalidListingCalendar = {
            listingId: String(1),
            listingCalendar_Date: "2024-01-12",
            listingCalendar_Price: "22.00",
            listingCalendar_AdjustedPrice: "20.00"
        };

        const response = await request(app).put(`/api/listingCalendar`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual("This listingCalendar is already reserved. Hence, currently, no changes can be made.");
    });


    // Non Exiting Record
    test('Non Existing Id', async() => {
        let lc = {
            listingId: String(10),
            listingCalendar_Date: "2024-01-12",
            listingCalendar_Price: "22.00",
            listingCalendar_AdjustedPrice: "20.00"
        };

        const response = await request(app).put(`/api/listingCalendar`).send(lc);
        expect (response.statusCode).toEqual(404);
        expect (response.body.message).toEqual(`ListingCalendar with identifier (${lc.listingId}, ${lc.listingCalendar_Date}) does not exist.`);
    });


    // Data-Type checks
    test('Invalid Data-Type', async() => {
        let invalidListingCalendar = {
            listingId: 'a',
            listingCalendar_Date: 1,
            listingCalendar_Price: 'a',
            listingCalendar_AdjustedPrice: 'b'
        };
        
        const response = await request(app).put(`/api/listingCalendar/`).send(invalidListingCalendar);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual([
            'listingId must be an integer',
            'listingCalendar_Date must be a Date',
            'listingCalendar_Price must be a decimal',
            'listingCalendar_AdjustedPrice must be a decimal'
        ]);
    });
})
/* ********************************************************************
   ******************************************************************** */



/* ********************************************************************
                  DELETE ListingCalendar
   ******************************************************************** */
describe('ListingCalendar DELETE API', () => {
    test('Existing Record', async() => {
        const response = await request(app).delete(`/api/listingCalendar/${listingId}/${listingCalendar_Date}`);
        expect (response.statusCode).toEqual(200);

        // cross-check
        const res = await request(app).get(`/api/listingCalendar/listingCalendarByIdentifier/${listingId}/${listingCalendar_Date}`);
        expect (res.statusCode).toEqual(404);
    });

    test('Non existing identifier', async() => {
        const response = await request(app).delete(`/api/listingCalendar/${listingId}/${listingCalendar_Date}`);
        expect (response.statusCode).toEqual(404);
        expect (response.body.message).toEqual(`ListingCalendar with identifier (${listingId}, ${listingCalendar_Date}) does not exist.`);
    });

    test('Invalid Data-Type', async() => {
        const response = await request(app).delete(`/api/listingCalendar/${'a'}/${'a'}`);
        expect (response.statusCode).toEqual(400);
        expect (response.body.message).toEqual(
            [
                'listingId must be an integer',
                'date must be a DATE'
            ]);
    });
})
/* ********************************************************************
   ******************************************************************** */



