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
    tutorType: number;
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

//actual code

let currentMonth = 0;
let currentYear = 0;

let actualYear = 0;
let actualMonth = 0;
let actualDay = 0;

let urlParams = new URLSearchParams(window.location.search);
if(urlParams.has("day") && urlParams.has("month") && urlParams.has("year")) {
    currentMonth = +urlParams.get("month");
    currentYear = +urlParams.get("year");
    actualYear = currentYear;
    actualMonth = currentMonth;
    actualDay = +urlParams.get("day");
} else {
    let dt = new Date();
    currentMonth = dt.getMonth();
    currentYear = dt.getFullYear();
    actualYear = dt.getFullYear();
    actualMonth = dt.getMonth();
    actualDay = dt.getDate();
}

let tutorDict: {[id: number] : Profile} = {}

let timetableRowTemplate: HTMLTemplateElement;

async function getTutor(id: number): Promise<Profile> {
    if(tutorDict[id]) {
        return Promise.resolve(tutorDict[id]);
    } else {
        return new Promise<Profile>((resolve, reject) => {
            account.getTutorProfile(id, (prof: Profile) => {resolve(prof); tutorDict[prof.id] = prof;});
        });
    }
}

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
        e.onclick = () => {location.href="/day/?day=" + (i + 1) + "&month=" + currentMonth + "&year=" + currentYear};
        e.children[0].textContent = "" + (i + 1);
    }
    if(currentMonth == actualMonth && currentYear == actualYear) {
        let cell = document.getElementById("dayRow" + Math.floor((actualDay + firstDay - 1) / 7)) as HTMLTableRowElement;
        let e = cell.children[(actualDay + firstDay - 1) % 7] as HTMLTableCellElement;
        e.className = "currentCell";
    }
}

function generateEventNode(supject: string, tutor: string, tutorId: number, slotId: number, minuteLength: number): HTMLDivElement {
    let eventThing = document.createElement("div");
    eventThing.className = "slot " + supject;
    eventThing.style.height = (minuteLength / 1.92) + "vh";
    let tutorName = document.createElement("div");
    tutorName.textContent = tutor;
    eventThing.appendChild(tutorName);
    eventThing.onclick = () => {location.href = "/slot?slotId=" + slotId + "&tutorId=" + tutorId};
    return eventThing;
}

function loadSchedule() {
    let table = document.querySelector("#daySheet tbody") as HTMLTableElement;
    for(let i = 0; i < 7; i++) { 
        let nHour = (38 + i * 5) < 60 ? 13 : 14;
        let nMin = (38 + i * 5) % 60;
        let row = (timetableRowTemplate.content.cloneNode(true) as DocumentFragment).children[0] as HTMLTableRowElement;
        (row.children[0] as HTMLTableCellElement).textContent = new Date(0, 0, 0, nHour, nMin).toLocaleTimeString().replace(":00", "");
        (row.children[1].children[0] as HTMLDivElement).style.transform = "translateX(" + (i * 0.5) + "%)";
        table.appendChild(row);
    }
}

function onLoad(): void {
    timetableRowTemplate = document.querySelector("#timetableRow") as HTMLTemplateElement;
    updateCalender();
    loadSchedule();
}

let currentSchedule: Schedule;

function updateEventDisplay(schedule: Schedule) {
    if(schedule && (!currentSchedule || currentSchedule.hashCode != schedule.hashCode)) {
        currentSchedule = schedule;
        let table = document.querySelector("#daySheet tbody") as HTMLTableElement;
        for(let i = 1; i < table.children.length; i++) {
            let row = table.children[i] as HTMLTableRowElement;
            row.children[1].children[0].innerHTML = "";
        }
        for(let i = 0; i < schedule.slots.length; i++) {
            if(schedule.slots[i].tutorId == profile.id || schedule.slots[i].bookerId == 0) {
                let start = new Date(schedule.slots[i].startTime);
                let rowIndex = start.getHours() * 12 + Math.floor(start.getMinutes() / 5) - 163;
                let row = table.children[rowIndex + 1];
                if(row) {
                    let eventThingCont = row.children[1].children[0];
                    let subj = schedule.slots[i].tutorId == profile.id ? "misc" : "noSubject";
                    let length = (schedule.slots[i].endTime - schedule.slots[i].startTime) / 60000;
                    let tutorProf = getTutor(schedule.slots[i].tutorId);
                    tutorProf.then((profile) => {
                        eventThingCont.appendChild(generateEventNode(subj, profile.firstName + " " + profile.lastName.charAt(0), schedule.slots[i].tutorId, schedule.slots[i].slotId, length));
                    }, () => {
                        console.log("Failed to get tutor profile");
                    });
                } else {
                    console.log("Invalid time: " + start.toLocaleTimeString() + " " + rowIndex);
                }
            }
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

let profile: Profile;

function updateProfileUI(acc: Profile) {
    profile = acc;
    if(acc != null) {
        loginCorner.style.display = "none";
        accountCorner.style.display = "flex";
        tutorControl.style.display = profile.tutorType == 1 ? "block" : "none";
        document.querySelector("#accountName").textContent = "Hi, " + acc.firstName + " " + acc.lastName;
    } else {
        loginCorner.style.display = "flex";
        accountCorner.style.display = "none";
        tutorControl.style.display = "none";
    }
    account.getSchedule(actualDay, actualMonth, actualYear, updateEventDisplay);
    setInterval(() => {account.getSchedule(actualDay, actualMonth, actualYear, updateEventDisplay);}, 5000);
}

function submitAddSlot() {
    let start = (document.querySelector("#startTime") as HTMLSelectElement).value.split(":");
    let end = (document.querySelector("#endTime") as HTMLSelectElement).value.split(":");
    if(((60 * +start[0]) + +start[1]) >= 818 && ((60 * +end[0]) + +end[1]) <= 853 && ((60 * +end[0]) + +end[1]) - ((60 * +start[0]) + +start[1]) >= 10) {
        account.addTutorSlot(profile.id, +start[0], +start[1], +end[0], +end[1], actualDay, actualMonth, actualYear, updateEventDisplay);
    }
}

function submitClear() {
    let toDel: number[] = [];
    for(let i = 0; i < currentSchedule.slots.length; i++) {
        if(currentSchedule.slots[i].tutorId == profile.id) {
            toDel.push(currentSchedule.slots[i].slotId);
        }
    }
    account.deleteSlots(toDel, actualDay, actualMonth, actualYear, updateEventDisplay);
}

function main(): void {
    account.requestProfile((profile: Profile) => {
        updateProfileUI(profile);
    });
}

main();