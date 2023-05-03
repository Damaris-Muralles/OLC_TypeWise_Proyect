

CodeMirror.defineMode("typewise", function() {
    
  return {
    startState: function() {
      return { enComentario: false, enFuncion: false };
      },
      token: function(stream,state) {
        if (state.enComentario) {
          if (stream.match("*/")) {
              state.enComentario = false;
          } else {
              stream.next();
          }
          return "comentario";
        } else if (stream.match("/*")) {
          state.enComentario = true;
          return "comentario";
        }else if  ((stream.sol() || /\s/.test(stream.string.charAt(stream.start - 1))) &&(stream.match(/int/i) || stream.match(/double/i) || stream.match(/boolean/i) || stream.match(/char/i) || stream.match(/string/i))) {
          return "property";
        } else if  ((stream.sol() || /\s/.test(stream.string.charAt(stream.start - 1))) && (stream.match(/switch/i) || stream.match(/if/i) || stream.match(/else/i) || stream.match(/do/i) || stream.match(/while/i) || stream.match(/for/i)) ){
          return "keyword";
        } else if  ((stream.sol() || /\s/.test(stream.string.charAt(stream.start - 1))) && (stream.match(/break/i) || stream.match(/continue/i) || stream.match(/return/i) || stream.match(/case/i) || stream.match(/default/i))) {
          return "atom";
        } else if  ((stream.sol() || /\s/.test(stream.string.charAt(stream.start - 1))) &&(stream.match(/main/i) || stream.match(/void/i)) ){
          return "variable-2";
        } else if ((stream.sol() || /\s/.test(stream.string.charAt(stream.start - 1))) && (stream.match(/length/i) || stream.match(/tochararray/i) || stream.match(/tolower/i) || stream.match(/toupper/i) || stream.match(/round/i) || stream.match(/tostring/i) || stream.match(/truncate/i) || stream.match(/typeof/i))) {
          return "def";
        } else if ((stream.sol() || /\s/.test(stream.string.charAt(stream.start - 1))) && (stream.match(/list/i)) ){
          return "property";
        }else if  ((stream.sol() || /\s/.test(stream.string.charAt(stream.start - 1))) &&(stream.match(/print/i) || stream.match(/add/i)|| stream.match(/new/i))) {
          return "fucionnt";
        } else  if (stream.match(/\d+/)) {
        return "number";
        } else if (stream.match(/\d+\.\d+/)) {
          
          return "atom";
        } else if  ((stream.sol() || /\s/.test(stream.string.charAt(stream.start - 1))) && (stream.match(/true/i) || stream.match(/false/i))) {
            return "variable-2";
        } else if (stream.match("//")) {
        stream.skipToEnd();
        return "comentario";
        } else if (stream.match(/\'[^\']\'/)) {
            return "texto";
        } else if (stream.match(/\"(\\.|[^"\\])*\"/)) {
            return "texto";
        } else if (stream.match(/\w+\s*\(/)) {
          state.enFuncion = true;
          stream.backUp(1);
          return "llamada";
        } else if (state.enFuncion && stream.match("(")) {
          return "bracket1";
        } else if (state.enFuncion && stream.match(")")) {
          state.enFuncion = false;
          return "bracket1";
          
        }

       
        stream.next();
        return null;
      }
    };
  });


  



CodeMirror.defineMIME("text/x-typewise", "typewise");

function myHint(editor, options) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = cursor.ch;
    const currentWord = token.string.slice(0, end - start);
    const suggestions = ["int","double","boolean","char","string"	,"switch"	,"case"	,"default","if"		,"else","do"	,"while","for","list"	,"add","new","break","continue","return","true"	,"false","print","void","length","typeof","tolower","toupper","tostring","tochararray","truncate","round","main"].filter(function(item) {
      return item.toLowerCase().indexOf(currentWord.toLowerCase()) == 0;
    });
    return {
      list: suggestions,
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, end)
    };
}

