<?php

function Create_group($name, $user){

    $mysqli = new mysqli("localhost","root", "", "Message_app");

    $return = "<!<!<group>!>!>";

        $sql = "SELECT * FROM chat WHERE `Name`='$name' AND `grp`='yes' AND `Owner`='$user'";
            $consulta = mysqli_query($mysqli, $sql);

        if (mysqli_num_rows($consulta) != 0) {
            $return .= " <!fail!>";
        } else {
        //$senhaS = password_hash($senha, PASSWORD_DEFAULT);
            $sql = "INSERT INTO chat (`Name`, `Owner`, `Private_key`, `Public_key`, `Status`, `grp`) VALUES ('$name', '$user', '1', '1', 'offline', 'yes')";
                mysqli_query($mysqli, $sql);

                $sql = "SELECT * FROM chat WHERE `Name`='$name' AND `grp`='yes' AND `Owner`='$user'";
                $result = mysqli_query($mysqli, $sql);

                while($row = mysqli_fetch_array($result))
                {
                    $return = "<!id!>".$row["id"]."<!id!>";
                }

            $return .= " <!sucess!>";
        }

    return $return;
}
?>