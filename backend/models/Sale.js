const pool = require('../config/db');
const Product = require('./Product');

const Sale = {
  create: async (total, productos) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insertar venta principal
      const [ventaResult] = await connection.query(
        'INSERT INTO ventas (total) VALUES (?)',
        [total]
      );
      const ventaId = ventaResult.insertId;

      // 2. Insertar detalles de venta
      const detalles = productos.map(p => [
        ventaId,
        p.id,
        p.cantidad,
        p.precio,
        p.precio * p.cantidad
      ]);
      
      await connection.query(
        `INSERT INTO detalle_ventas 
        (venta_id, producto_id, cantidad, precio_unitario, total) 
        VALUES ?`,
        [detalles]
      );

      // 3. Actualizar stock de productos
      for (const producto of productos) {
        await Product.updateStock(producto.id, producto.cantidad);
      }

      await connection.commit();
      return ventaId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getAll: async () => {
    const [ventas] = await pool.query(`
      SELECT 
        v.id,
        v.total,
        v.fecha,
        COUNT(dv.producto_id) AS total_productos
      FROM ventas v
      LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
      GROUP BY v.id
    `);
    return ventas;
  }
};

module.exports = Sale;