const request = require('supertest');
const app = require('../../server');

/* ********* Allow more time for highly interactive elements ********* */
jest.setTimeout(500000);

/* ********* Explicit Mocks ********* */
jest.mock("../../Config/dbProperties.js");

/* ********* Test Data ********* */
let userId = 7;
let host = {
  userName: "host4",
  userEmail: "host4@email.com",
  hostAbout: "host4 about",
  isSuperhost: 0,
  hostThumbnailUrl: "https://a0.muscache.com/im/pictures/userhost4/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_small",
  hostPictureUrl: "https://a0.muscache.com/im/pictures/userhosthost4/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_x_medium",
  hostLocation: "Vancouver, Canada",
  hostNeighbourhood: "Commercial Drive",
  password: "user7@password"
};


/* ********************************************************************
                  Create Host
   ******************************************************************** */
describe('Host POST API', () => {
  // Success
  test('New Record', async() => {
    const response = await request(app).post(`/api/host`).send(host);
    expect (response.statusCode).toEqual(200);
    expect(response.body.userId).toEqual(String(userId));
  });

  test('New Record (Without mandatory fields)', async() => {
    let new_host = {
      userName: "host5",
      userEmail: "host5@email.com",
      isSuperhost: 0,
      password: "user8@password"
    };

    const response = await request(app).post(`/api/host`).send(new_host);
    expect (response.statusCode).toEqual(200);
    expect(response.body.userId).toEqual(String(userId + 1));
  });

  // Duplicates
  test('Existing Email Id', async() => {
    const response = await request(app).post(`/api/host`).send(host);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Another host with email ${host.userEmail} already exist.`);
  });

  test('Existing Thumbnail URL', async() => {
    let new_host = {
      userName: "host6",
      userEmail: "host6@email.com",
      hostUrl: "https://www.airbnb.com/users/show/host6",
      hostThumbnailUrl: "https://a0.muscache.com/im/pictures/userhost3/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_small",
      isSuperhost: 0,
      password: "user9@password"
    };
    
    const response = await request(app).post(`/api/host`).send(new_host);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Another host with hostThumbnailUrl ${new_host.hostThumbnailUrl} already exist.`);
  });

  test('Existing Picture URL', async() => {
    let new_host = {
      userName: "host6",
      userEmail: "host6@email.com",
      hostUrl: "https://www.airbnb.com/users/show/host6",
      hostPictureUrl: "https://a0.muscache.com/im/pictures/userhosthost3/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_x_medium",
      isSuperhost: 0,
      password: "user9@password"
    };
    
    const response = await request(app).post(`/api/host`).send(new_host);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Another host with hostPictureUrl ${new_host.hostPictureUrl} already exist.`);
  });


  // Missing Fields
  test('Missing userName', async() => {
    let invalidHost = {
      userEmail: "host6@email.com",
      hostUrl: "https://www.airbnb.com/users/show/host5",
      isSuperhost: 0,
      password: "user9@password"
    };

    const response = await request(app).post(`/api/host`).send(invalidHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['userName is Mandatory', 'userName must be a string']);
  });

  test('Missing Email Id', async() => {
    let invalidHost = {
      userName: "host6",
      hostUrl: "https://www.airbnb.com/users/show/host5",
      isSuperhost: 0,
      password: "user9@password"
    };

    const response = await request(app).post(`/api/host`).send(invalidHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['userEmail is Mandatory', `Invalid Email Id`]);
  });

  test('Missing password', async() => {
    let invalidHost = {
      userName: "host6",
      userEmail: "host6@email.com",
      hostUrl: "https://www.airbnb.com/users/show/host5",
      isSuperhost: 0
    };

    const response = await request(app).post(`/api/host`).send(invalidHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['password is Mandatory', 'password requirements not met']);
  });


  // Violating Format
  test('Invalid Email Id', async() => {
    let new_host = {
      userName: "host6",
      userEmail: "host6email.com",
      hostUrl: "https://www.airbnb.com/users/show/host5",
      hostThumbnailUrl: "https://a011.muscache.com/im/pictures/userhost6/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_small",
      hostPictureUrl: "https://a0.muscache.com/im/pictures/userhosthost6/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_x_medium",
      isSuperhost: 0,
      password: "user6@password"
    };

    const response = await request(app).post(`/api/host`).send(new_host);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid Email Id"]);
  });


  test('Invalid Thumbnail URL', async() => {
    let new_host = {
      userName: "host6",
      userEmail: "host6@email.com",
      hostUrl: "https://www.airbnb.com/users/show/host6",
      hostThumbnailUrl: "pictures/userhost6/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_small",
      hostPictureUrl: "https://a0.muscache.com/im/pictures/userhosthost6/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_x_medium",
      isSuperhost: 0,
      password: "user6@password"
    };

    const response = await request(app).post(`/api/host`).send(new_host);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid Thumbnail URL"]);
  });

  test('Invalid Picture URL', async() => {
    let new_host = {
      userName: "host6",
      userEmail: "host6@email.com",
      hostUrl: "https://www.airbnb.com/users/show/host6",
      hostPictureUrl: "ht0.userhosthost6/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_x_medium",
      isSuperhost: 0,
      password: "user6@password"
    };

    const response = await request(app).post(`/api/host`).send(new_host);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid Picture URL"]);
  });


  test('Invalid password', async() => {
    let new_host = {
      userName: "host6",
      userEmail: "host6@email.com",
      hostUrl: "https://www.airbnb.com/users/show/host6",
      hostThumbnailUrl: "https://a0.muscache.com/im/pictures/userhost6/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_small",
      hostPictureUrl: "https://a0.muscache.com/im/pictures/userhosthost6/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_x_medium",
      isSuperhost: 0,
      password: "user6password"
    };

    const response = await request(app).post(`/api/host`).send(new_host);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["password requirements not met"]);
  });


  // Data-Type checks
  test('Invalid Data-Type', async() => {
    let new_host = {
      userName: 1,
      userEmail: 1,
      hostUrl: 1,
      hostAbout: 2,
      isSuperhost: 2,
      hostThumbnailUrl: 1,
      hostPictureUrl: 1,
      hostLocation: 1,
      hostNeighbourhood: 1,
      password: 1
    };
    
    const response = await request(app).post(`/api/host/`).send(new_host);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([
      'isSuperhost must be a binary',
      `Invalid Thumbnail URL`,
      `Invalid Picture URL`,
      'hostAbout must be a string',
      'hostLocation must be a string',
      'hostNeighbourhood must be a string',
      `Invalid Email Id`,
      'password requirements not met',
      'userName must be a string'
    ]);
  });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  Get Host By Id
   ******************************************************************** */
describe('Host GET API', () => {
  test('Existing Record', async() => {
    const response = await request(app).get(`/api/host/${userId}`);

    expect (response.statusCode).toEqual(200);

    const resHost = response.body.host;
    expect(resHost.userId).toEqual(String(userId));
    expect(resHost.userName).toEqual(host.userName);
    expect(resHost.userEmail).toEqual(host.userEmail);
    expect(resHost.isHostAccountActive).toEqual(1);
  });

  test('Non existing record', async() => {
    let nonExisting_userId = 10;
    const response = await request(app).get(`/api/host/${nonExisting_userId}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Host with id ${nonExisting_userId} does not exist.`);
  });

  test('Invalid Data-Type', async() => {
    const response = await request(app).get(`/api/host/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['id must be an integer']);
  });
})
/* ********************************************************************
   ******************************************************************** */


/* ********************************************************************
                  PUT call (Update Customer)
   ******************************************************************** */
describe('Host PUT API', () => {
  // Success
  test('Valid Record', async() => {
    let updateHost = {
      userId: String(userId),
      userName: "new_11" + host.userName,
      userEmail: "new_11" + host.userEmail,
      hostAbout: host.hostAbout + "_new11",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new11",
      hostPictureUrl: host.hostPictureUrl + "_new11",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };

    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(200);
    
    // cross-check
    const res = await request(app).get(`/api/host/${userId}`);
    expect (res.statusCode).toEqual(200);

    const resHost = res.body.host;
    expect(resHost.userId).toEqual(String(userId));
    expect(resHost.userName).toEqual(updateHost.userName);
    expect(resHost.userEmail).toEqual(updateHost.userEmail);
    expect(resHost.hostAbout).toEqual(updateHost.hostAbout);
    expect(resHost.isSuperhost).toEqual(updateHost.isSuperhost);
    expect(resHost.hostThumbnailUrl).toEqual(updateHost.hostThumbnailUrl);
    expect(resHost.hostPictureUrl).toEqual(updateHost.hostPictureUrl);
    expect(resHost.hostLocation).toEqual(updateHost.hostLocation);
    expect(resHost.isHostAccountActive).toEqual(1);
  });


  test('Valid Record', async() => {
    let updateHost = {
      userId: String(userId + 1),
      userName: "new_12" + host.userName,
      userEmail: "new_12" + host.userEmail,
      isSuperhost: 0,
      hostIsIdentityVerified: 0,
      isHostAccountActive: 1,
    };
    
    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(200);
    
    // cross-check
    const res = await request(app).get(`/api/host/${userId + 1}`);
    expect (res.statusCode).toEqual(200);

    const resHost = res.body.host;
    expect(resHost.userId).toEqual(String(userId + 1));
    expect(resHost.userName).toEqual(updateHost.userName);
    expect(resHost.userEmail).toEqual(updateHost.userEmail);
    expect(resHost.hostAbout).toEqual(null);
    expect(resHost.isSuperhost).toEqual(updateHost.isSuperhost);
    expect(resHost.hostThumbnailUrl).toEqual(null);
    expect(resHost.hostPictureUrl).toEqual(null);
    expect(resHost.hostLocation).toEqual(null);
    expect(resHost.isHostAccountActive).toEqual(1);
  });


  // Duplicate URLs
  test('Existing Email Id', async() => {
    let updateHost = {
      userId: String(userId + 1),
      userName: "new_12" + host.userName,
      userEmail: "new_11" + host.userEmail,
      hostAbout: host.hostAbout + "_new12",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new12",
      hostPictureUrl: host.hostPictureUrl + "_new12",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };

    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(400);
  });

  test('Existing Thumbnail URL', async() => {
    let updateHost = {
      userId: String(userId + 1),
      userName: "new_12" + host.userName,
      userEmail: "new_12" + host.userEmail,
      hostAbout: host.hostAbout + "_new12",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new11",
      hostPictureUrl: host.hostPictureUrl + "_new12",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };
    
    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Another host with hostThumbnailUrl ${updateHost.hostThumbnailUrl} already exist.`);
  });

  test('Existing Picture URL', async() => {
    let updateHost = {
      userId: String(userId + 1),
      userName: "new_12" + host.userName,
      userEmail: "new_12" + host.userEmail,
      hostAbout: host.hostAbout + "_new12",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new12",
      hostPictureUrl: host.hostPictureUrl + "_new11",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };
    
    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`Another host with hostPictureUrl ${updateHost.hostPictureUrl} already exist.`);
  });


  // Missing Fields
  test('Missing User Id', async() => {
    let updateHost = {
      userName: "new_13" + host.userName,
      userEmail: "new_13" + host.userEmail,
      hostAbout: host.hostAbout + "_new13",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new13",
      hostPictureUrl: host.hostPictureUrl + "_new11",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };

    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['userId is Mandatory', 'userId must be a integer']);
  });

  test('Missing Email Id', async() => {
    let updateHost = {
      userId: String(userId + 1),
      userName: "new_13" + host.userName,
      hostAbout: host.hostAbout + "_new13",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new13",
      hostPictureUrl: host.hostPictureUrl + "_new11",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };

    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['userEmail is Mandatory', `Invalid Email Id`]);
  });

  test('Missing userName', async() => {
    let updateHost = {
      userId: String(userId + 1),
      userEmail: "new_13" + host.userEmail,
      hostAbout: host.hostAbout + "_new13",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new13",
      hostPictureUrl: host.hostPictureUrl + "_new11",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };

    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['userName is Mandatory', 'userName must be a string']);
  });

  // Violating Format
  test('Invalid Email Id', async() => {
    let updateHost = {
      userId: String(userId + 1),
      userName: "new_14" + host.userName,
      userEmail: "new_14",
      hostAbout: host.hostAbout + "_new14",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new14",
      hostPictureUrl: host.hostPictureUrl + "_new14",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };

    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid Email Id"]);
  });

  test('Invalid Thumbnail URL', async() => {
    let updateHost = {
      userId: String(userId + 1),
      userName: "new_14" + host.userName,
      userEmail: "new_14" + host.userEmail,
      hostAbout: host.hostAbout + "_new14",
      isSuperhost: 0,
      hostThumbnailUrl: "_new14",
      hostPictureUrl: host.hostPictureUrl + "_new14",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };

    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid Thumbnail URL"]);
  });

  test('Invalid Picture URL', async() => {
    let updateHost = {
      userId: String(userId + 1),
      userName: "new_14" + host.userName,
      userEmail: "new_14" + host.userEmail,
      hostAbout: host.hostAbout + "_new14",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new14",
      hostPictureUrl: "_new14",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };

    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(["Invalid Picture URL"]);
  });

  // Non-existing Id
  test('Non Existing Id', async() => {
    let updateHost = {
      userId: String(userId + 6),
      userName: "new_14" + host.userName,
      userEmail: "new_14" + host.userEmail,
      hostAbout: host.hostAbout + "_new14",
      isSuperhost: 0,
      hostThumbnailUrl: host.hostThumbnailUrl + "_new14",
      hostPictureUrl: host.hostPictureUrl + "_new14",
      hostLocation: "Vancouver",
      hostNeighbourhood: "Commercial",
      hostIsIdentityVerified: 0,
      hostVerificationSources: "[]"
    };

    const response = await request(app).put(`/api/host`).send(updateHost);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Host with id ${updateHost.userId} does not exist.`);
  });

  // Data-Type checks
  test('Invalid Data-Type', async() => {
    let updateHost = {
      userId: 'a',
      userName: 1,
      userEmail: 1,
      hostAbout: 1,
      isSuperhost: 2,
      hostThumbnailUrl: 1,
      hostPictureUrl: 1,
      hostLocation: 1,
      hostNeighbourhood: 1,
      hostIsIdentityVerified: 2,
      hostVerificationSources: 1
    };
    
    const response = await request(app).put(`/api/host/`).send(updateHost);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual([
      'isSuperhost must be a binary',
      `Invalid Thumbnail URL`,
      `Invalid Picture URL`,
      'hostAbout must be a string',
      'hostLocation must be a string',
      'hostNeighbourhood must be a string',
      'userId must be a integer',
      `Invalid Email Id`,
      'userName must be a string'
    ]);
  });
})
/* ********************************************************************
   ******************************************************************** */



/* ********************************************************************
                  Deactivate Customer
   ******************************************************************** */
describe('Host DELETE API', () => {
  test('Existing Record', async() => {
    const response = await request(app).delete(`/api/host/${userId}`);
    expect (response.statusCode).toEqual(200);

    // cross-check
    const res = await request(app).get(`/api/host/${userId}`);
    expect (res.statusCode).toEqual(200);
    expect(res.body.host.isHostAccountActive).toEqual(0);
  });

  test('Non existing userId', async() => {
    let nonExisting_userId = String(10);
    const response = await request(app).delete(`/api/host/${nonExisting_userId}`);
    expect (response.statusCode).toEqual(404);
    expect (response.body.message).toEqual(`Host with id ${nonExisting_userId} does not exist.`);
  });

  test('Has a current and/or future reservation on an associated listing', async() => {
    let relevant_userId = String(6); 
    const response = await request(app).delete(`/api/host/${relevant_userId}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(`There are active reservations for Host with Id ${relevant_userId}. Please clear those first.`);
  });
  
  test('Invalid Data-Type', async() => {
    const response = await request(app).delete(`/api/host/${'a'}`);
    expect (response.statusCode).toEqual(400);
    expect (response.body.message).toEqual(['id must be an integer']);
  });
})
/* ********************************************************************
   ******************************************************************** */