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
            enum: ['pending', 'completed'], 
            default: 'pending' 
        }
      }
    ]
  });
  

const assignmentModel = mongoose.model('Assignment', assignmentSchema);

module.exports = assignmentModel;