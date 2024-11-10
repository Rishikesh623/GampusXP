const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    creator_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    assignments: [
      {
        title: { 
            type: String, 
            required: true 
        },
        description: String,
        due_date: { 
            type: Date, 
            required: true 
        },
        creation_date:{
          type: Date, 
          default: Date.now()
        },
        status: { 
            type: String, 
            enum: ['Pending', 'Completed'], 
            default: 'Pending' 
        }
      }
    ]
  });
  

const assignmentModel = mongoose.model('Assignment', assignmentSchema);

module.exports = assignmentModel;