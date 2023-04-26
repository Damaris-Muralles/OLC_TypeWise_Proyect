var fs = require('fs'); 
var parser = require('./gramatica');

// Constantes para operaciones, instrucciones y valores
const TIPO_INSTRUCCION = require('./instrucciones').TIPO_INSTRUCCION;
const TIPO_EXPRESION = require('./instrucciones').TIPO_EXPRESION;
const TIPO_VALOR = require('./instrucciones').TIPO_VALOR;
const instruccionesAPI = require('./instrucciones').instruccionesAPI;
const TIPO_OPCION_SWITCH = require('./instrucciones').TIPO_OPCION_SWITCH;
const errores = require('./instrucciones').errores;
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


// Crear una tabla de símbolos para el ámbito global
const tsGlobal = new TS([], null);
let erroreslist=[];
let entorno="Global";
let tsReporte = [];
let tipofuncion=null;
if (errores.length>0){
 console.log("si funciona errores: ")
}else{
// Procesamos las instrucciones reconocidas en nuestro AST
procesarInstrucionesGlobales(ast, tsGlobal);
}



function procesarInstrucionesGlobales(instrucciones, tablaDeSimbolos) {
     // procesamos las funciones globales
     instrucciones.forEach(instruccion => {
        if (erroreslist.length==0){
            if (instruccion.tipo === TIPO_INSTRUCCION.FUNCIONES) {
                console.log("busqueda 1")
                procesarDeclaracionFuncion(instruccion, tablaDeSimbolos);
            } else if (instruccion.tipo === TIPO_INSTRUCCION.METODOS) {
                console.log("busqueda 2")
                procesarDeclaracionFuncion(instruccion, tablaDeSimbolos);
            }
        }
        
    });
   
    // procesamos las declaraciones globales
    instrucciones.forEach(instruccion => {
        if (erroreslist.length==0){
            if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION) {
            
                procesarDeclaracion(instruccion, tablaDeSimbolos);
        
            } else if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION_CON_ASIGNACION) {
        
                procesarDecAsig(instruccion, tablaDeSimbolos);
            }else if (instruccion.tipo === TIPO_INSTRUCCION.ASIGNACION) {
                // Procesando Instrucción Asignación
                procesarAsignacion(instruccion, tablaDeSimbolos);
            }  
        }
    });

    // Luego buscamos y ejecutamos la función main
    if (erroreslist.length==0){
        const mains = instrucciones.filter(instruccion => instruccion.tipo === TIPO_INSTRUCCION.PRINCIPAL);
        if (mains.length > 1) {
            console.error('Error: solo puede haber una función main');
            erroreslist.push({tipo:"Semantico",descripcion:'La funcion main solo puede ser definida una vez',lineaerror:mains[0].linea,columnaerror:mains[0].columna});
        } else if (mains.length === 1) {
            const main = mains[0];
            tablaDeSimbolos.agregar(main.run.identificador+" - exec",main.tipo,main.run.tipo,"Global",main.linea,main.columna)
            tsReporte.push(tablaDeSimbolos.obtener(main.run.identificador+" - exec", main.linea,main.columna));
            console.log("puxh")
            procesarFuncion(main.run,tablaDeSimbolos)
            if (erroreslist.length!=0){
                console.log("inmprimeir error fin manin", erroreslist);
            }else{
                
                console.log("funcionsalir: ", main, tsReporte)
            }
        } else {
            console.error('No se encontró la función main');
            erroreslist.push({tipo:"Semantico",descripcion:'La funcion main no se encuentra definida',lineaerror:mains[0].linea,columnaerror:mains[0].columna});
        }
    }else{
        console.log("inmprimeir error", erroreslist);
    }

}

function procesarDeclaracionFuncion(instruccion, tablaDeSimbolos) {
    
    if (erroreslist.length==0){
        console.log(instruccion)
        const nombreFuncion = instruccion.id;
        let res =tablaDeSimbolos.agregar(nombreFuncion, instruccion.tipo,instruccion.tipodato,"Global",instruccion.linea,instruccion.columna);
        if (res.length==0){
            let erroractualizacion=tablaDeSimbolos.actualizar(nombreFuncion,{tipo_dato:instruccion.tipo,valor:{parametros:instruccion.parametros,instrucciones:instruccion.instrucciones}},instruccion.linea,instruccion.columna );
            if (erroractualizacion.length==0){
                tsReporte.push(tablaDeSimbolos.obtener(nombreFuncion, instruccion.linea,instruccion.columna));
                
            }else{
                erroreslist.push(...erroractualizacion);
            }
                
        }else{
            console.log("hay error", res)
            erroreslist.push(...res);
        }
    }
    
}

function procesarFuncion(instruccion, tablaDeSimbolos) {
    if (erroreslist.length==0){

        let datosfuncion=tablaDeSimbolos.obtener(instruccion.identificador,instruccion.linea,instruccion.columna);
        console.log("dsef",datosfuncion)
       
        if((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){
            entorno=datosfuncion.tipo.toUpperCase()+" "+datosfuncion.id.toUpperCase();
        // Procesar las instrucciones dentro de la función utilizando la tabla de símbolos del ámbito de la función
        console.log("entro", datosfuncion.valor.parametros.length>0)
        let coinciden=[];
        const tsFuncion = new TS([], tablaDeSimbolos);

        if (datosfuncion.valor.parametros.length>0){
                console.log("si")
                if(instruccion.argumentos.length==datosfuncion.valor.parametros.length){
                    console.log("si")
                    for (let i = 0; i < instruccion.argumentos.length; i++){
                        console.log("si")
                        let comparando;
                        let parametrodato;
                        if(instruccion.argumentos[i].tipo== TIPO_VALOR.IDENTIFICADOR){

                            parametrodato= tablaDeSimbolos.obtener(instruccion.argumentos[i].valor, instruccion.linea,instruccion.columna);
                            console.log("datosd ",parametrodato.tipo,datosfuncion.valor.parametros[i].tipo)
                            comparando=parametrodato.tipo==datosfuncion.valor.parametros[i].tipo;

                        }else{
                            parametrodato=instruccion.argumentos[i];
                            comparando=instruccion.argumentos[i].tipo.includes(datosfuncion.valor.parametros[i].tipo)
                        }
                        if (!comparando){
                            coinciden.push(instruccion.argumentos[i]);
                        }else{
                            console.log(datosfuncion.valor.parametros[i],datosfuncion.valor.parametros[i].tipo);
                            console.log(datosfuncion.valor.parametros[i].identificador,parametrodato)
                            tsFuncion.agregar(datosfuncion.valor.parametros[i].identificador,datosfuncion.valor.parametros[i].tipo,parametrodato.tipo,entorno,datosfuncion.valor.parametros[i].linea,datosfuncion.valor.parametros[i].columna);
                            tsFuncion.actualizar(datosfuncion.valor.parametros[i].identificador,{tipo:datosfuncion.valor.parametros[i].tipo, valor:parametrodato.valor},instruccion.linea,instruccion.columna);
                        
                            tsReporte.push(tsFuncion.obtener(datosfuncion.valor.parametros[i].identificador,datosfuncion.linea,datosfuncion.columna));
                            
                        }    
                    }    
                }else{   
                    console.error("la funcion necesita parametros");
                    erroreslist.push({tipo:"Semantico",descripcion:'La funcion ' + datosfuncion.id + 'requiere de parametros',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
                }
        }
            
        if (coinciden.length>0){
                console.error("dato no coincide con el tipo de parametro en funcion")
                for (let i = 0; i < coinciden.length; i++){
                    erroreslist.push({tipo:"Semantico",descripcion:'El dato' + coinciden[i].valor + 'no coincide con el tipo de parametres requeridos',lineaerror:coinciden[i].linea,columnaerror:coinciden[i].columna});
                }
            }else{
              
                console.log(datosfuncion)
                tipofuncion=datosfuncion.tipodato;
                let datbloque;
                if(datosfuncion.tipo=="FUNCION"){
                    datbloque=procesarBloque(datosfuncion.valor.instrucciones, tsFuncion,1);
                }else{
                    datbloque=procesarBloque(datosfuncion.valor.instrucciones, tsFuncion,0);
                }
                console.log(datbloque);
                return datbloque.valorReturn;
                
            }


        }else{
            console.error("funcion no definida: ", instruccion.identificador)
            erroreslist.push({tipo:"Semantico",descripcion:'La funcion ' + datosfuncion.id + ' no ha sido definida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
        }
    }
 
}

function procesarBloque(instrucciones, tablaDeSimbolos,fun) {
    let resultado = { encontroBreak: false,  valorReturn: { valor: undefined, tipo: undefined } };
    instrucciones.forEach(instruccion => {
        if (erroreslist.length==0){
            console.log("iiiiiiii",instruccion)
            if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION) {
                // Procesando Instrucción Declaración
               
                procesarDeclaracion(instruccion, tablaDeSimbolos);
            } else if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION_CON_ASIGNACION) {
                // Procesando Instrucción Declaración y asignacion
               
                procesarDecAsig(instruccion, tablaDeSimbolos);
            } else if (instruccion.tipo === TIPO_INSTRUCCION.ASIGNACION) {
                // Procesando Instrucción Asignación
                procesarAsignacion(instruccion, tablaDeSimbolos);
            } else if (instruccion.tipo === TIPO_EXPRESION.LLAMADA) {
                // Procesando Instrucción de metodo
                resultado.valorReturn =procesarFuncion(instruccion,tablaDeSimbolos) 
            } else if (instruccion.tipo === TIPO_INSTRUCCION.PRINT) {
                // Procesando Instrucción Imprimir
                procesarPRINT(instruccion, tablaDeSimbolos);
            } else if (instruccion.tipo === TIPO_INSTRUCCION.IF) {
                // Procesando Instrucción If
                console.log("pra if--------------------------------------")
                procesarIf(instruccion, tablaDeSimbolos,fun);
            } else if (instruccion.tipo === TIPO_INSTRUCCION.IF_ELSE) {
                // Procesando Instrucción If Else
                procesarIfElse(instruccion, tablaDeSimbolos,fun);
            } else if (instruccion.tipo === TIPO_INSTRUCCION.SWITCH) {
                // Procesando Instrucción Switch  
                procesarSwitch(instruccion, tablaDeSimbolos,fun);
            } else if (instruccion.tipo === TIPO_INSTRUCCION.BREAK) {
                resultado.encontroBreak = true;
                return; // Salir del bucle forEach
            } else if ((instruccion.tipodato === TIPO_EXPRESION.RETORNO)&&(fun==1)) {
                // Procesando Instrucción retorno
                console.log("------",instruccion)
                //procesarRetorno(instruccion, tablaDeSimbolos);
                resultado.valorReturn= procesarRetorno(instruccion, tablaDeSimbolos);
                return;
            }else {
                console.log( 'ERROR: tipo de instrucción no válido: ' + instruccion);
                erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion no valida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
            }
        }
        
    });
   
    return resultado;

}





function procesarDeclaracion(instruccion, tablaDeSimbolos) { 
    if (erroreslist.length==0){
        let erroragregar=tablaDeSimbolos.agregar(instruccion.identificador,instruccion.tipo_dato,instruccion.tipo,entorno,instruccion.linea,instruccion.columna);
        
        if (erroragregar.length==0){
            tsReporte.push(tablaDeSimbolos.obtener(instruccion.identificador, instruccion.linea,instruccion.columna));
            let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, instruccion.valor,instruccion.linea,instruccion.columna);       
            if (erroractualizacion.length!=0){
                erroreslist.push(...erroractualizacion);
            }
        }else{
            erroreslist.push(...erroragregar);
        }
    }
}

function procesarDecAsig(instruccion, tablaDeSimbolos) {
    if (erroreslist.length==0){

        console.log("Declaracionasig", instruccion)
        if (instruccion.valor.tipo=="LLAMADA"){
            let datosfuncion=tablaDeSimbolos.obtener(instruccion.valor.identificador,instruccion.linea,instruccion.columna);
            if ((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){
                if (datosfuncion.tipo=="FUNCION"){
                    let erroragregar=tablaDeSimbolos.agregar(instruccion.identificador,instruccion.tipo_dato,instruccion.tipo,entorno,instruccion.linea,instruccion.columna);
                    if (erroragregar.length==0){
                        tsReporte.push(tablaDeSimbolos.obtener(instruccion.identificador, instruccion.linea,instruccion.columna));
                        console.log("===========decasif: ",instruccion,instruccion.valor)
                        const valor = procesarFuncion(instruccion.valor, tablaDeSimbolos); 
                        console.log("valor ",valor)
                        let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, valor,instruccion.linea,instruccion.columna);
                        if (erroractualizacion.length!=0){
                            erroreslist.push(...erroractualizacion);
                        }
                        
                    }else{
                        console.log("sdf");
                        erroreslist.push(...erroragregar);
                    }
                
                    
                }else{
                    erroreslist.push({tipo:"Semantico",descripcion:'No se puede asignar un metodo a variable',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
                }
            }  else{
                console.log("psdfewrkwe")
                erroreslist.push(...datosfuncion)
            }
        }else{
            let erroragregar=tablaDeSimbolos.agregar(instruccion.identificador,instruccion.tipo_dato,instruccion.tipo,entorno,instruccion.linea,instruccion.columna);
            if (erroragregar.length==0){
                tsReporte.push(tablaDeSimbolos.obtener(instruccion.identificador, instruccion.linea,instruccion.columna));
                console.log("===========decasif: ",instruccion,instruccion.valor)
                const valor = procesarExpresionCadena(instruccion.valor, tablaDeSimbolos); //aqui quiero que retorne: tipo y valor
                console.log("valor ",valor)
                let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, valor,instruccion.linea,instruccion.columna);
                if (erroractualizacion.length!=0){
                    erroreslist.push(...erroractualizacion);
                }
                
            }else{
                erroreslist.push(...erroragregar);
            }
        }
    }
}

function procesarAsignacion(instruccion, tablaDeSimbolos) {
    if (erroreslist.length==0){
        console.log("sig", instruccion)
        if (instruccion.expresionNumerica.tipo=="LLAMADA"){
            let datosfuncion=tablaDeSimbolos.obtener(instruccion.expresionNumerica.identificador,instruccion.linea,instruccion.columna);
            console.log(datosfuncion);
            if ((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){
                if (datosfuncion.tipo=="FUNCION"){

                    console.log("===========decasif: ",instruccion,instruccion.expresionNumerica)
                    const valor = procesarFuncion(instruccion.expresionNumerica, tablaDeSimbolos); 
                    console.log("valoytrer ",valor, instruccion)
                    let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, valor,instruccion.linea,instruccion.columna);
                    if (erroractualizacion.length!=0){
                        erroreslist.push(...erroractualizacion);
                    }
                        
                    
                }else{
                    erroreslist.push({tipo:"Semantico",descripcion:'No se puede asignar un metodo a variable',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
                }
            }  else{
                console.log("psdfewrkwe")
                erroreslist.push(...datosfuncion)
            }
                
        }else{
            console.log("===========asug: ",instruccion,instruccion.expresionNumerica)
            // Realizar la asignación

            const valor =procesarExpresionCadena(instruccion.expresionNumerica, tablaDeSimbolos);
            console.log("vkkkalor ",valor);
            let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, valor,instruccion.linea,instruccion.columna);
            if (erroractualizacion.length!=0){
                erroreslist.push(...erroractualizacion);
            }
        }


        
    }
}

function procesarExpresionNumerica(expresion, tablaDeSimbolos) {
    
    if (erroreslist.length==0){
        let tipop=0;
        console.log("eererecd",expresion)
        if (expresion.tipo === TIPO_EXPRESION.NEGATIVO) {
            // Es un valor negado.
            // En este caso necesitamos procesar el valor del operando para poder negar su valor.
            // Para esto invocamos (recursivamente) esta función para sesolver el valor del operando.
            const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);     // resolvemos el operando
            if ([TIPO_DATO.INT, TIPO_DATO.DOUBLE].includes(valor.tipo)){
                    // Retornamos el valor negado.
                const res= valor.erroreslistvalor * -1;
                if  (valor.tipo==TIPO_DATO.DOUBLE){
                    return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

                }
                return { valor: res, tipo: TIPO_DATO.INT  };
            }else{
                throw `ERROR: Operacion no valida; no se puede realizar ${expresion.tipo} para ${valor.tipo}`;
            }
            
            
            

        } else if ([TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO].includes(expresion.tipo)) {

                console.log("=====================================") 
                
            // Es una operación aritmética.
            // En este caso necesitamos procesar los operandos antes de realizar la operación.
            // Para esto incovacmos (recursivamente) esta función para resolver los valores de los operandos.
            let valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
            let valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
        


            if (([TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA].includes(expresion.tipo)) 
            && ([TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR].includes(valorIzq.tipo) && [TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR].includes(valorDer.tipo)
                ||(valorIzq.tipo === TIPO_DATO.STRING)
                ||(valorDer.tipo === TIPO_DATO.STRING))) {
                    
                    console.log("para suma y resta boolean y char, y su combinacion")
                throw `ERROR: Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`;
            
            }else if (([TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION].includes(expresion.tipo) )
            && ((valorIzq.tipo === TIPO_DATO.BOOLEAN && [TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR,TIPO_DATO.INT,TIPO_DATO.DOUBLE].includes(valorDer.tipo))
                ||(valorIzq.tipo === TIPO_DATO.CHAR && [TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR].includes(valorDer.tipo))
                ||([TIPO_DATO.INT,TIPO_DATO.DOUBLE].includes(valorIzq.tipo) && valorDer.tipo === TIPO_DATO.BOOLEAN)
                ||(valorIzq.tipo === TIPO_DATO.STRING)
                ||(valorDer.tipo === TIPO_DATO.STRING))){
                
                    console.log("para */ boolean y char, y su combinacion")   
            throw `ERROR: Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`;
        
            
            }else if (( [TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO].includes(expresion.tipo)) 
            && ((![TIPO_DATO.INT, TIPO_DATO.DOUBLE].includes(valorIzq.tipo) || ![TIPO_DATO.INT, TIPO_DATO.DOUBLE].includes(valorDer.tipo)))){
                    
                console.log("para %^- solo puede ser int y double", valorIzq,valorDer)                                            
                    throw `ERROR: Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`;
        
            }else{
                console.log(valorDer,valorIzq)
                if(valorIzq.tipo==TIPO_DATO.BOOLEAN){
                    if (typeof valorIzq.valor === "boolean") {
                        valorIzq=(valorIzq.valor ? 1 : 0);
                    }else{
                        if (typeof valorIzq.valor === "string") {
                            valorIzq=(valorIzq.valor=="true" ? 1 : 0);
                        }
                    }
                    
                }else if(valorIzq.tipo==TIPO_DATO.CHAR){
                    valorIzq=valorIzq.valor.charCodeAt(0);
                
                }else if(valorIzq.tipo==TIPO_DATO.DOUBLE){
                    valorIzq=parseFloat(valorIzq.valor);
                    tipop=1;
                }else{
                    valorIzq=valorIzq.valor;
                }

                if(valorDer.tipo==TIPO_DATO.BOOLEAN){
                    
                    if (typeof valorDer.valor === "boolean") {
                        valorDer=(valorDer.valor ? 1 : 0);
                    }else{
                        if (typeof valorDer.valor === "string") {
                            valorDer=(valorDer.valor=="true" ? 1 : 0);
                        }
                    }
                    
                }else if(valorDer.tipo==TIPO_DATO.CHAR){
                    valorDer=valorDer.valor.charCodeAt(0);
                    
                }else if(valorDer.tipo==TIPO_DATO.DOUBLE){
                    valorDer=parseFloat(valorDer.valor);
                    tipop=1;
                }else{
                    valorDer=valorDer.valor;
                }
                
            }

            if (expresion.tipo === TIPO_EXPRESION.SUMA){
                const res= valorIzq + valorDer;
                console.log("sum",valorIzq , valorDer,valorIzq + valorDer)
                if  (tipop==1){
                    return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

                }
                return { valor: res, tipo: TIPO_DATO.INT  };
                
            }
            if (expresion.tipo === TIPO_EXPRESION.RESTA) {
                const res= valorIzq - valorDer;
                if  (tipop==1){
                    return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

                }
                return { valor: res, tipo: TIPO_DATO.INT  };
            }
            if (expresion.tipo === TIPO_EXPRESION.MULTIPLICACION) {
                const res= valorIzq * valorDer;
                if  (tipop==1){
                    return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

                }
                return { valor: res, tipo: TIPO_DATO.INT  };
            }
            if (expresion.tipo === TIPO_EXPRESION.POTENCIA) {
                const res= Math.pow(valorIzq, valorDer);
                if  (tipop==1){
                    return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE };

                }
                return { valor: res, tipo: TIPO_DATO.INT  };
            }
            if (expresion.tipo === TIPO_EXPRESION.MODULO) {
                const res= valorIzq % valorDer;
                return { valor: parseFloat(res.toFixed(1)), tipo: TIPO_DATO.DOUBLE  };
            }
            if (expresion.tipo === TIPO_EXPRESION.DIVISION) {
            
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
            console.log("al obtenr ident, en ek numeriocp")
            const sym = tablaDeSimbolos.obtener(expresion.valor,expresion.linea,expresion.columna);
            if ((Array.isArray(sym) && sym[0].tipo == "Semantico") || (!Array.isArray(sym) && sym.tipo == "Semantico")){
                erroreslist.push(...sym);
            }
            console.log("iden: ",sym.tipo, sym.valor,)
            return {valor: sym.valor, tipo: sym.tipo};
        } else  if (expresion.tipo === TIPO_EXPRESION.LLAMADA) {
            
            // Obtenemos el valor de la tabla de simbolos
            console.log("alllamada")
            const sym = tablaDeSimbolos.obtener(expresion.identificador,expresion.linea,expresion.columna);
            if ((Array.isArray(sym) && sym[0].tipo == "Semantico") || (!Array.isArray(sym) && sym.tipo == "Semantico")){
                erroreslist.push(...sym);
            }else{
                return procesarFuncion(expresion,tablaDeSimbolos);
            }
            return {valor: sym.valor, tipo: sym.tipo};
        } else {
            console.log( 'ERROR: expresión numérica no válida: ' + expresion);
            erroreslist.push({tipo:"Semantico",descripcion:'Expresion numerica no valida',lineaerror:expresion.linea,columnaerror:expresion.columna});
        }
    }
}

function procesarExpresionCadena(expresion, tablaDeSimbolos) {
    if (erroreslist.length==0){
        if (expresion.tipo === TIPO_EXPRESION.CONCATENACION) {
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
        
            if ([TIPO_EXPRESION.LLAMADA,TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.tipo)){
                return procesarExpresionNumerica(expresion, tablaDeSimbolos);
            }else{
                console.log("lsodf")
                return procesarExpresionLogica(expresion, tablaDeSimbolos,1)
            }
            
        }
    }
}

function procesarExpresionRelacional(expresion, tablaDeSimbolos,op) {
    if (erroreslist.length==0){
    // En este caso necesitamos procesar los operandos antes de realizar la comparación.
    console.log(op)
    console.log("IZ: ",expresion.operandoIzq,"DER", expresion.operandoDer)  
    let valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos); 
   
    let valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);   
   


    console.log("IZ1: ",valorIzq,"DER1", valorDer)      
    if(![TIPO_DATO.INT, TIPO_DATO.DOUBLE,TIPO_DATO.CHAR].includes(valorIzq.tipo) || ![TIPO_DATO.INT, TIPO_DATO.DOUBLE,TIPO_DATO.CHAR].includes(valorDer.tipo)){
       if(valorIzq.tipo==TIPO_DATO.BOOLEAN && valorDer.tipo==TIPO_DATO.BOOLEAN){
            valorIzq=valorIzq.valor;
            valorDer=valorDer.valor;
       } else{
            console.log( 'ERROR: No se puede ejecutar : ' + expresion.tipo+"  entre datos de tipo "+valorIzq.tipo+" y "+valorDer.tipo);
            erroreslist.push({tipo:"Semantico",descripcion:'No se puede ejecutar: '+ expresion.tipo+"  entre datos de tipo "+valorIzq.tipo+" y "+valorDer.tipo,lineaerror:expresion.linea,columnaerror:expresion.columna});
        
       }
       
    }else{
        valorIzq=valorIzq.valor;
        valorDer=valorDer.valor;
    }

    if (expresion.tipo === TIPO_EXPRESION.MAYOR_QUE) {
        console.log(valorIzq , valorDer,valorIzq > valorDer)
        if(op==1){
            console.log("deg")
            return { valor: valorIzq > valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq > valorDer;
    }

    if (expresion.tipo === TIPO_EXPRESION.MENOR_QUE) {

        console.log(valorIzq , valorDer,valorIzq < valorDer)
        if(op==1){
            console.log("deg", valorIzq < valorDer)
            return { valor: valorIzq < valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq < valorDer;
    }

    if (expresion.tipo === TIPO_EXPRESION.MAYOR_IGUAL){
        if(op==1){
            return { valor: valorIzq >= valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq >= valorDer;
    }
    if (expresion.tipo === TIPO_EXPRESION.MENOR_IGUAL){
        if(op===1){
            return { valor: valorIzq <= valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq <= valorDer;
    } 
    if (expresion.tipo === TIPO_EXPRESION.DOBLE_IGUAL){
        console.log("sdfsdf1: ",valorIzq, valorDer,valorIzq == valorDer)
        if(op==1){
            console.log("sdfsdf: ",valorIzq, valorDer,valorIzq == valorDer)
            return { valor: valorIzq == valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq == valorDer;
    }
    if (expresion.tipo === TIPO_EXPRESION.NO_IGUAL){
        if(op==1){
            return { valor: valorIzq !== valorDer, tipo: TIPO_DATO.BOOLEAN };
        }
        return valorIzq !== valorDer;
    }
}
}

function procesarExpresionLogica(expresion, tablaDeSimbolos,op) {
    if (erroreslist.length==0){
    console.log("1232 ",op, expresion)
    let valorIzq;
    let valorDer;
        if (expresion.tipo === TIPO_EXPRESION.AND) { 
            // En este caso necesitamos procesar los operandos para &&.  // resolvemos el operando derecho.
            if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoIzq.tipo) ){
                console.log(" q",expresion.operandoIzq)
                valorIzq =  procesarExpresionRelacional(expresion.operandoIzq, tablaDeSimbolos,op);   
            }else{
                valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);   
            }

            if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoDer.tipo) ){
                console.log(" q",expresion.operandoDer)
                valorDer =  procesarExpresionRelacional(expresion.operandoDer, tablaDeSimbolos,op);   
            }else{
                valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);   
            }    
            try {
                if (typeof valorIzq.valor === "boolean") {
                    valorIzq=valorIzq.valor;
                }else{
                    if (typeof valorIzq.valor === "string") {
                    valorIzq=(valorIzq.valor=="true");
                    console.log("1",valorIzq)
                    }
                }
                if (typeof valorDer.valor === "boolean") {
                    valorDer=valorDer.valor;
                }else{
                    if (typeof valorDer.valor === "string") {
                        valorDer=(valorDer.valor=="true");
                        console.log("1.",valorDer)
                    }
                }
        
        } catch (error) {
            console.log("sdfaqui11",valorDer,valorIzq)
        }
        console.log(valorDer,valorIzq,valorIzq&&valorDer)
            if(op==1){
                return { valor: valorIzq && valorDer, tipo: TIPO_DATO.BOOLEAN };
            }
            return valorIzq && valorDer;
        }
        if (expresion.tipo === TIPO_EXPRESION.OR) { 
            // En este caso necesitamos procesar los operandos para ||.
            console.log("123 ",op, expresion)
            if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoIzq.tipo) ){
                console.log(" q",expresion.operandoIzq)
                valorIzq =  procesarExpresionRelacional(expresion.operandoIzq, tablaDeSimbolos,op);   
            }else{
                valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);   
            }

            if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoDer.tipo) ){
                console.log(" q",expresion.operandoDer)
                valorDer =  procesarExpresionRelacional(expresion.operandoDer, tablaDeSimbolos,op);   
            }else{
                valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);   
            }    
        try {
                if (typeof valorIzq.valor === "boolean") {
                    valorIzq=valorIzq.valor;
                }else{
                    if (typeof valorIzq.valor === "string") {
                    valorIzq=(valorIzq.valor=="true");
                    console.log("1",valorIzq)
                    }
                }
                if (typeof valorDer.valor === "boolean") {
                    valorDer=valorDer.valor;
                }else{
                    if (typeof valorDer.valor === "string") {
                        valorDer=(valorDer.valor=="true");
                        console.log("1.",valorDer)
                    }
                }
        
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
        if (expresion.tipo === TIPO_EXPRESION.NOT) { 
            // En este caso necesitamos procesar solamente un operando para !.
            let valor ;
            if (![TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoIzq.tipo) ){
                console.log(" q",expresion.operandoIzq)
                valor =  procesarExpresionRelacional(expresion.operandoIzq, tablaDeSimbolos,op);   
            }else{
                valor = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);   
            }
            try {
                if (typeof valor.valor === "boolean") {
                    valor=valor.valor;
                }else{
                    if (typeof valor.valor === "string") {
                        valor=(valor.valor=="true");
                    }
                }
            
            
            } catch (error) {
                console.log("sdfaqui11",valorDer,valorIzq)
            }


            if(op==1){
                return { valor: !valor, tipo: TIPO_DATO.BOOLEAN };
            }
            return !valor;
        }
        console.log("va para relacional", op)
        return procesarExpresionRelacional(expresion, tablaDeSimbolos,op);
    }
}

function procesarRetorno(instruccion, tablaDeSimbolos){
    let datoretorno={ valor: undefined, tipo: undefined };
    console.log("en return",instruccion);
    if (erroreslist.length==0){
        const valor = procesarExpresionCadena(instruccion.expresionNumerica, tablaDeSimbolos);
        console.log("yyyyyyyyyyyy", valor);
        if( tipofuncion==valor.tipo){
            datoretorno=valor;
        }else{
            erroreslist.push({tipo:"Semantico",descripcion:'No se puede retornar un '+valor.tipo+ ' en una funcion tipo '+tipofuncion,lineaerror:instruccion.linea,columnaerror:instruccion.columna});
        }
        
    }
    return datoretorno;
    
}
function procesarPRINT(instruccion, tablaDeSimbolos) {
    const cadena = procesarExpresionCadena(instruccion.expresionCadena, tablaDeSimbolos).valor;
    console.log('----> ' + cadena);
}


function procesarIf(instruccion, tablaDeSimbolos,fun) {
    const valorCondicion = procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos,0);

    if (valorCondicion) {
        const tsIf = new TS(tablaDeSimbolos.simbolos);
        const resultado =procesarBloque(instruccion.instrucciones, tsIf,fun);
    }
}


function procesarIfElse(instruccion, tablaDeSimbolos,fun) {
    const valorCondicion = procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos,0);

    if (valorCondicion) {
        const tsIf = new TS(tablaDeSimbolos.simbolos);
        const resultado =procesarBloque(instruccion.instruccionesIfVerdadero, tsIf,fun);
    } else {
        if (typeof instruccion.instruccionesIfFalso === 'object' &&
        (instruccion.instruccionesIfFalso.tipo === TIPO_INSTRUCCION.IF ||
         instruccion.instruccionesIfFalso.tipo === TIPO_INSTRUCCION.IF_ELSE )) {
            procesarIfElse(instruccion.instruccionesIfFalso, tablaDeSimbolos,fun);
        } else {
            const tsElse = new TS(tablaDeSimbolos.simbolos);
            const resultado =procesarBloque(instruccion.instruccionesIfFalso, tsElse,fun);
            
        }
        
    }
}

function procesarSwitch(instruccion, tablaDeSimbolos,fun) {
    const valorExpresion = procesarExpresionCadena(instruccion.expresionNumerica, tablaDeSimbolos);
    const tsSwitch = new TS(tablaDeSimbolos.simbolos);
   
    let salir = false;

    instruccion.casos.forEach(caso => {
        if (!salir) {
            if (caso.tipo === TIPO_OPCION_SWITCH.CASO) {
                console.log("entro1")
                const valorExpCase = procesarExpresionCadena(caso.expresionNumerica, tsSwitch);
                console.log("entro3",valorExpCase, valorExpresion)
                if (valorExpCase.valor === valorExpresion.valor ) {
                    console.log("entro")
                    if (!salir) {
                        const resultado = procesarBloque(caso.instrucciones, tsSwitch,fun);
                        if (resultado.encontroBreak) {
                            salir = true;
                        }
                    }
            
                }
            } else if (caso.tipo === TIPO_OPCION_SWITCH.DEFECTO) {
                
                    if (!salir) {
                        const resultado = procesarBloque(caso.instrucciones, tsSwitch,fun);
                        if (resultado.encontroBreak) {
                            salir = true;
                        }
                    }
                salir = true; // Salir automáticamente después de ejecutar el default
            }
        }
    });
}
  














/*
function procesarSwitch(instruccion, tablaDeSimbolos) {
    var evaluar = true;
    const valorExpresion = procesarExpresionCadena(instruccion.expresionNumerica, tablaDeSimbolos);
    const tsSwitch = new TS(tablaDeSimbolos.simbolos);

    instruccion.casos.forEach(caso => {
        if (caso.tipo == TIPO_OPCION_SWITCH.CASO){
            const valorExpCase= procesarExpresionCadena(caso.expresionNumerica, tsSwitch);
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
}*/







function procesarWHILE(instruccion, tablaDeSimbolos) {
    // Crear una nueva tabla de símbolos para el ámbito del bucle while
    const tsWhile = new TS(tablaDeSimbolos.simbolos);

    // Evaluar la condición del bucle while
    const condicion = procesarExpresionLogica(instruccion.expresionLogica, tsWhile,0);

    // Mientras la condición sea verdadera
    while (condicion) {
        // Procesar las instrucciones dentro del bucle while utilizando la tabla de símbolos del ámbito del bucle
        procesarBloque(instruccion.instrucciones, tsWhile);
    }
}


function procesarPara(instruccion, tablaDeSimbolos) {
    const valor = procesarExpresionCadena(instruccion.valorVariable, tablaDeSimbolos); //aqui quiero que retorne: tipo y valor
    let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.variable, valor,instruccion.linea,instruccion.columna);
    if (erroractualizacion.length==0){
        for (var i = tablaDeSimbolos.obtener(instruccion.variable); procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos,0);
        tablaDeSimbolos.actualizar(instruccion.variable, {valor: tablaDeSimbolos.obtener(instruccion.variable).valor + 1, tipo: TIPO_DATO.INT},instruccion.linea,instruccion.columna)) {
        
        const tsPara = new TS(tablaDeSimbolos.simbolos);
        procesarBloque(instruccion.instrucciones, tsPara,1);
    }       
    }else{
        erroreslist.push(...erroractualizacion);
    }
   
    
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

    let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, valor,instruccion.linea,instruccion.columna);
    if (erroractualizacion.length!=0){
        erroreslist.push(...erroractualizacion);
    }
 }