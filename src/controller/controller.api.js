const database = require('../db/conexion');
const bcrypt = require('bcrypt');
module.exports = {
  obtenerProductos: async (req, res) => {
    const productosObtenidos = await database.awaitQuery(
      'SELECT * FROM productos'
    );
    res.status(200).json({
      productos: productosObtenidos,
    });
  },
  registrarCliente: async (req, res) => {
    const { nombre, usuario, clave } = req.body;
    if (!nombre || !usuario || !clave) {
      res.status(400).json({
        message: 'Todos los campos son obligatorios',
        registroSuccess: false,
      });
    } else {
      const clienteExistente = await database.awaitQuery(
        'SELECT * FROM clientes WHERE usuario = ?',
        [usuario]
      );
      if (clienteExistente.length > 0) {
        res.status(400).json({
          message: 'El usuario ya existe',
          registroSuccess: false,
        });
        return;
      }
      const bcryptedPassword = await bcrypt.hash(clave, 10);
      await database.awaitQuery(
        'INSERT INTO clientes (nombre, usuario, clave) VALUES (?, ?, ?)',
        [nombre, usuario, bcryptedPassword]
      );
      res.status(201).json({
        message: 'Cliente registrado correctamente',
        registroSuccess: true,
      });
    }
  },
  loginCliente: async (req, res) => {
    const { usuario, clave } = req.body;
    if (!usuario || !clave) {
      res.status(400).json({
        message: 'Todos los campos son obligatorios',
      });
    } else {
      const clienteExistente = await database.awaitQuery(
        'SELECT * FROM clientes WHERE usuario = ?',
        [usuario]
      );
      if (!clienteExistente.length) {
        res.status(400).json({
          message: 'El usuario no existe',
          authStatus: false,
        });
        return;
      }
      const isPasswordCorrect = await bcrypt.compare(
        clave,
        clienteExistente[0].clave
      );
      if (!isPasswordCorrect) {
        res.status(400).json({
          message: 'La clave es incorrecta',
          authStatus: false,
        });
        return;
      }
      const { clave: claveUsuario, ...restoDatos } = clienteExistente[0];
      res.status(200).json({
        message: 'Login correcto',
        cliente: restoDatos,
        authStatus: true,
      });
    }
  },
  crearPedido: async (req, res) => {
    const { cliente_id, precio, producto_id, tipo_pago } = req.body;
    if (!cliente_id || !precio || !producto_id || !tipo_pago) {
      res.status(400).json({
        message: 'Todos los campos son obligatorios',
        estatus: false,
      });
    } else {
      try {
        const clienteExistente = await database.awaitQuery(
          'SELECT * FROM clientes WHERE id = ?',
          [cliente_id]
        );
        if (!clienteExistente.length) {
          res.status(400).json({
            message: 'El cliente no existe',
            estatus: false,
          });
          return;
        }
        const productoExistente = await database.awaitQuery(
          'SELECT * FROM productos WHERE id = ?',
          [producto_id]
        );
        if (!productoExistente.length) {
          res.status(400).json({
            message: 'El producto no existe',
            estatus: false,
          });
          return;
        }
        if (tipo_pago === 'Efectivo') {
          await database.awaitQuery(
            'INSERT INTO pedidos (cliente_id, precio, producto_id, tipo_pago, ciudad, estado, persona_recibe, telefono_persona, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              cliente_id,
              precio,
              producto_id,
              tipo_pago,
              req.body.ciudad,
              req.body.estado,
              req.body.persona_recibe,
              req.body.telefono_persona,
              req.body.direccion,
            ]
          );
          res.status(201).json({
            message: 'Pedido registrado correctamente',
            estatus: true,
          });
        } else {
          await database.awaitQuery(
            'INSERT INTO pedidos (cliente_id, precio, producto_id, tipo_pago, referencia, comprobante, ciudad, estado, persona_recibe, telefono_persona, direccion) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?)',
            [
              cliente_id,
              precio,
              producto_id,
              tipo_pago,
              req.body.referencia,
              req.file.filename,
              req.body.ciudad,
              req.body.estado,
              req.body.persona_recibe,
              req.body.telefono_persona,
              req.body.direccion,
            ]
          );
          res.status(201).json({
            message: 'Pedido registrado correctamente',
            estatus: true,
          });
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({
          message: 'Ocurrió un error',
          estatus: false,
        });
      }
    }
  },
  obtenerPedidosCliente: async (req, res) => {
    try {
      const { clienteId } = req.params;
      let pedidosObtenidos = await database.awaitQuery(
        'SELECT * FROM pedidos WHERE cliente_id = ?',
        [clienteId]
      );
      pedidosObtenidos = await Promise.all(
        pedidosObtenidos.map(async (producto, index) => {
          const [productoObtenido] = await database.awaitQuery(
            'SELECT * FROM productos WHERE id = ?',
            [pedidosObtenidos[index].producto_id]
          );
          return {
            ...producto,
            producto_id: {
              id: productoObtenido.id,
              nombre: productoObtenido.nombre,
              imagen: productoObtenido.imagen,
              precio: productoObtenido.precio,
            },
          };
        })
      );
      res.status(200).json({
        pedidos: pedidosObtenidos,
        estatus: true,
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Ocurrió un error',
        estatus: false,
      });
    }
  },
  detallesPedido: async (req, res) => {
    try {
      const { pedidoId } = req.params;
      let detallePedido = await database.awaitQuery(
        'SELECT * FROM pedidos WHERE id = ?',
        [pedidoId]
      );
      if (!detallePedido.length) {
        return res
          .status(400)
          .json({ mensaje: 'El pedido solicitado no existe' });
      }
      detallePedido = await Promise.all(
        detallePedido.map(async (pedido) => {
          const [productoObtenido] = await database.awaitQuery(
            'SELECT * FROM productos WHERE id = ?',
            [pedido.producto_id]
          );
          return {
            ...pedido,
            producto_id: {
              id: productoObtenido.id,
              nombre: productoObtenido.nombre,
              imagen: productoObtenido.imagen,
              precio: productoObtenido.precio,
              categoria: productoObtenido.categoria,
              descripcion: productoObtenido.descripcion,
            },
          };
        })
      );
      res.status(200).json({
        pedido: detallePedido,
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Ocurrió un error',
      });
    }
  },
  cancelarPedido: async (req, res) => {
    try {
      const { pedidoId } = req.params;
      const pedidoCancelado = await database.awaitQuery(
        'DELETE FROM pedidos WHERE id = ?        ',
        [pedidoId]
      );
      if (pedidoCancelado) {
        res.status(200).json({
          mensaje: 'Pedido cancelado correctamente',
          eliminado: true,
        });
      }
    } catch (error) {
      res.status(500).json({
        mensaje: 'Ocurrió un error',
        eliminado: false,
      });
    }
  },
  detallesCliente: async (req, res) => {
    try {
      const { clienteId } = req.params;
      const detalleCliente = await database.awaitQuery(
        'SELECT * FROM clientes WHERE id = ?',
        [clienteId]
      );
      if (!detalleCliente.length) {
        return res
          .status(400)
          .json({ mensaje: 'El cliente solicitado no existe', estatus: false });
      }
      res.status(200).json({
        cliente: detalleCliente[0],
        estatus: true,
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Ocurrió un error',
        estatus: false,
      });
    }
  },
  buscadorProductos: async (req, res) => {
    try {
      const { productoBuscar } = req.params;
      const productosBuscados = await database.awaitQuery(
        'SELECT * FROM productos WHERE nombre LIKE ?',
        ['%' + productoBuscar + '%']
      );
      if (!productosBuscados.length) {
        return res
          .status(200)
          .json({ mensaje: 'No se encontraron productos', estatus: false });
      }
      res.status(200).json({
        productos: productosBuscados,
        estatus: true,
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Ocurrió un error',
        estatus: false,
      });
    }
  },
  agregarProductoCarrito: async (req, res) => {
    try {
      const { clienteId } = req.params;
      const { productoId } = req.body;
      if (!productoId) {
        return res
          .status(400)
          .json({ mensaje: 'El producto es necesario', estatus: false });
      }
      const productoAgregado = await database.awaitQuery(
        'SELECT * FROM carrito WHERE cliente_id = ? AND producto_id = ?',
        [clienteId, productoId]
      );
      if (productoAgregado.length) {
        return res.status(400).json({
          mensaje: 'El producto ya ha sido agregado anteriormente al carrito',
          productoExistente: true,
          estatus: false,
        });
      }
      await database.awaitQuery(
        'INSERT INTO carrito (cliente_id, producto_id) VALUES (?, ?)',
        [clienteId, productoId]
      );
      res.status(200).json({
        mensaje: 'Producto agregado correctamente al carrito',
        estatus: true,
        productoExistente: false,
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Ocurrió un error',
        estatus: false,
        productoExistente: false,
      });
    }
  },
  obtenerProductosCarrito: async (req, res) => {
    try {
      const { clienteId } = req.params;
      const datosCarrito = await database.awaitQuery(
        'SELECT * FROM carrito WHERE cliente_id = ?',
        [clienteId]
      );
      if (!datosCarrito.length) {
        return res.status(200).json({
          mensaje: 'El carrito está vacío',
          estatus: false,
          carrito: [],
        });
      }
      const datosCarritoObtenidos = await Promise.all(
        datosCarrito.map(async (datosCarrito) => {
          const [productoObtenido] = await database.awaitQuery(
            'SELECT * FROM productos WHERE id = ?',
            [datosCarrito.producto_id]
          );
          return {
            ...datosCarrito,
            producto_id: {
              id: productoObtenido.id,
              nombre: productoObtenido.nombre,
              imagen: productoObtenido.imagen,
              precio: productoObtenido.precio,
              categoria: productoObtenido.categoria,
            },
          };
        })
      );
      res.status(200).json({
        mensaje: 'Productos obtenenidos correctamente',
        carrito: datosCarritoObtenidos,
        estatus: true,
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Ocurrió un error',
        estatus: false,
      });
    }
  },
  eliminarProductoCarrito: async (req, res) => {
    try {
      const { productoId } = req.params;
      const productoDelCarritoEliminado = await database.awaitQuery(
        'DELETE FROM carrito WHERE id = ?',
        [productoId]
      );
      if (!productoDelCarritoEliminado) {
        return res.status(400).json({
          mensaje: 'El producto no existe en el carrito',
          estatus: false,
        });
      }
      res.status(200).json({
        mensaje: 'Producto eliminado correctamente del carrito',
        estatus: true,
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Ocurrió un error',
        estatus: false,
      });
    }
  },
};
