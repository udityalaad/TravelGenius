// Imports
const express = require("express");
const { connectToDB } = require("./Config/dbConnection");
const errorHandler = require("./Middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors");

// // Swagger Setup
// const bodyParser = require("body-parser");
// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

// Express
const app = express();
const port = process.env.PORT || 5000;

// Apply Middlewares
app.use(express.json());
app.use(cors());
app.use(errorHandler);


// Connect to DB
connectToDB();


// API Routes
app.use('/api/user', require('./Routes/UserRoutes'));
app.use('/api/customer', require('./Routes/CustomerRoutes'));
app.use('/api/host', require('./Routes/HostRoutes'));
app.use('/api/listing', require('./Routes/ListingRoutes'));
app.use('/api/review', require('./Routes/ReviewRoutes'));
app.use('/api/listingCalendar', require('./Routes/ListingCalendarRoutes'));
app.use('/api/reservedCalendar', require('./Routes/ReservedCalendarRoutes'));
app.use('/api/payment', require('./Routes/PaymentRoutes'));


// Listen to the given port (when not testing (otherwise whichever is available by default))
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
}


module.exports = app;