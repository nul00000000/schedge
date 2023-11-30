//base code for login stuff

enum LoginCode {
    SUCCESS = 0,
    USERNAME_TAKEN,
    EMAIL_TAKEN,
    PASSWORD_MISMATCH
}

type LoginState = {
    msg: string;
    code: LoginCode;
}

function doesEmailExist(email: string): boolean {
    //TODO check username rather than assuming false
    return false;
}

function doesUsernameExist(user: string): boolean {
    //TODO check username rather than assuming false
    return false;
}

function isFormValid(email: string, pass: string, pass2: string): LoginState {
	if(email.includes("@") && email.slice(email.indexOf("@")).includes(".")) {
        return {msg: "Email already in use", code: LoginCode.USERNAME_TAKEN};
    } else if(doesEmailExist(email)) {
        return {msg: "Email already in use", code: LoginCode.EMAIL_TAKEN};
    } else if(pass != pass2) {
        return {msg: "Passwords must match", code: LoginCode.PASSWORD_MISMATCH};
	} else {
		return {msg: "Form Valid", code: LoginCode.SUCCESS};
	}
}

//actual login code

function setText(): void {
	var urlParams = new URLSearchParams(window.location.search);
	var incPass = (document.querySelector("#inc_pass") as HTMLParagraphElement);

	if(urlParams.has("code")) {
		if(urlParams.get("code") == "1") {
			incPass.textContent = "Username or password is incorrect";
		} else if(urlParams.get("code") == "2") {
			incPass.textContent = "An error occured, try again";
		} else if(urlParams.get("code") == "3") {
			incPass.textContent = "An account with that email already exists";
		} else if(urlParams.get("code") == "4") {
			incPass.textContent = "Password must be at least 8 characters, and have one uppercase letter, one lowercase letter, a number, and a special character (?,!,#,$)";
		} else if(urlParams.get("code") == "5") {
			incPass.textContent = "Account activation failed";
		} else if(urlParams.get("code") == "69") {
			incPass.textContent = "haha funny number";
		} else {
			incPass.textContent = "messing with the url you are";
		}
		incPass.style.visibility = "visible";
	}
}

let createForm = (document.querySelector("#createAccountPanel") as HTMLFormElement);
createForm.onsubmit = () => {
    return isFormValid((createForm.children[0] as HTMLInputElement).value,
        (createForm.children[3] as HTMLInputElement).value,
        (createForm.children[4] as HTMLInputElement).value);
};