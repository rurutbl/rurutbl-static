document.elementsLoaded = { "track": false, "pb": false }
var lastRegLesson = null

//! Config
let _spoofDay// = "1/5/2024 22:40:40"
let semstart = "Disabled"// new Date('2024-1-3');

//! Static refrences
const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"]
const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

//! Classes
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

//! Functions
function toggleDebugShow() {
    const debug = document.querySelector("#devinfo > div")
    debug.style.display = debug.style.display == "none" ? "flex" : "none"
}
function updateDebug(curDate, curLessont24, lessonJson, semstart, weekNumber){
    const debugJson = {
        "Date": curDate,
        "Stated Day": dayName[curDate.getDay()],
        "Actual Day (from Sun)": curDate.getDay(),
        "Subj": lessonJson[curLessont24.toString()] || `Cant detect, Date24: ${curLessont24.toString()}`,
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
}
function returnDate() { return _spoofDay ? new Date(_spoofDay) : new Date() }
function getCurrentLsn(timeList, curTime) {
    let curLessont24 = -Infinity;
    timeList.forEach(lsnStartTime => {
        const intTime = new Date24(lsnStartTime).toInt()
        const _beforeNow = curTime < intTime
        const _lastSavedisLess = curLessont24 < intTime
        const _default = curLessont24 == -Infinity
        if (_beforeNow && _lastSavedisLess && _default) curLessont24 = new Date24(intTime)
    })
    return curLessont24
}
function clearSkel(elementName){
    document.getElementById(elementName+"-skel").remove();
    document.getElementById(elementName).style.display = "block"
    document.elementsLoaded[elementName] = true
}