-- *******************************************************************************************
-- 			DATABASE
-- *******************************************************************************************
-- USE Group13;

-- *******************************************************************************************
-- 			LISTINGS DATA:  Region-Specific
-- *******************************************************************************************
drop table if exists AllCalendar;
drop table if exists AllReviews;
drop table if exists AllListings;

CREATE TABLE AllListings
    (
        listing_id BIGINT PRIMARY KEY,
        listing_url LONGTEXT,
        scrape_id BIGINT,
        last_scraped DATE,
        source CHAR(100),
        name LONGTEXT,
        description LONGTEXT,
        neighborhood_overview LONGTEXT,
        picture_url LONGTEXT,
        host_id BIGINT,
        host_url LONGTEXT,
        host_name CHAR(100),
        host_since DATE,
        host_location CHAR(100),
        host_about LONGTEXT,
        host_response_time CHAR(100),
        host_response_rate DECIMAL(5,2),
        host_acceptance_rate DECIMAL(5,2),
        host_is_superhost BOOLEAN,
        host_thumbnail_url LONGTEXT,
        host_picture_url LONGTEXT,
        host_neighbourhood LONGTEXT,
        host_listings_count INT,
        host_total_listings_count INT,
        host_verifications CHAR(100),    -- List/Array Type
        host_has_profile_pic BOOLEAN,
        host_identity_verified BOOLEAN,
        neighbourhood LONGTEXT,
        neighbourhood_cleansed LONGTEXT,
        neighbourhood_group_cleansed LONGTEXT,
        coordinates POINT,  -- Use latitude and longitude
        property_type CHAR(100),
        room_type CHAR(100),
        accommodates INT,
        bathrooms INT,
        bathrooms_text CHAR(100),
        bedrooms INT,
        beds INT,
        amenities LONGTEXT, -- List/Array Type
        price DECIMAL(10, 2),
        minimum_nights INT,
        maximum_nights INT,
        minimum_minimum_nights INT,
        maximum_minimum_nights INT,
        minimum_maximum_nights INT,
        maximum_maximum_nights INT,
        minimum_nights_avg_ntm INT,
        maximum_nights_avg_ntm INT,
        calendar_updated CHAR(100),
        has_availability BOOLEAN,
        availability_30 INT,
        availability_60 INT,
        availability_90 INT,
        availability_365 INT,
        calendar_last_scraped DATE,
        number_of_reviews  INT,
        number_of_reviews_ltm INT,
        number_of_reviews_l30d INT,
        first_review DATE,
        last_review DATE,
        review_scores_rating DECIMAL(4, 2),
        review_scores_accuracy DECIMAL(4, 2),
        review_scores_cleanliness DECIMAL(4, 2),
        review_scores_checkin DECIMAL(4, 2),
        review_scores_communication DECIMAL(4, 2),
        review_scores_location DECIMAL(4, 2),
        review_scores_value DECIMAL(4, 2),
        license CHAR(25),
        instant_bookable BOOLEAN,
        calculated_host_listings_count INT,
        calculated_host_listings_count_entire_homes INT,
        calculated_host_listings_count_private_rooms INT,
        calculated_host_listings_count_shared_rooms INT,
        reviews_per_month DECIMAL(5, 2)
    );
    
CREATE TABLE AllCalendar
    (
        listing_id BIGINT, -- REFERENCES AllListings(listing_id),
        calendar_date DATE,
        available BOOLEAN,
        price DECIMAL(10, 2),
        adjusted_price DECIMAL(10, 2),
        minimum_nights INT,
        maximum_nights INT,
        PRIMARY KEY(listing_id, calendar_date)
    );
    
CREATE TABLE AllReviews
	(
        review_id BIGINT PRIMARY KEY,
        listing_id BIGINT, -- REFERENCES AllListings(listing_id),
        review_date DATE,
        reviewer_id BIGINT,
        reviewer_name CHAR(100),
        comments LONGTEXT
    );


-- *******************************************************************************************
-- 			LISTINGS DATA:  Region-Specific
-- *******************************************************************************************
load data infile '/var/lib/mysql-files/Group13/listings.csv'
    ignore into table AllListings
    fields terminated by ','
	enclosed by '"'
    lines terminated by '\n'
    ignore 1 rows
    (
        listing_id,
        @listing_url,
        @scrape_id,
        @last_scraped,
        @source,
        @name,
        @description,
        @neighborhood_overview,
        @picture_url,
        @host_id,
        @host_url,
        @host_name,
        @host_since,
        @host_location,
        @host_about,
        @host_response_time,
        @host_response_rate,
        @host_acceptance_rate,
        @host_is_superhost,
        @host_thumbnail_url,
        @host_picture_url,
        @host_neighbourhood,
        @host_listings_count,
        @host_total_listings_count,
        @host_verifications,    -- List/Array Type
        @host_has_profile_pic,
        @host_identity_verified,
        @neighbourhood,
        @neighbourhood_cleansed,
        @neighbourhood_group_cleansed,
        @latitude, -- coordinates POINT,  -- Use latitude and longitude
        @longitude,
        @property_type,
        @room_type,
        @accommodates,
        @bathrooms,
        @bathrooms_text,
        @bedrooms,
        @beds,
        @amenities, -- List/Array Type
        @price,
        @minimum_nights,
        @maximum_nights,
        @minimum_minimum_nights,
        @maximum_minimum_nights,
        @minimum_maximum_nights,
        @maximum_maximum_nights,
        @minimum_nights_avg_ntm,
        @maximum_nights_avg_ntm,
        @calendar_updated,
        @has_availability,
        @availability_30,
        @availability_60,
        @availability_90,
        @availability_365,
        @calendar_last_scraped,
        @number_of_reviews,
        @number_of_reviews_ltm,
        @number_of_reviews_l30d,
        @first_review,
        @last_review,
        @review_scores_rating,
        @review_scores_accuracy,
        @review_scores_cleanliness,
        @review_scores_checkin,
        @review_scores_communication,
        @review_scores_location,
        @review_scores_value,
        @license,
        @instant_bookable,
        @calculated_host_listings_count,
        @calculated_host_listings_count_entire_homes,
        @calculated_host_listings_count_private_rooms,
        @calculated_host_listings_count_shared_rooms,
        @reviews_per_month
    )
    SET host_response_rate = if (@host_response_rate = '' OR @host_response_rate = 'N/A', NULL, REPLACE(@host_response_rate, '%', '')),
        host_acceptance_rate = if (@host_acceptance_rate = '' OR @host_acceptance_rate = 'N/A', NULL, REPLACE(@host_acceptance_rate, '%', '')),
        
        coordinates = if (@latitude = 'N/A' OR @longitude = 'N/A' OR @latitude = '' OR @longitude = '', NULL, POINT(@latitude, @longitude)),
        price = if (@price = '' OR @price = 'N/A', NULL, REPLACE(@price, '$', '')),
        
        -- boolean
        host_is_superhost = if (NOT @host_is_superhost = 't' AND NOT @host_is_superhost = 'f', NULL, if (@host_is_superhost = 't', true, false)),
        host_has_profile_pic = if (NOT @host_has_profile_pic = 't' AND NOT @host_has_profile_pic = 'f', NULL, if (@host_has_profile_pic = 't', true, false)),
        host_identity_verified = if (NOT @host_identity_verified = 't' AND NOT @host_identity_verified = 'f', NULL, if (@host_identity_verified = 't', true, false)),
        has_availability = if (NOT @has_availability = 't' AND NOT @has_availability = 'f', NULL, if (@has_availability = 't', true, false)),
        instant_bookable = if (NOT @instant_bookable = 't' AND NOT @instant_bookable = 'f', NULL, if (@instant_bookable = 't', true, false)),
        
        -- date
        last_scraped = if (@last_scraped = '' OR @last_scraped = 'N/A', NULL, STR_TO_DATE(@last_scraped, '%d-%m-%Y')),
        host_since = if (@host_since = '' OR @host_since = 'N/A', NULL, STR_TO_DATE(@host_since, '%d-%m-%Y')),
        first_review = if (@first_review = '' OR @first_review = 'N/A', NULL, STR_TO_DATE(@first_review, '%d-%m-%Y')),
        last_review = if (@last_review = '' OR @last_review = 'N/A', NULL, STR_TO_DATE(@last_review, '%d-%m-%Y')),
        calendar_last_scraped = if (@calendar_last_scraped = '' OR @calendar_last_scraped = 'N/A', NULL, STR_TO_DATE(@calendar_last_scraped, '%d-%m-%Y')),
        
        -- ids
        scrape_id = if (@scrape_id = '' OR @scrape_id = 'N/A', NULL, @scrape_id),
        host_id = if (@host_id = '' OR @host_id = 'N/A', NULL, @host_id),
        
        -- text data
        listing_url = if (@listing_url = '' OR @listing_url = 'N/A', NULL, @listing_url),
        source  = if (@source = '' OR @source = 'N/A', NULL, @source),
        name  = if (@name = '' OR @name = 'N/A', NULL, @name),
        description  = if (@description = '' OR @description = 'N/A', NULL, @description),
        neighborhood_overview  = if (@neighborhood_overview = '' OR @neighborhood_overview = 'N/A', NULL, @neighborhood_overview),
        picture_url  = if (@picture_url = '' OR @picture_url = 'N/A', NULL, @picture_url),
        host_url  = if (@host_url = '' OR @host_url = 'N/A', NULL, @host_url),
        host_name = if (@host_name = '' OR @host_name = 'N/A', NULL, @host_name),
        host_location = if (@host_location = '' OR @host_location = 'N/A', NULL, @host_location),
        host_about = if (@host_about = '' OR @host_about = 'N/A', NULL, @host_about),
        host_response_time = if (@host_response_time = '' OR @host_response_time = 'N/A', NULL, @host_response_time),
        host_thumbnail_url = if (@host_thumbnail_url = '' OR @host_thumbnail_url = 'N/A', NULL, @host_thumbnail_url),
        host_picture_url = if (@host_picture_url = '' OR @host_picture_url = 'N/A', NULL, @host_picture_url),
        host_neighbourhood = if (@host_neighbourhood = '' OR @host_neighbourhood = 'N/A', NULL, @host_neighbourhood),
        host_verifications = if (@host_verifications = '' OR @host_verifications = 'N/A', NULL, @host_verifications),    -- List/Array Type
        neighbourhood = if (@neighbourhood = '' OR @neighbourhood = 'N/A', NULL, @neighbourhood),
        neighbourhood_cleansed = if (@neighbourhood_cleansed = '' OR @neighbourhood_cleansed = 'N/A', NULL, @neighbourhood_cleansed),
        neighbourhood_group_cleansed = if (@neighbourhood_group_cleansed = '' OR @neighbourhood_group_cleansed = 'N/A', NULL, @neighbourhood_group_cleansed),
        property_type = if (@property_type = '' OR @property_type = 'N/A', NULL, @property_type),
        room_type = if (@room_type = '' OR @room_type = 'N/A', NULL, @room_type),
        bathrooms_text = if (@bathrooms_text = '' OR @bathrooms_text = 'N/A', NULL, @bathrooms_text),
        amenities = if (@amenities = '' OR @amenities = 'N/A', NULL, @amenities), -- List/Array Type
        calendar_updated = if (@calendar_updated = '' OR @calendar_updated = 'N/A', NULL, @calendar_updated),
        license = if (@license = '' OR @license = 'N/A', NULL, @license),
        
        -- count
        host_listings_count = if (@host_listings_count = '' OR @host_listings_count = 'N/A', NULL, @host_listings_count),
        host_total_listings_count = if (@host_total_listings_count = '' OR @host_total_listings_count = 'N/A', NULL, @host_total_listings_count),
        accommodates = if (@accommodates = '' OR @accommodates = 'N/A', NULL, @accommodates),
        bathrooms = if (@bathrooms = '' OR @bathrooms = 'N/A', NULL, @bathrooms),
        bedrooms = if (@bedrooms = '' OR @bedrooms = 'N/A', NULL, @bedrooms),
        beds = if (@beds = '' OR @beds = 'N/A', NULL, @beds),
        minimum_nights = if (@minimum_nights = '' OR @minimum_nights = 'N/A', NULL, @minimum_nights),
        maximum_nights = if (@maximum_nights = '' OR @maximum_nights = 'N/A', NULL, @maximum_nights),
        minimum_minimum_nights = if (@minimum_minimum_nights = '' OR @minimum_minimum_nights = 'N/A', NULL, @minimum_minimum_nights),
        maximum_minimum_nights = if (@maximum_minimum_nights = '' OR @maximum_minimum_nights = 'N/A', NULL, @maximum_minimum_nights),
        minimum_maximum_nights = if (@minimum_maximum_nights = '' OR @minimum_maximum_nights = 'N/A', NULL, @minimum_maximum_nights),
        maximum_maximum_nights = if (@maximum_maximum_nights = '' OR @maximum_maximum_nights = 'N/A', NULL, @maximum_maximum_nights),
        minimum_nights_avg_ntm = if (@minimum_nights_avg_ntm = '' OR @minimum_nights_avg_ntm = 'N/A', NULL, @minimum_nights_avg_ntm),
        maximum_nights_avg_ntm = if (@maximum_nights_avg_ntm = '' OR @maximum_nights_avg_ntm = 'N/A', NULL, @maximum_nights_avg_ntm),
        availability_30 = if (@availability_30 = '' OR @availability_30 = 'N/A', NULL, @availability_30),
        availability_60 = if (@availability_60 = '' OR @availability_60 = 'N/A', NULL, @availability_60),
        availability_90 = if (@availability_90 = '' OR @availability_90 = 'N/A', NULL, @availability_90),
        availability_365 = if (@availability_365 = '' OR @availability_365 = 'N/A', NULL, @availability_365),
        number_of_reviews  = if (@number_of_reviews = '' OR @number_of_reviews = 'N/A', NULL, @number_of_reviews),
        number_of_reviews_ltm = if (@number_of_reviews_ltm = '' OR @number_of_reviews_ltm = 'N/A', NULL, @number_of_reviews_ltm),
        number_of_reviews_l30d = if (@number_of_reviews_l30d = '' OR @number_of_reviews_l30d = 'N/A', NULL, @number_of_reviews_l30d),
        calculated_host_listings_count = if (@calculated_host_listings_count = '' OR @calculated_host_listings_count = 'N/A', NULL, @calculated_host_listings_count),
        calculated_host_listings_count_entire_homes = if (@calculated_host_listings_count_entire_homes = '' OR @calculated_host_listings_count_entire_homes = 'N/A', NULL, @calculated_host_listings_count_entire_homes),
        calculated_host_listings_count_private_rooms = if (@calculated_host_listings_count_private_rooms = '' OR @calculated_host_listings_count_private_rooms = 'N/A', NULL, @calculated_host_listings_count_private_rooms),
        calculated_host_listings_count_shared_rooms = if (@calculated_host_listings_count_shared_rooms = '' OR @calculated_host_listings_count_shared_rooms = 'N/A', NULL, @calculated_host_listings_count_shared_rooms),
        
        -- ratings
        review_scores_rating = if (@review_scores_rating = '' OR @review_scores_rating = 'N/A', NULL, @review_scores_rating),
        review_scores_accuracy = if (@review_scores_accuracy = '' OR @review_scores_accuracy = 'N/A', NULL, @review_scores_accuracy),
        review_scores_cleanliness = if (@review_scores_cleanliness = '' OR @review_scores_cleanliness = 'N/A', NULL, @review_scores_cleanliness),
        review_scores_checkin = if (@review_scores_checkin = '' OR @review_scores_checkin = 'N/A', NULL, @review_scores_checkin),
        review_scores_communication = if (@review_scores_communication = '' OR @review_scores_communication = 'N/A', NULL, @review_scores_communication),
        review_scores_location = if (@review_scores_location = '' OR @review_scores_location = 'N/A', NULL, @review_scores_location),
        review_scores_value = if (@review_scores_value = '' OR @review_scores_value = 'N/A', NULL, @review_scores_value),
        reviews_per_month = if (@reviews_per_month = '' OR @reviews_per_month = 'N/A', NULL, @reviews_per_month);
-- *******************************************************************************************
-- *******************************************************************************************

        
-- *******************************************************************************************
-- 			REVIEWS DATA:  Region-Specific
-- *******************************************************************************************
 load data infile '/var/lib/mysql-files/Group13/reviews.csv'
     ignore into table AllReviews
     fields terminated by ','
 	 enclosed by '"'
     lines terminated by '\n'
     ignore 1 rows
     (
         listing_id,
         review_id,
         @review_date,
         @reviewer_id,
         @reviewer_name,
         @comments
     )
     SET review_date = if (@review_date = '' OR @review_date = 'N/A', NULL, @review_date),
 		 reviewer_id = if (@reviewer_id = '' OR @reviewer_id = 'N/A', NULL, @reviewer_id),
         reviewer_name = if (@reviewer_name = '' OR @reviewer_name = 'N/A', NULL, @reviewer_name),
         comments = if (@comments = '' OR @comments = 'N/A', NULL, @comments);
         
-- *******************************************************************************************
-- *******************************************************************************************



-- *******************************************************************************************
-- 			CALENDAR DATA:  Region-Specific
-- *******************************************************************************************
load data infile '/var/lib/mysql-files/Group13/calendar.csv'
    ignore into table AllCalendar
    fields terminated by ','
	enclosed by '"'
    lines terminated by '\n'
    ignore 1 rows
    (
        @listing_id,
        @calendar_date,
        @available,
        @price,
        @adjusted_price,
        @minimum_nights,
        @maximum_nights
    )
    SET listing_id = if (@listing_id = '' OR @listing_id = 'N/A', NULL, @listing_id),
		calendar_date = if (@calendar_date = '' OR @calendar_date = 'N/A', NULL, @calendar_date),
		
        available = if (NOT @available = 't' AND NOT @available = 'f', NULL, if (@available = 't', true, false)),
        price = if (@price = '' OR @price = 'N/A', NULL, REPLACE(@price, '$', '')),
        adjusted_price = if (@adjusted_price = '' OR @adjusted_price = 'N/A', NULL, REPLACE(@adjusted_price, '$', '')),
        minimum_nights = if (@minimum_nights = '' OR @minimum_nights = 'N/A', NULL, @minimum_nights),
        maximum_nights = if (@maximum_nights = '' OR @maximum_nights = 'N/A', NULL, @maximum_nights);
        
-- *******************************************************************************************
-- *******************************************************************************************