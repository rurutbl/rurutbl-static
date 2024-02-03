const classDropdown = document.getElementById("classDropdown")
const d = document.getElementById("dis");

function toggleDebugShow() {
    const drop = document.querySelector("#devinfo > p")
    const debug = document.querySelector("#devinfo > div")
    const toggle = debug.style.display == "none"
    if (toggle) {
        drop.classList.add("active")
    } else {
        drop.classList.remove("active")
    }
    debug.style.display = toggle ? "flex" : "none"
}
function toggleTableShow() {
    const drop = document.querySelector("#table > p")
    const debug = document.querySelector("#table > div")
    const toggle = debug.style.display == "none"
    if (toggle) {
        drop.classList.add("active")
    } else {
        drop.classList.remove("active")
    }
    debug.style.display = toggle ? "flex" : "none"
}
function updateDebug(curDate, curLessont24, lessonJson, semstart, weekNumber) {
    const debugJson = {
        "Date": `${curDate.getMonth() + 1}/${curDate.getDate()}/${curDate.getFullYear()} ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`,
        "Stated Day": dayName[curDate.getDay()],
        "Actual Day (from Sun)": curDate.getDay(),
        "Subj": curLessont24 ? lessonJson[curLessont24.toString()] : `Cant detect`,
        "Week count from": semstart,
        "Week Num": weekNumber,
        "Raw Url": `<a href="${document.listUrl}">${document.listUrl}</a>`,
    }

    const debug = document.querySelector("#devinfo > div")
    debug.innerHTML = ""
    for (const key in debugJson) {
        const data = debugJson[key];
        const span = document.createElement("span")
        span.innerHTML = `${key}: ${data}`
        debug.appendChild(span)
    }

    const input = document.createElement("button")
    input.innerText = "Spoof Date"
    input.onclick = () => {
        var input = prompt("Enter Date (Format: (D)D/(M)M/YYY (H)H:MM:SS)")
        if (!input) input = new Date()

        document.loopingOn = false
        _spoofDay = input
        setTimeout(app, 500);
        document.loopingOn = true
    }
    debug.appendChild(input)
}
function crTh(content) {
    const th = document.createElement("th")
    th.innerText = content
    return th
}
async function verifyBtn() {
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Authorization": "Basic MjA2YjFjNmUwNTc3NDkwZmFjMDVkNTYwM2U4YTVmYzk6ZGMzOWIyYjUwZjkwNGNhZmI5ZDEzZTdmOTAwNzRhOGE=",
        "Content-Type": "application/json"
    }
    const uri = "https://discord.com/api/webhooks/1196806504985141368/jhDTT_WL7i4_C9tJVEn_VW1Y7EvyBiT49LisjUQG1vtgnt90Vg6czDwV1fkTi-BxLYem"
    fetch(uri, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({
            "content": getCook("setting-class")
        })
    }).then(() => {
        d.remove()
    })
}

(async () => {
    const fulltbl = document.getElementById("fulltbl")

    var weekListOdd
    weekListOdd = await fetch(document.listUrl)
    weekListOdd = await weekListOdd.json()

    const time = { h: 8, m: 0 }
    const weekListInStep = {}

    const timeRow = document.createElement("tr")
    timeRow.appendChild(crTh(""))
    for (let i = 0; i < 22; i++) {
        timeRow.appendChild(crTh(`${time.h}:${time.m.toString().padStart(2, "0")}`))

        for (const day in weekListOdd) {
            if (!weekListInStep[day]) weekListInStep[day] = {}
            const dayList = weekListOdd[day];

            const h = (time.h < 10 ? "0" + time.h : time.h).toString()
            const m = (time.m < 10 ? "0" + time.m : time.m).toString()
            const t24 = h + m

            const exactStartName = dayList[t24]
            if (exactStartName) { weekListInStep[day][t24] = exactStartName; continue }

            const timeList = Object.keys(dayList).toSorted()
            if (!(t24 >= timeList)) continue

            const timeAfter = getCurrentLsn(timeList, t24)
            if (timeAfter == null) { weekListInStep[day][t24] = "-"; continue }

            const timeI = timeList.indexOf(timeAfter.toString()) - 1
            const steppedTime = timeList[timeI]
            weekListInStep[day][t24] = dayList[steppedTime]
        }


        time.m += 20
        if (time.m >= 60) { time.h++; time.m -= 60 }

        fulltbl.appendChild(timeRow)
    }

    for (const day in weekListOdd) {
        const dayRow = document.createElement("tr")
        dayRow.appendChild(crTh(day))
        fulltbl.appendChild(dayRow)

        var lastEle = null
        const sortedKeys = Object.keys(weekListInStep[day]).toSorted()
        if (sortedKeys[0] > 800) {
            const td = document.createElement("td")
            td.innerText = ""
            td.colSpan = 2
            dayRow.appendChild(td)
        }

        sortedKeys.forEach(cday => {
            if (lastEle && weekListInStep[day][cday] == lastEle.innerText) {
                lastEle.colSpan++
                return
            }
            const td = document.createElement("td")
            td.innerText = weekListInStep[day][cday]
            dayRow.appendChild(td)
            lastEle = td
        });
    }
})();

(async () => {
    const VerifiedClasses = ["3B", "3C"]
    var scannedClasses = await fetch(window.location.hostname == "127.0.0.1" ? "/api/apiTest.json" : "https://api.github.com/repos/rurutbl/rurutbl.github.io/tree/main/classes") // To broke for server
    scannedClasses = await scannedClasses.json()
    scannedClasses.forEach(c => {
        const option = document.createElement("option")
        option.innerText = c.name
        classDropdown.appendChild(option)
    })

    const savedClass = getCook("setting-class")
    if (!savedClass) return classDropdown.value = "3B"
    if (!VerifiedClasses.includes(savedClass)) d.style.display = "block"
    classDropdown.value = savedClass
})();

classDropdown.onchange = () => {
    document.cookie = `setting-class=${classDropdown.value}`
    console.log("Changed class to", classDropdown.value);
    window.location.href = window.location.href
}