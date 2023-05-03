
function generateDot(instructions) {
  let dot = 'digraph G {\n';
  dot += `   bgcolor="#1c1c1c";
  node [shape=record, style=filled, fillcolor="#0e9df6", fontcolor=white]
  edge [color=white]`;
  dot += '  start [label="INSTRUCCIONES"]\n';
  let nodeId = 0;
  instructions.forEach((instruction, index) => {
    
    if (instruction.tipo=="SENTENCIA_MAIN"){
      dot += `node${index} [label="${instruction.tipo}"];\n`;
      dot += `node${index}_a [label="${instruction.id}"];\n  node${index}-> node${index}_a\n`;
      dot += generateInstructionDot([instruction.run], index);
     
      dot += `\n  start -> node${index}\n`;
    }else if(instruction.tipo=="INSTR_DECLARACION"){
      dot += `node${index} [label="${instruction.tipo}"];\n`;
      dot += `node${index}_a [label="${instruction.tipo_dato}"]; \n node${index}-> node${index}_a\n`;
      dot += `node${index}_b [label="${instruction.identificador}"];\n  node${index}-> node${index}_b\n`;
      dot += `  start -> node${index}\n`;
    }else if(instruction.tipo=="INSTR_DECLARACION_CON_ASIGNACION"){
      dot += `node${index} [label="${instruction.tipo}"];\n`;
      dot += `node${index}_a [label="${instruction.tipo_dato}"];\n  node${index}-> node${index}_a\n`;
      dot += `node${index}_b [label="${instruction.identificador}"];\n  node${index}-> node${index}_b\n`;
      dot += `node${index}_c [label="VALOR_ASIGNADO"];\n  node${index}-> node${index}_c\n`;
      dot += generateInstructionDot([instruction.valor], index+"_c");
      dot += `\n  start -> node${index}\n`;
    }else if(instruction.tipo=="INSTR_ASIGNACION"){
      dot += `node${index} [label="${instruction.tipo}"];\n`;
      dot += `node${index}_a [label="${instruction.identificador}"];\n  node${index}-> node${index}_a\n`;
      dot += `node${index}_b [label="VALOR_ASIGNADO"];\n  node${index}-> node${index}_b\n`;
      dot += generateInstructionDot([instruction.expresionNumerica], index+"_b");
      dot += `\n  start -> node${index}\n`;
    }else if(instruction.tipo=="INST_MODIFICACION"){
      dot += `node${index} [label="${instruction.tipo}"];\n`;
      dot += `node${index}_a [label="${instruction.tipodato}"];\n  node${index}-> node${index}_a\n`;
      dot += `node${index}_b [label="${instruction.id}"];\n  node${index}-> node${index}_b\n`;
      dot += `node${index}_c [label="EXP_POSICION"];\n  node${index}-> node${index}_c\n`;
      dot += generateInstructionDot([instruction.posicion], index+"_c");
      dot += `\nnode${index}_d [label="EXP_NUEVO_VALOR"];\n  node${index}-> node${index}_d\n`;
      dot += generateInstructionDot([instruction.expresion], index+"_d");
      dot += `\n  start -> node${index}\n`;
    }else if(instruction.tipo=="INST_ADD"){
      dot += `node${index} [label="${instruction.tipo}"];\n`;
      dot += `node${index}_a [label="${instruction.id}"];\n  node${index}-> node${index}_a\n`;
      dot += `node${index}_b [label="EXP_VALOR"];\n  node${index}-> node${index}_b\n`;
      dot += generateInstructionDot([instruction.expresion], index+"_b");
      dot += `\n  start -> node${index}\n`;
    }else if(['INST_DECLARACION_LISTA','INST_DECLARACION_VECTOR'].includes(instruction.tipo)){
      dot += `node${index} [label="${instruction.tipo}"];\n`;
      dot += `node${index}_a [label="${instruction.id}"];\n  node${index}-> node${index}_a\n`;
     
      if ('INST_DECLARACION_LISTA'==instruction.tipo && instruction.tipoinstancia.tipo=="EXP_TOCHARARRAY"){
          dot += `node${index}_b [label="EXP_ASIGNACION"];\n  node${index}-> node${index}_b\n`;
          dot += generateInstructionDot([instruction.tipoinstancia], index+"_b");
      }
      if ('INST_DECLARACION_LISTA'==instruction.tipo && instruction.tipoinstancia.tipo!="EXP_TOCHARARRAY"){
      
          dot += `node${index}_b [label="LISTA DE ${instruction.tipoinstancia}"];\n  node${index}-> node${index}_b\n`;
      }
      if ('INST_DECLARACION_VECTOR'==instruction.tipo){
          if (Array.isArray(instruction.declaracion)){
              dot += `node${index}_b [label="EXP_ASIGNACION"];\n  node${index}-> node${index}_b\n`;     
              
              dot += generateInstructionDot(instruction.declaracion, index+"_b");
              
          }else{
            
              dot += `node${index}_b [label="EXP_TAMAÑO: ${instruction.declaracion.tam.valor}"];\n  node${index}-> node${index}_b\n`;
          }
      }
     
      dot += `\n  start -> node${index}\n`;
    }else if(instruction.tipo=="FUNCION"){
      dot += `node${index} [label="INSTR_${instruction.tipo}"];\n`;
      dot += `node${index}_a [label="${instruction.tipodato}"];\n  node${index}-> node${index}_a\n`;
      dot += `node${index}_b [label="${instruction.id}"];\n  node${index}-> node${index}_b\n`;
      dot += `node${index}_c [label="PARAMETROS"];\n  node${index}-> node${index}_c\n`;
      dot += generateInstructionDot(instruction.parametros, index+"_c");
      dot += `\nnode${index}_d [label="INSTRUCCIONES"];\n  node${index}-> node${index}_d\n`;
      dot += generateInstructionDot(instruction.instrucciones, index+"_d");
      dot += `\n  start -> node${index}\n`;
    }else if(instruction.tipo=="METODO"){
      dot += `node${index} [label="INSTR_${instruction.tipo}"];\n`;
      dot += `node${index}_a [label="${instruction.tipodato}"];\n  node${index}-> node${index}_a\n`;
      dot += `node${index}_b [label="${instruction.id}"];\n  node${index}-> node${index}_b\n`;
      dot += `node${index}_c [label="PARAMETROS"];\n  node${index}-> node${index}_c\n`;
      dot += generateInstructionDot(instruction.parametros, index+"_c");
      dot += `\nnode${index}_d [label="INSTRUCCIONES"];\n  node${index}-> node${index}_d\n`;
      dot += generateInstructionDot(instruction.instrucciones, index+"_d");
      dot += `\n  start -> node${index}\n`;
    }
   
   // dot += generateInstructionDot(instruction, nodeId);
   // nodeId += Object.keys(instruction).length - 2;
  });
  dot += '}';
  return dot;
}



function generateInstructionDot(instructiones, index){
  let dot1 = '';
  let nodonumber="";
 

  
  instructiones.forEach((instruction, index1) => {
      nodonumber=`${index}_${index1}`;
       if(instruction.tipo=="INSTR_DECLARACION"){
        dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
        dot1 += `node${nodonumber}_a [label="${instruction.tipo_dato}"];  \nnode${nodonumber}-> node${nodonumber}_a\n`;
        dot1 += `node${nodonumber}_b [label="${instruction.identificador}"];  \nnode${nodonumber}-> node${nodonumber}_b\n`;
        dot1 += `  node${index} ->node${nodonumber} \n`;
      }else if(instruction.tipo=="LLAMADA"){
        dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
        dot1 += `node${nodonumber}_a [label="${instruction.identificador}"];  \nnode${nodonumber}-> node${nodonumber}_a\n`;
        dot1 += `node${nodonumber}_b [label="ARGUMENTOS"]; \n node${nodonumber}-> node${nodonumber}_b\n`;
        dot1 += generateInstructionDot(instruction.argumentos, nodonumber+"_b");
        dot1 += `\n  node${index} ->node${nodonumber} \n`;
      }else if(instruction.tipo=="VAL_INT"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.valor}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `  node${index} ->node${nodonumber} \n`;
        }else if(instruction.tipo=="VAL_DOUBLE"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.valor}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `  node${index} ->node${nodonumber} \n`;
        }else if(instruction.tipo=="VAL_BOOLEAN"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.valor}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `  node${index} ->node${nodonumber} \n`;
        }else if(instruction.tipo=="VAL_CHAR"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.valor}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `  node${index} ->node${nodonumber} \n`;
        }else if(instruction.tipo=="VAL_IDENTIFICADOR"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.valor}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `  node${index} ->node${nodonumber} \n`;
        }else if(instruction.tipo=="VAL_STRING"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.valor}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `  node${index} ->node${nodonumber} \n`;
        }else if(instruction.tipo=="INSTR_DECLARACION_CON_ASIGNACION"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1+= `node${nodonumber}_a [label="${instruction.tipo_dato}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `node${nodonumber}_b [label="${instruction.identificador}"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += `node${nodonumber}_c [label="VALOR_ASIGNADO"];\n  node${nodonumber}-> node${nodonumber}_c\n`;
          dot1 += generateInstructionDot([instruction.valor],nodonumber+"_c");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=="INSTR_ASIGNACION"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.identificador}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `node${nodonumber}_b [label="VALOR_ASIGNADO"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot([instruction.expresionNumerica], nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(['OP_SUMA','OP_RESTA','OP_MULTIPLICACION','OP_DIVISION', 'OP_NEGATIVO', 'OP_POTENCIA', 'OP_MODULO', 'RELACIONAL_MAYOR_QUE', 'RELACIONAL_MENOR_QUE','RELACIONAL_MAYOR_IGUAL','RELACIONAL_MENOR_IGUAL', 'RELACIONAL_DOBLE_IGUAL','RELACIONAL_NO_IGUAL','LOGICO_AND','LOGICO_OR','LOGICO_NOT' ].includes(instruction.tipo)){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="OPERADOR_IZQUIERDO"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += generateInstructionDot([instruction.operandoIzq], nodonumber+"_a");
          if (instruction.tipo!='OP_NEGATIVO'){
              dot1 += `\n node${nodonumber}_b [label="OPERADOR_DERECHO"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
              dot1 += generateInstructionDot([instruction.operandoDer], nodonumber+"_b");
          }
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=="OP_TERNARIO"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="EXP_LOGICA"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += generateInstructionDot([instruction.expresionLogica], nodonumber+"_a");
          dot1 += `\nnode${nodonumber}_b [label="INSTR_VERDADERO"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot([instruction.instruccionesIfVerdadero], nodonumber+"_b");
          dot1 += `\nnode${nodonumber}_c [label="INSTR_FALSO"];\n  node${nodonumber}-> node${nodonumber}_c\n`;
          dot1 += generateInstructionDot([instruction.instruccionesIfFalso], nodonumber+"_c");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=="INSTR_AUMENTO_DECREMENTO"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.tipodato}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `node${nodonumber}_b [label="${instruction.identificador}"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += `  node${index} -> node${nodonumber}_a\n`;
        }else if(['EXP_LOWER','EXP_UPPER'].includes(instruction.tipo)){
          dot1 += `node${nodonumber} [label="INSTR_MANEJO_CARACTERES"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.tipo}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `node${nodonumber}_b [label="EXP_A_CONVERTIR"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot([instruction.expresionCadena], nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(['EXP_CASTEO','EXP_CASTEO_NUMERICO'].includes(instruction.tipo)){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.castear}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `node${nodonumber}_b [label="EXP_A_CASTEAR"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot([instruction.expresion], nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(['EXP_LENGTH','EXP_TRUNCATE','EXP_TOCHARARRAY',	'EXP_TOSTRING',	'EXP_TYPEOF','EXP_ROUND'].includes(instruction.tipo)){
          dot1 += `node${nodonumber} [label="${instruction.tipodato}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.tipo}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `node${nodonumber}_b [label="EXPRESION"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot([instruction.expresion], nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(['INT','DOUBLE','BOOLEAN','CHAR', 'STRING'].includes(instruction.tipo)){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.identificador}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `  node${index} ->node${nodonumber} \n`;
        }else if(instruction.tipo=="INSTR_PRINT"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += generateInstructionDot([instruction.expresionCadena], nodonumber);
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=='INSTR_IF'){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="EXP_LOGICA"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += generateInstructionDot([instruction.expresionLogica], nodonumber+"_a");
          dot1 += `\nnode${nodonumber}_b [label="INSTRUCCIONES"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot(instruction.instrucciones, nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=='INSTR_ELSE'){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="EXP_LOGICA"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += generateInstructionDot([instruction.expresionLogica], nodonumber+"_a");
          dot1 += `\nnode${nodonumber}_b [label="INSTR_VERDADERO"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot(instruction.instruccionesIfVerdadero, nodonumber+"_b");
          dot1 += `\nnode${nodonumber}_c [label="INSTR_FALSO"];\n  node${nodonumber}-> node${nodonumber}_c\n`;
          dot1 += generateInstructionDot(instruction.instruccionesIfFalso, nodonumber+"_c");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=='INST_SWITCH'){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="EXP"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += generateInstructionDot([instruction.expresionNumerica], nodonumber+"_a");
          dot1 += `\nnode${nodonumber}_b [label="CASOS"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot(instruction.casos, nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=='CASO'){
          dot1 += `node${nodonumber} [label="INSTR_${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="EXP"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += generateInstructionDot([instruction.expresionNumerica], nodonumber+"_a");
          dot1 += `\nnode${nodonumber}_b [label="INSTRUCCIONES"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot(instruction.instrucciones, nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=='DEFECTO'){
          dot1 += `node${nodonumber} [label="INSTR_DEFAULT"];\n`;
          dot1 += `node${nodonumber}_a [label="INSTRUCCIONES"]; \n node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += generateInstructionDot(instruction.instrucciones, nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=="SENTENCIA DE TRANSFERENCIA"){
          
          if (instruction.tipodato=="RETURN"){
              dot1 += `node${nodonumber} [label="INSTR_${instruction.tipodato}"];\n`;
              dot1 +=  generateInstructionDot([instruction.expresionNumerica], nodonumber);
          }else{
              dot1 += `node${nodonumber} [label="${instruction.tipodato}"];\n`;
          }
         
          dot1 += `\n  node${index} ->node${nodonumber} \n`;
        }else if(['INSTR_WHILE','INSTR_DO_WHILE'].includes(instruction.tipo)){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="EXPRESION_LOGICA"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += generateInstructionDot([instruction.expresionLogica], nodonumber+"_a");
          dot1 += `\nnode${nodonumber}_b [label="INSTRUCCIONES"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot(instruction.instrucciones, nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=='INST_PARA'){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="VARIABLE"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += generateInstructionDot([instruction.variable], nodonumber+"_a");
          dot1 += `\nnode${nodonumber}_b [label="EXP_LOGICA"]; \n node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot([instruction.expresionLogica], nodonumber+"_b");
          dot1 += `\nnode${nodonumber}_c [label="ACTUALIZACION"];\n  node${nodonumber}-> node${nodonumber}_c\n`;
          dot1 += generateInstructionDot([instruction.aumento], nodonumber+"_c");
          dot1 += `\nnode${nodonumber}_d [label="INSTRUCCIONES"];\n  node${nodonumber}-> node${nodonumber}_d\n`;
          dot1 += generateInstructionDot(instruction.instrucciones, nodonumber+"_d");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        } else if(instruction.tipo=="INST_MODIFICACION"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.tipodato}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `node${nodonumber}_b [label="${instruction.id}"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += `node${nodonumber}_c [label="EXP_POSICION"];\n  node${nodonumber}-> node${nodonumber}_c\n`;
          dot1 += generateInstructionDot([instruction.posicion], nodonumber+"_c");
          dot1 += `\nnode${nodonumber}_d [label="EXP_NUEVO_VALOR"];\n  node${nodonumber}-> node${nodonumber}_d\n`;
          dot1 += generateInstructionDot([instruction.expresion], nodonumber+"_d");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=="INST_ADD"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.id}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `node${nodonumber}_b [label="EXP_VALOR"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          dot1 += generateInstructionDot([instruction.expresion], nodonumber+"_b");
          dot1 += `\n node${index} -> node${nodonumber}\n`;
        }else if(['INST_DECLARACION_LISTA','INST_DECLARACION_VECTOR'].includes(instruction.tipo)){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.id}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
         
          if ('INST_DECLARACION_LISTA'==instruction.tipo && instruction.tipoinstancia.tipo=="EXP_TOCHARARRAY"){
              dot1 += `node${nodonumber}_b [label="EXP_ASIGNACION"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
              dot1 += generateInstructionDot([instruction.tipoinstancia], nodonumber+"_b");
          }
          if ('INST_DECLARACION_LISTA'==instruction.tipo && instruction.tipoinstancia.tipo!="EXP_TOCHARARRAY"){
              dot1 += `node${nodonumber}_b [label="LISTA DE ${instruction.tipoinstancia.tipo}"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
          }
          if ('INST_DECLARACION_VECTOR'==instruction.tipo){
              if (Array.isArray(instruction.declaracion)){
                  dot1 += `node${nodonumber}_b [label="EXP_ASIGNACION"];\n  node${nodonumber}-> node${nodonumber}_b\n`;     
                  
                  dot1 += generateInstructionDot(instruction.declaracion, nodonumber+"_b");
                  
              }else{
                  dot1 += `node${nodonumber}_b [label="EXP_TAMAÑO: ${instruction.declaracion.tam}"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
              }
          }
         
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }else if(instruction.tipo=="EXP_ACCESO_ESTRUCT"){
          dot1 += `node${nodonumber} [label="${instruction.tipo}"];\n`;
          dot1 += `node${nodonumber}_a [label="${instruction.id}"];\n  node${nodonumber}-> node${nodonumber}_a\n`;
          dot1 += `node${nodonumber}_b [label="EXP_POSICION"];\n  node${nodonumber}-> node${nodonumber}_b\n`;
        
          dot1 += generateInstructionDot([instruction.posicion], nodonumber+"_b");
          dot1 += `\n  node${index} -> node${nodonumber}\n`;
        }
    
  
 
     // dot += generateInstructionDot(instruction, nodeId);
     // nodeId += Object.keys(instruction).length - 2;
    });
  return dot1;
}

