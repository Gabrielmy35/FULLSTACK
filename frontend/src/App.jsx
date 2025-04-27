import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import Sales from './components/Sales';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h1>Nova Salud</h1>
        <div className="nav-links">
          {/* Enlaces para navegar */}
          <Link to="/">Productos</Link>
          <Link to="/ventas">Ventas</Link>
        </div>
      </nav>

      {/* Configuración de rutas */}
      <Routes>
        <Route path="/" element={<ProductList />} /> {/* Ruta principal */}
        <Route path="/ventas" element={<Sales />} /> {/* Ruta de ventas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;