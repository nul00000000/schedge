var currentMonth = 0;
var currentYear = 0;
function updateCalender() {
    for (var i = 0; i < 42; i++) {
        var cell = document.getElementById("dayRow" + Math.floor(i / 7));
        var e = cell.children[i % 7];
        e.style.backgroundColor = "#968254";
        e.textContent = "";
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
        e.textContent = "" + (i + 1);
    }
}
function onLoad() {
    var dt = new Date();
    currentMonth = dt.getMonth();
    currentYear = dt.getFullYear();
    updateCalender();
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
    var label = document.getElementById("monthLabel");
    label.textContent = currentYear + " " + currentMonth;
    updateCalender();
}
