/*
    Autor: DM
    Año:2023
*/


// FUNCIONES PARA HACER DINAMICA LA INTERFAZ

// Para el Navbar
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

// Posicionar las secciones antes de la seccion al dar click
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


// Para la seccion inicial y el mensaje de bienvenidos
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

// Cambio de manuales
function changePDF(file, link) {
  var pdfViewer = document.querySelector('#pdf-viewer');
  pdfViewer.src = '../../Manuales/' + file;

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

// funcio para ver el offcamvas
function showOffcanvas(event) {
  event.preventDefault();
  var offcanvasElement = document.getElementById('offcanvasRight');
  var offcanvas = new bootstrap.Offcanvas(offcanvasElement);
  offcanvas.show();
}

// Cambiar imagen de reporte segun lo seleccionado
function changeImage(imageName) {
  var imageElement = document.querySelector('#reportes img');
  imageElement.src = 'Img/' + imageName;
  var offcanvasElement = document.getElementById('offcanvasRight');
  var offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
  offcanvas.hide();
}




// FUNCIONES PARA EL EDITOR

const tabsContainer = document.querySelector('.tabs-container');
const addTabBtn = document.querySelector('.add-tab');

// Añadir nuevo tab/pestaña a la seccion de editor
addTabBtn.addEventListener('click', () => {

  // Obtener el número máximo de pestaña existente
  const tabs = document.querySelectorAll('.tab');
  let maxTabNum = 0;
  tabs.forEach(tab => {
    const tabNum = parseInt(tab.getAttribute('data-tab'));
    if (tabNum > maxTabNum) {
      maxTabNum = tabNum;
    }
  });
  const newTabNum = maxTabNum + 1;
  
  // Crear la nueva pestaña
  const newTab = document.createElement('div');
  newTab.classList.add('tab');
  newTab.setAttribute('data-tab', newTabNum);
  newTab.innerHTML = `Tab ${newTabNum} <span class="close">×</span>`;
  tabsContainer.insertBefore(newTab, addTabBtn);
  
  // Crear el contenido de la nueva pestaña
  const newTabContent = document.createElement('div');
  newTabContent.classList.add('tab-content','activetab');
  newTabContent.setAttribute('data-tab', newTabNum);

  newTabContent.innerHTML = `<button type="button" class="btn btn-info">Abrir</button>
    <button type="button" class="btn btn-info">Guardar</button>
    <button type="button" class="btn btn-info">Ejecutar</button>
    <div class="contenedorgeneral">
      <div class="editorcontainer">
        <textarea id="myeditor${newTabNum}"></textarea>
      </div>
      <div class="containerconsola">
        <textarea id="myconsole${newTabNum}">resultado</textarea>
      </div>
    </div>`;
 // Agregar el nuevo contenido al DOM
 const editorElement = document.querySelector('#editor');
 editorElement.appendChild(newTabContent);
 
 // convertir los textarea a editores
  const editor = CodeMirror.fromTextArea(document.getElementById(`myeditor${newTabNum}`), {
    lineNumbers: true,
    mode: "text/x-typewise",
    theme:"tomorrow-night-bright",
    hintOptions: {
      hint: myHint,
      completeSingle: false
    }
  });
  //controlador de eventos del editor
editor.on("keyup", function(editor, event) {
  const keyCode = event.keyCode;
  if (keyCode !== 38 && keyCode !== 40) {
    editor.showHint();
  }
});
  const consoleEditor = CodeMirror.fromTextArea(document.getElementById(`myconsole${newTabNum}`), {
    lineNumbers: true,
    mode: "text/plain",
    theme:"tomorrow-night-bright",
    readOnly: true
  });

  // Agregar acción al botón "Abrir"
 const openBtn = newTabContent.querySelector('.btn-info:nth-child(1)');
 openBtn.addEventListener('click', () => {
   const input = document.createElement('input');
   input.type = 'file';
   input.accept = '.tw';
   input.onchange = () => {
     const file = input.files[0];
     if (file) {
       const reader = new FileReader();
       reader.onload = () => {
         editor.setValue(reader.result);
       };
       reader.readAsText(file);
     }
   };
   input.click();
 });
 
 // Agregar acción al botón "Guardar"
 const saveBtn = newTabContent.querySelector('.btn-info:nth-child(2)');
saveBtn.addEventListener('click', () => {
  const text = editor.getValue();
  if (!text) {
    Swal.fire(
      'No hay contenido para guardar',
      'Click en ok para salir',
      'info'
    )
    return;
  }
  // convirtiendo a archivo
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Archivo${newTabNum}.tw`;
  a.click();
});
 
  // Agregar event listeners a las nuevas pestañas y contenido
  newTab.addEventListener('click', () => {
    const tabNum = newTab.dataset.tab;
    selectTab(tabNum);
  });

  // agregando accion para cerrar pestaña
  const newCloseBtn = newTab.querySelector('.close');
  newCloseBtn.addEventListener('click', e => {
    e.stopPropagation();
    const tabNum = parseInt(e.target.parentNode.dataset.tab);
    // condicionando para que no se elimine la primera pestaña
    if (tabNum !== 1) {
      const isCurrentTab = e.target.parentNode.classList.contains('active');
      e.target.parentNode.remove();
      document.querySelector(`.tab-content[data-tab="${tabNum}"]`).remove();
      if (isCurrentTab) {
        const tabs = document.querySelectorAll('.tab');
        let prevTabNum = 0;
        tabs.forEach(tab => {
          const currentTabNum = parseInt(tab.dataset.tab);
          // condicion para seleccionar la pestaña anterior al eliminar pestaña activa
          if (currentTabNum < tabNum && currentTabNum > prevTabNum) {
            prevTabNum = currentTabNum;
          }
        });
        selectTab(prevTabNum);
      }
    }
  });
  selectTab(newTabNum);
});

// funcion para activar/seleccionar pestañas
function selectTab(tabNum) {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {

    if (tab.dataset.tab == tabNum) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  tabContents.forEach(content => {
    if (content.dataset.tab == tabNum) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

// Crear la primera pestaña y su contenido
const firstTab = document.createElement('div');
firstTab.classList.add('tab', 'active');
firstTab.setAttribute('data-tab', '1');
firstTab.innerHTML = `Tab 1 <span class="close">×</span>`;
tabsContainer.insertBefore(firstTab, addTabBtn);

const firstTabContent = document.createElement('div');
firstTabContent.classList.add('tab-content', 'active','activetab');
firstTabContent.setAttribute('data-tab', '1');
firstTabContent.innerHTML = `<button type="button" class="btn btn-info">Abrir</button>
<button type="button" class="btn btn-info">Guardar</button>
<button type="button" class="btn btn-info">Ejecutar</button>
<div class="contenedorgeneral">
  <div class="editorcontainer">
    <textarea id="myeditor1"></textarea>
  </div>
  <div class="containerconsola">
    <textarea id="myconsole1">resultado</textarea>
  </div>
</div>`;
// esta funcion obliga a que la pagina termine de cargar para realizar las acciones
window.onload = function() {

  // convierte el textarea en editor
  const editor = CodeMirror.fromTextArea(document.getElementById('myeditor1'), {
    lineNumbers: true,
    mode: "text/x-typewise",
    theme:"tomorrow-night-bright",
    hintOptions: {
      hint: myHint,
      completeSingle: false
    }
  });
  //controlador de eventos del editor
editor.on("keyup", function(editor, event) {
  const keyCode = event.keyCode;
  if (keyCode !== 38 && keyCode !== 40) {
    editor.showHint();
  }
});
  const consoleEditor = CodeMirror.fromTextArea(document.getElementById('myconsole1'), {
    lineNumbers: true,
    mode: "text/plain",
    theme:"tomorrow-night-bright",
    readOnly: true
  });

    // Agregar acción al botón "Abrir"
    const openBtn = firstTabContent.querySelector('.btn-info:nth-child(1)');
    openBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.tw';
      input.onchange = () => {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            editor.setValue(reader.result);
          };
          reader.readAsText(file);
        }
      };
      input.click();
    });
    
    // Agregar acción al botón "Guardar"
    const saveBtn = firstTabContent.querySelector('.btn-info:nth-child(2)');
    saveBtn.addEventListener('click', () => {
      const text = editor.getValue();
      if (!text) {
        Swal.fire(
          'No hay contenido para guardar',
          'Click en ok para salir',
          'info'
        )
        return;
      }
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Archivo1.tw';
      a.click();
    });
  
}

const editorElement = document.querySelector('#editor');
editorElement.appendChild(firstTabContent);
// seleccionar primera pestaña
firstTab.addEventListener('click', () => {
  const tabNum = firstTab.dataset.tab;
  selectTab(tabNum);
});
// funcion de cerrar primera pestaña
/*
* esta funcion lo que realmente hace es borrar el contenido de la pestaña 
* haciendo como que fuera una nueva pestaña en blanco
*/ 
const firstCloseBtn = firstTab.querySelector('.close');
firstCloseBtn.addEventListener('click', e => {
  e.stopPropagation();
  const tabNum = parseInt(e.target.parentNode.dataset.tab);
  if (tabNum === 1) {
    const firstTabContent = document.querySelector(`.tab-content[data-tab="${tabNum}"]`);

    firstTabContent.innerHTML = `<button type="button" class="btn btn-info">Abrir</button>
    <button type="button" class="btn btn-info">Guardar</button>
    <button type="button" class="btn btn-info">Ejecutar</button>
    <div class="contenedorgeneral">
      <div class="editorcontainer">
        <textarea id="myeditor${tabNum}"></textarea>
      </div>
      <div class="containerconsola">
        <textarea id="myconsole${tabNum}">resultado</textarea>
      </div>
    </div>`;

    // crea los editores y consola
  const editor = CodeMirror.fromTextArea(document.getElementById(`myeditor${tabNum}`), {
    lineNumbers: true,
    mode: "text/x-typewise",
    theme:"tomorrow-night-bright",
    hintOptions: {
      hint: myHint,
      completeSingle: false
    }
  });
  //controlador de eventos del editor
editor.on("keyup", function(editor, event) {
  const keyCode = event.keyCode;
  if (keyCode !== 38 && keyCode !== 40) {
    editor.showHint();
  }
});
  const consoleEditor = CodeMirror.fromTextArea(document.getElementById(`myconsole${tabNum}`), {
    lineNumbers: true,
    mode: "text/plain",
    theme:"tomorrow-night-bright",
    readOnly: true
  });
    // Agregar acción al botón "Abrir"
    const openBtn = firstTabContent.querySelector('.btn-info:nth-child(1)');
    openBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.tw';
      input.onchange = () => {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            editor.setValue(reader.result);
          };
          reader.readAsText(file);
        }
      };
      input.click();
    });
    
    // Agregar acción al botón "Guardar"
    const saveBtn = firstTabContent.querySelector('.btn-info:nth-child(2)');
    saveBtn.addEventListener('click', () => {
      const text = editor.getValue();
      if (!text) {
        Swal.fire(
          'No hay contenido para guardar',
          'Click en ok para salir',
          'info'
        )
        return;
      }
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Archivo${tabNum}.tw`;
      a.click();
    });
  
    tabCounter = 1;
  } else {
    const isCurrentTab = e.target.parentNode.classList.contains('active');
    e.target.parentNode.remove();
    document.querySelector(`.tab-content[data-tab="${tabNum}"]`).remove();
    if (isCurrentTab) {
      selectTab(tabNum - 1);
    }
  }
});
