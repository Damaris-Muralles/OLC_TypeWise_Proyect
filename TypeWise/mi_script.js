$(document).ready(function() {
	// Crea el editor de código
	var editor = CodeMirror(document.getElementById("editor"), {
		mode: "javascript",
		lineNumbers: true,
		theme: "material-darker",
		indentUnit: 4,
		indentWithTabs: true
	});

	// Maneja el click en el botón "Agregar pestaña"
	$("#add-tab").on("click", function() {
		// Cuenta el número de pestañas existentes para nombrar la nueva pestaña
		var tabs = $("#myTab");
		var newTab = tabs.children().length - 1;
		newTab++;

		// Crea la nueva pestaña
		var li = $("<li class='nav-item'></li>").attr("role", "presentation");
		var a = $("<a class='nav-link' data-toggle='tab'></a>").attr({
			"id": "tab" + newTab + "-tab",
			"href": "#tab" + newTab,
			"role": "tab",
			"aria-controls": "tab" + newTab,
			"aria-selected": "false"
		}).text("Pestaña " + newTab);

		// Agrega el botón de cerrar la pestaña
		var x = $("<button type='button' class='close' aria-label='Cerrar'><span aria-hidden='true'>&times;</span></button>").on("click", function() {
			// Elimina la pestaña
			var tabId = $(this).parent().attr("href");
			$(this).parent().parent().remove();
			$(tabId).remove();

			// Selecciona la primera pestaña
			var prevTab = $(tabs.children()[0]).find("a");
			prevTab.tab("show");
		});

		a.append(x);
		li.append(a);
		tabs.children().last().before(li);

		// Crea el contenido de la nueva pestaña
		var content = $("<div class='tab-pane fade'></div>").attr({
			"id": "tab" + newTab,
			"role": "tabpanel",
			"aria-labelledby": "tab" + newTab + "-tab"
		});

		// Agrega los botones de "Abrir", "Guardar" y "Ejecutar"
		var buttons = $("<div class='btn-group mr-2' role='group'></div>");
		var openButton = $("<button type='button' class='btn btn-primary'></button>").text("Abrir").on("click", function() {
			// Abre un archivo en el editor
			editor.setValue("Este es el contenido del archivo abierto");
		});
		var saveButton = $("<button type='button' class='btn btn-primary'></button>").text("Guardar").on("click", function() {
			// Guarda el contenido del editor en un archivo
			var content = editor.getValue();
			console.log("El siguiente contenido se ha guardado:");
			console.log(content);
		});
		var runButton = $("<button type='button' class='btn btn-primary'></button>").text("Ejecutar").on("click", function() {
			// Ejecuta el código del editor en la consola
			var code = editor.getValue();
			console.log("El siguiente código se está ejecutando:");
			console.log(code);
			var result = eval(code);
			console.log("El resultado es:");
			console.log(result);
            console.log(result);
		});

		buttons.append(openButton);
		buttons.append(saveButton);
		buttons.append(runButton);
		content.append(buttons);

		// Agrega el editor y la consola
		var editorWrapper = $("<div class='editor-wrapper'></div>");
		var editorDiv = $("<div class='editor'></div>");
		editorWrapper.append(editorDiv);
		content.append(editorWrapper);

		var consoleWrapper = $("<div class='console-wrapper'></div>");
		var consoleHeader = $("<h5>Consola</h5>");
		var consoleDiv = $("<div class='console'></div>");
		consoleWrapper.append(consoleHeader);
		consoleWrapper.append(consoleDiv);
		content.append(consoleWrapper);

		// Agrega la nueva pestaña al contenedor de pestañas
		$("#myTabContent").append(content);

		// Selecciona la nueva pestaña
		a.tab("show");

		// Crea el editor en la nueva pestaña
		var newEditor = CodeMirror(editorDiv[0], {
			mode: "javascript",
			lineNumbers: true,
			theme: "material-darker",
			indentUnit: 4,
			indentWithTabs: true
		});

		// Asigna el editor a la variable editor para que sea accesible desde los botones
		editor = newEditor;
	});

	// Selecciona la primera pestaña al cargar la página
	$("#myTab li:first-child a").tab("show");
});