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
        valor: valor,
    }
}

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
            let nuevoSimbolo = crearSimbolo(id, tipo,tipodato,entorno,linea,columna);
            if (["LISTA","VECTOR"].includes(tipo)){
                nuevoSimbolo.valor=[];
            }
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

            if(simbolo.tipo===valor.tipo||simbolo.tipo===valor.tipo_dato){
                if(simbolo.tipo===TIPO_DATO.INT){
                    if (typeof valor.valor === 'string') {
                        simbolo.valor = parseInt(valor.valor, 10);
                    } else {
                        simbolo.valor = valor.valor;
                    }
                }else if(simbolo.tipo===TIPO_DATO.DOUBLE){
                    if (typeof valor.valor === 'string') {
                        simbolo.valor = parseFloat(valor.valor).toFixed(1);
                    } else {
                        simbolo.valor = valor.valor;
                    }
                }else if(simbolo.tipo===TIPO_DATO.BOOLEAN){
                    if (typeof valor.valor === 'string') {
                        simbolo.valor = valor.valor.toLowerCase() === 'true';
                    } else {
                        simbolo.valor = Boolean(valor.valor);
                    }
                }else if(simbolo.tipo===TIPO_DATO.CHAR){
                    if (typeof valor.valor === 'string' && valor.valor.length > 0) {
                        simbolo.valor = valor.valor.charAt(0);
                    } else {
                        simbolo.valor = valor.valor;
                    }
                }else if(simbolo.tipo===TIPO_DATO.STRING){
                    if (typeof valor.valor === 'number') {
                        simbolo.valor = valor.valor.toString();
                    } else {
                        simbolo.valor = valor.valor;
                    }
                }else if(simbolo.tipo==='METODO'){
                    
                        simbolo.valor = valor.valor;
                    
                }else if(simbolo.tipo==='FUNCION'){
                    
                    simbolo.valor = valor.valor;
                }else if(simbolo.tipo==='VECTOR'){
                    if (valor.op=="a"){
                        if (simbolo.valor.length==0){
                            simbolo.valor.push(...valor.valor);
                        }else{
                            tsrepetidos.push({tipo:"Semantico",descripcion:'Vector: ' + id + ' ya fue asignado ',lineaerror:linea,columnaerror:columna});
                        }
                    
                    }else if (valor.op!="a"){
                        if (valor.valor.tipo==simbolo.tipodato){
                            if (valor.op<0){
                                tsrepetidos.push({tipo:"Semantico",descripcion:'Se ha intentado modificar un índice ilegal para el vector ' + id ,lineaerror:linea,columnaerror:columna});
                            }else if(valor.op>simbolo.valor.length-1){
                                
                                tsrepetidos.push({tipo:"Semantico",descripcion:'Se ha intentado modificar a un índice ilegal para el vector ' + id ,lineaerror:linea,columnaerror:columna});
                            }else{
                                simbolo.valor[valor.op]=valor.valor;
                            }
                        }else{
                            tsrepetidos.push({tipo:"Semantico",descripcion:'Vector: ' + id + ' tiene tipo: '+simbolo.tipodato +' y el valor a asignar es de tipo: '+valor.valor.tipo,lineaerror:linea,columnaerror:columna});
                        }
                       
                       
                    }
                   
                }else if(simbolo.tipo==='LISTA'){
                    if (valor.op=="a"){
                        if (simbolo.tipodato==valor.valor.tipo){
                            simbolo.valor.push(valor.valor);
                        }else{
                            
                            tsrepetidos.push({tipo:"Semantico",descripcion:'Lista: ' + id + ' tiene tipo: '+simbolo.tipodato +' y el valor a asignar es de tipo: '+valor.valor.tipo,lineaerror:linea,columnaerror:columna});
                        }
                    }else if (valor.op!="a"){
                        if (valor.valor.tipo==simbolo.tipodato){
                            if (valor.op<0){
                                tsrepetidos.push({tipo:"Semantico",descripcion:'Se ha intentado modificar a un índice ilegal para la lista ' + id ,lineaerror:linea,columnaerror:columna});
                            }else if(valor.op>simbolo.valor.length-1){
                                tsrepetidos.push({tipo:"Semantico",descripcion:'Se ha intentado modificar a un índice ilegal para la lista ' + id ,lineaerror:linea,columnaerror:columna});
                            }else{
                                simbolo.valor[valor.op]=valor.valor;
                            }
                           
                        }else{
                            tsrepetidos.push({tipo:"Semantico",descripcion:'Lista: ' + id + ' tiene tipo: '+simbolo.tipodato +' y el valor a asignar es de tipo: '+valor.valor.tipo,lineaerror:linea,columnaerror:columna});
                        }
                    }
                }
            }else{
                tsrepetidos.push({tipo:"Semantico",descripcion:'variable: ' + id + ' tiene tipo: '+simbolo.tipo +' y el valor a asignar es de tipo: '+valor.tipo,lineaerror:linea,columnaerror:columna});
             }
        } else if (this.padre) {
            this.padre.actualizar(id, valor, linea, columna);
        } else {
            // manejar el caso en que el símbolo no se encuentra en ningún ámbito
            tsrepetidos.push({tipo:"Semantico",descripcion:'variable: ' + id + ' no ha sido definida',lineaerror:linea,columnaerror:columna});
         }
        return tsrepetidos;
    }
  
    obtener(id, linea, columna) {
        
        let tsrepetidos=[];
        let variable = this._simbolos.filter(simbolo => simbolo.id === id)[0];
         // Si no se encuentra la variable en la tabla de símbolos local
        if (!variable && this.padre) {
            // Buscar la variable en la tabla de símbolos padre
               variable = this.padre.obtener(id, linea, columna);
        }
        if(!variable&& this.padre==null){
            
            tsrepetidos.push({tipo:"Semantico",descripcion:'variable: ' + id + ' no ha sido definida',lineaerror:linea,columnaerror:columna});
                return tsrepetidos;
        }
        return variable;
    }
    get simbolos() {
        return this._simbolos;
    }
}