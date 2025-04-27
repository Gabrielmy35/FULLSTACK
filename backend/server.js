require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de verificación
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API Nova Salud - Gestión Farmacéutica',
    endpoints: {
      productos: {
        listado: 'GET /api/productos',
        buscar: 'GET /api/productos/buscar/:query'
      },
      ventas: {
        crear: 'POST /api/ventas',
        historial: 'GET /api/ventas/historial'
      }
    }
  });
});

// Rutas principales
app.use('/api', productRoutes);
app.use('/api', saleRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en http://localhost:${PORT}`);
});