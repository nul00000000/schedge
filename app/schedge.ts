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

    getRelevantSchedule(month: number, year: number, callback: (schedule: Schedule) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText) as Schedule);
            }
        }
        let data = JSON.stringify({
            type: "getrelevantschedule",
            startTime: new Date(year, month, 1).getTime(),
            endTime: new Date(year, month + 1, 1).getTime()
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

type MonthPair = {
    month: number,
    year: number
}

let currentMonth = 0;
let currentYear = 0;

let actualYear = 0;
let actualMonth = 0;
let actualDay = 0;

let profile: Profile;

let scheduleDict: {[month: string] : Schedule} = {};

async function getMonthSchedule(month: string): Promise<Schedule> {
    let m = +month.slice(0,month.indexOf(","));
    let y = +month.slice(month.indexOf(",") + 1);
    let prom: Promise<Schedule>;
    if(scheduleDict[month]) {
        prom = Promise.resolve(scheduleDict[month]);
    } else {
        prom = new Promise<Schedule>((resolve, reject) => {
            account.getRelevantSchedule(m, y, (sch: Schedule) => {resolve(sch); scheduleDict[month] = sch;});
        });
    }
    let fakeMonth = m - 1;
    let fakeYear = y;
    if(fakeMonth < 0) {
        fakeYear--;
        fakeMonth += 12;
    }
    if(fakeMonth >= 12) {
        fakeYear++;
        fakeMonth -= 12;
    }
    if(!scheduleDict[fakeMonth + "," + fakeYear]) {
        account.getRelevantSchedule(fakeMonth, fakeYear, (sch: Schedule) => {scheduleDict[fakeMonth + "," + fakeYear] = sch;});
    }
    let fakeMonth2 = m + 1;
    let fakeYear2 = y;
    if(fakeMonth2 < 0) {
        fakeYear2--;
        fakeMonth2 += 12;
    }
    if(fakeMonth2 >= 12) {
        fakeYear2++;
        fakeMonth2 -= 12;
    }
    if(!scheduleDict[fakeMonth2 + "," + fakeYear2]) {
        account.getRelevantSchedule(fakeMonth2, fakeYear2, (sch: Schedule) => {scheduleDict[fakeMonth2 + "," + fakeYear2] = sch;});
    }
    return prom;
}

function updateCalender() {
    let label = document.getElementById("monthLabel") as HTMLParagraphElement;
    const date = new Date(currentYear, currentMonth, 1);
    console.log(date.toString() + " " + currentMonth);
    const month = date.toLocaleString('default', { month: 'long' });
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

let tutorDict: {[id: number] : Profile} = {}

async function getTutor(id: number): Promise<Profile> {
    if(tutorDict[id]) {
        return Promise.resolve(tutorDict[id]);
    } else {
        return new Promise<Profile>((resolve, reject) => {
            account.getTutorProfile(id, (prof: Profile) => {resolve(prof); tutorDict[prof.id] = prof;});
        });
    }
}

let currentSchedule: Schedule;

function generateEventNode(slotType: string, tutorName: string, tutorId: number, slotId: number): HTMLDivElement {
    let eventThing = document.createElement("div");
    eventThing.className = "event " + slotType;
    eventThing.textContent = tutorName;
    eventThing.onclick = () => {location.href = "/slot?slotId=" + slotId + "&tutorId=" + tutorId};
    return eventThing;
}

function updateEventDisplay(schedule: Schedule) {
    if(schedule && (!currentSchedule || currentSchedule.hashCode != schedule.hashCode)) {
        currentSchedule = schedule;
        let table = document.querySelector("#calender tbody") as HTMLTableElement;
        for(let i = 1; i < table.children.length; i++) {
            let row = table.children[i] as HTMLTableRowElement;
            for(let j = 0; j < row.children.length; j++) {
                let cell = row.children[j].children[1];
                cell.innerHTML = "";
            }
        }
        let firstDay = new Date(currentYear, currentMonth, 0).getDay();
        for(let i = 0; i < schedule.slots.length; i++) {
            if(schedule.slots[i].bookerId == profile.id || schedule.slots[i].tutorId == profile.id || schedule.slots[i].bookerId == 0) {
                let start = new Date(schedule.slots[i].startTime);
                let rowIndex = Math.floor((start.getDate() + firstDay) / 7);
                let columnIndex = (start.getDate() + firstDay) % 7;
                let row = table.children[rowIndex + 1];
                let cell = row.children[columnIndex].children[1];
                if(cell) {
                    let tutorProf = getTutor(schedule.slots[i].tutorId);
                    tutorProf.then((_profile) => {
                        cell.appendChild(generateEventNode(schedule.slots[i].tutorId == profile.id ? "amTutor" : "amTutee", _profile.firstName + " " + _profile.lastName.charAt(0), schedule.slots[i].tutorId, schedule.slots[i].slotId));
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

function onLoad(): void {
    let dt = new Date();
    currentMonth = dt.getMonth();
    currentYear = dt.getFullYear();
    actualYear = dt.getFullYear();
    actualMonth = dt.getMonth();
    actualDay = dt.getDate();
    console.log(dt.toString() + " " + currentMonth);
    updateCalender();
    main();
}

function changeMonth(amount): void {
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
    getMonthSchedule(currentMonth + "," + currentYear).then(updateEventDisplay);
}

function main(): void {
    account.requestProfile((_profile: Profile) => {
        profile = _profile;
        getMonthSchedule(currentMonth + "," + currentYear).then(updateEventDisplay);
    });
}