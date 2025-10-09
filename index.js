const characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '{', '[', '}', ']', ',', '|', ':', ';', '<', '>', '.', '?', '/'];
let customCharacters = [];
let checkBoxes = document.querySelectorAll('.checkbox-input');
let pswInputs = document.querySelectorAll('.text-input');
const pswLengthRange = document.getElementById('psw-length-range');
const pswLengthNumber = document.getElementById('psw-length-number');
const errorMsg = document.querySelector('.input-error');
const genPswBtn = document.querySelector('.gen-psw-btn');

const psw = {
    length: 8,
    hasNumbers: false,
    hasSymbols: false,
    regExpLetters: /[a-zA-Z]+/,
    regExpNumbers: /[a-zA-Z0-9]+/,
    regExpSymbols: /[^0-9]+/,
    firstInputEl: document.getElementById('psw-first-input'),
    secondInputEl: document.getElementById('psw-second-input'),
    first: '',
    second: '',
};

//init range
pswLengthRange.value = psw.length;

function getCustomCharacters() {
    if (psw.hasNumbers && psw.hasSymbols) {
        customCharacters = characters;
    } else if (psw.hasNumbers) {
        customCharacters = filterCharactersByUser(psw.regExpNumbers);
    } else if (psw.hasSymbols) {
        customCharacters = filterCharactersByUser(psw.regExpSymbols);
    } else {
        customCharacters = filterCharactersByUser(psw.regExpLetters);
    }

    console.log('custom characters ', customCharacters);
}

// psw default = ''
function getPsw(newPsw, pswLength, quantityOfCharacters) {
    if (newPsw.length === pswLength) {
        console.log('psw is done ', newPsw);
        return newPsw;
    } else {
        let index = getRandomIndex(quantityOfCharacters);
        newPsw += customCharacters[index];
        return getPsw(newPsw, pswLength, quantityOfCharacters);
    }
}

function renderPsw() {
    psw.firstInputEl.value = psw.first;
    psw.secondInputEl.value = psw.second;
}

function getRandomIndex(lengthOfCharacters) {
    return Math.floor(Math.random() * lengthOfCharacters);
}

function filterCharactersByUser(regExp) {
    return characters.filter((el) => {
        return el.match(regExp);
    });
}

genPswBtn.addEventListener('click', () => {
    getPswOpt();
    getCustomCharacters();
    psw.first = getPsw('', psw.length, customCharacters.length);
    psw.second = getPsw('', psw.length, customCharacters.length);
    renderPsw();
});

function getPswOpt() {
    checkBoxes.forEach((el) => {
        let key = el.dataset.objKey;
        let keyValue = el.checked;
        console.log('key ', key, keyValue);
        psw[key] = keyValue;
    });
}

function getPswLng(ev, el) {
    let input = ev.currentTarget;
    let length = input.valueAsNumber;
    el.value = length;
    psw.length = length;
    console.log('psw len ', length);
}

pswLengthRange.addEventListener('change', (ev) => {
    getPswLng(ev, pswLengthNumber);
});

pswLengthNumber.addEventListener('change', (ev) => {
    validatePswLength();
    getPswLng(ev, pswLengthRange);
});

function validatePswLength() {
    let length = pswLengthNumber.value;
    let normalize = null;
    if (length < 8) {
        normalize = 8;
    } else if (length > 15) {
        normalize = 15;
    } else {
        normalize = length;
    }
    pswLengthNumber.value = normalize;
}

function clipBoard(event) {
    let input = event.currentTarget;
    let psw = input.value;

    // Copy the text inside the text field
    // navigator.clipboard.writeText(psw);

    navigator.clipboard
        .writeText(psw)
        .then(() => {
            const pswMsg = input.closest('.gen-psw').querySelector('.psw-msg');
            showMsg(pswMsg, 'd-block', psw);
        })
        .catch((err) => {
            console.error('Clipboard error:', err);
        });
}

function showMsg(el, className, psw) {
    el.innerHTML = 'Password ' + '<em class="green">' + psw + '</em>' + ' has been copied!';
    el.classList.add(className);
    setTimeout(() => {
        el.classList.remove(className);
    }, 3000);
}

pswInputs.forEach((input) => {
    input.addEventListener('click', (event) => {
        clipBoard(event);
    });
});
