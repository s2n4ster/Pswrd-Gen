// Константы для генерации паролей
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const abc = 'abcdefghijklmnopqrstuvwxyz';
const nums = '0123456789';
const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const lookalike = 'iIlL1oO0';
const confusing = '{}[]()/\\\'"`~,;:.<>';

// Элементы DOM
const ui = {
    pwd: document.getElementById('password'),
    len: document.getElementById('length'),
    lenVal: document.getElementById('length-value'),
    useNums: document.getElementById('numbers'),
    useSpecial: document.getElementById('symbols'),
    useUpper: document.getElementById('uppercase'),
    noLookalike: document.getElementById('similar'),
    noConfusing: document.getElementById('ambiguous'),
    genBtn: document.getElementById('generate-btn'),
    copyBtn: document.getElementById('copy-btn'),
    refreshBtn: document.getElementById('refresh-btn'),
    strengthMeter: document.querySelector('.strength-bar'),
    strengthLabel: document.getElementById('strength-text'),
    pwdList: document.getElementById('password-history'),
    msg: document.getElementById('toast'),
    langBtns: document.querySelectorAll('.lang-btn'),
    presetBtns: document.querySelectorAll('.preset-btn')
};

// Переводы
const i18n = {
    ru: {
        title: 'Генератор Паролей',
        copy: 'Копировать',
        refresh: 'Обновить',
        length: 'Длина пароля',
        numbers: 'Включить цифры',
        symbols: 'Включить символы',
        uppercase: 'Включить заглавные буквы',
        similar: 'Исключить похожие символы',
        ambiguous: 'Исключить неоднозначные символы',
        generate: 'Сгенерировать',
        history: 'История паролей',
        strength: 'Надежность: ',
        memorable: 'Запоминаемый',
        strong: 'Сильный',
        pin: 'PIN-код',
        copied: 'Пароль скопирован!',
        weak: 'Слабый',
        medium: 'Средний',
        strong: 'Сильный',
        veryStrong: 'Очень сильный'
    },
    en: {
        title: 'Password Generator',
        copy: 'Copy',
        refresh: 'Refresh',
        length: 'Password Length',
        numbers: 'Include Numbers',
        symbols: 'Include Symbols',
        uppercase: 'Include Uppercase',
        similar: 'Exclude Similar Characters',
        ambiguous: 'Exclude Ambiguous Characters',
        generate: 'Generate',
        history: 'Password History',
        strength: 'Strength: ',
        memorable: 'Memorable',
        strong: 'Strong',
        pin: 'PIN',
        copied: 'Password copied!',
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong',
        veryStrong: 'Very Strong'
    },
    es: {
        title: 'Generador de Contraseñas',
        copy: 'Copiar',
        refresh: 'Actualizar',
        length: 'Longitud de la Contraseña',
        numbers: 'Incluir Números',
        symbols: 'Incluir Símbolos',
        uppercase: 'Incluir Mayúsculas',
        similar: 'Excluir Caracteres Similares',
        ambiguous: 'Excluir Caracteres Ambiguos',
        generate: 'Generar',
        history: 'Historial de Contraseñas',
        strength: 'Fuerza: ',
        memorable: 'Memorable',
        strong: 'Fuerte',
        pin: 'PIN',
        copied: '¡Contraseña copiada!',
        weak: 'Débil',
        medium: 'Medio',
        strong: 'Fuerte',
        veryStrong: 'Muy Fuerte'
    }
};

// Текущий язык
let lang = 'ru';

// История паролей
let pwdHistory = [];

// Инициализация
function setup() {
    updateLen();
    bindEvents();
    loadPwdHistory();
    setLang('ru');
}

// Обновление значения длины
function updateLen() {
    ui.lenVal.textContent = ui.len.value;
}

// Установка обработчиков событий
function bindEvents() {
    ui.len.addEventListener('input', updateLen);
    ui.genBtn.addEventListener('click', makePwd);
    ui.copyBtn.addEventListener('click', copyPwd);
    ui.refreshBtn.addEventListener('click', makePwd);
    ui.langBtns.forEach(btn => {
        btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
    ui.presetBtns.forEach(btn => {
        btn.addEventListener('click', () => usePreset(btn.dataset.preset));
    });
}

// Генерация пароля
function makePwd() {
    let chars = abc;
    let pwd = '';

    if (ui.useUpper.checked) chars += ABC;
    if (ui.useNums.checked) chars += nums;
    if (ui.useSpecial.checked) chars += special;

    if (ui.noLookalike.checked) {
        lookalike.split('').forEach(c => {
            chars = chars.replace(c, '');
        });
    }

    if (ui.noConfusing.checked) {
        confusing.split('').forEach(c => {
            chars = chars.replace(c, '');
        });
    }

    const len = parseInt(ui.len.value);

    for (let i = 0; i < len; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        pwd += chars[idx];
    }

    ui.pwd.value = pwd;
    checkStrength(pwd);
    saveToHistory(pwd);
}

// Копирование пароля
function copyPwd() {
    if (!ui.pwd.value) return;

    navigator.clipboard.writeText(ui.pwd.value)
        .then(() => showMsg(i18n[lang].copied));
}

// Обновление силы пароля
function checkStrength(pwd) {
    let score = 0;
    
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.match(/[A-Z]/)) score += 1;
    if (pwd.match(/[a-z]/)) score += 1;
    if (pwd.match(/[0-9]/)) score += 1;
    if (pwd.match(/[^A-Za-z0-9]/)) score += 1;

    const percent = (score / 6) * 100;
    ui.strengthMeter.style.width = `${percent}%`;

    let color, text;
    if (percent < 40) {
        color = '#e74c3c';
        text = i18n[lang].weak;
    } else if (percent < 60) {
        color = '#f1c40f';
        text = i18n[lang].medium;
    } else if (percent < 80) {
        color = '#2ecc71';
        text = i18n[lang].strong;
    } else {
        color = '#27ae60';
        text = i18n[lang].veryStrong;
    }

    ui.strengthMeter.style.backgroundColor = color;
    ui.strengthLabel.textContent = i18n[lang].strength + text;
}

// Добавление в историю
function saveToHistory(pwd) {
    if (pwdHistory.includes(pwd)) return;

    pwdHistory.unshift(pwd);
    if (pwdHistory.length > 5) pwdHistory.pop();

    storeHistory();
    showHistory();
}

// Обновление отображения истории
function showHistory() {
    ui.pwdList.innerHTML = '';
    pwdHistory.forEach(pwd => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <span>${pwd}</span>
            <button onclick="copyOldPwd('${pwd}')">
                <i class="fas fa-copy"></i>
            </button>
        `;
        ui.pwdList.appendChild(div);
    });
}

// Копирование из истории
function copyOldPwd(pwd) {
    navigator.clipboard.writeText(pwd)
        .then(() => showMsg(i18n[lang].copied));
}

// Сохранение истории
function storeHistory() {
    localStorage.setItem('pwdHistory', JSON.stringify(pwdHistory));
}

// Загрузка истории
function loadPwdHistory() {
    const saved = localStorage.getItem('pwdHistory');
    if (saved) {
        pwdHistory = JSON.parse(saved);
        showHistory();
    }
}

// Показ уведомления
function showMsg(text) {
    ui.msg.textContent = text;
    ui.msg.classList.add('show');
    setTimeout(() => ui.msg.classList.remove('show'), 2000);
}

// Обновление языка
function setLang(newLang) {
    lang = newLang;
    ui.langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === newLang);
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (i18n[newLang][key]) {
            el.textContent = i18n[newLang][key];
        }
    });
}

// Применение пресета
function usePreset(preset) {
    switch (preset) {
        case 'memorable':
            ui.len.value = 12;
            ui.useNums.checked = true;
            ui.useSpecial.checked = false;
            ui.useUpper.checked = true;
            ui.noLookalike.checked = true;
            ui.noConfusing.checked = true;
            break;
        case 'strong':
            ui.len.value = 16;
            ui.useNums.checked = true;
            ui.useSpecial.checked = true;
            ui.useUpper.checked = true;
            ui.noLookalike.checked = false;
            ui.noConfusing.checked = false;
            break;
        case 'pin':
            ui.len.value = 6;
            ui.useNums.checked = true;
            ui.useSpecial.checked = false;
            ui.useUpper.checked = false;
            ui.noLookalike.checked = true;
            ui.noConfusing.checked = true;
            break;
    }
    updateLen();
    makePwd();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', setup); 