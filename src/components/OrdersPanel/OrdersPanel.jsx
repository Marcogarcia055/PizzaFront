import React, { useEffect, useState } from 'react';
import styles from './OrdersPanel.module.css';
import { getAllPedidos } from '../../services/orderService';
import { FaClipboardList, FaCalendarDay } from 'react-icons/fa';

const OrdersPanel = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const data = await getAllPedidos();
            
            // --- CAMBIO AQUÍ ---
            // Antes (b - a): Mostraba el más nuevo primero (2, luego 1).
            // Ahora (a - b): Muestra el más antiguo primero (1, luego 2).
            const sorted = data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            
            setPedidos(sorted);
        } catch (error) {
            console.error("Error cargando pedidos", error);
        } finally {
            setLoading(false);
        }
    };

    // Función auxiliar para saber si una fecha es HOY
    const isToday = (someDate) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
          someDate.getMonth() === today.getMonth() &&
          someDate.getFullYear() === today.getFullYear();
    };

    // Función para formatear la fecha del grupo
    const formatDateHeader = (fechaString) => {
        const date = new Date(fechaString);
        if (isToday(date)) {
            return "Hoy";
        }
        return date.toLocaleDateString();
    };

    // Lógica de Agrupación
    const renderOrders = () => {
        if (pedidos.length === 0) return <p className={styles.empty}>No hay pedidos registrados.</p>;

        const groups = [];
        let lastDate = null;

        pedidos.forEach((pedido) => {
            const pedidoDate = new Date(pedido.fecha);
            const dateKey = pedidoDate.toDateString(); 

            // Si cambiamos de día, creamos un nuevo grupo
            if (dateKey !== lastDate) {
                groups.push({
                    dateLabel: formatDateHeader(pedido.fecha),
                    orders: []
                });
                lastDate = dateKey;
            }

            // Agregamos el pedido al grupo actual
            groups[groups.length - 1].orders.push(pedido);
        });

        return groups.map((group, index) => (
            <div key={index} className={styles.dateGroup}>
                <h3 className={styles.dateHeader}>
                    <FaCalendarDay /> {group.dateLabel}
                </h3>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {group.orders.map((pedido) => (
                            <tr key={pedido.idPedido || pedido.id}>
                                <td>#{pedido.idPedido || pedido.id}</td>
                                <td>
                                    {new Date(pedido.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </td>
                                <td style={{fontWeight: 'bold'}}>{pedido.cliente}</td>
                                <td className={styles.total}>${pedido.total.toFixed(2)}</td>
                                <td>
                                    <span className={styles.badge}>Completado</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ));
    };

    return (
        <div className={styles.panelContainer}>
            <div className={styles.header}>
                <h1><FaClipboardList /> Historial de Pedidos</h1>
            </div>

            {loading ? (
                <p>Cargando pedidos...</p>
            ) : (
                <div className={styles.groupsContainer}>
                    {renderOrders()}
                </div>
            )}
        </div>
    );
};

export default OrdersPanel;