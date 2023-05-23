use airbnb;

-- ***************************************************************
--			Some important queries
-- ***************************************************************
-- 1. Unverified Hosts also have verification sources
Select host_verifications, host_identity_verified from alllistings where host_identity_verified = FALSE;

-- 2. Arrays can contain no values as '[]'
Select COUNT(*) host_verifications from alllistings where host_verifications = '[]';
Select COUNT(*) host_verifications from alllistings where amenities = '[]';

-- 3. License is specific to listings (NOT host)
SELECT COUNT(distinct host_id) FROM airbnb.alllistings where license is NOT NULL;
SELECT COUNT(distinct host_id, license) FROM airbnb.alllistings where license is NOT NULL;
-- ***************************************************************
-- ***************************************************************

-- ***************************************************************
--			NULL-identifying queries (Interesting Ones)
-- ***************************************************************
SELECT COUNT(*) FROM airbnb.allcalendar WHERE available is NULL;
	-- Nullable ?  =>  No
SELECT COUNT(*) FROM airbnb.allcalendar WHERE price is NULL AND adjusted_price is NULL;
	-- Nullable ?  =>  Yes, BUT original proce shuld not be

SELECT COUNT(*) FROM airbnb.alllistings WHERE listing_url is NULL;
	-- Nullable ?  =>  No
SELECT COUNT(*) FROM airbnb.alllistings WHERE scrape_id is NULL OR last_scraped is NULL OR source is NULL;
	-- Nullable ?  =>  No
SELECT COUNT(*) FROM airbnb.alllistings WHERE picture_url is NULL;
	-- Nullable ?  =>  No
SELECT COUNT(*) FROM airbnb.alllistings WHERE host_id is NULL  OR  host_url is NULL  OR  host_verifications is NULL;
	-- Nullable ?  =>  No
SELECT COUNT(*) FROM alllistings WHERE   host_identity_verified is NULL;
	-- Nullable ?  =>  Yes, BUT: Should not be
SELECT COUNT(*) FROM airbnb.alllistings WHERE host_name is NULL;
	-- Nullable ?  =>  Yes, BUT: should not be
    
    
SELECT COUNT(*) FROM airbnb.alllistings WHERE coordinates is NULL OR property_type is NULL OR room_type is NULL OR price is NULL OR minimum_nights is NULL OR maximum_nights is NULL;
	-- Nullable ?  =>  No
SELECT COUNT(*) FROM airbnb.alllistings WHERE amenities is NULL;
	-- Nullable ?  =>  No
SELECT COUNT(*) FROM airbnb.alllistings WHERE accommodates is NULL;
	-- Nullable ?  =>  Yes, BUT: should not be
SELECT COUNT(*) FROM airbnb.alllistings WHERE instant_bookable is NULL;
	-- Nullable ?  =>  Yes, BUT: should not be
    
SELECT COUNT(*) FROM allreviews WHERE listing_id is NULL OR review_date is NULL OR reviewer_id is NULL;
	-- Nullable ?  =>  No
SELECT COUNT(*) FROM allreviews WHERE reviewer_name is NULL;
	-- Nullable ?  =>  Yes, BUT should not be
SELECT COUNT(*) FROM allreviews WHERE comments is NULL;
	-- Nullable ?  =>  Yes, BUT should not be
-- ***************************************************************
-- ***************************************************************