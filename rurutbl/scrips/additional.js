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
    }

    const debug = document.querySelector("#devinfo > div")
    debug.innerHTML = ""
    for (const key in debugJson) {
        const data = debugJson[key];
        const span = document.createElement("span")
        span.innerText = `${key}: ${data}`
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

(async () => {
    var weekListOdd = await fetch(`/rurutbl/elements/odd.json`)
    weekListOdd = await weekListOdd.json()

    const fulltbl = document.getElementById("fulltbl")

    const tr = document.createElement("tr")

    const th = document.createElement("th")
    th.innerText = ""
    tr.appendChild(th)

    for (const day in weekListOdd) {
        const dayList = weekListOdd[day];

        const th = document.createElement("th")
        th.innerText = day
        tr.appendChild(th)
    }
    fulltbl.appendChild(tr)

    const time = { h: 8, m: 0 }

    for (let i = 0; i < 22; i++) {
        const tr2 = document.createElement("tr")

        const th = document.createElement("th")
        th.innerText = `${time.h}:${time.m.toString().padStart(2, "0")}`
        tr2.appendChild(th)

        for (const day in weekListOdd) {
            const dayList = weekListOdd[day];

            const td = document.createElement("td")

            const h = (time.h < 10 ? "0" + time.h : time.h).toString()
            const m = ((time.m < 10 ? "0" + time.m : time.m)).toString()
            const t24 = h + m

            const exactStart = dayList[t24]
            if (exactStart) {
                td.innerText = exactStart
            } else {
                const timeList = Object.keys(dayList).toSorted()
                if (t24 >= timeList) {
                    const timeAfter = getCurrentLsn(timeList, t24)
                    if (timeAfter == null) { td.innerText = "-"; continue }
                    const timeI = timeList.indexOf(timeAfter.toString()) - 1
                    const time = timeList[timeI]
                    td.innerText = dayList[time]
                }
            }

            tr2.appendChild(td)
        }

        time.m += 20
        if (time.m >= 60) {
            time.h++
            time.m -= 60
        }

        fulltbl.appendChild(tr2)
    }
})()