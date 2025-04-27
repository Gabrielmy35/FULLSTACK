const pool = require('../config/db');

const Sale = {
  create: async (total, productos) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insertar en tabla VENTAS
      const [ventaResult] = await connection.query(
        'INSERT INTO ventas (total) VALUES (?)',
        [total]
      );
      const ventaId = ventaResult.insertId;

      // 2. Insertar en DETALLE_VENTAS
      const detalles = productos.map(p => [
        ventaId,
        p.id, // producto_id
        p.cantidad,
        p.precio, // precio_unitario
        (p.precio * p.cantidad).toFixed(2) // total del detalle
      ]);
      
      await connection.query(
        `INSERT INTO detalle_ventas 
          (venta_id, producto_id, cantidad, precio_unitario, total)
        VALUES ?`,
        [detalles]
      );

      // 3. Actualizar stock en PRODUCTOS
      for (const producto of productos) {
        await connection.query(
          'UPDATE productos SET stock = stock - ? WHERE id = ?',
          [producto.cantidad, producto.id]
        );
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
        v.fecha,
        v.total,
        JSON_ARRAYAGG(JSON_OBJECT(
          'producto_id', dv.producto_id,
          'cantidad', dv.cantidad,
          'precio_unitario', dv.precio_unitario,
          'total_detalle', dv.total
        )) AS detalles
      FROM ventas v
      JOIN detalle_ventas dv ON v.id = dv.venta_id
      GROUP BY v.id
    `);
    return ventas;
  }
};

module.exports = Sale;