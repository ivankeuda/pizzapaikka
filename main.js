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