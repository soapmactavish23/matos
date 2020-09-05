<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');

# carrega as configuraçoes iniciais
require_once "config.php";

# carrega classe de usuario
require_once "class/usuario.php";

# instancia o objeto usuario
$_usuario = new usuario();

# define o retorno
$_RESPONSE = $_usuario->autenticar( @$_REQUEST['login'], @$_REQUEST['password'] );

# retorno no formato json
header("Content-Type: application/json; charset=UTF-8");
print json_encode( $_RESPONSE );
?>
