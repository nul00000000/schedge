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
    reserveTutorSlot: function (slotId, callback, errorCallback) {
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
            slotId: slotId
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
    },
    updateProfile: function (profile, callback, errorCallback) {
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
            type: "updateprofile",
            profile: profile
        });
        xhr.send(data);
    }
};
var loginCorner;
var accountCorner;
var profile;
function onLoad() {
    loginCorner = document.querySelector("#loginCorner");
    accountCorner = document.querySelector("#accountCorner");
    main();
}
function updateProfile() {
    account.updateProfile({
        id: profile.id,
        firstName: document.querySelector("#first").value,
        lastName: document.querySelector("#last").value,
        tutorInfo: { bio: document.querySelector("#bio").value },
        tutorType: profile.tutorType
    }, function (acc) {
        var updateConfirmation = document.querySelector("#updateConfirmation");
        updateConfirmation.style.display = "block";
        updateConfirmation.style.animation = "confirmFade 1s 1s forwards";
        updateConfirmation.onanimationend = function () {
            updateConfirmation.style.display = "none";
            updateConfirmation.style.animation = "";
        };
        profile = acc;
        updateProfileUI(acc);
    });
}
function updateProfileUI(acc) {
    console.log(acc);
    if (acc != null) {
        loginCorner.style.display = "none";
        accountCorner.style.display = "flex";
        document.querySelector("#accountName").textContent = "Hi, " + acc.firstName + " " + acc.lastName;
        document.querySelector("#first").value = acc.firstName;
        document.querySelector("#last").value = acc.lastName;
        if (acc.tutorInfo.bio && acc.tutorInfo.bio.length > 0) {
            document.querySelector("#bio").value = acc.tutorInfo.bio;
        }
    }
    else {
        console.log("how did you even get here");
    }
}
function main() {
    account.requestProfile(function (acc) {
        if (!acc || acc.id == 0) {
            location.href = "/login/";
        }
        updateProfileUI(acc);
        profile = acc;
    });
}
