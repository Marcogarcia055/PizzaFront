import api from './axiosConfig';

export const getAllProductos = async () => {
  const response = await api.get("/producto");
  return response.data.map(prod => ({
    id: prod.idProducto, // Asegúrate de que esto coincida con tu DTO del backend
    name: prod.nombre,
    desc: prod.descripcion || "Delicious ingredients",
    price: prod.precio,
    image: prod.imagen || "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=60",
    activo: prod.activo // Importante si manejas estado lógico
  }));
};

export const createProduct = async (productData) => {
    const response = await api.post('/producto', productData);
    return response.data;
};

// --- NUEVAS FUNCIONES ---

export const updateProduct = async (id, productData) => {
    // Backend espera PUT /api/producto/{id}
    const response = await api.put(`/producto/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    // Backend espera DELETE /api/producto/{id}
    const response = await api.delete(`/producto/${id}`);
    return response.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/producto/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data; 
};