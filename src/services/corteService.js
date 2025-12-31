// src/services/corteService.js
import api from './axiosConfig';

export const createCorte = async (corteDto) => {
    const response = await api.post('/corte', corteDto);
    return response.data;
};

export const getCorteById = async (id) => {
    const response = await api.get(`/corte/${id}`);
    return response.data;
};