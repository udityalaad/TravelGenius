-- User Centric
INSERT IGNORE INTO UserAccount
    (
		userId,
		userName,
		userEmail,
		password
    ) VALUES (1, 'customer1', 'customer1@email.com', 'user1@password'),
			(2, 'customer2', 'customer2@email.com', 'user2@password'),
			(3, 'host1', 'host1@email.com', 'user3@password'),
			(4, 'host2', 'host2@email.com', 'user4@password'),
			(5, 'customer5', 'customer3@email.com', 'user5@password'),
			(6, 'host6', 'host3@email.com', 'user6@password');

INSERT IGNORE INTO CustomerAccount
    (
		userId,
        isCustomerAccountActive
    ) VALUES (1, 1),
			(2, 1),
			(5, 1);

INSERT IGNORE INTO VerificationSourceDomain
    (
		source
	)
	VALUES 	('email'),
			('phone'),
			('work_email'),
			('photographer');

INSERT IGNORE INTO HostAccount
    (
		userId,
        hostUrl,
        hostSince,
        hostAbout,
        isSuperhost,
        hostThumbnailUrl,
        hostPictureUrl,
        hostLocation,
        hostNeighbourhood,
        
        response_time,
        response_rate,
        acceptance_rate,
        
        hostIsIdentityVerified,
        isHostAccountActive
    ) VALUES (3, 'https://www.airbnb.com/users/show/host1', null, 'host1 about', 0, 'https://a0.muscache.com/im/pictures/userhost1/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_small',
					'https://a0.muscache.com/im/pictures/userhosthost1/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_x_medium',
					'Vancouver, Canada', 'Commercial Drive', 
					null, null, null, 0, 1),
			(4, 'https://www.airbnb.com/users/show/host2', null, 'host2 about', 0, 'https://a0.muscache.com/im/pictures/userhost2/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_small',
					'https://a0.muscache.com/im/pictures/userhosthost2/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_x_medium',
					'Vancouver, Canada', 'Commercial Drive',
					null, null, null, 0, 1),
			(6, 'https://www.airbnb.com/users/show/host3', null, 'host3 about', 0, 'https://a0.muscache.com/im/pictures/userhost3/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_small',
					'https://a0.muscache.com/im/pictures/userhosthost3/7aeea16d-829a-4d68-8dff-6c9c0ce1d3bf.jpg?aki_policy=profile_x_medium',
					'Vancouver, Canada', 'Commercial Drive',
					null, null, null, 0, 1);

CALL procedure_insertMultivaluedAttributes('HostVerificationSource', 'userId', 'source', 3, "['email', 'phone']", @res);
CALL procedure_insertMultivaluedAttributes('HostVerificationSource', 'userId', 'source', 4, "['email']", @res);
CALL procedure_insertMultivaluedAttributes('HostVerificationSource', 'userId', 'source', 6, "['email']", @res);


INSERT IGNORE INTO Listing (
				listingId,
				listingUrl,
				listingName,
				listingDescription,
				listingPictureUrl,
				listingLicense,
				listingInstantBookable,
				listingMinimumNights,
				listingMaximumNights,
				hostId
			) VALUES ( 1, "https://www.airbnb.com/rooms/listing1", "listingName_1", "listingDescription_1", "https://a0.muscache.com/pictures/76206750/d64310e4_original/listing1.jpg",
						null, 0, 1, 3, 3 ),
					( 2, "https://www.airbnb.com/rooms/listing2", "listingName_2", "listingDescription_2", "https://a0.muscache.com/pictures/76206750/d64310e4_original/listing2.jpg",
						null, 0, 1, 3, 4 ),
					( 3, "https://www.airbnb.com/rooms/listing3", "listingName_3", "listingDescription_3", "https://a0.muscache.com/pictures/76206750/d64310e4_original/listing3.jpg",
						null, 0, 1, 3, 6 );


INSERT INTO PropertyNeighbourhoodCleansing (
            propertyNeighbourhoodCleansed,
            propertyNeighbourhood
        ) VALUES ("propertyNeighbourhoodCleansed1", "propertyNeighbourhood1"),
				("propertyNeighbourhoodCleansed2", "propertyNeighbourhood2"),
				("propertyNeighbourhoodCleansed3", "propertyNeighbourhood3");


INSERT INTO PropertyTypeDomain (
            propertyType
        ) VALUES ('propertyType1'),
				('propertyType2'),
				('propertyType3'),
				('propertyType4');


INSERT IGNORE INTO Property (
			listingId,
			propertyType,
			roomType,
			accommodates,
			noBathrooms,
			bathroomType,
			noBedrooms,
			noBeds,
			propertyNeighborhoodOverview,
			propertyNeighbourhoodCleansed,
			propertyCoordinates  -- Use latitude and longitude
		) VALUES (1, "propertyType1", "Entire home/apt", 1, 1, "shared bath", 1, 1,
					"propertyNeighborhoodOverview", "propertyNeighbourhoodCleansed1", POINT(23.6459, 10.42423)),
				(2, "propertyType2", "Entire home/apt", 2, 2, "shared bath", 2, 2,
					"propertyNeighborhoodOverview", "propertyNeighbourhoodCleansed2", POINT(22.11, 11.11)),
				(3, "propertyType3", "Entire home/apt", 3, 3, "half bath", 3, 3,
					"propertyNeighborhoodOverview", "propertyNeighbourhoodCleansed3", POINT(33.11, 22.11));

SET @res = 0;
CALL procedure_insertMultivaluedAttributes('PropertyAmenities', 'listingId', 'amenity', 1, '["TV", "Wifi"]', @res);
CALL procedure_insertMultivaluedAttributes('PropertyAmenities', 'listingId', 'amenity', 2, null, @res);
CALL procedure_insertMultivaluedAttributes('PropertyAmenities', 'listingId', 'amenity', 3, null, @res);


INSERT IGNORE INTO Review (
				reviewId,
				listingId,
				reviewDate,
				reviewerId,
				reviewComments
			) VALUES (1, 1, CURDATE(), 1, "Review-1"),
					(2, 2, CURDATE(), 1, "Review-2"),
					(3, 1, CURDATE(), 2, "Review-3"),
					(4, 2, CURDATE(), 2, "Review-4");


INSERT IGNORE INTO ListingCalendar
        (
		listingId,
		listingCalendar_Date,
		listingCalendar_isAvailable,
		listingCalendar_Price,
		listingCalendar_AdjustedPrice
    ) VALUES (1, '2024-01-11', 1, "22.00", "18.00"),
			(1, '2024-01-12', 0, "50.00", "50.00"),
			(2, '2024-02-21', 1, "25.00", "23.00"),
			(2, '2024-02-22', 0, "50.00", "45.00"),			
			(3, '2024-03-21', 1, "42.00", "34.00"),
			(3, '2024-03-23', 0, "51.00", "45.00");



INSERT IGNORE INTO Payment (
		paymentId,
		interacId,
		paymentStatus
	) VALUES (1, 'interac1@email.com', 'Completed'),
			(2, 'interac2@email.com', 'Completed'),
			(3, 'interac3@email.com', 'Completed'),
			(4, 'interac4@email.com', 'Completed');


INSERT IGNORE INTO ReservedCalendar
        (
		listingId,
		listingCalendar_Date,
		customerId,
		paymentId
    ) VALUES (1, '2024-01-12', 1, 1),
			(2, '2024-02-22', 2, 2),
			(3, '2024-03-23', 5, 3);