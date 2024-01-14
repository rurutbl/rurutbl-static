
async function reloadTiming(formFunc) {
    const info = document.getElementById("btime").children[1]
    info.innerHTML = ""

    var timing = null
    timing = await fetch(`https://uniformlimeplots.felicity1l1.repl.co/BusArrivalv2?way=${formFunc}`)
    timing = await timing.json()
    timing = timing[formFunc]
    const pill = document.getElementById("btime").children[0]
    const selele = pill.children[formFunc == "Go" ? 0 : 1]
    selele.classList.add("active-pill")
    const seleler = pill.children[formFunc == "Go" ? 0 : 1]
    seleler.classList.remove("active-pill")


    for (const BusStopCode in timing) {
        const timings = timing[BusStopCode];
        console.log(timings);

        const div = document.createElement("div")
        const div2 = document.createElement("div")
        const divTiming = document.createElement("div")

        divTiming.classList.add("bustiming")
        for (const bus in timings) {
            var busTiming = timings[bus]["NextBus"]
            var busTiming2 = timings[bus]["NextBus2"]
            var busTiming3 = timings[bus]["NextBus3"]

            function toTime(time) {
                const date = new Date(time["EstimatedArrival"])
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }

            function toMins(time) {
                const date = new Date(time["EstimatedArrival"])
                const ret = Math.floor((date.getTime() - new Date().getTime()) / 60000) + 1
                return ret < 2 ? "Arr" : ret
            }
            const busTime = toTime(busTiming); const busRemaining = toMins(busTiming)
            const bus2ndTime = toTime(busTiming2); const bus2ndRemaining = toMins(busTiming2)
            const bus3rdTime = toTime(busTiming3); const bus3rdRemaining = toMins(busTiming3)

            const divBus = document.createElement("div")
            const spanBus = document.createElement("span")
            const tableBus = document.createElement("table")

            var row1 = document.createElement('tr');
            var row2 = document.createElement('tr');
            spanBus.innerText = bus

            var cell1 = document.createElement('th');
            cell1.textContent = busRemaining;
            cell1.style.color = busTiming.Load == "LSD" ? "red" : busTiming.Load == "SDA" ? "yellow" : "white"
            var cell2 = document.createElement('th');
            cell2.textContent = bus2ndRemaining;
            cell2.style.color = busTiming.Load == "LSD" ? "red" : busTiming.Load == "SDA" ? "yellow" : "white"
            var cell3 = document.createElement('th');
            cell3.textContent = bus3rdRemaining;
            cell3.style.color = busTiming.Load == "LSD" ? "red" : busTiming.Load == "SDA" ? "yellow" : "white"
            row1.appendChild(cell1);
            row1.appendChild(cell2);
            row1.appendChild(cell3);


            var cell4 = document.createElement('td');
            cell4.innerHTML = busTime +
                (busTiming.VisitNumber == "2" ? "</br>2nd Visit" : "") +
                (busTiming.Type == "DD" ? "</br>Double" : "")
            var cell5 = document.createElement('td');
            cell5.innerHTML = bus2ndTime +
                (busTiming2.VisitNumber == "2" ? "</br>2nd Visit" : "") +
                (busTiming2.Type == "DD" ? "</br>Double" : "")
            var cell6 = document.createElement('td');
            cell6.innerHTML = bus3rdTime +
                (busTiming3.VisitNumber == "2" ? "</br>2nd Visit" : "") +
                (busTiming3.Type == "DD" ? "</br>Double" : "")
            row2.appendChild(cell4);
            row2.appendChild(cell5);
            row2.appendChild(cell6);

            // divBus.innerText = bus + " " + busRemaining + " " + bus2ndRemaining + " " + bus3rdRemaining

            divBus.appendChild(spanBus)
            tableBus.appendChild(row1);
            tableBus.appendChild(row2);
            divBus.appendChild(tableBus)
            divTiming.appendChild(divBus)
        }

        const span = document.createElement("span")
        span.innerText = BusStopCode


        span.onclick = () => {
            div.classList.toggle("show")
        }


        div2.appendChild(span)
        div.appendChild(div2)
        div.appendChild(divTiming)
        info.appendChild(div)
    }
}