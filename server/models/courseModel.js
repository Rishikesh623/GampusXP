const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    credits:Number,
    course_code: { type: String, unique: true, required: true },
});


const courseModel = mongoose.model('Course', courseSchema);

module.exports = courseModel;
