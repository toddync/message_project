var conn = new WebSocket(socket);

// Attach an error listener to the WebSocket object
conn.addEventListener('error', function(event) {
  console.log('WebSocket error:', event);
  console.log("error occours in conection");
  window.alert("There was an error in your conection to the server, or the devs forget to turn the server on...");
});

conn.onmessage = function(e){
    
    let data = JSON.parse(e.data);
    
    console.log(data)
    
    if (data.ctxStatus == "success") {
      
         sessionStorage.setItem("id", data.id);
        sessionStorage.setItem("img", data.img);
         window.location.replace("home.html");
      
    } else {
        
         document.querySelector("#login").innerHTML = "wrong e-mail or password";
    }
};

function login(){
    
    var email = document.getElementById("logMail").value;
    var password = document.getElementById("logPass").value;

    if(email == "" || password == ""){
        
        document.querySelector("#login").innerHTML = "fill all the fields";
    } else {
       
        conn.send(JSON.stringify({
            act:"register",
            ctx:"login",
            email: email,
            password: password
        }));
        
        //document.getElementById("login_msg").click();
        //window.location.replace("home.php");
        //console.log("log");
   }
}
  
document.querySelector("#log").addEventListener("click", login )