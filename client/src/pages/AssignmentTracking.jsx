import React from 'react';

const AssignmentTracking = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Assignment Tracking</h1>
            
            <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">Math Homework #5</h2>
                    <p>Due Date: Oct 15, 2024</p>
                    <p>Status: Pending</p>
                    <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">Submit</button>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">Science Project</h2>
                    <p>Due Date: Oct 20, 2024</p>
                    <p>Status: Completed</p>
                </div>
            </div>
        </div>
    );
};

export default AssignmentTracking;
