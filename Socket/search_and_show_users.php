<?php
/*
include("conexao.php");

if ( isset($_GET["query"])){
    $query = "SELECT * FROM users WHERE username LIKE '%".$_GET["query"]."%' AND User_id != '".$id."' AND Username != ''";
}else{
    $query = "SELECT * FROM users WHERE User_id != '".$id."' AND Username != ''";
}
	$result = mysqli_query($mysqli, $query);

    $return ="";


	while($row = mysqli_fetch_array($result))
	{

        $return .= "
        
        <div onClick='select(".'"'.$row["User_id"].'"'.")' data-Username='".$row["Username"]."' id='".$row["User_id"]."' class='msg ".$row["User_status"]."'
        data-img='";
        if(isset($row["User_image"])){
            $return .= $row["User_image"]; 
           } else {
                $return .= "images/default.png"; 
           }
        $return .="'>
            <img class='msg-profile' src='";
            
            if(isset($row["User_image"])){
                 $return .= $row["User_image"]; 
                } else {
                     $return .= "images/default.png"; 
                }     
                $return .="' alt='' />
            <div class='msg-detail'>
                <div class='msg-username'>".$row["Username"]."</div>
                    <div class='msg-content'>
                    <!-- <span class='msg-message'>What time was our meet</span>
                    <span class='msg-date'>20m</span> -->
                </div>
            </div>
       </div>";

    }

    $return .= "
    <button class='add'></button>
    <div class='overlay'></div>
    ";

echo $return;

*/
date_default_timezone_set("America/Sao_Paulo");

function users($id){

    $mysqli = new mysqli("localhost","root", "", "Message_app");

    $query = "SELECT * FROM users_relation WHERE usr1 = ".$id;

	$result1 = mysqli_query($mysqli, $query);

    $return ="
   ";

   while($row = mysqli_fetch_array($result1))
   {
    
    $query = "SELECT * FROM chat WHERE id = ".$row["usr2"];

    $result2 = mysqli_query($mysqli, $query);

        while($row1 = mysqli_fetch_array($result2))
        {
            $query = "SELECT * FROM (SELECT * FROM mensagens WHERE sender = '".$row1["id"]."' AND reciever = '".$id."' OR sender = '".$id."' AND reciever = '".$row1["id"]."' ORDER BY msg_id DESC LIMIT 1)Var1 ORDER BY msg_id ASC ";
            $lastMsg = mysqli_query($mysqli, $query);

            
            $query = "SELECT * FROM mensagens WHERE sender = '".$row["usr2"]."' AND reciever='".$id."' AND seen = '0'";
            $temp = mysqli_query($mysqli, $query);
            $count = mysqli_num_rows($temp);
            if($count == 0){
                $count = "0";
                $style = "style='display: none'";
            } else {
                $style = "";
            }

            $return .= "
            
            <div onClick='select(".'"'.$row1["id"].'"'.")' data-Username='".$row1["Name"]."' id='usr".$row1["id"]."' class='msg ".$row1["Status"]." usr".$row1["id"]."'
            data-img='";
            if(isset($row1["Image"])){
                $return .= $row1["Image"]; 
            } else {
                    $return .= "images/default.png"; 
            }
            $return .="'>
                <img class='msg-profile' src='";
                
                if(isset($row1["Image"])){
                    $return .= $row1["Image"]; 
                    } else {
                        $return .= "images/default.png"; 
                    }     
                    $return .="' alt='' />
                <div class='msg-detail'>
                    <div class='msg-username'>".$row1["Name"]."</div>
                        <div class='msg-content'>";
                        while($msg = mysqli_fetch_array($lastMsg)){

                            if(date_format(date_create($msg["date"]), "d/m/Y") != date_format(date_create(), "d/m/Y") ){
                                $date = date_format(date_create($msg["date"]), "d/m/Y");
                            } else {
                                $date = date_format(date_create($msg["date"]), "H:i");
                            }

                            if($msg["sender"] != $id){
                               $content = $msg["message"];
                            } else {
                                $content = "You: " . $msg["message"];
                            }
                        $return .="
                        <span class='msg-message usr".$row1["id"]."-cont'>".$content."</span>
                        <span class='msg-date usr".$row1["id"]."-date' data-date='$date' data-count='$count' >".$date;
                        }

                        $return .=" <span $style class='new-msgs msg-".$row["usr2"]."'>$count+</span>
                        </span>
                    </div>
                </div>
        </div>";

        }
    }
    $return .= "
    <button class='add' data-bs-toggle='offcanvas' data-bs-target='#add'></button>
    <div class='overlay'></div>
    ";

return $return;
}