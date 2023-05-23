-- UserAccount Indexes
CREATE INDEX index_listing_userId_password ON UserAccount(userId, password);
CREATE INDEX index_listing_userEmail_password ON UserAccount(userEmail, password);

-- ListingCalendar Indexes
CREATE INDEX index_listing_isAvailable_date_price_ListingCalendar ON ListingCalendar(listingId, listingCalendar_isAvailable, listingCalendar_Date, listingCalendar_Price, listingCalendar_AdjustedPrice);




