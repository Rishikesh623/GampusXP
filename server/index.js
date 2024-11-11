const express = require('express');
const dotenv = require('dotenv').config(); //loads .env contents into process.env 
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes.js');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // allow requests only from this origin
    credentials: true,               // allow cookies and credentials
}));
app.use(express.json());
app.use("/user",userRoutes);
app.use(cookieParser());


const PORT = process.env.PORT || 8080 ;
const MOGO_URI = process.env.MOGO_URI;

app.listen(PORT, (error) => {
    if (error) {
        console.log(`Error : ${error}`);
        return;
    }
    console.log(`Server listening at port ${PORT}...`);
});

//mongoDB connection established
mongoose.connect(MOGO_URI)
    .then(
        () => {
            console.log("MonogDB connected .. ");
        }
    )
    .catch(
        (error) => {
            console.log("MongoDB connection failed !!! ", error.message);
        }
    );

