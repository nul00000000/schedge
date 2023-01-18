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
        e.style.backgroundColor = "#968254";
        e.children[0].textContent = "";
        document.getElementById("dayRow5").style.display = "none";
    }
    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    var len = new Date(currentYear, currentMonth + 1, 0).getDate();
    if (len + firstDay > 35) {
        document.getElementById("dayRow5").style.display = "contents";
    }
    for (var i = 0; i < len; i++) {
        var cell = document.getElementById("dayRow" + Math.floor((i + firstDay) / 7));
        var e = cell.children[(i + firstDay) % 7];
        e.style.backgroundColor = "#e2d2af";
        e.children[0].textContent = "" + (i + 1);
    }
    if (currentMonth == actualMonth && currentYear == actualYear) {
        var cell = document.getElementById("dayRow" + Math.floor((actualDay + firstDay - 1) / 7));
        var e = cell.children[(actualDay + firstDay - 1) % 7];
        e.style.backgroundColor = "#f7edd9";
    }
}
function loadSchedule() {
    var table = document.querySelector("#daySheet tbody");
    for (var i = 0; i < 96; i++) {
        var nHour = Math.floor(i / 4);
        var hour = (nHour < 10 ? "0" : "") + nHour;
        var nMin = (i % 4) * 15;
        var min = (nMin < 10 ? "0" : "") + nMin;
        var row = timetableRowTemplate.content.cloneNode(true).children[0];
        row.children[0].textContent = hour + ":" + min;
        row.children[1].textContent = "";
        table.appendChild(row);
    }
}
function onLoad() {
    var dt = new Date();
    currentMonth = dt.getMonth();
    currentYear = dt.getFullYear();
    actualYear = dt.getFullYear();
    actualMonth = dt.getMonth();
    actualDay = dt.getDate();
    console.log(dt.toString() + " " + currentMonth);
    timetableRowTemplate = document.querySelector("#timetableRow");
    updateCalender();
    loadSchedule();
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
