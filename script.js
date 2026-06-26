// ===== AGE VERIFICATION =====
function confirmAge() {
    document.getElementById('ageOverlay').classList.add('hidden');
    sessionStorage.setItem('ageVerified', 'true');
}

function rejectAge() {
    window.location.href = 'https://www.google.com';
}

// ============================================================
//  STATE
// ============================================================
let currentStep = 1;
const totalSteps = 10;
let isTransitioning = false;

let answers = {
    eventType: null,
    season: null,
    guests: { women: 1, men: 1, children: 0 },
    drinkingLevel: null,
    duration: 4,
    budget: null,
    spirits: { vodka: false, whiskey: false, cognac: false, gin: false, rum: false, tequila: false, none: false },
    wineType: { red: false, white: false, rose: false, sparkling: false, none: false },
    softDrinks: { juice: false, soda: false, water: false, lemonade: false, compote: false, none: false }
};

// ============================================================
//  STEPS CONFIG
// ============================================================
const steps = [
    {
        id: 1,
        question: 'Какое мероприятие планируете?',
        type: 'radio',
        key: 'eventType',
        options: [
            { v: 'banquet', l: 'Банкет', desc: 'Торжественный ужин с полной сервировкой' },
            { v: 'furshet', l: 'Фуршет', desc: 'Лёгкий приём с закусками и напитками' },
            { v: 'wedding', l: 'Свадьба', desc: 'Главное торжество с большим размахом' }
        ],
        tip: 'Выберите тип мероприятия'
    },
    {
        id: 2,
        question: 'В какой сезон?',
        type: 'radio',
        key: 'season',
        options: [
            { v: 'summer', l: 'Лето', desc: 'Жаркая погода — больше лёгких напитков' },
            { v: 'autumn', l: 'Осень', desc: 'Уютное время для красного вина' },
            { v: 'winter', l: 'Зима', desc: 'Холод — отличный повод для крепкого' },
            { v: 'spring', l: 'Весна', desc: 'Пробуждение — время для игристого' }
        ],
        tip: 'Укажите сезон для точного расчёта'
    },
    {
        id: 3,
        question: 'Количество гостей',
        type: 'counter',
        key: 'guests',
        tip: 'Добавьте количество гостей'
    },
    {
        id: 4,
        question: 'Как активно пьют ваши гости?',
        type: 'radio',
        key: 'drinkingLevel',
        options: [
            { v: 'low', l: 'Пьют мало', desc: 'В основном символически, больше общаются' },
            { v: 'moderate', l: 'Пьют умеренно', desc: 'Стандартный уровень для банкета' },
            { v: 'high', l: 'Пьют активно', desc: 'Любят застолье с размахом' }
        ],
        tip: 'Это влияет на расчёт количества алкоголя'
    },
    {
        id: 5,
        question: 'Выберите продолжительность мероприятия:',
        type: 'slider',
        key: 'duration',
        min: 2,
        max: 12,
        step: 1,
        label: 'часов',
        tip: 'Выберите длительность мероприятия'
    },
    {
        id: 6,
        question: 'Какой крепкий алкоголь предпочитаете?',
        type: 'checkbox',
        key: 'spirits',
        options: [
            { v: 'vodka', l: 'Водка' },
            { v: 'whiskey', l: 'Виски' },
            { v: 'cognac', l: 'Коньяк' },
            { v: 'gin', l: 'Джин' },
            { v: 'rum', l: 'Ром' },
            { v: 'tequila', l: 'Текила' },
            { v: 'none', l: 'Никакой' }
        ],
        tip: 'Выберите крепкие напитки'
    },
    {
        id: 7,
        question: 'Какое вино предпочитаете?',
        type: 'checkbox',
        key: 'wineType',
        options: [
            { v: 'red', l: 'Красное' },
            { v: 'white', l: 'Белое' },
            { v: 'rose', l: 'Розовое' },
            { v: 'sparkling', l: 'Игристое' },
            { v: 'none', l: 'Никакое' }
        ],
        tip: 'Выберите тип вина'
    },
    {
        id: 8,
        question: 'Какие безалкогольные напитки нужны?',
        type: 'checkbox',
        key: 'softDrinks',
        options: [
            { v: 'juice', l: 'Сок' },
            { v: 'soda', l: 'Газировка' },
            { v: 'water', l: 'Вода' },
            { v: 'lemonade', l: 'Лимонад' },
            { v: 'compote', l: 'Компот' },
            { v: 'none', l: 'Никакие' }
        ],
        tip: 'Выберите безалкогольные напитки'
    },
    {
        id: 9,
        question: 'Какой планируете бюджет на мероприятие?',
        type: 'radio',
        key: 'budget',
        options: [
            { v: 'economy', l: 'Эконом вариант', desc: 'Базовый набор без излишеств' },
            { v: 'medium', l: 'Средний', desc: 'Оптимальный баланс цены и качества' },
            { v: 'vip', l: 'ВИП', desc: 'Премиальные напитки для особого случая' }
        ],
        tip: 'Выберите бюджет'
    },
    {
        id: 10,
        question: '',
        type: 'result',
        tip: 'Ваш результат готов!'
    }
];

const tips = {
    1: 'Выберите тип мероприятия',
    2: 'Укажите сезон для точного расчёта',
    3: 'Добавьте количество гостей',
    4: 'Оцените, как активно пьют гости',
    5: 'Выберите длительность мероприятия',
    6: 'Выберите крепкие напитки',
    7: 'Выберите тип вина',
    8: 'Выберите безалкогольные напитки',
    9: 'Выберите бюджет',
    10: 'Ваш результат готов!'
};

// ============================================================
//  NAMES DICTIONARIES
// ============================================================
const spiritNames = {
    vodka: 'Водка',
    whiskey: 'Виски',
    cognac: 'Коньяк',
    gin: 'Джин',
    rum: 'Ром',
    tequila: 'Текила'
};

const wineNames = {
    red: 'Красное вино',
    white: 'Белое вино',
    rose: 'Розовое вино',
    sparkling: 'Игристое вино'
};

const softNames = {
    juice: 'Сок',
    soda: 'Газировка',
    water: 'Вода',
    lemonade: 'Лимонад',
    compote: 'Компот'
};

// ============================================================
//  RENDER STEP
// ============================================================
function renderStep(direction) {
    const step = steps[currentStep - 1];
    const content = document.getElementById('content');
    let html = '';

    if (step.type === 'radio') {
        const cols = step.options.length > 3 ? 'single-col' : '';
        html += `<div class="question"><span class="step-badge">Шаг ${currentStep} из 9</span><br>${step.question}</div>`;
        html += `<div class="options ${cols}">`;
        step.options.forEach(opt => {
            const sel = answers[step.key] === opt.v ? 'selected' : '';
            const desc = opt.desc || '';
            html += `
                <div class="option ${sel}" onclick="selectOption('${step.key}', '${opt.v}', this)">
                    <span class="label-text">${opt.l}</span>
                    <span class="radio-circle"></span>
                    ${desc ? `<span class="tooltip">${desc}</span>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    } else if (step.type === 'counter') {
        html += `<div class="question"><span class="step-badge">Шаг ${currentStep} из 9</span><br>${step.question}</div>`;
        html += `<div class="counter-group">`;
        const items = [
            { key: 'women', label: 'Женщин' },
            { key: 'men', label: 'Мужчин' },
            { key: 'children', label: 'Детей' }
        ];
        items.forEach(item => {
            html += `
                <div class="counter">
                    <span class="label">${item.label}</span>
                    <div class="counter-actions">
                        <button onclick="changeGuest('${item.key}', -1)">−</button>
                        <span class="count" id="${item.key[0]}">${answers.guests[item.key]}</span>
                        <button onclick="changeGuest('${item.key}', 1)">+</button>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    } else if (step.type === 'slider') {
        const val = answers.duration || step.min;
        const pct = ((val - step.min) / (step.max - step.min)) * 100;
        html += `
            <div class="question">
                <span class="step-badge">Шаг ${currentStep} из 9</span><br>
                ${step.question}
                <div class="sub">${val} ${step.label}</div>
            </div>
            <div class="slider-container">
                <div class="slider-value">${val} <span>${step.label}</span></div>
                <div class="slider-wrapper">
                    <input type="range" min="${step.min}" max="${step.max}" step="${step.step}" 
                           value="${val}" 
                           oninput="updateSlider(this.value, ${step.min}, ${step.max})"
                           style="background: linear-gradient(to right, #b12535 0%, #b12535 ${pct}%, #e0e0e0 ${pct}%, #e0e0e0 100%)">
                </div>
                <div class="slider-labels">
                    <span>${step.min} ч</span>
                    <span>${step.max} ч</span>
                </div>
            </div>
        `;
    } else if (step.type === 'checkbox') {
        html += `<div class="question"><span class="step-badge">Шаг ${currentStep} из 9</span><br>${step.question}</div>`;
        html += `<div class="options-grid">`;
        const selected = answers[step.key] || {};
        step.options.forEach(opt => {
            const isChecked = selected[opt.v] || false;
            const sel = isChecked ? 'selected' : '';
            const isNone = opt.v === 'none';
            html += `
                <div class="option ${sel}" onclick="toggleCheckbox('${step.key}', '${opt.v}', this, ${isNone})">
                    <span class="label-text">${opt.l}</span>
                    <span class="radio-circle"></span>
                </div>
            `;
        });
        html += `</div>`;
    } else if (step.type === 'result') {
        html = renderResult();
    }

    if (direction === 'next') {
        content.classList.remove('slide-in');
        content.classList.add('slide-left');
        setTimeout(() => {
            content.innerHTML = html;
            content.classList.remove('slide-left');
            content.classList.add('slide-in');
        }, 300);
    } else if (direction === 'prev') {
        content.classList.remove('slide-in');
        content.classList.add('slide-right');
        setTimeout(() => {
            content.innerHTML = html;
            content.classList.remove('slide-right');
            content.classList.add('slide-in');
        }, 300);
    } else {
        content.innerHTML = html;
        content.classList.remove('slide-left', 'slide-right');
        content.classList.add('slide-in');
    }

    updateButtons();
    updateTip();
}

// ============================================================
//  CONTROLS
// ============================================================
function updateSlider(value, min, max) {
    const val = parseInt(value);
    answers.duration = val;
    const pct = ((val - min) / (max - min)) * 100;
    const slider = document.querySelector('.slider-wrapper input[type="range"]');
    if (slider) {
        slider.style.background = `linear-gradient(to right, #b12535 0%, #b12535 ${pct}%, #e0e0e0 ${pct}%, #e0e0e0 100%)`;
    }
    const display = document.querySelector('.slider-value');
    if (display) {
        display.innerHTML = `${val} <span>часов</span>`;
    }
    updateButtons();
}

function toggleCheckbox(key, value, el, isNone) {
    const obj = answers[key] || {};

    if (isNone) {
        Object.keys(obj).forEach(k => {
            if (k !== 'none') obj[k] = false;
        });
        obj.none = !obj.none;
        const parent = el.closest('.options-grid');
        if (parent) {
            parent.querySelectorAll('.option').forEach(o => {
                o.classList.remove('selected');
            });
        }
        if (obj.none) {
            el.classList.add('selected');
        }
        answers[key] = obj;
        updateButtons();
        updateTip();
        return;
    }

    if (obj.none === true) {
        obj.none = false;
        const parent = el.closest('.options-grid');
        if (parent) {
            parent.querySelectorAll('.option').forEach(o => {
                const label = o.querySelector('.label-text');
                if (label && ['Никакой', 'Никакое', 'Никакие'].includes(label.textContent.trim())) {
                    o.classList.remove('selected');
                }
            });
        }
    }

    obj[value] = !obj[value];
    answers[key] = obj;
    el.classList.toggle('selected');
    updateButtons();
    updateTip();
}

function selectOption(key, value, el) {
    answers[key] = value;
    const parent = el.closest('.options');
    if (parent) {
        parent.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    }
    el.classList.add('selected');
    updateButtons();
    updateTip();
}

function changeGuest(type, delta) {
    answers.guests[type] = Math.max(0, answers.guests[type] + delta);
    const el = document.getElementById(type[0]);
    if (el) el.textContent = answers.guests[type];
    updateButtons();
    updateTip();
}

// ============================================================
//  UI UPDATES
// ============================================================
function updateButtons() {
    const nextBtn = document.getElementById('btn-next');
    const backBtn = document.getElementById('btn-back');
    const nav = document.querySelector('.nav');
    const step = steps[currentStep - 1];
    let canGo = false;

    if (currentStep === steps.length) {
        if (nav) nav.classList.add('hidden-nav');
        return;
    } else {
        if (nav) nav.classList.remove('hidden-nav');
    }

    if (currentStep === 1) {
        backBtn.classList.add('hidden');
    } else {
        backBtn.classList.remove('hidden');
    }

    if (step.type === 'radio') {
        canGo = !!answers[step.key];
    } else if (step.type === 'counter') {
        const total = answers.guests.women + answers.guests.men + answers.guests.children;
        canGo = total > 0;
    } else if (step.type === 'slider') {
        canGo = true;
    } else if (step.type === 'checkbox') {
        const obj = answers[step.key] || {};
        canGo = Object.values(obj).some(v => v === true);
    }

    nextBtn.disabled = !canGo;
    nextBtn.style.display = 'flex';
}

function updateTip() {
    const tipContainer = document.getElementById('tipContainer');
    const text = document.getElementById('tipText');
    const step = steps[currentStep - 1];

    // Восстанавливаем цвет, если он был изменён ошибкой
    if (text.style.color === '#b12535') {
        text.style.color = '#666';
    }

    text.textContent = tips[currentStep] || 'Заполните данные';

    let isComplete = false;
    if (step.type === 'radio') {
        isComplete = !!answers[step.key];
    } else if (step.type === 'counter') {
        const total = answers.guests.women + answers.guests.men + answers.guests.children;
        isComplete = total > 0;
    } else if (step.type === 'slider') {
        isComplete = true;
    } else if (step.type === 'checkbox') {
        const obj = answers[step.key] || {};
        isComplete = Object.values(obj).some(v => v === true);
    } else if (step.type === 'result') {
        isComplete = true;
    }

    if (currentStep === steps.length) {
        tipContainer.classList.add('hidden-tip');
        return;
    }

    if (!isComplete) {
        tipContainer.classList.remove('hidden-tip');
    } else {
        tipContainer.classList.add('hidden-tip');
    }
}

function showErrorTip(message) {
    const text = document.getElementById('tipText');
    const container = document.getElementById('tipContainer');
    text.textContent = message;
    text.style.color = '#b12535';
    container.classList.remove('hidden-tip');
    setTimeout(() => {
        text.textContent = tips[currentStep] || 'Заполните данные';
        text.style.color = '#666';
        const step = steps[currentStep - 1];
        const isComplete = checkStepComplete(step);
        if (isComplete) {
            container.classList.add('hidden-tip');
        }
    }, 3000);
}

function checkStepComplete(step) {
    if (step.type === 'radio') {
        return !!answers[step.key];
    } else if (step.type === 'counter') {
        const total = answers.guests.women + answers.guests.men + answers.guests.children;
        return total > 0;
    } else if (step.type === 'slider') {
        return true;
    } else if (step.type === 'checkbox') {
        const obj = answers[step.key] || {};
        return Object.values(obj).some(v => v === true);
    } else if (step.type === 'result') {
        return true;
    }
    return false;
}

// ============================================================
//  NAVIGATION
// ============================================================
function nextStep() {
    if (isTransitioning || currentStep >= steps.length) return;
    isTransitioning = true;

    // Проверка для шага 6 (крепкий алкоголь)
    if (currentStep === 6) {
        const spirits = answers.spirits || {};
        const hasSpirit = Object.keys(spirits).some(k => spirits[k] === true && k !== 'none');
        if (!hasSpirit && !spirits.none) {
            showErrorTip('Выберите хотя бы один вариант');
            setTimeout(() => { isTransitioning = false; }, 500);
            return;
        }
    }

    // Проверка для шага 7 (вино)
    if (currentStep === 7) {
        const wine = answers.wineType || {};
        const hasWine = Object.keys(wine).some(k => wine[k] === true && k !== 'none');
        if (!hasWine && !wine.none) {
            showErrorTip('Выберите хотя бы один вариант');
            setTimeout(() => { isTransitioning = false; }, 500);
            return;
        }
    }

    if (currentStep < steps.length) {
        currentStep++;
        renderStep('next');
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => { isTransitioning = false; }, 500);
}

function prevStep() {
    if (isTransitioning || currentStep <= 1) return;
    isTransitioning = true;

    if (currentStep > 1) {
        currentStep--;
        renderStep('prev');
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => { isTransitioning = false; }, 500);
}

function resetCalculator() {
    answers = {
        eventType: null,
        season: null,
        guests: { women: 1, men: 1, children: 0 },
        drinkingLevel: null,
        duration: 4,
        budget: null,
        spirits: { vodka: false, whiskey: false, cognac: false, gin: false, rum: false, tequila: false, none: false },
        wineType: { red: false, white: false, rose: false, sparkling: false, none: false },
        softDrinks: { juice: false, soda: false, water: false, lemonade: false, compote: false, none: false }
    };

    currentStep = 1;
    const nav = document.querySelector('.nav');
    if (nav) nav.classList.remove('hidden-nav');

    renderStep();
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
//  CALCULATIONS
// ============================================================
function calculateDrinks() {
    const total = answers.guests.women + answers.guests.men + answers.guests.children || 10;
    const hours = answers.duration || 4;
    const isSummer = answers.season === 'summer';
    const isWinter = answers.season === 'winter';
    const isAutumnSpring = answers.season === 'spring' || answers.season === 'autumn';
    const isVip = answers.budget === 'vip';
    const isEconomy = answers.budget === 'economy';

    let drinkingCoef = 1;
    if (answers.drinkingLevel === 'low') drinkingCoef = 0.6;
    else if (answers.drinkingLevel === 'moderate') drinkingCoef = 1;
    else if (answers.drin
