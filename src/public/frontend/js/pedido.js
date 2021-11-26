const pedidoCarrito = document.querySelector('.pedido-carrito');
const direccionError = document.getElementById('direccion-error');

// Valida que el texto
const validarTexto = (texto) =>
  /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/.test(
    texto
  );

let carrito;
// Renderiza el resumen de productos del carrito
const renderizarPedidosCarrito = async () => {
  const usuarioAutenticado = window.localStorage.getItem('user');
  if (!usuarioAutenticado) {
    return M.toast({
      html: 'Necesitas iniciar sesión para ver los detalles del carrito <i class="material-icons">error</i>',
    });
  }
  const { id: clienteId } = JSON.parse(usuarioAutenticado);
  const productosDelCliente = await obtenerProductosCarritoCliente(clienteId);
  carrito = productosDelCliente.carrito;
  if (!carrito.length) {
    document.querySelector('.ocultar-carrito').style.display = 'block';
    document.querySelector('.carrito-compras-vacio').style.display = 'block';
    document.querySelector('.tabla-resumen').style.display = 'none';
    return;
  }
  document.querySelector('.mostrar-carrito').style.display = 'block';
  document.querySelector('.carrito-compras-vacio').style.display = 'none';
  document.querySelector('.tabla-resumen').style.display = 'block';
  let precioTotal = 0;
  let htmlRenderizar = '';
  carrito.forEach((carrito) => {
    const listadoProductosCarrito = `
    <tr>
    <td><img src="${carrito.producto_id.imagen}" width="70" ></td>
    <td>${carrito.producto_id.categoria}</td>
    <td>${carrito.producto_id.nombre}</td>
        <td class="precio">$ <b>${carrito.producto_id.precio}</b></td>
        </tr>
        `;

    htmlRenderizar += listadoProductosCarrito;
    precioTotal += carrito.producto_id.precio;
  });

  document.querySelector(
    '.precio-total-carrito'
  ).innerHTML = `$ <b>${precioTotal}</b>`;
  pedidoCarrito.innerHTML = htmlRenderizar;
};
//Cambia el formulario a pago  transferencia
const seleccionarPagoTransferencia = () => {
  document.getElementById('pago-transferencia-accion').style.display = 'block';
  document.getElementById('pago-efectivo-accion').style.display = 'none';
};
//Cambia el formulario a pago  efectivo
const seleccionarPagoEfectivo = () => {
  document.getElementById('pago-transferencia-accion').style.display = 'none';
  document.getElementById('pago-efectivo-accion').style.display = 'block';
};

const eliminarProductosCarrito = async () => {
  const usuarioAutenticado = window.localStorage.getItem('user');
  if (!usuarioAutenticado) {
    return M.toast({
      html: 'Necesitas iniciar sesión para ver los detalles del carrito <i class="material-icons">error</i>',
    });
  }
  const { id: clienteId } = JSON.parse(usuarioAutenticado);
  const { carrito } = await obtenerProductosCarritoCliente(clienteId);
  carrito.forEach(async (carrito) => {
    await fetch(`${URL_API}/eliminarProducto-carrito/${carrito.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
};

const registrarPedido = async (tipoPago) => {
  // Valida que existan productos en el carriro
  if (!carrito.length) {
    return M.toast({
      html: 'No existen productos en el carrito <i class="material-icons">warning</i>',
    });
  }
  direccionError.innerHTML = '';
  const { id: cliente_id } = JSON.parse(window.localStorage.getItem('user'));

  // Valida los campos di direccion que existan esten comletos y sea un telefono y texto
  const estado = document.getElementById('estado').value;
  const telefono = document.getElementById('telefono').value;
  let ciudad = document.getElementById('ciudad').value;
  let persona = document.getElementById('persona').value;
  let direccion = document.getElementById('direccion').value;

  //Validar los campos de direccion
  if (
    !ciudad ||
    !estado ||
    !persona ||
    !telefono ||
    !direccion ||
    ciudad.trim() === '' ||
    estado.trim() === '' ||
    persona.trim() === '' ||
    telefono.trim() === '' ||
    direccion.trim() === ''
  ) {
    direccionError.innerHTML =
      'Todos los campos son obligatorios <i class="material-icons">error</i> ';
    return M.toast({
      html: 'Todos los campos son obligatorios <i class="material-icons">warning</i>',
    });
  }
  //valida que el telefono sea un telefono
  if (!/^\d{11}$/.test(telefono)) {
    direccionError.innerHTML =
      'El telefono debe ser un numero de 11 digitos <i class="material-icons">error</i> ';
    return M.toast({
      html: 'El telefono debe ser un numero de 11 digitos <i class="material-icons">warning</i>',
    });
  }
  if (!validarTexto(ciudad) || !validarTexto(persona)) {
    direccionError.innerHTML =
      'Los campos de persona & ciudad deben ser solo texto <i class="material-icons">error</i> ';
    return M.toast({
      html: 'Los campos de persona & cuidad deben ser solo texto <i class="material-icons">warning</i>',
    });
    return;
  }
  //Capiraliza el nombre de la persona & ciudad
  persona = capitalizarPrimeraLetra(persona);
  ciudad = capitalizarPrimeraLetra(ciudad);
  direccion = capitalizarPrimeraLetra(direccion);

  //obtiene todos los producto_id del arreglo del carrito
  const url = `${URL_API}/pedido-crear`;
  let correcto, error;
  if (tipoPago === 'Efectivo') {
    for (let index = 0; index < carrito.length; index++) {
      const pedido = {
        cliente_id,
        producto_id: carrito[index].producto_id.id,
        precio: carrito[index].producto_id.precio,
        tipo_pago: tipoPago,
        ciudad,
        estado,
        persona_recibe: persona,
        telefono_persona: telefono,
        direccion,
      };
      const respuesta = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(pedido),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { estatus } = await respuesta.json();
      if (estatus) {
        correcto = true;
      } else {
        error = true;
      }
    }
    if (error) {
      M.toast({
        html: 'Error al registrar el pedido <i class="material-icons">error</i>',
      });
    } else {
      M.toast({
        html: 'Pedido registrado correctamente <i class="material-icons">check_circle</i>',
      });
      await eliminarProductosCarrito();
    }
    setTimeout(() => {
      window.location = 'cuenta.html';
    }, 2000);
    return;
  } else {
    const archivo = document.getElementById('archivo').files[0];
    let referencia = document.getElementById('referencia').value;
    if (!archivo || !referencia) {
      return M.toast({
        html: 'Debes enviar todos los campos <i class="material-icons">error</i>',
      });
    }
    referencia = referencia.toUpperCase();
    for (let index = 0; index < carrito.length; index++) {
      const formData = new FormData();
      formData.append('cliente_id', cliente_id);
      formData.append('producto_id', carrito[index].producto_id.id);
      formData.append('precio', carrito[index].producto_id.precio);
      formData.append('referencia', referencia);
      formData.append('tipo_pago', tipoPago);
      formData.append('archivo', archivo);
      formData.append('ciudad', ciudad);
      formData.append('estado', estado);
      formData.append('persona_recibe', persona);
      formData.append('telefono_persona', telefono);
      formData.append('direccion', direccion);
      //Envia la petición usando AJAX del Jquery en formData para subir el archivo
      $.ajax({
        url,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
          const { estatus } = data;
          if (estatus) {
            correcto = true;
          } else {
            error = true;
          }
        },
      });
    }
    if (error) {
      M.toast({
        html: 'Error al registrar el pedido <i class="material-icons">error</i>',
      });
    } else {
      M.toast({
        html: 'Pedido registrado correctamente <i class="material-icons">check_circle</i>',
      });
      await eliminarProductosCarrito();
    }
    setTimeout(() => {
      window.location = 'cuenta.html';
    }, 2000);
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  let elems = document.querySelectorAll('select');
  let instances = M.FormSelect.init(elems);
  if (!window.localStorage.getItem('user')) {
    M.toast({
      html: 'No tienes acceso a esta sección <i class="material-icons">error</i>',
    });
    window.location.href = 'index.html';
    return;
  }
  await renderizarPedidosCarrito();
});
