const { Router } = require('express');
const {
  login,
  home,
  eliminarProducto,
  loginPost,
  logout,
  agregarProducto,
  agregarProductoPost,
  editarProducto,
  editarProductoPut,
  obtenerClientes,
  eliminarCliente,
  obtenerPedidos,
  eliminarPedido,
} = require('../controller/controller.admin');
const { autenticacion } = require('../middleware/middleware');
const router = Router();
//Autenticacion
router.get('/login', login);
router.get('/logout', logout);
router.post('/login', loginPost);

// Productos
router.get('/', autenticacion, home);
router.get('/producto-agregar', autenticacion, agregarProducto);
router.post('/producto-agregar', autenticacion, agregarProductoPost);
router.get('/producto-eliminar/:id', autenticacion, eliminarProducto);
router.get('/producto-editar/:id', autenticacion, editarProducto);
router.post('/producto-editar-put/:id', autenticacion, editarProductoPut);

//Clientes
router.get('/obtener-clientes', autenticacion, obtenerClientes);
router.get('/eliminar-cliente/:id', autenticacion, eliminarCliente);

//Pedidos
router.get('/obtener-pedidos', autenticacion, obtenerPedidos);
router.get('/eliminar-pedido/:pedidoId', autenticacion, eliminarPedido);
module.exports = router;
