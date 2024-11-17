"use client";

import React, { useState, useEffect, useCallback } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths } from "date-fns";
import { saveWorkoutDays, getWorkoutDays, getTotalWorkoutDaysForYear } from "@/lib/actions/progress.actions";

interface CalendarWithProgressProps {
  // The ID of the currently authenticated user
  userId: string;
}

const CalendarWithProgress: React.FC<CalendarWithProgressProps> = ({ userId }) => {
  // State to manage the currently viewed date (month and year)
  const [currentDate, setCurrentDate] = useState(new Date());

  // State to store workout days for the selected month
  const [workoutDays, setWorkoutDays] = useState<number[]>([]);

  // State to store the total number of workout days for the year
  const [monthlyWorkoutDays, setYearlyWorkoutDays] = useState<number>(0);

  // State to track if there are unsaved changes in the workout days
  const [needsSaving, setNeedsSaving] = useState(false);

  // State to manage loading status during data fetches
  const [loading, setLoading] = useState(false);

  // Fetch workout days for the current month
  useEffect(() => {
    const loadWorkoutDays = async () => {
      setLoading(true);
      setWorkoutDays([]);

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const savedDays = await getWorkoutDays(userId, year, month);
      setWorkoutDays(savedDays);
      setLoading(false);
    };
    loadWorkoutDays();
  }, [userId, currentDate]);

  // Fetch total workout days for the current year
  const fetchYearlyWorkoutDays = useCallback(async () => {
    const year = currentDate.getFullYear();
    const yearlyTotal = await getTotalWorkoutDaysForYear(userId, year);
    setYearlyWorkoutDays(yearlyTotal);
  }, [currentDate, userId]);

  // Call the function to fetch yearly workout days whenever it changes
  useEffect(() => {
    fetchYearlyWorkoutDays();
  }, [fetchYearlyWorkoutDays]);

  // Save workout days and update yearly workout days if there are unsaved changes
  useEffect(() => {
    if (needsSaving) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      saveWorkoutDays({ userId, year, month, days: workoutDays });
      setNeedsSaving(false);
      fetchYearlyWorkoutDays();
    }
  }, [workoutDays, currentDate, userId, needsSaving, fetchYearlyWorkoutDays]);

  // Handle user interactions with calendar days
  const handleDayClick = (day: number) => {
    setWorkoutDays((prev) => {
      const isDaySelected = prev.includes(day);
      const updatedDays = isDaySelected ? prev.filter(d => d !== day) : [...prev, day];
      setNeedsSaving(true);
      return updatedDays;
    });
  };

  // Get the start and end dates of the current month
  const startOfTheMonth = startOfMonth(currentDate);
  const endOfTheMonth = endOfMonth(currentDate);

  // Generate all days in the current month
  const daysInMonth = eachDayOfInterval({ start: startOfTheMonth, end: endOfTheMonth });

  // Handle navigation to the previous month
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Handle navigation to the next month
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="calendar-container text-gray-500">
      {/* Header for month navigation */}
      <div className="calendar-header flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth}>{"<"}</button>
        <h2 className="text-lg font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button onClick={handleNextMonth}>{">"}</button>
      </div>

      {/* Display the days of the week */}
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}

        {/* Add empty slots for the days before the first day of the month */}
        {Array.from({ length: startOfTheMonth.getDay() }).map((_, index) => (
          <div key={index} />
        ))}

        {/* Render the days of the month */}
        {daysInMonth.map((day) => {
          const dayNumber = parseInt(format(day, "d"));
          const isWorkoutDay = workoutDays.includes(dayNumber);
          const isFutureDate = day > new Date();

          return (
            <button
              key={dayNumber}
              onClick={() => handleDayClick(dayNumber)}
              className={`p-2 rounded w-25 h-8 ${
                isWorkoutDay ? "bg-green-500 text-white" : "bg-gray-200"
              } ${loading || isFutureDate ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading || isFutureDate}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>

      {/* Display summary of workout days */}
      <p className="mt-4 text-center font-semibold">
        Total Workout Days This Month: <span className="text-heading1-bold">{workoutDays.length}</span>
      </p>
      <p className="mt-2 text-center font-semibold">
        Total Workout Days This Year: <span className="text-heading1-bold">{monthlyWorkoutDays}</span>
      </p>
    </div>
  );
};

export default CalendarWithProgress;
