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
    }

};

//real

let loginCorner: HTMLDivElement;
let accountCorner: HTMLDivElement;

let loggedIn: HTMLDivElement;
let loggedOut: HTMLDivElement;

let openView: HTMLDivElement;
let reservedView: HTMLDivElement;
let selfReservedView: HTMLDivElement;

let profile: Profile;
let loaded = false;

let slot: TutorSlot;
let tutor: Profile;

function updateSlotUI(slot: TutorSlot) {
    if(slot) {
        let start = new Date(slot.startTime);
        let end = new Date(slot.endTime);
        document.querySelector("#times").textContent = start.toLocaleTimeString().replace(":00", "") + " - " + end.toLocaleTimeString().replace(":00", "");
        document.querySelector("#date").textContent = start.toLocaleString('en-US', {weekday: 'long'}) + " " + start.toLocaleDateString();

        if(profile) {
            if(slot.bookerId == 0) {
                openView.style.display = "block";
                reservedView.style.display = "none";
                selfReservedView.style.display = "none";
            } else if(slot.bookerId == profile.id) {
                openView.style.display = "none";
                reservedView.style.display = "none";
                selfReservedView.style.display = "block";
            } else {
                openView.style.display = "none";
                reservedView.style.display = "block";
                selfReservedView.style.display = "none";
            }
        }
    } else {
        (document.querySelector("#defaultView") as HTMLDivElement).style.display = "none";
        (document.querySelector("#errorView") as HTMLDivElement).style.display = "block";
    }
}

function updateTutorUI() {
    document.querySelector("#tutorName").textContent = tutor.firstName + " " + tutor.lastName;
}

let urlParams = new URLSearchParams(window.location.search);
account.getTutorSlot(+urlParams.get("slotId"), (_slot: TutorSlot) => {
    slot = _slot;
    if(loaded) {
        updateSlotUI(slot);
    }
}, () => updateSlotUI(null));
account.getTutorProfile(+urlParams.get("tutorId"), (_tutor: Profile) => {
    tutor = _tutor;
    if(loaded) {
        updateTutorUI();
    }
});

function onLoad() {
    loaded = true;
    if(slot) {
        updateSlotUI(slot);
    }
    if(tutor) {
        updateTutorUI();
    }

    loginCorner = document.querySelector("#loginCorner") as HTMLDivElement;
    accountCorner = document.querySelector("#accountCorner") as HTMLDivElement;

    loggedIn = document.querySelector("#loggedIn") as HTMLDivElement;
    loggedOut = document.querySelector("#loggedOut") as HTMLDivElement;

    openView = document.querySelector("#openView") as HTMLDivElement;
    reservedView = document.querySelector("#reservedView") as HTMLDivElement;
    selfReservedView = document.querySelector("#selfReservedView") as HTMLDivElement;

    main();
}

function updateProfileUI(acc: Profile) {
    console.log(acc);
    if(acc != null) {
        loginCorner.style.display = "none";
        accountCorner.style.display = "flex";
        document.querySelector("#accountName").textContent = "Hi, " + acc.firstName + " " + acc.lastName;
        loggedIn.style.display = "block";
        loggedOut.style.display = "none";
    } else {
        loginCorner.style.display = "flex";
        accountCorner.style.display = "none";
        loggedIn.style.display = "none";
        loggedOut.style.display = "block";
    }
}

function reserveSlot() {
    account.reserveTutorSlot(slot.slotId, updateSlotUI);
}

function main(): void {
    account.requestProfile((acc: Profile) => {updateProfileUI(acc); profile = acc; updateSlotUI(slot)});
}