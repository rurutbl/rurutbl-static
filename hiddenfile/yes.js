function createTable() {
    const days = Object.keys(scheduleData);
    const times = [
        "730", "800", "820", "835", "855", "910", "930", "945", "1005", "1020", "1040", "1055", "1115", "1130", "1150", "1205", "1225", "1240", "1300", "1315", "1335", "1350", "1410", "1425", "1445", "1500", "1520", "1540", "1555", "1615", "1630", "1650", "1700"
    ];

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    const headerCellDay = document.createElement("th");
    headerCellDay.textContent = "Day/Time";
    headerRow.appendChild(headerCellDay);

    times.forEach(time => {
        const headerCellTime = document.createElement("th");
        headerCellTime.textContent = time.slice(0, 2) + ":" + time.slice(2);
        headerRow.appendChild(headerCellTime);
    });

    table.appendChild(headerRow);

    days.forEach(day => {
        const row = document.createElement("tr");
        const dayCell = document.createElement("td");
        dayCell.textContent = day;
        row.appendChild(dayCell);

        times.forEach(time => {
            const cell = document.createElement("td");
            const className = scheduleData[day][time];
            cell.textContent = className ? className : "";
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    const scheduleTableDiv = document.getElementById("scheduleTable");
    scheduleTableDiv.appendChild(table);
}

createTable();