const isDev = import.meta.env.DEV;
const API_URL = isDev 
  ? 'http://localhost:3000' 
  : '/.netlify/functions/api';

export { API_URL };
