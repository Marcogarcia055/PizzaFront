import api from './axiosConfig';

// Crear pedido
export const createPedido = async (pedidoDto) => {
  try {
    const response = await api.post('/pedido', pedidoDto);
    return response.data;
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw error;
  }
};

export const getAllPedidos = async () => {
  const response = await api.get('/pedido');
  return response.data;
};