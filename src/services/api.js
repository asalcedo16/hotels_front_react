import axios from 'axios';

// Configura la URL base de la API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Cambia esto según tu backend
});

export default api;
