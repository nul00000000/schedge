
enum LoginCode {
    SUCCESS = 0,
    USERNAME_TAKEN,
    EMAIL_TAKEN,
    PASSWORD_MISMATCH
}

export type LoginState = {
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

export function isFormValid(email: string, pass: string, pass2: string): LoginState {
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