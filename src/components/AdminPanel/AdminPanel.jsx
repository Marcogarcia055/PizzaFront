// Ubicación: src/components/AdminPanel/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import styles from './AdminPanel.module.css';
import { getAllProductos, deleteProduct } from '../../services/productService';
import AddProductModal from '../AddProductModal/AddProductModal';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBoxOpen } from 'react-icons/fa'; // Iconos nuevos
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); 
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProductos();
            setProducts(data);
        } catch (error) {
            console.error("Error cargando productos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        MySwal.fire({
            title: '¿Eliminar producto?',
            text: `Se eliminará "${name}" permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // Rojo alerta
            cancelButtonColor: '#6b7280', // Gris cancelar
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true // Estilo más moderno
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProduct(id);
                    await loadProducts();
                    MySwal.fire('¡Eliminado!', `"${name}" ha sido borrado.`, 'success');
                } catch (error) {
                    console.error(error);
                    MySwal.fire('Error', 'No se pudo eliminar el producto.', 'error');
                }
            }
        });
    };

    const handleEdit = (product) => {
        setEditingProduct(product); 
        setIsModalOpen(true); 
    };

    const handleCreate = () => {
        setEditingProduct(null); 
        setIsModalOpen(true);
    };

    // Lógica de filtrado
    const filteredProducts = products.filter(prod => 
        prod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.adminContainer}>
            {/* Header con Buscador y Botón */}
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Inventario</h1>
                    <span className={styles.badge}>{products.length} productos</span>
                </div>

                <div className={styles.controls}>
                    <div className={styles.searchWrapper}>
                        <FaSearch className={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Buscar pizza..." 
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className={styles.createBtn} onClick={handleCreate}>
                        <FaPlus /> Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Tabla de Productos */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th className={styles.centerText}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className={styles.loading}>Cargando inventario...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="4" className={styles.emptyState}>
                                    <FaBoxOpen size={40} />
                                    <p>No se encontraron productos</p>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((prod) => (
                                <tr key={prod.id}>
                                    <td>
                                        <div className={styles.productCell}>
                                            <img src={prod.image} alt={prod.name} className={styles.thumb} />
                                            <div className={styles.productInfo}>
                                                <span className={styles.productName}>{prod.name}</span>
                                                <span className={styles.productDesc}>{prod.desc.substring(0, 30)}...</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.priceCell}>${prod.price.toFixed(2)}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button 
                                                className={`${styles.actionBtn} ${styles.editBtn}`} 
                                                onClick={() => handleEdit(prod)}
                                                title="Editar">
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                                                onClick={() => handleDelete(prod.id, prod.name)}
                                                title="Eliminar">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AddProductModal 
                    key={editingProduct ? editingProduct.id : 'new'}
                    onClose={() => setIsModalOpen(false)} 
                    onProductSaved={loadProducts}
                    productToEdit={editingProduct} 
                />
            )}
        </div>
    );
};

export default AdminPanel;