function generateERRORES(instructions, op) {
    let dot = 'digraph G {\n';
    dot += `   bgcolor="#1c1c1c";
      node [shape=plaintext]
      mytable [label=<
        <table border="1" cellborder="1" cellspacing="0">
     
              <tr>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">No.</font></td>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">ERROR</font></td>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">DESCRIPCION</font></td>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">LINEA</font></td>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">COLUMNA</font></td>
              </tr>`;
 
    instructions.forEach((instruction, index) => {
   
      if(op==1){
        dot += `
        <tr>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${index+1}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.tipo}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.descripcion}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.lineaerror}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.columnaerror}</td>
        </tr>`;
      }else{
        dot += `
        <tr>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${index+1}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.tipo}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.texto}${instruction.token}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.linea}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.columna}</td>
        </tr>`;
      }
       
     
    }); 
    dot += `          </table>>];
  }`;
  
    return dot;
  }

  function generateSimbolos(instructions) {
    let dot = 'digraph G {\n';
    dot += `      bgcolor="#1c1c1c";
      node [shape=plaintext]
      mytable [label=<
          <table border="1" cellborder="1" cellspacing="0" color="#0e9df6">
          
              <tr>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">IDENTIFICADOR</font></td>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">TIPO</font></td>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">TIPO</font></td>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">ENTORNO</font></td>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">LINEA</font></td>
                  <td style="white-space: nowrap; min-width: 100px;" bgcolor="#0e9df6"><font color="white">COLUMNA</font></td>
              </tr>`;

    
    instructions.forEach(instruction => {
        dot += `
        <tr>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.id}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.tipo}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.tipodato}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.entorno}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.linea}</td>
            <td style="white-space: nowrap; min-width: 100px;" bgcolor="white">${instruction.columna}</td>
        </tr>`;
     
    });

    dot += `          </table>>];
  }`;

    return dot;
  }