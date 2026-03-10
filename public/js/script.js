const menu = document.getElementById('menu');
const mobileNav = document.getElementById('mobileNav');

menu.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

