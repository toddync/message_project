<?php

	$servidor = "localhost";
	$usuario = "root";
	$senha = "";
	$banco = "Message_app";

	$mysqli = new mysqli($servidor,$usuario, $senha, $banco);

	$mysqli->set_charset("utf8");

?>
