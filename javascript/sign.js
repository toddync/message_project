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
    
  if (data.status = "success") {
    if(data.ctxStatus == "success"){
      document.querySelector("#sign").innerHTML = "Account created!";
    } else {
      document.querySelector("#sign").innerHTML ="Email already regstered";
    }
  }
};

function sign(){
    
    var username = document.getElementById("signName").value;
    var email = document.getElementById("signMail").value;
    var password =document.getElementById("signPass").value;

    if(username=="" || email=="" || password==""){
        document.querySelector("#sign").innerHTML = "fill all the fields";
    } else {
        conn.send(JSON.stringify({
            act:"register",
            ctx:"sign",
            email:email,
            username:username,
            password:password
        }));
    }
}

document.querySelector("#action").addEventListener("click", sign );