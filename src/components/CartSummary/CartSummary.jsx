import React, { useState } from 'react';
import styles from './CartSummary.module.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CartSummary = ({ cartItems, onCheckout, onRemove }) => {
  const [clientName, setClientName] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.16; 
  const total = subtotal + tax;

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;

    if (!clientName.trim()) {
      MySwal.fire({
        title: 'Falta el nombre',
        text: 'Por favor, ingresa el nombre del cliente para el pedido.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    onCheckout(clientName);
  };

  return (
    <div className={styles.cartContainer}>
      <h2>Carrito</h2>
      
      <div className={styles.itemsList}>
        {cartItems.length === 0 ? (
            <p style={{color: '#6b7280', fontStyle: 'italic'}}>El carrito esta vacío</p>
        ) : (
            cartItems.map((item, index) => (
                <div key={index} className={styles.item}>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <span>{item.quantity}x {item.name}</span>
                        <span style={{fontWeight: 'bold'}}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button 
                      className={styles.removeBtn} 
                      onClick={() => {
                        MySwal.fire({
                          title: '¿Eliminar producto?',
                          text: `Se quitará ${item.name} del carrito`,
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Sí, eliminar',
                          cancelButtonText: 'Cancelar'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            onRemove(item);
                            MySwal.fire(
                              'Eliminado!',
                              `${item.name} fue eliminado del carrito.`,
                              'success'
                            );
                          }
                        });
                      }}
                    >
                      Remove
                    </button>
                </div>
            ))
        )}
      </div>

      <div className={styles.pricing}>
          <div className={styles.row}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.row}>
              <span>Impuestos (16%):</span>
              <span>${tax.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
          </div>
      </div>

      <input 
        type="text" 
        className={styles.nameInput}
        placeholder="Nombre del Cliente"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />

      <button className={styles.checkoutBtn} onClick={handleCheckoutClick}>
          Checkout
      </button>
    </div>
  );
};

export default CartSummary;