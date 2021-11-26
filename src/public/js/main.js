window.addEventListener('load', () => {
  const hamburguesa = document.querySelector('.hamburguesa');
  hamburguesa.addEventListener('click', function () {
    const navMenu = document.querySelector('.nav-menu');
    const navLink = document.querySelectorAll('.nav-link');
    hamburguesa.addEventListener('click', menuMovil);
    navLink.forEach((n) => n.addEventListener('click', cerrarMenu));
    function menuMovil() {
      hamburguesa.classList.toggle('active');
      navMenu.classList.toggle('active');
    }
    function cerrarMenu() {
      hamburguesa.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
});
