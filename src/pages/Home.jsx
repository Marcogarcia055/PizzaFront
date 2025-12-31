import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Banner from '../components/Banner/Banner';
import PizzaCard from '../components/PizzaCard/PizzaCard';
import CartSummary from '../components/CartSummary/CartSummary';
import AdminPanel from '../components/AdminPanel/AdminPanel';
import OrdersPanel from '../components/OrdersPanel/OrdersPanel'; // <--- IMPORTAR
import { FaCaretRight } from 'react-icons/fa';
import styles from './Home.module.css';
import { getAllProductos } from '../services/productService';
import { createPedido } from '../services/orderService';

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Ahora currentView puede ser: 'menu', 'admin' o 'orders'
  const [currentView, setCurrentView] = useState('menu'); 

  useEffect(() => {
    if (currentView === 'menu') {
        fetchProductos();
    }
  }, [currentView]);

  const fetchProductos = async () => {
    // ... (Tu código de fetchProductos igual que antes) ...
    setLoading(true);
    try {
      const data = await getAllProductos(); 
      setPizzas(data);
    } catch (error) {
      console.error("No se pudo cargar el menú:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (pizza) => {
    // ... (Tu código de addToCart igual que antes) ...
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === pizza.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...pizza, quantity: 1 }];
    });
  };

  const removeFromCart = (productToRemove) => {
    // ... (Tu código de removeFromCart igual que antes) ...
    setCart((prevCart) => {
        return prevCart.filter(item => item.id !== productToRemove.id);
    });
  };

  const handleCheckout = async (clientName) => {
    // ... (Tu código de checkout igual que antes) ...
    if (cart.length === 0) return alert("Tu carrito está vacío.");
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalConImpuesto = subtotal * 1.16;

    const pedidoDto = {
        cliente: clientName, 
        total: totalConImpuesto,
        detalles: cart.map(item => ({
            idProducto: item.id,
            cantidad: item.quantity,
            precioUnitario: item.price
        }))
    };

    try {
        await createPedido(pedidoDto);
        alert(`¡Pedido creado exitosamente para ${clientName}! 🍕`);
        setCart([]); 
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        alert("Hubo un error al procesar tu pedido.");
    }
  };

  const categories = ["Classic Pizzas", "Specialty Pizzas", "Drinks"];

  // --- FUNCIÓN HELPER PARA RENDERIZAR EL CONTENIDO ---
  const renderContent = () => {
    switch (currentView) {
        case 'admin':
            return <AdminPanel />;
        case 'orders':
            return <OrdersPanel />; // <--- NUEVA VISTA
        case 'menu':
        default:
            return (
                <div className={styles.mainContainer}>
                    <Banner />
                    <div className={styles.gridContent}>
                        <aside className={styles.sidebar}>
                            <h3>Categories</h3>
                            <ul className={styles.categoryList}>
                                {categories.map((cat, index) => (
                                    <li key={index}>
                                        <FaCaretRight color="#9CA3AF" />
                                        <span>{cat}</span>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                        <section className={styles.pizzasSection}>
                            <h2>Productos</h2>
                            {loading ? (
                                <p>Cargando deliciosas pizzas...</p>
                            ) : (
                                <div className={styles.pizzasGrid}>
                                    {pizzas.map(pizza => (
                                        <PizzaCard key={pizza.id} data={pizza} onAdd={addToCart} />
                                    ))}
                                </div>
                            )}
                        </section>
                        <aside className={styles.cartSidebar}>
                            <CartSummary 
                                cartItems={cart} 
                                onCheckout={handleCheckout}
                                onRemove={removeFromCart}
                            />
                        </aside>
                    </div>
                </div>
            );
    }
  };

  return (
    <>
      <Navbar 
        onGoHome={() => setCurrentView('menu')} 
        onGoAdmin={() => setCurrentView('admin')} 
        onGoOrders={() => setCurrentView('orders')} // <--- PASAMOS LA NUEVA FUNCIÓN
      /> 
      
      {renderContent()}
    </>
  );
};

export default Home;