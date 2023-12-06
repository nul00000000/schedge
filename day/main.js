var LoginCode;
(function (LoginCode) {
    LoginCode[LoginCode["SUCCESS"] = 0] = "SUCCESS";
    LoginCode[LoginCode["USERNAME_TAKEN"] = 1] = "USERNAME_TAKEN";
    LoginCode[LoginCode["EMAIL_TAKEN"] = 2] = "EMAIL_TAKEN";
    LoginCode[LoginCode["PASSWORD_MISMATCH"] = 3] = "PASSWORD_MISMATCH";
})(LoginCode || (LoginCode = {}));
var Subject;
(function (Subject) {
    Subject[Subject["MATH"] = 0] = "MATH";
    Subject[Subject["SOCIAL"] = 1] = "SOCIAL";
    Subject[Subject["SCIENCE"] = 2] = "SCIENCE";
    Subject[Subject["ENGLISH"] = 3] = "ENGLISH";
    Subject[Subject["MISC"] = 4] = "MISC";
    Subject[Subject["NONE"] = 5] = "NONE";
})(Subject || (Subject = {}));
var account = {
    profileRequest: { type: "profile", params: [] },
    isFormValid: function (email, pass, pass2) {
        if (email.includes("@") && email.slice(email.indexOf("@")).includes(".")) {
            return { msg: "Email already in use", code: LoginCode.USERNAME_TAKEN };
        }
        else if (pass != pass2) {
            return { msg: "Passwords must match", code: LoginCode.PASSWORD_MISMATCH };
        }
        else {
            return { msg: "Form Valid", code: LoginCode.SUCCESS };
        }
    },
    requestProfile: function (callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        var data = JSON.stringify(account.profileRequest);
        xhr.send(data);
    },
    addTutorSlot: function (startHour, startMinute, endHour, endMinute, day, month, year, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        var data = JSON.stringify({
            type: "addtutorslot",
            params: [
                {
                    bookerId: 0,
                    startHour: startHour,
                    startMinute: startMinute,
                    endHour: endHour,
                    endMinute: endMinute,
                    day: day,
                    month: month,
                    year: year
                }
            ]
        });
        xhr.send(data);
    },
    getSchedule: function (tutorId, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        var data = JSON.stringify({
            type: "getschedule",
            params: [
                tutorId
            ]
        });
        xhr.send(data);
    },
    clearSchedule: function (callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        var data = JSON.stringify({
            type: "clearschedule",
            params: []
        });
        xhr.send(data);
    },
    getTutorProfile: function (tutorId, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        var data = JSON.stringify({
            type: "tutorinfo",
            params: [
                tutorId
            ]
        });
        xhr.send(data);
    },
    getAllTutors: function (callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        var data = JSON.stringify({
            type: "gettutors",
            params: []
        });
        xhr.send(data);
    }
};
var currentMonth = 0;
var currentYear = 0;
var actualYear = 0;
var actualMonth = 0;
var actualDay = 0;
var timetableRowTemplate;
function updateCalender() {
    var label = document.getElementById("monthLabel");
    var date = new Date(currentYear, currentMonth, 1);
    console.log(date.toString() + " " + currentMonth);
    var month = date.toLocaleString('default', { month: 'short' });
    label.textContent = month + " " + currentYear;
    for (var i = 0; i < 42; i++) {
        var cell = document.getElementById("dayRow" + Math.floor(i / 7));
        var e = cell.children[i % 7];
        e.className = "emptyCell";
        e.children[0].textContent = "";
        document.getElementById("dayRow5").style.display = "none";
    }
    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    var len = new Date(currentYear, currentMonth + 1, 0).getDate();
    if (len + firstDay > 35) {
        document.getElementById("dayRow5").style.display = "contents";
    }
    var _loop_1 = function (i) {
        var cell = document.getElementById("dayRow" + Math.floor((i + firstDay) / 7));
        var e = cell.children[(i + firstDay) % 7];
        e.className = "fullCell";
        e.onclick = function () { location.href = "/day/?day=" + (i + 1) + "&month=" + currentMonth + "&year=" + currentYear; };
        e.children[0].textContent = "" + (i + 1);
    };
    for (var i = 0; i < len; i++) {
        _loop_1(i);
    }
    if (currentMonth == actualMonth && currentYear == actualYear) {
        var cell = document.getElementById("dayRow" + Math.floor((actualDay + firstDay - 1) / 7));
        var e = cell.children[(actualDay + firstDay - 1) % 7];
        e.className = "currentCell";
    }
}
function generateEventNode(supject, tutor, startTime, minuteLength) {
    var eventThing = document.createElement("div");
    eventThing.className = "slot " + supject;
    eventThing.style.height = (minuteLength / 1.95) + "vh";
    var tutorName = document.createElement("div");
    tutorName.textContent = tutor;
    eventThing.appendChild(tutorName);
    eventThing.onclick = function () { location.href = "/slot"; };
    return eventThing;
}
function loadSchedule() {
    var table = document.querySelector("#daySheet tbody");
    for (var i = 0; i < 7; i++) {
        var nHour = (38 + i * 5) < 60 ? 12 : 13;
        var hour = (nHour < 10 ? "0" : "") + nHour;
        var nMin = (38 + i * 5) % 60;
        var min = (nMin < 10 ? "0" : "") + nMin;
        var row = timetableRowTemplate.content.cloneNode(true).children[0];
        row.children[0].textContent = hour + ":" + min;
        table.appendChild(row);
    }
}
function onLoad() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("day") && urlParams.has("month") && urlParams.has("year")) {
        currentMonth = +urlParams.get("month");
        currentYear = +urlParams.get("year");
        actualYear = currentYear;
        actualMonth = currentMonth;
        actualDay = +urlParams.get("day");
    }
    else {
        var dt = new Date();
        currentMonth = dt.getMonth();
        currentYear = dt.getFullYear();
        actualYear = dt.getFullYear();
        actualMonth = dt.getMonth();
        actualDay = dt.getDate();
    }
    timetableRowTemplate = document.querySelector("#timetableRow");
    updateCalender();
    loadSchedule();
}
function updateEventDisplay(profiles) {
    var table = document.querySelector("#daySheet tbody");
    for (var i = 1; i < table.children.length; i++) {
        var row = table.children[i];
        row.children[1].children[0].innerHTML = "";
    }
    for (var j = 0; j < profiles.length; j++) {
        var schedule = profiles[j].schedule;
        for (var i = 0; i < schedule.slots.length; i++) {
            var rowIndex = schedule.slots[i].startHour * 2 + (schedule.slots[i].startMinute < 30 ? 0 : 1) - 16;
            var row = table.children[rowIndex + 1];
            var eventThingCont = row.children[1].children[0];
            var subj = "noSubject";
            eventThingCont.appendChild(generateEventNode(subj, profiles[j].firstName + " " + profiles[j].lastName.charAt(0), 0, 5));
        }
    }
    test();
}
function changeMonth(amount) {
    currentMonth += amount;
    while (currentMonth < 0) {
        currentYear--;
        currentMonth += 12;
    }
    while (currentMonth >= 12) {
        currentYear++;
        currentMonth -= 12;
    }
    updateCalender();
}
var loginCorner = document.querySelector("#loginCorner");
var accountCorner = document.querySelector("#accountCorner");
var tutorControl = document.querySelector("#tutorControl");
function updateProfileUI(acc) {
    console.log(acc);
    if (acc != null) {
        loginCorner.style.display = "none";
        accountCorner.style.display = "flex";
        tutorControl.style.display = "block";
        document.querySelector("#accountName").textContent = "Hi, " + acc.firstName + " " + acc.lastName;
    }
    else {
        loginCorner.style.display = "flex";
        accountCorner.style.display = "none";
        tutorControl.style.display = "none";
    }
    account.getAllTutors(updateEventDisplay);
}
function submitAddSlot() {
    var start = document.querySelector("#startTime").value.split(":");
    var end = document.querySelector("#endTime").value.split(":");
    account.addTutorSlot(+start[0], +start[1], +end[0], +end[1], actualDay, actualMonth, actualYear, function () { account.getAllTutors(updateEventDisplay); });
}
function submitClear() {
    account.clearSchedule(function () { account.getAllTutors(updateEventDisplay); });
}
function main() {
    account.requestProfile(updateProfileUI);
}
function test() {
    var table = document.querySelector("#daySheet tbody");
    for (var i = 1; i < table.children.length; i++) {
        var row_1 = table.children[i];
        row_1.children[1].children[0].innerHTML = "";
    }
    var row = table.children[1];
    var eventThingCont = row.children[1].children[0];
    eventThingCont.appendChild(generateEventNode("noSubject", "Big Man Guy", 0, 10));
}
main();
