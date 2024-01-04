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

type Message = {
    code: number;
    message: string;
}

type TutorInfo = {
    bio: string
}

type Profile = {
	id: number,
	firstName: string,
	lastName: string,
    tutorInfo: TutorInfo,
    tutorType: number
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

    deleteSlots(ids: number[], callback: (schedule: Schedule) => any, day?: number, month?: number, year?: number) {
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
            startTime: year == 0 ? new Date() : new Date(year, month, day).getTime()
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
    },

    getTutorSlot(slotId: number, callback: (slot: TutorSlot) => any, errorCallback?: (message: Message) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                let obj = JSON.parse(xhr.responseText);
                if(!obj || "message" in obj) {
                    if(errorCallback) {
                        errorCallback(obj as Message);
                    }
                } else {
                    callback(obj as TutorSlot);
                }
            }
        }
        let data = JSON.stringify({
            type: "getslot",
            slotId: slotId
        });
        xhr.send(data);
    },

    reserveTutorSlot(slotId: number, callback: (slot: TutorSlot) => any, errorCallback?: (message: Message) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                let obj = JSON.parse(xhr.responseText);
                if(!obj || "message" in obj) {
                    if(errorCallback) {
                        errorCallback(obj as Message);
                    }
                } else {
                    callback(obj as TutorSlot);
                }
            }
        }
        let data = JSON.stringify({
            type: "reserveslot",
            slotId: slotId
        });
        xhr.send(data);
    }, 

    unreserveTutorSlot(slotId: number, callback: (slot: TutorSlot) => any, errorCallback?: (message: Message) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                let obj = JSON.parse(xhr.responseText);
                if(!obj || "message" in obj) {
                    if(errorCallback) {
                        errorCallback(obj as Message);
                    }
                } else {
                    callback(obj as TutorSlot);
                }
            }
        }
        let data = JSON.stringify({
            type: "unreserveslot",
            slotId: slotId
        });
        xhr.send(data);
    },

    updateProfile(profile: Profile, callback: (p: Profile) => any, errorCallback?: (message: Message) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                let obj = JSON.parse(xhr.responseText);
                if(!obj || "message" in obj) {
                    if(errorCallback) {
                        errorCallback(obj as Message);
                    }
                } else {
                    callback(obj as Profile);
                }
            }
        }
        let data = JSON.stringify({
            type: "updateprofile",
            profile: profile
        });
        xhr.send(data);
    }

};

//real

let loginCorner: HTMLDivElement;
let accountCorner: HTMLDivElement;

let profile: Profile;

function onLoad() {
    loginCorner = document.querySelector("#loginCorner") as HTMLDivElement;
    accountCorner = document.querySelector("#accountCorner") as HTMLDivElement;

    main();
}

function updateProfile() {
    account.updateProfile({
        id: profile.id,
        firstName: (document.querySelector("#first") as HTMLInputElement).value,
        lastName: (document.querySelector("#last") as HTMLInputElement).value,
        tutorInfo: {bio: (document.querySelector("#bio") as HTMLTextAreaElement).value} as TutorInfo,
        tutorType: profile.tutorType
    } as Profile, (acc) => {
        let updateConfirmation = document.querySelector("#updateConfirmation") as HTMLDivElement;
        updateConfirmation.style.display = "block";
        updateConfirmation.style.animation = "confirmFade 1s 1s forwards";
        updateConfirmation.onanimationend = () => {
            updateConfirmation.style.display = "none";
            updateConfirmation.style.animation = "";
        };
        profile = acc;
        updateProfileUI(acc);
    });
}

function updateProfileUI(acc: Profile) {
    console.log(acc);
    if(acc != null) {
        loginCorner.style.display = "none";
        accountCorner.style.display = "flex";
        document.querySelector("#accountName").textContent = "Hi, " + acc.firstName + " " + acc.lastName;
        (document.querySelector("#first") as HTMLInputElement).value = acc.firstName;
        (document.querySelector("#last") as HTMLInputElement).value = acc.lastName;
        if(acc.tutorInfo.bio && acc.tutorInfo.bio.length > 0) {
            (document.querySelector("#bio") as HTMLTextAreaElement).value = acc.tutorInfo.bio;
        }
    } else {
        console.log("how did you even get here");
    }
}

function main(): void {
    account.requestProfile((acc: Profile) => {
        if(!acc || acc.id == 0) {
            location.href = "/login/";
        }
        updateProfileUI(acc); 
        profile = acc; 
    });
}