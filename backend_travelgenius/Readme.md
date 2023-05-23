# Step 1 - System-Specific Prerequisites
## Software/Package
- **Install node.js `(LTS)`:** https://nodejs.org/en/download
- **Install MySQL:**  https://dev.mysql.com/downloads/installer/

## Required System Settings
- The data-files to be migrated are quite large.
- Hence set a higher `buffer-pool-size`
- **Reference:**  https://stackoverflow.com/questions/6901108/the-total-number-of-locks-exceeds-the-lock-table-size

**NOTE:** If the size is not increased, then the data-loading activities will almost always halt mid-way.

<br>

# Step 2 -  Setup the Database (Option 1: Use Marmoset Server)
1. OPEN: `.env` file from the parent directory
2. For `CONNECTION_STRING`, update the following as per your MySQL setup:**
	- host: marmoset03.shoshin.uwaterloo.ca
	- user: `<your username>`
	- password: `<your password>`
	- Database: 'Group13'

NOTE: If you wish to try out Unit testing for the REST APIs, a either a local setup or permission to create temporary database on Marmoset will be required.
Please refer 'Option 2' for local-setup

<br>

# Step 2 -  Setup the Database (Option 2: Local Setup)
## Initial Data Loading `(Toronto Region)`
1. **Create a new connection:** in MySQL (CLI / Workbench)
   - ###### NOTE: to start server in mac, use:
		sudo /usr/local/mysql/support-files/mysql.server stop --local-infile=1 -u root

2. **Copy all the 3 data (.csv) files:** from `__data__/Data_Files/` to the `default MySQL folder` on your system:
	##### Files to be copied from (Source Location):
		__data__
		└───Data_Files
			├───calendar.csv
			├───listings.csv
			└───reviews.csv
	
	##### Files to be copied to (Target Location):
	- **Windows**: 
		E.g: `C:\ProgramData\MySQL\MySQL Server 8.0\Uploads`
	- **Mac/Linux**:
		`Working Directory`

	###### NOTE: to start server in mac, use:
		sudo /usr/local/mysql/support-files/mysql.server stop --local-infile=1 -u root

3. **Update the location of the files:** in `__data__/0_LoadAllData.sql`

4. **Run the following in MySQL CLI `(in sequence)`:**
	`

		source 0_LoadAllData.sql
		source 1_RelationalModel.sql
		source 2_ViewsAndStoredProcedures.sql
		source 3_LoadData.sql
		source 4_CreateAdditionalIndices.sql
	`
	

## Loading Additional Data `(optional - for other regions)` 
1. **Go To:**  http://insideairbnb.com/get-the-data/
	- Download the 3 (zip) files for any 1 region.
	- Extract the csv from each of the zip files
	- Place the extracted files in the right folder on your system (same as `Initial Data Loading task`)

2. **Run the following `(2 scripts only)`:**
	`

		source 0_LoadAllData.sql
		source 3_LoadData.sql
	`
	**NOTE:** Please do not run the other 3 scripts again. Otherwise the previously loaded data will be lost 

.


# STEP 3 - Setup REST APIs
## Environment, Testing and Database Setup
1. **Open:** `.env` file from the parent directory
2. **For each of `CONNECTION_STRING` & `MOCK_CONNECTION_STRING`, update the following as per your MySQL setup:**
	- host
	- port
	- user
	- password

	**NOTE:**
	- These 4 fields must be updated for both the variables (One of them functions as the `Real Database` & the other is used for `automated-testing` (with mock data))
	- Make sure the database names are kept consistent throughout (otherwise, can cause issues)
		<br>
		a] **Real Database:**  `travelgenius` (OR `GROUP13` in case we are using Marmoset Server)
		<br>
		b] **Test Database:**  `testtravelgenius`
		
## Running the application on local
1. **RUN:**  `npm install`
	- This will install all the project dependencies
2. **RUN:** `npm test`
	- This will perform automated testing
3. **RUN:**	 `npm run dev`
	- This will start the REST-API server



