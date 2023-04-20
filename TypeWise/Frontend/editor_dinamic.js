/*CodeMirror.defineMode("typewise", function() {
    return {
      token: function(stream) {
        if (stream.match("if") || stream.match("else")) {
          return "keyword";
        }
        if (stream.match("true") || stream.match("false")) {
          return "atom";
        }
        stream.next();
        return null;
      }
    };
  });*/

  /*CodeMirror.defineMode("mimodo", function(config, parserConfig) {
  // Crea una instancia del analizador de Jison
  var parser = new MiAnalizadorJison();

  return {
    token: function(stream, state) {
      // Utiliza el analizador de Jison para obtener el siguiente token
      var token = parser.getNextToken(stream);

      // Devuelve la clase CSS adecuada para este token
      if (token.type === "palabraclave") {
        return "cm-keyword";
      } else if (token.type === "variable") {
        return "cm-variable";
      } else {
        // ...
      }
    }
  };
});
  
  "int"			    return 'T_INT';
"double"			return 'T_DOUBLE';
"boolean"			return 'T_BOOLEAN';
"char"			    return 'T_CHAR';
"string"			return 'T_STRING';
"switch"			return 'T_SWITCH';
"case"				return 'T_CASE';
"default"			return 'T_DEFAULT';
"if"				return 'T_IF';
"else"				return 'T_ELSE';
"do"				return 'T_DO';
"while"				return 'T_WHILE';
"for"				return 'T_FOR';
"list"				return 'T_LIST';
"add"				return 'T_ADD';
"new"				return 'T_NEW';
"break"				return 'T_BREAK';
"continue"			return 'T_CONTINUE';
"return"			return 'T_RETURN';
"true"				return 'T_TRUE';
"false"				return 'T_FALSE';
"print"				return 'T_PRINT';
"void"				return 'T_VOID';
"length"			return 'T_LENGTH';
"typeof"			return 'T_TYPEOF';
"tolower"			return 'T_TOLOWER';
"toupper"			return 'T_TOUPPER';
"tostring"			return 'T_TOSTRING';
"tochararray"		return 'T_TOCHARARRAY';
"truncate"			return 'T_TRUNCATE';
"round"			    return 'T_ROUND';
"main"				return 'T_MAIN'; */

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