const productosContenedor = document.querySelector('.productos-container');
const buscadorProductos = document.querySelector('.buscador-form');
// Obtener los prroductos disponibles en la BD
const obtenerProductos = async () => {
  try {
    const url = `${URL_API}/productos`;
    const response = await fetch(url);
    const { productos } = await response.json();
    renderizarProductos(productos);
  } catch (error) {
    M.toast({
      html: `${error.message} <i class="material-icons">check_circle</i>`,
    });
  }
};

// Renderiza los productos enviados como parametros
const renderizarProductos = (productos) => {
  let html = '';
  productos.map((producto) => {
    const li = `
    <div class="productos">
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="${producto.imagen}">
      </div>
      <div class="card-content">
          <span class="card-title activator black-text text-darken-1"><h6>${producto.nombre}</h6><i class="material-icons detalles-seccion right">more_vert</i></span>
           <h6>$ <b>${producto.precio}</b></h6>
          <button class="btn btn--agregar" type="submit" name="action" onClick="agregarProductoCarrito('${producto.id}')">Agregar al carro
          <i class="material-icons right">shopping_cart</i>
          </button>
      </div>
      <div class="card-reveal">
          <span class="card-title grey-text text-darken-4 text-center">Detalles<i class="material-icons right">close</i></span>
          <label>Categoría:</label>
             <li>${producto.categoria}</li>
             <label>Descripción:</label>
             <p>${producto.descripcion}</p>
      </div>
    </div>
    </div>
        `;

    html += li;
  });
  productosContenedor.innerHTML = html;
};

// Escuha el evento submit del formulario buscador
buscadorProductos.addEventListener('submit', async (e) => {
  e.preventDefault();
  let productoBuscar = document.querySelector('.buscador').value;
  if (!productoBuscar.length) return window.location.reload();
  if (productoBuscar.length && productoBuscar.length <= 2) {
    return M.toast({
      html: 'El nombre del producto debe tener al menos 3 caracteres <i class="material-icons">warning</i>',
    });
  }
  let producto = productoBuscar.toLowerCase();
  const url = `${URL_API}/buscador-productos/${producto}`;
  const response = await fetch(url);
  const { productos, estatus } = await response.json();
  if (!estatus)
    return M.toast({
      html: 'No se encontraron productos <i class="material-icons">warning</i>',
    });
  renderizarProductos(productos);
});

const agregarProductoCarrito = async (productoId) => {
  const usuarioAutenticado = window.localStorage.getItem('user');
  if (!usuarioAutenticado) {
    M.toast({
      html: 'Debes iniciar sesión <i class="material-icons">error</i>',
    });
    return;
  }
  const { id } = JSON.parse(usuarioAutenticado);
  const url = `${URL_API}/agregar-carrito/${id}`;
  const data = {
    productoId,
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { mensaje, estatus, productoExistente } = await response.json();
    if (productoExistente) {
      M.toast({ html: `${mensaje} <i class="material-icons">warning</i>` });
      return;
    }
    if (estatus) {
      M.toast({
        html: `${mensaje} <i class="material-icons">check_circle</i>`,
      });
      await renderizarProductosCarrito();
      return;
    }
  } catch (error) {
    M.toast({ html: `${error.message} <i class="material-icons">error</i>` });
  }
};

// Escucha el evento click para el icono de cerrar en el buscador y recarga la busqueda/pagina
const cerrarBuscador = document.querySelector('.cerrar');
cerrarBuscador.addEventListener('click', (e) => {
  window.location.reload();
});

//Escucha el evento de carga del dom y renderiza los productos
window.addEventListener('DOMContentLoaded', async () => {
  await obtenerProductos();
});
