import axios from 'axios';

// IMPORTANTE: Verifica que este puerto (7214) sea el mismo que usa tu API de .NET al correr.
const API_URL = 'http://localhost:5297/api'; 

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;