/**
 * ANALIZADORES
 */

/* Definición Léxica */
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
([a-zA-Z])[a-zA-Z0-9_]*	return 'IDENTIFICADOR';


\'[^\']\' { yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; }

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
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

/lex

// ================================IMPORTACIONES==================================================================
%{
	const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const TIPO_DATO			= require('./tabla_simbolos').TIPO_DATO; 
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
%}


/*=============================== PRESEDENCIA====== */


%right 'UMENOS'
%nonassoc 'POTENCIA' //%nonassoc
%left 'DIVIDIDO', 'POR', "MODULO"
%left 'MAS', 'MENOS'
%left 'DOBLEIG', 'NOIG', 'MENQUE', 'MENIGQUE', 'MAYQUE', 'MAYIGQUE'
%right 'NOT'
%left 'AND'
%left 'OR'



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
    : tipos PTCOMA
        { $$ = instruccionesAPI.nuevoDeclaracion($1.identificador,$1.tipo); }
	|T_BOOLEAN IDENTIFICADOR  PTCOMA
        { $$ = instruccionesAPI.nuevoDeclaracion($2,TIPO_DATO.BOOLEAN); }
    | tipos IGUAL expresion PTCOMA
        { $$ = instruccionesAPI.nuevoDecAsig($1.identificador,$1.tipo,$3); }
	| T_BOOLEAN IDENTIFICADOR IGUAL expresion PTCOMA
        { $$ = instruccionesAPI.nuevoDecAsig($2,TIPO_DATO.BOOLEAN,$4,"ex"); }
    | T_BOOLEAN IDENTIFICADOR IGUAL expresion_logica PTCOMA
        { $$ = instruccionesAPI.nuevoDecAsig($2,TIPO_DATO.BOOLEAN,$4, "log"); }
    | IDENTIFICADOR IGUAL expresion PTCOMA
        { $$ = instruccionesAPI.nuevoAsignacion($1,$3); }
    | IDENTIFICADOR IGUAL expresion_logica PTCOMA
        { $$ = instruccionesAPI.nuevoAsignacion($1,$3); }
    | error  { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;
tipos: T_INT IDENTIFICADOR { $$ = {tipo: TIPO_DATO.INT, identificador: $2}; }
    | T_DOUBLE IDENTIFICADOR { $$ = {tipo: TIPO_DATO.DOUBLE, identificador: $2}; }
    | T_CHAR IDENTIFICADOR { $$ = {tipo: TIPO_DATO.CHAR, identificador: $2}; }
    | T_STRING IDENTIFICADOR { $$ = {tipo: TIPO_DATO.STRING, identificador: $2}; }
;
expresion
	:  CADENA											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA); }
	| ENTERO											{ $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.INT); }
	| DECIMAL											{ $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.DOUBLE); }
	| BOOLEANO											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOLEAN); }
	| CARACTER											{ $$ = instruccionesAPI.nuevoValor($1.charAt(0), TIPO_VALOR.CARACTER); }
	| IDENTIFICADOR										{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR); }
	| MENOS expresion %prec UMENOS						{ $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_OPERACION.NEGATIVO); }
	| expresion MAS expresion							{  if ($1.tipo === TIPO_VALOR.CADENA || $3.tipo == TIPO_VALOR.CADENA||($1.tipo === TIPO_VALOR.CARACTER && $3.tipo == TIPO_VALOR.CARACTER)) {
																$$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.CONCATENACION);
															} else {
																$$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.SUMA);
															}
														}
	| expresion MENOS expresion							{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.RESTA); }
	| expresion POR expresion							{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MULTIPLICACION); }
	| expresion DIVIDIDO expresion						{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DIVISION); }
	| expresion POTENCIA expresion						{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.POTENCIA); }
	| expresion MODULO expresion						{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MODULO); }
	| PARIZQ expresion PARDER							{ $$ = $2; }
	
;

expresion_relacional
	: expresion MAYQUE expresion		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_QUE); }
	| expresion MENQUE expresion		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_QUE); }
	| expresion MAYIGQUE expresion	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_IGUAL); }
	| expresion MENIGQUE expresion	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_IGUAL); }
	| expresion DOBLEIG expresion			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DOBLE_IGUAL); }
	| expresion NOIG expresion			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.NO_IGUAL); }

;
expresion_logica
    : expresionescompuestas AND expresionescompuestas { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.AND); }
    | expresionescompuestas OR expresionescompuestas { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.OR); }
    | NOT expresionescompuestas { $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_OPERACION.NOT); }
	| expresion_relacional { $$ = $1; }

;
expresionescompuestas
	:expresion_logica{ $$ = $1; }
	| expresion{ $$ = $1; }
;
//T_PRINT PARIZQ expresion_cadena PARDER PTCOMA	{ $$ = instruccionesAPI.nuevoPRINT($3); }
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
    : O_MAS      { $$ = instruccionesAPI.nuevoOperador(TIPO_OPERACION.SUMA); }
	| O_MENOS    { $$ = instruccionesAPI.nuevoOperador(TIPO_OPERACION.RESTA); }
    | O_POR      { $$ = instruccionesAPI.nuevoOperador(TIPO_OPERACION.MULTIPLICACION); }
	| O_DIVIDIDO { $$ = instruccionesAPI.nuevoOperador(TIPO_OPERACION.DIVISION); }
;

*/


/*
expresion_relacional
	: expresion_numerica MAYQUE expresion_numerica		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_QUE); }
	| expresion_numerica MENQUE expresion_numerica		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_QUE); }
	| expresion_numerica MAYIGQUE expresion_numerica	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_IGUAL); }
	| expresion_numerica MENIGQUE expresion_numerica	{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_IGUAL); }
	| expresion_cadena DOBLEIG expresion_cadena			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DOBLE_IGUAL); }
	| expresion_cadena NOIG expresion_cadena			{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.NO_IGUAL); }
;*/
/*
expresion_logica
	: expresion_relacional AND expresion_relacional     { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.AND); }
	| expresion_relacional OR expresion_relacional 		{ $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.OR); }
	| NOT expresion_relacional							{ $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_OPERACION.NOT); }
	| expresion_relacional								{ $$ = $1; }
;*/