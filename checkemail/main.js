var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get("id");
var a = document.querySelector("#resend");
a.onclick = function () {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://schedge.net/auth/resendemail");
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(id);
};
