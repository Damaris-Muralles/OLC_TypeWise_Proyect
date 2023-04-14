/*
    Autor: DM
    Año:2023
*/
let navLinks = document.querySelectorAll('.nav-link');
navLinks[0].classList.add('active');
window.addEventListener('scroll', function() {
  var logo = document.querySelector('.logoapp img');
  var navbar = document.querySelector('.navbar');

  if (window.scrollY > 30) {
      logo.src = 'Img/logoicon.ico';
      navbar.classList.add('bg-dark');
  } else {
      logo.src = 'Img/vacio.png';
      navbar.classList.remove('bg-dark');
  }
  // Obtener todas las secciones
  let sections = document.querySelectorAll('section');

  // Obtener todos los enlaces del navbar
  navLinks = document.querySelectorAll('.nav-link');
  let index = sections.length;
  console.log(index)
  let offset = 150;

  while(--index && window.scrollY + offset < sections[index].offsetTop) {}

 

  navLinks.forEach((link) => link.classList.remove('active'));
  navLinks[index].classList.add('active');
});

var links = document.querySelectorAll('.navbar-nav .nav-link');
for (var i = 0; i < links.length; i++) {
links[i].addEventListener('click', function(event) {
  event.preventDefault();
  var targetId = this.getAttribute('href').slice(1);
  var target = document.querySelector('#' + targetId);
  if (target) {
    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo(0, targetPosition - 130);
  }
});
}
var text = 'Bienvenidos';
var textElement = document.querySelector('#welcome-text span');
var i = 0;
var interval = setInterval(function() {
  textElement.textContent += text[i];
  i++;
  if (i >= text.length) {
    clearInterval(interval);
  }
}, 150);
function changePDF(file, link) {
  var pdfViewer = document.querySelector('#pdf-viewer');
  pdfViewer.src = '../Manuales/' + file;

  var links = document.querySelectorAll('.manualstile');
  links.forEach(function(link) {
    link.classList.remove('active');
  });
  link.classList.add('active');
}
function changeReport(file, link) {
  // Código para cambiar la imagen en el elemento .viewreport
  var reportImage = document.querySelector('#report-image');
  reportImage.src = 'Img/' + file;

  var links = document.querySelectorAll('.reportestile');
  links.forEach(function(link) {
    link.classList.remove('active');
  });
  link.classList.add('active');
}
function showOffcanvas(event) {
  event.preventDefault();
  var offcanvasElement = document.getElementById('offcanvasRight');
  var offcanvas = new bootstrap.Offcanvas(offcanvasElement);
  offcanvas.show();
}
function changeImage(imageName) {
  var imageElement = document.querySelector('#reportes img');
  imageElement.src = 'Img/' + imageName;
  var offcanvasElement = document.getElementById('offcanvasRight');
  var offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
  offcanvas.hide();
}


