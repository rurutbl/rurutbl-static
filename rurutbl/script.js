// var _spoofDay = "1/4/2024 8:20:00"
var _spoofDay

class Date24 {
    constructor(t24) {
        if (!t24) {
            const curDate = _spoofDay ? new Date(_spoofDay) : new Date()
            const hours = curDate.getHours()
            const minutes = curDate.getMinutes()
            this.hours = ("0" + hours).slice(-2)
            this.minutes = ("0" + minutes).slice(-2)
            this.t24 = this.hours + this.minutes
            return this
        }
        this.minutes = t24.toString().slice(-2).padStart(2, "0")
        this.hours = t24.toString().replace(this.minutes, "").padStart(2, "0")
        this.t24 = this.hours + this.minutes
    }
    toString() {
        return this.t24.toString()
    }
    toInt() {
        return parseInt(this.t24)
    }
    toTimeHourObject() {
        const curTimeLengh = this.t24.length == 3 ? 1 : 2
        const hours = parseInt(this.t24.substring(0, curTimeLengh), 10)
        const minutes = parseInt(this.t24.substring(curTimeLengh), 10)
        return { "hours": (this.t24 < 100) ? 0 : hours, "minutes": minutes }
    }
}
class circularTimer {
    constructor() {
        const prog = document.getElementById("pb")
        prog.innerHTML = ""
        this.progcirc = document.createElement("div")
        this.progcirc.classList.add("progress-bar")
        this.unnamedDiv = document.createElement("div")
        this.timenow = document.createElement("span")
        this.timenow.id = "timenow"
        this.unnamedDiv.appendChild(this.timenow)
        this.timetil = document.createElement("span")
        this.timetil.id = "timetil"
        this.unnamedDiv.appendChild(this.timetil)
        this.timetilval = document.createElement("span")
        this.timetilval.id = "timetilval"
        this.unnamedDiv.appendChild(this.timetilval)
        this.progcirc.appendChild(this.unnamedDiv)
        prog.appendChild(this.progcirc)
        return this
    }
    setTitle(titleStr) {
        this.timenow.innerHTML = titleStr
        return this
    }
    setSubtitle(subtitleStr) {
        this.timetil.innerHTML = subtitleStr
        return this
    }
    setRemainingVal(remainingStr) {
        this.timetilval.innerHTML = remainingStr
        return this
    }
}

(async () => {
    const curDate = (_spoofDay) ? (new Date(_spoofDay)) : (new Date())

    var tt = null
    var lastRegLesson = null
    //? Get Week

    /*
    ! "Odd week until sem 2"
    ! like bro just shut up
    ! Junyuan so fucking retarded
    const semstart = new Date('2024-1-3');
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const timeDifference = curDate.getTime() - semstart.getTime();
    const weekNumber = Math.ceil(timeDifference / millisecondsPerWeek);

    tt = await fetch(`/elements/${weekNumber % 2 == 0 ? "even" : "odd"}.json`)
    */

    tt = await fetch(`/elements/odd.json`)
    tt = await tt.json()

    //? Get Current Day
    const day = curDate.getDay()
    const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"]
    const lessonJson = tt[dayName[day]]
    const timeList = Object.keys(lessonJson).toSorted()

    //? Updates every seconds for:
    // - Circular Progress
    // - Countdown
    var once = false
    setInterval(() => {
        const Time24 = new Date24()

        const curDate = _spoofDay ? new Date(_spoofDay) : new Date()
        const curTime = Time24.toInt()

        //  Get Current Lesson
        let curLessont24 = -Infinity;
        timeList.forEach(lsnStartTime => {
            const intTime = new Date24(lsnStartTime).toInt()
            const _beforeNow = curTime < intTime
            const _lastSavedisLess = curLessont24 < intTime
            const _default = curLessont24 == -Infinity
            if (_beforeNow && _lastSavedisLess && _default) curLessont24 = new Date24(intTime)
        })

        // generateTrack / Reload Table
        if (curLessont24 !== lastRegLesson) generateTrack(lessonJson)
        if (!once) { document.getElementById("pbskel").remove(); document.getElementById("pb").style.display = "block"; once = true }

        // /*  */
        // document.getElementById("devinfo").innerHTML =
        //     `Dev </br>
        // Date: ${curDate} </br>
        // PredictedDay: ${dayName[curDate.getDay()]} (i: ${curDate.getDay()}) </br>
        // PredictedSubj: ${lessonJson[curLessont24.toString()] ? lessonJson[curLessont24.toString()] : "-"}`
        // /*  */

        lastRegLesson = curLessont24;
        if (curTime > parseInt(timeList[timeList.length - 1])) {
            let _tmrI = curDate.getDay() + 1
            let _tmrDay = dayName[_tmrI]
            const nextday = tt[_tmrDay] || tt[dayName[0]]
            const reportTime = timeList[0]

            const circp = new circularTimer()
            circp.setTitle(`Report on ${_tmrDay || dayName[0]} by ${reportTime}`)
                .setSubtitle(`First lesson is ${nextday[reportTime]}`)

            generateTrack(nextday)
            return
        }
        if (curLessont24 == -Infinity) {
            generateTrack({})
            const circp = new circularTimer()
            circp.setTitle(`idk wait until monday`)
            return
        }
        generateCirc(Time24, curLessont24)
    }, 1000)

    function generateCirc(curTime, curLessont24) {
        const circp = new circularTimer()
        //  Convert All 24 Hour formats to hrs and mins
        const { hours: curHours, minutes: curMins } = curTime.toTimeHourObject()
        const { hours: LessonHours, minutes: LessonMins } = curLessont24.toTimeHourObject()

        const curMinsTotal = curHours * 60 + curMins;
        const LessonMinsTotal = LessonHours * 60 + LessonMins;

        // Diffrence of both hrs and mins
        const totalMinutesLeft = LessonMinsTotal - curMinsTotal;
        const hoursLeft = Math.floor(totalMinutesLeft / 60);
        const minutesLeft = totalMinutesLeft % 60;
        const i = timeList.indexOf(curLessont24.toString())

        if (curTime < timeList[0]) {
            circp.setTitle(`Time until Start class (${lessonJson[timeList[0]]})`)
        } else {
            circp.setTitle(`${lessonJson[timeList[i - 1]]}`)
                .setSubtitle(`Time until <b>${lessonJson[curLessont24.toString()]}</b>`)
        }

        // Countdown
        const _hr = hoursLeft.toString().padStart(2, "0")// Hours
        const _min = Math.abs(minutesLeft).toString().padStart(2, "0") - 1
        const _sec = (60 - _spoofDay ? new Date(_spoofDay).getSeconds() : new Date().getSeconds()).toString().padStart(2, "0")
        circp.setRemainingVal(`${_hr}:${_min}:${_sec}`)

        const element = document.getElementById("track").children[i - 1]
        if (element) element.classList.add("active")

        //Circular Prorgess
        const remainingMinutes = (LessonMinsTotal * 60) - ((curMinsTotal * 60) + curDate.getSeconds())
        const prevSub = timeList[i - 1]
        const { hours: prevhours, minutes: prevminutes } = new Date24(prevSub)
        const prevtotalMinutes = (parseInt(prevhours) * 60) + parseInt(prevminutes);
        const totalSubjectDuration = (LessonMinsTotal * 60) - (prevtotalMinutes * 60)
        const remainingPercentage = ((totalSubjectDuration - remainingMinutes) / totalSubjectDuration) * 100;

        circp.progcirc.style.setProperty("--prog", remainingPercentage);
    }

    var once1 = false
    function generateTrack(lessonJson) {
        if (!once1) { document.getElementById("trackSkeliton").remove(); document.getElementById("track").style.display = "block"; once1 = true }
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

})()
