-- *************************************************************************************************
--                Cleanup
-- *************************************************************************************************
-- Stored Procedures
DROP PROCEDURE IF EXISTS procedure_insertCustomer;

DROP PROCEDURE IF EXISTS procedure_insertHost;
DROP PROCEDURE IF EXISTS procedure_updateHost;

DROP PROCEDURE IF EXISTS procedure_insertListing;
DROP PROCEDURE IF EXISTS procedure_deleteListing;

DROP PROCEDURE IF EXISTS procedure_insertPayment;

DROP PROCEDURE IF EXISTS procedure_insertListingCalendar;
DROP PROCEDURE IF EXISTS procedure_insertReservedCalendar;

DROP PROCEDURE IF EXISTS procedure_insertReview;

DROP PROCEDURE IF EXISTS procedure_insertMultivaluedAttributes;
DROP PROCEDURE IF EXISTS procedure_insertAmenities;
DROP PROCEDURE IF EXISTS procedure_insertHostVerifications;

-- Views
drop view if exists Customer;
drop view if exists Host;

drop view if exists ListingInfo;
drop view if exists ListingCalendarInfo;
drop view if exists ReservedCalendarInfo;

drop view if exists ReviewEntities;
-- *************************************************************************************************
-- *************************************************************************************************



-- *************************************************************************************************
--                VIEWS
-- *************************************************************************************************
-- For Specializations
CREATE VIEW Customer AS
    SELECT *
        FROM (Select userId, userName, userEmail from UserAccount) as tb1
                INNER JOIN CustomerAccount
                USING (userId);

CREATE VIEW Host AS
    SELECT *
        FROM (Select userId, userName, userEmail from UserAccount) as tb1
                INNER JOIN HostAccount
                USING (userId);

CREATE VIEW ListingInfo AS
    SELECT *
        FROM Listing INNER JOIN Property
                USING (listingId)
			LEFT OUTER JOIN PropertyNeighbourhoodCleansing
				USING (propertyNeighbourhoodCleansed);
                
CREATE VIEW ListingCalendarInfo AS
    SELECT *
        FROM ListingCalendar INNER JOIN ListingInfo
                USING (listingId);

CREATE VIEW ReservedCalendarInfo AS
    SELECT *
        FROM (ReservedCalendar INNER JOIN ListingCalendarInfo
                    USING (listingId, listingCalendar_Date))
                LEFT OUTER JOIN
             (SELECT paymentId, paymentStatus FROM Payment) as tb2
                    USING (paymentId)
                LEFT OUTER JOIN Customer
                    ON (userId = customerId);
CREATE VIEW ReviewEntities AS
    SELECT *
        FROM Review
                INNER JOIN (SELECT listingId, hostId FROM Listing) As sub
                USING (listingId);
-- *************************************************************************************************
-- *************************************************************************************************





-- *************************************************************************************************
--            Create Insert/Update Stored Procedures for Multivalued Attributes
-- *************************************************************************************************
-- General Insert Procedure for Simple Multivalued Attributes (i.e. NOT Composite)
DELIMITER @@
CREATE PROCEDURE procedure_insertMultivaluedAttributes (
    IN tableName CHAR(100),
    IN firstParam CHAR(100),
    IN secondParam CHAR(100),
    
    IN id BIGINT,
    IN elements TEXT, -- List/Array Type
    
    OUT out_id BIGINT
)
BEGIN
    DECLARE element TEXT DEFAULT NULL;
    DECLARE elementLen INT DEFAULT NULL;
    DECLARE temp TEXT DEFAULT NULL;
    
-- DECLARE EXIT HANDLER FOR SQLEXCEPTION
--     BEGIN
--         ROLLBACK;
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some constraint violation.';
--     END;
    
    START TRANSACTION;
        IF elements IS NOT NULL  AND  LENGTH(TRIM(elements)) <> 0  THEN
            SET elements = TRIM(REPLACE(REPLACE(elements, '"', ''), "'", ""));
            SET elements = TRIM(LEADING '[' FROM elements);
            SET elements = TRIM(TRAILING ']' FROM elements);
        END IF;
        
        iterator:
        LOOP
            -- Termination condition
            IF LENGTH(TRIM(elements)) = 0  OR  elements IS NULL THEN
                LEAVE iterator;
            END IF;
            
            -- Loop Body
            SET element = TRIM(SUBSTRING_INDEX(elements, ',', 1));
            SET elementLen = LENGTH(element);
            SET temp = TRIM(element);
            
            SET @sql = CONCAT('INSERT IGNORE INTO ', tableName, ' ( ', firstParam, ' , ', secondParam, ' ) ',
                    ' VALUES ( "', id, '" , "', element, '" ); ');
            PREPARE stmt FROM @sql;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
            
            SET elements = TRIM(INSERT(elements, 1, elementLen + 1, ''));
        END LOOP;
        
        SET out_id = id;
        -- SELECT  out_id;
    COMMIT;
END;
@@
DELIMITER ;

-- Load all Listing(amenities) from dataset
DELIMITER @@
CREATE PROCEDURE procedure_insertAmenities ()
BEGIN
    DECLARE in_listingId BIGINT;
    DECLARE in_amenities TEXT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE res BIGINT;
    
    DECLARE allPropertyAmenities CURSOR FOR
        SELECT DISTINCT listing_id, amenities FROM AllListings;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
--     BEGIN
--         ROLLBACK;
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some constraint violation.';
--     END;

    OPEN allPropertyAmenities;
    
        read_loop: LOOP
            FETCH allPropertyAmenities INTO in_listingId, in_amenities;
            
            If done THEN            -- Termination Condition
                LEAVE read_loop;
            END IF;
            
            CALL procedure_insertMultivaluedAttributes('PropertyAmenities', 'listingId', 'amenity', in_listingId, in_amenities, @res);
        END LOOP;
    
    CLOSE allPropertyAmenities;
END;
@@
DELIMITER ;


-- Load all Host(verifications) from dataset
DELIMITER @@
CREATE PROCEDURE procedure_insertHostVerifications ()
BEGIN
    DECLARE in_hostId BIGINT;
    DECLARE in_sources TEXT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE res BIGINT;
    
    DECLARE allHostVerifications CURSOR FOR
        SELECT DISTINCT host_id, host_verifications FROM AllListings;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
--     BEGIN
--         ROLLBACK;
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some constraint violation.';
--     END;

    OPEN allHostVerifications;
        read_loop: LOOP
            FETCH allHostVerifications INTO in_hostId, in_sources;
            
            If done THEN            -- Termination Condition
                LEAVE read_loop;
            END IF;
            
            CALL procedure_insertMultivaluedAttributes('HostVerificationSource', 'userId', 'source', in_hostId, in_sources, @res);
        END LOOP;
    CLOSE allHostVerifications;
END;
@@
DELIMITER ;
-- *************************************************************************************************
-- *************************************************************************************************




-- *************************************************************************************************
--                Create Insert/Update Stored Procedures for Entities
-- *************************************************************************************************
--  Insert Customer
DELIMITER @@
CREATE PROCEDURE procedure_insertCustomer (
    IN in_userName CHAR(100),
    IN in_userEmail CHAR(100),
    IN in_password CHAR(50),
    
    OUT out_userId BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some null/duplicate/format constraint violation.';
    END;
    
    START TRANSACTION;
        INSERT INTO UserAccount (
            userName,
            userEmail,
            password
        ) VALUES (
            in_userName,
            in_userEmail,
            in_password
        );
        
        SET out_userId = LAST_INSERT_ID();
        
        INSERT INTO CustomerAccount (
            userId,
            isCustomerAccountActive
        ) VALUES (
            out_userId,
            '1'
        );
        
        SELECT  out_userId;

    COMMIT;
END;
@@
DELIMITER ;



-- Insert Host
DELIMITER @@
CREATE PROCEDURE procedure_insertHost (
    IN in_userName CHAR(100),
    IN in_userEmail CHAR(100),
    IN in_password CHAR(30),
    IN in_hostAbout TEXT,
    IN in_isSuperhost BOOLEAN,
    IN in_hostThumbnailUrl CHAR(255),
    IN in_hostPictureUrl CHAR(255),
    IN in_hostLocation CHAR(100),
    IN in_hostNeighbourhood CHAR(100),

    OUT out_userId BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some null/duplicate/format constraint violation.';
    END;
    
    START TRANSACTION;
        INSERT INTO UserAccount (
            userName,
            userEmail,
            password
        ) VALUES (
            in_userName,
            in_userEmail,
            in_password
        );
        
        SET out_userId = LAST_INSERT_ID();
        
        INSERT INTO HostAccount (
            userId,
            hostUrl,
            hostSince,
            hostAbout,
            isSuperhost,
            hostThumbnailUrl,
            hostPictureUrl,
            hostLocation,
            hostNeighbourhood,
            
            -- response_time,
            -- response_rate,
            -- acceptance_rate,
            
            hostIsIdentityVerified,
            -- hostVerificationSources,    -- List/Array Type
            
            isHostAccountActive
        ) VALUES (
            out_userId,
            CONCAT('https://www.airbnb.com/users/show/', out_userId),
            CURDATE(),
            in_hostAbout,
            in_isSuperhost,
            in_hostThumbnailUrl,
            in_hostPictureUrl,
            in_hostLocation,
            in_hostNeighbourhood,
            
            -- in_response_time,
            -- in_response_rate,
            -- in_acceptance_rate,
            
            0,
            -- in_hostVerificationSources,    -- List/Array Type

            1
        );
        
        SELECT  out_userId;

    COMMIT;
END;
@@
DELIMITER ;



-- Update Host
DELIMITER @@
CREATE PROCEDURE procedure_updateHost (
    IN in_userId BIGINT,
    IN in_userName CHAR(100),
    IN in_userEmail CHAR(100),
    IN in_hostAbout TEXT,
    IN in_isSuperhost BOOLEAN,
    IN in_hostThumbnailUrl CHAR(255),
    IN in_hostPictureUrl CHAR(255),
    IN in_hostLocation CHAR(100),
    IN in_hostNeighbourhood CHAR(100),
            
    OUT out_userId BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some null/duplicate/format constraint violation.';
    END;
    
    START TRANSACTION;
        UPDATE UserAccount
            SET
                userName = in_userName,
                userEmail = in_userEmail
            WHERE userId = in_userId;
            
        UPDATE HostAccount
            SET
                hostAbout = in_hostAbout,
                isSuperhost = in_isSuperhost,
                hostThumbnailUrl = in_hostThumbnailUrl,
                hostPictureUrl = in_hostPictureUrl,
                hostLocation = in_hostLocation,
                hostNeighbourhood = in_hostNeighbourhood
            WHERE  userId = in_userId;
            
        SELECT  out_userId;
        
    COMMIT;
END;
@@
DELIMITER ;


-- Insert Listing
DELIMITER @@
CREATE PROCEDURE procedure_insertListing (
    IN in_listingName CHAR(255),
    IN in_listingDescription TEXT,
    IN in_listingPictureUrl CHAR(255),
    IN in_listingLicense CHAR(25),
    IN in_listingInstantBookable BOOLEAN,
     -- restrictions
        IN in_listingMinimumNights INT,
        IN in_listingMaximumNights INT,
    IN in_hostId BIGINT,
    
    IN in_propertyType CHAR(100),
    IN in_roomType CHAR(100),
    IN in_accommodates INT,
     -- bathroom
        IN in_noBathrooms DECIMAL(4, 1),
        IN in_bathroomType CHAR(100),
     -- bedroom
        IN in_noBedrooms INT,
        IN in_noBeds INT,
        IN in_amenities TEXT, -- List/Array Type
     -- neighbour
        IN in_propertyNeighbourhood CHAR(255),
        IN in_propertyNeighborhoodOverview TEXT,
        IN in_propertyNeighbourhoodCleansed CHAR(255),
    IN in_propertyCoordinates_x DECIMAL(30, 25),  -- Use latitude and longitude
    IN in_propertyCoordinates_y DECIMAL(30, 25),
    
    OUT out_listingId BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        -- SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some constraint violation.';
    END;
    
    START TRANSACTION;
            INSERT INTO Listing (
                listingName,
                listingDescription,
                listingPictureUrl,
                listingLicense,
                listingInstantBookable,
                listingMinimumNights,
                listingMaximumNights,
                hostId
            ) VALUES (
                in_listingName,
                in_listingDescription,
                in_listingPictureUrl,
                in_listingLicense,
                in_listingInstantBookable,
                in_listingMinimumNights,
                in_listingMaximumNights,
                in_hostId
            );
            
        SET out_listingId = LAST_INSERT_ID();
        
        UPDATE Listing
            SET listingUrl = CONCAT('https://www.airbnb.com/rooms/', out_listingId)
            WHERE listingId = out_listingId;
            

        INSERT IGNORE INTO PropertyNeighbourhoodCleansing (
            propertyNeighbourhoodCleansed,
            propertyNeighbourhood
        ) VALUES (
            in_propertyNeighbourhoodCleansed,
            in_propertyNeighbourhood
        );
        
        INSERT INTO Property (
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
        ) VALUES (
            out_listingId,
            in_propertyType,
            in_roomType,
            in_accommodates,
            in_noBathrooms,
            in_bathroomType,
            in_noBedrooms,
            in_noBeds,
            in_propertyNeighborhoodOverview,
            in_propertyNeighbourhoodCleansed,
            POINT(in_propertyCoordinates_x, in_propertyCoordinates_y)  -- Use latitude and longitude
        );
        
        CALL procedure_insertMultivaluedAttributes('PropertyAmenities', 'listingId', 'amenity', out_listingId, in_amenities, @res);
        
        SELECT  out_listingId;

    COMMIT;
END;
@@
DELIMITER ;


-- Delete Listing
DELIMITER @@
CREATE PROCEDURE procedure_deleteListing (
    IN in_listingId BIGINT,
    OUT out_listingId BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some constraint violation.';
    END;
    
    START TRANSACTION;
        DELETE FROM Property 
            WHERE listingId = in_listingId;
        
        DELETE FROM Listing
            WHERE listingId = in_listingId;
        
        SELECT  out_listingId;
    COMMIT;
END;
@@
DELIMITER ;


-- Insert Review
DELIMITER @@
CREATE PROCEDURE procedure_insertReview (
    IN in_listingId BIGINT,
    IN in_reviewerId BIGINT,
    IN in_reviewComments TEXT,
    
    OUT out_reviewId BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some constraint violation.';
    END;
    
    START TRANSACTION;
            INSERT INTO Review (
                listingId,
                reviewDate,
                reviewerId,
                reviewComments
            ) VALUES (
                in_listingId,
                CURDATE(),
                in_reviewerId,
                in_reviewComments
            );
            
        SET out_reviewId = LAST_INSERT_ID();
        SELECT  out_reviewId;
    COMMIT;
END;
@@
DELIMITER ;


-- Insert ListingCalendar
DELIMITER @@
CREATE PROCEDURE procedure_insertListingCalendar (
    IN in_listingId BIGINT,
    IN in_listingCalendar_Date DATE,
    IN in_listingCalendar_Price DECIMAL(10, 2),
    IN in_listingCalendar_AdjustedPrice DECIMAL(10, 2),
    
    OUT out_listingId BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some constraint violation.';
    END;
    
    START TRANSACTION;
            INSERT INTO ListingCalendar (
                listingId,
                listingCalendar_Date,
                listingCalendar_isAvailable,
                listingCalendar_Price,
                listingCalendar_AdjustedPrice
            ) VALUES (
                in_listingId,
                in_listingCalendar_Date,
                1,
                in_listingCalendar_Price,
                in_listingCalendar_AdjustedPrice
            );
            
        SET out_listingId = in_listingId;
        SELECT  out_listingId;
    COMMIT;
END;
@@
DELIMITER ;



-- Insert ReservedCalendar
DELIMITER @@
CREATE PROCEDURE procedure_insertReservedCalendar (
    IN in_listingId BIGINT,
    IN in_listingCalendar_Date DATE,
    IN in_customerId BIGINT,
    IN in_paymentId BIGINT,
    
    OUT out_listingId BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some constraint violation.';
    END;
    
    START TRANSACTION;
            UPDATE ListingCalendar
                SET listingCalendar_isAvailable = 0
                WHERE listingId = in_listingId  AND  listingCalendar_Date = in_listingCalendar_Date;
            
            INSERT INTO ReservedCalendar (
                listingId,
                listingCalendar_Date,
                customerId,
                paymentId
            ) VALUES (
                in_listingId,
                in_listingCalendar_Date,
                in_customerId,
                in_paymentId
            );
            
        SET out_listingId = in_listingId;
        SELECT  out_listingId;
    COMMIT;
END;
@@
DELIMITER ;


-- Insert Payment
DELIMITER @@
CREATE PROCEDURE procedure_insertPayment (
    IN in_interacId CHAR(255),
    IN in_paymentStatus ENUM('Pending', 'Completed', 'Cancelled', 'Refunded'),
    
    OUT out_paymentId BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Could not perform transaction. Likely some constraint violation.';
    END;
    
    START TRANSACTION;
            INSERT INTO Payment (
                interacId,
                paymentStatus
            ) VALUES (
                in_interacId,
                in_paymentStatus
            );
            
        SET out_paymentId = LAST_INSERT_ID();
        SELECT  out_paymentId;
    COMMIT;
END;
@@
DELIMITER ;
-- *************************************************************************************************
-- *************************************************************************************************