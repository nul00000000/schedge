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
    MATH, SOCIAL, SCIENCE, ENGLISH, MISC, NONE
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

//TODO im thinking master schedule with everytthing

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
    },

    clearSchedule(callback: (schedule: Schedule) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText) as Schedule);
            }
        }
        let data = JSON.stringify({
            type: "clearschedule",
            params: []
        } as ServerRequest);
        xhr.send(data);
    },

    getTutorProfile(tutorId: number, callback: (schedule: Schedule) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText) as Schedule);
            }
        }
        let data = JSON.stringify({
            type: "tutorinfo",
            params: [
                tutorId
            ]
        } as ServerRequest);
        xhr.send(data);
    },

    getAllTutors(callback: (schedule: Profile[]) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText) as Profile[]);
            }
        }
        let data = JSON.stringify({
            type: "gettutors",
            params: []
        } as ServerRequest);
        xhr.send(data);
    },

};

//actual code

let currentMonth = 0;
let currentYear = 0;

let actualYear = 0;
let actualMonth = 0;
let actualDay = 0;

let timetableRowTemplate: HTMLTemplateElement;

function updateCalender() {
    let label = document.getElementById("monthLabel") as HTMLParagraphElement;
    const date = new Date(currentYear, currentMonth, 1);
    console.log(date.toString() + " " + currentMonth);
    const month = date.toLocaleString('default', { month: 'short' });
    label.textContent = month + " " + currentYear;
    for(let i = 0; i < 42; i++) {
        let cell = document.getElementById("dayRow" + Math.floor(i / 7)) as HTMLTableRowElement;
        let e = cell.children[i % 7] as HTMLTableCellElement;
        e.className = "emptyCell";
        e.children[0].textContent = "";
        (document.getElementById("dayRow5") as HTMLTableRowElement).style.display = "none";
    }
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    let len = new Date(currentYear, currentMonth + 1, 0).getDate();
    if(len + firstDay > 35) {
        (document.getElementById("dayRow5") as HTMLTableRowElement).style.display = "contents";
    }
    for(let i = 0; i < len; i++) {
        let cell = document.getElementById("dayRow" + Math.floor((i + firstDay) / 7)) as HTMLTableRowElement;
        let e = cell.children[(i + firstDay) % 7] as HTMLTableCellElement;
        e.className = "fullCell";
        e.onclick = () => {location.href='/day'};
        e.children[0].textContent = "" + (i + 1);
    }
    if(currentMonth == actualMonth && currentYear == actualYear) {
        let cell = document.getElementById("dayRow" + Math.floor((actualDay + firstDay - 1) / 7)) as HTMLTableRowElement;
        let e = cell.children[(actualDay + firstDay - 1) % 7] as HTMLTableCellElement;
        e.className = "currentCell";
    }
    
}

function generateEventNode(supject: string, tutor: string, subject: string): HTMLDivElement {
    let eventThing = document.createElement("div");
    eventThing.className = "slot " + supject;
    let tutorName = document.createElement("div");
    tutorName.textContent = tutor;
    eventThing.appendChild(tutorName);
    return eventThing;
}

function loadSchedule() {
    let table = document.querySelector("#daySheet tbody") as HTMLTableElement;
    for(let i = 16; i < 30; i++) { 
        let nHour = Math.floor(i / 2);
        let hour = (nHour < 10 ? "0" : "") + nHour
        let nMin = (i % 2) * 30;
        let min = (nMin < 10 ? "0" : "") + nMin
        let row = (timetableRowTemplate.content.cloneNode(true) as DocumentFragment).children[0] as HTMLTableRowElement;
        (row.children[0] as HTMLTableCellElement).textContent = hour + ":" + min;
        table.appendChild(row);
    }
}

function onLoad(): void {
    let dt = new Date();
    currentMonth = dt.getMonth();
    currentYear = dt.getFullYear();
    actualYear = dt.getFullYear();
    actualMonth = dt.getMonth();
    actualDay = dt.getDate();
    console.log(dt.toString() + " " + currentMonth);
    timetableRowTemplate = document.querySelector("#timetableRow") as HTMLTemplateElement;
    console.log(timetableRowTemplate);
    updateCalender();
    loadSchedule();
}

function updateEventDisplay(profiles: Profile[]) {
    let table = document.querySelector("#daySheet tbody") as HTMLTableElement;
    for(let i = 1; i < table.children.length; i++) { 
        let row = table.children[i] as HTMLTableRowElement;
        row.children[1].children[0].innerHTML = "";
    }
    for(let j = 0; j < profiles.length; j++) {
        let schedule = profiles[j].schedule;
        for(let i = 0; i < schedule.slots.length; i++) {
            let rowIndex = schedule.slots[i].startHour * 2 + (schedule.slots[i].startMinute < 30 ? 0 : 1) - 16;
            let row = table.children[rowIndex + 1];
            let eventThingCont = row.children[1].children[0];
            let subj = "noSubject";
            if(schedule.slots[i].subject == Subject.MATH) {
                subj = "math";
            } else if(schedule.slots[i].subject == Subject.SOCIAL) {
                subj = "social";
            } else if(schedule.slots[i].subject == Subject.SCIENCE) {
                subj = "science";
            } else if(schedule.slots[i].subject == Subject.ENGLISH) {
                subj = "english";
            } else if(schedule.slots[i].subject == Subject.MISC) {
                subj = "misc";
            }
            eventThingCont.appendChild(generateEventNode(subj, profiles[j].firstName + " " + profiles[j].lastName.charAt(0), schedule.slots[i].clas));//TODO get name somehow
        }
    }
}

function changeMonth(amount: number): void {
    currentMonth += amount;
    while(currentMonth < 0) {
        currentYear--;
        currentMonth += 12;
    }
    while(currentMonth >= 12) {
        currentYear++;
        currentMonth -= 12;
    }
    updateCalender();
}

//more login handling realistically

let loginCorner = document.querySelector("#loginCorner") as HTMLDivElement;
let accountCorner = document.querySelector("#accountCorner") as HTMLDivElement;
let tutorControl = document.querySelector("#tutorControl") as HTMLDivElement;

function updateProfileUI(acc: Profile) {
    console.log(acc);
    if(acc != null) {
        loginCorner.style.display = "none";
        accountCorner.style.display = "flex";
        tutorControl.style.display = "block"; //if tutor
        document.querySelector("#accountName").textContent = "Hi, " + acc.firstName + " " + acc.lastName;
    } else {
        loginCorner.style.display = "flex";
        accountCorner.style.display = "none";
        tutorControl.style.display = "none";
    }
    account.getAllTutors(updateEventDisplay);
}

function submitAddSlot() {
    let sub = +(document.querySelector("#subjectSelect") as HTMLSelectElement).value as Subject;
    account.addTutorSlot(sub, 
        (document.querySelector("#classChoose") as HTMLSelectElement).value,
        +(document.querySelector("#startHour") as HTMLSelectElement).value,
        +(document.querySelector("#startMinute") as HTMLSelectElement).value,
        +(document.querySelector("#endHour") as HTMLSelectElement).value,
        +(document.querySelector("#endMinute") as HTMLSelectElement).value,
        () => {account.getAllTutors(updateEventDisplay);});
}

function submitClear() {
    account.clearSchedule(() => {account.getAllTutors(updateEventDisplay);});
}

function main(): void {
    account.requestProfile(updateProfileUI);
}

main();