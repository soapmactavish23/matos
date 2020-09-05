<?php
# seta o PHP.INI
ini_set("default_charset", "UTF-8");
ini_set("date.timezone", "America/Belem");
ini_set("display_errors", true);
ini_set("memory_limit", "1024M");
ini_set("upload_max_filesize", "2048M");
ini_set("post_max_size", "2048M");
ini_set("max_execution_time", "600");
ini_set("max_input_time", "600");

# define os parametros de conexão com o banco de dados
define("DB_HOST", "localhost");
define("DB_USER", "admin");
define("DB_PASSWORD", "senh@d0@dmin");
define("DB_DB", "matos");
define("CHARSET", "utf8");

# define a chave privada para Json Web Token - JWT
define("PRIVATE_KEY", "chavePrivadaParaJsonWebTokenDisqueDenuncia");

# carrega classe MYSQLi
require_once "class/database.php";

# carrega Json Web Token
require_once "class/jwt.php";

function sanitize($string, $replace="") {
	$string = iconv( "UTF-8" , "ASCII//TRANSLIT//IGNORE" , $string );
	$string = preg_replace( "/[^A-Za-z0-9\-\.\ ]/" , $replace, $string );
	return $string;
}

?>