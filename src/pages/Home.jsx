import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Banner from '../components/Banner/Banner';
import PizzaCard from '../components/PizzaCard/PizzaCard';
import CartSummary from '../components/CartSummary/CartSummary';
import AdminPanel from '../components/AdminPanel/AdminPanel';
import OrdersPanel from '../components/OrdersPanel/OrdersPanel';
import { FaCaretRight, FaUtensils } from 'react-icons/fa';
import styles from './Home.module.css';
import { getAllProductos } from '../services/productService';
import { createPedido } from '../services/orderService'; // 1. Aquí se usa createPedido

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('menu'); 
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  useEffect(() => {
    if (currentView === 'menu') {
        fetchProductos();
    }
  }, [currentView]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const data = await getAllProductos(); 
      setPizzas(data);
    } catch (error) {
      console.error("Error al cargar menú:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DEL CARRITO ---

  const addToCart = (pizza) => {
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

  // 2. Corregido: Usamos 'productToRemove' (antes 'item') para filtrar
  const removeFromCart = (productToRemove) => {
    setCart((prevCart) => {
        return prevCart.filter(item => item.id !== productToRemove.id);
    });
  };

  // 3. Corregido: Usamos 'clientName' (antes 'name') y llamamos a 'createPedido'
  const handleCheckout = async (clientName) => {
    if (cart.length === 0) return alert("Tu carrito está vacío.");

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalConImpuesto = subtotal * 1.16; 

    const pedidoDto = {
        cliente: clientName, // Usamos la variable clientName
        total: totalConImpuesto,
        detalles: cart.map(item => ({
            idProducto: item.id,
            cantidad: item.quantity,
            precioUnitario: item.price
        }))
    };

    try {
        await createPedido(pedidoDto); // Usamos la función importada
        alert(`¡Pedido creado exitosamente para ${clientName}! 🍕`);
        setCart([]); 
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        alert("Hubo un error al procesar tu pedido.");
    }
  };

  // --- LÓGICA DE CATEGORÍAS ---

  const categoriesList = ["Todas", "Pizzas", "Hamburguesas", "Bebidas", "Postres"];

  const filteredProducts = selectedCategory === 'Todas' 
      ? pizzas 
      : pizzas.filter(p => p.category === selectedCategory);

  const renderContent = () => {
    switch (currentView) {
        case 'admin': return <AdminPanel />;
        case 'orders': return <OrdersPanel />;
        case 'menu':
        default:
            return (
                <div className={styles.mainContainer}>
                    <Banner />
                    <div className={styles.gridContent}>
                        
                        {/* SIDEBAR */}
                        <aside className={styles.sidebar}>
                            <h3>Categorías</h3>
                            <ul className={styles.categoryList}>
                                {categoriesList.map((cat, index) => (
                                    <li 
                                        key={index} 
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            cursor: 'pointer',
                                            color: selectedCategory === cat ? 'var(--primary-orange)' : 'inherit',
                                            fontWeight: selectedCategory === cat ? 'bold' : 'normal'
                                        }}
                                    >
                                        <FaCaretRight color={selectedCategory === cat ? 'var(--primary-orange)' : '#9CA3AF'} />
                                        <span>{cat}</span>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* PRODUCTOS */}
                        <section className={styles.pizzasSection}>
                            <h2>{selectedCategory === 'Todas' ? 'Nuestro Menú' : selectedCategory}</h2>
                            
                            {loading ? (
                                <p>Cargando...</p>
                            ) : filteredProducts.length === 0 ? (
                                <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
                                    <FaUtensils size={30} style={{marginBottom: '10px'}}/>
                                    <p>No hay productos en esta categoría aún.</p>
                                </div>
                            ) : (
                                <div className={styles.pizzasGrid}>
                                    {filteredProducts.map(pizza => (
                                        <PizzaCard key={pizza.id} data={pizza} onAdd={addToCart} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* CARRITO */}
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
        onGoOrders={() => setCurrentView('orders')} 
      /> 
      {renderContent()}
    </>
  );
};

export default Home;