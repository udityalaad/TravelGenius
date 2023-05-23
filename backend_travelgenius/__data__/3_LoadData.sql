-- *******************************************************************************************
-- 			Add Data from new Datasets
-- *******************************************************************************************
-- User Centric
INSERT IGNORE INTO UserAccount
    (
		userId,
		userName
    )
	SELECT 	id,
			name
		FROM ( (SELECT DISTINCT reviewer_id as id, reviewer_name as name FROM AllReviews)
				UNION
			   (SELECT DISTINCT host_id as id, host_name as name FROM AllListings)
			 ) as usersCombined;

INSERT IGNORE INTO CustomerAccount
    (
		userId,
        isCustomerAccountActive
    )
	SELECT DISTINCT
			reviewer_id,
            1
		FROM AllReviews;


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
    )
	SELECT DISTINCT
			host_id,
			host_url,
			host_since,
			host_about,
			host_is_superhost,
			host_thumbnail_url,
			host_picture_url,
			host_location,
			host_neighbourhood,
			host_response_time,
			host_response_rate,
			host_acceptance_rate,
			host_identity_verified,
			1
		FROM AllListings;

CALL procedure_insertHostVerifications();


-- Listing + Property  
INSERT IGNORE INTO Listing
    (
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
    )
	SELECT DISTINCT
			listing_id,
			listing_url,
			name,
            description,
            picture_url,
            license,
			instant_bookable,
			minimum_nights,
			maximum_nights,
			host_id
		FROM AllListings;
        
        
INSERT IGNORE INTO PropertyNeighbourhoodCleansing
    (
		propertyNeighbourhoodCleansed,
		propertyNeighbourhood
    )
	SELECT DISTINCT
			neighbourhood_cleansed,
            neighbourhood
		FROM AllListings;


INSERT IGNORE INTO PropertyTypeDomain
    (
		propertyType
    )
	SELECT DISTINCT
			property_type
		FROM AllListings;


INSERT IGNORE INTO Property
    (
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
    )
	SELECT DISTINCT
			listing_id,
			property_type,
			room_type,
            accommodates,
			IF(REGEXP_REPLACE(bathrooms_text, '[^0-9.]+', '') = '', NULL, REGEXP_REPLACE(bathrooms_text, '[^0-9.]+', '')),
			IF(REGEXP_REPLACE(bathrooms_text, '[0-9.]+', '') = '', NULL, LOWER(REPLACE(REPLACE(TRIM(REGEXP_REPLACE(bathrooms_text, '[0-9.]+', '')), 'baths', 'bath'), '-', ' '))) as x,
			bedrooms,
            beds,
            neighborhood_overview,
            neighbourhood_cleansed,
            coordinates
		FROM AllListings;
        
CALL procedure_insertAmenities();


-- Review
INSERT IGNORE INTO Review
    (
		reviewId,
		listingId, -- REFERENCES Listing(listingId),
		reviewDate,
		reviewerId,
		reviewComments
    )
	SELECT DISTINCT
			review_id,
			listing_id,
			review_date,
			reviewer_id,
			comments
		FROM AllReviews
        ;



-- ListingAvailableDays + Reservation
INSERT IGNORE INTO ListingCalendar
    (
		listingId,
		listingCalendar_Date,
		listingCalendar_isAvailable,
		listingCalendar_Price,
		listingCalendar_AdjustedPrice
    )
	SELECT DISTINCT
			listing_id,
			calendar_date,
			available,
			price,
			adjusted_price
		FROM AllCalendar;

        
INSERT IGNORE INTO ReservedCalendar
    (
		listingId,
		listingCalendar_Date,
		customerId,
		paymentId
    )
	SELECT DISTINCT
			listing_id,
			calendar_date,
			null,
            null
		FROM AllCalendar
        WHERE available = FALSE;
        
        
-- *******************************************************************************************
-- 			Remove Temporary Tables
-- *******************************************************************************************
drop table if exists AllCalendar;
drop table if exists AllReviews;
drop table if exists AllListings;