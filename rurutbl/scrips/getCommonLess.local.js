//! move back to /rurutbl to use

const fs = require("fs")
const path = require("path");
const output = {};
fs.readdir(path.join(__dirname, "classes"), (err, classesDir) => {
    classesDir.forEach(c => {
        const weekList = require(path.join(__dirname, "classes", c, "odd.json"))
        for (const day in weekList) {
            const dayList = weekList[day];
            for (const time in dayList) {
                const name = dayList[time];

                if (name !== "Recess") continue
                if (!output[day]) output[day] = {}
                if (!output[day][time]) output[day][time] = []

                var timep2 = parseInt(time) + 20
                timep2 = timep2 < 1000 ? ("0" + timep2) : timep2.toString()
                if (!output[day][timep2]) output[day][timep2] = []

                output[day][time].push(c)
                output[day][timep2].push(c)
            }
        }
    })
    fs.writeFileSync(path.join(__dirname, "getCommonRecess"), JSON.stringify(output, null, 4))
    var mode = 0
    for (const day in output) {
        const classList = output[day];
        for (const time in classList) {
            const classes = classList[time];

            if (classes.length > mode) {
                mode = classes.length
            }
        }
    }
    console.log(mode);
})