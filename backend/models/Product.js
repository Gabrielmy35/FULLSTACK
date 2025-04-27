const pool = require('../config/db');

const Product = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
  },

  search: async (query) => {
    const [results] = await pool.query(
      `SELECT * FROM productos 
      WHERE nombre LIKE ? OR codigo_barras = ?`,
      [`%${query}%`, query]
    );
    return results;
  },

  updateStock: async (productId, quantity) => {
    await pool.query(
      'UPDATE productos SET stock = stock - ? WHERE id = ?',
      [quantity, productId]
    );
  }
};

module.exports = Product;