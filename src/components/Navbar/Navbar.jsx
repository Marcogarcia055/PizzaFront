import React from 'react';
import styles from './Navbar.module.css';
import { FaUserCircle, FaTools, FaClipboardList } from 'react-icons/fa'; // Importa el icono
import { GiPizzaSlice } from 'react-icons/gi';

// Aceptamos onGoOrders
const Navbar = ({ onGoHome, onGoAdmin, onGoOrders }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={onGoHome} style={{cursor: 'pointer'}}>
        <GiPizzaSlice className={styles.logoIcon} />
        <span>PIZZAZ EL PEQUEÑINI</span>
      </div>
      
      <div className={styles.actions}>
        <div className={styles.userActions}>
            
            {/* Botón Admin Productos */}
            <div className={styles.cartContainer} onClick={onGoAdmin}>
                <FaTools />
                <span>Productos</span>
            </div>

            {/* NUEVO: Botón Ver Pedidos */}
            <div className={styles.cartContainer} onClick={onGoOrders}>
                <FaClipboardList />
                <span>Pedidos</span>
            </div>
            
            <div className={styles.profile}>
                <FaUserCircle size={20} />
                <span>Sign In</span>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;