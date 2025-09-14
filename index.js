const characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '{', '[', '}', ']', ',', '|', ':', ';', '<', '>', '.', '?', '/'];
let customCharacters = [];
let checkBoxes = document.querySelectorAll('.checkbox-input');
let pswInputs = document.querySelectorAll('.text-input');
const pswLengthRange = document.getElementById('psw-length-range');
const pswLengthNumber = document.getElementById('psw-length-number');

const errorMsg = document.querySelector('.input-error');

const genPswBtn = document.querySelector('.gen-psw-btn');
// range
// numbers
// symbols

const psw = {
    length: 8,
    isPswLengthValid: true,
    hasNumbers: false,
    hasSymbols: false,
    regExpLetters: /[a-zA-Z]+/g,
    regExpNumbers: /[a-zA-Z0-9]+/g,
    regExpSymbols: /[^0-9]+/g,
    firstInputEl: document.getElementById('psw-first-input'),
    secondInputEl: document.getElementById('psw-second-input'),
    first: '',
    second: '',
};

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
function getPsw(psw, pswLength, quantityOfCharacters) {
    if (psw.length === pswLength) {
        console.log('psw is done ', psw);
        return psw;
    } else {
        let index = getRandomIndex(quantityOfCharacters);
        psw += customCharacters[index];
        return getPsw(psw, pswLength, quantityOfCharacters);
    }
}

function renderPsw() {
    psw.firstInputEl.value = psw.first;
    psw.secondInputEl.value = psw.second;
}

function rebind() {
    //reset options to default
}

function getRandomIndex(lengthOfCharacters) {
    return Math.floor(Math.random() * lengthOfCharacters);
}

function filterCharactersByUser(regExp) {
    return characters.filter((el) => {
        if (el.match(regExp)) {
            return true;
        } else {
            return false;
        }
    });
}

// validate input length -> check length of password if(input.value >7 && input.value < 13) -> isValue = true, else isValue = false,
// launch changeBtnStatus and error handler
// error handler -> errMsg.classList.toggle('error')
// changeBtnStatus(isValid) -> btn.disabled = isValid, classList.toggle('disable')

genPswBtn.addEventListener('click', () => {
    //rebind();
    getPswOpt();
    getCustomCharacters();
    psw.first = getPsw('', psw.length, customCharacters.length);
    psw.second = getPsw('', psw.length, customCharacters.length);
    renderPsw();
});

function getPswOpt() {
    checkBoxes.forEach((el) => {
        let key = el.dataset.objKey;
        console.log('key ', key);
        psw[key] = el.checked;
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
    //debugger;

    if (pswLengthNumber.value < 8) {
        pswLengthNumber.value = 8;
    } else if (pswLengthNumber.value > 15) {
        pswLengthNumber.value = 15;
    } else {
        console.log(`psw length is ${pswLengthNumber.value}`);
    }
}

function clipBoard(event) {
    //debugger;
    let input = event.currentTarget;
    let psw = input.value;
    // copy value to clipboard

    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(psw);

    let pswMsg = input.closest('.gen-psw').querySelector('.psw-msg');
    // show the copied text
    showMsg(pswMsg, 'd-block', psw);
}

function showMsg(el, className, psw) {
    //debugger;
    el.innerHTML = 'Password ' + '<em class=green">' + psw + '</em>' + ' has been copied!';
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
