<?php
session_start();
include('conexao.php');

    $username = $_GET['username'];
    $email = $_GET['email'];
    $senha = $_GET['password'];
    $return = "";

        $sql = "SELECT * FROM chat WHERE Email='$email'";
            $consulta = mysqli_query($mysqli, $sql);

        if (mysqli_num_rows($consulta) != 0) {
            $return = "Email já cadastrado!";
        } else {
        //$senhaS = password_hash($senha, PASSWORD_DEFAULT);
            $sql = "INSERT INTO chat (`Name`, `Email`, `Password`, `Private_key`, `Public_key`, `Status`) VALUES ('$username', '$email', '$senha', '1', '1', 'offline')";
                mysqli_query($mysqli, $sql);

            $return = "Cadastro criado com sucessso!";
        }

    echo $return;
?>