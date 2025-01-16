import React, { createContext, useState } from 'react';

export const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
  const [hotel, setHotel] = useState([]); // Estado global para un hotel

  return (
    <HotelContext.Provider value={{ hotel, setHotel }}>
      {children}
    </HotelContext.Provider>
  );
};


