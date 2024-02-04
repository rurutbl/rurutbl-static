const [levelSelection, classSelection] = document.getElementById("ClassSelector").children;
const ClassSelectorLabel = document.getElementById("ClassSelectorLabel")

var settings = loadSettings();

(async () => {
    document.classes = await fetch("/api/classes.json")
    document.classes = await document.classes.json()

    ClassSelectorLabel.innerText = `Selected: ${settings.class.level || "_"}${settings.class.class || "_"}`


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
})()

var events = {}
events.onLevelbtnCick = (event) => {
    const levelButton = event.target
    const level = levelButton.innerText

    clearSelection("LevelButtonActive")
    classSelection.innerHTML = ""
    levelButton.classList.add("LevelButtonActive")

    loadClases(level)
    updateSettings("class", "level", level)
}
events.onClassbtnClick = (event) => {
    const classButton = event.target
    const className = classButton.innerText

    clearSelection("ClassButtonActive")
    classButton.classList.add("ClassButtonActive")

    updateSettings("class", "class", className)
}

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
    const classNames = document.classes[level];
    classNames.forEach(className => {

        const classButton = document.createElement("button")
        classButton.innerText = className
        classButton.onclick = events.onClassbtnClick
        if (className == settings.class.class) classButton.classList.add("ClassButtonActive")
        classSelection.appendChild(classButton)
    });
}

function updateSettings(type, key, value) {

    settings[type][key] = value
    ClassSelectorLabel.innerText = `Selected: ${settings.class.level || "_"}${settings.class.class || "_"}`

    localStorage.setItem('settings', JSON.stringify(settings))
}


function loadSettings() {
    const savedSettings = localStorage.getItem("settings")
    const parsedSettings = JSON.parse(savedSettings)
    if (parsedSettings) return parsedSettings;

    return {
        class: {
            level: "3",
            class: "B"
        }
    }
}