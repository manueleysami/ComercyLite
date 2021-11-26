// Verifica que el usuario este autenticado para poder acceder a esta pagina
window.addEventListener('DOMContentLoaded', async () => {
  if (!window.localStorage.getItem('user')) {
    M.toast({
      html: 'No tienes acceso a esta sección <i class="material-icons">error</i>',
    });
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
    return;
  }
  await obtenerDetallesCliente();
  await obtenerPedidosDelCliente();
});

// Busca los detalles del cliente
const obtenerDetallesCliente = async () => {
  const { id } = JSON.parse(window.localStorage.getItem('user'));
  const url = `${URL_API}/detalles-cliente/${id}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.estatus) {
      M.toast({ html: `${data.mensaje} <i class="material-icons">error</i>` });
      return;
    }
    const { nombre, usuario, fecha } = data.cliente;
    document.querySelector('.cuenta-email').innerHTML = usuario;
    document.querySelector('.cuenta-nombre').innerHTML = nombre;
    document.querySelector('.cuenta-fecha').innerHTML = `${new Date(
      fecha
    ).toLocaleDateString()}`;
  } catch (error) {
    M.toast({ html: `${error.message} <i class="material-icons">error</i>` });
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  }
};

//Obtener los pedidos del cliente
const obtenerPedidosDelCliente = async () => {
  try {
    const { id } = JSON.parse(window.localStorage.getItem('user'));
    const url = `${URL_API}/pedidos-cliente/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.estatus) {
      M.toast({ html: `${data.mensaje} <i class="material-icons">error</i>` });
      return;
    }
    const { pedidos } = data;
    if (!pedidos.length) {
      renderizarPedidos(pedidos);
      return;
    }
    renderizarPedidos(pedidos);
  } catch (error) {
    M.toast({ html: `${error.message} <i class="material-icons">error</i>` });
  }
};

// Obtiene los detalles del pedido enviado como parametro
const obtenerDetallesPedido = async (id) => {
  const url = `${URL_API}/pedido-detalle/${id}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    M.toast({ html: `${error.message} <i class="material-icons">error</i>` });
  }
};
// Elimina el pedido enviado como id
const eliminarPedido = (id) => {
  let cancel = document.querySelector('.pedido-cancelar');
  cancel.addEventListener('click', async () => {
    const url = `${URL_API}/pedido-cancelar/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.eliminado) {
      M.toast({
        html: 'Pedido eliminado correctamente <i class="material-icons">check_circle</i>',
      });
      setInterval(() => {
        location.href = 'cuenta.html';
      }, 1000);
    } else {
      M.toast({
        html: 'No se pudo eliminar el pedido <i class="material-icons">error</i>',
      });
    }
  });
};
// Renderiza en una tabla los pedidos del cliente
const renderizarPedidos = (data) => {
  const cuentaPedidoTabla = document.querySelector('.cuenta-pedido-tabla');
  let pedidosHtml = '';
  if (!data.length) {
    document.querySelector('.cuenta-sin-pedido').style.display = 'block';
    document.querySelector('.cuenta-pedido-div').style.display = 'none';
    return;
  }
  document.querySelector('.cuenta-pedido-div').style.display = 'block';
  document.querySelector('.cuenta-sin-pedido').style.display = 'none';

  data.map((pedido) => {
    const pagoTipoTransferencia = pedido.tipo_pago === 'Transferencia';
    let html = `
    <tr>
      <td><a class="cursor-pointer black-text" onclick="detallesPedido('${
        pedido.id
      }')">${pedido.producto_id.nombre} <br>
      <small style="color:gray;">Click para ver detalles</small>
      </a> 
      </td>
      <td>$ ${pedido.producto_id.precio}</td>
      <td>
        ${
          pagoTipoTransferencia
            ? `
          <a href="http://localhost:3000/img/${pedido.comprobante}" target="_blank">
          <img  width="50" src="http://localhost:3000/img/${pedido.comprobante}">
          </a>
          <br>
          <b>Transfencia</b>. 
          `
            : '<b>Efectivo.</b>'
        }
      </td>
      <td>${
        pedido.referencia
          ? `<b>${pedido.referencia}</b>`
          : '<span style="color:gray;">Sin referencia</span> '
      } </td>
      <td>${new Date(pedido.fecha).toLocaleDateString()}</td>
      <td><a class="waves-effect waves-light modal-trigger btn red white-text" href="#modal-eliminar-pedido" onClick="eliminarPedido('${
        pedido.id
      }')"> <i class="material-icons">delete_forever</i></a></td>
    </tr>
    `;
    pedidosHtml += html;
  });
  cuentaPedidoTabla.innerHTML = pedidosHtml;
};

// Obtiene los detalles del pedido enviado como parametro y los renderiza en una tarjeta
const renderizarDetallesPedido = (pedido) => {
  // Suma los 7 dias habiles a la fecha de entrega
  let fechaEntrega = new Date(pedido.fecha);
  fechaEntrega.setDate(fechaEntrega.getDate() + 7);
  let html = `
  <div>
  <label><a href="cuenta.html" class="black-text"><i class="material-icons">arrow_back</i></a></label> 
  <div class="row ">
  <div class="col s12 m12">
    <div class="card darken-1">
      <div class="card-content">
        <span class="card-title">${pedido.producto_id.nombre}</span>
        <p>Fecha del pedido ${new Date(
          pedido.fecha_pedido
        ).toLocaleDateString()}</p>
        </div>
        <div class="card-content">
        <p>Precio pedido: $<b>${pedido.precio}</b> </p>
        <p>Categoría del producto: ${pedido.producto_id.categoria} </p>
        <p>Tipo de pago: ${pedido.tipo_pago} </p>
        <p>Referencia: ${
          pedido.referencia
            ? `<b>${pedido.referencia}</b>`
            : '<span style="color:gray;">Sin referencia</span> '
        } </p>
        <p>Descripción: ${pedido.producto_id.descripcion}.</p>
        <p><b>El pedido sera procesado antes del ${fechaEntrega.toLocaleString()}</b> </p>
        <br>
        <h5 >Dirección de envio del pedido</h5>
        <p>Ciudad: <b>${pedido.ciudad}</b> </p>
        <p>Estado: <b>${pedido.estado}</b> </p>
        <p>Persona que recibe: <b>${pedido.persona_recibe}</b> </p>
        <p>Teléfono: <b>${pedido.telefono_persona}</b> </p>
        <p>Dirección: <b>${pedido.direccion}</b> </p>
        <div class="text-center" style="margin-top:2em;">
         <img src="${pedido.producto_id.imagen}" width="100px" />
           </div>
      </div>
      <div class="card-action text-center">
        <a class="modal-trigger btn red white-text" href="#modal-eliminar-pedido" onClick="eliminarPedido('${
          pedido.id
        }')">Eliminar pedido  <i class="material-icons right">delete_forever</i> </a>
      </div>
    </div>
  </div>
  </div>
</div>
  `;
  document.querySelector('.cuenta-pedido-detalles').innerHTML = html;
};

// Obtiene los detalles del pedido y en caso exista llama a la funcion renderizarDetallesPedido
const detallesPedido = async (pedidoId) => {
  const { pedido: pedidoObtenido } = await obtenerDetallesPedido(pedidoId);
  if (!pedidoObtenido.length) {
    return M.toast({
      html: 'El pedido que intenta solicitado no existe <i class="material-icons">error</i>',
    });
  }
  document.querySelector('#cuenta-default').style.visibility = 'hidden';
  document.querySelector('.cuenta-pedido-detalles').style.display = 'block';
  const [pedido] = pedidoObtenido;
  renderizarDetallesPedido(pedido);
};
