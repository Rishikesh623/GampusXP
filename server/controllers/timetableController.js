const timetableModel = require("../models/timetableModel");


const getTimetable = async (req, res) => {
    try {
        const timetable = await timetableModel.findOne({ creator_id: req.user._id });
        if (!timetable)
            return res.status(404).json({ message: 'Timetable not created yet.' });

        res.status(200).json(timetable.days);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getTodaysTimeTable = async (req, res) => {
    const { day } = req.params;
    try {
        const timetable = await timetableModel.findOne({ creator_id: req.user._id });
        if (!timetable)
            return res.status(404).json({ message: 'Timetable not found.' });

        // find the day entry
        const dayEntry = timetable.days.find(d => d.day.toLowerCase() === day.toLowerCase());

        if (!dayEntry) return res.status(404).json({ error: `No data for ${day}` });

        const days = [{
            day: dayEntry.day,
            slots: dayEntry.slots
        }]

        return res.json({days});

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}



const createTimetable = async (req, res) => {
    const { timetable } = req.body; // timetable contains entire weekly schedule
    try {

        const newTimetable = new timetableModel({
            creator_id: req.user._id,
            days: timetable
        });
        await newTimetable.save();
        res.status(200).json({ message: 'Timetable created  successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Serevr error', error: error.message });
    }
};

const addSlot = async (req, res) => {
    const { day, time, course } = req.body;
    try {
        let timetable = await timetableModel.findOne({ creator_id: req.user._id });

        if (!timetable) {
            timetable = new timetableModel({ creator_id: req.user._id, days: [{ day, slots: [{ time, course }] }] });
        } else {
            let dayEntry = timetable.days.find(d => d.day === day);


            if (dayEntry) {
                const existingSlot = dayEntry.slots.find(s => s.time === time);
                if (existingSlot) {
                    return res.status(400).json({ message: 'Time slot is already full. Choose a different time or edit the slot.' });
                }
                dayEntry.slots.push({ time, course });
            } else {
                timetable.days.push({ day, slots: [{ time, course }] });
            }
        }

        await timetable.save();
        res.status(200).json({ timetable: timetable.days, message: 'Timetable entry added successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Serevr error', error: error.message });
    }
};



const editSlot = async (req, res) => {

    const { day, slotId, newTime, newCourse } = req.body;
    try {
        const timetable = await timetableModel.findOne({ creator_id: req.user._id });

        if (!timetable)
            return res.status(404).json({ message: 'Timetable not found.' });

        const dayEntry = timetable.days.find(d => d.day === day);
        if (!dayEntry)
            return res.status(404).json({ message: 'Day not found.' });

        const slot = dayEntry.slots.find((s) => s._id.toString() === slotId.toString());
        if (!slot || slot.length === 0)
            return res.status(404).json({ message: 'Slot not found.' });

        if (newTime)
            slot.time = newTime;

        if (newCourse)
            slot.course = newCourse;
        await timetable.save();

        res.status(200).json({ timetable: timetable.days, message: 'Timetable slot updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Serevr error', error: error.message });
    }
};


const deleteSlot = async (req, res) => {
    const { day, slotId } = req.body;
    try {
        const timetable = await timetableModel.findOne({ creator_id: req.user._id });

        if (!timetable)
            return res.status(404).json({ message: 'Timetable not found.' });

        const dayEntry = timetable.days.find(d => d.day === day);
        if (!dayEntry)
            return res.status(404).json({ message: 'Day not found.' });

        dayEntry.slots = dayEntry.slots.filter((s) => s._id.toString() !== slotId.toString());

        await timetable.save();

        res.status(200).json({ message: 'Timetable slot deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting timetable slot.' });
    }
};
const deleteTimetable = async (req, res) => {
    try {
        const result = await timetableModel.deleteOne({ creator_id: req.user._id });
        if (result.deletedCount > 0) {
            return res.status(200).json({ message: 'Timetable deleted successfully.' });
        }
        res.status(404).json({ message: 'Timetable not found.' });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting timetable slot.' });
    }
};

module.exports = { createTimetable, addSlot, getTimetable, getTodaysTimeTable, editSlot, deleteSlot, deleteTimetable };