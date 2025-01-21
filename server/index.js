const express = require("express")
const dotenv = require('dotenv').config(); //loads .env contents into process.env 
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const cron = require('node-cron');

const userRoutes = require('./routes/userRoutes.js');
const courseRoutes = require('./routes/courseRoutes.js');
const assignmentRoutes = require('./routes/assignmentRoutes.js');
const timetableRoutes = require('./routes/timetableRoutes.js');
const challengesRoutes = require('./routes/challengesRoutes.js');
const achievementRoutes = require('./routes/achievementRoutes.js');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // allow requests only from this origin
    credentials: true,               // allow cookies and credentials
}));

// app.use(session({
//     secret: 'yourSecretKey',  // A secret key to sign the session cookie (for encryption)
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }  // Use 'true' when using HTTPS
// }));

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/course", courseRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/timetable", timetableRoutes);
app.use("/challenges", challengesRoutes);
app.use("/achievement", achievementRoutes);


const PORT = process.env.PORT || 8080;
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
            console.log("MongoDB connection failed !!! ", MOGO_URI, error.message);
        }
    );

const challengeModel = require('./models/challengesModel.js');
const userModel = require('./models/userModel.js');
cron.schedule('0 0 * * *', async () => {
    console.log('Starting the aura points deduction job...');
    const currentDate = new Date();

    try {

        const overdueChallenges = await challengeModel.find({ end_date: { $lt: currentDate } });

        for (const challenge of overdueChallenges) {
            const todeduct = - (challenge.aura_points / 2);
            for (const participant of challenge.participants) {
                console.log(participant.status);
                if (participant.status === "in-progress") {
                    const participantId = participant.user;
                    await userModel.findByIdAndUpdate(
                        participantId,
                        { $inc: { aura_points: todeduct } }
                    );

                    //upadate status
                    await challengeModel.updateOne(
                        { _id: challenge._id, 'participants.user': participantId },
                        { $set: { 'participants.$.status': 'done' } }
                    );

                    console.log(`Deducted ${todeduct} aura points from user: ${participantId}`);
                }
            }
        }
        console.log('Aura points deduction job completed successfully.');
    } catch (error) {
        console.error('Error in aura points deduction job:', error);
    }
});
