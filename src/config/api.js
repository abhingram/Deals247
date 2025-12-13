// API Configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://deals247.online/api' 
  : 'http://localhost:5000/api';

export default API_BASE_URL;
