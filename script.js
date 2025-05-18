const passwordEl = document.getElementById('password');
const lengthEl = document.getElementById('length');
const lengthValueEl = document.getElementById('length-value');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const uppercaseEl = document.getElementById('uppercase');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const langBtns = document.querySelectorAll('.lang-btn');

const translations = {
    ru: {
        title: 'Генератор Паролей',
        copy: 'Копировать',
        copied: 'Скопировано!',
        length: 'Длина пароля',
        numbers: 'Включить цифры',
        symbols: 'Включить символы',
        uppercase: 'Включить заглавные буквы',
        generate: 'Сгенерировать'
    },
    en: {
        title: 'Password Generator',
        copy: 'Copy',
        copied: 'Copied!',
        length: 'Password Length',
        numbers: 'Include Numbers',
        symbols: 'Include Symbols',
        uppercase: 'Include Uppercase',
        generate: 'Generate'
    },
    es: {
        title: 'Generador de Contraseñas',
        copy: 'Copiar',
        copied: '¡Copiado!',
        length: 'Longitud de Contraseña',
        numbers: 'Incluir Números',
        symbols: 'Incluir Símbolos',
        uppercase: 'Incluir Mayúsculas',
        generate: 'Generar'
    }
};

const chars = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

let currentLang = 'ru';

const setLanguage = (lang) => {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
};

const generatePassword = () => {
    let password = '';
    let charSet = chars.lowercase;
    
    if (numbersEl.checked) charSet += chars.numbers;
    if (symbolsEl.checked) charSet += chars.symbols;
    if (uppercaseEl.checked) charSet += chars.uppercase;
    
    const length = parseInt(lengthEl.value);
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        password += charSet[randomIndex];
    }
    
    return password;
};

const updateLengthValue = () => {
    lengthValueEl.textContent = lengthEl.value;
};

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(passwordEl.value);
        copyBtn.textContent = translations[currentLang].copied;
        setTimeout(() => {
            copyBtn.textContent = translations[currentLang].copy;
        }, 2000);
    } catch (err) {
        console.error('Ошибка копирования:', err);
    }
};

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.getAttribute('data-lang'));
    });
});

lengthEl.addEventListener('input', updateLengthValue);
generateBtn.addEventListener('click', () => {
    passwordEl.value = generatePassword();
});
copyBtn.addEventListener('click', copyToClipboard);

updateLengthValue();
passwordEl.value = generatePassword(); 