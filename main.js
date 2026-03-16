const pizzaHinnat = {
    "Pepperoni pizza":  12.50,
    "Kebab pizza":      14.00,
    "Mozzarella pizza": 13.50,
    "Kana pizza":       13.00,
    "Jauheliha pizza":  12.50,
    "Tuff pizza":       15.00,
};

const kokoKerroin = {
    "medium":   0.80,
    "large":    1.00,
    "normaali": 1.00,
};

const lisukehinta = {
    "kinkku":    1.00,
    "pepperoni": 1.00,
    "cheese":    0.50,
    "kalanpyrstöt": 1.50,
};

document.addEventListener("DOMContentLoaded", () => {
    onkoRekisteroitunut();
    const ostoskoriLista = JSON.parse(localStorage.getItem("ostoskori") || "[]");
    if (ostoskoriLista.length > 0) paivitaOstoskori(ostoskoriLista);
});

function openForm() {
    document.getElementById('modalNakyma').classList.add('open');
}

function closeForm() {
    document.getElementById('modalNakyma').classList.remove('open');
}

function overlayClick(e) {
    if (e.target === document.getElementById('modalNakyma')) closeForm();
}

function switchTab(tab) {
    const isKirjaudu = tab === 'kirjaudu';
    const kirjautumisLomake = document.getElementById('kirjautumis_lomake');
    const rekisterointiLomake = document.getElementById('rekisterointi_lomake');
    const tabKirjaudu = document.getElementById('tab-kirjaudu');
    const tabRekisteroidy = document.getElementById('tab-rekisteroidy');

    if (kirjautumisLomake) kirjautumisLomake.classList.toggle('active', isKirjaudu);
    if (rekisterointiLomake) rekisterointiLomake.classList.toggle('active', !isKirjaudu);
    if (tabKirjaudu) tabKirjaudu.classList.toggle('active', isKirjaudu);
    if (tabRekisteroidy) tabRekisteroidy.classList.toggle('active', !isKirjaudu);
}

function rekisteroidy() {
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

    alert("Rekisteröityminen onnistui! Voit nyt kirjautua sisään.");
    switchTab('kirjaudu');
    onkoRekisteroitunut();
}

function kirjaudu() {
    const nimi = document.getElementById("nimi2").value;
    const salasana = document.getElementById("salasana2").value;
    const tallennettuNimi = localStorage.getItem("nimi");
    const tallennettuSalasana = localStorage.getItem("salasana");

    if (nimi === tallennettuNimi && salasana === tallennettuSalasana) {
        localStorage.setItem("kirjautunut", "kylla");
        alert("Kirjautuminen onnistui, " + tallennettuNimi + "!");
        closeForm();
    } else {
        alert("Virheellinen nimi tai salasana.");
    }

    onkoRekisteroitunut();
}

function onkoRekisteroitunut() {
    const rekisteroitunut = localStorage.getItem("rekisteroitunut") === "kylla";
    const kirjautunut     = localStorage.getItem("kirjautunut")     === "kylla";

    const openBtn = document.querySelector(".open-button");
    if (openBtn) openBtn.style.display = kirjautunut ? "none" : "inline-block";

    const ulosForm = document.getElementById("kirjauduulos_form");
    if (ulosForm) ulosForm.style.display = kirjautunut ? "block" : "none";

    const kayttajaNimi = document.getElementById("userName");
    if (kayttajaNimi) {
        kayttajaNimi.textContent = kirjautunut ? (localStorage.getItem("nimi") || "") : "";
    }

    if (rekisteroitunut) switchTab('kirjaudu');
}

function kirjauduUlos() {
    localStorage.setItem("kirjautunut", "ei");
    onkoRekisteroitunut();
}

// ostoskori

function paivitaOstoskori(ostoskori) {
    let teksti = "<h2>Ostoskori</h2>";
    let yhteensa = 0;

    ostoskori.forEach((tuote, i) => {
        if (tuote.lisatuote) {
            const hinta = tuote.hinta || 0;
            yhteensa += hinta;
            teksti += `<h3>${tuote.nimi} — ${hinta.toFixed(2)}€</h3>`;
        } else {
            let hinta = tuote.nimi ? (pizzaHinnat[tuote.nimi] || 0) : 10.00;

            if (tuote.pohja && tuote.pohja.includes("gluteeniton")) hinta += 2;
            if (tuote.koko === "large") hinta += 1.50;
            if (tuote.koko === "medium") hinta *= 1.00;
            yhteensa += hinta;

            teksti += `<h3>${tuote.nimi ? tuote.nimi : "Oma Pizza"} ${i + 1} — ${hinta.toFixed(2)}€</h3><ul>`;
            teksti += `<li>Koko: ${tuote.koko}</li>`;
            teksti += `<li>Pohja: ${tuote.pohja}</li>`;
            teksti += `<li>Kastike: ${tuote.kastike}</li>`;
            if (tuote.kinkku)    teksti += "<li>Kinkku</li>";
            if (tuote.pepperoni) teksti += "<li>Pepperoni</li>";
            if (tuote.juusto)    teksti += "<li>Juusto</li>";
            if (tuote.kala)      teksti += "<li>Kalanpyrstöt</li>";
            teksti += "</ul>";
        }
    });

    teksti += `<hr><strong>Yhteensä: ${yhteensa.toFixed(2)}€</strong>`;
    document.getElementById("ostoskori-sisalto").innerHTML = teksti;
}

function ostoskori() {
    const kirjautunut    = localStorage.getItem("kirjautunut")    === "kylla";
    const rekisteroitunut = localStorage.getItem("rekisteroitunut") === "kylla";

    if (!kirjautunut) {
        alert(!rekisteroitunut ? "Rekisteröidy ja kirjaudu jatkaaksesi" : "Kirjaudu sisään jatkaaksesi");
        return;
    }

    const kokoElementti = document.querySelector('input[name="KOKO"]:checked');
    const koko     = kokoElementti ? kokoElementti.value : "ei valittu";
    const pohja    = document.getElementById("POHJA").value;
    const kastike  = document.getElementById("KASTIKE").value;
    const kinkku   = document.getElementById("kinkku");
    const pepperoni = document.getElementById("pepperoni");
    const juusto   = document.getElementById("cheese");
    const kala   = document.getElementById("kalanpyrstöt");

    const ostoskoriLista = JSON.parse(localStorage.getItem("ostoskori") || "[]");

    ostoskoriLista.push({
        koko:      koko,
        pohja:     pohja,
        kastike:   kastike,
        kinkku:    kinkku.checked,
        pepperoni: pepperoni.checked,
        juusto:    juusto.checked,
        kala:       kala.checked,
    });

    localStorage.setItem("ostoskori", JSON.stringify(ostoskoriLista));
    paivitaOstoskori(ostoskoriLista);
}

function tyhjenna() {
    localStorage.removeItem("ostoskori");
    location.reload();
}

const pizzaReseptit = {
    "Pepperoni pizza":  { pohja: "normaali pizzapohja", kastike: "tomaattikastike",         kinkku: false, pepperoni: true,  juusto: true  },
    "Kebab pizza":      { pohja: "normaali pizzapohja", kastike: "Chilimajoneesi",           kinkku: false, pepperoni: false, juusto: true  },
    "Mozzarella pizza": { pohja: "normaali pizzapohja", kastike: "Secret valkoinen kastike", kinkku: false, pepperoni: false, juusto: true  },
    "Kana pizza":       { pohja: "normaali pizzapohja", kastike: "Cheesekastike",            kinkku: false, pepperoni: false, juusto: true  },
    "Jauheliha pizza":  { pohja: "normaali pizzapohja", kastike: "BBQ kastike",              kinkku: false, pepperoni: false, juusto: false },
    "Tuff pizza":       { pohja: "normaali pizzapohja", kastike: "TUFF kastike",             kinkku: true,  pepperoni: true,  juusto: true  },
};

function valmiskori(koko = "normaali") {
    if (localStorage.getItem("kirjautunut") !== "kylla") {
        alert("Kirjaudu sisään jatkaaksesi");
        return;
    }

    const valittuPizza = document.getElementById("valmiitpizzat").value;
    const suuri = document.getElementById("large2").checked;
    const normi = document.getElementById("medium2").checked;
    const gluteeniton = document.getElementById("glutpohja").checked;
    const resepti = pizzaReseptit[valittuPizza];
    if (!resepti) return;

    const valittuKoko = suuri ? "large" : normi ? "medium" : "normaali";

    const ostoskoriLista = JSON.parse(localStorage.getItem("ostoskori") || "[]");
    ostoskoriLista.push({
        nimi:  valittuPizza,
        koko:  valittuKoko,
        ...resepti,
        pohja: gluteeniton ? "gluteeniton pizzapohja +2€" : resepti.pohja,
    });

    localStorage.setItem("ostoskori", JSON.stringify(ostoskoriLista));
    paivitaOstoskori(ostoskoriLista);
}

const lisatuoteHinnat = {
    "Vesi": 1.50,
    "Pepsi Max": 2.50,
    "Coca-cola": 2.50,
};

function lisakori(koko = "normaali") {
    const kirjautunut     = localStorage.getItem("kirjautunut")    === "kylla";
    const rekisteroitunut = localStorage.getItem("rekisteroitunut") === "kylla";

    if (!kirjautunut) {
        alert(!rekisteroitunut ? "Rekisteröidy ja kirjaudu jatkaaksesi" : "Kirjaudu sisään jatkaaksesi");
        return;
    }

    const lisatuote = document.getElementById("lisätuotteet").value;

    if (!lisatuote) return;

    const ostoskoriLista = JSON.parse(localStorage.getItem("ostoskori") || "[]");

    ostoskoriLista.push({
        nimi: lisatuote,
        koko: "-",
        pohja: "-",
        hinta: lisatuoteHinnat[lisatuote] ?? 0,
        lisatuote: true,
    });

    localStorage.setItem("ostoskori", JSON.stringify(ostoskoriLista));
    paivitaOstoskori(ostoskoriLista);
}

// tilaus

function tilausilmotus() {
    const etunimi       = document.getElementById("etunimi").value.trim();
    const sukunimi      = document.getElementById("sukunimi").value.trim();
    const puhelinnumero = document.getElementById("puhelinnumero").value.trim();
    const osoite        = document.getElementById("osoite") ? document.getElementById("osoite").value.trim() : "";
    const postinumero   = document.getElementById("postinumero").value.trim();
    const kaupunki      = document.getElementById("kaupunki").value.trim();
    const kuljetustapa  = document.getElementById("kuljetustausta").value;

    if (!etunimi || !sukunimi || !puhelinnumero || !postinumero || !kaupunki) {
        alert("Täytä kaikki pakolliset kentät ennen tilauksen lähettämistä.");
        return;
    }

    if (kuljetustapa === "kuljetus" && !osoite) {
        alert("Syötä katuosoite kuljetusta varten.");
        return;
    }

    const kirjautunut     = localStorage.getItem("kirjautunut")     === "kylla";
    const rekisteroitunut = localStorage.getItem("rekisteroitunut") === "kylla";

    if (!kirjautunut) {
        alert(!rekisteroitunut ? "Rekisteröidy ja kirjaudu jatkaaksesi" : "Kirjaudu sisään jatkaaksesi");
        return;
    }

    alert("Onneksi olkoon, tilasit pizzan!");
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

    const minuutit          = ostoskoriLista.length * 15;
    const tunnit            = Math.floor(minuutit / 60);
    const jaljellaminuutit  = minuutit % 60;

    let aika = "";
    if (tunnit > 0) aika += `${tunnit}t `;
    aika += `${jaljellaminuutit}min`;

    nappi.value = `Valmistusaika: ${aika}`;
}