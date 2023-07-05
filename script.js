async function getsocals(){
    const links = await fetch('/elements/socals.json')
    const data = await links.json()

    const socalsele = document.getElementById("socals").children
    console.log(socalsele.length)
    for (let i = 0; i < socalsele.length; i++) {
        socalsele[i].onclick = function () { window.open(data[socalsele[i].alt.toLowerCase()]) }
        console.log(data[socalsele[i].alt.toLowerCase()])
    }
}
async function getlinks() {
    const links = await fetch('/elements/links.json')
    const data = await links.json()

    for (const title in data) {
        if (Object.hasOwnProperty.call(data, title)) {
            const {url, icon} = data[title];

            const linksele = document.getElementsByTagName("links")[0]

            const divElement = document.createElement('div');
            divElement.onclick = function () { window.open(url) }
    
            const imgElement = document.createElement('img');
            imgElement.src = icon
            imgElement.alt = 'favicon';

            const spanElement = document.createElement('span');
            spanElement.textContent = title

            divElement.appendChild(imgElement);
            divElement.appendChild(spanElement);
            linksele.appendChild(divElement)
        }
    }
}

async function getTime(){
    var currentDate = new Date();

    var utcOffset = 8;
    var utcPlus8Time = new Date(currentDate.getTime() + (utcOffset * 60 * 60 * 1000));

    var m = undefined
    var hours = utcPlus8Time.getUTCHours();
    var minutes = utcPlus8Time.getUTCMinutes();

    if (hours - 12 > 0){
        hours = hours - 12
        m = "PM"
    }else{
        hours = hours 
        m = "AM"
    }
    var timeString = hours.toString().padStart(2, '0') + ':' +
        minutes.toString().padStart(2, '0') + " " + m + "&nbsp;"

    document.getElementById("time").innerHTML = timeString

}
getlinks()
getsocals()
getTime()
setInterval(getTime, 30000)
