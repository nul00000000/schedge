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
