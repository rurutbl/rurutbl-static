app()
async function app() {
    const curDate = returnDate()

    //? Get Week
    var weekList
    weekList = await fetch(document.listUrl)
    weekList = await weekList.json()

    const getCommonRecess = await fetch(`/api/getCommonRecess${weekNumber % 2 == 0 ? "Even" : "Odd"}.json`)
    const getCommonBreak = await fetch(`/api/getCommonBreak${weekNumber % 2 == 0 ? "Even" : "Odd"}.json`)
    var getCommon = {}
    getCommon["Recess"] = await getCommonRecess.json()
    getCommon["Break"] = await getCommonBreak.json()

    //? Get Current Day
    const _dayI = curDate.getDay()
    const dayList = weekList[dayName[_dayI]]
    const timeList = Object.keys(dayList).toSorted()

    updatePage()
    function updatePage() {
        const Time24 = new Date24()
        const curDate = returnDate()
        const curTime = Time24.toInt()

        //  Get Current Lesson
        let curLessont24 = getCurrentLsn(timeList, curTime)

        if (window.location.pathname == "/") updateDebug(curDate, curLessont24, dayList, semstart, weekNumber)

        let _lastInList = parseInt(timeList[timeList.length - 1])
        if (curTime > _lastInList) {
            let _nextI = curDate.getDay() + 1
            let _nextDayList = dayName[_nextI]
            const nextday = weekList[_nextDayList] || weekList[dayName[0]]
            const reportTime = Object.keys(nextday).toSorted()[0]

            const circp = new circularTimer()
            circp.setTitle(`Report on ${shortDayName[_nextI] || shortDayName[0]} by ${reportTime}`)
                .setSubtitle(`First lesson is ${nextday[reportTime]}`)

            updateTrack(nextday, _nextDayList || dayName[0])
            return
        }
        if (curLessont24 == null) {
            const circp = new circularTimer()
            circp.setTitle(`idk wait until Mon`)

            updateTrack({})
            return
        }
        if (curLessont24.toString() !== lastRegLesson) updateTrack(dayList, dayName[_dayI])
        lastRegLesson = curLessont24.toString()

        if (_spoofDay) _spoofDay = new Date(_spoofDay).getTime() + 1000
        if (document.loopingOn == false) return

        updateCirc(Time24, curLessont24)
        setTimeout(updatePage, 1000)
    }

    function updateCirc(curTime, curLessont24) {
        const circp = new circularTimer()
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
            circp.setTitle(`Time until Start class (${dayList[timeList[0]]})`)
        } else {
            const title = dayList[timeList[i - 1]] == "{SciElec}" ? settings.Elec.Sci : dayList[timeList[i - 1]]
            const nextSub = dayList[timeList[i]] == null ? "Time left" : `Time until <b>${dayList[timeList[i]]}</b>`
            circp.setTitle(`${title}`)
                .setSubtitle(nextSub)
        }

        // Countdown
        const _hr = hoursLeft.toString().padStart(2, "0")
        const _min = (Math.abs(minutesLeft) - 1).toString().padStart(2, "0")
        const _sec = (60 - returnDate().getSeconds()).toString().padStart(2, "0")
        circp.setRemainingVal(`${_hr}:${_min.length == 1 ? "0" + _min : _min}:${_sec}`)

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

    function updateTrack(dayList, day) {
        document.getElementById("track").innerHTML = ""

        const timeList = Object.keys(dayList).toSorted()
        timeList.forEach(async lsnStartTime => {
            const subject = dayList[lsnStartTime];

            const d24 = new Date24(lsnStartTime).toTimeHourObject()

            const pref = d24.hours > 12
            const hours = pref ? d24.hours - 12 : d24.hours
            const minutes = d24.minutes == 0 ? "00" : d24.minutes


            const li = document.createElement("li")
            if (!subject) {
                li.classList.add("endLi")
                li.innerHTML = `<span>END - ${hours}:${minutes} ${pref ? "PM" : "AM"}</span>`
            } else {
                li.classList.add("subjLi")
                const subName = document.createElement("div")
                const subtime = document.createElement("div")

                subName.innerText = subject
                // subName.style.color = colorAssign[subject == null ? 0 : subject]
                subtime.innerText = `${hours}:${minutes} ${pref ? "PM" : "AM"}`

                li.appendChild(subName)
                li.appendChild(subtime)

                switch (subject) {
                    case "Recess":
                    case "Break":
                        {
                            const classes = getCommon[subject][day][lsnStartTime.toString()]
                            const rangeout = document.createElement("div")

                            subtime.style.opacity = 0.5
                            subName.style.opacity = 0.5
                            rangeout.classList.add("rangeout")

                            const rangein = document.createElement("div")
                            rangein.classList.add("rangein")
                            // rangein.style.width = (classes.length / 13) * 80 + "%"
                            rangein.style.backgroundColor = assignColor((classes.length / 13) * 100)
                            rangein.innerText = `${classes.length}` //(${classes.join(", ")})`

                            rangeout.append("Crowdedness")
                            rangeout.appendChild(rangein)
                            li.appendChild(rangeout)
                            break;
                        }

                    case "{SciElec}":
                        subName.innerText = settings.Elec.Sci || subject

                    default:
                        break;
                }
            }

            document.getElementById("track").appendChild(li)
        })
    }
}