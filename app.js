const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const Router = require('./routes/router');
const errorHandler = require('./middleware/errorHandler');
const app = express();


const {connectDB} = require('./config/db');
const CustomError = require('./utils/customError');
dotenv.config();
connectDB();
// CORS handle
// app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

app.use(cors());

// //universal setup but still restrict specific methods or headers:

// const corsOptions = {
//     origin: "http://localhost:3000",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     credentials: true,
//   };


// Middleware for parsing JSON
app.use(express.json());
//app.use(CustomError)
app.use(errorHandler);

// Routes
app.use('/api',Router)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





