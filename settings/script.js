const settingsSegment = {}
settingsSegment.electives = document.getElementById("settingsSegment-electives")

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

class eventsClass {
    onLevelbtnCick(event) {
        const classSelection = document.getElementById("ClassSelector").children[1]
        const levelButton = event.target
        const level = levelButton.innerText

        clearSelection("LevelButtonActive")
        classSelection.innerHTML = ""
        levelButton.classList.add("LevelButtonActive")

        loadClases(level)
        dbStore.set("class", "level", level)
    }
    onClassbtnClick(event) {
        const classButton = event.target
        const className = classButton.innerText

        clearSelection("ClassButtonActive")
        classButton.classList.add("ClassButtonActive")

        dbStore.set("class", "class", className)
    }
    onElecbtnClick(event) {
        const ElecButton = event.target
        const ElecName = ElecButton.innerText

        clearSelection("LevelElecActive")
        ElecButton.classList.add("LevelElecActive")

        dbStore.set("Elec", "Sci", ElecName)
    }

}

const dbStore = new db()
const settings = dbStore.get()
const events = new eventsClass()

    ;
(async () => {
    // const exportElement = document.getElementById("export")
    // exportElement.innerText = btoa(JSON.stringify(settings))

    const ClassSelectorLabel = document.getElementById("ClassSelectorLabel")
    const levelSelection = document.getElementById("ClassSelector").children[0]

    ClassSelectorLabel.innerText = `Selected: ${settings.class.level || "_"}${settings.class.class || "_"}`

    document.classes = await fetch("/api/classes.json")
    document.classes = await document.classes.json()
    for (const level in document.classes) {
        const levelButton = document.createElement("button")
        levelButton.innerText = level
        levelButton.onclick = events.onLevelbtnCick

        if (level == settings.class.level) {
            levelButton.classList.add("LevelButtonActive")
            loadClases(level)
        }
        levelSelection.appendChild(levelButton)
    }

    const SciElec = ["Physics", "Biology"]
    SciElec.forEach(elective => {
        const ElecSelection = document.querySelector("#settingsSegment-electives > div > div > div ")
        const levelButton = document.createElement("button")
        levelButton.innerText = elective
        levelButton.onclick = events.onElecbtnClick

        if (elective == settings.Elec.Sci) levelButton.classList.add("LevelElecActive")
        ElecSelection.appendChild(levelButton)
    })
})()


function clearSelection(className) {
    const activeBtns = document.getElementsByClassName(className)
    if (activeBtns.length > 0) {
        for (const i in activeBtns) {
            const activeBtn = activeBtns[i];
            if (activeBtn.classList) activeBtn.classList.remove(className)
        }
    }
}

function loadClases(level) {
    const classSelection = document.getElementById("ClassSelector").children[1]
    settingsSegment.electives.style.display = parseInt(level) > 2 ? "flex" : "none"

    const classNames = document.classes[level];
    classNames.forEach(className => {
        const classButton = document.createElement("button")
        classButton.innerText = className
        classButton.onclick = events.onClassbtnClick
        if (className == settings.class.class) classButton.classList.add("ClassButtonActive")
        classSelection.appendChild(classButton)
    });
}
