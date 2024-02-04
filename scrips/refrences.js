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
class db {
    constructor() {
        this.settings = {
            class: {
                level: "3",
                class: "B"
            },
            Elec: {
                Sci: "Phy/Bio",
            }
        }
    }
    get() {
        const savedSettings = localStorage.getItem("settings")
        const parsedSettings = JSON.parse(savedSettings)
        if (parsedSettings) this.settings = parsedSettings

        return this.settings
    }
    set(type, key, value) {
        this.settings[type][key] = value
        ClassSelectorLabel.innerText = `Selected: ${this.settings.class.level || "_"}${this.settings.class.class || "_"}`

        localStorage.setItem('settings', JSON.stringify(this.settings))
    }
}

//! Functions
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
    return curLessont24 == -Infinity ? null : curLessont24
}

function getCook(cookiename) {
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}
function assignColor(percentage) {
    if (percentage <= 30) return "#0a0"
    if (percentage <= 60 && percentage >= 30) return "#FFC107"
    if (percentage >= 60) return "#F00"
}

//! Variables
document.loopingOn = true
var lastRegLesson = null

// const _timeDifference = curDate.getTime() - semstart.getTime();
const weekNumber = 1 //Math.ceil(_timeDifference / millisecondsPerWeek);
const dbStore = new db()
const settings = dbStore.get()
document.listUrl = `/classes/${settings.class.level}/${settings.class.class}/${weekNumber % 2 == 0 ? "even" : "odd"}.json`

//! Config
let _spoofDay
let semstart = "Disabled"// new Date('2024-1-3');

//! Static refrences
const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"]
const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
const colorAssign = { "Recess": "grey", "Break": "grey", 0: "green" }