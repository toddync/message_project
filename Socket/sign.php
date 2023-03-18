<?php

function signUp($username, $email, $pass){

    $mysqli = new mysqli("localhost","root", "", "Message_app");

    $return = "<!<!<sign>!>!>";

        $sql = "SELECT * FROM chat WHERE Email='$email'";
            $consulta = mysqli_query($mysqli, $sql);

        if (mysqli_num_rows($consulta) != 0) {
            $return .= " <!fail!>";
        } else {
        //$senhaS = password_hash($senha, PASSWORD_DEFAULT);
            $sql = "INSERT INTO chat (`Name`, `Email`, `Password`, `Private_key`, `Public_key`, `Status`, `grp`) VALUES ('$username', '$email', '$pass', '1', '1', 'offline', 'no')";
                mysqli_query($mysqli, $sql);

            $return .= " <!sucess!>";
        }

    return $return;
}
?>