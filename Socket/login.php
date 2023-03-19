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

function login($email, $senha){
    $mysqli = new mysqli("localhost","root", "", "Message_app");

    $return = "";


        $sql = "SELECT * FROM chat WHERE Email = '$email'";
            $consulta = mysqli_query($mysqli, $sql);
                $coluna = mysqli_fetch_array($consulta);

        if (mysqli_num_rows($consulta) == 0){

                $return .=  "<!fail mail!>";
            $return .= $email;
                $return .=  "<!fail mail!>";

        } else if ($senha != $coluna["Password"]){
            $return .= "<!fail pass!>";
        } else {

                $return .=  "<!id!>";
            $return .= $coluna["id"];
                $return .=  "<!id!>";

            if ($coluna["Image"] != ""){

                    $return .=  "<!img!>";
                $return .= $coluna["Image"];
                    $return .=  "<!img!>";

            }else{

                    $return .=  "<!img!>";
                $return .= "images/default.png";
                    $return .=  "<!img!>";

            }
        }

    return $return;
}
?>
