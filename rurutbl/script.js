(async () => {
    const curDate = returnDate()
    var weekList = null

    //? Get Week
    // const _timeDifference = curDate.getTime() - semstart.getTime();
    const weekNumber = 1 //Math.ceil(_timeDifference / millisecondsPerWeek);
    weekList = await fetch(`./elements/${weekNumber % 2 == 0 ? "even" : "odd"}.json`)
    weekList = await weekList.json()

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

        if (curLessont24.toString() !== lastRegLesson) updateTrack(dayList)
        lastRegLesson = curLessont24.toString()

        updateDebug(curDate, curLessont24, dayList, semstart, weekNumber)

        let _lastInList = parseInt(timeList[timeList.length - 1])
        if (curTime > _lastInList) {
            let _nextI = curDate.getDay() + 1
            let _nextDayList = dayName[_nextI]
            const nextday = weekList[_nextDayList] || weekList[dayName[0]]
            const reportTime = Object.keys(nextday).toSorted()[0]

            const circp = new circularTimer()
            circp.setTitle(`Report on ${_nextDayList || dayName[0]} by ${reportTime}`)
                .setSubtitle(`First lesson is ${nextday[reportTime]}`)

            updateTrack(nextday)

            document.getElementById("pb-skel").remove();
            document.getElementById("pb").style.display = "block"
            document.elementsLoaded.pb = true
            return
        }
        if (curLessont24 == -Infinity) {
            updateTrack({})
            const circp = new circularTimer()
            circp.setTitle(`idk wait until monday`)
            document.getElementById("pb-skel").remove();
            document.getElementById("pb").style.display = "block"
            document.elementsLoaded.pb = true
            return
        }
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
            circp.setTitle(`${dayList[timeList[i - 1]]}`)
                .setSubtitle(`Time until <b>${dayList[curLessont24.toString()]}</b>`)
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

        if (document.elementsLoaded.pb == false) clearSkel("pb")
    }

    function updateTrack(dayList) {
        document.getElementById("track").innerHTML = ""
        timeList.forEach(lsnStartTime => {
            const subject = dayList[lsnStartTime];

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

        if (document.elementsLoaded.track == false) clearSkel("track")
    }
})()