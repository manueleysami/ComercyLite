const database = require('../db/conexion');
const bcrypt = require('bcrypt');
module.exports = {
  login: (req, res) => {
    res.render('login/login');
  },
  home: async (req, res) => {
    const productos = await database.awaitQuery('Select * from productos');
    res.render('admin/home', { productos });
  },
  eliminarProducto: async (req, res) => {
    const { id } = req.params;
    await database.awaitQuery('DELETE FROM productos WHERE id = ?', [id]);
    res.redirect('/admin');
  },
  loginPost: async (req, res) => {
    const { usuario, clave } = req.body;
    if (!usuario || !clave) {
      return res.render('login/login', {
        mensaje: 'El usuario y clave son requeridos',
      });
    }
    try {
      const usuarioAdmin = await database.awaitQuery(
        'SELECT * FROM usuarios where usuario = ?',
        [usuario]
      );
      if (!usuarioAdmin[0]) {
        return res.render('login/login', { mensaje: 'El usuario no existe' });
      }
      const resultado = await bcrypt.compare(clave, usuarioAdmin[0].clave);
      if (!resultado) {
        return res.render('login/login', { mensaje: 'Clave incorrecta' });
      }
      req.session.usuario = usuarioAdmin[0];
      req.session.isLogged = true;
      res.redirect('/admin');
    } catch (error) {
      res.render('login/login', {
        mensaje: 'Ocurrió un error',
      });
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
  },
  agregarProducto: (req, res) => {
    res.render('admin/productosAgregar');
  },
  agregarProductoPost: async (req, res) => {
    const { nombre, precio, descripcion, categoria, imagen } = req.body;
    if (
      !nombre ||
      nombre.trim() === '' ||
      descripcion.trim() === '' ||
      !precio ||
      !descripcion ||
      !categoria ||
      !imagen
    ) {
      return res.render('admin/productosAgregar', {
        mensaje: 'Todos los campos son requeridos',
      });
    }
    try {
      await database.awaitQuery('INSERT INTO productos SET ?', [
        { nombre, precio, descripcion, categoria, imagen },
      ]);
      res.redirect('/admin');
    } catch (error) {
      res.render('admin/productosAgregar', {
        mensaje: 'Ocurrió un error',
      });
    }
  },
  editarProducto: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.redirect('/admin');
    }
    const producto = await database.awaitQuery(
      'Select * from productos where id = ?',
      [id]
    );
    res.render('admin/productoEditar', { producto: producto[0] });
  },
  editarProductoPut: async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, categoria, imagen } = req.body;
    if (
      !nombre ||
      nombre.trim() === '' ||
      descripcion.trim() === '' ||
      !precio ||
      !descripcion ||
      !categoria ||
      !imagen
    ) {
      return res.render('admin/productoEditar', {
        mensaje: 'Todos los campos son requeridos',
      });
    }
    try {
      await database.awaitQuery('UPDATE productos SET ? WHERE id = ?', [
        { nombre, precio, descripcion, categoria, imagen },
        id,
      ]);
      res.redirect('/admin');
    } catch (error) {
      res.render('admin/productoEditar', {
        mensaje: 'Ocurrió un error',
      });
    }
  },
  obtenerClientes: async (req, res) => {
    try {
      const clientes = await database.awaitQuery('SELECT * FROM clientes');
      res.render('admin/clientes', { clientes });
    } catch (error) {
      res.redirect('/admin');
    }
  },
  eliminarCliente: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.redirect('/admin');
    }
    try {
      await database.awaitQuery('DELETE FROM clientes WHERE id = ?', [id]);
      res.redirect('/obtener-clientes');
    } catch (error) {
      res.redirect('/obtener-clientes');
    }
  },
  obtenerPedidos: async (req, res) => {
    try {
      const pedidos = await database.awaitQuery('SELECT * FROM pedidos');
      const pedidosObtenidos = await Promise.all(
        pedidos.map(async (p) => {
          const [cliente] = await database.awaitQuery(
            'SELECT * FROM clientes WHERE id = ?',
            [p.cliente_id]
          );
          const [producto] = await database.awaitQuery(
            'SELECT * FROM productos WHERE id = ?',
            [p.producto_id]
          );
          return {
            ...p,
            cliente_id: cliente.nombre,
            producto_id: producto.nombre,
            imagen: producto.imagen,
          };
        })
      );
      res.render('admin/pedidos', { pedidos: pedidosObtenidos });
    } catch (error) {
      res.redirect('/admin');
    }
  },
  eliminarPedido: async (req, res) => {
    try {
      const { pedidoId } = req.params;
      await database.awaitQuery('DELETE FROM pedidos WHERE id = ?', [pedidoId]);
      res.redirect('/obtener-pedidos');
    } catch (error) {
      res.redirect('/obtener-pedidos');
    }
  },
};
