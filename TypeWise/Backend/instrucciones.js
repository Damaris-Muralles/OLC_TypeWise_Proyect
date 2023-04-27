
// Constantes para los tipos de 'valores' expresiones que reconoce nuestra gramática.
const TIPO_VALOR = {
	INT:        	'VAL_INT',
	DOUBLE:        	'VAL_DOUBLE',
	BOOLEAN:        'VAL_BOOLEAN',
	CARACTER:       'VAL_CHAR',
	IDENTIFICADOR:  'VAL_IDENTIFICADOR',
	CADENA:         'VAL_STRING',
}

// Constantes para los tipos de 'operaciones', expresiones que soporta nuestra gramática.
const TIPO_EXPRESION = {
	SUMA:           'OP_SUMA',
	RESTA:          'OP_RESTA',
	MULTIPLICACION: 'OP_MULTIPLICACION',
	DIVISION:       'OP_DIVISION',
	NEGATIVO:       'OP_NEGATIVO',
	POTENCIA:       'OP_POTENCIA',
	MODULO:       	'OP_MODULO',


	MAYOR_QUE:      'RELACIONAL_MAYOR_QUE',
	MENOR_QUE:      'RELACIONAL_MENOR_QUE',
	MAYOR_IGUAL: 	'RELACIONAL_MAYOR_IGUAL',
	MENOR_IGUAL:    'RELACIONAL_MENOR_IGUAL',
	DOBLE_IGUAL:    'RELACIONAL_DOBLE_IGUAL',
	NO_IGUAL:    	'RELACIONAL_NO_IGUAL',

	AND:  			'LOGICO_AND',
	OR: 			'LOGICO_OR',
	NOT:   			'LOGICO_NOT',  	
	
	CONCATENACION:  'OP_CONCATENACION',
	TERNARIO:		'OP_TERNARIO',
	LLAMADA: 		'LLAMADA',
	RETORNO:		'RETURN'
};

// Constantes para los tipos de 'instrucciones' válidas en nuestra gramática.
const TIPO_INSTRUCCION = {
	PRINT:			'INSTR_PRINT',
	DECLARACION:	'INSTR_DECLARACION',
	ASIGNACION:		'INSTR_ASIGNACION',
	DECLARACION_CON_ASIGNACION:	'INSTR_DECLARACION_CON_ASIGNACION',
	IF:				'INSTR_IF',
	IF_ELSE:		'INSTR_ELSE',
	SWITCH:			'INST_SWITCH',
	SWITCH_OP:		'SWITCH_OP',
	SWITCH_DEF:		'SWITCH_DEF',
	PRINCIPAL: 		'SENTENCIA_MAIN',
	METODOS:        'METODO',
	FUNCIONES:      'FUNCION',
	BREAK:      	'INST_BREAK',
	PARA: 			'INST_PARA',
	WHILE:			'INSTR_WHILE',//no
	DOWHILE:			'INSTR_DO_WHILE',//no
	AUMENTOS:		'INSTR_AUMENTO_DECREMENTO',
	ASIGNACION_SIMPLIFICADA: 'ASIGNACION_SIMPLIFICADA' //no

}

// Constantes para los tipos de OPCION_SWITCH validas en la gramática
const TIPO_OPCION_SWITCH = { 
	CASO: 			'CASO',
	DEFECTO: 		'DEFECTO'
} 

let errores=[];
function nuevaOperacion(operandoIzq, operandoDer, tipo,linea,columna) {
	return {
		operandoIzq: operandoIzq,
		operandoDer: operandoDer,
		tipo: tipo,
		linea:linea,
		columna: columna
	}
}


/**
 * El objetivo de esta API es proveer las funciones necesarias para la construcción de operaciones e instrucciones.
 */
const instruccionesAPI = {

	

	nuevoValor: function(valor, tipo,linea,columna) {
		return {
			tipo: tipo,
			valor: valor,
			linea:linea,
			columna: columna
		}
	},
	
	nuevoDeclaracion: function(identificador, tipo,esGlobal,linea,columna) {
		console.log("inst_identi: ",identificador,tipo)
		let valorpordefecto={valor:0,tipo_dato:tipo};
		if (tipo=="DOUBLE"){
			valorpordefecto={valor:parseFloat(0.0),tipo_dato:tipo};
		}else if(tipo=="BOOLEAN"){
			valorpordefecto={valor:true,tipo_dato:tipo};
		}else if(tipo=="CHAR"){
			valorpordefecto={valor:'\u0000',tipo_dato:tipo};
		}else if(tipo=="STRING"){
			valorpordefecto={valor:"",tipo_dato:tipo};
		}
		
		return {
			tipo: TIPO_INSTRUCCION.DECLARACION,
			identificador: identificador,
			tipo_dato: tipo,
			valor: valorpordefecto,
			esGlobal: esGlobal,
			linea:linea,
			columna: columna
		}
	},
	
	nuevoDecAsig: function(identificador, tipo,  expresionNumerica,esGlobal,linea,columna) {

		return {
			tipo: TIPO_INSTRUCCION.DECLARACION_CON_ASIGNACION,
			identificador: identificador,
			tipo_dato: tipo,
			valor: expresionNumerica,
			esGlobal: esGlobal,
			linea:linea,
			columna: columna
		}

	},

	nuevoAsignacion: function(identificador, expresionNumerica,linea,columna) {
		
		return {
			tipo: TIPO_INSTRUCCION.ASIGNACION,
			identificador: identificador,
			expresionNumerica: expresionNumerica,
			linea:linea,
			columna: columna
		}
	},
	
	nuevoMain: function(funcion,linea,columna) {
		return {
			tipo: TIPO_INSTRUCCION.PRINCIPAL,
			id: "main",
			run: funcion,
			linea:linea,
			columna: columna
		}
	},

	nuevaFuncion: function(funcion,parametro,instruccion,tipo,tipodato,linea,columna) {
		let tipofuncion= TIPO_INSTRUCCION.METODOS;
		if(tipo=='FUNCION'){
			tipofuncion= TIPO_INSTRUCCION.FUNCIONES;
		}
		return {
			tipo: tipofuncion,
			tipodato: tipodato,
			id: funcion,
			parametros: parametro,
			instrucciones: instruccion,
			linea:linea,
			columna: columna
		}
	},

	nuevoLlamadaFuncion: function(identificador, argumentos,linea,columna) {
		return {
			tipo: TIPO_EXPRESION.LLAMADA,
			identificador: identificador,
			argumentos: argumentos,
			linea:linea,
			columna: columna
		}
	},

	nuevoOperacionBinaria: function(operandoIzq, operandoDer, tipo,linea,columna) {
		console.log("inst_operaciones; ",operandoIzq,operandoDer)
		return nuevaOperacion(operandoIzq, operandoDer, tipo,linea,columna);
	},
 
	nuevoOperacionUnaria: function(operando, tipo,linea,columna) {
		return nuevaOperacion(operando, undefined, tipo,linea,columna);
	},
 
	nuevoPRINT: function(expresionCadena,linea,columna) {
		return {
			tipo: TIPO_INSTRUCCION.PRINT,
			tipodato: "PRINT",
			expresionCadena: expresionCadena,
			linea:linea,
			columna: columna
		};
	},
	
	nuevoIf: function(expresionLogica, instrucciones,linea,columna) {
		return {
			tipo:  TIPO_INSTRUCCION.IF,
			tipodato:"SENTENCIA DE CONTROL",
			expresionLogica: expresionLogica,
			instrucciones: instrucciones,
			linea:linea,
			columna: columna
		}
	},

	nuevoIfElse: function(expresionLogica, instruccionesIfVerdadero, instruccionesIfFalso,linea,columna) {
		return {
			tipo: TIPO_INSTRUCCION.IF_ELSE,
			tipodato:"SENTENCIA DE CONTROL",
			expresionLogica: expresionLogica,
			instruccionesIfVerdadero: instruccionesIfVerdadero,
			instruccionesIfFalso: instruccionesIfFalso,
			linea:linea,
			columna: columna
		}
	},
	
	nuevoSwitch: function(expresionNumerica, casos,linea,columna) {
		return {
			tipo:  TIPO_INSTRUCCION.SWITCH,
			tipodato:"SENTENCIA DE CONTROL",
			expresionNumerica: expresionNumerica,
			casos: casos,
			linea:linea,
			columna: columna
		}
	},
	
	nuevoListaCasos: function (caso) {
		var casos = []; 
		casos.push(caso);
		return casos;
	},

	nuevoCaso: function(expresionNumerica, instrucciones,linea,columna) {
		return {
			tipo: TIPO_OPCION_SWITCH.CASO,
			expresionNumerica: expresionNumerica,
			instrucciones: instrucciones,
			linea:linea,
			columna: columna
		}
	},
	
	nuevoCasoDef: function(instrucciones,linea,columna) {
		return {
			tipo: TIPO_OPCION_SWITCH.DEFECTO,
			instrucciones: instrucciones,
			linea:linea,
			columna: columna
		}
	},

    nuevoBreak() {
		return {
			tipo: TIPO_INSTRUCCION.BREAK
		};
	},
	
	nuevoReturn: function(expresionNumerica, linea,columna) {
		return {
			tipo: "SENTENCIA DE TRANSFERENCIA",
			tipodato:TIPO_EXPRESION.RETORNO,
			expresionNumerica: expresionNumerica,
			linea:linea,
			columna: columna
		}
	},
	nuevoOperacionTernario: function(expresionLogica, instruccionesIfVerdadero, instruccionesIfFalso,linea,columna) {
		return {
			tipo: TIPO_EXPRESION.TERNARIO,
			tipodato: "EXPRESION TERNARIO",
			expresionLogica: expresionLogica,
			instruccionesIfVerdadero: instruccionesIfVerdadero,
			instruccionesIfFalso: instruccionesIfFalso,
			linea:linea,
			columna: columna
		}
	},

	
	nuevoWHILE: function(expresionLogica, instrucciones,linea,columna) {
		return {
			tipo: TIPO_INSTRUCCION.WHILE,
			tipodato:"SENTENCIA CICLICA",
			expresionLogica: expresionLogica,
			instrucciones: instrucciones,
			linea: linea,
			columna: columna
		};
	},
	
	nuevoDOWHILE: function( instrucciones,expresionLogica,linea,columna) {
		return {
			tipo: TIPO_INSTRUCCION.DOWHILE,
			tipodato:"SENTENCIA CICLICA",
			expresionLogica: expresionLogica,
			instrucciones: instrucciones,
			linea: linea,
			columna: columna
		};
	},

	nuevoPara: function (variable,  expresionLogica, aumento, instrucciones,linea,columna) {
		return {
			tipo: TIPO_INSTRUCCION.PARA,
			tipodato:"SENTENCIA CICLICA",
			expresionLogica: expresionLogica,
			instrucciones: instrucciones,
			aumento: aumento,
			variable: variable, 
			linea:linea,
			columna: columna
		}
	},

	nuevoAumDec:function (tipodeinstruccion,identificador,linea,columna) {
		return {
			tipo: TIPO_INSTRUCCION.AUMENTOS,
			tipodato:tipodeinstruccion,
			identificador: identificador,
			linea:linea,
			columna: columna
		}
	},




	nuevoAsignacionSimplificada: function(identificador, operador , expresionNumerica,linea, columna){
		return{
			tipo: TIPO_INSTRUCCION.ASIGNACION_SIMPLIFICADA,
			operador : operador,
			expresionNumerica: expresionNumerica,
			identificador : identificador,
			linea: linea,
			columna: columna

		} 
	},
	



	nuevoOperador: function(operador){
		return operador 
	},

	parseError( yytext, yylloc, yy,tipo) {
		// Agregamos el error a la lista de errores
		errores.push({
			tipo: tipo,
			texto: yy,
			linea: yylloc.first_line,
			columna: yylloc.first_column,
			token: yytext // Guardamos el valor del token que generó el error
		});
	}
}
// Exportamos nuestras constantes y nuestra API

module.exports.TIPO_EXPRESION = TIPO_EXPRESION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
module.exports.errores = errores;
module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;