const Sale = require('../models/Sale');

const saleController = {
  createSale: async (req, res) => {
    try {
      const { total, productos } = req.body;
      
      // Validación básica
      if (!productos || productos.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'El carrito está vacío'
        });
      }

      const ventaId = await Sale.create(total, productos);
      
      res.status(201).json({
        success: true,
        ventaId,
        message: 'Venta registrada exitosamente'
      });

    } catch (error) {
      console.error('Error en venta:', error);
      res.status(500).json({
        success: false,
        error: 'Error al procesar la venta',
        detalles: error.message
      });
    }
  },

  getAllSales: async (req, res) => {
    try {
      const ventas = await Sale.getAll();
      res.json(ventas);
    } catch (error) {
      console.error('Error obteniendo ventas:', error);
      res.status(500).json({ 
        error: 'Error al obtener el listado de ventas',
        detalles: error.message 
      });
    }
  }
};

module.exports = saleController;
module.exports = saleController;

module.exports = saleController;