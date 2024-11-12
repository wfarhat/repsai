

import React from 'react';
import Image from 'next/image';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

interface WorkoutCardProps {
  index: number;
  title: string;
  date: string;
  exercises: Exercise[];
}

function WorkoutCardNew({ index, title, date, exercises }: WorkoutCardProps) {
  return (
    <div className="workout-card bg-dark-3 p-6 rounded-xl w-[400px] mb-6 relative">
      <h1 className="text-light-3 text-xl font-bold text-center">
        Created: <span className="text-gray-400 text-sm">{new Date(date).toLocaleDateString()}</span>
      </h1>

      <div className="text-center mt-6">
        <h3 className="text-light-3 text-heading4-medium font-bold mt-2">
          Your new workout:
        </h3>
        <h1 className="text-white">{title.toUpperCase()} </h1>
      </div>

      <div className="exercises-section mt-4">
        <h4 className="text-center text-light-3 text-lg font-bold mb-5">Exercises:</h4>
        <ul className="exercise-list list-none p-0">
          {exercises.map((exercise, index) => (
            <li key={index} className="exercise-item text-white mb-4">
              <span className="font-medium block text-center">{exercise.name}</span>
              <span className="block text-center">
                <span className="text-red-500 font-bold">{exercise.sets} sets</span>{' '}
                x{' '}
                <span className="text-blue font-bold">{exercise.reps} reps</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default WorkoutCardNew;

