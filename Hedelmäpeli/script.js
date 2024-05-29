const imagesPath = 'hedelmäkuvat/';
const images = [
    'seven.png',
    'diamond.png',
    'cherry.png',
    'apple.png',
    'bar.png',
    'watermelon.png',
];

const kuva1 = document.querySelectorAll('.ruutu img')[0];
const kuva2 = document.querySelectorAll('.ruutu img')[1];
const kuva3 = document.querySelectorAll('.ruutu img')[2];
const kuva4 = document.querySelectorAll('.ruutu img')[3];

const voittolinjat = new Map([
    ["0,0,0,0", 10],
    ["1,1,1,1", 6],
    ["2,2,2,2", 5],
    ["3,3,3,3", 3],
    ["4,4,4,4", 5],
]);

let slots = [0, 0, 0, 0];
let locks = [0, 0, 0, 0];
let canLock = false;
let raha = 0;
let panosNyt = 1;
let pyoraytykset = 0; // Pyöräytysten laskuri

document.getElementById("raha").innerHTML = raha;
document.getElementById("panos").innerHTML = panosNyt;

function arvonta(index) {
    let num = Math.floor(Math.random() * 6);
    let image = imagesPath + images[num];
    slots[index] = num;
    return image;
}

function pelaa() {
    pyoraytykset++; // Kasvata pyöräytysten määrää
    rahaa();
    vaihdaKuva();
    voitto();
    canLock = (pyoraytykset % 2 === 0); // Sallii lukituksen joka toinen pyöräytys
    if (!canLock) {
        locks = [0, 0, 0, 0]; // Nollaa lukitukset pyöräytyksen jälkeen, jos ei ole lukitusvuoro
    }
    resetLockButtons();
}

function rahaa() {
    raha -= panosNyt; // Vähennä panos rahasta
    document.getElementById("raha").innerHTML = raha;
}

function vaihdaKuva() {
    if (locks[0] == 0) { kuva1.src = arvonta(0); }
    if (locks[1] == 0) { kuva2.src = arvonta(1); }
    if (locks[2] == 0) { kuva3.src = arvonta(2); }
    if (locks[3] == 0) { kuva4.src = arvonta(3); }
}

function voitto() {
    let line = slots.join(',');

    if (voittolinjat.has(line)) {
        let tulo = voittolinjat.get(line) * panosNyt;
        raha += tulo;
        voittotekstiNäkyy(tulo);
        document.getElementById("raha").innerHTML = raha;
    } else {
        let voittoteksti = document.getElementById("voittoteksti");
        voittoteksti.innerHTML = "EI VOITTOA";
        voittoteksti.style.visibility = "visible";
        setTimeout(() => {
            voittoteksti.style.visibility = "hidden";
        }, 2000);
    }
}

function lukitse(index) {
    if (!canLock) {
        return;
    }

    const lockButtons = document.querySelectorAll('.lukitse');
    const lockedCount = locks.reduce((a, b) => a + b, 0);

    if (locks[index] == 0 && lockedCount < 3) {
        locks[index] = 1;
        lockButtons[index].style.color = "white";
        lockButtons[index].innerHTML = "LUKITTU";
    } else if (locks[index] == 1) {
        locks[index] = 0;
        lockButtons[index].style.color = "black";
        lockButtons[index].innerHTML = "LUKITSE";
    }
}

function resetLockButtons() {
    const lockButtons = document.querySelectorAll('.lukitse');
    for (let i = 0; i < lockButtons.length; i++) {
        lockButtons[i].style.color = "black";
        lockButtons[i].innerHTML = "LUKITSE";
    }
}

function panos() {
    if (panosNyt >= 10) {
        panosNyt = 0;
    }
    panosNyt += 1;
    document.getElementById("panos").innerHTML = panosNyt;
    taulukonKerroin(panosNyt);
}

function taulukonKerroin(panosNyt) {
    const voittotaulu1 = document.getElementById("voittotaulu1");
    const voittotaulu2 = document.getElementById("voittotaulu2");

    for (let i = 0; i < voittotaulu1.rows.length; i++) {
        const baseValue1 = parseInt(voittotaulu1.rows[i].cells.item(1).getAttribute('data-base-value'));
        const newValue1 = baseValue1 * panosNyt;
        voittotaulu1.rows[i].cells.item(1).innerHTML = newValue1;
    }

    for (let i = 0; i < voittotaulu2.rows.length; i++) {
        const baseValue2 = parseInt(voittotaulu2.rows[i].cells.item(1).getAttribute('data-base-value'));
        const newValue2 = baseValue2 * panosNyt;
        voittotaulu2.rows[i].cells.item(1).innerHTML = newValue2;
    }
}

function voittotekstiNäkyy(raha) {
    let voittoteksti = document.getElementById("voittoteksti");
    voittoteksti.innerHTML = "VOITIT " + raha + "!";
    voittoteksti.style.visibility = "visible";
    setTimeout(() => {
        voittoteksti.style.visibility = "hidden";
    }, 2000);
}

// Initialize the winning table values
function initializeVoittotaulu() {
    const voittotaulu1 = document.getElementById("voittotaulu1");
    const voittotaulu2 = document.getElementById("voittotaulu2");

    for (let i = 0; i < voittotaulu1.rows.length; i++) {
        const baseValue = parseInt(voittotaulu1.rows[i].cells.item(1).innerHTML);
        voittotaulu1.rows[i].cells.item(1).setAttribute('data-base-value', baseValue);
    }

    for (let i = 0; i < voittotaulu2.rows.length; i++) {
        const baseValue = parseInt(voittotaulu2.rows[i].cells.item(1).innerHTML);
        voittotaulu2.rows[i].cells.item(1).setAttribute('data-base-value', baseValue);
    }
}

initializeVoittotaulu();
