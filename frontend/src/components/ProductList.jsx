import { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: ''
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      const data = await response.json();
      
      // Convertir precios a números y validar
      const formattedProducts = data.map(product => ({
        ...product,
        precio: Number(product.precio) || 0 // Asegurar que sea número
      }));
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId 
      ? `http://localhost:5000/api/productos/${editId}`
      : 'http://localhost:5000/api/productos';
    
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock)
        })
      });

      if (response.ok) {
        await fetchProducts();
        setFormData({ nombre: '', precio: '', stock: '' });
        setEditId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar producto permanentemente?')) {
      try {
        await fetch(`http://localhost:5000/api/productos/${id}`, { method: 'DELETE' });
        await fetchProducts();
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      stock: product.stock.toString()
    });
    setEditId(product.id);
    setShowForm(true);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Gestión de Productos</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
          <button type="submit">{editId ? 'Actualizar' : 'Guardar'}</button>
        </form>
      )}

      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.nombre}</td>
            <td>S/ {typeof product.precio === 'number' ? product.precio.toFixed(2) : '0.00'}</td>
            <td>{product.stock}</td>
            <td>
              <button onClick={() => handleEdit(product)}>Editar</button>
              <button onClick={() => handleDelete(product.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;