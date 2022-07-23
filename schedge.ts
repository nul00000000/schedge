let currentMonth = 0;
let currentYear = 0;

function updateCalender() {
    for(let i = 0; i < 42; i++) {
        let cell = document.getElementById("dayRow" + Math.floor(i / 7)) as HTMLTableRowElement;
        let e = cell.children[i % 7] as HTMLTableCellElement;
        e.style.backgroundColor = "#968254"
        e.textContent = "";
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
        e.style.backgroundColor = "#e2d2af"
        e.textContent = "" + (i + 1);
    }
}

function onLoad(): void {
    let dt = new Date();
    currentMonth = dt.getMonth();
    currentYear = dt.getFullYear();
    updateCalender();
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
    let label = document.getElementById("monthLabel") as HTMLParagraphElement;
    label.textContent = currentYear + " " + currentMonth;
    updateCalender();
}