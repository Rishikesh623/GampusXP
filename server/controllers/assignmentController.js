const assignmentModel = require("../models/assignmentModel");


const getAssignments = async (req,res) => {
    try{
        const assignmentDoc = await assignmentModel.findOne({ creator_id: req.user._id});
        if(!assignmentDoc){
            return res.status(404).json({message:"NO assignments forund."});
        }
        const assignments = assignmentDoc.assignments;

        res.status(201).json({message:"Success",assignments}); 
    }
    catch(error){
        res.status(500).json({message:"Serevr error",error:error.message});
    }
}
const addAssignment = async (req, res) => {
    try {
        const creator_id = req.user._id;
        const { title, description, due_date } = req.body;

        //validate required fields
        if (!title || !due_date) {
            return res.status(400).json({ message: 'Title and due date are required' });
        }

        const assignment = await assignmentModel.findOne({ creator_id });

        if (assignment) {
            assignment.assignments.push({ title, description, due_date });
            await assignment.save();

            return res.status(201).json({ message: 'Assignment added successfully', assignment });
        }

        const newAssignmentList = new assignmentModel({
            creator_id,
            assignments: [{ title, description, due_date }],
        });
        await newAssignmentList.save();

        return res.status(201).json({ message: 'Assignment added successfully', newAssignmentList });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const editAssignment = async (req, res) => {
    try {
        const creator_id = req.user._id;
        const {  assignment_id } = req.body;
        const { title, description, due_date, status } = req.body;

        const assignment = await assignmentModel.findOne({ creator_id });

        const assignmentIndex = assignment.assignments.findIndex(
            (item) => item._id.toString() === assignment_id
        );

        if(title){
            assignment.assignments[assignmentIndex].title=title;
        }
        if(description){
            assignment.assignments[assignmentIndex].description=description;
        }
        if(due_date){
            assignment.assignments[assignmentIndex].due_date=due_date;
        }
        if(status){
            assignment.assignments[assignmentIndex].status=status;
        }
        
        await assignment.save();

        return res.status(200).json({ message: 'Assignment updated successfully', assignment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const removeAssignment = async (req, res) => {
    try {
        const creator_id = req.user._id;
        const { assignment_id } = req.body;

        //find the assignment and remove it
        const assignment = await assignmentModel.findOne({ creator_id });

        const assignmentIndex = assignment.assignments.findIndex(
            (item) => item._id.toString() === assignment_id
        );

        //remove the assignment
        assignment.assignments.splice(assignmentIndex, 1);

        await assignment.save();

        return res.status(200).json({ message: 'Assignment removed successfully', assignment });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAssignments,editAssignment, addAssignment, removeAssignment };