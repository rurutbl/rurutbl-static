(async () => {
    let response = await fetch("/wxsat2499/userinfo.json");
    let data = await response.json();

    const buttonplace = document.querySelector("#mem > div.charSelect")
    for (const membersn in data) {
        const buttonele = document.createElement("button")
        buttonele.innerHTML = membersn
        buttonplace.appendChild(buttonele)
    }

    const buttons = document.querySelector("#mem > div.charSelect").children
    loadUser(Object.keys(data)[0])
    buttons[0].classList.add("selected")
    for (const i in buttons) {
        const button = buttons[i];
        button.onclick = () => {
            for (const y in buttons) {
                const b = buttons[y];
                if (b.classList) b.classList.remove("selected")
            }
            button.classList.add("selected")

            loadUser(button.innerHTML)
        }
    }

    function loadUser(name) {
        const user = data[name]

        const title = document.querySelector("#info > .title")
        title.innerHTML = user.name
        const quote = document.querySelector("#info > p")
        quote.innerHTML = `<span class="bigq">"</span>${user.quote}<span class="bigq">"</span>`
        const smallInfo = document.querySelector("#info > ul")
        smallInfo.innerHTML = ""

        const sekaichar = document.createElement("li")
        sekaichar.innerHTML = `<span class="material-symbols-outlined">favorite</span>Sekai Charactar(s): <span style="color: ${user.sekai[0].color};">${user.sekai[0].name}</span>, <span style="color: ${user.sekai[1].color};">${user.sekai[1].name}</span>`
        const bday = document.createElement("li")
        bday.innerHTML = `<span class="material-symbols-outlined">cake</span>Birthday: ${user.birthday}`

        smallInfo.appendChild(sekaichar)
        smallInfo.appendChild(bday)


        const oinfo = document.querySelector("#mem > div.charSelectContainer > div:nth-child(1) > div:nth-child(2) > ul")
        oinfo.innerHTML = ""
        user.moreInfo.forEach(title => {
            const t = document.createElement("li")
            t.innerHTML = title
            oinfo.appendChild(t)
        });

        const imagec = document.querySelector("#mem > div.charSelectContainer > div:nth-child(2)")
        imagec.innerHTML = ""

        user.assets.forEach(photo => {
            const image = document.createElement("img")
            image.src = photo

            imagec.appendChild(image)
        });
    }
})()
