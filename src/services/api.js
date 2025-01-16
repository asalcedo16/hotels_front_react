import axios from 'axios';

// Configura la URL base de la API
const api = axios.create({
  baseURL: 'https://bjnic1crs0.execute-api.us-east-1.amazonaws.com/api/', // Cambia esto según tu backend
});

export default api;
