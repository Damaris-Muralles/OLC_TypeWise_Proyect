

let erroreslist=[];
  let entorno="Global";
  let tsReporte = [];
  let tipofuncion=null;
  let funcionactual=null;
  let ciclo=null;
var consoleEditor;


function procesarInstrucionesGlobales(instrucciones, tablaDeSimbolos,consola) {
   consoleEditor=consola;
   instrucciones.forEach(instruccion => {
      if (erroreslist.length==0){
          if (instruccion.tipo === TIPO_INSTRUCCION.FUNCIONES) {
            
              procesarDeclaracionFuncion(instruccion, tablaDeSimbolos);
          } else if (instruccion.tipo === TIPO_INSTRUCCION.METODOS) {
         
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
          }else if (instruccion.tipo === TIPO_INSTRUCCION.VECTOR) {
       
           procesarDecVector(instruccion, tablaDeSimbolos);
   
       } else if (instruccion.tipo === TIPO_INSTRUCCION.LIST) {
   
           procesarDecList(instruccion, tablaDeSimbolos);
       }else if (instruccion.tipo === TIPO_INSTRUCCION.LIST_ADD) {
          procesarAgregarElement(instruccion, tablaDeSimbolos);
       }  else if (instruccion.tipo === TIPO_INSTRUCCION.MODIFIESTRUC) {
           // Procesando Instrucción Asignación
           procesarModifiElement(instruccion, tablaDeSimbolos);
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
 
          procesarFuncion(main.run,tablaDeSimbolos)
          if (erroreslist.length!=0){
           return verificarErrores();
          }else{
              
           return  verificarErrores();
          }
      } else {
          
          erroreslist.push({tipo:"Semantico",descripcion:'La funcion main no se encuentra definida',lineaerror:mains[0].linea,columnaerror:mains[0].columna});
          return verificarErrores();
      }
  }else{
      return verificarErrores();
  }

}


function procesarDeclaracionFuncion(instruccion, tablaDeSimbolos) {
 try{ 
  if (erroreslist.length==0){
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
          erroreslist.push(...res);
      }
  }
} catch (error) {
  console.log("ERROR EN PROCESAR DECLARACION DE FUNCION")
} 
}

function procesarFuncion(instruccion, tablaDeSimbolos) {
  try{
  if (erroreslist.length==0){
     
      let datosfuncion=tablaDeSimbolos.obtener(instruccion.identificador,instruccion.linea,instruccion.columna);
      
      if (datosfuncion.id==funcionactual){
          funcionactual=datosfuncion.id;
      }else{
          funcionactual=null;
      }
     
      if((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){
          entorno=datosfuncion.tipo.toUpperCase()+" "+datosfuncion.id.toUpperCase();
      // Procesar las instrucciones dentro de la función utilizando la tabla de símbolos del ámbito de la función
    
      let coinciden=[];
      const tsFuncion = new TS([], tablaDeSimbolos);

      if (datosfuncion.valor.parametros.length>0){
            
              if(instruccion.argumentos.length==datosfuncion.valor.parametros.length){
                  for (let i = 0; i < instruccion.argumentos.length; i++){
                      let comparando;
                      let parametrodato;
                      if(instruccion.argumentos[i].tipo== TIPO_VALOR.IDENTIFICADOR){
                          
                          parametrodato= tablaDeSimbolos.obtener(instruccion.argumentos[i].valor, instruccion.linea,instruccion.columna);
                             comparando=parametrodato.tipo==datosfuncion.valor.parametros[i].tipo;

                      }else{
                        
                          parametrodato=procesarExpresionCadena(instruccion.argumentos[i],tablaDeSimbolos);
                         
                          comparando=parametrodato.tipo.includes(datosfuncion.valor.parametros[i].tipo)
                      }  
                      if (!comparando){
                          coinciden.push(instruccion.argumentos[i]);
                      }else{
                         tsFuncion.agregar(datosfuncion.valor.parametros[i].identificador,datosfuncion.valor.parametros[i].tipo,parametrodato.tipo,entorno,datosfuncion.valor.parametros[i].linea,datosfuncion.valor.parametros[i].columna);
                          tsFuncion.actualizar(datosfuncion.valor.parametros[i].identificador,{tipo:datosfuncion.valor.parametros[i].tipo, valor:parametrodato.valor},instruccion.linea,instruccion.columna);
                          
                          if (!tsReporte.some(e => e.id === datosfuncion.valor.parametros[i].identificador && e.entorno === entorno)) {
                          
                           tsReporte.push(tsFuncion.obtener(datosfuncion.valor.parametros[i].identificador,datosfuncion.linea,datosfuncion.columna));
                       }   
                          
                          
                      }    
                  }    
              }else{   
                   erroreslist.push({tipo:"Semantico",descripcion:'La funcion ' + datosfuncion.id + ' requiere de parametros',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
              }
      }
          
      if (coinciden.length>0){
               for (let i = 0; i < coinciden.length; i++){
                  erroreslist.push({tipo:"Semantico",descripcion:'El dato ' + coinciden[i].valor + ' no coincide con el tipo de parametros requeridos ',lineaerror:coinciden[i].linea,columnaerror:coinciden[i].columna});
              }
      }else{
            
              tipofuncion=datosfuncion.tipodato;
              let datbloque;
              if(datosfuncion.tipo=="FUNCION"){
                  funcionactual= datosfuncion.id
                  datbloque=procesarBloque(datosfuncion.valor.instrucciones, tsFuncion,1);
                  
                 
              }else{
                  funcionactual= datosfuncion.id
                  datbloque=procesarBloque(datosfuncion.valor.instrucciones, tsFuncion,0);
              }
              
              return datbloque;
              
          }


      }else{
           erroreslist.push({tipo:"Semantico",descripcion:'La funcion ' + datosfuncion.id + ' no ha sido definida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
      }
  }
} catch (error) {
  console.log("ERROR EN PROCESAR FUNCION")
} 
}

function procesarBloque(instrucciones, tablaDeSimbolos,fun) {
 try{
  let resultado = { encontroBreak: false,  valorReturn: undefined, encontroContinue:false };
  instrucciones.some(instruccion =>  {

      if (erroreslist.length==0){
       
          if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION) {
              // Procesando Instrucción Declaración
             
              procesarDeclaracion(instruccion, tablaDeSimbolos);
          } else if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION_CON_ASIGNACION) {
              // Procesando Instrucción Declaración y asignacion
             
              procesarDecAsig(instruccion, tablaDeSimbolos);
          } else if (instruccion.tipo === TIPO_INSTRUCCION.ASIGNACION) {
              // Procesando Instrucción Asignación
              procesarAsignacion(instruccion, tablaDeSimbolos);
          } else if (instruccion.tipo === TIPO_INSTRUCCION.VECTOR) {
       
           procesarDecVector(instruccion, tablaDeSimbolos);
   
       } else if (instruccion.tipo === TIPO_INSTRUCCION.LIST) {
   
           procesarDecList(instruccion, tablaDeSimbolos);
       }else if (instruccion.tipo === TIPO_INSTRUCCION.LIST_ADD) {
          procesarAgregarElement(instruccion, tablaDeSimbolos);
       }  else if (instruccion.tipo === TIPO_INSTRUCCION.MODIFIESTRUC) {
           // Procesando Instrucción Asignación
           procesarModifiElement(instruccion, tablaDeSimbolos);
       }else if (instruccion.tipo === TIPO_EXPRESION.LLAMADA) {
              // Procesando Instrucción de metodo
             
              resultado.valorReturn =procesarFuncion(instruccion,tablaDeSimbolos) 
          } else if (instruccion.tipo === TIPO_INSTRUCCION.PRINT) {
              // Procesando Instrucción Imprimir

              procesarPRINT(instruccion, tablaDeSimbolos);
    
          } else if (instruccion.tipo === TIPO_INSTRUCCION.IF) {
              // Procesando Instrucción If
              resultado = procesarIf(instruccion, tablaDeSimbolos,fun);
              
              if (resultado.valorReturn!=undefined){ 
                   return true;
              }
              if(resultado.encontroBreak==true){
                  if(["while","dowhile","para","switch"].includes(ciclo)){
                      return true;
                   }else{
                      erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion CONTINUE no valida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
                   }
               }
              
              if(resultado.encontroContinue==true){
                  if(["while","dowhile","para"].includes(ciclo)){
                      return true;
                   }else{
                      erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion CONTINUE no valida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
                   }
               }
               
          } else if (instruccion.tipo === TIPO_INSTRUCCION.IF_ELSE) {
              // Procesando Instrucción If Else// si un if no esta dentro de un siclo break y continue dan error
              resultado =procesarIfElse(instruccion, tablaDeSimbolos,fun);
             
              if (resultado.valorReturn!=undefined){ 
                  return true;
             }
             
             if(resultado.encontroBreak==true){
              if(["while","dowhile","para","switch"].includes(ciclo)){
                  return true;
               }else{
                  erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion CONTINUE no valida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
               }
           }
          
           if(resultado.encontroContinue==true){
              if(["while","dowhile","para"].includes(ciclo)){
                  return true;
               }else{
                  erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion CONTINUE no valida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
               }
           }
          } else if (instruccion.tipo === TIPO_INSTRUCCION.SWITCH) {
              // Procesando Instrucción Switch  
              resultado =procesarSwitch(instruccion, tablaDeSimbolos,fun);
              if (resultado.valorReturn!=undefined){ 
          
                  return true;
             }
             if(resultado.encontroContinue==true){
              if(["while","dowhile","para"].includes(ciclo)){
                  return true;
               }else{
                  erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion CONTINUE no valida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
               }
           }
         
          }  else if (instruccion.tipo === TIPO_INSTRUCCION.WHILE) {
              // Procesando Instrucción Switch  
              resultado =procesarWHILE(instruccion, tablaDeSimbolos,fun);
              
              if (resultado.valorReturn!=undefined){ 
                  return true;
             }
          
          
            
          }  else if (instruccion.tipo === TIPO_INSTRUCCION.PARA) {
              // Procesando Instrucción Switch  
              resultado=procesarPara(instruccion, tablaDeSimbolos,fun);
     
              if (resultado.valorReturn!=undefined){ 
                  return true;
             }
             
            
             
            
             
          } else if (instruccion.tipo === TIPO_INSTRUCCION.DOWHILE) {
              // Procesando Instrucción Switch  
              resultado =procesarDoWhile(instruccion, tablaDeSimbolos,fun);
    
              if (resultado.valorReturn!=undefined){ 
                  return true;
             }
        
          } else if (instruccion.tipo === TIPO_INSTRUCCION.AUMENTOS) {
              // Procesando Instrucción Switch  
              procesarAumentos(instruccion,tablaDeSimbolos)
          }else if (instruccion.tipodato === TIPO_INSTRUCCION.BREAK) {
              if(["while","dowhile","para","switch"].includes(ciclo)){
                  resultado.encontroBreak = true;
                  return true;
               }else{
                  
                  erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion BREAK no valida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
               }
             
          }else if (instruccion.tipodato === TIPO_INSTRUCCION.CONTINUE) {
              if(["while","dowhile","para"].includes(ciclo)){
               
                  resultado.encontroContinue = true;
                  return true;
               }else{
                  erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion CONTINUE no valida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
               }
             
          } else if (instruccion.tipodato === TIPO_EXPRESION.RETORNO) {
              // Procesando Instrucción retorno
              //procesarRetorno(instruccion, tablaDeSimbolos);
              if (fun==1){

                  resultado.valorReturn= procesarRetorno(instruccion, tablaDeSimbolos);
                  return  true;
              }else{
                  erroreslist.push({tipo:"Semantico",descripcion:'Instruccion RETURN no valida',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
              }
            
          }else {
             erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion no valida ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
          }
      }
      
  });

  return resultado;
} catch (error) {
  console.log("ERROR EN PROCESAR BLOQUE")
} 
}

function procesarDeclaracion(instruccion, tablaDeSimbolos) {
  try{ 
  if (erroreslist.length==0){
      let erroragregar=tablaDeSimbolos.agregar(instruccion.identificador,instruccion.tipo_dato,instruccion.tipo,entorno,instruccion.linea,instruccion.columna);
      
      if (erroragregar.length==0){
       if (!tsReporte.some(e => e.id === instruccion.identificador && e.entorno === entorno)) {
                          
           tsReporte.push(tablaDeSimbolos.obtener(instruccion.identificador, instruccion.linea,instruccion.columna));
       }  
          let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, instruccion.valor,instruccion.linea,instruccion.columna);       
          if (erroractualizacion.length!=0){
              erroreslist.push(...erroractualizacion);
          }
      }else{
          erroreslist.push(...erroragregar);
      }
  }
} catch (error) {
  console.log("ERROR EN PROCESAR DECLARACION")
} 
}

function procesarDecAsig(instruccion, tablaDeSimbolos) {
  try{
  if (erroreslist.length==0){
  
      if (instruccion.valor.tipo=="LLAMADA"){
          let datosfuncion=tablaDeSimbolos.obtener(instruccion.valor.identificador,instruccion.linea,instruccion.columna);
          if ((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){
              if (datosfuncion.tipo=="FUNCION"){
                  let erroragregar=tablaDeSimbolos.agregar(instruccion.identificador,instruccion.tipo_dato,instruccion.tipo,entorno,instruccion.linea,instruccion.columna);
                  if (erroragregar.length==0){
                   if (!tsReporte.some(e => e.id === instruccion.identificador && e.entorno === entorno)) {
                          
                       tsReporte.push(tablaDeSimbolos.obtener(instruccion.identificador, instruccion.linea,instruccion.columna));
                   }  
                       const valor = procesarFuncion(instruccion.valor, tablaDeSimbolos); 
                       if (erroreslist.length==0){
                       let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, valor,instruccion.linea,instruccion.columna);
                      if (erroractualizacion.length!=0){
                          erroreslist.push(...erroractualizacion);
                      }
                  }
                  }else{
                        erroreslist.push(...erroragregar);
                  }
              
                  
              }else{
                  erroreslist.push({tipo:"Semantico",descripcion:'No se puede asignar un metodo a variable ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
              }
          }  else{
                  erroreslist.push(...datosfuncion)
          }
      }else{
          
          let erroragregar=tablaDeSimbolos.agregar(instruccion.identificador,instruccion.tipo_dato,instruccion.tipo,entorno,instruccion.linea,instruccion.columna);
          
          if (erroragregar.length==0){
           if (!tsReporte.some(e => e.id === instruccion.identificador && e.entorno === entorno)) {
                          
               tsReporte.push(tablaDeSimbolos.obtener(instruccion.identificador, instruccion.linea,instruccion.columna));
           }  
             
                const valor = procesarExpresionCadena(instruccion.valor, tablaDeSimbolos); //aqui quiero que retorne: tipo y valor
              
                let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, valor,instruccion.linea,instruccion.columna);
            
              if (erroractualizacion.length!=0){
                  erroreslist.push(...erroractualizacion);
              }
              
          }else{
              erroreslist.push(...erroragregar);
          }
      }
  }
} catch (error) {
  console.log("ERROR EN PROCESAR DECLARCION CON ASIGNACION")
} 
}
function procesarAsignacion(instruccion, tablaDeSimbolos) {
  try{
  if (erroreslist.length==0){
   
      if (instruccion.expresionNumerica.tipo=="LLAMADA"){
          let datosfuncion=tablaDeSimbolos.obtener(instruccion.expresionNumerica.identificador,instruccion.linea,instruccion.columna);

          if ((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){
              if (datosfuncion.tipo=="FUNCION"){

             
                  const valor = procesarFuncion(instruccion.expresionNumerica, tablaDeSimbolos); 
                  if (erroreslist.length==0){
                  let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, valor,instruccion.linea,instruccion.columna);
                  if (erroractualizacion.length!=0){
                      erroreslist.push(...erroractualizacion);
                  }
              }  
                  
              }else{
                  erroreslist.push({tipo:"Semantico",descripcion:'No se puede asignar un metodo a variable ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
              }
          }  else{
              erroreslist.push(...datosfuncion)
          }
              
      }else{
          
       
          const valor =procesarExpresionCadena(instruccion.expresionNumerica, tablaDeSimbolos);
         
          let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.identificador, valor,instruccion.linea,instruccion.columna);
          if (erroractualizacion.length!=0){
              erroreslist.push(...erroractualizacion);
          }
      }
  }
} catch (error) {
  console.log("ERROR EN PROCESAR ASIGNACION")
} 
}

function procesarExpresionNumerica(expresion, tablaDeSimbolos) {
  try{
  if (erroreslist.length==0){
      let tipop=0;
       if (expresion.tipo === TIPO_EXPRESION.NEGATIVO) {
          // Es un valor negado.
          // En este caso necesitamos procesar el valor del operando para poder negar su valor.
          // Para esto invocamos (recursivamente) esta función para sesolver el valor del operando.
          const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);     // resolvemos el operando
          if ([TIPO_DATO.INT, TIPO_DATO.DOUBLE].includes(valor.tipo)){
                  // Retornamos el valor negado.
              const res= valor.valor * -1;
              if  (valor.tipo==TIPO_DATO.DOUBLE){
                  return { valor: parseFloat(res), tipo: TIPO_DATO.DOUBLE };

              }
              return { valor: res, tipo: TIPO_DATO.INT  };
          }else{
               erroreslist.push({tipo:"Semantico",descripcion: `Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`,lineaerror:expresion.linea,columnaerror:expresion.columna});
          }
          
          
          

      } else if ([TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO].includes(expresion.tipo)) {
         
          let valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
         
          let valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
          
          

          if (([TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA].includes(expresion.tipo)) 
          && ([TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR].includes(valorIzq.tipo) && [TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR].includes(valorDer.tipo)
              ||(valorIzq.tipo === TIPO_DATO.STRING)
              ||(valorDer.tipo === TIPO_DATO.STRING))) {
                  
                  if (([TIPO_EXPRESION.SUMA].includes(expresion.tipo)) 
                  && ( valorIzq.tipo === TIPO_DATO.STRING)
                      ||(valorDer.tipo === TIPO_DATO.STRING)||([ TIPO_DATO.CHAR].includes(valorIzq.tipo) && [TIPO_DATO.CHAR].includes(valorDer.tipo))){
                        
                          if (valorIzq.tipo==TIPO_DATO.BOOLEAN){
                              valorIzq=(valorIzq.valor=="true" ? 1 : 0);
                          }else if(valorIzq.tipo==TIPO_DATO.CHAR){
                              valorIzq=valorIzq.valor.charCodeAt(0);
                          
                          }else if(valorIzq.tipo==TIPO_DATO.DOUBLE){
                              valorIzq=valorIzq.valor;
                              tipop=1;
                          }else{
                              valorIzq=valorIzq.valor;
                          }

                          if (valorDer.tipo==TIPO_DATO.BOOLEAN){
                              valorDer=(valorDer.valor=="true" ? 1 : 0);
                          } else if(valorDer.tipo==TIPO_DATO.CHAR){
                              valorDer=valorDer.valor.charCodeAt(0);
                              
                          }else if(valorDer.tipo==TIPO_DATO.DOUBLE){
                              valorDer=valorDer.valor;
                              tipop=1;
                          }else{
                              valorDer=valorDer.valor;
                          }
                      
                      
                          const res=valorIzq + valorDer;
                          return {valor: res, tipo: TIPO_DATO.STRING}; 
                          
                  }else{
                      erroreslist.push({tipo:"Semantico",descripcion: ` Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`,lineaerror:expresion.linea,columnaerror:expresion.columna});
                  } 


               
          
          }else if (([TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION].includes(expresion.tipo) )
          && ((valorIzq.tipo === TIPO_DATO.BOOLEAN && [TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR,TIPO_DATO.INT,TIPO_DATO.DOUBLE].includes(valorDer.tipo))
              ||(valorIzq.tipo === TIPO_DATO.CHAR && [TIPO_DATO.BOOLEAN, TIPO_DATO.CHAR].includes(valorDer.tipo))
              ||([TIPO_DATO.INT,TIPO_DATO.DOUBLE].includes(valorIzq.tipo) && valorDer.tipo === TIPO_DATO.BOOLEAN)
              ||(valorIzq.tipo === TIPO_DATO.STRING)
              ||(valorDer.tipo === TIPO_DATO.STRING))){
              
             erroreslist.push({tipo:"Semantico",descripcion: ` Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`,lineaerror:expresion.linea,columnaerror:expresion.columna});
          
          }else if (( [TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO].includes(expresion.tipo)) 
          && ((![TIPO_DATO.INT, TIPO_DATO.DOUBLE].includes(valorIzq.tipo) || ![TIPO_DATO.INT, TIPO_DATO.DOUBLE].includes(valorDer.tipo)))){
                  
                                                        
                    erroreslist.push({tipo:"Semantico",descripcion: `Operacion no valida; no se puede realizar ${expresion.tipo} entre ${valorIzq.tipo} y ${valorDer.tipo}`,lineaerror:expresion.linea,columnaerror:expresion.columna});
      
          }else{
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
               if  (tipop==1){
                  return { valor: parseFloat(res), tipo: TIPO_DATO.DOUBLE };

              }
              return { valor: res, tipo: TIPO_DATO.INT  };
              
          }
          if (expresion.tipo === TIPO_EXPRESION.RESTA) {
              const res= valorIzq - valorDer;
              if  (tipop==1){
                  return { valor: parseFloat(res), tipo: TIPO_DATO.DOUBLE };

              }
              return { valor: res, tipo: TIPO_DATO.INT  };
          }
          if (expresion.tipo === TIPO_EXPRESION.MULTIPLICACION) {
              const res= valorIzq * valorDer;
              if  (tipop==1){
                  return { valor: parseFloat(res), tipo: TIPO_DATO.DOUBLE };

              }
              return { valor: res, tipo: TIPO_DATO.INT  };
          }
          if (expresion.tipo === TIPO_EXPRESION.POTENCIA) {
              const res= Math.pow(valorIzq, valorDer);
              if  (tipop==1){
                  return { valor: parseFloat(res), tipo: TIPO_DATO.DOUBLE };

              }
              return { valor: res, tipo: TIPO_DATO.INT  };
          }
          if (expresion.tipo === TIPO_EXPRESION.MODULO) {
              const res= valorIzq % valorDer;
              return { valor: parseFloat(res), tipo: TIPO_DATO.DOUBLE  };
              
          }
          if (expresion.tipo === TIPO_EXPRESION.DIVISION) {
          
              if(valorDer === 0){
                    erroreslist.push({tipo:"Semantico",descripcion:'La division entre 0 da como resultado: '+valorIzq/valorDer,lineaerror:expresion.linea,columnaerror:expresion.columna});
              }else{
                  const res= valorIzq / valorDer;
                  return { valor: parseFloat(res), tipo: TIPO_DATO.DOUBLE  };
              }
          };

      } else if (expresion.tipo === TIPO_VALOR.INT) {
          // Es un valor numérico.
          // En este caso únicamente retornamos el valor obtenido por el parser directamente.
          return {valor: expresion.valor, tipo: TIPO_DATO.INT };
      } else if (expresion.tipo === TIPO_VALOR.DOUBLE) {
          // Es un valor numérico.
          // En este caso únicamente retornamos el valor obtenido por el parser directamente.
          return {valor: parseFloat(expresion.valor), tipo: TIPO_DATO.DOUBLE };
      } else if (expresion.tipo === TIPO_VALOR.BOOLEAN) {
          // Es un valor numérico.
          // En este caso únicamente retornamos el valor obtenido por el parser directamente.
       
          return {valor: expresion.valor, tipo: TIPO_DATO.BOOLEAN };
      } else if (expresion.tipo === TIPO_VALOR.CARACTER) {
          // Es un valor numérico.
          // En este caso únicamente retornamos el valor obtenido por el parser directamente.
          return {valor: expresion.valor, tipo: TIPO_DATO.CHAR };
      } else  if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
          
          const sym = tablaDeSimbolos.obtener(expresion.valor,expresion.linea,expresion.columna);
          if ((Array.isArray(sym) && sym[0].tipo == "Semantico") || (!Array.isArray(sym) && sym.tipo == "Semantico")){
              erroreslist.push(...sym);
          }
           return {valor: sym.valor, tipo: sym.tipo};
      } else  if (expresion.tipo === TIPO_EXPRESION.LLAMADA) {
          
             
          const sym = tablaDeSimbolos.obtener(expresion.identificador,expresion.linea,expresion.columna);
          if ((Array.isArray(sym) && sym[0].tipo == "Semantico") || (!Array.isArray(sym) && sym.tipo == "Semantico")){
              erroreslist.push(...sym);
          }else{
               let valorllamada=procesarFuncion(expresion,tablaDeSimbolos);
              if (erroreslist.length==0){ 
              if ( valorllamada.hasOwnProperty('valorReturn')) {
                  valorllamada=  valorllamada.valorReturn
               } 
              }
              return valorllamada;
          }
          return {valor: sym.valor, tipo: sym.tipo};
      
      } else  if (expresion.tipo === TIPO_INSTRUCCION.AUMENTOS) {
          let simbolos= tablaDeSimbolos.obtener(expresion.identificador)
          if ((Array.isArray(simbolos) && simbolos[0].tipo != "Semantico") || (!Array.isArray(simbolos) && simbolos.tipo != "Semantico")){
              if (simbolos.tipo==TIPO_DATO.DOUBLE|| simbolos.tipo==TIPO_DATO.INT){
                  let erroractualizacion;
                  if ( expresion.tipodato=="INCREMENTO"){

                          erroractualizacion=tablaDeSimbolos.actualizar(simbolos.id, {valor:simbolos.valor+1,tipo:simbolos.tipo},expresion.linea,expresion.columna);
                  }else{
                          erroractualizacion=tablaDeSimbolos.actualizar(simbolos.id,{valor:simbolos.valor-1,tipo:simbolos.tipo},expresion.linea,expresion.columna);
                  }
                      
                  if (erroractualizacion.length!=0){
                      erroreslist.push(...erroractualizacion);
                  }
              }else{
                  erroreslist.push({tipo:"Semantico",descripcion:'No puede realizarse incremento/decremento en una variable de tipo '+simbolos.ti,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
              }
              return {valor: simbolos.valor, tipo: simbolos.tipo};
          }else{
              erroreslist.push(...simbolos)
          }
          return{valor:undefined, tipo:undefined}
      } else  if (expresion.tipo === TIPO_EXPRESION.TERNARIO) {
          
          return procesarOperacionTernario(expresion, tablaDeSimbolos);
      } else if (expresion.tipo==TIPO_EXPRESION.CASTEO1) {

          return procesarCasteos(expresion, tablaDeSimbolos);
      } else if ([TIPO_EXPRESION.LENGTH,TIPO_EXPRESION.TRUNC,TIPO_EXPRESION.ROUND].includes(expresion.tipo)) {

          return procesarNativasNumericas(expresion, tablaDeSimbolos);
      } else{
     
          erroreslist.push({tipo:"Semantico",descripcion:'Expresion numerica no valida ',lineaerror:expresion.linea,columnaerror:expresion.columna});
      }
  }
} catch (error) {
  console.log("ERROR EN PROCESAR EXPRESION NUMERICA")
} 
}

function procesarOperacionTernario(operacionTernaria, tablaDeSimbolos) {
try{
  const resultadoCondicion = procesarExpresionLogica(operacionTernaria.expresionLogica, tablaDeSimbolos,1).valor;

  if (resultadoCondicion) {
      return procesarExpresionCadena(operacionTernaria.instruccionesIfVerdadero, tablaDeSimbolos);
  } else {
      return procesarExpresionCadena(operacionTernaria.instruccionesIfFalso, tablaDeSimbolos);
  }
} catch (error) {
  console.log("ERROR EN PROCESAR TERNARIO")
} 
}
  
function procesarExpresionCadena(expresion, tablaDeSimbolos) {
try{
  if (erroreslist.length==0){
   

       if ('operandoIzq' in expresion) {
           if (expresion.operandoIzq!=undefined){
           if (expresion.operandoIzq.tipo==TIPO_EXPRESION.ACCESO){
               
               expresion.operandoIzq= procesarAccesos(expresion.operandoIzq, tablaDeSimbolos)
               
           }
           }
       } 
       if ('operandoDer' in expresion) {
           if (expresion.operandoDer!=undefined){
               if (expresion.operandoDer.tipo==TIPO_EXPRESION.ACCESO){
                   expresion.operandoDer= procesarAccesos(expresion.operandoDer, tablaDeSimbolos)
                   
               }
           }
           
       } 
       if (erroreslist.length==0){
       if (expresion.tipo === TIPO_EXPRESION.SUMA) {
           
          if ([TIPO_EXPRESION.CHARARRAY,TIPO_EXPRESION.TOSTRING,TIPO_EXPRESION.TYPEO,TIPO_EXPRESION.CASTEO,TIPO_EXPRESION.UPPER,TIPO_EXPRESION.LOWER,TIPO_DATO.STRING].includes(expresion.operandoIzq.tipo)||[TIPO_EXPRESION.CHARARRAY,TIPO_EXPRESION.TOSTRING,TIPO_EXPRESION.TYPEO,TIPO_EXPRESION.CASTEO,TIPO_EXPRESION.UPPER,TIPO_EXPRESION.LOWER,TIPO_DATO.STRING].includes(expresion.operandoDer.tipo)||(expresion.operandoIzq.tipo==TIPO_DATO.CHAR && expresion.operandoDer.tipo==TIPO_DATO.CHAR)){
              
              let valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
              let valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
          // Retornamos el resultado de la operación de concatenación.
          
              if (valorIzq.tipo==TIPO_DATO.BOOLEAN){
                  valorIzq=(valorIzq.valor=="true" ? 1 : 0);
              }else if(valorIzq.tipo==TIPO_DATO.CHAR){
                  valorIzq=valorIzq.valor.charCodeAt(0);
              
              }else if(valorIzq.tipo==TIPO_DATO.DOUBLE){
                  valorIzq=valorIzq.valor;
                  tipop=1;
              }else{
                  valorIzq=valorIzq.valor;
              }

              if (valorDer.tipo==TIPO_DATO.BOOLEAN){
                  valorDer=(valorDer.valor=="true" ? 1 : 0);
              } else if(valorDer.tipo==TIPO_DATO.CHAR){
                  valorDer=valorDer.valor.charCodeAt(0);
                  
              }else if(valorDer.tipo==TIPO_DATO.DOUBLE){
                  valorDer=valorDer.valor;
                  tipop=1;
              }else{
                  valorDer=valorDer.valor;
              }
          
          
              const res=valorIzq + valorDer;
              return {valor: res, tipo: TIPO_DATO.STRING}; 
          }else{
          
              return procesarExpresionNumerica(expresion, tablaDeSimbolos);
          }
            

      } else if (expresion.tipo === TIPO_VALOR.CADENA) {
            
              return {valor: expresion.valor, tipo: TIPO_DATO.STRING };
      } else if (expresion.tipo === TIPO_EXPRESION.ACCESO) {
          let res1= procesarAccesos(expresion, tablaDeSimbolos)
         
           if(res1.tipo==TIPO_VALOR.CADENA){
               return procesarExpresionCadena(res1,tablaDeSimbolos)
           }
           return procesarExpresionNumerica(res1,tablaDeSimbolos)
       }else if (expresion.tipodato === "CONVERT CARACTERES") {
          
          return procesarModiCadena(expresion, tablaDeSimbolos);
      } else if (expresion.tipo==TIPO_EXPRESION.CASTEO) {
          
          return procesarCasteosString(expresion, tablaDeSimbolos);
      } else if ([TIPO_EXPRESION.TYPEO,TIPO_EXPRESION.TOSTRING,TIPO_EXPRESION.CHARARRAY].includes(expresion.tipo)) {

          return procesarNativas(expresion, tablaDeSimbolos);
      } else{
      
          if ([TIPO_INSTRUCCION.AUMENTOS,TIPO_EXPRESION.ROUND,TIPO_EXPRESION.TRUNC,TIPO_EXPRESION.LENGTH,TIPO_EXPRESION.CASTEO1,TIPO_EXPRESION.TERNARIO,TIPO_EXPRESION.LLAMADA,TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.RESTA,TIPO_EXPRESION.SUMA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.tipo)){
          
              return procesarExpresionNumerica(expresion, tablaDeSimbolos);
          }else{
              return procesarExpresionLogica(expresion, tablaDeSimbolos,1)
          }
          
      }
   }
  }
} catch (error) {
  console.log("ERROR EN PROCESAR CADENA")
} 
}

function procesarExpresionRelacional(expresion, tablaDeSimbolos,op) {
  try{
  if (erroreslist.length==0){
  // En este caso necesitamos procesar los operandos antes de realizar la comparación.

  let valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos); 
 
  let valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);   
 
  if (valorDer.hasOwnProperty('valorReturn')) {
     valorDer= valorDer.valorReturn
  } 
  if (valorIzq.hasOwnProperty('valorReturn')) {
      valorIzq= valorIzq.valorReturn
  } 


  if(![TIPO_DATO.INT, TIPO_DATO.DOUBLE,TIPO_DATO.CHAR].includes(valorIzq.tipo) || ![TIPO_DATO.INT, TIPO_DATO.DOUBLE,TIPO_DATO.CHAR].includes(valorDer.tipo)){
     if(valorIzq.tipo==TIPO_DATO.BOOLEAN && valorDer.tipo==TIPO_DATO.BOOLEAN){
          valorIzq=valorIzq.valor;
          valorDer=valorDer.valor;
          
     } else{
       
          erroreslist.push({tipo:"Semantico",descripcion:'No se puede ejecutar: '+ expresion.tipo+"  entre datos de tipo "+valorIzq.tipo+" y "+valorDer.tipo,lineaerror:expresion.linea,columnaerror:expresion.columna});
      
     }
     
  }else{
      valorIzq=valorIzq.valor;
      valorDer=valorDer.valor;
  }

  if (expresion.tipo === TIPO_EXPRESION.MAYOR_QUE) {

      if(op==1){

          return { valor: valorIzq > valorDer, tipo: TIPO_DATO.BOOLEAN };
      }
      return valorIzq > valorDer;
  }

  if (expresion.tipo === TIPO_EXPRESION.MENOR_QUE) {


      if(op==1){

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

      if(op==1){
 
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
  if ([TIPO_EXPRESION.AND, TIPO_EXPRESION.OR,TIPO_EXPRESION.NOT].includes(expresion.tipo) ){
      expresion.operandoDer= { valor: valorDer, tipo: TIPO_DATO.BOOLEAN };
      expresion.operandoIzq={ valor: valorIzq , tipo: TIPO_DATO.BOOLEAN };

      procesarExpresionLogica(expresion, tablaDeSimbolos,op) 
  }
}
} catch (error) {
  console.log("ERROR EN PROCESAR OPERACION RELACIONAL")
} 
}

function procesarExpresionLogica(expresion, tablaDeSimbolos,op) {
  try{
  if (erroreslist.length==0){

      let valorIzq;
      let valorDer;
 
      if (expresion.tipo === TIPO_EXPRESION.AND) { 
          // En este caso necesitamos procesar los operandos para &&.  // resolvemos el operando derecho.
          if (![TIPO_DATO.BOOLEAN,TIPO_EXPRESION.ROUND,TIPO_EXPRESION.TRUNC,TIPO_EXPRESION.LENGTH,TIPO_EXPRESION.CHARARRAY,TIPO_EXPRESION.TOSTRING,TIPO_EXPRESION.TYPEO,TIPO_EXPRESION.CASTEO,TIPO_EXPRESION.CASTEO1,TIPO_EXPRESION.LOWER,TIPO_EXPRESION.UPPER,TIPO_DATO.INT,TIPO_DATO.DOUBLE,TIPO_DATO.CHAR,TIPO_DATO.STRING,TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA,TIPO_EXPRESION.LLAMADA,TIPO_EXPRESION.TERNARIO, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoIzq.tipo) ){

              valorIzq =  procesarExpresionLogica(expresion.operandoIzq, tablaDeSimbolos,op);   
          }else{
              if (![TIPO_DATO.BOOLEAN,TIPO_DATO.INT,TIPO_DATO.DOUBLE,TIPO_DATO.CHAR,TIPO_DATO.STRING].includes(expresion.operandoIzq.tipo)){
                  valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);   
                  
              }else{
                  valorIzq =expresion.operandoIzq
              }
          }

          if (![TIPO_DATO.BOOLEAN,TIPO_EXPRESION.ROUND,TIPO_EXPRESION.TRUNC,TIPO_EXPRESION.LENGTH,TIPO_EXPRESION.CHARARRAY,TIPO_EXPRESION.TOSTRING,TIPO_EXPRESION.TYPEO,TIPO_EXPRESION.CASTEO,TIPO_EXPRESION.CASTEO1,TIPO_EXPRESION.LOWER,TIPO_EXPRESION.UPPER,TIPO_DATO.INT,TIPO_DATO.DOUBLE,TIPO_DATO.CHAR,TIPO_DATO.STRING,TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA,TIPO_EXPRESION.LLAMADA,TIPO_EXPRESION.TERNARIO, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoIzq.tipo)  ){
      
              valorDer =  procesarExpresionLogica(expresion.operandoDer, tablaDeSimbolos,op);   
          }else{
              if (![TIPO_DATO.BOOLEAN,TIPO_DATO.INT,TIPO_DATO.DOUBLE,TIPO_DATO.CHAR,TIPO_DATO.STRING].includes(expresion.operandoDer.tipo)){
                  valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);   
                  
              }else{
                  valorDer =expresion.operandoDer
              }
          }    
          try {
              if (typeof valorIzq.valor != "string") {
                  valorIzq=valorIzq.valor;
              }else{
                  if (typeof valorIzq.valor === "string") {
                  valorIzq=valorIzq.valor;
                  }
              }
              if (typeof valorDer.valor != "string") {
                  valorDer=valorDer.valor;
              }else{
                  if (typeof valorDer.valor === "string") {
                      valorDer=valorDer.valor;
                  }
              }
      
      } catch (error) {
          console.log("ERROR DENTRO DE AND",valorDer,valorIzq)
      }

          if(op==1){
              return { valor: valorIzq && valorDer, tipo: TIPO_DATO.BOOLEAN };
          }
          return valorIzq && valorDer;
      }
      if (expresion.tipo === TIPO_EXPRESION.OR) { 
          // En este caso necesitamos procesar los operandos para ||.
          
          if (![TIPO_DATO.BOOLEAN,TIPO_EXPRESION.ROUND,TIPO_EXPRESION.TRUNC,TIPO_EXPRESION.LENGTH,TIPO_EXPRESION.CHARARRAY,TIPO_EXPRESION.TOSTRING,TIPO_EXPRESION.TYPEO,TIPO_DATO.INT,TIPO_EXPRESION.CASTEO,TIPO_EXPRESION.CASTEO1,TIPO_EXPRESION.LOWER,TIPO_EXPRESION.UPPER,TIPO_DATO.DOUBLE,TIPO_DATO.CHAR,TIPO_DATO.STRING,TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoIzq.tipo) ){

               valorIzq =  procesarExpresionLogica(expresion.operandoIzq, tablaDeSimbolos,op);   
     
              }else{
               if (![TIPO_DATO.BOOLEAN,TIPO_DATO.INT,TIPO_DATO.DOUBLE,TIPO_DATO.CHAR,TIPO_DATO.STRING].includes(expresion.operandoIzq.tipo)){
      
                  valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);   
       
              
                  }else{
                   valorIzq =expresion.operandoIzq
         
               }
           }

           if (![TIPO_DATO.BOOLEAN,TIPO_EXPRESION.ROUND,TIPO_EXPRESION.TRUNC,TIPO_EXPRESION.LENGTH,TIPO_DATO.INT,TIPO_EXPRESION.CHARARRAY,TIPO_EXPRESION.TOSTRING,TIPO_EXPRESION.TYPEO,TIPO_DATO.DOUBLE,TIPO_DATO.CHAR,TIPO_DATO.STRING,TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoDer.tipo) ){

               valorDer =  procesarExpresionLogica(expresion.operandoDer, tablaDeSimbolos,op);   
           }else{
               if (![TIPO_DATO.BOOLEAN,TIPO_DATO.INT,TIPO_DATO.DOUBLE,TIPO_DATO.CHAR,TIPO_DATO.STRING].includes(expresion.operandoDer.tipo)){
                   valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);   
                   
               }else{
                   valorDer =expresion.operandoDer
               }
           }    

           try {
               
               if (typeof valorIzq.valor != "string") {
                   valorIzq=valorIzq.valor;
               }else{
                   if (typeof valorIzq.valor === "string") {
                   valorIzq=valorIzq.valor;
              
                   }
               }
               if (typeof valorDer.valor != "string") {
                   valorDer=valorDer.valor;
               }else{
                   if (typeof valorDer.valor === "string") {
                       valorDer=valorDer.valor;
                 
                   }
               }
      } catch (error) {
          console.log("ERROR DENTRO DE OR",valorDer,valorIzq)
      }
          // resolvemos el operando izquierdo.
          // resolvemos el operando derecho.
 
          if(op==1){

              return { valor: valorIzq || valorDer, tipo: TIPO_DATO.BOOLEAN };
          }
 
          return valorIzq || valorDer;
      }
      if (expresion.tipo === TIPO_EXPRESION.NOT) { 
         
          let valor ;
          if (![TIPO_DATO.BOOLEAN,TIPO_EXPRESION.ROUND,TIPO_EXPRESION.TRUNC,TIPO_EXPRESION.LENGTH,TIPO_DATO.INT,TIPO_EXPRESION.CHARARRAY,TIPO_EXPRESION.TOSTRING,TIPO_EXPRESION.TYPEO,TIPO_DATO.DOUBLE,TIPO_EXPRESION.CASTEO,TIPO_EXPRESION.CASTEO1,TIPO_EXPRESION.LOWER,TIPO_EXPRESION.UPPER,TIPO_DATO.CHAR,TIPO_DATO.STRING,TIPO_VALOR.BOOLEAN,TIPO_VALOR.INT,TIPO_VALOR.DOUBLE,TIPO_VALOR.CARACTER,TIPO_VALOR.CADENA,TIPO_VALOR.IDENTIFICADOR,TIPO_EXPRESION.SUMA,TIPO_EXPRESION.RESTA, TIPO_EXPRESION.MULTIPLICACION,TIPO_EXPRESION.DIVISION,TIPO_EXPRESION.POTENCIA,TIPO_EXPRESION.MODULO,TIPO_EXPRESION.NEGATIVO].includes(expresion.operandoIzq.tipo) ){
            
               valor =  procesarExpresionLogica(expresion.operandoIzq, tablaDeSimbolos,op);   
           }else{
               if (![TIPO_DATO.BOOLEAN,TIPO_DATO.INT,TIPO_DATO.DOUBLE,TIPO_DATO.CHAR,TIPO_DATO.STRING].includes(expresion.operandoIzq.tipo)){
                   valor = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);   
                   
               }else{
                   valor =expresion.operandoIzq
               }
           }
          try {
              if (typeof valor.valor != "string") {
                  valor=valor.valor;
              }else{
                  if (typeof valor.valor === "string") {
                      valor=valor.valor;
                  }
              }
          
          
          } catch (error) {
              console.log("ERROR DENTRO DE NOT",valorDer,valorIzq)
          }


          if(op==1){
              return { valor: !valor, tipo: TIPO_DATO.BOOLEAN };
          }
          return !valor;
      }
      return procesarExpresionRelacional(expresion, tablaDeSimbolos,op);
  }
} catch (error) {
  console.log("ERROR EN PROCESAR OPERACION LOGICA")
} 
}

function procesarRetorno(instruccion, tablaDeSimbolos){
  try{
  let datoretorno={ valor: undefined, tipo: undefined };

  if (erroreslist.length==0){
      const valor = procesarExpresionCadena(instruccion.expresionNumerica, tablaDeSimbolos);

      if( tipofuncion==valor.tipo){
          
          datoretorno=valor;
      }else{
          erroreslist.push({tipo:"Semantico",descripcion:'No se puede retornar un '+valor.tipo+ ' en una funcion tipo '+tipofuncion,lineaerror:instruccion.linea,columnaerror:instruccion.columna});
      }
      
  }
  return datoretorno;
} catch (error) {
  console.log("ERROR EN PROCESAR RETORNO DE DATOS")
} 
}


function procesarIf(instruccion, tablaDeSimbolos,fun) {
 try{
   let aux=entorno;
      
  entorno=entorno+" - Sentencia If";
  if (erroreslist.length==0){
  const valorCondicion = procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos,1).valor;

  if (valorCondicion) {
      const tsIf = new TS([], tablaDeSimbolos);

      const resultado =procesarBloque(instruccion.instrucciones, tsIf,fun);
    
      if (erroreslist.length==0){
         
          if (resultado.valorReturn!=undefined||resultado.encontroBreak==true||resultado.encontroContinue==true){
           entorno=aux;
              return resultado;
          }else{
           entorno=aux;
              return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
          }
           
          
      }else{
       entorno=aux;
          return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
      }
  }else{
   entorno=aux;
      return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
  }
}
} catch (error) {
  console.log("ERROR EN PROCESAR IF")
} 
}


function procesarIfElse(instruccion, tablaDeSimbolos,fun) {
  try{
   let aux=entorno;
   entorno=entorno+" - Sentencia If else";
  if (erroreslist.length==0){
  const valorCondicion = procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos,1).valor;
 
  if (valorCondicion) {
      const tsIf = new TS([], tablaDeSimbolos);
      const resultado =procesarBloque(instruccion.instruccionesIfVerdadero, tsIf,fun);
    
      
      
      if (erroreslist.length==0){
          if (resultado.valorReturn!=undefined||resultado.encontroBreak==true||resultado.encontroContinue==true){
           entorno=aux;
              return resultado;
          }else{
           entorno=aux;
              return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
          }
          
      }else{
       entorno=aux;
              return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
          }
  } else {
      if (typeof instruccion.instruccionesIfFalso === 'object' &&
      (instruccion.instruccionesIfFalso.tipo === TIPO_INSTRUCCION.IF)) {
    
          const resultado= procesarIf(instruccion.instruccionesIfFalso, tablaDeSimbolos,fun);
          
          if (resultado.valorReturn!=undefined){ 
           entorno=aux;
              return resultado;
         }
        
         if(resultado.encontroBreak==true){
          if(["while","dowhile","para","switch"].includes(ciclo)){
           entorno=aux;
              return resultado
           }else{
              erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion BREAK no valida ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
           }
       }
      
       if(resultado.encontroContinue==true){
          if(["while","dowhile","para"].includes(ciclo)){
           entorno=aux;
              return resultado
           }else{
              erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion CONTINUE no valida ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
           }
       }
       return {encontroBreak:false, valorReturn:undefined, encontroContinue:false};
      } else if (typeof instruccion.instruccionesIfFalso === 'object' &&
      ( instruccion.instruccionesIfFalso.tipo === TIPO_INSTRUCCION.IF_ELSE )) {
  
          const resultado= procesarIfElse(instruccion.instruccionesIfFalso, tablaDeSimbolos,fun);
          
          if (resultado.valorReturn!=undefined){ 
           entorno=aux;
              return resultado;
         }
        
         if(resultado.encontroBreak==true){
          if(["while","dowhile","para","switch"].includes(ciclo)){
           entorno=aux;
              return resultado
           }else{
              erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion BREAK no valida ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
           }
       }
      
       if(resultado.encontroContinue==true){
          if(["while","dowhile","para"].includes(ciclo)){
           entorno=aux;
           return resultado
           }else{
              erroreslist.push({tipo:"Semantico",descripcion:'Tipo de instruccion CONTINUE no valida ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
           }
       }
       entorno=aux;
       return {encontroBreak:false, valorReturn:undefined, encontroContinue:false};
      }else{
          const tsElse = new TS([], tablaDeSimbolos);
          const resultado =procesarBloque(instruccion.instruccionesIfFalso, tsElse,fun);
      
          if (erroreslist.length==0){
              if (resultado.valorReturn!=undefined||resultado.encontroBreak==true||resultado.encontroContinue==true){
               entorno=aux;
                  return resultado;
              }else{
               entorno=aux;
               return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
              }
              
          }else{ 
           entorno=aux;
                  return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
              }
          
      }
      
  }
}
} catch (error) {
  console.log("ERROR EN PROCESAR IFELSE")
} 
}

function procesarSwitch(instruccion, tablaDeSimbolos,fun) {
  try{
   
  if (erroreslist.length==0){
      const valorExpresion = procesarExpresionCadena(instruccion.expresionNumerica, tablaDeSimbolos);
      const tsSwitch = new TS([], tablaDeSimbolos);
      let resultado ={ encontroBreak: false,  valorReturn: undefined, encontroContinue:false };
      let salir = false;
      let aux=entorno;
      
      entorno=entorno+" - Sentencia Switch";
      instruccion.casos.some(caso => {
          if (!salir) {
              if (caso.tipo === TIPO_OPCION_SWITCH.CASO) {

                  const valorExpCase = procesarExpresionCadena(caso.expresionNumerica, tsSwitch);

                  if (valorExpCase.valor === valorExpresion.valor ) {
     
                      if (!salir) {
                          resultado = procesarBloque(caso.instrucciones, tsSwitch,fun);

                          if (erroreslist.length==0){
                              
                              if (resultado.encontroBreak==true) {
                                  salir = true;
                              }
                              if (resultado.valorReturn!=undefined|| resultado.encontroContinue==true){
                                
                                  return true;
                              }
                          }else{
                              return true;
                          }
                      }
              
                  }
              } else if (caso.tipo === TIPO_OPCION_SWITCH.DEFECTO) {
                  
                      if (!salir) {
                          resultado = procesarBloque(caso.instrucciones, tsSwitch,fun);
                         
                          if (erroreslist.length==0){
                              if (resultado.encontroBreak==true) {
                                  salir = true;
                              }
                              if (resultado.valorReturn!=undefined|| resultado.encontroContinue==true){
                                  
                                  return true;
                              } 
                          } else{
                            
                              return true;
                          }
                      }
                  salir = true; // Salir automáticamente después de ejecutar el default
              }
          }
      });
      if (erroreslist.length==0){
       entorno=aux;
          return resultado;
                          
      }else{
       entorno=aux;
          return{ encontroBreak: false,  valorReturn: undefined, encontroContinue:false }
      }
  }
} catch (error) {
  console.log("ERROR EN PROCESAR SWITCH")
} 
}

function procesarAumentos(instruccion,tablaDeSimbolos){
  try{
  let simbolos= tablaDeSimbolos.obtener(instruccion.identificador)
    
  if ((Array.isArray(simbolos) && simbolos[0].tipo != "Semantico") || (!Array.isArray(simbolos) && simbolos.tipo != "Semantico")){
      if (simbolos.tipo==TIPO_DATO.DOUBLE|| simbolos.tipo==TIPO_DATO.INT){
          let erroractualizacion;
          if ( instruccion.tipodato=="INCREMENTO"){
                  erroractualizacion=tablaDeSimbolos.actualizar(simbolos.id, {valor:simbolos.valor+1,tipo:simbolos.tipo},instruccion.linea,instruccion.columna);
          }else{
                  erroractualizacion=tablaDeSimbolos.actualizar(simbolos.id, {valor:simbolos.valor-1,tipo:simbolos.tipo},instruccion.linea,instruccion.columna);
          }
              
          if (erroractualizacion.length!=0){
              erroreslist.push(...erroractualizacion);
          }
      }else{
          erroreslist.push({tipo:"Semantico",descripcion:'No puede realizarse incremento/decremento en una variable de tipo '+simbolos,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
      }
  }else{
      erroreslist.push(...simbolos)
  }
} catch (error) {
  console.log("ERROR EN PROCESAR AUMENTOS")
}             
}

function procesarPara(instruccion, tablaDeSimbolos,fun) {
  try{
   let aux=entorno;
   if (instruccion.variable.tipo!=TIPO_INSTRUCCION.ASIGNACION){
        entorno=entorno+" - Ciclo For";
      procesarDecAsig(instruccion.variable, tablaDeSimbolos);
  }else{
      procesarAsignacion(instruccion.variable, tablaDeSimbolos)
  }
  
  if (erroreslist.length==0){
  
      for (var i = tablaDeSimbolos.obtener(instruccion.variable.identificador).valor; procesarExpresionLogica(instruccion.expresionLogica, tablaDeSimbolos,1).valor;
      (instruccion.aumento.tipo == TIPO_INSTRUCCION.ASIGNACION) ? procesarAsignacion(instruccion.aumento,tablaDeSimbolos) : procesarAumentos(instruccion.aumento,tablaDeSimbolos)) {
          if (erroreslist.length==0){
              const tsPara = new TS([], tablaDeSimbolos);
              ciclo="para";
              const resultado =procesarBloque(instruccion.instrucciones, tsPara,fun);
         
              ciclo="para1";
              if (erroreslist.length==0){
     
                  if (resultado.valorReturn!=undefined){
                    
                      ciclo=null;
                      entorno=aux;
                       return resultado;
                       
                   }
                   if (resultado.encontroBreak==true){
                      ciclo=null;
                      break;
                  }
                 
              }else{
               entorno=aux;
                      return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
                  }
              
            
          }else{
              ciclo=null;
              break;
          }
          
          
      } 
      
  }
  ciclo=null;
  entorno=aux;
  return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
} catch (error) {
  console.log("ERROR EN PROCESAR CICLO PARA")
} 
}


function procesarDoWhile(instruccion, tablaDeSimbolos,fun) {
  try{
   let aux=entorno;
      entorno=entorno+" - Ciclo Do While"

  if (erroreslist.length==0){
      const tsDoWhile = new TS([], tablaDeSimbolos);
      
      do {
          if (erroreslist.length==0){
              ciclo="dowhile";
              const resultado =procesarBloque(instruccion.instrucciones, tsDoWhile,fun);
              ciclo="dowhile1";
              if (erroreslist.length==0){
                  if (resultado.valorReturn!=undefined){
             
                      ciclo=null;
                      entorno=aux;
                       return resultado;
                       
                   }
                   if (resultado.encontroBreak){
                      ciclo=null;
                      break;
                  }
                
              }else{
               entorno=aux;
                      return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
                  }
              
            
          }else{
              ciclo=null;
              break;
          }
      } while (procesarExpresionLogica(instruccion.expresionLogica, tsDoWhile,1).valor);
  }
  ciclo=null;
  entorno=aux;
  return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
} catch (error) {
  console.log("ERROR EN PROCESAR CICLO DO WHILE")
} 
}


function procesarWHILE(instruccion, tablaDeSimbolos,fun) {
try{
   let aux=entorno;
      entorno=entorno+" - ciclo While"
  if (erroreslist.length==0){

      let tsWhile = new TS([], tablaDeSimbolos);
      let condicion = procesarExpresionLogica(instruccion.expresionLogica, tsWhile,1).valor;
      
      while (condicion) {
          if (erroreslist.length==0){
              ciclo="while";
              const resultado =procesarBloque(instruccion.instrucciones, tsWhile,fun);
              condicion = procesarExpresionLogica(instruccion.expresionLogica, tsWhile,1).valor;
            
              ciclo="while1";
              tsWhile = new TS([], tablaDeSimbolos);
              if (erroreslist.length==0){
                  if (resultado.valorReturn!=undefined){
 
                      ciclo=null;
                      entorno=aux;
                       return resultado;
                       
                   }
                   if (resultado.encontroBreak){
                      ciclo=null;
                      break;
                  }
                  
                  
              }else{
               entorno=aux;
                      return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
                  }
          }else{
              ciclo=null;
              break;
              
          }
      }
  }
  ciclo=null;
  entorno=aux;
  return {encontroBreak:false, valorReturn:undefined, encontroContinue:false}
} catch (error) {
  console.log("ERROR EN PROCESAR CICLO WHILE")
} 
}




function procesarModiCadena(instruccion, tablaDeSimbolos){
try{
  if (erroreslist.length==0){
      if (instruccion.tipo==TIPO_EXPRESION.LOWER){
          const cadena = procesarExpresionCadena(instruccion.expresionCadena, tablaDeSimbolos).valor;
          const nuevostring = cadena.toString();
          const nuevacadena = nuevostring.toLowerCase();
          return {valor:nuevacadena,tipo:TIPO_DATO.STRING};
      }else if(instruccion.tipo==TIPO_EXPRESION.UPPER){
          const cadena = procesarExpresionCadena(instruccion.expresionCadena, tablaDeSimbolos).valor;
          const nuevostring = cadena.toString();
          const nuevacadena = nuevostring.toUpperCase();
          return {valor:nuevacadena,tipo:TIPO_DATO.STRING};
      }else{
          erroreslist.push({tipo:"Semantico",descripcion:'Tipo de expresion no valida ',lineaerror:instruccion.linea,columnaerror:instruccion.columna})
      }
  }
} catch (error) {
  console.log("ERROR EN PROCESAAR MANEJO DE CADENAS")
} 
}

function procesarCasteos(instruccion, tablaDeSimbolos){
  try{
  if (erroreslist.length==0){
   
      const valor = procesarExpresionCadena(instruccion.expresion, tablaDeSimbolos);
     
      if (erroreslist.length==0){
          if ([TIPO_DATO.DOUBLE,TIPO_DATO.CHAR].includes(valor.tipo)&& instruccion.castear==TIPO_DATO.INT){
              let myint;
              if (TIPO_DATO.DOUBLE==valor.tipo){
                  myint = Math.floor(valor.valor); 

              }else{
                  myint = parseInt(valor.valor); 
              }
           
              return {valor: myint,tipo:TIPO_DATO.INT};
          
          }else  if ([TIPO_DATO.INT,TIPO_DATO.CHAR].includes(valor.tipo)&& instruccion.castear==TIPO_DATO.DOUBLE){
              let mydouble;
              if (TIPO_DATO.CHAR==valor.tipo){
                  mydouble = parseInt(valor.valor); 

              }else{
                  mydouble = valor.valor; 
              }
         
              return {valor: mydouble,tipo:TIPO_DATO.DOUBLE};
          
          }else {
           
              erroreslist.push({tipo:"Semantico",descripcion:'No se puede castear un tipo de dato '+valor.tipo+' a un '+instruccion.castear,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
          }
      }
  }
} catch (error) {
  console.log("ERROR EN PROCESAR CASTEO  NUMERICO")
} 
}
function procesarCasteosString(instruccion, tablaDeSimbolos){
 try {
  if (erroreslist.length==0){
     
      const valor = procesarExpresionCadena(instruccion.expresion, tablaDeSimbolos);
    
      if (erroreslist.length==0){
           if ([TIPO_DATO.INT,TIPO_DATO.DOUBLE].includes(valor.tipo)&& instruccion.castear==TIPO_DATO.STRING){
              let mystring = valor.valor.toString(); 

              return {valor: mystring,tipo:TIPO_DATO.STRING};
          
          }else if (TIPO_DATO.INT==valor.tipo&& instruccion.castear==TIPO_DATO.CHAR){
              let mychar =String.fromCharCode( valor.valor); 

              return {valor: mychar,tipo:TIPO_DATO.CHAR};
          
          }else{
              erroreslist.push({tipo:"Semantico",descripcion:'No se puede castear un tipo de dato '+valor.tipo+' a un '+instruccion.castear,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
          }
      }
  }
 } catch (error) {
   console.log("ERROR EN PROCESAR  CASTEO PARA STRING")
 } 
 
}
function procesarNativasNumericas(instruccion, tablaDeSimbolos){
  try {
   if (erroreslist.length==0){
       const valor = procesarExpresionCadena(instruccion.expresion, tablaDeSimbolos);
       
       if (erroreslist.length==0){
            if ([TIPO_DATO.STRING,"VECTOR","LISTA"].includes(valor.tipo)&& instruccion.tipo==TIPO_EXPRESION.LENGTH){

               let mystring = valor.valor.length; 
              //falta para listas /verctores
               return {valor: mystring,tipo:TIPO_DATO.INT};
           
           }else if ([TIPO_DATO.INT,TIPO_DATO.DOUBLE].includes(valor.tipo)&& instruccion.tipo==TIPO_EXPRESION.TRUNC){
               let mynum =Math.trunc(valor.valor); 

               return {valor: mynum,tipo:TIPO_DATO.INT};
           
           }else if ([TIPO_DATO.INT,TIPO_DATO.DOUBLE].includes(valor.tipo)&& instruccion.tipo==TIPO_EXPRESION.ROUND){
              let mynum =Math.round(valor.valor); 

              return {valor: mynum,tipo:TIPO_DATO.INT};
          
          }else{
               erroreslist.push({tipo:"Semantico",descripcion:'No se puede ejecutar la funcion '+instruccion.tipo+' con un '+valor.tipo,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
           }
       }
   }
  } catch (error) {
    console.log("ERROR EN PROCESAR FUNCIONES NATIVAS NUMERICAS")
  } 
  
}

function procesarNativas(instruccion, tablaDeSimbolos){
  try {
   if (erroreslist.length==0){
      
       const valor = procesarExpresionCadena(instruccion.expresion, tablaDeSimbolos);
     
       if (erroreslist.length==0){
            if (instruccion.tipo==TIPO_EXPRESION.TYPEO){
               
               return {valor: valor.tipo,tipo:TIPO_DATO.STRING};
           
           }else if ([TIPO_DATO.INT,TIPO_DATO.DOUBLE,TIPO_DATO.BOOLEAN].includes(valor.tipo)&& instruccion.tipo==TIPO_EXPRESION.TOSTRING){
               let mystring =valor.valor.toString(); 

               return {valor: mystring,tipo:TIPO_DATO.STRING};
           
           }else{
               erroreslist.push({tipo:"Semantico",descripcion:'No se puede ejecutar la funcion '+instruccion.tipo+' con un '+valor.tipo,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
           }
       }
   }
  } catch (error) {
    console.log("ERROR EN PROCESAR FUNCIONES NATIVAS")
  } 
  
}
function procesarTochar(instruccion, tablaDeSimbolos){
   try {
    if (erroreslist.length==0){
     
        const valor = procesarExpresionCadena(instruccion.tipoinstancia.expresion, tablaDeSimbolos);
         
        if (erroreslist.length==0){
             if (valor.tipo==TIPO_DATO.STRING){
               let listac;

               for (let i = 0; i < valor.valor.length; i++) {
                   listac={valor:valor.valor[i],tipo:TIPO_DATO.CHAR};
                   let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.id,{op:"a",valor:listac,tipo:"LISTA"},instruccion.linea,instruccion.columna);
                   if (erroractualizacion.length!=0){
                       erroreslist.push(...erroractualizacion);
                   }
               }
               
            
            }else{
                erroreslist.push({tipo:"Semantico",descripcion:'No se puede ejecutar la funcion '+instruccion.tipo+' con un '+valor.tipo,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
            }
        }
    }
   } catch (error) {
     console.log("ERROR EN PROCESAR FUNCIONES NATIVAS")
   } 
   
}


function procesarDecVector(instruccion, tablaDeSimbolos){
   try {
       if (erroreslist.length==0){
          
           let erroragregar=tablaDeSimbolos.agregar(instruccion.id,"VECTOR",instruccion.tipodato,entorno,instruccion.linea,instruccion.columna);
           
           if (erroragregar.length==0){
               
            if (!tsReporte.some(e => e.id === instruccion.id && e.entorno === entorno)) {
                               
                tsReporte.push(tablaDeSimbolos.obtener(instruccion.id, instruccion.linea,instruccion.columna));
            }  
               let valor=[];
               if (Array.isArray(instruccion.declaracion)){
                 
                   instruccion.declaracion.some(item => {
                       let Result = procesarExpresionCadena(item, tablaDeSimbolos); 
                       if (Result.tipo==instruccion.tipodato){
                           valor.push(Result);
                       }
                   });
                   if (valor.length!=instruccion.declaracion.length){
                       erroreslist.push({tipo:"Semantico",descripcion:'No es valido asignar un valor diferente a '+instruccion.tipodato+' al  vector '+instruccion.id,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
                   }
               }else{
                   
                   if(instruccion.declaracion.tipodato==instruccion.tipodato){
                       let valdef;
                       if (instruccion.tipodato==TIPO_DATO.INT){
                           valdef={valor:0,tipo:instruccion.tipodato};
                       }else if (instruccion.tipodato==TIPO_DATO.DOUBLE){
                           valdef={valor:parseFloat(0.0),tipo:instruccion.tipodato};
                       }else if (instruccion.tipodato==TIPO_DATO.STRING){
                           valdef={valor:"",tipo:instruccion.tipodato};
                       }else if (instruccion.tipodato==TIPO_DATO.CHAR){
                           valdef={valor:'\u0000',tipo:instruccion.tipodato};
                       }else if (instruccion.tipodato==TIPO_DATO.BOOLEAN){
                           valdef={valor:true,tipo:instruccion.tipodato};
                       }
                      
                       for (let i = 0; i < instruccion.declaracion.tam.valor; i++) {
                           valor.push(valdef);
                       }
                        
                   }else{
                       erroreslist.push({tipo:"Semantico",descripcion:'No es valido asignar un valor diferente a '+instruccion.tipodato+' al vector '+instruccion.id,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
                   }
               }
               if (erroreslist.length==0){
                   
                   let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.id,{op:"a",valor:valor,tipo:"VECTOR"},instruccion.linea,instruccion.columna);       
                   if (erroractualizacion.length!=0){
                       erroreslist.push(...erroractualizacion);
                   }
               }
              
           }else{
               erroreslist.push(...erroragregar);
           }
       }
   } catch (error) {
     console.log("ERROR EN PROCESAR DECLARACION DE VECTORES")
   } 
   
}

function procesarDecList(instruccion, tablaDeSimbolos){
   try {
       if (erroreslist.length==0){
          
           let erroragregar=tablaDeSimbolos.agregar(instruccion.id,"LISTA",instruccion.tipodato,entorno,instruccion.linea,instruccion.columna);
           
           if (erroragregar.length==0){
               
            if (!tsReporte.some(e => e.id === instruccion.id && e.entorno === entorno)) {
                               
                tsReporte.push(tablaDeSimbolos.obtener(instruccion.id, instruccion.linea,instruccion.columna));
            }  

               
               if(instruccion.tipoinstancia!=instruccion.tipodato){
                   if (instruccion.tipoinstancia.tipo==TIPO_EXPRESION.CHARARRAY && instruccion.tipodato==TIPO_DATO.CHAR){
                       
                       procesarTochar(instruccion, tablaDeSimbolos)
                   }else{
                       erroreslist.push({tipo:"Semantico",descripcion:'No es valido asignar un valor diferente a '+instruccion.tipodato+' a la lista '+instruccion.id,lineaerror:instruccion.linea,columnaerror:instruccion.columna})
                   }
                   
               }
               
               
              
           }else{
               erroreslist.push(...erroragregar);
           }
       }
   } catch (error) {
     console.log("ERROR EN PROCESAR DECLARACION DE LISTAS")
   } 
   
}

function procesarAgregarElement(instruccion, tablaDeSimbolos) {
   try{
   if (erroreslist.length==0){

       if (instruccion.expresion.tipo=="LLAMADA"){
           let datosfuncion=tablaDeSimbolos.obtener(instruccion.expresion.identificador,instruccion.linea,instruccion.columna);

           if ((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){
               if (datosfuncion.tipo=="FUNCION"){

              
                   const valor = procesarFuncion(instruccion.expresion, tablaDeSimbolos); 
                   if (erroreslist.length==0){
                   let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.id,{op:"a",valor:valor,tipo:"LISTA"},instruccion.linea,instruccion.columna);
                   if (erroractualizacion.length!=0){
                       erroreslist.push(...erroractualizacion);
                   }
               }  
                   
               }else{
                   erroreslist.push({tipo:"Semantico",descripcion:'Se esta intentando asignar un metodo ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
               }
           }  else{
               erroreslist.push(...datosfuncion)
           }
               
       }else{
           

           const valor =procesarExpresionCadena(instruccion.expresion, tablaDeSimbolos);
        
           let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.id,{op:"a",valor:valor,tipo:"LISTA"},instruccion.linea,instruccion.columna);
           if (erroractualizacion.length!=0){
               erroreslist.push(...erroractualizacion);
           }
       }
   }
} catch (error) {
   console.log("ERROR EN PROCESAR DATOS PARA AGREGAR A LISTA")
 } 
}

function procesarModifiElement(instruccion, tablaDeSimbolos) {
   try{
   if (erroreslist.length==0){
       
       if (instruccion.expresion.tipo=="LLAMADA"){
           let datosfuncion=tablaDeSimbolos.obtener(instruccion.expresion.identificador,instruccion.linea,instruccion.columna);

           if ((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){
               if (datosfuncion.tipo=="FUNCION"){

                   const valor = procesarFuncion(instruccion.expresion, tablaDeSimbolos); 
                   const pos=procesarApoyo(instruccion.posicion, tablaDeSimbolos)

                   if (erroreslist.length==0){
                       
                       let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.id,{op:pos.valor,valor:valor,tipo:instruccion.tipodato},instruccion.linea,instruccion.columna);
                       if (erroractualizacion.length!=0){
                           erroreslist.push(...erroractualizacion);
                       }
                   }  
                   
               }else{
                   erroreslist.push({tipo:"Semantico",descripcion:'Se esta intentando asignar un metodo ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
               }
           }  else{
               erroreslist.push(...datosfuncion)
           }
               
       }else{
           

           const valor =procesarExpresionCadena(instruccion.expresion, tablaDeSimbolos);
           const pos=procesarApoyo(instruccion.posicion, tablaDeSimbolos)
           if (erroreslist.length==0){
              
               let erroractualizacion=tablaDeSimbolos.actualizar(instruccion.id,{op:pos.valor,valor:valor,tipo:instruccion.tipodato},instruccion.linea,instruccion.columna);
               if (erroractualizacion.length!=0){
                   erroreslist.push(...erroractualizacion);
               }
           }
       }
   }
} catch (error) {
   console.log("ERROR EN PROCESAR MODIFICACIONES DE ESTRUCTURAS")
 } 
}
function procesarApoyo(instruccion, tablaDeSimbolos) {
   try{
   if (erroreslist.length==0){

       if (instruccion.tipo=="LLAMADA"){
           let datosfuncion=tablaDeSimbolos.obtener(instruccion.identificador,instruccion.linea,instruccion.columna);

           if ((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){
               if (datosfuncion.tipo=="FUNCION"){

              
                   return procesarFuncion(instruccion, tablaDeSimbolos); 
               }else{
                   erroreslist.push({tipo:"Semantico",descripcion:'Se esta intentando asignar un metodo ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
               }
           }  else{
               erroreslist.push(...datosfuncion)
           }
               
       }else{
           return procesarExpresionCadena(instruccion, tablaDeSimbolos);
        
       }
   }
} catch (error) {
   console.log("ERROR EN PROCESAR APOYO")
 } 
}

function procesarAccesos(instruccion, tablaDeSimbolos) {
   try{
   if (erroreslist.length==0){

       
           let datosfuncion=tablaDeSimbolos.obtener(instruccion.id,instruccion.linea,instruccion.columna);

           if ((Array.isArray(datosfuncion) && datosfuncion[0].tipo != "Semantico") || (!Array.isArray(datosfuncion) && datosfuncion.tipo != "Semantico")){

               const pos=procesarApoyo(instruccion.posicion, tablaDeSimbolos)
               if (erroreslist.length==0){
                   if (["VECTOR","LISTA"].includes(datosfuncion.tipo)){
                       if (datosfuncion.tipo==instruccion.tipodato){
                           if (pos.valor<0){
                               erroreslist.push({tipo:"Semantico",descripcion:'Se ha intentado modificar a un índice ilegal para la lista ' +datosfuncion.id ,lineaerror:instruccion.linea,columnaerror:instruccion.columna});
                           }else if(pos.valor>datosfuncion.valor.length-1){
                               erroreslist.push({tipo:"Semantico",descripcion:'Se ha intentado modificar a un índice ilegal para la lista ' + datosfuncion.id ,lineaerror:instruccion.linea,columnaerror:instruccion.columna});
                           }else{
                               
                               return { tipo: 'VAL_'+datosfuncion.valor[pos.valor].tipo, valor: datosfuncion.valor[pos.valor].valor, linea: instruccion.linea, columna: instruccion.columna}
                               
                           }
                       }else{
                           erroreslist.push({tipo:"Semantico",descripcion:'Se esta accesando a ' +datosfuncion.id+ " de forma incorrecta" ,lineaerror:instruccion.linea,columnaerror:instruccion.columna});
                       }
                      
                   }else{
                       erroreslist.push({tipo:"Semantico",descripcion: datosfuncion.valor.id +' no es un objeto Lista/Vector ',lineaerror:instruccion.linea,columnaerror:instruccion.columna});
                   }
                  
               }
               
           }  else{
               erroreslist.push(...datosfuncion)
           }
       
   }
} catch (error) {
   console.log("ERROR EN PROCESAR ACCESO")
 } 
}



 function procesarPRINT(instruccion, tablaDeSimbolos) {
    try{
    if (erroreslist.length==0){
        
       
        console.log(instruccion)
        const cadena = procesarExpresionCadena(instruccion.expresionCadena, tablaDeSimbolos);
 
        if (erroreslist.length==0){
            console.log("sdfsdf")
            if (["VECTOR", "LISTA"].includes(cadena.tipo)){
                let vals = cadena.valor.map(function(obj) {
                    return obj.valor;
                }); 
              
                console.log('> ' + vals);
                consoleEditor.setValue(consoleEditor.getValue()+'> ' + vals+"\n");
             }else{
                consoleEditor.setValue(consoleEditor.getValue()+'> ' + cadena.valor+"\n");
             }
           
        }
 
    }
 } catch (error) {
    console.log("ERROR EN PROCESAR FUNCION PRINT")
  } 
 }

 function verificarErrores() {
    let graphts="";
    let grapherror="";
   try{
        graphts=generateSimbolos(tsReporte);
        grapherror="";
        if (erroreslist.length > 0) {

                grapherror=generateERRORES(erroreslist, 1); 
            let nuevaLista = erroreslist.map(function(obj) {
                return  obj.descripcion+' , en linea: ' +obj.lineaerror+' y columna: ' +obj.columnaerror;
            });
            const stringd = nuevaLista.join("\n");
            console.log("errores final", erroreslist)
                consoleEditor.setValue(consoleEditor.getValue()+'--> ' + stringd+"\n");
                

        }

} catch (error) {
   console.log("ERROR EN COMPROBACION DE ERRORES FINAL")
 } 
 console.log("==================================ts")
 console.log(graphts)
 console.log("==================================errs")
 console.log(grapherror)
return {ts:graphts,errort:grapherror};


}


 