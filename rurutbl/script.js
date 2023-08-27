var _spoofTime = null
var tt = null

function get24HourCode(_spoofTime) {
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();

    // Format hours and minutes as two digits
    var formattedHours = ("0" + hours).slice(-2);
    var formattedMinutes = ("0" + minutes).slice(-2);

    // Concatenate hours and minutes
    var code = formattedHours + formattedMinutes;

    return _spoofTime ? _spoofTime : parseInt(code);
}

function convert24Hour(t24) {
    const curTimeLengh = String(t24).length == 3 ? 1 : 2
    const hours = parseInt(String(t24).substring(0, curTimeLengh), 10)
    const minutes = parseInt(String(t24).substring(curTimeLengh), 10)

    if (t24 < 100) {
        return { "hours": 0, "minutes": hours }
    }
    return { "hours": hours, "minutes": minutes }
}

function load(lessonJson) {
    document.getElementById("track").innerHTML = ""
    for (var lsnStartTime in lessonJson) {
        const subject = lessonJson[lsnStartTime];

        lsnStartTime = String(lsnStartTime).length == 3 ? "0" + lsnStartTime : lsnStartTime
        const li = document.createElement("li")
        const subName = document.createElement("div")
        const subtime = document.createElement("div")

        subName.innerText = subject ? subject : "END"
        subtime.innerText = lsnStartTime
        switch (subject) {
            case "Math, -SBB":
                subName.style.color = "grey"
                subtime.style.color = "grey"
                break;

            case "Recess":
                subName.style.color = "grey"
                subtime.style.color = "grey"
                break;

            case "Break":
                subName.style.color = "grey"
                subtime.style.color = "grey"
                break;

            case null:
                subName.style.color = "green"
                subtime.style.color = "green"
                break;

            
            default:
                break;
        }

        li.appendChild(subName)
        li.appendChild(subtime)
        document.getElementById("track").appendChild(li)
    }
}

async function gettt() {
    var lastRegLesson = null
    var currentDate = new Date()
    var curTime = get24HourCode(_spoofTime)

    // Get Week
    const semstart = new Date('2023-06-25');
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const timeDifference = currentDate.getTime() - semstart.getTime();
    const weekNumber = Math.ceil(timeDifference / millisecondsPerWeek);

    // Get Week Timetable
    if (weekNumber % 2 == 0) {
        tt = await fetch("https://raw.githubusercontent.com/LuluHuman/luluhuman.github.io/main/elements/even.json")
        tt = await tt.json()
    } else {
        tt = await fetch("https://raw.githubusercontent.com/LuluHuman/luluhuman.github.io/main/elements/odd.json")
        tt = await tt.json()
    }

    // Get Current Day
    const day = currentDate.getDay()
    const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"]
    const lessonJson = tt[dayName[day]]

    console.log(tt[dayName[day]]);
    console.log(weekNumber);
    

    // Updates every seconds for:
    // - Circular Progress
    // - Countdown
    setInterval(() => {
        currentDate = new Date();
        curTime = get24HourCode(_spoofTime)

        //  Get Current Lesson
        let curLessonInt = -Infinity;
        for (const strTime in lessonJson) {
            const intTime = parseInt(strTime);
            if (curTime < intTime && curLessonInt < intTime && curLessonInt == -Infinity) {
                curLessonInt = intTime;
            }
        }

        // Load / Reload Table
        if (curLessonInt !== lastRegLesson) {
            load(lessonJson)
        }
        lastRegLesson = curLessonInt;
        if (curTime > parseInt(Object.keys(lessonJson)[Object.keys(lessonJson).length - 1])) {
            const nextday = tt[dayName[currentDate.getDay() + 1]]
            const reportTime = Object.keys(nextday)[0]
            
            document.getElementById("timetil").innerText = `Report Tmr at ${reportTime}`
            document.getElementById("timetilval").innerText = `First lesson is ${nextday[reportTime]}`
            document.getElementById("timenow").innerText = ""
            load(nextday)
            return
        }
        if (curLessonInt == -Infinity) {
            load({})
            document.getElementById("timetil").innerText = `idk wait until monday`
            document.getElementById("timetilval").innerText = ``
            return
        }
        
        inHours(curTime, curLessonInt)
    }, 1000)

    function inHours(curTime, curLessonInt) {
        //  Convert All 24 Hour formats to hrs and mins
        const curTimeInfo = convert24Hour(curTime)
        const curHours = curTimeInfo.hours
        const curMins = curTimeInfo.minutes
        const curMinsTotal = curHours * 60 + curMins;

        const LessonInfo = convert24Hour(curLessonInt)
        const LessonHours = LessonInfo.hours
        const LessonMins = LessonInfo.minutes
        const LessonMinsTotal = LessonHours * 60 + LessonMins;

        // Diffrence of both hrs and mins
        const totalMinutesLeft = LessonMinsTotal - curMinsTotal;
        const hoursLeft = Math.floor(totalMinutesLeft / 60);
        const minutesLeft = totalMinutesLeft % 60;

        if (curTime < Object.keys(lessonJson)[0]) {
            document.getElementById("timetil").innerText = `Time until Start class (${lessonJson[Object.keys(lessonJson)[0]]})`
            document.getElementById("timenow").innerText = ""
        } else {
            document.getElementById("timetil").innerHTML = `Time until <b>${lessonJson[curLessonInt]}</b>`
            document.getElementById("timenow").innerText = `${lessonJson[Object.keys(lessonJson)[Object.keys(lessonJson).indexOf(String(curLessonInt)) - 1]]}`
        }

        // Countdown
        const hr = hoursLeft.toString().padStart(2, "0")// Hours
        var min = minutesLeft.toString().padStart(2, "0") - 1
        min = String(min).length == 1 ? "0" + min : min// Mins
        min = min == -1 ? "0" : min
        var sec = 60 - new Date().getSeconds()
        sec = String(sec).length == 1 ? "0" + sec : sec// Seconds

        document.getElementById("timetilval").innerText = `${hr}:${min}:${sec}`

        const i = Object.keys(lessonJson).indexOf(String(curLessonInt)) - 1
        const element = document.getElementById("track").children[i]

        if (element) element.classList.add("active")

        //Circular Prorgess
        const remainingMinutes = (LessonMinsTotal * 60) - (((curMinsTotal * 60)) + currentDate.getSeconds())

        const prevSub = Object.keys(lessonJson)[Object.keys(lessonJson).indexOf(String(curLessonInt)) - 1]
        const prevNumLength = String(prevSub).length == 3 ? 1 : 2
        const prevhours = parseInt(String(prevSub).substring(0, prevNumLength), 10);
        const prevminutes = parseInt(String(prevSub).substring(prevNumLength), 10);
        var prevtotalMinutes = prevhours * 60 + prevminutes;
        prevtotalMinutes = prevtotalMinutes ? prevtotalMinutes : 0

        const totalSubjectDuration = (LessonMinsTotal * 60) - (prevtotalMinutes * 60)
        const remainingPercentage = ((totalSubjectDuration - remainingMinutes) / totalSubjectDuration) * 100;

        document.querySelector("body > div > div").style.setProperty("--prog", remainingPercentage);
    }
}
gettt()