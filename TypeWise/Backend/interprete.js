var fs = require('fs'); 
var parser = require('./gramatica');

// Constantes para operaciones, instrucciones y valores
const TIPO_INSTRUCCION = require('./instrucciones').TIPO_INSTRUCCION;
const TIPO_OPERACION = require('./instrucciones').TIPO_OPERACION;
const TIPO_VALOR = require('./instrucciones').TIPO_VALOR;
const instruccionesAPI = require('./instrucciones').instruccionesAPI;
const TIPO_OPCION_SWITCH = require('./instrucciones').TIPO_OPCION_SWITCH;

// Tabla de Simbolos
const TIPO_DATO = require('./tabla_simbolos').TIPO_DATO;
const TS = require('./tabla_simbolos').TS;

let ast;
try {
    // leemos nuestro archivo de entrada
    const entrada = fs.readFileSync('./entrada.txt');
    // invocamos a nuestro parser con el contendio del archivo de entradas
    ast = parser.parse(entrada.toString());

    // imrimimos en un archivo el contendio del AST en formato JSON
    fs.writeFileSync('./ast.json', JSON.stringify(ast, null, 2));
} catch (e) {
    console.error(e);
    return;
}

// Creación de una tabla de simbolos GLOBAL para iniciar con el interprete
const tsGlobal = new TS([]);

// Procesamos las instrucciones reconocidas en nuestro AST
procesarBloque(ast, tsGlobal);


/**
 * Este es el método principal. Se encarga de recorrer las instrucciones en un bloque,
 * identificarlas y procesarlas
 * @param {*} instrucciones 
 * @param {*} tablaDeSimbolos 
 */
function procesarBloque(instrucciones, tablaDeSimbolos) {
    instrucciones.forEach(instruccion => {
   
        if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION) {
            // Procesando Instrucción Declaración
           
            procesarDeclaracion(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION_CON_ASIGNACION) {
            // Procesando Instrucción Declaración y asignacion
           
            procesarDecAsig(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.ASIGNACION) {
            // Procesando Instrucción Asignación
            procesarAsignacion(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.ASIGNACION_SIMPLIFICADA) {
            // Procesando Instrucción Asignacion Simplificada
            procesarAsignacionSimplificada(instruccion, tablaDeSimbolos);
        }  else if (instruccion.tipo === TIPO_INSTRUCCION.PRINT) {
            // Procesando Instrucción PRINT
            procesarPRINT(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.WHILE) {
            // Procesando Instrucción WHILE
            procesarWHILE(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo == TIPO_INSTRUCCION.PARA) {
            // Procesando Instrucción Para
            procesarPara(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.IF) {
            // Procesando Instrucción If
            procesarIf(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.IF_ELSE) {
            // Procesando Instrucción If Else
            procesarIfElse(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.SWITCH) {
            // Procesando Instrucción Switch  
            procesarSwitch(instruccion, tablaDeSimbolos);
        } else {
            throw 'ERROR: tipo de instrucción no válido: ' + instruccion;
        }
    });
}


/**
 * Función que se encarga de procesar la instrucción Declaración
 * @param {*} instruccion 
 * @param {*} tablaDeSimbolos 
 */
function procesarDeclaracion(instruccion, tablaDeSimbolos) { //aqui cambiamos para que acepte el tipo_dato de la declaracion
    tablaDeSimbolos.agregar(instruccion.identificador, instruccion.tipo_dato);
    tablaDeSimbolos.actualizar(instruccion.identificador, instruccion);
}
/**
 * Función que se encarga de procesar la instrucción Asignación
 * @param {*} instruccion 
 * @param {*} tablaDeSimbolos 
 */
function procesarDecAsig(instruccion, tablaDeSimbolos) {
    tablaDeSimbolos.agregar(instruccion.identificador, instruccion.tipo_dato);
    console.log("===========decasif: ",instruccion,instruccion.valor)
    const valor = procesarExpresionCadena(instruccion.valor, tablaDeSimbolos); //aqui quiero que retorne: tipo y valor
    console.log("valor ",valor)
    tablaDeSimbolos.actualizar(instruccion.identificador, valor);
}
/**
 * Función que se encarga de procesar la instrucción Asignación
 * @param {*} instruccion 
 * @param {*} tablaDeSimbolos 
 */
function procesarAsignacion(instruccion, tablaDeSimbolos) {
    console.log("===========asug: ",instruccion,instruccion.expresionNumerica)
    const valor = procesarExpresionCadena(instruccion.expresionNumerica, tablaDeSimbolos); //aqui quiero que retorne: tipo y valor
    console.log("valor ",valor)
    tablaDeSimbolos.actualizar(instruccion.identificador, valor);
}
/**
 * De acuerdo con nuestra gramática, aqui, expresión puede ser una operación aritmética binaria (SUMA, RESTA, MULTIPLICACION, DIVISION),
 * una operación aritmética unaria (NEGATIVO) o un valor correspondiente a un INT o a un IDENTIFICADOR
 * @param {*} expresion 
 * @param {TS} tablaDeSimbolos
 * Evaluamos cada caso para resolver a un valor tipo número de acuerdo al tipo de operación.
 */
function procesarExpresionNumerica(expresion, tablaDeSimbolos) {
    
    let tipop=0;
    console.log("eererecd",expresion)
    if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
        // Es un valor negado.
        // En este caso necesitamos procesar el valor del operando para poder negar su valor.
        // Para esto invocamos (recursivamente) esta función para sesolver el valor del operando.
        const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);     // resolvemos el operando
        if ([TIPO_DATO.INT, TIPO_DATO.DOUBLE].includes(valor.tipo)){
                // Retornamos el valor negado.
            const res= valor.valor * -1;
            if  (valor.tipo==TIPO_DATO.DOUBLE){
                return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

            }
            return { valor: res, tipo: TIPO_DATO.INT  };
        }else{
            throw `ERROR: Operacion no valida; no se puede realizar ${expresion.tipo} para ${valor.tipo}`;
        }
        
        
        

    } else if ([TIPO_OPERACION.SUMA,TIPO_OPERACION.RESTA, TIPO_OPERACION.MULTIPLICACION,TIPO_OPERACION.DIVISION,TIPO_OPERACION.POTENCIA,TIPO_OPERACION.MODULO].includes(expresion.tipo)) {

            console.log("=====================================") 
            
        // Es una operación aritmética.
        // En este caso necesitamos procesar los operandos antes de realizar la operación.
        // Para esto incovacmos (recursivamente) esta función para resolver los valores de los operandos.
        let valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        let valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
       


        if (([TIPO_OPERACION.SUMA,TIPO_OPERACION.RESTA].includes(expresion.tipo)) 
        && ([TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR].includes(valorIzq.tipo) && [TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR].includes(valorDer.tipo)
            ||(valorIzq.tipo === TIPO_DATO.STRING)
            ||(valorDer.tipo === TIPO_DATO.STRING))) {
                
                console.log("para suma y resta boolean y char, y su combinacion")
            throw `ERROR: Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`;
        
        }else if (([TIPO_OPERACION.MULTIPLICACION,TIPO_OPERACION.DIVISION].includes(expresion.tipo) )
         && ((valorIzq.tipo === TIPO_DATO.BOOLEAN && [TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR,TIPO_DATO.INT,TIPO_DATO.DOUBLE].includes(valorDer.tipo))
             ||(valorIzq.tipo === TIPO_DATO.CHAR && [TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR].includes(valorDer.tipo))
             ||([TIPO_DATO.INT,TIPO_DATO.DOUBLE].includes(valorIzq.tipo) && valorDer.tipo === TIPO_DATO.BOOLEAN)
             ||(valorIzq.tipo === TIPO_DATO.STRING)
             ||(valorDer.tipo === TIPO_DATO.STRING))){
               
                console.log("para */ boolean y char, y su combinacion")   
           throw `ERROR: Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`;
       
           
        }else if (( [TIPO_OPERACION.POTENCIA,TIPO_OPERACION.MODULO].includes(expresion.tipo)) 
        && ((![TIPO_DATO.INT, TIPO_DATO.DOUBLE].includes(valorIzq.tipo) || ![TIPO_DATO.INT, TIPO_DATO.DOUBLE].includes(valorDer.tipo)))){
                
            console.log("para %^- solo puede ser int y double", valorIzq,valorDer)                                            
                throw `ERROR: Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`;
       
        }else{
            console.log(valorDer,valorIzq)
            if(valorIzq.tipo==TIPO_DATO.BOOLEAN){
                valorIzq=(valorIzq.valor=="true" ? 1 : 0);
                console.log("conver",valorDer)
            }else if(valorIzq.tipo==TIPO_DATO.CHAR){
                valorIzq=valorIzq.valor.charCodeAt(0);
               
            }else if(valorIzq.tipo==TIPO_DATO.DOUBLE){
                valorIzq=parseFloat(valorIzq.valor);
                tipop=1;
            }else{
                valorIzq=valorIzq.valor;
            }

            if(valorDer.tipo==TIPO_DATO.BOOLEAN){
                console.log("conver",valorDer.valor)
                valorDer=(valorDer.valor=="true"  ? 1 : 0);
                console.log(valorDer)
            }else if(valorDer.tipo==TIPO_DATO.CHAR){
                valorDer=valorDer.valor.charCodeAt(0);
                
            }else if(valorDer.tipo==TIPO_DATO.DOUBLE){
                valorDer=parseFloat(valorDer.valor);
                tipop=1;
            }else{
                valorDer=valorDer.valor;
            }
            
        }

        if (expresion.tipo === TIPO_OPERACION.SUMA){
            const res= valorIzq + valorDer;
            console.log("sum",valorIzq , valorDer,valorIzq + valorDer)
            if  (tipop==1){
                return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

            }
            return { valor: res, tipo: TIPO_DATO.INT  };
            
        }
        if (expresion.tipo === TIPO_OPERACION.RESTA) {
            const res= valorIzq - valorDer;
            if  (tipop==1){
                return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

            }
            return { valor: res, tipo: TIPO_DATO.INT  };
        }
        if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const res= valorIzq * valorDer;
            if  (tipop==1){
                return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

            }
            return { valor: res, tipo: TIPO_DATO.INT  };
        }
        if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
            const res= Math.pow(valorIzq, valorDer);
            if  (tipop==1){
                return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

            }
            return { valor: res, tipo: TIPO_DATO.INT  };
        }
        if (expresion.tipo === TIPO_OPERACION.MODULO) {
            const res= valorIzq % valorDer;
            return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE  };
        }
        if (expresion.tipo === TIPO_OPERACION.DIVISION) {
          
            if(valorDer === 0){
                throw 'ERROR: la division entre 0 da como resultado: '+valorIzq/valorDer;
            }else{
                const res= valorIzq / valorDer;
                return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE  };
            }
        };

    } else if (expresion.tipo === TIPO_VALOR.INT) {
        // Es un valor numérico.
        // En este caso únicamente retornamos el valor obtenido por el parser directamente.
        return {valor: expresion.valor, tipo: TIPO_DATO.INT };
    } else if (expresion.tipo === TIPO_VALOR.DOUBLE) {
        // Es un valor numérico.
        // En este caso únicamente retornamos el valor obtenido por el parser directamente.
        return {valor: parseFloat(expresion.valor.toFixed(1)), tipo: TIPO_DATO.DOUBLE };
    } else if (expresion.tipo === TIPO_VALOR.BOOLEAN) {
        // Es un valor numérico.
        // En este caso únicamente retornamos el valor obtenido por el parser directamente.
        console.log( "biii",Boolean(expresion.valor), expresion.valor)
        return {valor: expresion.valor, tipo: TIPO_DATO.BOOLEAN };
    } else if (expresion.tipo === TIPO_VALOR.CARACTER) {
        // Es un valor numérico.
        // En este caso únicamente retornamos el valor obtenido por el parser directamente.
        return {valor: expresion.valor, tipo: TIPO_DATO.CHAR };
    } else  if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
        // Es un identificador.
        // Obtenemos el valor de la tabla de simbolos
        const sym = tablaDeSimbolos.obtener(expresion.valor);
        console.log("iden: ",sym.tipo, sym.valor,)
        return {valor: sym.valor, tipo: sym.tipo};
    } else {
        throw 'ERROR: expresión numérica no válida: ' + expresion;
    }
}

/**
 * De acuerdo con nuestra gramática, aqui, expresión puede ser una operacion CONCATENACION, CADENA o una expresión numérica
 * @param {*} expresion 
 * @param {TS} tablaDeSimbolos
 * Evaluamos cada caso para resolver a un valor tipo cadena de acuerdo al tipo de operación.
 */
function procesarExpresionCadena(expresion, tablaDeSimbolos) {
    
    if (expresion.tipo === TIPO_OPERACION.CONCATENACION) {
        // Es una operación de concatenación.
        // En este caso necesitamos procesar los operandos antes de realizar la concatenación.
        // Para esto invocamos (recursivamente) esta función para resolver los valores de los operandos.
        let cadIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        let cadDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
        // Retornamos el resultado de la operación de concatenación.
        if (cadIzq.tipo==TIPO_DATO.BOOLEAN){
            cadIzq=(cadIzq.valor=="true" ? 1 : 0);
        }else{
            cadIzq=cadIzq.valor;
        }
        if (cadDer.tipo==TIPO_DATO.BOOLEAN){
            cadDer=(cadDer.valor=="true" ? 1 : 0);
        }else{
            cadDer=cadDer.valor;
        }
        
        
        const res=cadIzq + cadDer;
        return {valor: res, tipo: TIPO_DATO.STRING};   

    } else if (expresion.tipo === TIPO_VALOR.CADENA) {
        // Es una cadena.
        // En este caso únicamente retornamos el valor obtenido por el parser directamente.
        return {valor: expresion.valor, tipo: TIPO_DATO.STRING };
    } else {
        // Es una epresión numérica.
        // En este caso invocamos la función que se encarga de procesar las expresiones numéricas
        // y retornamos su valor en cadena.
        console.log("eewer_ ",expresion)
    
        if ([TIPO_VALOR.BOOLEAN,TIPO_OPERACION.SUMA,TIPO_OPERACION.RESTA, TIPO_OPERACION.MULTIPLICACION,TIPO_OPERACION.DIVISION,TIPO_OPERACION.POTENCIA,TIPO_OPERACION.MODULO,TIPO_OPERACION.NEGATIVO].includes(expresion.tipo)){
            return procesarExpresionNumerica(expresion, tablaDeSimbolos);
        }else{
            console.log("lsodf")
            return procesarExpresionLogica(expresion, tablaDeSimbolos,1)
        }
        
    }
}
/**
 * De acuerdo con nuestra gramática, aqui, expresión puede ser una operación relacional MAYOR QUE, MENOR QUE, MAYOR IGUAL QUE, MENOR IGUAL QUE, IGUAL QUE o NO IGUAL QUE
 * @param {*} expresion 
 * @param {TS} tablaDeSimbolos
 * Evaluamos cada caso para resolver a un valor tipo booleando de acuerdo al tipo de operación.
 */
function procesarExpresionRelacional(expresion, tablaDeSimbolos,op) {
    // En este caso necesitamos procesar los operandos antes de realizar la comparación.
    console.log(op)
    console.log("IZ: ",expresion.operandoIzq,"DER", expresion.operandoDer)  
    let valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos); 
   
    let valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);   
   


    console.log("IZ1: ",valorIzq,"DER1", valorDer)      
    if(![TIPO_DATO.INT, TIPO_DATO.DOUBLE,TIPO_DATO.CHAR].includes(valorIzq.tipo) || ![TIPO_DATO.INT, TIPO_DATO.DOUBLE,TIPO_DATO.CHAR].includes(valorDer.tipo)){
       if(valorIzq.tipo==TIPO_DATO.BOOLEAN && valorDer.tipo==TIPO_DATO.BOOLEAN){
            valorIzq=valorIzq.valor;
            valorDer=valorDer.valor;
       } else{
             throw 'ERROR: No se puede jecutar : ' + expresion.tipo+"  entre datos de tipo "+valorIzq.tipo+" y "+valorDer.tipo;
       }
       
    }else{
        valorIzq=valorIzq.valor;
        valorDer=valorDer.valor;
    }

    if (expresion.tipo === TIPO_OPERACION.MAYOR_QUE) {
        console.log(valorIzq , valorDer,valorIzq > valorDer)
        if(op==1){
            console.log("deg")
            return { valor: valorIzq > valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq > valorDer;
    }

    if (expresion.tipo === TIPO_OPERACION.MENOR_QUE) {

        console.log(valorIzq , valorDer,valorIzq < valorDer)
        if(op==1){
            console.log("deg", valorIzq < valorDer)
            return { valor: valorIzq < valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq < valorDer;
    }

    if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL){
        if(op==1){
            return { valor: valorIzq >= valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq >= valorDer;
    }
    if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL){
        if(op===1){
            return { valor: valorIzq <= valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq <= valorDer;
    } 
    if (expresion.tipo === TIPO_OPERACION.DOBLE_IGUAL){
        console.log("sdfsdf1: ",valorIzq, valorDer,valorIzq == valorDer)
        if(op==1){
            console.log("sdfsdf: ",valorIzq, valorDer,valorIzq == valorDer)
            return { valor: valorIzq == valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq == valorDer;
    }
    if (expresion.tipo === TIPO_OPERACION.NO_IGUAL){
        if(op==1){
            return { valor: valorIzq !== valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq !== valorDer;
    }
}

/**
 * De acuerdo con nuestra gramática, aqui, expresión puede ser una operación lógica AND, OR o NOT
 * @param {*} expresion 
 * @param {TS} tablaDeSimbolos
 * Evaluamos cada caso para resolver a un valor tipo booleando de acuerdo al tipo de operación.
 */
function procesarExpresionLogica(expresion, tablaDeSimbolos,op) {
 console.log("1232 ",op, expresion)
 let valorIzq;
 let valorDer;
    if (expresion.tipo === TIPO_OPERACION.AND) { 
        // En este caso necesitamos procesar los operandos para &&.  // resolvemos el operando derecho.
        if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_OPERACION.SUMA,TIPO_OPERACION.RESTA, TIPO_OPERACION.MULTIPLICACION,TIPO_OPERACION.DIVISION,TIPO_OPERACION.POTENCIA,TIPO_OPERACION.MODULO,TIPO_OPERACION.NEGATIVO].includes(expresion.operandoIzq.tipo) ){
            console.log(" q",expresion.operandoIzq)
            valorIzq =  procesarExpresionRelacional(expresion.operandoIzq, tablaDeSimbolos,op);   
        }else{
            valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);   
        }

        if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_OPERACION.SUMA,TIPO_OPERACION.RESTA, TIPO_OPERACION.MULTIPLICACION,TIPO_OPERACION.DIVISION,TIPO_OPERACION.POTENCIA,TIPO_OPERACION.MODULO,TIPO_OPERACION.NEGATIVO].includes(expresion.operandoDer.tipo) ){
            console.log(" q",expresion.operandoDer)
            valorDer =  procesarExpresionRelacional(expresion.operandoDer, tablaDeSimbolos,op);   
        }else{
            valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);   
        }    
       try {
        valorDer=valorDer.valor;
        valorIzq=valorIzq.valor;
       } catch (error) {
        console.log("sdfaqui11",valorDer,valorIzq)
       }
        if(op==1){
            return { valor: valorIzq && valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq && valorDer;
    }
    if (expresion.tipo === TIPO_OPERACION.OR) { 
        // En este caso necesitamos procesar los operandos para ||.
        console.log("123 ",op, expresion)
        if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_OPERACION.SUMA,TIPO_OPERACION.RESTA, TIPO_OPERACION.MULTIPLICACION,TIPO_OPERACION.DIVISION,TIPO_OPERACION.POTENCIA,TIPO_OPERACION.MODULO,TIPO_OPERACION.NEGATIVO].includes(expresion.operandoIzq.tipo) ){
            console.log(" q",expresion.operandoIzq)
            valorIzq =  procesarExpresionRelacional(expresion.operandoIzq, tablaDeSimbolos,op);   
        }else{
            valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);   
        }

        if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_OPERACION.SUMA,TIPO_OPERACION.RESTA, TIPO_OPERACION.MULTIPLICACION,TIPO_OPERACION.DIVISION,TIPO_OPERACION.POTENCIA,TIPO_OPERACION.MODULO,TIPO_OPERACION.NEGATIVO].includes(expresion.operandoDer.tipo) ){
            console.log(" q",expresion.operandoDer)
            valorDer =  procesarExpresionRelacional(expresion.operandoDer, tablaDeSimbolos,op);   
        }else{
            valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);   
        }    
       try {
        valorDer=valorDer.valor;
        valorIzq=valorIzq.valor;
       } catch (error) {
        console.log("sdfaqui11",valorDer,valorIzq)
       }
           // resolvemos el operando izquierdo.
         // resolvemos el operando derecho.
       
        if(op==1){
            console.log("sdfaqui",valorDer,valorIzq)
            return { valor: valorIzq || valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq || valorDer;
    }
    if (expresion.tipo === TIPO_OPERACION.NOT) { 
        // En este caso necesitamos procesar solamente un operando para !.
        let valor ;
        if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_OPERACION.SUMA,TIPO_OPERACION.RESTA, TIPO_OPERACION.MULTIPLICACION,TIPO_OPERACION.DIVISION,TIPO_OPERACION.POTENCIA,TIPO_OPERACION.MODULO,TIPO_OPERACION.NEGATIVO].includes(expresion.operandoIzq.tipo) ){
            console.log(" q",expresion.operandoIzq)
            valor =  procesarExpresionRelacional(expresion.operandoIzq, tablaDeSimbolos,op);   
        }else{
            valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);   
        }

       try {
        valor=valor.valor;
       } catch (error) {
        console.log("sdfaqui11",valor)
       }
        if(op==1){
            return { valor: !valor, tipo: TIPO_DATO.BOOLEAN };
        }
        return !valor;
    }
    console.log("va para relacional", op)
    return procesarExpresionRelacional(expresion, tablaDeSimbolos,op);
}


/**
 * Función que se encarga de procesar la instrucción PRINT
 * @param {*} instruccion 
 * @param {*} tablaDeSimbolos 
 */
function procesarPRINT(instruccion, tablaDeSimbolos) {
    const cadena = procesarExpresionCadena(instruccion.expresionCadena, tablaDeSimbolos).valor;
    console.log('> ' + cadena);
}




/**
 * Función que se encarga de procesar la instrucción WHILE
 */
function procesarWHILE(instruccion, tablaDeSimbolos) {
    while (procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos)) {
        const tsWHILE = new TS(tablaDeSimbolos.simbolos);
        procesarBloque(instruccion.instrucciones, tsWHILE);
    }
}

/**
 * Función que se encarga de procesar la instrucción Para
 */
function procesarPara(instruccion, tablaDeSimbolos) {
    const valor = procesarExpresionCadena(instruccion.valorVariable, tablaDeSimbolos); //aqui quiero que retorne: tipo y valor
    tablaDeSimbolos.actualizar(instruccion.variable, valor);
    for (var i = tablaDeSimbolos.obtener(instruccion.variable); procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos);
        tablaDeSimbolos.actualizar(instruccion.variable, {valor: tablaDeSimbolos.obtener(instruccion.variable).valor + 1, tipo: TIPO_DATO.INT})) {
        const tsPara = new TS(tablaDeSimbolos.simbolos);
        procesarBloque(instruccion.instrucciones, tsPara);
    }
}

/**
 * Función que se encarga de procesar la instrucción If
 */
function procesarIf(instruccion, tablaDeSimbolos) {
    const valorCondicion = procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos);

    if (valorCondicion) {
        const tsIf = new TS(tablaDeSimbolos.simbolos);
        procesarBloque(instruccion.instrucciones, tsIf);
    }
}

/**
 * Función que se encarga de procesar la instrucción If-Else
 * @param {*} instruccion 
 * @param {*} tablaDeSimbolos 
 */
function procesarIfElse(instruccion, tablaDeSimbolos) {
    const valorCondicion = procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos);

    if (valorCondicion) {
        const tsIf = new TS(tablaDeSimbolos.simbolos);
        procesarBloque(instruccion.instruccionesIfVerdadero, tsIf);
    } else {
        const tsElse = new TS(tablaDeSimbolos.simbolos);
        procesarBloque(instruccion.instruccionesIfFalso, tsElse);
    }
}
  
/**
 * Función que se encarga de procesar la instrucción Switch
 * @param {*} instruccion 
 * @param {*} tablaDeSimbolos 
 */
function procesarSwitch(instruccion, tablaDeSimbolos) {
    var evaluar = true;
    const valorExpresion = procesarExpresionNumerica(instruccion.expresionNumerica, tablaDeSimbolos);
    const tsSwitch = new TS(tablaDeSimbolos.simbolos);

    instruccion.casos.forEach(caso => {
        if (caso.tipo == TIPO_OPCION_SWITCH.CASO){
            const valorExpCase= procesarExpresionNumerica(caso.expresionNumerica, tsSwitch);
            if (valorExpCase == valorExpresion){
                procesarBloque(caso.instrucciones, tsSwitch);
                evaluar = false;
            }
        }
        else{
            if (evaluar)
                procesarBloque(caso.instrucciones, tsSwitch);
        }
    });
}

  
/**
 * Función que se encarga de procesar la instrucción Asignación Simplificada
 Se crea un objeto tipo nuevaOperacionBinaria (expresion):
  opIzq      -> Valor almacenado del identificador
  opDer      -> Valor de entrada
  TIPO_VALOR -> Se define por el tipo de operador (+,-,*,/)
 * @param {*} instruccion
 * @param {*} tablaDeSimbolos 
 */
function procesarAsignacionSimplificada(instruccion, tablaDeSimbolos) {
    const expresion =instruccionesAPI.nuevoOperacionBinaria(instruccionesAPI.nuevoValor(instruccion.identificador, TIPO_VALOR.IDENTIFICADOR),instruccion.expresionNumerica, instruccion.operador);
    const valor = procesarExpresionNumerica(expresion, tablaDeSimbolos);

    tablaDeSimbolos.actualizar(instruccion.identificador, valor);
 }