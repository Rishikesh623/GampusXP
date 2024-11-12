const courseModel = require('../models/courseModel');
const userModel = require('../models/userModel');


// create course API - coordinator only
const createCourse = async (req, res) => {
    try {
        const { name, description, credits, course_code } = req.body;

        //check if the user already exists
        let course = await courseModel.findOne({ course_code });
        if (course) {
            return res.status(400).json({ message: 'Course already exists' });
        }

        if (!name || !course_code || !credits)
            return res.status(400).json({ message: 'Fill the required fields.' });


        // create a new course and add to course collections
        course = new courseModel({ name, description, credits, course_code });
        await course.save();

        res.status(201).json({ name, description, credits, course_code });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// course detailsedit API - coordinator only
const editCourse = async (req, res) => {
    const { course_code, update_course_data } = req.body;
    try {

        // update course details
        const updatedCourse = await courseModel.findOneAndUpdate(
            { course_code: course_code },
            { $set: update_course_data },
            { new: true } // Return the updated document
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        //return updated course details
        res.status(200).json(updatedCourse);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//add course - student
const addCourse = async (req, res) => {
    const { course_code, semester,professor_name} = req.body;

    try {
        const course = await courseModel.findOne({ course_code });
        if (!course) 
            return res.status(404).json({ message: 'Course not found' });

        // Check if already enrolled
        const user = await userModel.findById(req.user._id);
        const semesterCourses = user.courses.find(s => s.semester === semester);

        if (semesterCourses && semesterCourses.courses.some(c => c._id.equals(course._id))) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Add course to user's semester courses
        if (!semesterCourses) {
            user.courses.push({ semester, courses: [{ _id: course._id, course_code: course.course_code, professor_name:professor_name }] });
        } else {
            semesterCourses.courses.push({ id: course._id, code: course.course_code, professor_name: professor_name });
        }

        await user.save();
        res.status(200).json({ message: 'Course added successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//remove course - student
const removeCourse = async (req, res) => {
    const { course_code, semester } = req.body;

    try {
        const user = await userModel.findById(req.user._id);
        const semesterCourses = user.courses.find(s => s.semester === semester);
    
        const courseIndex = semesterCourses.courses.findIndex(c => c.course_code === course_code);

        // Remove course
        semesterCourses.courses.splice(courseIndex, 1);

        
        await user.save();
      
        res.status(200).json({message:"Course removed successfully"});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { createCourse, editCourse, addCourse, removeCourse };