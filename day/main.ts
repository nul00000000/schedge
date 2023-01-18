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
        e.style.backgroundColor = "#968254";
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
        e.style.backgroundColor = "#e2d2af";
        e.children[0].textContent = "" + (i + 1);
    }
    if(currentMonth == actualMonth && currentYear == actualYear) {
        let cell = document.getElementById("dayRow" + Math.floor((actualDay + firstDay - 1) / 7)) as HTMLTableRowElement;
        let e = cell.children[(actualDay + firstDay - 1) % 7] as HTMLTableCellElement;
        e.style.backgroundColor = "#f7edd9";
        // e.style.borderColor = "#00cc00";
        // e.style.borderWidth = "4px";
    }
}

function loadSchedule() {
    let table = document.querySelector("#daySheet tbody") as HTMLTableElement;
    for(let i = 0; i < 96; i++) {
        let nHour = Math.floor(i / 4);
        let hour = (nHour < 10 ? "0" : "") + nHour
        let nMin = (i % 4) * 15;
        let min = (nMin < 10 ? "0" : "") + nMin
        let row = (timetableRowTemplate.content.cloneNode(true) as DocumentFragment).children[0] as HTMLTableRowElement;
        (row.children[0] as HTMLTableCellElement).textContent = hour + ":" + min;
        (row.children[1] as HTMLTableCellElement).textContent = "";
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
    updateCalender();
    loadSchedule();
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
}