<?php
namespace chat;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use mysqli;

require("search_and_show_msgs.php");
require("search_and_show_users.php");
require("send_msg.php");
require("add_rel.php");


class Chat implements MessageComponentInterface {

    protected $clients;
    protected $user = array();

    protected $mysqli;

    public function __construct() {
         //echo msgs("","1","7");
         //echo str_contains("<!<!<action>!>!> <!msg!>oioioioioioi<!msg!>","<!<!<action>!>!>");
         //print_r( explode("<!msg!>","<!<!<usr>!>!> <!msg!>oioioioioioi<!msg!> ") );
        $this->clients = new \SplObjectStorage;

        $this->mysqli = new mysqli("127.0.0.1",
        "root",
        "",
        "Message_app");

    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";

        $conn -> send("<!msg!>oi<!msg!> <!<!<gived msg>!>!> ");
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $numRecv = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

                /*$words = explode(" ", $msg);
                if(sizeof($words) > 1){
                    $to = explode("<!reciever!>",$msg);
                    $sender = explode("<!sender!>",$msg);
                    $action = $words[2];
                    unset($words[0]);
                    unset($words[1]);
                    unset($words[2]);
                    $Msg = explode("<!msg!>",$msg);
                } else {
                    $action ="usr";
                }*/

        if( str_contains($msg,"<!<!<request msg>!>!>") == 1 ){

            $search = explode("<!search!>",$msg);
            $chat = explode("<!chat!>",$msg);
            $user = explode("<!user!>",$msg);

            $from -> send("<!<!<requested msg>!>!> <!msg!>".msgs($search[1],$chat[1],$user[1])."<!msg!>");

        } else if (str_contains($msg,"<!<!<user>!>!>") == 1 ) {
            $id = explode("<!userId!>",$msg);
            $this->user[$from->resourceId] = $id[1];

            

            //$from -> send("oi");

            $query = "UPDATE `chat` SET `Status` = 'online' WHERE `chat`.`id` = ".$this->user[$from->resourceId]."";
            mysqli_query($this->mysqli, $query);

            foreach ($this->clients as $client) {

                if ($from !== $client) {
                    // The sender is not the receiver, send to each client connected
                    $client->send("usr");
                }
            }
            
        } else if (str_contains($msg,"<!<!<requested user>!>!>") == 1 ) {

            $id = explode("<!id!>",$msg);

            $from -> send("<!<!<requested user>!>!> <!user!>". users($id[1]) ."<!user!>");

        } else if(str_contains($msg,"<!<!<sended msg>!>!>") == 1 ){

            $to = explode("<!reciever!>",$msg);
            $sender = explode("<!sender!>",$msg);
            $date = explode("<!date!>",$msg);
            $Msg = explode("<!msg!>",$msg);
            $msg_date = explode("<!msg_date!>",$msg);
            $msg_id = explode("<!msg_id!>",$msg);
            $msg_id = $msg_id[1];


            if(in_array($to[1], $this->user)){
                foreach ($this->clients as $client) {
echo "---\n";
                    print_r($this->user);
echo "---\n";
                    //print_r($client);
                    if ( $this->user[$client->resourceId] == $to[1]) {
                        // The receiver is only the intended reciever
                        $client->send("<!<!<msg>!>!> <!msg!>".$Msg[1]."<!msg!> <!sender!>".$sender[1]."<!sender!> <!date!>".$msg_date[1]."<!date!>");
                    }
                }
            }

                $bool = send_msg($sender[1], $to[1], $Msg[1], $date[1]);

                $id = explode("<!id!>", $bool);

            if (str_contains($bool,"sucess") == 1 )
            {

                $from -> send("<!<!<sended msg>!>!> <!msg_id!>$msg_id<!msg_id!> <!id!>".$id[1]."<!id!> <!sucess!>");

            } else {

                $from -> send("<!<!<sended msg>!>!> <!msg_id!>$msg_id<!msg_id!> <!fail!>");

            }
        } else if (str_contains($msg,"<!<!<relation>!>!>") == 1 ) {
            $id1 = explode("<!id1!>",$msg);
            $id2 = explode("<!id2!>",$msg);
            $response = add_rel($id1[1], $id2[1]);

            if($response == "in"){
                $from -> send("<!<!<relation>!>!> <!fail!>");
            } else {
                $from -> send("<!<!<relation>!>!> <!sucess!>");
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        if(array_key_exists( $conn->resourceId , $this->user )){
            echo "Connection {$conn->resourceId} has disconnected\n";
            $query = "UPDATE `chat` SET `Status` = 'offline' WHERE `chat`.`id` = ".$this->user[$conn->resourceId];
            mysqli_query($this->mysqli, $query);

            foreach ($this->clients as $client) {
                $client->send("usr");
            }
        }

    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}