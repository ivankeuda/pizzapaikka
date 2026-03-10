const pizzaHinnat = {
    "Pepperoni pizza":  12.50,
    "Kebab pizza":      14.00,
    "Mozzarella pizza": 13.50,
    "Kana pizza":       13.00,
    "Jauheliha pizza":  12.50,
    "Tuff pizza":       15.00,
};

const kokoKerroin = {
    "medium": 0.80,
    "large":  1.00,
    "normaali": 1.00,
};

const lisukehinta = {
    "kinkku": 1.00,
    "pepperoni": 1.00,
    "cheese": 0.50,
};

document.addEventListener("DOMContentLoaded", onkoRekisteroitunut);

function rekisteroidy(){
    const nimi = document.getElementById("nimi").value.trim();
    const salasana = document.getElementById("salasana").value;
    if (!nimi || !salasana) {
        alert("Nimi ja salasana eivät voi olla tyhjiä.");
        return;
    }
    localStorage.setItem("nimi", nimi);
    localStorage.setItem("salasana", salasana);
    localStorage.setItem("rekisteroitunut", "kylla");
    localStorage.setItem("kirjautunut", "ei");
    onkoRekisteroitunut();
}

function kirjaudu(){
    const nimi = document.getElementById("nimi2").value;
    const salasana = document.getElementById("salasana2").value;
    const tallennettuNimi = localStorage.getItem("nimi");
    const tallennettuSalasana = localStorage.getItem("salasana");

    if (nimi === tallennettuNimi && salasana === tallennettuSalasana) {
        localStorage.setItem("kirjautunut", "kylla");
        alert("Kirjautuminen onnistui " + tallennettuNimi + "!");
    } else {
        alert("Virheellinen nimi tai salasana.");
    }
    onkoRekisteroitunut();
}

function onkoRekisteroitunut(){
    const rekisteroitunut = localStorage.getItem("rekisteroitunut") === "kylla";
    const kirjautunut = localStorage.getItem("kirjautunut") === "kylla";

    document.getElementById("rekisterointi_lomake").style.display = rekisteroitunut ? "none" : "block";
    document.getElementById("kirjautumis_lomake").style.display = rekisteroitunut && !kirjautunut ? "block" : "none";
    document.getElementById("kirjauduulos_form").style.display = kirjautunut ? "block" : "none";
    document.getElementById("authcontain").style.display = kirjautunut ? "none" : "block";

    const kayttajaNimiElementti = document.getElementById('userName');
    if (kirjautunut) {
        kayttajaNimiElementti.textContent = localStorage.getItem("nimi") || '';
    } else {
        kayttajaNimiElementti.textContent = '';
    }
}

function kirjauduUlos(){
    localStorage.setItem("kirjautunut", "ei");
    onkoRekisteroitunut();
}

function paivitaOstoskori(ostoskori) {
    let teksti = "<h2>Ostoskori</h2>";
    let yhteensa = 0;

    ostoskori.forEach((pizza, i) => {
        let hinta = pizza.nimi ? (pizzaHinnat[pizza.nimi] || 0) : 10.00;

        if (pizza.pohja && pizza.pohja.includes("gluteeniton")) hinta += 2;
        hinta *= (kokoKerroin[pizza.koko] || 1.00);
        yhteensa += hinta;

        teksti += `<h3>${pizza.nimi ? pizza.nimi : "Oma Pizza"} ${i + 1} — ${hinta.toFixed(2)}€</h3><ul>`;
        teksti += `<li>Koko: ${pizza.koko}</li>`;
        teksti += `<li>Pohja: ${pizza.pohja}</li>`;
        teksti += `<li>Kastike: ${pizza.kastike}</li>`;
        if (pizza.kinkku)    teksti += "<li>Kinkku</li>";
        if (pizza.pepperoni) teksti += "<li>Pepperoni</li>";
        if (pizza.juusto)    teksti += "<li>Juusto</li>";
        teksti += "</ul>";
    });

    teksti += `<hr><strong>Yhteensä: ${yhteensa.toFixed(2)}€</strong>`;
    document.getElementById("ostoskori-sisalto").innerHTML = teksti;
}

function ostoskori() {
    const kirjautunut = localStorage.getItem("kirjautunut") === "kylla";
    const rekisteroitunut = localStorage.getItem("rekisteroitunut") === "kylla";

    if (!kirjautunut) {
        alert(!rekisteroitunut ? "Rekisteröidy ja kirjaudu jatkaaksesi" : "Kirjaudu sisään jatkaaksesi");
        return;
    }

    const kokoElementti = document.querySelector('input[name="KOKO"]:checked');
    const koko = kokoElementti ? kokoElementti.value : "ei valittu";

    const pohja = document.getElementById("POHJA").value;
    const kastike = document.getElementById("KASTIKE").value;
    const kinkku = document.getElementById("kinkku");
    const pepperoni = document.getElementById("pepperoni");
    const juusto = document.getElementById("cheese");

    const ostoskoriLista = JSON.parse(localStorage.getItem("ostoskori") || "[]");

    ostoskoriLista.push({
        koko: koko,
        pohja: pohja,
        kastike: kastike,
        kinkku: kinkku.checked,
        pepperoni: pepperoni.checked,
        juusto: juusto.checked
    });

    localStorage.setItem("ostoskori", JSON.stringify(ostoskoriLista));
    paivitaOstoskori(ostoskoriLista);
}

function tyhjenna() {
    localStorage.removeItem("ostoskori");
    location.reload();
}

function valmiskori() {
    const kirjautunut = localStorage.getItem("kirjautunut") === "kylla";
    const rekisteroitunut = localStorage.getItem("rekisteroitunut") === "kylla";

    if (!kirjautunut) {
        alert(!rekisteroitunut ? "Rekisteröidy ja kirjaudu jatkaaksesi" : "Kirjaudu sisään jatkaaksesi");
        return;
    }

    const valittuPizza = document.getElementById("valmiitpizzat").value;

    const pizzaReseptit = {
        "Pepperoni pizza":  { pohja: "normaali pizzapohja", kastike: "tomaattikastike",         kinkku: false, pepperoni: true,  juusto: true  },
        "Kebab pizza":      { pohja: "normaali pizzapohja", kastike: "Chilimajoneesi",           kinkku: false, pepperoni: false, juusto: true  },
        "Mozzarella pizza": { pohja: "normaali pizzapohja", kastike: "Secret valkoinen kastike", kinkku: false, pepperoni: false, juusto: true  },
        "Kana pizza":       { pohja: "normaali pizzapohja", kastike: "Cheesekastike",            kinkku: false, pepperoni: false, juusto: true  },
        "Jauheliha pizza":  { pohja: "normaali pizzapohja", kastike: "BBQ kastike",              kinkku: false, pepperoni: false, juusto: false },
        "Tuff pizza":       { pohja: "normaali pizzapohja", kastike: "TUFF kastike",             kinkku: true,  pepperoni: true,  juusto: true  },
    };

    const resepti = pizzaReseptit[valittuPizza];
    if (!resepti) return;

    const ostoskoriLista = JSON.parse(localStorage.getItem("ostoskori") || "[]");
    
    ostoskoriLista.push({
        nimi: valittuPizza,
        koko: "normaali",
        pohja: resepti.pohja,
        kastike: resepti.kastike,
        kinkku: resepti.kinkku,
        pepperoni: resepti.pepperoni,
        juusto: resepti.juusto
    });

    localStorage.setItem("ostoskori", JSON.stringify(ostoskoriLista));
    paivitaOstoskori(ostoskoriLista);
}

function tilausilmotus() {
    const etunimi = document.getElementById("etunimi").value.trim();
    const sukunimi = document.getElementById("sukunimi").value.trim();
    const puhelinnumero = document.getElementById("puhelinnumero").value.trim();
    const osoite = document.getElementById("osoite") ? document.getElementById("osoite").value.trim() : "";
    const postinumero = document.getElementById("postinumero").value.trim();
    const kaupunki = document.getElementById("kaupunki").value.trim();
    const kuljetustapa = document.getElementById("kuljetustausta").value;

    if (!etunimi || !sukunimi || !puhelinnumero || !postinumero || !kaupunki) {
        alert("Täytä kaikki pakolliset kentät ennen tilauksen lähettämistä.");
        return;
    }

    if (kuljetustapa === "kuljetus" && !osoite) {
        alert("Syötä katuosoite kuljetusta varten.");
        return;
    }

    const kirjautunut = localStorage.getItem("kirjautunut") === "kylla";
    const rekisteroitunut = localStorage.getItem("rekisteroitunut") === "kylla";

    if (!kirjautunut) {
        alert(!rekisteroitunut ? "Rekisteröidy ja kirjaudu jatkaaksesi" : "Kirjaudu sisään jatkaaksesi");
        return;
    }

    alert("Onneksi olkoon tilasit pizzan!");
    localStorage.removeItem("ostoskori");
    location.reload();
}

function piilotavalinta() {
    const kuljetustapa = document.getElementById("kuljetustausta").value;
    document.getElementById("osoiterivi").style.display = kuljetustapa === "kuljetus" ? "flex" : "none";
}

function toimitusaika() {
    const ostoskoriLista = JSON.parse(localStorage.getItem("ostoskori") || "[]");
    const nappi = document.getElementById("aika");

    if (ostoskoriLista.length === 0) {
        nappi.value = "Ostoskorisi on tyhjä!";
        return;
    }

    const minuutit = ostoskoriLista.length * 15;
    const tunnit = Math.floor(minuutit / 60);
    const jaljellaminuutit = minuutit % 60;

    let aika = "";
    if (tunnit > 0) aika += `${tunnit}t `;
    aika += `${jaljellaminuutit}min`;

    nappi.value = `Valmistusaika: ${aika}`;
}