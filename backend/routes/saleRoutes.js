const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

// Crear nueva venta (POST)
router.post('/ventas', saleController.createSale);

// Obtener todas las ventas (GET)
router.get('/ventas', saleController.getAllSales);

module.exports = router;