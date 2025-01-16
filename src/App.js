import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateHabitacion from './pages/CreateHabitacion';
import CreateHotel from "./pages/CreateHotel";
import { HotelProvider } from "./context/HotelContext";

function App() {
  return (
    <HotelProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-habitacion" element={<CreateHabitacion />} />
          <Route path="/create-hotel" element={<CreateHotel />} />
        </Routes>
      </Router>
    </HotelProvider>
  );
}

export default App;
