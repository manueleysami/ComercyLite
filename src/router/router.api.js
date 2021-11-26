const { Router } = require('express');
const {
  obtenerProductos,
  registrarCliente,
  loginCliente,
  crearPedido,
  obtenerPedidosCliente,
  detallesPedido,
  cancelarPedido,
  detallesCliente,
  buscadorProductos,
  agregarProductoCarrito,
  obtenerProductosCarrito,
  eliminarProductoCarrito,
} = require('../controller/controller.api');
const subirArchivo = require('../utils/subirArchivo');
const router = Router();

// Clientes
router.post('/registro-cliente', registrarCliente);
router.post('/login-cliente', loginCliente);
router.get('/detalles-cliente/:clienteId', detallesCliente);

//Buscador & Productos
router.get('/buscador-productos/:productoBuscar', buscadorProductos);
router.get('/productos', obtenerProductos);

//Carrito
router.post('/agregar-carrito/:clienteId', agregarProductoCarrito);
router.get('/productos-carrito/:clienteId', obtenerProductosCarrito);
router.delete('/eliminarProducto-carrito/:productoId', eliminarProductoCarrito);

//Pedidos
router.post('/pedido-crear', subirArchivo.single('archivo'), crearPedido);
router.get('/pedidos-cliente/:clienteId', obtenerPedidosCliente);
router.get('/pedido-detalle/:pedidoId', detallesPedido);
router.delete('/pedido-cancelar/:pedidoId', cancelarPedido);
module.exports = router;
