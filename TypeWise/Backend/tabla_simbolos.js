// Constantes para los tipos de datos.
const TIPO_DATO = {
    INT: 'INT',
    DOUBLE: 'DOUBLE',
    BOOLEAN: 'BOOLEAN',
    CHAR: 'CHAR',
    STRING: 'STRING',

}


function crearSimbolo(id, tipo,tipodato,entorno,linea,columna, valor) {
    return {
        id: id,
        tipo: tipo,
        tipodato: tipodato,
        entorno:entorno,
        linea: linea,
        columna: columna,
        valor: valor
    }
}

/**
 * Clase que representa una Tabla de Símbolos.
 */
class TS {

    constructor (simbolos,padre) {
        this._simbolos = simbolos;
        this.padre = padre;
    }

    esLocal() {
        return this.padre !== null;
    }
   
    agregar(id, tipo, tipodato,entorno,linea,columna) {
        let tsrepetidos=[];
        if (!this.buscar(id)) {
            const nuevoSimbolo = crearSimbolo(id, tipo,tipodato,entorno,linea,columna);
            this._simbolos.push(nuevoSimbolo);
        } else {
            console.error(`Error: el símbolo ${id} ya ha sido declarado`);
            tsrepetidos.push({tipo:"Semantico",descripcion:`El símbolo ${id} ya ha sido declarado`,lineaerror:linea,columnaerror:columna});
        }
        return tsrepetidos;
    }
    buscar(id) {
        let simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) {
            return simbolo;
        } else {
            return null;
        }
    }
    actualizar(id, valor, linea, columna) { 
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        let tsrepetidos=[];

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
                }else if(simbolo.tipo==='METODO'){
                    
                        simbolo.valor = valor.valor;
                    
                    console.log("cambio",simbolo)
                }else if(simbolo.tipo==='FUNCION'){
                    
                    simbolo.valor = valor.valor;
                    console.log("cambio",simbolo)
                }
            }else{
                tsrepetidos.push({tipo:"Semantico",descripcion:'variable: ' + id + ' tiene tipo: '+simbolo.tipo +' y el valor a asignar es de tipo: '+valor.tipo,lineaerror:linea,columnaerror:columna});
                console.log( 'ERROR DE TIPOS -> variable: ' + id + ' tiene tipo: '+simbolo.tipo +' y el valor a asignar es de tipo: '+valor.tipo)
            }
        } else if (this.padre) {
            this.padre.actualizar(id, valor, linea, columna);
        } else {
            // manejar el caso en que el símbolo no se encuentra en ningún ámbito
            tsrepetidos.push({tipo:"Semantico",descripcion:'variable: ' + id + ' no ha sido definida',lineaerror:simbolo.linea,columnaerror:simbolo.columna});
            console.log( 'ERROR: variable: ' + id + ' no ha sido definida');
        }
        return tsrepetidos;
    }

  
    obtener(id, linea, columna) {
        let tsrepetidos=[];
        // Buscar la variable en la tabla de símbolos local
        console.log(id)
        let variable = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        console.log("obteniendo dato ",variable)
        // Si no se encuentra la variable en la tabla de símbolos local
        if (!variable && this.padre) {
            // Buscar la variable en la tabla de símbolos padre
            console.log("obtener padre")
            variable = this.padre.obtener(id, linea, columna);
        }
        if(!variable&& this.padre==null){
            console.log("es en obtener")
           
            tsrepetidos.push({tipo:"Semantico",descripcion:'variable: ' + id + ' no ha sido definida',lineaerror:linea,columnaerror:columna});
            console.log( 'ERROR: variable: ' + id + ' no ha sido definida')
            return tsrepetidos;
        }
        return variable;
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