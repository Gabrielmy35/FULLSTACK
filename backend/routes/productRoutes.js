const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/productos', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT 
        id,
        nombre,
        CAST(precio AS DECIMAL(10,2)) AS precio,
        stock 
      FROM productos
    `);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/productos', async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    await pool.query(
      'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
      [nombre, parseFloat(precio), parseInt(stock)]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/productos/:id', async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    await pool.query(
      `UPDATE productos SET 
        nombre = ?, 
        precio = ?, 
        stock = ? 
      WHERE id = ?`,
      [nombre, parseFloat(precio), parseInt(stock), req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/productos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;