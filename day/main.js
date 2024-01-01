var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    profileRequest: { type: "profile" },
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
    addTutorSlot: function (tutorId, startHour, startMinute, endHour, endMinute, day, month, year, callback) {
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
            slot: {
                tutorId: tutorId,
                bookerId: 0,
                startTime: new Date(year, month, day, startHour, startMinute).getTime(),
                endTime: new Date(year, month, day, endHour, endMinute).getTime()
            },
            startTime: new Date(year, month, day).getTime()
        });
        xhr.send(data);
    },
    getSchedule: function (day, month, year, callback) {
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
            startTime: new Date(year, month, day).getTime()
        });
        xhr.send(data);
    },
    deleteSlots: function (ids, day, month, year, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        var data = JSON.stringify({
            type: "deleteslots",
            ids: ids,
            startTime: new Date(year, month, day).getTime()
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
            tutorId: tutorId
        });
        xhr.send(data);
    }
};
var currentMonth = 0;
var currentYear = 0;
var actualYear = 0;
var actualMonth = 0;
var actualDay = 0;
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
var tutorDict = {};
var timetableRowTemplate;
function getTutor(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (tutorDict[id]) {
                return [2, Promise.resolve(tutorDict[id])];
            }
            else {
                return [2, new Promise(function (resolve, reject) {
                        account.getTutorProfile(id, function (prof) { resolve(prof); tutorDict[prof.id] = prof; });
                    })];
            }
            return [2];
        });
    });
}
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
function generateEventNode(supject, tutor, minuteLength) {
    var eventThing = document.createElement("div");
    eventThing.className = "slot " + supject;
    eventThing.style.height = (minuteLength / 1.92) + "vh";
    var tutorName = document.createElement("div");
    tutorName.textContent = tutor;
    eventThing.appendChild(tutorName);
    eventThing.onclick = function () { location.href = "/slot"; };
    return eventThing;
}
function loadSchedule() {
    var table = document.querySelector("#daySheet tbody");
    for (var i = 0; i < 7; i++) {
        var nHour = (38 + i * 5) < 60 ? 13 : 14;
        var nMin = (38 + i * 5) % 60;
        var row = timetableRowTemplate.content.cloneNode(true).children[0];
        row.children[0].textContent = new Date(0, 0, 0, nHour, nMin).toLocaleTimeString().replace(":00", "");
        row.children[1].children[0].style.transform = "translateX(" + (i * 0.5) + "%)";
        table.appendChild(row);
    }
}
function onLoad() {
    timetableRowTemplate = document.querySelector("#timetableRow");
    updateCalender();
    loadSchedule();
}
var currentSchedule;
function updateEventDisplay(schedule) {
    if (schedule && (!currentSchedule || currentSchedule.hashCode != schedule.hashCode)) {
        currentSchedule = schedule;
        var table = document.querySelector("#daySheet tbody");
        for (var i = 1; i < table.children.length; i++) {
            var row = table.children[i];
            row.children[1].children[0].innerHTML = "";
        }
        var _loop_2 = function (i) {
            var start = new Date(schedule.slots[i].startTime);
            var rowIndex = start.getHours() * 12 + Math.floor(start.getMinutes() / 5) - 163;
            var row = table.children[rowIndex + 1];
            if (row) {
                var eventThingCont_1 = row.children[1].children[0];
                var subj_1 = "noSubject";
                var length_1 = (schedule.slots[i].endTime - schedule.slots[i].startTime) / 60000;
                var tutorProf = getTutor(schedule.slots[i].tutorId);
                tutorProf.then(function (profile) {
                    eventThingCont_1.appendChild(generateEventNode(subj_1, profile.firstName + " " + profile.lastName.charAt(0), length_1));
                }, function () {
                    console.log("Failed to get tutor profile");
                });
            }
            else {
                console.log("Invalid time: " + start.toLocaleTimeString() + " " + rowIndex);
            }
        };
        for (var i = 0; i < schedule.slots.length; i++) {
            _loop_2(i);
        }
    }
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
var profile;
function updateProfileUI(acc) {
    profile = acc;
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
    account.getSchedule(actualDay, actualMonth, actualYear, updateEventDisplay);
    setInterval(function () { account.getSchedule(actualDay, actualMonth, actualYear, updateEventDisplay); }, 5000);
}
function submitAddSlot() {
    var start = document.querySelector("#startTime").value.split(":");
    var end = document.querySelector("#endTime").value.split(":");
    account.addTutorSlot(profile.id, +start[0], +start[1], +end[0], +end[1], actualDay, actualMonth, actualYear, updateEventDisplay);
}
function submitClear() {
    var toDel = [];
    for (var i = 0; i < currentSchedule.slots.length; i++) {
        if (currentSchedule.slots[i].tutorId == profile.id) {
            toDel.push(currentSchedule.slots[i].slotId);
        }
    }
    account.deleteSlots(toDel, actualDay, actualMonth, actualYear, updateEventDisplay);
}
function main() {
    account.requestProfile(function (profile) {
        updateProfileUI(profile);
    });
}
main();
