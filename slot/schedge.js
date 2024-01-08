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
    deleteSlots: function (ids, callback, day, month, year) {
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
            startTime: year == 0 ? new Date() : new Date(year, month, day).getTime()
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
    },
    getTutorSlot: function (slotId, callback, errorCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var obj = JSON.parse(xhr.responseText);
                if (!obj || "message" in obj) {
                    if (errorCallback) {
                        errorCallback(obj);
                    }
                }
                else {
                    callback(obj);
                }
            }
        };
        var data = JSON.stringify({
            type: "getslot",
            slotId: slotId
        });
        xhr.send(data);
    },
    reserveTutorSlot: function (slotId, room, teacher, clazz, note, callback, errorCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var obj = JSON.parse(xhr.responseText);
                if (!obj || "message" in obj) {
                    if (errorCallback) {
                        errorCallback(obj);
                    }
                }
                else {
                    callback(obj);
                }
            }
        };
        var data = JSON.stringify({
            type: "reserveslot",
            slotId: slotId,
            room: room,
            teacher: teacher,
            clazz: clazz,
            note: note
        });
        xhr.send(data);
    },
    unreserveTutorSlot: function (slotId, callback, errorCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/req/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var obj = JSON.parse(xhr.responseText);
                if (!obj || "message" in obj) {
                    if (errorCallback) {
                        errorCallback(obj);
                    }
                }
                else {
                    callback(obj);
                }
            }
        };
        var data = JSON.stringify({
            type: "unreserveslot",
            slotId: slotId
        });
        xhr.send(data);
    }
};
var loginCorner;
var accountCorner;
var loggedIn;
var loggedOut;
var openView;
var reservedView;
var selfReservedView;
var ownerView;
var profile;
var loaded = false;
var slot;
var tutor;
function updateSlotUI(slot) {
    if (slot) {
        var start = new Date(slot.startTime);
        var end = new Date(slot.endTime);
        document.querySelector("#times").textContent = start.toLocaleTimeString().replace(":00", "") + " - " + end.toLocaleTimeString().replace(":00", "");
        document.querySelector("#date").textContent = start.toLocaleString('en-US', { weekday: 'long' }) + " " + start.toLocaleDateString();
        if (profile) {
            if (slot.tutorId == profile.id) {
                openView.style.display = "none";
                reservedView.style.display = "none";
                selfReservedView.style.display = "none";
                ownerView.style.display = "block";
            }
            else if (slot.bookerId == 0) {
                openView.style.display = "block";
                reservedView.style.display = "none";
                selfReservedView.style.display = "none";
                ownerView.style.display = "none";
            }
            else if (slot.bookerId == profile.id) {
                openView.style.display = "none";
                reservedView.style.display = "none";
                selfReservedView.style.display = "block";
                ownerView.style.display = "none";
            }
            else {
                openView.style.display = "none";
                reservedView.style.display = "block";
                selfReservedView.style.display = "none";
                ownerView.style.display = "none";
            }
        }
    }
    else {
        document.querySelector("#defaultView").style.display = "none";
        document.querySelector("#errorView").style.display = "unset";
    }
}
function updateTutorUI() {
    document.querySelector("#tutorName").textContent = tutor.firstName + " " + tutor.lastName;
    var bio = document.querySelector("#tutorBio");
    bio.innerHTML = "";
    var lines = tutor.tutorInfo.bio.split("\n");
    for (var i = 0; i < lines.length; i++) {
        bio.append(lines[i]);
        bio.appendChild(document.createElement("br"));
    }
}
var urlParams = new URLSearchParams(window.location.search);
account.getTutorSlot(+urlParams.get("slotId"), function (_slot) {
    slot = _slot;
    if (loaded) {
        updateSlotUI(slot);
    }
}, function () { return updateSlotUI(null); });
account.getTutorProfile(+urlParams.get("tutorId"), function (_tutor) {
    tutor = _tutor;
    if (loaded) {
        updateTutorUI();
    }
});
function onLoad() {
    loaded = true;
    if (slot) {
        updateSlotUI(slot);
    }
    if (tutor) {
        updateTutorUI();
    }
    loginCorner = document.querySelector("#loginCorner");
    accountCorner = document.querySelector("#accountCorner");
    loggedIn = document.querySelector("#loggedIn");
    loggedOut = document.querySelector("#loggedOut");
    openView = document.querySelector("#openView");
    reservedView = document.querySelector("#reservedView");
    selfReservedView = document.querySelector("#selfReservedView");
    ownerView = document.querySelector("#ownerView");
    main();
}
function updateProfileUI(acc) {
    console.log(acc);
    if (acc != null) {
        loginCorner.style.display = "none";
        accountCorner.style.display = "flex";
        document.querySelector("#accountName").textContent = "Hi, " + acc.firstName + " " + acc.lastName;
        loggedIn.style.display = "block";
        loggedOut.style.display = "none";
    }
    else {
        loginCorner.style.display = "flex";
        accountCorner.style.display = "none";
        loggedIn.style.display = "none";
        loggedOut.style.display = "block";
    }
}
function backToDay() {
    var d = new Date(slot.startTime);
    location.href = "/day/?day=" + d.getDate() + "&month=" + d.getMonth() + " &year=" + d.getFullYear();
}
function deleteSlot() {
    account.deleteSlots([slot.slotId], backToDay);
}
function reserveSlot() {
    account.reserveTutorSlot(slot.slotId, document.querySelector("#first").value.trim(), document.querySelector("#teacher").value.trim(), document.querySelector("#last").value.trim(), document.querySelector("#bio").value.trim(), updateSlotUI);
}
function unreserveSlot() {
    account.unreserveTutorSlot(slot.slotId, updateSlotUI);
}
function updateReserveButtonDisabledness() {
    console.log(document.querySelector("#first").value.trim().length + " " + document.querySelector("#last").value.trim().length);
    document.querySelector("#reserveButton").disabled = !((document.querySelector("#first").value.trim().length > 2) &&
        (document.querySelector("#last").value.trim().length > 0) &&
        (document.querySelector("#teacher").value.indexOf("@") > -1));
}
function main() {
    account.requestProfile(function (acc) { updateProfileUI(acc); profile = acc; updateSlotUI(slot); });
}
