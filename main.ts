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

// actual code

let loginCorner = document.querySelector("#loginCorner") as HTMLDivElement;
let accountCorner = document.querySelector("#accountCorner") as HTMLDivElement;

function updateProfileUI(acc: Profile) {
    console.log(acc);
    if(acc != null) {
        loginCorner.style.display = "none";
        accountCorner.style.display = "flex";
        document.querySelector("#accountName").textContent = "Hi, " + acc.firstName + " " + acc.lastName;
    } else {
        loginCorner.style.display = "flex";
        accountCorner.style.display = "none";
    }
}

function main(): void {
    account.requestProfile(updateProfileUI);
}

main();