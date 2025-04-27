import { useState, useEffect } from 'react';

const Sales = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/productos');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product) => {
    if (product.stock <= 0) return;

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, cantidad: Math.min(item.cantidad + 1, product.stock) } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, cantidad: 1 }]);
    }
  };

  const processSale = async () => {
    try {
      const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      const productos = cart.map(item => ({
        id: item.id,
        cantidad: item.cantidad,
        precio: item.precio
      }));

      const response = await fetch('http://localhost:5000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total, productos })
      });

      if (response.ok) {
        setCart([]);
        alert('Venta registrada exitosamente!');
        const updatedResponse = await fetch('http://localhost:5000/api/productos');
        const updatedData = await updatedResponse.json();
        setProducts(updatedData);
      }
    } catch (error) {
      console.error("Error procesando venta:", error);
      alert('Error al procesar la venta');
    }
  };

  return (
    <div className="container">
      <div className="sales-layout">
        <div className="product-selection">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="product-grid">
            {products
              .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(product => (
                <div 
                  key={product.id} 
                  className={`product-card ${product.stock <= 0 ? 'disabled' : ''}`}
                  onClick={() => product.stock > 0 && addToCart(product)}
                >
                  <h3>{product.nombre}</h3>
                  <p>Stock: {product.stock}</p>
                  <p>S/ {product.precio.toFixed(2)}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="cart-container">
          <h2>Carrito de Venta</h2>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <span>{item.nombre}</span>
                  <div className="item-controls">
                    <button onClick={() => setCart(cart.filter(i => i.id !== item.id))}>
                      ×
                    </button>
                  </div>
                </div>
                <div className="item-details">
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.cantidad}
                    onChange={(e) => {
                      const newQty = Math.max(1, Math.min(parseInt(e.target.value), item.stock));
                      setCart(cart.map(i => 
                        i.id === item.id ? { ...i, cantidad: newQty } : i
                      ));
                    }}
                  />
                  <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-total">
            <h3>Total: S/ {cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2)}</h3>
            <button 
              onClick={processSale}
              disabled={cart.length === 0}
              className="checkout-btn"
            >
              Confirmar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;