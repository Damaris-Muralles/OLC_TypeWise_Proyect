/**
 * ANALIZADORES
 */

/* Definición Léxica */
%{
	
	let ubicacion;
	let prevToken = '';
%}




%lex

%options case-insensitive

%%
[\s\r\t]+											// se ignoran espacios en blanco
\n											// se ignoran saltos de linea
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

//============PALABRAS RESERVADAS=========================================================================

"int"			    return 'T_INT'; //ya
"double"			return 'T_DOUBLE'; //ya
"boolean"			return 'T_BOOLEAN'; //ya
"char"			    return 'T_CHAR'; //ya
"string"			return 'T_STRING'; //ya
"switch"			return 'T_SWITCH'; //ya
"case"				return 'T_CASE'; //ya
"default"			return 'T_DEFAULT'; //ya
"if"				return 'T_IF'; //ya
"else"				return 'T_ELSE'; //ya
"do"				return 'T_DO';//ya
"while"				return 'T_WHILE';//ya
"for"				return 'T_FOR';//ya
"list"				return 'T_LIST';
"add"				return 'T_ADD';
"new"				return 'T_NEW';
"break"				return 'T_BREAK'; //ya
"continue"			return 'T_CONTINUE';//ya
"return"			return 'T_RETURN'; //ya
"print"				return 'T_PRINT'; //ya

//==============================funciones metodos=============================================
"void"				return 'T_VOID'; //ya
"length"			return 'T_LENGTH';
"tochararray"		return 'T_TOCHARARRAY';
"tolower"			return 'T_TOLOWER';
"tostring"			return 'T_TOSTRING';
"toupper"			return 'T_TOUPPER';
"truncate"			return 'T_TRUNCATE';
"typeof"			return 'T_TYPEOF';
"round"			    return 'T_ROUND';
"main"				return 'T_MAIN'; //ya


//============OPERADORES RELACIONALES ================================================================================================

"<="				return 'MENIGQUE';
">="				return 'MAYIGQUE';
"=="				return 'DOBLEIG';
"!="				return 'NOIG';
"<"					return 'MENQUE';
">"					return 'MAYQUE';

//==============SIMBOLOS RESERVADOS========================================================================
":"					return 'DOSPTS';
";"					return 'PTCOMA';
"{"					return 'LLAVIZQ';
"}"					return 'LLAVDER';
"("					return 'PARIZQ';
")"					return 'PARDER';
"="					return 'IGUAL';
"."					return 'PTS';
","					return 'COMA';
"?"					return 'INTERROGACION';
"]"					return 'CORCDER';
"["					return 'CORCIZQ';  
"]"					return 'CORCDER';

//================OPERADORES LOGICOS==================================================================

"!"					return 'NOT';
"&&"				return 'AND'
"||"				return 'OR';
"++"				return 'AUMENTO';
"--"				return 'DECREMENTO';


//================OPERADORES ARITMETICOS========================================================================

"+"					return 'MAS';
"-"					return 'MENOS';
"*"					return 'POR';
"/"					return 'DIVIDIDO';
"^"					return 'POTENCIA';
"%"					return 'MODULO';








//==========================EXPRESIONES========================================================================================

[0-9]+\.[0-9]+\b  	return 'DECIMAL';
[0-9]+\b				return 'ENTERO';
"true"                  return 'BOOLEANO';
"false"                 return 'BOOLEANO';
([a-zA-Z])[a-zA-Z0-9_]*	{
    yytext = yytext.toLowerCase();
    return 'IDENTIFICADOR';
}


\'[^\']\' { yytext = yytext.substr(1,yyleng-2).toLowerCase(); return 'CARACTER'; }


\"(\\.|[^"\\])*\" {
    yytext = yytext.substr(1,yyleng-2);
    yytext = yytext.replace(/\\\\/g, '\\');
    yytext = yytext.replace(/\\n/g, '\n');
    yytext = yytext.replace(/\\t/g, '\t');
    yytext = yytext.replace(/\\"/g, '\"');
    yytext = yytext.replace(/\\'/g, '\'');
    return 'CADENA';
}


//================================ERRORES LEXICOS========================================================
<<EOF>>		return 'EOF';
.			{ console.log('Error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
				$$ = instruccionesAPI.parseError(yytext, yylloc, "No se esperaba: ","lexico", 'Error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
			}

/lex 


/*=============================== PRESEDENCIA====== */
%nonassoc PARIZQ
%nonassoc 'INTERROGACION'
%left 'OR'
%left 'AND'
%right 'NOT'

%left 'DOBLEIG', 'NOIG', 'MENQUE', 'MENIGQUE', 'MAYQUE', 'MAYIGQUE'
%left 'MAS', 'MENOS'
%left 'DIVIDIDO', 'POR', "MODULO"
%nonassoc 'POTENCIA' 
%right 'UMENOS'









/* ========================================GRAMATICA======= */
%start ini

%% 

ini
	: instrucciones EOF {
		// cuado se haya reconocido la entrada completa retornamos el AST
		return $1;
	}
;


instrucciones
	: instrucciones instruccion 	{ $1.push($2); $$ = $1; }
	| instruccion					{ $$ = [$1]; }
;

instruccion
	: declaracion  PTCOMA	              { $$ = $1; }
	| asignacion   PTCOMA                { $$ = $1; }
	| funcion_main     PTCOMA               { $$ = $1; }
	| funcion                     { $$ = $1; }
	| metodo { $$ = $1; }
	|vectores { $$ = $1; }
	|declaracionlistas { $$ = $1; }
	|modifilistas { $$ = $1; }
	|modifivector { $$ = $1; }
	|addlistas { $$ = $1; }
	| error  { 
					ubicacion = {
						first_line: @1.first_line,
						first_column: @1.first_column
					};
					
					$$ = instruccionesAPI.parseError(yytext, ubicacion,"No se esperaba  ","Sintactico",'Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
					console.log('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
					// Descartamos el token que generó el error y continuamos el análisis después del token PTCOMA
					 }
;


funcion_main
	: T_MAIN llamada_funcion
        {   $$ = instruccionesAPI.nuevoMain($2,@1.first_line, @1.first_column);}
	
;

declaracion
    : tipos
        { $$ = instruccionesAPI.nuevoDeclaracion($1.identificador,$1.tipo, true,$1.linea,$1.columna); }
	|T_BOOLEAN IDENTIFICADOR 
        { $$ = instruccionesAPI.nuevoDeclaracion($2,TIPO_DATO.BOOLEAN, true,@1.first_line, @1.first_column); }
    | tipos IGUAL expresion
        { $$ = instruccionesAPI.nuevoDecAsig($1.identificador,$1.tipo,$3, true,@1.first_line, @1.first_column); }
	| tipos IGUAL ternarioop
        { $$ = instruccionesAPI.nuevoDecAsig($1.identificador,$1.tipo,$3, true,@1.first_line, @1.first_column); }
	| T_BOOLEAN IDENTIFICADOR IGUAL expresion 
        { $$ = instruccionesAPI.nuevoDecAsig($2,TIPO_DATO.BOOLEAN,$4, true,@1.first_line, @1.first_column); }
    | T_BOOLEAN IDENTIFICADOR IGUAL expresion_logica 
        { $$ = instruccionesAPI.nuevoDecAsig($2,TIPO_DATO.BOOLEAN,$4,  true,@1.first_line, @1.first_column); }
    | T_BOOLEAN IDENTIFICADOR IGUAL ternarioop
        { $$ = instruccionesAPI.nuevoDecAsig($2,TIPO_DATO.BOOLEAN,$4,  true,@1.first_line, @1.first_column); }
;

asignacion
	: IDENTIFICADOR IGUAL expresion 
        { $$ = instruccionesAPI.nuevoAsignacion($1,$3,@1.first_line, @1.first_column); }
    | IDENTIFICADOR IGUAL expresion_logica 
        { $$ = instruccionesAPI.nuevoAsignacion($1,$3,@1.first_line, @1.first_column); }
	| IDENTIFICADOR IGUAL ternarioop 
        { $$ = instruccionesAPI.nuevoAsignacion($1,$3,@1.first_line, @1.first_column); }
;
llamada_funcion
    : IDENTIFICADOR PARIZQ PARDER
         { $$ = instruccionesAPI.nuevoLlamadaFuncion($1, [],@1.first_line, @1.first_column); }
    | IDENTIFICADOR PARIZQ expresionllamada PARDER
         { $$ = instruccionesAPI.nuevoLlamadaFuncion($1, $3,@1.first_line, @1.first_column); }
;
expresionllamada
    : expresionllamada COMA expresion { $1.push($3); $$ = $1; }
    | expresion { $$ = [$1]; }
;

funcion
	: tipos PARIZQ PARDER bloqueinstrucciones
	{$$ = instruccionesAPI.nuevaFuncion($1.identificador,[],$4,'FUNCION',$1.tipo, @1.first_line, @1.first_column);}
	| tipos  PARIZQ parametrosllamada PARDER bloqueinstrucciones
	{$$ = instruccionesAPI.nuevaFuncion($1.identificador,$3,$5,'FUNCION',$1.tipo,@1.first_line, @1.first_column);}
	|T_BOOLEAN IDENTIFICADOR PARIZQ PARDER bloqueinstrucciones
	{$$ = instruccionesAPI.nuevaFuncion($2,[],$5,'FUNCION',$1, @2.first_line, @2.first_column);}
	| T_BOOLEAN IDENTIFICADOR IDENTIFICADOR PARIZQ parametrosllamada PARDER bloqueinstrucciones
	{$$ = instruccionesAPI.nuevaFuncion($2,$4,$6,'FUNCION',$1,@2.first_line, @2.first_column);}
;
metodo
	:T_VOID IDENTIFICADOR PARIZQ PARDER bloqueinstruccionesmetodo
	{$$ = instruccionesAPI.nuevaFuncion($2,[],$5,'METODO',$1, @2.first_line, @2.first_column);}
	| T_VOID IDENTIFICADOR PARIZQ parametrosllamada PARDER bloqueinstruccionesmetodo
	{$$ = instruccionesAPI.nuevaFuncion($2,$4,$6,'METODO',$1,@2.first_line, @2.first_column);}
;

parametrosllamada
    : parametrosllamada COMA tipos { $1.push($3); $$ = $1; }
    | parametrosllamada COMA T_BOOLEAN IDENTIFICADOR { $1.push({tipo: TIPO_DATO.BOOLEAN, identificador: $4, linea:@3.first_line, columna: @3.first_column}); $$ = $1; } 
	|tipos { $$ = [$1]; }
	| T_BOOLEAN IDENTIFICADOR{ $$ = [{tipo: TIPO_DATO.BOOLEAN, identificador: $2, linea:@1.first_line, columna: @1.first_column}]; }
;

bloqueinstruccionesmetodo
	: LLAVIZQ instruccionesmetodo LLAVDER
	{$$ = $2;}
	| LLAVIZQ LLAVDER {$$ = [];}
;
bloqueinstrucciones
	: LLAVIZQ instruccionesfuncion LLAVDER
	{$$ = $2;}
	| LLAVIZQ LLAVDER {$$ = [];}
;
instruccionesmetodo
	: instruccionesmetodo instruccionmetodo 	{ $1.push($2); $$ = $1; }
	| instruccionmetodo					{ $$ = [$1]; }
;

instruccionesfuncion
	: instruccionesfuncion instruccionfuncion 	{ $1.push($2); $$ = $1; }
	| instruccionfuncion					{ $$ = [$1]; }
;

instruccionmetodo
	: declaracion  PTCOMA	              { $$ = $1; }
	| asignacion   PTCOMA                { $$ = $1; }
	| llamada_funcion 	PTCOMA           { $$ = $1; }
	| sentenciaprint PTCOMA{ $$ = $1; }
	| sentenciacontrolIF { $$ = $1; }
	| sentenciacontrolswitch{ $$ = $1; }
	| sentenciabreak{ $$ = $1; }
	| T_CONTINUE PTCOMA {$$ = instruccionesAPI.nuevoContinue(@1.first_line, @1.first_column);}
	| incrementoDec  PTCOMA{ $$ = $1; }
	| ciclos{ $$ = $1; }
	|vectores { $$ = $1; }
	|declaracionlistas { $$ = $1; }
	|modifilistas { $$ = $1; }
	|modifivector { $$ = $1; }
	|addlistas { $$ = $1; }
	| error  { 
					ubicacion = {
						first_line: @1.first_line,
						first_column: @1.first_column
					};
					$$ = instruccionesAPI.parseError(yytext, ubicacion,"No se esperaba  ","Sintactico",'Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
					console.log('Este es un error sintáctico: ' +  yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
					// Descartamos el token que generó el error y continuamos el análisis después del token PTCOMA

					}
;

instruccionfuncion
	: declaracion  PTCOMA	              { $$ = $1; }
	| asignacion   PTCOMA                { $$ = $1; }
	| llamada_funcion 	PTCOMA           { $$ = $1; }
	| sentenciaprint PTCOMA{ $$ = $1; }
	| sentenciacontrolIF { $$ = $1; }
	| sentenciacontrolswitch{ $$ = $1; }
	| sentenciabreak{ $$ = $1; }
	| retornos  { $$ = $1; }
	| T_CONTINUE PTCOMA {$$ = instruccionesAPI.nuevoContinue(@1.first_line, @1.first_column);}
    | incrementoDec  PTCOMA{ $$ = $1; }
	| ciclos{ $$ = $1; }
	|vectores { $$ = $1; }
	|declaracionlistas { $$ = $1; }
	|modifilistas { $$ = $1; }
	|modifivector { $$ = $1; }
	|addlistas { $$ = $1; }
	| error  { 
					ubicacion = {
						first_line: @1.first_line,
						first_column: @1.first_column
					};
					$$ = instruccionesAPI.parseError(yytext, ubicacion,"No se esperaba  ","Sintactico",'Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
					console.log('Este es un error sintáctico: ' +  yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
					// Descartamos el token que generó el error y continuamos el análisis después del token PTCOMA

					}
;

expresion
	:CADENA												{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA,@1.first_line, @1.first_column); }
	| ENTERO											{ $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.INT,@1.first_line, @1.first_column); }
	| DECIMAL											{ $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.DOUBLE,@1.first_line, @1.first_column); }
	| BOOLEANO											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOLEAN,@1.first_line, @1.first_column); }
	| CARACTER											{ $$ = instruccionesAPI.nuevoValor($1.charAt(0), TIPO_VALOR.CARACTER,@1.first_line, @1.first_column); }
	| IDENTIFICADOR										{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR,@1.first_line, @1.first_column); }
	| MENOS expresion %prec UMENOS						{ $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_EXPRESION.NEGATIVO,@1.first_line, @1.first_column); }
	| expresion POR expresion							{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MULTIPLICACION,@1.first_line, @1.first_column); }
	| expresion DIVIDIDO expresion						{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.DIVISION,@1.first_line, @1.first_column); }
	| expresion POTENCIA expresion						{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.POTENCIA,@1.first_line, @1.first_column); }
	| expresion MODULO expresion						{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MODULO,@1.first_line, @1.first_column); }
	| expresion MAS expresion							{  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.SUMA,@1.first_line, @1.first_column);}
	| expresion MENOS expresion							{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.RESTA,@1.first_line, @1.first_column); }
	| PARIZQ expresion PARDER							{ $$ = $2; }
	| llamada_funcion                 					{ $$ = $1; }
	| incrementoDec										{ $$ = $1; }
	| manejocarateres									{ $$ = $1; }
	|casteo												{ $$ = $1; }
	|funcionesnativas   								{ $$ = $1; }
	|accesolistas										{ $$ = $1; }
	|accesovector										{ $$ = $1; }
	
;
manejocarateres
	:T_TOLOWER PARIZQ expresion PARDER  				{ $$ = instruccionesAPI.nuevomanejocaracter(TIPO_EXPRESION.LOWER,$3 ,@1.first_line, @1.first_column); }
	| T_TOUPPER PARIZQ expresion PARDER 				{ $$ = instruccionesAPI.nuevomanejocaracter(TIPO_EXPRESION.UPPER,$3 ,@1.first_line, @1.first_column); }
;
casteo
    : PARIZQ tipocasteo  PARDER expresion				{ $$ = instruccionesAPI.nuevocasteo("CASTEO DE CADENA", $2, $4,@1.first_line, @1.first_column); }
	| PARIZQ tipocasteonumber PARDER  expresion			{ $$ = instruccionesAPI.nuevocasteo("CASTEO NUMERICO", $2, $4,@1.first_line, @1.first_column); }
;
funcionesnativas   			
	: T_LENGTH PARIZQ expresion PARDER					{ $$ = instruccionesAPI.nuevafuncionnativa(TIPO_EXPRESION.LENGTH, $3,@1.first_line, @1.first_column); }
	|T_TRUNCATE PARIZQ expresion PARDER					{ $$ = instruccionesAPI.nuevafuncionnativa(TIPO_EXPRESION.TRUNC, $3,@1.first_line, @1.first_column); }
	|T_TOSTRING PARIZQ expresion  PARDER				{ $$ = instruccionesAPI.nuevafuncionnativa(TIPO_EXPRESION.TOSTRING, $3,@1.first_line, @1.first_column); }
	|T_TYPEOF PARIZQ expresion  PARDER					{ $$ = instruccionesAPI.nuevafuncionnativa(TIPO_EXPRESION.TYPEO, $3,@1.first_line, @1.first_column); }
	|T_ROUND PARIZQ expresion PARDER					{ $$ = instruccionesAPI.nuevafuncionnativa(TIPO_EXPRESION.ROUND, $3,@1.first_line, @1.first_column); }
;



tipocasteonumber
	:  T_INT  { $$ = TIPO_DATO.INT; }
    | T_DOUBLE { $$ = TIPO_DATO.DOUBLE; }
  
;
tipocasteo
	: T_CHAR { $$ = TIPO_DATO.CHAR; }
    | T_STRING { $$ = TIPO_DATO.STRING; }
;
expresion_relacional
	: expresion MAYQUE expresion		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MAYOR_QUE,@1.first_line, @1.first_column); }
	| expresion MENQUE expresion		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MENOR_QUE,@1.first_line, @1.first_column); }
	| expresion MAYIGQUE expresion	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MAYOR_IGUAL,@1.first_line, @1.first_column); }
	| expresion MENIGQUE expresion	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MENOR_IGUAL,@1.first_line, @1.first_column); }
	| expresion DOBLEIG expresion			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.DOBLE_IGUAL,@1.first_line, @1.first_column); }
	| expresion NOIG expresion			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.NO_IGUAL,@1.first_line, @1.first_column); }
	| PARIZQ expresion_relacional PARDER							{ $$ = $2; }

;
expresion_logica
    : expresionescompuestas AND expresionescompuestas { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.AND,@1.first_line, @1.first_column); }
    | expresionescompuestas OR expresionescompuestas { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.OR,@1.first_line, @1.first_column); }
    | NOT expresionescompuestas { $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_EXPRESION.NOT,@1.first_line, @1.first_column); }
	| expresion_relacional { $$ = $1; }

;
expresionescompuestas
	:expresion_logica{ $$ = $1; }
	| expresion{ $$ = $1; }
;

tipos
	: T_INT IDENTIFICADOR { $$ = {tipo: TIPO_DATO.INT, identificador: $2, linea:@2.first_line, columna: @2.first_column}; }
    | T_DOUBLE IDENTIFICADOR { $$ = {tipo: TIPO_DATO.DOUBLE, identificador: $2, linea:@1.first_line, columna: @1.first_column}; }
    | T_CHAR IDENTIFICADOR { $$ = {tipo: TIPO_DATO.CHAR, identificador: $2, linea:@1.first_line, columna: @1.first_column}; }
    | T_STRING IDENTIFICADOR { $$ = {tipo: TIPO_DATO.STRING, identificador: $2, linea:@1.first_line, columna: @1.first_column}; }
;
sentenciaprint
	:T_PRINT PARIZQ expresionescompuestas PARDER 	{ $$ = instruccionesAPI.nuevoPRINT($3,@1.first_line, @1.first_column); }
;
sentenciacontrolIF
	: T_IF PARIZQ expresion_logica PARDER bloqueinstrucciones
		{ $$ = instruccionesAPI.nuevoIf($3, $5,@1.first_line, @1.first_column); }
	| T_IF PARIZQ expresion_logica PARDER bloqueinstrucciones T_ELSE bloqueinstrucciones
		{ $$ = instruccionesAPI.nuevoIfElse($3, $5, $7,@1.first_line, @1.first_column); }
	| T_IF PARIZQ expresion_logica PARDER bloqueinstrucciones T_ELSE sentenciacontrolIF
		{ $$ = instruccionesAPI.nuevoIfElse($3, $5, $7,@1.first_line, @1.first_column); }
;
sentenciacontrolswitch
	:T_SWITCH PARIZQ expresion PARDER LLAVIZQ casos LLAVDER
		{ $$ = instruccionesAPI.nuevoSwitch($3,$6,@1.first_line, @1.first_column);}
;

casos 
	: casos caso_evaluar
    	{$1.push($2);$$ = $1; }
    | caso_evaluar
  		{ $$ = instruccionesAPI.nuevoListaCasos($1);}
;

caso_evaluar 
	: T_CASE expresion DOSPTS instruccionesfuncion
    	{ $$ = instruccionesAPI.nuevoCaso($2,$4,@1.first_line, @1.first_column); }
  	| T_DEFAULT DOSPTS instruccionesfuncion
    	{ $$ = instruccionesAPI.nuevoCasoDef($3,@1.first_line, @1.first_column); }
;

ternarioop
	:expresion_logica INTERROGACION expresion DOSPTS expresion { $$ = instruccionesAPI.nuevoOperacionTernario($1, $3,$5,@1.first_line, @1.first_column); }
;

retornos
	:T_RETURN expresionescompuestas PTCOMA 
		 {$$ = instruccionesAPI.nuevoReturn($2,@1.first_line, @1.first_column);}
	| T_RETURN ternarioop PTCOMA 
		 {$$ = instruccionesAPI.nuevoReturn($2,@1.first_line, @1.first_column);}
;
sentenciabreak
    : T_BREAK PTCOMA
        { $$ = instruccionesAPI.nuevoBreak(@1.first_line, @1.first_column); }
;

ciclos
	:T_WHILE PARIZQ expresion_logica PARDER bloqueinstrucciones
		{ $$ = instruccionesAPI.nuevoWHILE($3, $5,@1.first_line, @1.first_column); }
	| T_DO bloqueinstrucciones T_WHILE PARIZQ expresion_logica PARDER PTCOMA
		{ $$ = instruccionesAPI.nuevoDOWHILE($2, $5,@1.first_line, @1.first_column); }
	| T_FOR PARIZQ incializarfor PTCOMA expresion_relacional PTCOMA actualizar PARDER bloqueinstrucciones
		{ $$ = instruccionesAPI.nuevoPara($3,$5,$7,$9,@1.first_line, @1.first_column) }
	
;

incializarfor
	:IDENTIFICADOR IGUAL expresion
		{ $$ = instruccionesAPI.nuevoAsignacion($1,$3,@1.first_line, @1.first_column); }
	|tipos IGUAL expresion 
		{ $$ = instruccionesAPI.nuevoDecAsig($1.identificador,$1.tipo,$3, true,@1.first_line, @1.first_column); }
;
actualizar
	:IDENTIFICADOR IGUAL expresion
		{ $$ = instruccionesAPI.nuevoAsignacion($1,$3,@1.first_line, @1.first_column); }
	|incrementoDec { $$ = $1; }
;

incrementoDec
	: IDENTIFICADOR AUMENTO {$$ = instruccionesAPI.nuevoAumDec("INCREMENTO", $1,@1.first_line, @1.first_column); }
	| IDENTIFICADOR DECREMENTO {$$ = instruccionesAPI.nuevoAumDec("DECREMENTO", $1,@1.first_line, @1.first_column);}
;

vectores
	: tipovector CORCIZQ CORCDER IDENTIFICADOR IGUAL declaracionvector PTCOMA 
	{ $$ = instruccionesAPI.nuevoDecVector($1,$4,$6,@1.first_line, @1.first_column); }
	
;
tipovector
	: T_INT  { $$ = TIPO_DATO.INT; }
    | T_DOUBLE { $$ = TIPO_DATO.DOUBLE; }
	| T_CHAR { $$ = TIPO_DATO.CHAR; }
    | T_STRING { $$ = TIPO_DATO.STRING; }
	| T_BOOLEAN { $$ = TIPO_DATO.BOOLEAN; }
;
declaracionvector
	: T_NEW tipovector CORCIZQ ENTERO CORCDER { $$ = instruccionesAPI.nuevoAsigVector($2,instruccionesAPI.nuevoValor(Number($4), TIPO_VALOR.INT,@4.first_line, @4.first_column),@1.first_line, @1.first_column); }
	| LLAVIZQ datosvector LLAVDER { $$ = $2; }
;
datosvector
    : datosvector COMA expresionescompuestas { $1.push($3); $$ = $1; }
    | expresionescompuestas { $$ = [$1]; }
;


declaracionlistas 
 :T_LIST MENQUE tipovector MAYQUE IDENTIFICADOR IGUAL formasdec
 { $$ = instruccionesAPI.nuevaList($3,$5,$7,@1.first_line, @1.first_column); }
;
formasdec
	: T_TOCHARARRAY PARIZQ expresion  PARDER	PTCOMA			
	{ $$ = instruccionesAPI.nuevafuncionnativa(TIPO_EXPRESION.CHARARRAY, $3,@1.first_line, @1.first_column); }
	|T_NEW T_LIST MENQUE tipovector MAYQUE PTCOMA  { $$ = $4; }
;



addlistas 
 : IDENTIFICADOR PTS T_ADD PARIZQ expresionescompuestas PARDER PTCOMA { $$ = instruccionesAPI.nuevoAdd($1,$5,@1.first_line, @1.first_column); }
;

accesovector
	: IDENTIFICADOR CORCIZQ expresion CORCDER { $$ = instruccionesAPI.nuevoAcceso($1,$3,"VECTOR",@1.first_line, @1.first_column); }
;
modifivector
	: IDENTIFICADOR CORCIZQ expresion CORCDER IGUAL expresionescompuestas PTCOMA  { $$ = instruccionesAPI.nuevoModificacion($1,$3,"VECTOR",$6,@1.first_line, @1.first_column); }
;
accesolistas
	: IDENTIFICADOR CORCIZQ CORCIZQ expresion CORCDER CORCDER  { $$ = instruccionesAPI.nuevoAcceso($1,$4,"LISTA",@1.first_line, @1.first_column); }
;
modifilistas
	: IDENTIFICADOR CORCIZQ CORCIZQ expresion CORCDER CORCDER  IGUAL expresionescompuestas PTCOMA { $$ = instruccionesAPI.nuevoModificacion($1,$4,"LISTA",$8,@1.first_line, @1.first_column); }
;
