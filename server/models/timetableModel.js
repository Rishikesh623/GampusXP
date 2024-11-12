const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    days: [
      {
        day: { type: String, required: true }, 
        slots: [
          {
            time: { type: String, required: true }, 
            course: { type: String, required: true },
          },
        ],
      },
    ],
  });
  
  const timetableModel = mongoose.model('Timetable',timetableSchema);

  module.exports = timetableModel;