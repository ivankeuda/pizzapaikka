document.addEventListener("DOMContentLoaded", onkoRekisteroitunut);

function rekisteroidy(){
    const name = document.getElementById("nimi").value.trim();
    const pass = document.getElementById("salasana").value;
    if (!name || !pass) {
        alert("Nimi ja salasana eivät voi olla tyhjiä.");
        return;
    }
    localStorage.setItem("nimi", name);
    localStorage.setItem("salasana", pass);
    localStorage.setItem("rekisteroitunut", "kylla");
    localStorage.setItem("kirjautunut", "ei");
    onkoRekisteroitunut();
}

function kirjaudu(){
    const name = document.getElementById("nimi2").value;
    const pass = document.getElementById("salasana2").value;
    const storedName = localStorage.getItem("nimi");
    const storedPass = localStorage.getItem("salasana");

    if (name === storedName && pass === storedPass) {
        localStorage.setItem("kirjautunut", "kylla");
        alert("Kirjautuminen onnistui " + storedName + "!");
    } else {
        alert("Virheellinen nimi tai salasana.");
    }
    onkoRekisteroitunut();
}

function onkoRekisteroitunut(){
    const registered = localStorage.getItem("rekisteroitunut") === "kylla";
    const loggedIn = localStorage.getItem("kirjautunut") === "kylla";

    document.getElementById("rekisterointi_lomake").style.display = registered ? "none" : "block";
    document.getElementById("kirjautumis_lomake").style.display = registered && !loggedIn ? "block" : "none";
    document.getElementById("kirjauduulos_form").style.display = loggedIn ? "block" : "none";

    const userNameEl = document.getElementById('userName');
    if (loggedIn) {
        userNameEl.textContent = localStorage.getItem("nimi") || '';
    } else {
        userNameEl.textContent = '';
    }
}

function kirjauduUlos(){
    localStorage.setItem("kirjautunut", "ei");
    onkoRekisteroitunut();
}

function paivitaOstoskori(cart) {
    let html = "<h2>Ostoskori</h2>";
    cart.forEach((pizza, i) => {
        html += `<h3>${pizza.nimi ? pizza.nimi : "Oma Pizza"} ${i + 1}</h3><ul>`;
        html += `<li>Koko: ${pizza.koko}</li>`;
        html += `<li>Pohja: ${pizza.pohja}</li>`;
        html += `<li>Kastike: ${pizza.kastike}</li>`;
        if (pizza.kinkku)    html += "<li>Kinkku</li>";
        if (pizza.pepperoni) html += "<li>Pepperoni</li>";
        if (pizza.juusto)    html += "<li>Juusto</li>";
        html += "</ul>";
    });
    document.getElementById("ostoskori-sisalto").innerHTML = html;
}

function ostoskori() {
    const loggedIn = localStorage.getItem("kirjautunut") === "kylla";
    const registered = localStorage.getItem("rekisteroitunut") === "kylla";

    if (!loggedIn) {
        alert(!registered ? "Rekisteröidy ja kirjaudu jatkaaksesi" : "Kirjaudu sisään jatkaaksesi");
        return;
    }

    const sizeEl = document.querySelector('input[name="KOKO"]:checked');
    const size = sizeEl ? sizeEl.value : "ei valittu";

    const bottom = document.getElementById("POHJA").value;
    const sauce = document.getElementById("KASTIKE").value;
    const ham = document.getElementById("kinkku");
    const pepperoni = document.getElementById("pepperoni");
    const cheese = document.getElementById("cheese");

    const cart = JSON.parse(localStorage.getItem("ostoskori") || "[]");

    cart.push({
        koko: size,
        pohja: bottom,
        kastike: sauce,
        kinkku: ham.checked,
        pepperoni: pepperoni.checked,
        juusto: cheese.checked
    });

    localStorage.setItem("ostoskori", JSON.stringify(cart));
    paivitaOstoskori(cart);
}

function tyhjenna() {
    localStorage.removeItem("ostoskori");
    location.reload();
}

function valmiskori() {
    const loggedIn = localStorage.getItem("kirjautunut") === "kylla";
    const registered = localStorage.getItem("rekisteroitunut") === "kylla";

    if (!loggedIn) {
        alert(!registered ? "Rekisteröidy ja kirjaudu jatkaaksesi" : "Kirjaudu sisään jatkaaksesi");
        return;
    }

    const selected = document.getElementById("valmiitpizzat").value;

    const pizzaReseptit = {
        "Pepperoni pizza":  { pohja: "normaali pizzapohja", kastike: "tomaattikastike",         kinkku: false, pepperoni: true,  juusto: true  },
        "Kebab pizza":      { pohja: "normaali pizzapohja", kastike: "Chilimajoneesi",           kinkku: false, pepperoni: false, juusto: true  },
        "Mozzarella pizza": { pohja: "normaali pizzapohja", kastike: "Secret valkoinen kastike", kinkku: false, pepperoni: false, juusto: true  },
        "Kana pizza":       { pohja: "normaali pizzapohja", kastike: "Cheesekastike",            kinkku: false, pepperoni: false, juusto: true  },
        "Jauheliha pizza":  { pohja: "normaali pizzapohja", kastike: "BBQ kastike",              kinkku: false, pepperoni: false, juusto: false },
        "Tuff pizza":       { pohja: "normaali pizzapohja", kastike: "TUFF kastike",             kinkku: true,  pepperoni: true,  juusto: true  },
    };

    const resepti = pizzaReseptit[selected];
    if (!resepti) return;

    const cart = JSON.parse(localStorage.getItem("ostoskori") || "[]");

    cart.push({
        nimi: selected,
        koko: "normaali",
        pohja: resepti.pohja,
        kastike: resepti.kastike,
        kinkku: resepti.kinkku,
        pepperoni: resepti.pepperoni,
        juusto: resepti.juusto
    });

    localStorage.setItem("ostoskori", JSON.stringify(cart));
    paivitaOstoskori(cart);
}