<?php

date_default_timezone_set("America/Sao_Paulo");

function msgs_group($search, $chat, $user ){

    $mysqli = new mysqli("localhost","root", "", "Message_app");

if ( $search != ""){
    $query = "SELECT * FROM (SELECT * FROM mensagens WHERE message LIKE '%".$search."%' AND reciever = '".$chat."' ORDER BY msg_id DESC LIMIT 50)Var1 ORDER BY msg_id ASC ";
}else{
    $query = "SELECT * FROM (SELECT * FROM mensagens WHERE reciever = '".$chat."'  ORDER BY msg_id DESC LIMIT 50)Var1 ORDER BY msg_id ASC ";
}
	$result = mysqli_query($mysqli, $query);

    //$query = "UPDATE `mensagens` SET `seen` = '1' WHERE `mensagens`.`reciever` = '" . $user . "' AND `mensagens`.`sender` = '". $chat ."'";
    mysqli_query($mysqli, $query);

    $group = true;
    $last_sender ="";
    $return ="";
    $datetime2 = date_format(date_create(), "Y-m-d H:i:s");

	while($row = mysqli_fetch_array($result))
	{

        $dat= date_create($row["date"]);

        if(isset($lastdate)){
            if($lastdate != date_format($dat, "d/m/Y" )){
                $return .= "<br><span class='date-span'>".$lastdate."</span><br><br>";
            }
        }
        
        $date = date_format($dat, "H:i");

        /*if ($date == ""){
            $dat= date_create($row["date"]);
            $date = date_format($dat, "d") . " de " .  date_format($dat, "M") . " de " .  date_format($dat, "Y");
            $last_date = $date;
        }
        

        if($last_sender != $row["sender"] && $last_sender != ""){

            $return .= "</div></div>";
            $group = true;

        }*/

        if ($row["sender"] == $user ){// && $row["sender"] != $last_sender){
                
                

                $return .= "

                    <div class='chat-msg owner'>

                        <div class='chat-msg-profile'>
                        <img class='chat-msg-img' src='images/default.png' alt=''>
                        <div class='chat-msg-date'>".$date."</div>

                    </div>
                    <div class='chat-msg-content'>
                        <div id='msg_".$row['msg_id']."' class='chat-msg-text'>".str_replace("\n", "<br>", $row['message'])."</div>
                    </div>
                </div>
                ";

                $last_sender = $row["sender"];
                $group == false;
                $lastdate = date_format($dat, "d/m/Y" );
        } 
        
        if ($row["sender"] != $user ){//&& $row["sender"] != $last_sender){
                
                

                $return .= "

                    <div class='chat-msg'>

                        <div class='chat-msg-profile'>
                        <img class='chat-msg-img' src='";

                    $query = "SELECT * FROM chat WHERE id = '".$row["sender"]."'";
                    $res = mysqli_query($mysqli, $query);

                    while($row1 = mysqli_fetch_array($res)){
                        if($row1["Image"] != ""){
                            $return .= $row1["Image"];
                        }else{
                            $return .= "images/default.png" ;
                        }
                    }

                        $return.="' alt=''>
                        <div class='chat-msg-date'>".$date."</div>

                    </div>

                    <div class='chat-msg-content'>
                    <span>";
                    $query = "SELECT * FROM users WHERE User_id = '".$row["sender"]."'";
                    $res = mysqli_query($mysqli, $query);

                    while($row1 = mysqli_fetch_array($res)){
                    $return .= $row1["Username"];
                    }
                    $return .= "</span>
                        <div id='".$row['msg_id']."' class='chat-msg-text'>".str_replace("\n", "<br>", $row['message'])."</div>
                    </div>
                </div>
                ";

            $group == false;
            $last_sender = $row["sender"];
            $lastdate = date_format($dat, "d/m/Y" );
            
    }

   // $return .= "<div id='".$row['msg_id']."' class='chat-msg-text'>".str_replace("\n", "<br>", $row['message'])."</div>";

   /* if( isset($last_date) && calculateTimeDifference($row["date"]) != "" ){

        $return .= "</div></div> <hr>";
        $group = true;

    }*/

	}

    if( !(isset($search)) && $lastdate != date_format(date_create(), "d/m/Y")){

        $return .= "<br><span class='date-span'>".$lastdate."</span><br><br>" ;

    }

if ( isset($search) && $return == ""){
        $return = "
                <div style='position: absolute; top:50%;left:50%; transform: Translate(-50%,-50%)' class='chat-msg'>

                        <div class='chat-msg-profile'>
                        <img class='chat-msg-img' src='images/default.png' alt=''>
                        <div class='chat-msg-date'></div>

                    </div>

                    <div class='chat-msg-content'>
                        <div class='chat-msg-text'>No messages found...</div>
                    </div>
                </div>
        ";
    } 

	return $return;

}
    
    /*function to calculate the time difference between two mysql timestamps
    function calculateTimeDifference($timestamp1) {
        $timestamp1 = strtotime($timestamp1);
        $time = new DateTime();
        $time2 = $time -> format('Y-m-d H:i:s');
        $timestamp2 = strtotime($time2);
        $timeDiff = abs($timestamp2 - $timestamp1);
        $d = floor($timeDiff / (60 * 60 * 24));
        $h = floor(($timeDiff % (60 * 60 * 24)) / (60 * 60));
        $m = floor(($timeDiff % (60 * 60)) / 60);
        $s = floor($timeDiff % 60);
        $time_diff = "";
        $formats = array("%a" => "d", "%h" => "h", "%i" => "m");//, "%s" => "s");
        foreach ($formats as $key => $value) {
            if($$value > 0) {
                $time_diff .= $$value . "" . $value . " ";
            }
        }

        $time_diff = rtrim($time_diff, "");
        
            return $time_diff;
        
    }
*/
?>
