function encodeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/>/g, '&gt;');
}

if(sessionStorage.getItem("id") == null || sessionStorage.getItem("id") == "" || sessionStorage.getItem("id") == "undefined"){
  window.location.replace("./index.html");
}

var conn = new WebSocket('ws://192.168.1.106:8080');

// Attach an error listener to the WebSocket object
conn.addEventListener('error', function(event) {
  console.log('WebSocket error:', event);
  console.log("error ocours in conection");
  $("#error").html("There was an error in your conection to the server, or the devs forget to turn the server on...");
});

document.getElementById("id").innerHTML = "Your id is: " + sessionStorage.getItem("id") ;
document.getElementById("user").setAttribute("data-User-Id",sessionStorage.getItem("id")) ;
document.getElementById("user").setAttribute("src",sessionStorage.getItem("img")) ;

/*      VANILLA PART      */


const textarea = document.querySelector("textarea");
textarea.addEventListener("keydown", e =>{
  textarea.style.height = "50px";
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px`;
});

const toggleButton = document.querySelector('.dark-light');
const colors = document.querySelectorAll('.color');
var mode = 1;

colors.forEach(color => {
  color.addEventListener('click', e => {
    const theme = color.getAttribute('data-color');
    document.body.setAttribute('data-theme', theme);
    var colorns = document.getElementsByClassName(color.getAttribute("data-cn"));
    colors.forEach(c => c.classList.remove('selected'));
    colorns[0].classList.add('selected');
    colorns[1].classList.add('selected');
    localStorage.setItem('color',color.getAttribute('data-color'));
    //console.log(localStorage.getItem('color'))
  });
});

if(localStorage.getItem('color') != '' && localStorage.getItem('color') != null){
        
  document.getElementById(localStorage.getItem('color')).click()
        
}

toggleButton.addEventListener('click', () => {                      
    

    if(localStorage.getItem('mode') == 'l' && (mode % 2) == 0){
        
        localStorage.setItem('mode', 'd');
        mode++;
        
    } else {

        localStorage.setItem('mode', 'l');
        mode--;

    }
    
   document.body.classList.toggle('dark-mode');
});


if(localStorage.getItem('mode') == 'l'){
        
  toggleButton.click()
        
}


function select(id){

  var user = document.getElementById('user').getAttribute('data-User-Id');

  if( document.getElementById('result').getAttribute('data-Current-User-Id') != id ){

  document.getElementById('result').setAttribute('data-Current-User-Id', id);
  document.getElementById('chat_img').setAttribute('src', document.getElementById("usr"+id).getAttribute('data-img') );
  document.getElementById('chat_img2').setAttribute('src', document.getElementById("usr"+id).getAttribute('data-img') );
  document.getElementById('chat_name').innerHTML = document.getElementById("usr"+id).getAttribute('data-Username');
  document.getElementById('chat_name2').innerHTML = document.getElementById("usr"+id).getAttribute('data-Username');
  var actives = document.querySelectorAll('.active');
  
  actives.forEach (active => {

    active.classList.remove('active');

  });
  document.getElementsByClassName("usr"+id)[0].classList.add('active');
  document.getElementsByClassName("usr"+id)[1].classList.add('active');
  document.getElementById('to_send').value = '';
  document.getElementById("result").innerHTML ="";
  document.getElementById("loader").style.display = "block";
  var dat = document.querySelectorAll(".usr"+id+"-date");

        dat.forEach( when => {

          var count = 0;
          when.setAttribute("data-count", "0");

          var date = when.getAttribute("data-date");

          var style = "style='display: none'";

          when.innerHTML = date + "<span class='new-msgs msgs-"+id+"'" + style + "></span>";
        });

        if(document.getElementsByClassName("usr"+id)[1].classList.contains("group")){
          conn.send("<!<!<group_msg>!>!> <!search!><!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
          document.getElementById("search").setAttribute("data-grp", "yes");
          document.getElementById("search2").setAttribute("data-grp", "yes");
        }else{
          conn.send("<!<!<request msg>!>!> <!search!><!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
          document.getElementById("search").setAttribute("data-grp", "no");
          document.getElementById("search2").setAttribute("data-grp", "no");
        }
  //console.log('hovered');
  }
}
/* messages */

var i = 0;

function notification(id) {
    // are there any active notifications?
    var active = $('body').find('#noteWrap').length;
    var element = document.getElementById("usr"+id);
    //alert(active);
    if (active < 1) {
      i = 0; 
    }
    // append alert
    $('body').append("<div onclick='document.getElementById("+'"msg_'+ (1+i) +'"'+").style.display= "+'"none"'+"; select("+'"'+ id +'"'+")' id='msg_"+(1+i)+"' ><div class='msg-"+ (++i) +"' id='noteWrap'><div class='noteContent'><p style='font-size:15px'> New message from: <br>" + element.getAttribute("data-Username") + "</p></div></div></div>"); 
  
    if (i >= 1) {var r = i * 4;}  
    $('.msg-'+i).animate({top: 10}, "slow");
    $('.msg-'+i).fadeOut(14000, function(){ 
      $(this).remove();
    });
    $('.msg-'+i).css("margin-top",(r)+"rem");
    
    if (i > 4) {
      i = 0;
    }
  
  }



/*      JQUERY PART      */

//$(document).ready(function(){

  document.getElementById('Adicionar').addEventListener('blur', leave);


  

  conn.onopen = function(e) {

  conn.send("<!userId!>"+document.getElementById('user').getAttribute('data-User-Id')+"<!userId!> <!<!<user>!>!>");
  conn.send("<!id!>"+document.getElementById('user').getAttribute('data-User-Id')+"<!id!> <!<!<requested user>!>!>");
  

  };

  conn.onmessage = function(e) {
   // console.log(e.data);
//console.log(e.data);
   if(e.data.includes("<!<!<requested msg>!>!>")){
    document.getElementById("result").innerHTML = e.data.split("<!msg!>")[1];
    document.getElementById("loader").style.display = "none";

            var objDiv = document.getElementById('result');
            objDiv.scrollTop = objDiv.scrollHeight;
            document.getElementById("loader").style.display = "none";
            //document.getElementById("to_send").focus();

   } else if(e.data.includes("<!<!<requested user>!>!>")){

    document.getElementById("users").innerHTML = e.data.split("<!user!>")[1];
    document.getElementById("users2").innerHTML = e.data.split("<!user!>")[1];

   } else if(e.data.includes("<!<!<sended msg>!>!>")){

    var id =e.data.split("<!msg_id!>")[1];
    var id_ =e.data.split("<!id!>")[1];

    if(e.data.includes("<!sucess!>")){
    console.log(e.data);
      document.getElementById( id ).style.color = "";
      document.getElementById(id).setAttribute("id", "msg_"+id_);
   } else if (e.data.includes("<!fail!>")){
      document.getElementById( id ).style.color = "red";
   }

  } else if(e.data.includes("!<!<relation>!>!>")){

    if(e.data.includes("<!sucess!>")){
      conn.send("<!id!>"+document.getElementById('user').getAttribute('data-User-Id')+"<!id!> <!<!<requested user>!>!>");
    }  else {
      $("#usr-data").html("User not found, or you have added this user already...<br><br>");
    }

  } else if(e.data.includes("<!<!<usr>!>!>")){
console.log(e.data)
    conn.send("<!id!>"+document.getElementById('user').getAttribute('data-User-Id')+"<!id!> <!<!<requested user>!>!>");

  } else if(e.data.includes("<!<!<msg>!>!>")){

        var result = document.getElementById('result');

        let from = e.data.split("<!sender!>")[1];
        let date = e.data.split("<!date!>")[1];
        let msg = e.data.split("<!msg!>")[1];
        console.log("-----");
        console.log("recieving message: "+msg);
        console.log("from: "+from);
        console.log("-----");
      //  notification(from);
        

        if(document.getElementById('result').getAttribute('data-Current-User-id') == from){
          if(msg.length > 0){
            result.innerHTML += "<div class='chat-msg'><div class='chat-msg-profile'><img class='chat-msg-img' src='images/default.png' alt=''><div class='chat-msg-date'>" + date +"</div></div><div class='chat-msg-content'><div class='chat-msg-text'>" + msg + "</div></div></div>";
            
            var objDiv = document.getElementById('result');
            objDiv.scrollTop = objDiv.scrollHeight;

          }   
          var cont = document.querySelectorAll(".usr"+from+"-cont");

        cont.forEach( content => {
          content.innerHTML = msg;
        });

        var dat = document.querySelectorAll(".usr"+from+"-date");

        dat.forEach( when => {

          var count = parseInt(when.getAttribute("data-count"));

            var style = "style='display: none'";

          when.innerHTML = date + "<span class='new-msgs msgs-"+from+"'" + style + ">" + count + "+ </span>";
          when.setAttribute("data-count", count);
        });
        
      } else {
        notification(from);
        var cont = document.querySelectorAll(".usr"+from+"-cont");

        cont.forEach( content => {
          content.innerHTML = msg;
        });

        var dat = document.querySelectorAll(".usr"+from+"-date");

        dat.forEach( when => {

          var count = parseInt(when.getAttribute("data-count")) + 1;

          if(count == 0){
            var style = "style='display: none'";
          } else {
            var style = "";
          }

          when.innerHTML = date + "<span class='new-msgs msgs-"+from+"'" + style + ">" + count + "+ </span>";
          when.setAttribute("data-count", count);
        });

      }
      }
  }; 

  //console.log(e.message);


    
      $('down').click(function(){
        var objDiv = document.getElementById('result');
        objDiv.scrollTop = objDiv.scrollHeight;
      });
    
    
      function add()
      {
        msg= encodeHTML($('#to_send').val());
        $('#to_send').val('')
        document.getElementById("to_send").focus();

        if(msg != ""){
        var to = document.getElementById('result').getAttribute('data-Current-User-id');
        var id = document.getElementById('user').getAttribute('data-User-Id');
        var date = moment().format('YYYY-MM-DD H:mm:ss');
        var msg_id = moment().format('H:mm:ss');

        conn.send("<!<!<sended msg>!>!> <!msg!>"+msg+"<!msg!> <!reciever!>"+to+"<!reciever!> <!sender!>"+id+"<!sender!> <!date!>"+date+"<!date!> <!msg_date!>"+moment().format("H:mm")+"<!msg_date!> <!msg_id!>"+ msg_id +"<!msg_id!>");

        console.log(msg);

          
          msg = msg.replace( /\n/g ,"<br>");
          document.getElementById('result').innerHTML += "<div class='chat-msg owner'><div class='chat-msg-profile'><img class='chat-msg-img' src='images/default.png' alt=''><div class='chat-msg-date'>" + moment().format('H:mm') +"</div></div><div class='chat-msg-content'><div class='chat-msg-text' style='color: gray' id='"+msg_id+"'>" + msg + "</div></div></div>";
          var objDiv = document.getElementById('result');
            objDiv.scrollTop = objDiv.scrollHeight;
        }
      }
      
        

      function add_user()
      {

          var user = document.getElementById('user').getAttribute('data-User-Id');
          var user2 = $('#rel').val();


          if(user2 != "0" && user2 != user){

            conn.send("<!<!<relation>!>!> <!id1!>"+user+"<!id1!> <!id2!>"+user2+"<!id2!>");

            $('#rel').val("");
            $("#usr-data").html("");

          }
          else if(user2 == "0")
          {
            $("#usr-data").html("You can't add user 0...<br>This user was banned...<br><br>");
            $('#rel').val("");

        } else if(user2 == user)
        {
          $("#usr-data").html("You can't add yourself...<br>This is sad...<br><br>");
        }
      }



var checked = true;

      function check() {

        var gr = document.getElementById("gr");
        var grp = document.getElementById("grp");
        var usr = document.getElementById("us");
      
        if (checked == true){
          gr.style.display = "block";
          grp.checked = true;
          usr.style.display = "none";
          checked = false;
        } else {
          usr.style.display = "block";
          grp.checked = false;
          gr.style.display = "none";
          checked = true;
        }
        console.log(checked);
      }
    
      $('#search').keyup(function(){
      var search = $(this).val();
      var id = document.getElementById('result').getAttribute('data-Current-User-Id');
      var user = document.getElementById('user').getAttribute('data-User-Id');
      if(search != '')
      {
        if(this.getAttribute("data-grp") == "yes"){
          conn.send("<!<!<group_msg>!>!> <!search!>"+search+"<!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
        } else {
          conn.send("<!<!<request msg>!>!> <!search!>"+search+"<!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
        }
      }
      else
      {
        if(this.getAttribute("data-grp") == "yes"){
          conn.send("<!<!<group_msg>!>!> <!search!><!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
        } else {
          conn.send("<!<!<request msg>!>!> <!search!><!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
        }
      }
      $(this).focus
      });

     $('#search2').keyup(function(){
      var search = $(this).val();
      var id = document.getElementById('result').getAttribute('data-Current-User-Id');
      var user = document.getElementById('user').getAttribute('data-User-Id');
      if(search != '')
      {
        if(this.getAttribute("grp") == "yes"){
          conn.send("<!<!<group_msg>!>!> <!search!>"+search+"<!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
        } else {
          conn.send("<!<!<request msg>!>!> <!search!>"+search+"<!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
        }
      }
      else
      {
        if(this.getAttribute("grp") == "yes"){
          conn.send("<!<!<group_msg>!>!> <!search!><!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
        } else {
          conn.send("<!<!<request msg>!>!> <!search!><!search!> <!user!>"+user+"<!user!> <!chat!>"+id+"<!chat!>");
        }
      }
      $(this).focus
      });
    
      $('#search_users').keyup(function(){
      var search = $(this).val();
      if(search != '')
      {
        load_users(search);
      }
      else
      {
        load_users();
      }
      });

      $('#search_users2').keyup(function(){
        var search = $(this).val();
        if(search != '')
        {
          load_users2(search);
        }
        else
        {
          load_users2();
        }
        });
    
      $('#send').click(function(){  
        if(document.getElementById('result').getAttribute('data-Current-User-id') != "0"){
        add()
        }
        });

      $('#Adicionar').click(function(){  add_user()  });


      function leave(){
        if(this.value != ''){
            this.offsetParent.className += " ativo";
        }else{
            this.offsetParent.className = 'box';
        }
    }
  

    
      //load_users2();
    
    
//    });

