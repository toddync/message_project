<?php
/*
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
*/
ini_set('session.name', 'unique_identifier');
session_start();
include('conexao.php');

    $email = $_GET['email'];
    $senha = $_GET['password'];
    $return = "";

    if(strlen($email) == 0 || strlen($senha) == 0) {
        echo "Preencha todos os campos!";
    
    } else {

        $sql = "SELECT * FROM chat WHERE Email = '$email'";
            $consulta = mysqli_query($mysqli, $sql);
                $coluna = mysqli_fetch_array($consulta);

        if (mysqli_num_rows($consulta) == 0){
            $return =  "Cadastro não encontrado!";
            $_SESSION['email'] = $email;
        } else if ($senha != $coluna["Password"]){
            $return = "Senha incorreta!";
        } else {
            $_SESSION['User_Id'] = $coluna["id"];
            if ($coluna["Image"] != ""){
                $_SESSION["img"] = $coluna["Image"];
            }else{
                $_SESSION["img"] = "images/default.png";
            }
        }
    }

    echo $return;
?>
