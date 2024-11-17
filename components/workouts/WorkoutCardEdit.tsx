import React from 'react';

interface Exercise {
    name: string;
    sets: number;
    reps: number;
}

interface WorkoutCardEditProps {
    index: number;
    title: string;
    date: string;
    exercises: Exercise[];
}

const WorkoutCardEdit: React.FC<WorkoutCardEditProps> = ({ index, title, date, exercises }) => {
    return (
        <div className="workout-card p-6 text-white">
            {/* Display the creation date of the workout */}
            <p className="text-gray-400 text-sm mb-4" style={{ opacity: 0.7, pointerEvents: 'none' }}>
                Date Created: {new Date(date).toLocaleDateString()}
            </p>

            {/* Input field for editing the workout title */}
            <div className="text-center mt-2">
                <label className="block">Workout Title:</label>
                <input
                    type="text"
                    defaultValue={title}
                    className="text-center p-2 w-full bg-dark-4 text-white border border-gray-500 rounded"
                />
            </div>

            {/* List of exercises with editable fields for each exercise */}
            <h3 className="text-center mt-6 text-lg font-bold">Exercises:</h3>
            <ul>
                {exercises.map((exercise, idx) => (
                    <li key={idx} className="mt-4">
                        <div className="mb-2">
                            <label>Exercise Name:</label>
                            <input
                                type="text"
                                defaultValue={exercise.name}
                                className="text-center p-2 w-full bg-dark-4 text-white border border-gray-500 rounded"
                            />
                        </div>
                        <div className="text-center flex gap-4">
                            <div className="flex-1">
                                <label>Sets:</label>
                                <input
                                    type="number"
                                    defaultValue={exercise.sets}
                                    className="text-center p-2 w-full bg-red-500 text-white border border-gray-500 rounded"
                                />
                            </div>
                            <div className="text-center flex-1">
                                <label>Reps:</label>
                                <input
                                    type="number"
                                    defaultValue={exercise.reps}
                                    className="text-center p-2 w-full bg-blue text-white border border-gray-500 rounded"
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Save button (disabled by default) */}
            <button
                disabled
                className="mt-6 w-full p-2 bg-green-500 text-white rounded opacity-50 cursor-not-allowed"
            >
                Save
            </button>
        </div>
    );
};

export default WorkoutCardEdit;
