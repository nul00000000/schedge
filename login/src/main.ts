import * as account from "../../src/account";

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
    return account.isFormValid((createForm.children[0] as HTMLInputElement).value,
        (createForm.children[3] as HTMLInputElement).value,
        (createForm.children[4] as HTMLInputElement).value);
};