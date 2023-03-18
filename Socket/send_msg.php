<?php

function send_msg($sender, $reciever, $msg, $date){

    $mysqli = new mysqli("localhost","root", "", "Message_app");


        $sql =  "INSERT INTO mensagens (sender, message, reciever, seen, date) VALUES ( '$sender' , '$msg' , '$reciever' , '0', '$date')";

        mysqli_query($mysqli, $sql);

        $sql = "SELECT * FROM mensagens WHERE sender= '$sender' AND `message`= '$msg' AND `reciever`= '$reciever' AND `date`= '$date'";

        $ids = mysqli_query($mysqli, $sql);

        while($row = mysqli_fetch_array($ids))
        {
            $id = $row["msg_id"];
        }

        return "sucess <!id!>$id<!id!>";

}