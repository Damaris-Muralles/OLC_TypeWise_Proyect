// Constantes para los tipos de datos.
const TIPO_DATO = {
    INT: 'INT',
    DOUBLE: 'DOUBLE',
    BOOLEAN: 'BOOLEAN',
    CHAR: 'CHAR',
    STRING: 'STRING',

}


/**
 * Función que crea objetos de tipo Símbolo.
 * @param {*} id 
 * @param {*} tipo 
 * @param {*} valor 
 */
function crearSimbolo(id, tipo, valor) {
    return {
        id: id,
        tipo: tipo,
        valor: valor
    }
}


/**
 * Clase que representa una Tabla de Símbolos.
 */
class TS {

    /**
     * El costructor recibe como parámetro los simbolos de la tabla padre.
     * @param {*} simbolos 
     */
    constructor (simbolos) {
        this._simbolos = simbolos;
    }

    /**
     * Función para gregar un nuevo símbolo.
     * Esta función se usa en la sentencia de Declaración.
     * @param {*} id 
     * @param {*} tipo 
     */
    agregar(id, tipo) {
        const nuevoSimbolo = crearSimbolo(id, tipo);
        this._simbolos.push(nuevoSimbolo);
    }

    /**
     * Función para actualizar el valor de un símbolo existente.
     * Esta función se usa en la sentencia de Asignación.
     * @param {*} id 
     * @param {*} valor 
     */
    actualizar(id, valor) { //AQUI VAMOS A VALIDAR TIPOS
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) {
            console.log("a cambiar: ",simbolo)
            console.log("a ----cambiar: ",valor)
            if(simbolo.tipo===valor.tipo||simbolo.tipo===valor.tipo_dato){
                if(simbolo.tipo===TIPO_DATO.INT){
                    if (typeof valor.valor === 'string') {
                        simbolo.valor = parseInt(valor.valor, 10);
                    } else {
                        simbolo.valor = valor.valor;
                    }
                    console.log("cambio",simbolo)
                }else if(simbolo.tipo===TIPO_DATO.DOUBLE){
                    if (typeof valor.valor === 'string') {
                        simbolo.valor = parseFloat(valor.valor).toFixed(1);
                    } else {
                        simbolo.valor = valor.valor;
                    }
                    console.log("cambio",simbolo)
                }else if(simbolo.tipo===TIPO_DATO.BOOLEAN){
                    if (typeof valor.valor === 'string') {
                        simbolo.valor = valor.valor.toLowerCase() === 'true';
                    } else {
                        simbolo.valor = Boolean(valor.valor);
                    }
                    console.log("cambio",simbolo)
                }else if(simbolo.tipo===TIPO_DATO.CHAR){
                    if (typeof valor.valor === 'string' && valor.valor.length > 0) {
                        simbolo.valor = valor.valor.charAt(0);
                    } else {
                        simbolo.valor = valor.valor;
                    }
                    console.log("cambio",simbolo)
                }else if(simbolo.tipo===TIPO_DATO.STRING){
                    if (typeof valor.valor === 'number') {
                        simbolo.valor = valor.valor.toString();
                    } else {
                        simbolo.valor = valor.valor;
                    }
                    console.log("cambio",simbolo)
                }


                
            }else{
                throw 'ERROR DE TIPOS -> variable: ' + id + ' tiene tipo: '+simbolo.tipo +' y el valor a asignar es de tipo: '+valor.tipo;
            }
        }
        else {
            throw 'ERROR: variable: ' + id + ' no ha sido definida';
        }
    }

    /**
     * Función para obtener el valor de un símbolo existente.
     * @param {*} id 
     */
    obtener(id) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];

        if (simbolo) return simbolo; //aqui devolvemos el simbolo completo
        else throw 'ERROR: variable: ' + id + ' no ha sido definida';
    }

    /**
     * Función getter para obtener los símbolos.
     */
    get simbolos() {
        return this._simbolos;
    }
}

// Exportamos las constantes y la clase.

module.exports.TIPO_DATO = TIPO_DATO;
module.exports.TS = TS;