<?php

function add_rel($id1, $id2){

    $mysqli = new mysqli("localhost","root", "", "Message_app");

    $sql = "SELECT * FROM chat WHERE id = '$id2'";
    $consult = mysqli_query($mysqli, $sql);

    $sql = "SELECT * FROM `users_relation` WHERE `usr1`= '$id1' AND `usr2`= '$id2'";
    $consult2 = mysqli_query($mysqli, $sql);

    if (mysqli_num_rows($consult) > 0 && mysqli_num_rows($consult2) == 0){
    
            $query= "INSERT INTO `users_relation` (`usr1`, `usr2`) VALUES ('".$id1."', '".$id2."'), ('".$id2."', '".$id1."')";

            mysqli_query($mysqli, $query);
            echo "success";
        
    } else {
        return "in";
    }

}