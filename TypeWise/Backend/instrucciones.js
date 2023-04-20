
// Constantes para los tipos de 'valores' que reconoce nuestra gramática.
const TIPO_VALOR = {
	INT:        	'VAL_INT',
	DOUBLE:        	'VAL_DOUBLE',
	BOOLEAN:        'VAL_BOOLEAN',
	CARACTER:       'VAL_CHAR',
	IDENTIFICADOR:  'VAL_IDENTIFICADOR',
	CADENA:         'VAL_CADENA',
}

// Constantes para los tipos de 'operaciones' que soporta nuestra gramática.
const TIPO_OPERACION = {
	SUMA:           'OP_SUMA',
	RESTA:          'OP_RESTA',
	MULTIPLICACION: 'OP_MULTIPLICACION',
	DIVISION:       'OP_DIVISION',
	NEGATIVO:       'OP_NEGATIVO',
	POTENCIA:       'OP_POTENCIA',
	MODULO:       	'OP_MODULO',

	MAYOR_QUE:      'OP_MAYOR_QUE',
	MENOR_QUE:      'OP_MENOR_QUE',
	MAYOR_IGUAL: 	'OP_MAYOR_IGUAL',
	MENOR_IGUAL:    'OP_MENOR_IGUAL',
	DOBLE_IGUAL:    'OP_DOBLE_IGUAL',
	NO_IGUAL:    	'OP_NO_IGUAL',

	AND:  			'OP_AND',
	OR: 			'OP_OR',
	NOT:   			'OP_NOT',  	

	CONCATENACION:  'OP_CONCATENACION'
};

// Constantes para los tipos de 'instrucciones' válidas en nuestra gramática.
const TIPO_INSTRUCCION = {
	PRINT:			'INSTR_PRINT',
	WHILE:			'INSTR_WHILE',
	DECLARACION:	'INSTR_DECLARACION',
	ASIGNACION:		'INSTR_ASIGANCION',
	DECLARACION_CON_ASIGNACION:	'INSTR_DECLARACION_CON_ASIGNACION',
	IF:				'INSTR_IF',
	IF_ELSE:		'INSTR_ELSE',
	PARA: 			'INST_PARA',
	SWITCH:			'SWITCH',
	SWITCH_OP:		'SWITCH_OP',
	SWITCH_DEF:		'SWITCH_DEF',
	ASIGNACION_SIMPLIFICADA: 'ASIGNACION_SIMPLIFICADA'
}

// Constantes para los tipos de OPCION_SWITCH validas en la gramática
const TIPO_OPCION_SWITCH = { 
	CASO: 			'CASO',
	DEFECTO: 		'DEFECTO'
} 

/**
 * Esta función se encarga de crear objetos tipo Operación.
 * Recibe como parámetros el operando izquierdo y el operando derecho.
 * También recibe como parámetro el tipo del operador
 * @param {*} operandoIzq 
 * @param {*} operandoDer 
 * @param {*} tipo 
 */
function nuevaOperacion(operandoIzq, operandoDer, tipo) {
	return {
		operandoIzq: operandoIzq,
		operandoDer: operandoDer,
		tipo: tipo
	}
}


/**
 * El objetivo de esta API es proveer las funciones necesarias para la construcción de operaciones e instrucciones.
 */
const instruccionesAPI = {

	

	/**
	 * Crea un nuevo objeto tipo Valor, esto puede ser una cadena, un identificador,etc
	 * @param {*} valor 
	 * @param {*} tipo 
	 */
	nuevoValor: function(valor, tipo) {
		return {
			tipo: tipo,
			valor: valor
		}
	},
	

	/**
	 * Crea un objeto tipo Instrucción para la sentencia Declaración.
	 * @param {*} identificador 
	 */
	nuevoDeclaracion: function(identificador, tipo) {
		console.log(" identi:",identificador,tipo)
		let valorpordefecto=0;
		if (tipo=="DOUBLE"){
			valorpordefecto=parseFloat(0.0);
		}else if(tipo=="BOOLEAN"){
			valorpordefecto="true";
		}else if(tipo=="CHAR"){
			valorpordefecto='\u0000';
		}else if(tipo=="STRING"){
			valorpordefecto="";
		}
		
		return {
			tipo: TIPO_INSTRUCCION.DECLARACION,
			identificador: identificador,
			tipo_dato: tipo,
			valor: valorpordefecto
		}
	},
	/**
	 * Crea un objeto tipo Instrucción para la sentencia Declaración.
	 * @param {*} identificador 
	 * @param {*} expresionNumerica 
	 */
	nuevoDecAsig: function(identificador, tipo,  expresionNumerica, d) {
		console.log("decrerwer: ",d)
		return {
			tipo: TIPO_INSTRUCCION.DECLARACION_CON_ASIGNACION,
			identificador: identificador,
			tipo_dato: tipo,
			valor: expresionNumerica
		}

	},
	/**
	 * Crea un objeto tipo Instrucción para la sentencia Asignación.
	 * @param {*} identificador 
	 * @param {*} expresionNumerica 
	 */
	nuevoAsignacion: function(identificador, expresionNumerica) {
		console.log(expresionNumerica)
		return {
			tipo: TIPO_INSTRUCCION.ASIGNACION,
			identificador: identificador,
			expresionNumerica: expresionNumerica
		}
	},
	
	/**
	* Crea un nuevo objeto tipo Operación para las operaciones binarias válidas.
	* @param {*} operandoIzq 
	* @param {*} operandoDer 
	* @param {*} tipo 
	*/
	nuevoOperacionBinaria: function(operandoIzq, operandoDer, tipo) {
		console.log("operaciones; ",operandoIzq,operandoDer)
		return nuevaOperacion(operandoIzq, operandoDer, tipo);
	},
 
	/**
	 * Crea un nuevo objeto tipo Operación para las operaciones unarias válidas
	 * @param {*} operando 
	 * @param {*} tipo 
	 */
	nuevoOperacionUnaria: function(operando, tipo) {
		return nuevaOperacion(operando, undefined, tipo);
	},
 
 
	/**
	 * Crea un objeto tipo Instrucción para la sentencia Asignacion con Operador
	 * @param {*} identificador 
	 * @param {*} operador 
	 * @param {*} expresionCadena 
	 */
	nuevoAsignacionSimplificada: function(identificador, operador , expresionNumerica){
		return{
			tipo: TIPO_INSTRUCCION.ASIGNACION_SIMPLIFICADA,
			operador : operador,
			expresionNumerica: expresionNumerica,
			identificador : identificador
		} 
	},
	/**
	 * Crea un objeto tipo Instrucción para la sentencia PRINT.
	 * @param {*} expresionCadena 
	 */
	nuevoPRINT: function(expresionCadena) {
		return {
			tipo: TIPO_INSTRUCCION.PRINT,
			expresionCadena: expresionCadena
		};
	},

	/**
	 * Crea un objeto tipo Instrucción para la sentencia WHILE.
	 * @param {*} expresionLogica 
	 * @param {*} instrucciones 
	 */
	nuevoWHILE: function(expresionLogica, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.WHILE,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones
		};
	},

	/**
	 * Crea un objeto tipo instrucción para la sentencia Para.
	 * @param {*} expresionLogica
	 * @param {*} instrucciones
	 * @param {*} aumento
	 * @param {*} decremento
	 */
	nuevoPara: function (variable, valorVariable, expresionLogica, aumento, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.PARA,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones,
			aumento: aumento,
			variable: variable,
			valorVariable: valorVariable
		}
	},
	/**
	 * Crea un objeto tipo Instrucción para la sentencia If.
	 * @param {*} expresionLogica 
	 * @param {*} instrucciones 
	 */
	nuevoIf: function(expresionLogica, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.IF,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones
		}
	},

	/**
	 * Crea un objeto tipo Instrucción para la sentencia If-Else.
	 * @param {*} expresionLogica 
	 * @param {*} instruccionesIfVerdadero 
	 * @param {*} instruccionesIfFalso 
	 */
	nuevoIfElse: function(expresionLogica, instruccionesIfVerdadero, instruccionesIfFalso) {
		return {
			tipo: TIPO_INSTRUCCION.IF_ELSE,
			expresionLogica: expresionLogica,
			instruccionesIfVerdadero: instruccionesIfVerdadero,
			instruccionesIfFalso: instruccionesIfFalso
		}
	},
  
	/**
	 * Crea un objeto tipo Instrucción para la sentencia Switch.
	 * @param {*} expresionNumerica 
	 * @param {*} instrucciones 
	 */
	nuevoSwitch: function(expresionNumerica, casos) {
		return {
			tipo: TIPO_INSTRUCCION.SWITCH,
			expresionNumerica: expresionNumerica,
			casos: casos
		}
	},

	/**
	 * Crea una lista de casos para la sentencia Switch.
	 * @param {*} caso 
	 */
	nuevoListaCasos: function (caso) {
		var casos = []; 
		casos.push(caso);
		return casos;
	},

	/**
	 * Crea un objeto tipo OPCION_SWITCH para una CASO de la sentencia switch.
	 * @param {*} expresionNumerica 
	 * @param {*} instrucciones 
	 */
	nuevoCaso: function(expresionNumerica, instrucciones) {
		return {
			tipo: TIPO_OPCION_SWITCH.CASO,
			expresionNumerica: expresionNumerica,
			instrucciones: instrucciones
		}
	},
	/**
	 * Crea un objeto tipo OPCION_SWITCH para un CASO DEFECTO de la sentencia switch.
	 * @param {*} instrucciones 
	 */
	nuevoCasoDef: function(instrucciones) {
		return {
			tipo: TIPO_OPCION_SWITCH.DEFECTO,
			instrucciones: instrucciones
		}
	},
    
	/**
	* Crea un objeto tipo Operador (+ , - , / , *) 
	* @param {*} operador 
	*/
	nuevoOperador: function(operador){
		return operador 
	}
}
// Exportamos nuestras constantes y nuestra API

module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;