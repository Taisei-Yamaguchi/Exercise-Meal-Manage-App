// fetchWorkoutContext.js
import React, { createContext, useContext, useState } from 'react';

const FetchWorkoutContext = createContext();

export const FetchWorkoutProvider = ({ children }) => {
  const [workoutCreateTrigger, setWorkoutCreateTrigger] = useState(false);

  const toggleWorkoutCreateTrigger = () => {
    setWorkoutCreateTrigger((prev) => !prev);
  };

  return (
    <FetchWorkoutContext.Provider value={{ workoutCreateTrigger, toggleWorkoutCreateTrigger }}>
      {children}
    </FetchWorkoutContext.Provider>
  );
};

export const useFetchWorkoutContext = () => {
  const context = useContext(FetchWorkoutContext);
  if (!context) {
    throw new Error('useFetchWorkoutContext must be used within a FetchWorkoutProvider');
  }
  return context;
};
