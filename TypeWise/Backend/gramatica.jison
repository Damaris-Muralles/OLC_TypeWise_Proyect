/**
 * ANALIZADORES
 */

/* Definición Léxica */
// ================================IMPORTACIONES==================================================================
%{
	const TIPO_EXPRESION	= require('./instrucciones').TIPO_EXPRESION;
	const TIPO_INSTRUCCION =require('./instrucciones').TIPO_INSTRUCCION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const TIPO_DATO			= require('./tabla_simbolos').TIPO_DATO; 
	
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
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
"print"				return 'T_PRINT';

//==============================funciones metodos=============================================
"void"				return 'T_VOID';
"length"			return 'T_LENGTH';
"tochararray"		return 'T_TOCHARARRAY';
"tolower"			return 'T_TOLOWER';
"tostring"			return 'T_TOSTRING';
"toupper"			return 'T_TOUPPER';
"truncate"			return 'T_TRUNCATE';
"typeof"			return 'T_TYPEOF';
"round"			    return 'T_ROUND';
"main"				return 'T_MAIN';


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
//"++"				return 'AUMENTO';
//"--"				return 'DECREMENTO';


//================OPERADORES ARITMETICOS========================================================================

"+"					return 'MAS';
"-"					return 'MENOS';
"*"					return 'POR';
"/"					return 'DIVIDIDO';
"^"					return 'POTENCIA';
"%"					return 'MODULO';








//==========================EXPRESIONES========================================================================================
/*
[\s\r\t]+											// se ignoran espacios en blanco
\n											// se ignoran saltos de linea
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas*/
[0-9]+\.[0-9]+\b  	return 'DECIMAL';
[0-9]+\b				return 'ENTERO';
"true"                  return 'BOOLEANO';
"false"                 return 'BOOLEANO';
([a-zA-Z])[a-zA-Z0-9_]*	{
    yytext = yytext.toLowerCase();
    return 'IDENTIFICADOR';
}


\'[^\']\' { yytext = yytext.substr(1,yyleng-2).toLowerCase(); return 'CARACTER'; }

//\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
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
<<EOF>>				return 'EOF';
.					{ console.log('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
						$$ = instruccionesAPI.parseError(yytext, yylloc, yy,"lexico");
					}

/lex 
// ================================IMPORTACIONES==================================================================



/*=============================== PRESEDENCIA====== */


%right 'UMENOS'
%nonassoc 'POTENCIA' //%nonassoc
%left 'DIVIDIDO', 'POR', "MODULO"
%left 'MAS', 'MENOS'
%left 'DOBLEIG', 'NOIG', 'MENQUE', 'MENIGQUE', 'MAYQUE', 'MAYIGQUE'
%right 'NOT'
%left 'AND'
%left 'OR'
//%right 'PARIZQ'


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
	//|{ $$ = []; }
;

instruccion
	: declaracion  PTCOMA	              { $$ = $1; }
	| asignacion   PTCOMA                { $$ = $1; }
	| funcion_main     PTCOMA               { $$ = $1; }
	| funcion                     { $$ = $1; }
	| metodo { $$ = $1; }
	
	| error  { 
					ubicacion = {
						first_line: @1.first_line,
						first_column: @1.first_column
					};
					
					$$ = instruccionesAPI.parseError(yytext, ubicacion,"Instruccion No valido","Sintactico");
					console.log('Este es un error sintáctico: ' + yytext + ', en la linea: ' + @0.first_line + ', en la columna: ' + @0.first_column);
					// Descartamos el token que generó el error y continuamos el análisis después del token PTCOMA
					 }
;

declaracion
    : tipos
        { $$ = instruccionesAPI.nuevoDeclaracion($1.identificador,$1.tipo, true,$1.linea,$1.columna); }
	|T_BOOLEAN IDENTIFICADOR 
        { $$ = instruccionesAPI.nuevoDeclaracion($2,TIPO_DATO.BOOLEAN, true,@1.first_line, @1.first_column); }
    | tipos IGUAL expresion
        { $$ = instruccionesAPI.nuevoDecAsig($1.identificador,$1.tipo,$3, true,@1.first_line, @1.first_column); }
	| T_BOOLEAN IDENTIFICADOR IGUAL expresion 
        { $$ = instruccionesAPI.nuevoDecAsig($2,TIPO_DATO.BOOLEAN,$4, true,@1.first_line, @1.first_column); }
    | T_BOOLEAN IDENTIFICADOR IGUAL expresion_logica 
        { $$ = instruccionesAPI.nuevoDecAsig($2,TIPO_DATO.BOOLEAN,$4,  true,@1.first_line, @1.first_column); }
    
;

asignacion
	: IDENTIFICADOR IGUAL expresion 
        { $$ = instruccionesAPI.nuevoAsignacion($1,$3,@1.first_line, @1.first_column); }
    | IDENTIFICADOR IGUAL expresion_logica 
        { $$ = instruccionesAPI.nuevoAsignacion($1,$3,@1.first_line, @1.first_column); }
;

funcion_main
	: T_MAIN llamada_funcion
        {   $$ = instruccionesAPI.nuevoMain($2,@1.first_line, @1.first_column);}
	
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
	| error  { 
					ubicacion = {
						first_line: @1.first_line,
						first_column: @1.first_column
					};
					$$ = instruccionesAPI.parseError(@1.yytext, ubicacion, "Instruccion No valido","Sintactico");
					console.log('Este es un error sintáctico: ' +  yytext + ', en la linea: ' + @1.first_line + ', en la columna: ' + @1.first_column);
					// Descartamos el token que generó el error y continuamos el análisis después del token PTCOMA

					}
;

instruccionfuncion
	: declaracion  PTCOMA	              { $$ = $1; }
	| asignacion   PTCOMA                { $$ = $1; }
	| llamada_funcion 	PTCOMA           { $$ = $1; }
	| retornos PTCOMA { $$ = $1; }
	| sentenciaprint PTCOMA{ $$ = $1; }
	| error  { 
					ubicacion = {
						first_line: @1.first_line,
						first_column: @1.first_column
					};
					$$ = instruccionesAPI.parseError(@1.yytext, ubicacion, "Instruccion No valido","Sintactico");
					console.log('Este es un error sintáctico: ' +  yytext + ', en la linea: ' + @1.first_line + ', en la columna: ' + @1.first_column);
					// Descartamos el token que generó el error y continuamos el análisis después del token PTCOMA

					}
;

expresion
	:  CADENA											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA,@1.first_line, @1.first_column); }
	| ENTERO											{ $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.INT,@1.first_line, @1.first_column); }
	| DECIMAL											{ $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.DOUBLE,@1.first_line, @1.first_column); }
	| BOOLEANO											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOLEAN,@1.first_line, @1.first_column); }
	| CARACTER											{ $$ = instruccionesAPI.nuevoValor($1.charAt(0), TIPO_VALOR.CARACTER,@1.first_line, @1.first_column); }
	| IDENTIFICADOR										{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR,@1.first_line, @1.first_column); }
	| MENOS expresion %prec UMENOS						{ $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_EXPRESION.NEGATIVO,@1.first_line, @1.first_column); }
	| expresion MAS expresion							{  if ($1.tipo === TIPO_VALOR.CADENA || $3.tipo == TIPO_VALOR.CADENA||($1.tipo === TIPO_VALOR.CARACTER && $3.tipo == TIPO_VALOR.CARACTER)) {
																$$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.CONCATENACION,@1.first_line, @1.first_column);
															} else {
																$$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.SUMA,@1.first_line, @1.first_column);
															}
														}
	| expresion MENOS expresion							{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.RESTA,@1.first_line, @1.first_column); }
	| expresion POR expresion							{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MULTIPLICACION,@1.first_line, @1.first_column); }
	| expresion DIVIDIDO expresion						{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.DIVISION,@1.first_line, @1.first_column); }
	| expresion POTENCIA expresion						{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.POTENCIA,@1.first_line, @1.first_column); }
	| expresion MODULO expresion						{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MODULO,@1.first_line, @1.first_column); }
	| PARIZQ expresion PARDER							{ $$ = $2; }
	| llamada_funcion                 					 { $$ = $1; }
	
;
expresion_relacional
	: expresion MAYQUE expresion		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MAYOR_QUE,@1.first_line, @1.first_column); }
	| expresion MENQUE expresion		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MENOR_QUE,@1.first_line, @1.first_column); }
	| expresion MAYIGQUE expresion	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MAYOR_IGUAL,@1.first_line, @1.first_column); }
	| expresion MENIGQUE expresion	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MENOR_IGUAL,@1.first_line, @1.first_column); }
	| expresion DOBLEIG expresion			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.DOBLE_IGUAL,@1.first_line, @1.first_column); }
	| expresion NOIG expresion			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.NO_IGUAL,@1.first_line, @1.first_column); }

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
retornos
	:T_RETURN expresionescompuestas  {$$ = instruccionesAPI.nuevoReturn($2,@1.first_line, @1.first_column);}
;

sentenciaprint
	:T_PRINT PARIZQ expresion PARDER 	{ $$ = instruccionesAPI.nuevoPRINT($3,@1.first_line, @1.first_column); }
;
//
	//| T_WHILE PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER
		//												{ $$ = instruccionesAPI.nuevoWHILE($3, $6); }
	//| T_FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones LLAVDER
	//													{ $$ = instruccionesAPI.nuevoPara($3,$5,$7,$9,$14) }
	


	//| T_IF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER
				//										{ $$ = instruccionesAPI.nuevoIf($3, $6); }
	//| T_IF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER T_ELSE LLAVIZQ instrucciones LLAVDER
				//										{ $$ = instruccionesAPI.nuevoIf($3, $6, $10); }

	//| T_SWITCH PARIZQ expresion_numerica PARDER LLAVIZQ casos LLAVDER
		//{ $$ = instruccionesAPI.nuevoSwitch($3,$6);}
	//| IDENTIFICADOR operadores expresion_numerica PTCOMA	
	            //                                        { $$ = instruccionesAPI.nuevoAsignacionSimplificada($1, $2, $3); }
	

/*
sentenciacontrol
	:
;
casos : casos caso_evaluar
    {
      $1.push($2);
	  $$ = $1;
    }
  | caso_evaluar
  	{ $$ = instruccionesAPI.nuevoListaCasos($1);}
;

caso_evaluar : T_CASE expresion_numerica DOSPTS instrucciones
    { $$ = instruccionesAPI.nuevoCaso($2,$4); }
  | T_DEFAULT DOSPTS instrucciones
    { $$ = instruccionesAPI.nuevoCasoDef($3); }
;*/
/*
operadores
    : O_MAS      { $$ = instruccionesAPI.nuevoOperador(TIPO_EXPRESION.SUMA); }
	| O_MENOS    { $$ = instruccionesAPI.nuevoOperador(TIPO_EXPRESION.RESTA); }
    | O_POR      { $$ = instruccionesAPI.nuevoOperador(TIPO_EXPRESION.MULTIPLICACION); }
	| O_DIVIDIDO { $$ = instruccionesAPI.nuevoOperador(TIPO_EXPRESION.DIVISION); }
;

*/


/*
expresion_relacional
	: expresion_numerica MAYQUE expresion_numerica		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MAYOR_QUE); }
	| expresion_numerica MENQUE expresion_numerica		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MENOR_QUE); }
	| expresion_numerica MAYIGQUE expresion_numerica	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MAYOR_IGUAL); }
	| expresion_numerica MENIGQUE expresion_numerica	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.MENOR_IGUAL); }
	| expresion_cadena DOBLEIG expresion_cadena			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.DOBLE_IGUAL); }
	| expresion_cadena NOIG expresion_cadena			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.NO_IGUAL); }
;*/
/*
expresion_logica
	: expresion_relacional AND expresion_relacional     { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.AND); }
	| expresion_relacional OR expresion_relacional 		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_EXPRESION.OR); }
	| NOT expresion_relacional							{ $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_EXPRESION.NOT); }
	| expresion_relacional								{ $$ = $1; }
;*/


