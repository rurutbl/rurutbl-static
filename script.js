async function getlinks(){
    const links = await fetch('/elemetns/links.json')
    const data = await links.json()

    const socalsele = document.getElementById("socials").children
    const socals = Object.keys(data.socials)
    for (let i = 0; i < socals.length; i++) {
        socalsele[i].href = data[socalsele[i].alt.toLowerCase()]
    }
}

getlinks()