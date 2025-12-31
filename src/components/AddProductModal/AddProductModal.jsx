// Ubicación: src/components/AddProductModal/AddProductModal.jsx
import React, { useState } from 'react';
import styles from './AddProductModal.module.css';
import { createProduct, updateProduct, uploadImage } from '../../services/productService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AddProductModal = ({ onClose, onProductSaved, productToEdit }) => {
    // 1. Inicializamos 'categoria' en el estado
    const [formData, setFormData] = useState({
        nombre: productToEdit?.name || '',
        precio: productToEdit?.price || '',
        descripcion: productToEdit?.desc || '',
        imagen: productToEdit?.image || '',
        categoria: productToEdit?.category || 'Pizzas Clásicas' // Valor por defecto
    });

    const [file, setFile] = useState(null);

    // Lista de categorías disponibles (deben coincidir con las del Sidebar en Home)
    const categorias = ["Pizzas", "Hamburguesas", "Bebidas", "Postres"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = formData.imagen;

            if (file) {
                const uploaded = await uploadImage(file);
                imageUrl = uploaded.url; 
            }

            // 2. Incluimos la categoría en el payload
            const payload = {
                ...formData,
                precio: parseFloat(formData.precio),
                imagen: imageUrl,
                activo: true,
                idProducto: productToEdit ? productToEdit.id : 0 
            };

            if (productToEdit) {
                await updateProduct(productToEdit.id, payload);
                MySwal.fire({
                    title: '¡Producto actualizado!',
                    text: `${formData.nombre} se actualizó correctamente.`,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
            } else {
                await createProduct(payload);
                MySwal.fire({
                    title: '¡Producto creado!',
                    text: `${formData.nombre} se agregó correctamente.`,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
            }

            onProductSaved(); 
            onClose(); 
        } catch (error) {
            console.error(error);
            MySwal.fire({
                title: 'Error',
                text: 'Hubo un problema al guardar el producto.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Nombre</label>
                        <input name="nombre" value={formData.nombre} required onChange={handleChange} />
                    </div>
                    
                    {/* 3. Selector de Categoría */}
                    <div className={styles.formGroup}>
                        <label>Categoría</label>
                        <select 
                            name="categoria" 
                            value={formData.categoria} 
                            onChange={handleChange}
                            style={{
                                width: '100%', 
                                padding: '8px', 
                                borderRadius: '4px', 
                                border: '1px solid #ddd',
                                fontSize: '0.9rem',
                                backgroundColor: 'white'
                            }}
                        >
                            {categorias.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Precio</label>
                        <input type="number" step="0.01" name="precio" value={formData.precio} required onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} required onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Imagen</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <small style={{display: 'block', marginTop: '5px'}}>URL actual:</small>
                        <input name="imagen" value={formData.imagen} onChange={handleChange} placeholder="https://..." />
                    </div>
                    
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
                        <button type="submit" className={styles.saveBtn}>
                            {productToEdit ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;