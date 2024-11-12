"use client";

import React, { useState, useEffect, useCallback } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths } from "date-fns";
import { saveWorkoutDays, getWorkoutDays, getTotalWorkoutDaysForYear } from "@/lib/actions/progress.actions";

interface CalendarWithProgressProps {
  userId: string;
}

const CalendarWithProgress: React.FC<CalendarWithProgressProps> = ({ userId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutDays, setWorkoutDays] = useState<number[]>([]);
  const [yearlyWorkoutDays, setYearlyWorkoutDays] = useState<number>(0);
  const [needsSaving, setNeedsSaving] = useState(false);
  const [loading, setLoading] = useState(false); 

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

  const fetchYearlyWorkoutDays = useCallback(async () => {
    const year = currentDate.getFullYear();
    const yearlyTotal = await getTotalWorkoutDaysForYear(userId, year);
    setYearlyWorkoutDays(yearlyTotal);
  }, [currentDate, userId]);

  useEffect(() => {
    fetchYearlyWorkoutDays();
  }, [fetchYearlyWorkoutDays]);

  useEffect(() => {
    if (needsSaving) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      saveWorkoutDays({ userId, year, month, days: workoutDays });
      setNeedsSaving(false);
      fetchYearlyWorkoutDays(); 
    }
  }, [workoutDays, currentDate, userId, needsSaving, fetchYearlyWorkoutDays]);

  const handleDayClick = (day: number) => {
    setWorkoutDays((prev) => {
      const isDaySelected = prev.includes(day);
      const updatedDays = isDaySelected ? prev.filter(d => d !== day) : [...prev, day];
      setNeedsSaving(true);
      return updatedDays;
    });
  };

  const startOfTheMonth = startOfMonth(currentDate);
  const endOfTheMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: startOfTheMonth, end: endOfTheMonth });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="calendar-container text-gray-500">
      <div className="calendar-header flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth}>{"<"}</button>
        <h2 className="text-lg font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button onClick={handleNextMonth}>{">"}</button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}

        {Array.from({ length: startOfTheMonth.getDay() }).map((_, index) => (
          <div key={index} />
        ))}

        {daysInMonth.map((day) => {
          const dayNumber = parseInt(format(day, "d"));
          const isWorkoutDay = workoutDays.includes(dayNumber);

          return (
            <button
              key={dayNumber}
              onClick={() => handleDayClick(dayNumber)}
              className={`p-2 rounded w-25 h-8 ${
                isWorkoutDay ? "bg-green-500 text-white" : "bg-gray-200"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading} 
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
      
      <p className="mt-4 text-center font-semibold">
        Total Workout Days This Month: <span className="text-heading1-bold">{workoutDays.length}</span>
      </p>
      <p className="mt-2 text-center font-semibold">
        Total Workout Days This Year: <span className="text-heading1-bold">{yearlyWorkoutDays}</span>
      </p>
    </div>
  );
};

export default CalendarWithProgress;
