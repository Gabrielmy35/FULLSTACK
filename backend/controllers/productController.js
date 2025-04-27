const Product = require('../models/Product');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.getAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener productos',
        detalles: error.message 
      });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { query } = req.params;
      const results = await Product.search(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error en la búsqueda',
        detalles: error.message 
      });
    }
  }
};

module.exports = productController;