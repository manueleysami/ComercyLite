const URL_API = 'http://localhost:3000/servidor';
const carritoContenedor = document.querySelector('.contenedor-cart');

//capitaliza la primera letra de un string
const capitalizarPrimeraLetra = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

//Setear el estado de la cuenta del cliente
window.addEventListener('DOMContentLoaded', async () => {
  if (localStorage.getItem('user')) {
    const userData = localStorage.getItem('user');
    establecerUsuarioAutenticado(userData);
    await renderizarProductosCarrito();
  } else {
    establecerUsuarioAutenticado();
  }
});

//Elimina el producto del carrito enviada como parametro
const eliminarDelCarrito = async (productoCarritoId, precio) => {
  const url = `${URL_API}/eliminarProducto-carrito/${productoCarritoId}`;
  const resonse = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { estatus, mensaje } = await resonse.json();
  if (!estatus) {
    return M.toast({
      html: `${mensaje} <i class="material-icons">warning</i> `,
    });
  }
  M.toast({
    html: `${mensaje} <i class="material-icons">check_circle</i> `,
  });

  //Busca el nodo padre del producto eliminado y lo elimina del listado HTML
  const elementoEliminar = document.querySelector(
    `[data-id="${productoCarritoId}"]`
  );
  elementoEliminar.parentNode.removeChild(elementoEliminar);

  //Resta el precio del producto eliminado al contador de precio total del carrito
  const contadorPrecio = document.querySelector('.contador-precio-total');
  const precioTotal = Number(contadorPrecio.children[0].innerHTML);
  contadorPrecio.children[0].innerHTML = precioTotal - precio;
  if (Number(contadorPrecio.children[0].innerHTML) === 0) {
    document.querySelector('.ocultar-carrito').style.display = 'block';
    document.querySelector('.mostrar-carrito').style.display = 'none';
  }
  if (window.location.pathname.includes('pedido')) {
    window.location.reload();
  }
};

//Cambia la UI basadonse si el usuario esta autenticado o no
const detallesUsuario = document.querySelector('.detalles-usuario');
const usuarioAutenticadoLinks = document.querySelectorAll(
  '.usuario-autenticado'
);
const usuarioNoAutenticadoLinks = document.querySelectorAll(
  '.usuario-no-autenticado'
);

// Modificada el navbar basandose si el usuario esta autenticado
const establecerUsuarioAutenticado = async (userData) => {
  if (userData) {
    const user = JSON.parse(userData);
    const html = `
    <div>Bienvenido, <b> ${user.nombre}</b></div>
    <div>Has iniciado sesión como: <b>${user.usuario}</b></div>
        `;
    detallesUsuario.innerHTML = html;
    //Alterna los links entre usuario autenticado y no autenticado
    usuarioAutenticadoLinks.forEach((item) => (item.style.display = 'block'));
    usuarioNoAutenticadoLinks.forEach((item) => (item.style.display = 'none'));
  } else {
    //Oculta los detalles del usuario y muestra los links cuando el usuario no esta autenticado
    detallesUsuario.innerHTML = '';
    usuarioAutenticadoLinks.forEach((item) => (item.style.display = 'none'));
    usuarioNoAutenticadoLinks.forEach((item) => (item.style.display = 'block'));
  }
};

// Obtiene los productos del carrito del cliente enviado como parametro
const obtenerProductosCarritoCliente = async (clienteId) => {
  try {
    const url = `${URL_API}/productos-carrito/${clienteId}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    M.toast({
      html: `${error.message} <i class="material-icons">warning</i> `,
    });
  }
};

// Muestra los productos del carrito basado en el cliente
const renderizarProductosCarrito = async () => {
  const usuarioAutenticado = window.localStorage.getItem('user');
  if (!usuarioAutenticado) {
    return M.toast({
      html: 'Necesitas iniciar sesión para ver los detalles del carrito <i class="material-icons">warning</i>',
    });
  }
  const { id: clienteId } = JSON.parse(usuarioAutenticado);
  const { carrito } = await obtenerProductosCarritoCliente(clienteId);
  let carritoHtmlRenderizar = '';
  let precioTotalCarrito = 0;
  if (!carrito.length) {
    document.querySelector('.ocultar-carrito').style.display = 'block';
    document.querySelector('.mostrar-carrito').style.display = 'none';
    return;
  }

  document.querySelector('.mostrar-carrito').style.display = 'block';
  document.querySelector('.ocultar-carrito').style.display = 'none';
  carrito.forEach((productoCarrito) => {
    const li = `
      <tr class="carito-row" data-id="${productoCarrito.id}"">
      <td><img src="${productoCarrito.producto_id.imagen}" width="50px" ></td>
      <td>${productoCarrito.producto_id.nombre}</td>
      <td>${productoCarrito.producto_id.categoria}</td>
      <td class="precio">$ <b>${productoCarrito.producto_id.precio}</b></td>
      <td><i style="color:#ff5353;" class="material-icons eliminar-producto-carrito" title="Elimina producto del carrito" onclick="eliminarDelCarrito(${
        productoCarrito.id
      },${productoCarrito.producto_id.precio})">remove_circle_outline</i></td>
      <td>${new Date(productoCarrito.fecha_registro).toLocaleString()}</td>
      </tr>
    `;

    carritoHtmlRenderizar += li;
    precioTotalCarrito += productoCarrito.producto_id.precio;
  });

  document.querySelector(
    '.contador-precio-total'
  ).innerHTML = `$ <b>${precioTotalCarrito}</b> `;
  carritoContenedor.innerHTML = carritoHtmlRenderizar;
};

//Registro de clientes
const formularioRegistro = document.querySelector('#formulario-registro');
formularioRegistro.addEventListener('submit', async (e) => {
  e.preventDefault();
  // Obtener campos del formulario de registro
  let nombre = formularioRegistro['registro-nombre'].value;
  const usuario = formularioRegistro['registro-email'].value;
  const clave = formularioRegistro['registro-clave'].value;
  const repetirClave = formularioRegistro['registro-clave-repetir'].value;
  if (clave.length < 5) {
    formularioRegistro.querySelector('.registro-error').innerHTML =
      'Las claves debe tener al menos 5 caracteres';
    M.toast({
      html: 'La clave debe tener al menos 5 caracteres <i class="material-icons">warning</i>',
    });
    return;
  }
  if (clave !== repetirClave) {
    formularioRegistro.querySelector('.registro-error').innerHTML =
      'Las claves deben ser iguales';
    return;
  }
  nombre = capitalizarPrimeraLetra(nombre);
  // Muestra barra de progreso
  document.querySelector('.registro-progress').style.visibility = 'visible';
  // Crear el usuario
  const response = await fetch(`${URL_API}/registro-cliente`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre,
      usuario: usuario,
      clave,
    }),
  });
  const dataResponse = await response.json();
  if (!dataResponse.registroSuccess) {
    formularioRegistro.querySelector(
      '.registro-error'
    ).innerHTML = `<span>${dataResponse.message}</span> <i class="material-icons">error</i> `;
    document.querySelector('.registro-progress').style.visibility = 'hidden';
    return;
  }
  const modal = document.querySelector('#modal-login');
  M.Modal.getInstance(modal).close();
  formularioRegistro.reset();
  formularioRegistro.querySelector('.registro-error').innerHTML = '';
  M.toast({
    html: 'Usuario registrado correctamente, inicia sesión para continuar <i class="material-icons">check_circle</i>',
  });
  document.querySelector('.registro-progress').style.visibility = 'hidden';
  usuarioRegistrado();
});

//Cierra sesion del usuario
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  const usuarioAutenticado = window.localStorage.getItem('user');
  if (usuarioAutenticado) {
    window.localStorage.removeItem('user');
    M.toast({
      html: 'Usuario ha cerrado sesión <i class="material-icons">check_circle</i>',
    });
    establecerUsuarioAutenticado();
    if (
      window.location.pathname.includes('cuenta.html') ||
      window.location.pathname.includes('pedido.html')
    ) {
      window.location.href = 'index.html';
    }
  }
});

// Login de clientes
const loginForm = document.querySelector('#formulario-login');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = loginForm['login-email'].value;
  const clave = loginForm['login-clave'].value;
  document.querySelector('.login-progress').style.visibility = 'visible';
  const response = await fetch(`${URL_API}/login-cliente`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usuario,
      clave,
    }),
  });
  const dataResponse = await response.json();
  if (!dataResponse.authStatus) {
    document.querySelector('.login-progress').style.visibility = 'hidden';
    loginForm.querySelector(
      '.login-error'
    ).innerHTML = `<span>${dataResponse.message}</span> <i class="material-icons">error</i>`;
    return;
  }
  const modal = document.querySelector('#modal-login');
  M.Modal.getInstance(modal).close();
  loginForm.reset();
  loginForm.querySelector('.login-error').innerHTML = '';
  document.querySelector('.login-progress').style.visibility = 'hidden';
  window.localStorage.setItem('user', JSON.stringify(dataResponse.cliente));
  M.toast({
    html: 'Usuario autenticado correctamente <i class="material-icons">check_circle</i>',
  });
  setTimeout(() => {
    window.location.reload();
  }, 300);
});

// Iniciar los modales
document.addEventListener('DOMContentLoaded', function () {
  let modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  let items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});

// Retorna al modal para el login
const mostrarLogin = () => {
  document.querySelector('#login-form').style.display = 'block';
  ('none');
};
// Retorna al modal para registro
const mostrarRegistro = () => {
  document.querySelector('.login-contenido').style.display = 'none';
  document.querySelector('.registro-contenido').style.display = 'block';
};
// Cambia entre el modal de registro y login
const usuarioRegistrado = () => {
  document.querySelector('.login-contenido').style.display = 'block';
  document.querySelector('.registro-contenido').style.display = 'none';
};

// Oculta/Muestra navbar
document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.sidenav');
  let instances = M.Sidenav.init(elems);
});
document.addEventListener('DOMContentLoaded', function () {
  let toolTip = document.querySelectorAll('.tooltipped');
  let instances = M.Tooltip.init(toolTip);
});
