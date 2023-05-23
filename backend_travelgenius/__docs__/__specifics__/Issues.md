# ER Model Issues
1. Cancellation (Will form a Ternary relationship ..... Since 'Listing' is also involved)
	- We did not include this feature in PROPOSAL ..... Is it better to get rid of it ?

2. PaymentInfo
	-> Not sure if enough

3. Scrape:
	a. does not have any other of it's own (accept for scrape_id)
	b. scrape_date, source are descriptive attributes of the relationship, not scrape_date
		-> [FIXED -> We have decided to not to use this data]

4. Property:
	Need to decide whether to form a part of the same EntitySet(Listing) when converting to relational schema.
	
# Relational Model Issues	
## Running Scripts
**NOTE:**
- These are very large data-sets. Make sure to have the settings, as mentioned in this post, before setting up the database and populating the data:
		SOURCE: https://stackoverflow.com/questions/6901108/the-total-number-of-locks-exceeds-the-lock-table-size

## Need Immediate Attention
1. account (host/customer) should not be allowed to be deactivated --> if there are current reservations
	- [INCORPORATED]
2. remove price, hasAvailability from Listing
	- [FIXED]
3. Make 'userEmail' nullable and remove script-produced simple function values
	- [FIXED]
	- [BUT MADE MANDATORY IN APPLICATION -> Gradually bringing the data --> Migration]

## Pending
1. Create indices
	- [Currently: All queries are by identifier and joins have foreign keys in place.]
	- [Potential (additional) indices:  Could be for search queries]
	- [Can't see scope for any other indices. ----->  Still need to confirm with the professor]
2. Check Foreign Key constraints: On Update, On Delete
	- [Pending Review]
3. Decide on whether to make Propery part of Listing
	- [We think it leads to better DB design ----> Still confirm with the professor]


## Some Issues
1. hostUrl is simple function on userId
	- Make an argument on useCase ?
	- [FIXED]
2. hostLocation <- Is divisible (but not feasible to)
	- [NOT TOUCHING]
3. listingUrl is simple function on listingId
	- Make an argument on useCase
	- [FIXED]
4. Put a range for price
	- [FIXED]
5. propertyType, roomType, bathroomType -> check domain
	- [PENDING]
6. propertyNeighbourhood <- Check format
	- [PENDING] -> [BIT LIKELY NOT TO BE TOUCHED]
7. Ideal to make listingId, reviewId a string ............ ?
	- [NOT IDEAL:  Will have to use JSON-BIGINT parser on both node.js rest apis and React application]
8. Should listingLicense be unique ?
	- [Ideally NOT .... atleast for our scenario]
9. Currently not allowing update on a review
	- Should we also remove the delete option ?
	- [PENDING DECISION]
10. Should customerId be in Payment tables instead of ReservedCalendarTable ?
	- (Transitive Dependency)
	- [PENDING]
11. Update password - Where to put ?
	- [PENDING]
12. Arrays (verificationSources, Amenities) ?  ->  Need to parse and separate out in different relations
	- [FIXED]

