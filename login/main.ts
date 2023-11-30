//base code for login stuff

enum LoginCode {
    SUCCESS = 0,
    USERNAME_TAKEN,
    EMAIL_TAKEN,
    PASSWORD_MISMATCH
}

type LoginState = { //would be export
    msg: string;
    code: LoginCode;
}

type ServerRequest = {
	type: string;
	params: any[];
}

enum Subject {
    MATH, SOCIAL, SCIENCE, ENGLISH, MISC
}

type TutorSlot = {
    bookerId: number,
    subject: Subject,
    clas: string,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
}

type Schedule = {
    slots: TutorSlot[]
}

type Profile = {
	id: number,
	firstName: string,
	lastName: string,
	schedule: Schedule
};

let account = {
    profileRequest: {type: "profile", params: []} as ServerRequest,
    isFormValid(email: string, pass: string, pass2: string): LoginState { //would also be export
        if(email.includes("@") && email.slice(email.indexOf("@")).includes(".")) {
            return {msg: "Email already in use", code: LoginCode.USERNAME_TAKEN};
        } else if(pass != pass2) {
            return {msg: "Passwords must match", code: LoginCode.PASSWORD_MISMATCH};
        } else {
            return {msg: "Form Valid", code: LoginCode.SUCCESS};
        }
    },

    requestProfile(callback: (acc: Profile) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText) as Profile);
            }
        }
        let data = JSON.stringify(account.profileRequest);
        xhr.send(data);
    },

    addTutorSlot(subject: Subject, clas: string, startHour: number, startMinute: number, endHour: number, endMinute: number, callback: (schedule: Schedule) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText) as Schedule);
            }
        }
        let data = JSON.stringify({
            type: "addtutorslot",
            params: [
                {
                    bookerId: 0,
                    subject: subject,
                    clas: clas,
                    startHour: startHour,
                    startMinute: startMinute,
                    endHour: endHour,
                    endMinute: endMinute
                } as TutorSlot
            ]
        } as ServerRequest);
        xhr.send(data);
    },

    getSchedule(tutorId: number, callback: (schedule: Schedule) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText) as Schedule);
            }
        }
        let data = JSON.stringify({
            type: "getschedule",
            params: [
                tutorId
            ]
        } as ServerRequest);
        xhr.send(data);
    }

};

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
    return account.isFormValid((createForm.children[0] as HTMLInputElement).value,
        (createForm.children[3] as HTMLInputElement).value,
        (createForm.children[4] as HTMLInputElement).value);
};

setText();