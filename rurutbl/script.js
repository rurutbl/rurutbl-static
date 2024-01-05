// var _spoofDay = "9/25/2023 12:00:00"
var _spoofDay
var tt = null

gettt()

async function gettt() {
    var lastRegLesson = null
    var currentDate = _spoofDay ? new Date(_spoofDay) : new Date()
    var curTime = get24HourCode()
    
    // Get Week
    const semstart = new Date('2024-1-3');
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const timeDifference = currentDate.getTime() - semstart.getTime();
    const weekNumber = Math.ceil(timeDifference / millisecondsPerWeek);

    tt = await fetch(`https://raw.githubusercontent.com/LuluHuman/luluhuman.github.io/main/elements/${weekNumber % 2 == 0 ? "even" : "odd"}.json`)
    tt = await tt.json()

    // Get Current Day
    const day = currentDate.getDay()
    const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"]
    const lessonJson = tt[dayName[day]]

    console.log(tt[dayName[day]]);
    console.log(weekNumber);


    // Updates every seconds for:
    // - Circular Progress
    // - Countdown
    var once = false
    setInterval(() => {
        currentDate = _spoofDay ? new Date(_spoofDay) : new Date()
        curTime = get24HourCode()

        //  Get Current Lesson
        let curLessonInt = -Infinity;
        for (const strTime in lessonJson) {
            const intTime = parseInt(strTime);
            if (curTime < intTime && curLessonInt < intTime && curLessonInt == -Infinity) {
                curLessonInt = intTime;
            }
        }

        // Load / Reload Table
        if (curLessonInt !== lastRegLesson) load(lessonJson)
        if (!once) {
            document.getElementById("pbskel").remove()
            document.getElementById("pb").style.display = "block"
            once = true
        }
        document.getElementById("devinfo").innerHTML =
            `Dev </br>
        Date: ${currentDate} </br>
        PredictedDay: ${dayName[currentDate.getDay()]} (i: ${currentDate.getDay()}) </br>
        PredictedSubj: ${lessonJson[curLessonInt] ? lessonJson[curLessonInt] : "-"}`
        
        lastRegLesson = curLessonInt;
        if (curTime > parseInt(Object.keys(lessonJson)[Object.keys(lessonJson).length - 1])) {
            var nextday = tt[dayName[currentDate.getDay() + 1]]
            nextday = nextday ? nextday : tt[dayName[0]]
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
        var sec = 60 - _spoofDay ? new Date(_spoofDay).getSeconds() : new Date().getSeconds()
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

var once1 = false
function load(lessonJson) {
    if (!once1) {
        document.getElementById("trackSkeliton").remove()
        document.getElementById("track").style.display = "block"
        once1 = true
    }
    document.getElementById("track").innerHTML = ""
    
    const arr = Object.keys(lessonJson)
    arr.sort()
    arr.forEach(lsnStartTime => {
            const subject = lessonJson[lsnStartTime];

            lsnStartTime = String(lsnStartTime).length == 3 ? "0" + lsnStartTime : lsnStartTime
            const li = document.createElement("li")
            const subName = document.createElement("div")
            const subtime = document.createElement("div")

            subName.innerText = subject ? subject : "END"
            subtime.innerText = lsnStartTime
            switch (subject) {
                case "Break":
                case "Recess":
                case "Math, -SBB":
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
    })
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

function get24HourCode() {
    var currentDate = _spoofDay ? new Date(_spoofDay) : new Date()
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();

    // Format hours and minutes as two digits
    var formattedHours = ("0" + hours).slice(-2);
    var formattedMinutes = ("0" + minutes).slice(-2);

    // Concatenate hours and minutes
    var code = formattedHours + formattedMinutes;

    return parseInt(code);
}