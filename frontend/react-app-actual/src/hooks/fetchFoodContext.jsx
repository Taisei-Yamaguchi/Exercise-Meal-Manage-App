// fetchFoodContext.js
import React, { createContext, useContext, useState } from 'react';

const FetchFoodContext = createContext();

export const FetchFoodProvider = ({ children }) => {
  const [foodCreateTrigger, setFoodCreateTrigger] = useState(false);

  const toggleFoodCreateTrigger = () => {
    setFoodCreateTrigger((prev) => !prev);
  };

  return (
    <FetchFoodContext.Provider value={{ foodCreateTrigger, toggleFoodCreateTrigger }}>
      {children}
    </FetchFoodContext.Provider>
  );
};

export const useFetchFoodContext = () => {
  const context = useContext(FetchFoodContext);
  if (!context) {
    throw new Error('useFetchFoodContext must be used within a FetchFoodProvider');
  }
  return context;
};
