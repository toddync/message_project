function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/"/g, '&Prime;').replace(/'/g, '&prime;');
}

/*if (!sessionStorage.getItem("id")) {
    window.location.replace("./index.html");
}*/

var id = sessionStorage.getItem("id") || 1

var conn = new WebSocket(`${socket}?id=${id}`);

// Attach an error listener to the WebSocket object
conn.addEventListener('error', function(event) {
    //console.log('WebSocket error:', event);
    //console.log("error ocours in conection");
    $("#error").html("There was an error in your conection to the server, or the devs forget to turn the server on...");
});

document.getElementById("id").innerHTML = "Your id is: " + (sessionStorage.getItem("id") || 1);
document.getElementById("user").setAttribute("data-User-Id", (sessionStorage.getItem("id")) || 1);
document.getElementById("user").setAttribute("src", (sessionStorage.getItem("img") || "./images/default.png"));

/*      VANILLA PART      */


const textarea = document.querySelector("textarea");
textarea.addEventListener("keydown", e => {
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
        localStorage.setItem('color', color.getAttribute('data-color'));
        ////console.log(localStorage.getItem('color'))
    });
});

if (localStorage.getItem('color') != '' && localStorage.getItem('color') != null) {

    document.getElementById(localStorage.getItem('color')).click()

}

toggleButton.addEventListener('click', () => {


    if (localStorage.getItem('mode') == 'l' && (mode % 2) == 0) {

        localStorage.setItem('mode', 'd');
        mode++;

    } else {

        localStorage.setItem('mode', 'l');
        mode--;

    }

    document.body.classList.toggle('dark-mode');
});


if (localStorage.getItem('mode') == 'l') {

    toggleButton.click()

}


function select(id) {

    var user = document.getElementById('user').getAttribute('data-User-Id');

    if (document.getElementById('result').getAttribute('data-Current-User-Id') != id) {

        document.getElementById('result').setAttribute('data-Current-User-Id', id);
        document.getElementById('chat_img').setAttribute('src', document.getElementById("usr"+id).getAttribute('data-img'));
        document.getElementById('chat_img2').setAttribute('src', document.getElementById("usr"+id).getAttribute('data-img'));
        document.getElementById('chat_name').innerHTML = document.getElementById("usr"+id).getAttribute('data-Username');
        document.getElementById('chat_name2').innerHTML = document.getElementById("usr"+id).getAttribute('data-Username');
        var actives = document.querySelectorAll('.active');

        actives.forEach (active => {

            active.classList.remove('active');

        });
        document.getElementsByClassName("usr"+id)[0].classList.add('active');
        document.getElementsByClassName("usr"+id)[1].classList.add('active');
        document.getElementById('to_send').value = '';
        document.getElementById("result").innerHTML = "";
        document.getElementById("loader").style.display = "block";
        var dat = document.querySelectorAll(".usr"+id+"-date");

        dat.forEach(when => {

            var count = 0;
            when.setAttribute("data-count", "0");

            var date = when.getAttribute("data-date");

            var style = "style='display: none'";

            when.innerHTML = date + "<span class='new-msgs msgs-"+id+"'" + style + "></span>";
        });

        if (document.getElementsByClassName("usr"+id)[1].classList.contains("group")) {
            conn.send({
                act: "request", ctx: "group_msg", user: user, chat: id
            });
            document.getElementById("search").setAttribute("data-grp", "yes");
            document.getElementById("search2").setAttribute("data-grp", "yes");
        } else {
            
            conn.send(JSON.stringify({
                act: "request", ctx: "msg", chat: id
            }));
    
            document.getElementById("search").setAttribute("data-grp", "no");
            document.getElementById("search2").setAttribute("data-grp", "no");
        }
        ////console.log('hovered');
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

    if (i >= 1) {
        var r = i * 4;
    }
    $('.msg-'+i).animate({
        top: 10
    }, "slow");
    $('.msg-'+i).fadeOut(14000, function() {
        $(this).remove();
    });
    $('.msg-'+i).css("margin-top", (r)+"rem");

    if (i > 4) {
        i = 0;
    }

}



/*      JQUERY PART      */

//$(document).ready(function(){

document.getElementById('Adicionar').addEventListener('blur', leave);

conn.onopen = () => {
    /*conn.send(JSON.stringify({
        act: "request", ctx: "msg", chat: "3"
    }));*/
}

conn.onmessage = function(e) {
    var data = JSON.parse(e.data)
    
    console.log(data)
    
    if (data.status == "success") {

        if (data.ctx === "loadChat") {

            data.msgs.forEach(msg => {

                document.getElementById("result").innerHTML += buildMsg(msg, data.reqId, data.chat, data.img);

            })

            document.getElementById("loader").style.display = "none";

            var objDiv = document.getElementById('result');
            objDiv.scrollTop = objDiv.scrollHeight;

            //document.getElementById("loader").style.display = "none";
            document.getElementById("to_send").focus();

        } else if(data.act == "firstLoad" && data.ctx == "user"){
            
            //console.log(JSON.stringify(data, null, 2))
        
            document.querySelectorAll(".users").forEach(usrBox => {
                //console.log("u")
                data.users.forEach(user => {
                    //console.log("uu")
                    usrBox.innerHTML += buildUser(user);
                })
                
                usrBox.innerHTML += `
                    <button class='add' data-bs-toggle='offcanvas' data-bs-target='#add'></button>
                    <div class='overlay'></div>
                `;
            })

        } else if (data.act === "update" && data.ctx === "msg") {

            var id = data.id;
            var id_ = data.msg_id;

            if (data.ctxStatus === "success") {
                //console.log(e.data);
                document.getElementById(id).style.color = "";
                document.getElementById(id).setAttribute("id", "msg_"+id_);
            } else if (data.ctxStatus === "fail") {
                document.getElementById(id).style.color = "red";
            }

        } else if (data.act === "response" && e.data.ctx === "relation") {

            if (data.ctxStatus === "success") {
                conn.send({
                    act: "request", ctx: "users", id: document.getElementById('user').getAttribute('data-User-Id')});
            } else {
                $("#usr-data").html("User not found, or you have added this user already...<br><br>");
            }

        } else if (data.act === "request" && e.data.ctx === "id") {
            //console.log(data)
            conn.send({
                act: "response", ctx: "register", id: document.getElementById('user').getAttribute('data-User-Id')});

        } else if (data.act === "recieve" && data.ctx === "msg") {

            var result = document.getElementById('result');

            let from = data.from;
            let date = data.date;
            let msg = data.msg;
            //console.log("-----");
            //console.log("recieving message: "+msg);
            //console.log("from: "+from);
            //console.log("-----");
            //  notification(from);


            if (document.getElementById('result').getAttribute('data-Current-User-id') == from) {
                if (msg.length > 0) {
                    result.innerHTML += "<div class='chat-msg'><div class='chat-msg-profile'><img class='chat-msg-img' src='images/default.png' alt=''><div class='chat-msg-date'>" + date +"</div></div><div class='chat-msg-content'><div class='chat-msg-text'>" + msg + "</div></div></div>";

                    var objDiv = document.getElementById('result');
                    objDiv.scrollTop = objDiv.scrollHeight;

                }
                var cont = document.querySelectorAll(".usr"+from+"-cont");

                cont.forEach(content => {
                    content.innerHTML = msg;
                });

                var dat = document.querySelectorAll(".usr"+from+"-date");

                dat.forEach(when => {

                    var count = parseInt(when.getAttribute("data-count"));

                    var style = "style='display: none'";

                    when.innerHTML = date + "<span class='new-msgs msgs-"+from+"'" + style + ">" + count + "+ </span>";
                    when.setAttribute("data-count", count);
                });

            } else {
                notification(from);
                var cont = document.querySelectorAll(".usr"+from+"-cont");

                cont.forEach(content => {
                    content.innerHTML = msg;
                });

                var dat = document.querySelectorAll(".usr"+from+"-date");

                dat.forEach(when => {

                    var count = parseInt(when.getAttribute("data-count")) + 1;

                    if (count == 0) {
                        var style = "style='display: none'";
                    } else {
                        var style = "";
                    }

                    when.innerHTML = date + "<span class='new-msgs msgs-"+from+"'" + style + ">" + count + "+ </span>";
                    when.setAttribute("data-count", count);
                });

            }
        }
    }
};

////console.log(e.message);



$('down').click(function() {
    var objDiv = document.getElementById('result');
    objDiv.scrollTop = objDiv.scrollHeight;
});


function add() {
    msg = encodeHTML($('#to_send').val());
    $('#to_send').val('')
    document.getElementById("to_send").focus();

    if (msg != "") {
        var to = document.getElementById('result').getAttribute('data-Current-User-id');
        var id = document.getElementById('user').getAttribute('data-User-Id');
        var date = moment().format('YYYY-MM-DD H:mm:ss');
        var msg_id = new Date().getTime();

        conn.send(JSON.stringify({
            act: "send",
            ctx: "msg",
            msg: msg,
            to: to,
            user: id,
            date: date,
            msg_date: moment().format("H:mm"),
            msg_id: msg_id
        }));

        msg = msg.replace(/\n/g, "<br>");
        document.getElementById('result').innerHTML += `
            <div class='chat-msg owner'>
                <div class='chat-msg-profile'>
                    <img class='chat-msg-img' src='images/default.png' alt=''>
                    <div class='chat-msg-date'>
                        ${timeSince(new Date(), "msg")}
                    </div>
                </div>
                <div class='chat-msg-content'>
                    <div class='chat-msg-text' style='color: lightgray' id='${msg_id}'>
                        ${msg}
                    </div>
                </div>
            </div>`;
            
        var objDiv = document.getElementById('result');
        objDiv.scrollTop = objDiv.scrollHeight;
    }
}



function add_user() {

    var user = document.getElementById('user').getAttribute('data-User-Id');
    var user2 = $('#rel').val();


    if (user2 != "0" && user2 != user) {

        conn.send(JSON.stringify({
            act: "relation",
            ctx: "add",
            id: user,
            id2: user2
        }));

        $('#rel').val("");
        $("#usr-data").html("");

    } else if (user2 == "0") {
        $("#usr-data").html("You can't add user 0...<br>This user was banned...<br><br>");
        $('#rel').val("");

    } else if (user2 == user) {
        $("#usr-data").html("You can't add yourself...<br>This is sad...<br><br>");
    }
}



var checked = true;

function check() {

    var gr = document.getElementById("gr");
    var grp = document.getElementById("grp");
    var usr = document.getElementById("us");

    if (checked == true) {
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
    //console.log(checked);
}

$('#search').keyup(function() {
    var search = $(this).val();
    var id = document.getElementById('result').getAttribute('data-Current-User-Id');
    var user = document.getElementById('user').getAttribute('data-User-Id');

    if (this.getAttribute("data-grp") == "yes") {
        conn.send({
            act: "search", ctx: "group_msg", search: search, user: user, chat: id
        });
    } else {
        conn.send({
            act: "search", ctx: "msg", search: search, user: user, chat: id
        });
    }
    $(this).focus
});

$('#search2').keyup(function() {
    var search = $(this).val();
    var id = document.getElementById('result').getAttribute('data-Current-User-Id');
    var user = document.getElementById('user').getAttribute('data-User-Id');

    if (this.getAttribute("grp") == "yes") {
        conn.send({
            act: "search", ctx: "group_msg", user: user, chat: id, search: search || ""
        });
    } else {
        conn.send({
            act: "search", ctx: "msg", user: user, chat: id, search: search || ""
        });
    }

    $(this).focus
});

$('#search_users').keyup(function() {
    var search = $(this).val();
    if (search != '') {
        load_users(search);
    } else
    {
        load_users();
    }
});

$('#search_users2').keyup(function() {
    var search = $(this).val();
    if (search != '') {
        load_users2(search);
    } else
    {
        load_users2();
    }
});

$('#send').click(function() {
    if (document.getElementById('result').getAttribute('data-Current-User-id') != "0") {
        add()
    }
});

$('#Adicionar').click(function() {
    add_user()
});


function leave() {
    if (this.value != '') {
        this.offsetParent.className += " ativo";
    } else {
        this.offsetParent.className = 'box';
    }
}

function buildMsg(msg, id, chat, img) {
    var date = new Date();
    msg.date = new Date(msg.date);
    msg.date = timeSince(msg.date, "msg");

  /*  if(date == msg.date){
        if(date.getFullYear() == msg.date.getFullYear){}
    }
  */
  
    if (msg.sender == id) {
        var r =`
        <div class='chat-msg owner group'>
            <div class='chat-msg-profile'>
                <img class='chat-msg-img' src='images/default.png' alt=''>
                <div class='chat-msg-date'>${msg.date}</div>
            </div>
            <div class='chat-msg-content'>
                <div id='msg_${msg.msg_id}' class='chat-msg-text'>${msg.message.replace("\n", "<br>")}</div>
            </div>
        </div>
        `;
        
        return r;
    }
    
        var r = `
        <div class='chat-msg'>
            <div class='chat-msg-profile'>
                <img class='chat-msg-img' src='${img}' alt=''>
                <div class='chat-msg-date'>${msg.date}</div>
            </div>
            <div class='chat-msg-content'>
                <span class='username'>${chat}</span>
                <div id='${msg.msg_id}' class='chat-msg-text'>${msg.message.replace("\n", "<br>")}</div>
            </div>
        </div>
        `;
        
        return r;
}

function buildUser(user){
    var date = user.lastMsg ? timeSince(user.lastMsg.date) : ""
    let sender = ""
    
    if(date){
        let sender = user.lastMsg.sender == user.id ? user.lastMsg.message : "You: " + user.lastMsg.messag
    }
   
    var r = `
            <div onClick='select(${user.id})' data-Username='${user.Name}' id='usr${user.id}' class='msg ${status} ${user.group} usr${user.id}' data-img='${user.Image || "./imagens/default.png"}'>
                <img class='msg-profile' src='${user.Image}' alt='' />
                <div class='msg-detail'>
                    <div class='msg-username'>${user.Name}</div>
                        <div class='msg-content'>
                            <span class='msg-message usr".$row1["id"]."-cont'>${sender}</span>
                            <span class='msg-date usr${user.id}-date' data-date='${date}' data-count='${user.unseen}' >${date}
                                <span style='${user.unseen > 0 ? "" : "display:none"}' class='new-msgs msg-${user.id}'>${user.unseen}</span>
                            </span>
                    </div>
                </div>
        </div>`;
        
        return r
}

function timeSince(date, msg){
    
    if (!msg){
        
        let now = new Date().getTime();
        let msgTime = new Date(date).getTime();
        date = new Date(date)
    
        var s = Math.floor( ( now - msgTime ) / 1000 );
        var m = Math.floor( s / 60 );
        var h = Math.floor( m / 60 );
        var d = Math.floor( h / 24 );
        
        if(d > 1){
            
            return date.toLocaleString('en-GB').split(",")[0];
            
        } else {
            
            let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            let m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        
            return h == 24 ? "ontem" : `${h}:${m}`;
        }
        
    } else {
        
        let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        let m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        
        return h+":"+m;
    }
}