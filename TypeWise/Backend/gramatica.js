/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var gramatica = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,7],$V1=[1,5],$V2=[1,6],$V3=[1,8],$V4=[1,9],$V5=[1,10],$V6=[1,11],$V7=[2,5,9,10,14,15,16,17],$V8=[1,28],$V9=[1,23],$Va=[1,24],$Vb=[1,25],$Vc=[1,26],$Vd=[1,27],$Ve=[1,29],$Vf=[1,30],$Vg=[1,36],$Vh=[8,11],$Vi=[1,40],$Vj=[1,39],$Vk=[1,41],$Vl=[1,42],$Vm=[1,43],$Vn=[1,44],$Vo=[8,23,24,25,26,27,28,30,32,33,34,35,36,37,39,40],$Vp=[39,40],$Vq=[2,41],$Vr=[1,50],$Vs=[1,51],$Vt=[1,52],$Vu=[1,53],$Vv=[1,54],$Vw=[1,55],$Vx=[2,40],$Vy=[1,57],$Vz=[1,58],$VA=[8,39,40],$VB=[8,30,32,33,34,35,36,37,39,40],$VC=[8,25,26,27,28,30,32,33,34,35,36,37,39,40];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"instrucciones":4,"EOF":5,"instruccion":6,"tipos":7,"PTCOMA":8,"T_BOOLEAN":9,"IDENTIFICADOR":10,"IGUAL":11,"expresion":12,"expresion_logica":13,"T_INT":14,"T_DOUBLE":15,"T_CHAR":16,"T_STRING":17,"CADENA":18,"ENTERO":19,"DECIMAL":20,"BOOLEANO":21,"CARACTER":22,"MENOS":23,"MAS":24,"POR":25,"DIVIDIDO":26,"POTENCIA":27,"MODULO":28,"PARIZQ":29,"PARDER":30,"expresion_relacional":31,"MAYQUE":32,"MENQUE":33,"MAYIGQUE":34,"MENIGQUE":35,"DOBLEIG":36,"NOIG":37,"expresionescompuestas":38,"AND":39,"OR":40,"NOT":41,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"PTCOMA",9:"T_BOOLEAN",10:"IDENTIFICADOR",11:"IGUAL",14:"T_INT",15:"T_DOUBLE",16:"T_CHAR",17:"T_STRING",18:"CADENA",19:"ENTERO",20:"DECIMAL",21:"BOOLEANO",22:"CARACTER",23:"MENOS",24:"MAS",25:"POR",26:"DIVIDIDO",27:"POTENCIA",28:"MODULO",29:"PARIZQ",30:"PARDER",32:"MAYQUE",33:"MENQUE",34:"MAYIGQUE",35:"MENIGQUE",36:"DOBLEIG",37:"NOIG",39:"AND",40:"OR",41:"NOT"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,3],[6,4],[6,5],[6,5],[6,4],[6,4],[6,1],[7,2],[7,2],[7,2],[7,2],[12,1],[12,1],[12,1],[12,1],[12,1],[12,1],[12,2],[12,3],[12,3],[12,3],[12,3],[12,3],[12,3],[12,3],[31,3],[31,3],[31,3],[31,3],[31,3],[31,3],[13,3],[13,3],[13,2],[13,1],[38,1],[38,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

		// cuado se haya reconocido la entrada completa retornamos el AST
		return $$[$0-1];
	
break;
case 2:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 3:
 this.$ = [$$[$0]]; 
break;
case 4:
 this.$ = instruccionesAPI.nuevoDeclaracion($$[$0-1].identificador,$$[$0-1].tipo); 
break;
case 5:
 this.$ = instruccionesAPI.nuevoDeclaracion($$[$0-1],TIPO_DATO.BOOLEAN); 
break;
case 6:
 this.$ = instruccionesAPI.nuevoDecAsig($$[$0-3].identificador,$$[$0-3].tipo,$$[$0-1]); 
break;
case 7:
 this.$ = instruccionesAPI.nuevoDecAsig($$[$0-3],TIPO_DATO.BOOLEAN,$$[$0-1],"ex"); 
break;
case 8:
 this.$ = instruccionesAPI.nuevoDecAsig($$[$0-3],TIPO_DATO.BOOLEAN,$$[$0-1], "log"); 
break;
case 9: case 10:
 this.$ = instruccionesAPI.nuevoAsignacion($$[$0-3],$$[$0-1]); 
break;
case 11:
 console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
break;
case 12:
 this.$ = {tipo: TIPO_DATO.INT, identificador: $$[$0]}; 
break;
case 13:
 this.$ = {tipo: TIPO_DATO.DOUBLE, identificador: $$[$0]}; 
break;
case 14:
 this.$ = {tipo: TIPO_DATO.CHAR, identificador: $$[$0]}; 
break;
case 15:
 this.$ = {tipo: TIPO_DATO.STRING, identificador: $$[$0]}; 
break;
case 16:
 this.$ = instruccionesAPI.nuevoValor($$[$0], TIPO_VALOR.CADENA); 
break;
case 17:
 this.$ = instruccionesAPI.nuevoValor(Number($$[$0]), TIPO_VALOR.INT); 
break;
case 18:
 this.$ = instruccionesAPI.nuevoValor(Number($$[$0]), TIPO_VALOR.DOUBLE); 
break;
case 19:
 this.$ = instruccionesAPI.nuevoValor($$[$0], TIPO_VALOR.BOOLEAN); 
break;
case 20:
 this.$ = instruccionesAPI.nuevoValor($$[$0].charAt(0), TIPO_VALOR.CARACTER); 
break;
case 21:
 this.$ = instruccionesAPI.nuevoValor($$[$0], TIPO_VALOR.IDENTIFICADOR); 
break;
case 22:
 this.$ = instruccionesAPI.nuevoOperacionUnaria($$[$0], TIPO_OPERACION.NEGATIVO); 
break;
case 23:
  if ($$[$0-2].tipo === TIPO_VALOR.CADENA || $$[$0].tipo == TIPO_VALOR.CADENA||($$[$0-2].tipo === TIPO_VALOR.CARACTER && $$[$0].tipo == TIPO_VALOR.CARACTER)) {
																this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.CONCATENACION);
															} else {
																this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.SUMA);
															}
														
break;
case 24:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.RESTA); 
break;
case 25:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.MULTIPLICACION); 
break;
case 26:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.DIVISION); 
break;
case 27:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.POTENCIA); 
break;
case 28:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.MODULO); 
break;
case 29:
 this.$ = $$[$0-1]; 
break;
case 30:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.MAYOR_QUE); 
break;
case 31:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.MENOR_QUE); 
break;
case 32:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.MAYOR_IGUAL); 
break;
case 33:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.MENOR_IGUAL); 
break;
case 34:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.DOBLE_IGUAL); 
break;
case 35:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.NO_IGUAL); 
break;
case 36:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.AND); 
break;
case 37:
 this.$ = instruccionesAPI.nuevoOperacionBinaria($$[$0-2], $$[$0], TIPO_OPERACION.OR); 
break;
case 38:
 this.$ = instruccionesAPI.nuevoOperacionUnaria($$[$0], TIPO_OPERACION.NOT); 
break;
case 39: case 40: case 41:
 this.$ = $$[$0]; 
break;
}
},
table: [{2:$V0,3:1,4:2,6:3,7:4,9:$V1,10:$V2,14:$V3,15:$V4,16:$V5,17:$V6},{1:[3]},{2:$V0,5:[1,12],6:13,7:4,9:$V1,10:$V2,14:$V3,15:$V4,16:$V5,17:$V6},o($V7,[2,3]),{8:[1,14],11:[1,15]},{10:[1,16]},{11:[1,17]},o($V7,[2,11]),{10:[1,18]},{10:[1,19]},{10:[1,20]},{10:[1,21]},{1:[2,1]},o($V7,[2,2]),o($V7,[2,4]),{10:$V8,12:22,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{8:[1,31],11:[1,32]},{10:$V8,12:33,13:34,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf,31:37,38:35,41:$Vg},o($Vh,[2,12]),o($Vh,[2,13]),o($Vh,[2,14]),o($Vh,[2,15]),{8:[1,38],23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn},o($Vo,[2,16]),o($Vo,[2,17]),o($Vo,[2,18]),o($Vo,[2,19]),o($Vo,[2,20]),o($Vo,[2,21]),{10:$V8,12:45,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:46,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},o($V7,[2,5]),{10:$V8,12:47,13:48,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf,31:37,38:35,41:$Vg},o($Vp,$Vq,{8:[1,49],23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw}),o($Vp,$Vx,{8:[1,56]}),{39:$Vy,40:$Vz},{10:$V8,12:61,13:60,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf,31:37,38:59,41:$Vg},o($VA,[2,39]),o($V7,[2,6]),{10:$V8,12:62,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:63,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:64,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:65,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:66,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:67,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},o($VB,[2,22],{23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn}),{23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn,30:[1,68]},o($Vp,$Vq,{8:[1,69],23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw}),o($Vp,$Vx,{8:[1,70]}),o($V7,[2,9]),{10:$V8,12:71,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:72,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:73,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:74,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:75,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},{10:$V8,12:76,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf},o($V7,[2,10]),{10:$V8,12:61,13:60,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf,31:37,38:77,41:$Vg},{10:$V8,12:61,13:60,18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,29:$Vf,31:37,38:78,41:$Vg},{8:[2,38],39:$Vy,40:$Vz},o($VA,$Vx),o($VA,$Vq,{23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw}),o($Vo,[2,23]),o($Vo,[2,24]),o($VC,[2,25],{23:$Vi,24:$Vj}),o($VC,[2,26],{23:$Vi,24:$Vj}),o($VB,[2,27],{23:$Vi,24:$Vj,25:$Vk,26:$Vl,28:$Vn}),o($VC,[2,28],{23:$Vi,24:$Vj}),o($Vo,[2,29]),o($V7,[2,7]),o($V7,[2,8]),o($VA,[2,30],{23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn}),o($VA,[2,31],{23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn}),o($VA,[2,32],{23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn}),o($VA,[2,33],{23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn}),o($VA,[2,34],{23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn}),o($VA,[2,35],{23:$Vi,24:$Vj,25:$Vk,26:$Vl,27:$Vm,28:$Vn}),o([8,39],[2,36],{40:$Vz}),o($VA,[2,37])],
defaultActions: {12:[2,1]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};

	const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const TIPO_DATO			= require('./tabla_simbolos').TIPO_DATO; 
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:// se ignoran espacios en blanco
break;
case 1:// se ignoran saltos de linea
break;
case 2:// comentario simple línea
break;
case 3:// comentario multiple líneas
break;
case 4:return 14;
break;
case 5:return 15;
break;
case 6:return 9;
break;
case 7:return 16;
break;
case 8:return 17;
break;
case 9:return 'T_SWITCH';
break;
case 10:return 'T_CASE';
break;
case 11:return 'T_DEFAULT';
break;
case 12:return 'T_IF';
break;
case 13:return 'T_ELSE';
break;
case 14:return 'T_DO';
break;
case 15:return 'T_WHILE';
break;
case 16:return 'T_FOR';
break;
case 17:return 'T_LIST';
break;
case 18:return 'T_ADD';
break;
case 19:return 'T_NEW';
break;
case 20:return 'T_BREAK';
break;
case 21:return 'T_CONTINUE';
break;
case 22:return 'T_RETURN';
break;
case 23:return 'T_PRINT';
break;
case 24:return 'T_VOID';
break;
case 25:return 'T_LENGTH';
break;
case 26:return 'T_TOCHARARRAY';
break;
case 27:return 'T_TOLOWER';
break;
case 28:return 'T_TOSTRING';
break;
case 29:return 'T_TOUPPER';
break;
case 30:return 'T_TRUNCATE';
break;
case 31:return 'T_TYPEOF';
break;
case 32:return 'T_ROUND';
break;
case 33:return 'T_MAIN';
break;
case 34:return 35;
break;
case 35:return 34;
break;
case 36:return 36;
break;
case 37:return 37;
break;
case 38:return 33;
break;
case 39:return 32;
break;
case 40:return 'DOSPTS';
break;
case 41:return 8;
break;
case 42:return 'LLAVIZQ';
break;
case 43:return 'LLAVDER';
break;
case 44:return 29;
break;
case 45:return 30;
break;
case 46:return 11;
break;
case 47:return 'PTS';
break;
case 48:return 'COMA';
break;
case 49:return 'INTERROGACION';
break;
case 50:return 'CORCDER';
break;
case 51:return 'CORCIZQ';  
break;
case 52:return 'CORCDER';
break;
case 53:return 41;
break;
case 54:return 39
break;
case 55:return 40;
break;
case 56:return 24;
break;
case 57:return 23;
break;
case 58:return 25;
break;
case 59:return 26;
break;
case 60:return 27;
break;
case 61:return 28;
break;
case 62:return 20;
break;
case 63:return 19;
break;
case 64:return 21;
break;
case 65:return 21;
break;
case 66:return 10;
break;
case 67: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 22; 
break;
case 68:
    yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2);
    yy_.yytext = yy_.yytext.replace(/\\\\/g, '\\');
    yy_.yytext = yy_.yytext.replace(/\\n/g, '\n');
    yy_.yytext = yy_.yytext.replace(/\\t/g, '\t');
    yy_.yytext = yy_.yytext.replace(/\\"/g, '\"');
    yy_.yytext = yy_.yytext.replace(/\\'/g, '\'');
    return 18;

break;
case 69:return 5;
break;
case 70: console.error('Este es un error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column); 
break;
}
},
rules: [/^(?:[\s\r\t]+)/i,/^(?:\n)/i,/^(?:\/\/.*)/i,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:boolean\b)/i,/^(?:char\b)/i,/^(?:string\b)/i,/^(?:switch\b)/i,/^(?:case\b)/i,/^(?:default\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:do\b)/i,/^(?:while\b)/i,/^(?:for\b)/i,/^(?:list\b)/i,/^(?:add\b)/i,/^(?:new\b)/i,/^(?:break\b)/i,/^(?:continue\b)/i,/^(?:return\b)/i,/^(?:print\b)/i,/^(?:void\b)/i,/^(?:length\b)/i,/^(?:tochararray\b)/i,/^(?:tolower\b)/i,/^(?:tostring\b)/i,/^(?:toupper\b)/i,/^(?:truncate\b)/i,/^(?:typeof\b)/i,/^(?:round\b)/i,/^(?:main\b)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:==)/i,/^(?:!=)/i,/^(?:<)/i,/^(?:>)/i,/^(?::)/i,/^(?:;)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\()/i,/^(?:\))/i,/^(?:=)/i,/^(?:\.)/i,/^(?:,)/i,/^(?:\?)/i,/^(?:\])/i,/^(?:\[)/i,/^(?:\])/i,/^(?:!)/i,/^(?:&&)/i,/^(?:\|\|)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:\^)/i,/^(?:%)/i,/^(?:[0-9]+\.[0-9]+\b)/i,/^(?:[0-9]+\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:([a-zA-Z])[a-zA-Z0-9_]*)/i,/^(?:'[^\']')/i,/^(?:"(\\.|[^"\\])*")/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = gramatica;
exports.Parser = gramatica.Parser;
exports.parse = function () { return gramatica.parse.apply(gramatica, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}