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

enum Subject {
    MATH, SOCIAL, SCIENCE, ENGLISH, MISC, NONE
}

type TutorSlot = {
    slotId: number,
    tutorId: number,
    bookerId: number,
    startTime: number,
    endTime: number
}

type Schedule = {
    slots: TutorSlot[]
    hashCode: number;
}

//TODO im thinking master schedule with everytthing

type Profile = {
	id: number,
	firstName: string,
	lastName: string,
	schedule: Schedule
};

let account = {
    profileRequest: {type: "profile"},
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

    addTutorSlot(tutorId: number, startHour: number, startMinute: number, endHour: number, endMinute: number, day: number, month: number, year: number, callback: (schedule: Schedule) => any) {
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
            slot: {
                    tutorId: tutorId,
                    bookerId: 0,
                    startTime: new Date(year, month, day, startHour, startMinute).getTime(),
                    endTime: new Date(year, month, day, endHour, endMinute).getTime(),
                } as TutorSlot,
            startTime: new Date(year, month, day).getTime()
        });
        xhr.send(data);
    },

    getSchedule(day: number, month: number, year: number, callback: (schedule: Schedule) => any) {
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
            startTime: new Date(year, month, day).getTime()
        });
        xhr.send(data);
    },

    deleteSlots(ids: number[], day: number, month: number, year: number, callback: (schedule: Schedule) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText) as Schedule);
            }
        }
        let data = JSON.stringify({
            type: "deleteslots",
            ids: ids,
            startTime: new Date(year, month, day).getTime()
        });
        xhr.send(data);
    },

    getTutorProfile(tutorId: number, callback: (profile: Profile) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText) as Profile);
            }
        }
        let data = JSON.stringify({
            type: "tutorinfo",
            tutorId: tutorId
        });
        xhr.send(data);
    }

};