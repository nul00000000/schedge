var LoginCode;
(function (LoginCode) {
    LoginCode[LoginCode["SUCCESS"] = 0] = "SUCCESS";
    LoginCode[LoginCode["USERNAME_TAKEN"] = 1] = "USERNAME_TAKEN";
    LoginCode[LoginCode["EMAIL_TAKEN"] = 2] = "EMAIL_TAKEN";
    LoginCode[LoginCode["PASSWORD_MISMATCH"] = 3] = "PASSWORD_MISMATCH";
})(LoginCode || (LoginCode = {}));
function doesEmailExist(email) {
    return false;
}
function doesUsernameExist(user) {
    return false;
}
function isFormValid(email, pass, pass2) {
    if (email.includes("@") && email.slice(email.indexOf("@")).includes(".")) {
        return { msg: "Email already in use", code: LoginCode.USERNAME_TAKEN };
    }
    else if (doesEmailExist(email)) {
        return { msg: "Email already in use", code: LoginCode.EMAIL_TAKEN };
    }
    else if (pass != pass2) {
        return { msg: "Passwords must match", code: LoginCode.PASSWORD_MISMATCH };
    }
    else {
        return { msg: "Form Valid", code: LoginCode.SUCCESS };
    }
}
function setText() {
    var urlParams = new URLSearchParams(window.location.search);
    var incPass = document.querySelector("#inc_pass");
    if (urlParams.has("code")) {
        if (urlParams.get("code") == "1") {
            incPass.textContent = "Username or password is incorrect";
        }
        else if (urlParams.get("code") == "2") {
            incPass.textContent = "An error occured, try again";
        }
        else if (urlParams.get("code") == "3") {
            incPass.textContent = "An account with that email already exists";
        }
        else if (urlParams.get("code") == "4") {
            incPass.textContent = "Password must be at least 8 characters, and have one uppercase letter, one lowercase letter, a number, and a special character (?,!,#,$)";
        }
        else if (urlParams.get("code") == "5") {
            incPass.textContent = "Account activation failed";
        }
        else if (urlParams.get("code") == "69") {
            incPass.textContent = "haha funny number";
        }
        else {
            incPass.textContent = "messing with the url you are";
        }
        incPass.style.visibility = "visible";
    }
}
var createForm = document.querySelector("#createAccountPanel");
createForm.onsubmit = function () {
    return isFormValid(createForm.children[0].value, createForm.children[3].value, createForm.children[4].value);
};
