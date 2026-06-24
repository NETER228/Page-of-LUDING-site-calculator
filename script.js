// ===== AGE VERIFICATION =====
function confirmAge() {
    document.getElementById('ageOverlay').classList.add('hidden');
    sessionStorage.setItem('ageVerified', 'true');
}

function rejectAge() {
    window.location.href = 'https://www.google.com';
}

let currentStep = 1;
const totalSteps = 10;
let isTransitioning = false;

let answers = {
    eventType: null,
    season: null,
    guests: { women: 1, men: 1, children: 0 },
    drinkingLevel: null, // 'low', 'moderate', 'high'
    duration: 4,
    budget: null,
    spirits: { vodka: false, whiskey: false, cognac: false, gin: false, rum: false, tequila: false, none: false },
    wineType: { red: false, white: false, rose: false, sparkling: false, none: false },
    softDrinks: { juice: false, soda: false, water: false, lemonade: false, compote: false, none: false }
};

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
    } 
    else if (step.type === 'counter') {
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
    }
    else if (step.type === 'slider') {
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
    }
    else if (step.type === 'checkbox') {
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
    }
    else if (step.type === 'result') {
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
}

function selectOption(key, value, el) {
    answers[key] = value;
    const parent = el.closest('.options');
    if (parent) {
        parent.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    }
    el.classList.add('selected');
    updateButtons();
}

function changeGuest(type, delta) {
    answers.guests[type] = Math.max(0, answers.guests[type] + delta);
    const el = document.getElementById(type[0]);
    if (el) el.textContent = answers.guests[type];
    updateButtons();
}

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

function nextStep() {
    if (isTransitioning || currentStep >= steps.length) return;
    isTransitioning = true;
    
    // Проверка для шагов 6 и 7 (бывшие 5 и 6) — должен быть выбран хотя бы один вариант
    if (currentStep === 6) {
        const spirits = answers.spirits || {};
        const hasSpirit = Object.keys(spirits).some(k => spirits[k] === true && k !== 'none');
        if (!hasSpirit && !spirits.none) {
            setTimeout(() => { isTransitioning = false; }, 500);
            return;
        }
    }
    
    if (currentStep === 7) {
        const wine = answers.wineType || {};
        const hasWine = Object.keys(wine).some(k => wine[k] === true && k !== 'none');
        if (!hasWine && !wine.none) {
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

function calculateDrinks() {
    const total = answers.guests.women + answers.guests.men + answers.guests.children || 10;
    const hours = answers.duration || 4;
    const isSummer = answers.season === 'summer';
    const isWinter = answers.season === 'winter';
    const isAutumnSpring = answers.season === 'spring' || answers.season === 'autumn';
    const isVip = answers.budget === 'vip';
    const isEconomy = answers.budget === 'economy';
    
    // Коэффициент активности питья
    let drinkingCoef = 1;
    if (answers.drinkingLevel === 'low') drinkingCoef = 0.6;
    else if (answers.drinkingLevel === 'moderate') drinkingCoef = 1;
    else if (answers.drinkingLevel === 'high') drinkingCoef = 1.4;
    
    // Базовые нормы на человека за 4 часа (в бутылках)
    // Для крепкого: 0.5 л бутылка
    // Для вина: 0.75 л бутылка
    // Для воды: 0.5 л бутылка
    const baseSpirit = 0.25;      // 0.25 бут. 0.5л на человека за 4 часа
    const baseWine = 0.35;        // 0.35 бут. 0.75л на человека за 4 часа
    const baseSparkling = 0.25;   // 0.25 бут. 0.75л на человека за 4 часа
    const baseWater = 0.8;        // 0.8 бут. 0.5л на человека за 4 часа
    const baseJuice = 0.2;        // 0.2 бут. 1л на человека за 4 часа
    const baseSoda = 0.2;         // 0.2 бут. 0.5л на человека за 4 часа
    const baseLemonade = 0.15;    // 0.15 бут. 0.5л на человека за 4 часа
    const baseCompote = 0.1;      // 0.1 бут. 0.5л на человека за 4 часа
    
    let hoursCoef = hours / 4;
    let seasonCoef = 1;
    let budgetCoef = 1;
    
    if (isSummer) {
        seasonCoef = 1.15;
    }
    if (isWinter) {
        seasonCoef = 1.05;
    }
    if (isAutumnSpring) {
        seasonCoef = 1;
    }
    
    if (isVip) budgetCoef = 1.2;
    if (isEconomy) budgetCoef = 0.8;
    
    const spiritsSelected = Object.keys(answers.spirits).filter(k => answers.spirits[k] && k !== 'none');
    const wineSelected = Object.keys(answers.wineType).filter(k => answers.wineType[k] && k !== 'none');
    const softSelected = Object.keys(answers.softDrinks).filter(k => answers.softDrinks[k] && k !== 'none');
    
    const hasSpirit = spiritsSelected.length > 0;
    const hasWine = wineSelected.length > 0;
    const hasSoft = softSelected.length > 0;
    const hasSparkling = wineSelected.includes('sparkling');
    
    let result = {
        spirits: {},
        wine: {},
        sparkling: 0,
        water: 0,
        soft: {}
    };
    
    // === ВОДА ===
    // Вода нужна всем, даже если не пьют алкоголь
    let waterTotal = Math.ceil(total * baseWater * hoursCoef * seasonCoef * budgetCoef);
    // Если алкоголя нет — воды немного больше
    if (!hasSpirit && !hasWine) {
        waterTotal = Math.ceil(waterTotal * 1.2);
    }
    // Если активно пьют — воды больше
    if (answers.drinkingLevel === 'high') {
        waterTotal = Math.ceil(waterTotal * 1.15);
    }
    if (isSummer) {
        waterTotal = Math.ceil(waterTotal * 1.2);
    }
    result.water = Math.max(2, waterTotal);
    
    // === КРЕПКИЕ НАПИТКИ ===
    if (hasSpirit) {
        let spiritTotal = Math.ceil(total * baseSpirit * hoursCoef * seasonCoef * budgetCoef * drinkingCoef);
        if (isWinter) spiritTotal = Math.ceil(spiritTotal * 1.2);
        if (hours >= 8) spiritTotal = Math.ceil(spiritTotal * 1.3);
        
        // Минимум 1 бутылка, если выбрали крепкий
        spiritTotal = Math.max(1, spiritTotal);
        
        if (spiritsSelected.length === 1) {
            // Если выбран только один вид — вся сумма идёт на него
            result.spirits[spiritsSelected[0]] = spiritTotal;
        } else {
            // Распределяем между выбранными
            const perType = Math.max(1, Math.floor(spiritTotal / spiritsSelected.length));
            spiritsSelected.forEach(name => {
                result.spirits[name] = perType;
            });
            // Корректируем сумму
            let sum = Object.values(result.spirits).reduce((a, b) => a + b, 0);
            if (sum > spiritTotal && Object.keys(result.spirits).length > 1) {
                let diff = sum - spiritTotal;
                for (let key of Object.keys(result.spirits)) {
                    if (diff <= 0) break;
                    if (result.spirits[key] > 1) {
                        const reduce = Math.min(result.spirits[key] - 1, diff);
                        result.spirits[key] -= reduce;
                        diff -= reduce;
                    }
                }
            }
        }
    }
    
    // === ВИНО ===
    if (hasWine) {
        let wineTotal = Math.ceil(total * baseWine * hoursCoef * seasonCoef * budgetCoef * drinkingCoef);
        if (hours >= 8) wineTotal = Math.ceil(wineTotal * 1.2);
        
        // Минимум 1 бутылка, если выбрали вино
        wineTotal = Math.max(1, wineTotal);
        
        const stillWines = wineSelected.filter(w => w !== 'sparkling');
        const hasStillWine = stillWines.length > 0;
        
        // Игристое
        if (hasSparkling) {
            let sparklingTotal = Math.ceil(total * baseSparkling * hoursCoef * seasonCoef * budgetCoef * drinkingCoef);
            if (isSummer) sparklingTotal = Math.ceil(sparklingTotal * 1.3);
            if (hours >= 8) sparklingTotal = Math.ceil(sparklingTotal * 1.2);
            result.sparkling = Math.max(1, sparklingTotal);
        }
        
        // Обычное вино
        if (hasStillWine) {
            let stillTotal = wineTotal;
            // Если есть игристое — отдаём ему часть
            if (hasSparkling) {
                stillTotal = Math.max(1, Math.ceil(wineTotal * 0.6));
            }
            
            if (stillWines.length === 1) {
                result.wine[stillWines[0]] = stillTotal;
            } else {
                const perType = Math.max(1, Math.floor(stillTotal / stillWines.length));
                stillWines.forEach(name => {
                    result.wine[name] = perType;
                });
                let sum = Object.values(result.wine).reduce((a, b) => a + b, 0);
                if (sum > stillTotal && Object.keys(result.wine).length > 1) {
                    let diff = sum - stillTotal;
                    for (let key of Object.keys(result.wine)) {
                        if (diff <= 0) break;
                        if (result.wine[key] > 1) {
                            const reduce = Math.min(result.wine[key] - 1, diff);
                            result.wine[key] -= reduce;
                            diff -= reduce;
                        }
                    }
                }
            }
        }
    }
    
    // === БЕЗАЛКОГОЛЬНЫЕ НАПИТКИ ===
    if (hasSoft) {
        // Сок — всегда минимум 1 бутылка (1л), если выбран
        if (softSelected.includes('juice')) {
            let juiceTotal = Math.ceil(total * baseJuice * hoursCoef * budgetCoef);
            if (isSummer) juiceTotal = Math.ceil(juiceTotal * 1.15);
            if (answers.drinkingLevel === 'high') juiceTotal = Math.ceil(juiceTotal * 1.1);
            result.soft.juice = Math.max(1, juiceTotal);
        }
        
        // Газировка
        if (softSelected.includes('soda')) {
            let sodaTotal = Math.ceil(total * baseSoda * hoursCoef * budgetCoef);
            if (isSummer) sodaTotal = Math.ceil(sodaTotal * 1.3);
            if (answers.drinkingLevel === 'high') sodaTotal = Math.ceil(sodaTotal * 1.1);
            result.soft.soda = Math.max(1, sodaTotal);
        }
        
        // Лимонад
        if (softSelected.includes('lemonade')) {
            let lemonadeTotal = Math.ceil(total * baseLemonade * hoursCoef * budgetCoef);
            if (isSummer) lemonadeTotal = Math.ceil(lemonadeTotal * 1.3);
            result.soft.lemonade = Math.max(1, lemonadeTotal);
        }
        
        // Компот
        if (softSelected.includes('compote')) {
            let compoteTotal = Math.ceil(total * baseCompote * hoursCoef * budgetCoef);
            result.soft.compote = Math.max(1, compoteTotal);
        }
    }
    
    return result;
}

function renderResult() {
    const drinks = calculateDrinks();
    const hours = answers.duration || 4;
    const total = answers.guests.women + answers.guests.men + answers.guests.children || 10;
    
    const spiritsSelected = Object.keys(answers.spirits).filter(k => answers.spirits[k] && k !== 'none');
    const wineSelected = Object.keys(answers.wineType).filter(k => answers.wineType[k] && k !== 'none');
    const softSelected = Object.keys(answers.softDrinks).filter(k => answers.softDrinks[k] && k !== 'none');
    
    const hasSpirit = spiritsSelected.length > 0;
    const hasWine = wineSelected.length > 0;
    const hasSoft = softSelected.length > 0;
    
    const drinkingLabel = { low: 'Мало', moderate: 'Умеренно', high: 'Активно' }[answers.drinkingLevel] || '—';
    
    let html = `<div class="result-container"><h2>ИТОГО:</h2>`;
    
    // КРЕПКИЕ
    html += `<div style="margin-bottom:16px;text-align:left;background:#f8f9fa;border-radius:12px;padding:16px 20px;border:2px solid #e8e8e8;">`;
    html += `<div style="font-weight:700;font-size:1.1rem;margin-bottom:8px;color:#b12535;">КРЕПКИЕ НАПИТКИ</div>`;
    if (hasSpirit && Object.keys(drinks.spirits).length > 0) {
        Object.keys(drinks.spirits).forEach(key => {
            const name = spiritNames[key] || key;
            html += `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;">`;
            html += `<span>${name}</span>`;
            html += `<span style="font-weight:600;">${drinks.spirits[key]} бут. (0.5 л)</span>`;
            html += `</div>`;
        });
    } else {
        html += `<div style="color:#999;">не требуются</div>`;
    }
    html += `</div>`;
    
    // ВИНО
    html += `<div style="margin-bottom:16px;text-align:left;background:#f8f9fa;border-radius:12px;padding:16px 20px;border:2px solid #e8e8e8;">`;
    html += `<div style="font-weight:700;font-size:1.1rem;margin-bottom:8px;color:#b12535;">ВИНО</div>`;
    if (hasWine) {
        if (Object.keys(drinks.wine).length > 0) {
            Object.keys(drinks.wine).forEach(key => {
                const name = wineNames[key] || key;
                html += `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;">`;
                html += `<span>${name}</span>`;
                html += `<span style="font-weight:600;">${drinks.wine[key]} бут. (0.75 л)</span>`;
                html += `</div>`;
            });
        }
        if (drinks.sparkling > 0) {
            html += `<div style="display:flex;justify-content:space-between;padding:4px 0;">`;
            html += `<span>Игристое вино</span>`;
            html += `<span style="font-weight:600;">${drinks.sparkling} бут. (0.75 л)</span>`;
            html += `</div>`;
        }
        if (Object.keys(drinks.wine).length === 0 && drinks.sparkling === 0) {
            html += `<div style="color:#999;">не требуется</div>`;
        }
    } else {
        html += `<div style="color:#999;">не требуется</div>`;
    }
    html += `</div>`;
    
    // БЕЗАЛКОГОЛЬНЫЕ
    html += `<div style="margin-bottom:16px;text-align:left;background:#f8f9fa;border-radius:12px;padding:16px 20px;border:2px solid #e8e8e8;">`;
    html += `<div style="font-weight:700;font-size:1.1rem;margin-bottom:8px;color:#b12535;">БЕЗАЛКОГОЛЬНЫЕ НАПИТКИ</div>`;
    if (hasSoft && Object.keys(drinks.soft).length > 0) {
        Object.keys(drinks.soft).forEach(key => {
            const name = softNames[key] || key;
            const volume = key === 'juice' ? '1 л' : '0.5 л';
            html += `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;">`;
            html += `<span>${name}</span>`;
            html += `<span style="font-weight:600;">${drinks.soft[key]} бут. (${volume})</span>`;
            html += `</div>`;
        });
    } else {
        html += `<div style="color:#999;">не требуются</div>`;
    }
    html += `</div>`;
    
    // ВОДА
    html += `<div style="margin-bottom:16px;text-align:left;background:#f8f9fa;border-radius:12px;padding:16px 20px;border:2px solid #e8e8e8;">`;
    html += `<div style="font-weight:700;font-size:1.1rem;margin-bottom:8px;color:#b12535;">ВОДА</div>`;
    html += `<div style="display:flex;justify-content:space-between;padding:4px 0;">`;
    html += `<span>Вода питьевая</span>`;
    html += `<span style="font-weight:600;">${drinks.water} бут. (0.5 л)</span>`;
    html += `</div>`;
    html += `</div>`;
    
    // ИНФОРМАЦИЯ
    html += `<div style="font-size:0.85rem;color:#666;margin:12px 0 4px;text-align:left;background:#f8f9fa;border-radius:8px;padding:12px 16px;border:1px solid #e8e8e8;">`;
    html += `<div style="display:flex;flex-wrap:wrap;gap:4px 16px;justify-content:center;">`;
    html += `<span><strong>Гости:</strong> ${total} чел.</span>`;
    html += `<span><strong>Пьют:</strong> ${drinkingLabel}</span>`;
    html += `<span><strong>Продолжительность:</strong> ${hours} ч</span>`;
    html += `<span><strong>Сезон:</strong> ${answers.season ? {summer:'Лето',autumn:'Осень',winter:'Зима',spring:'Весна'}[answers.season] : '—'}</span>`;
    html += `<span><strong>Бюджет:</strong> ${answers.budget ? {economy:'Эконом',medium:'Средний',vip:'ВИП'}[answers.budget] : '—'}</span>`;
    html += `</div></div>`;
    
    // ТОЛЬКО КНОПКА "ПЕРЕРАСЧЕТ"
    html += `<div class="result-actions">`;
    html += `<button class="btn-recalc" onclick="resetCalculator()">Перерасчет</button>`;
    html += `</div></div>`;
    
    return html;
}

// Функция saveResult() УДАЛЕНА — больше не нужна

function saveResult() {
    const drinks = calculateDrinks();
    const total = answers.guests.women + answers.guests.men + answers.guests.children || 10;
    const hours = answers.duration || 4;
    const drinkingLabel = { low: 'Мало', moderate: 'Умеренно', high: 'Активно' }[answers.drinkingLevel] || '—';
    
    let msg = `РЕЗУЛЬТАТ РАСЧЁТА\n\n`;
    msg += `Гостей: ${total} чел.\n`;
    msg += `Активность питья: ${drinkingLabel}\n`;
    msg += `Продолжительность: ${hours} часов\n`;
    msg += `Сезон: ${answers.season ? {summer:'Лето',autumn:'Осень',winter:'Зима',spring:'Весна'}[answers.season] : '—'}\n`;
    msg += `Бюджет: ${answers.budget ? {economy:'Эконом',medium:'Средний',vip:'ВИП'}[answers.budget] : '—'}\n\n`;
    
    msg += `--- КРЕПКИЕ НАПИТКИ ---\n`;
    if (Object.keys(drinks.spirits).length > 0) {
        Object.keys(drinks.spirits).forEach(key => {
            msg += `${spiritNames[key] || key}: ${drinks.spirits[key]} бут. (0.5 л)\n`;
        });
    } else {
        msg += `не требуются\n`;
    }
    
    msg += `\n--- ВИНО ---\n`;
    if (Object.keys(drinks.wine).length > 0) {
        Object.keys(drinks.wine).forEach(key => {
            msg += `${wineNames[key] || key}: ${drinks.wine[key]} бут. (0.75 л)\n`;
        });
    }
    if (drinks.sparkling > 0) {
        msg += `Игристое вино: ${drinks.sparkling} бут. (0.75 л)\n`;
    }
    if (Object.keys(drinks.wine).length === 0 && drinks.sparkling === 0) {
        msg += `не требуется\n`;
    }
    
    msg += `\n--- БЕЗАЛКОГОЛЬНЫЕ НАПИТКИ ---\n`;
    if (Object.keys(drinks.soft).length > 0) {
        Object.keys(drinks.soft).forEach(key => {
            const volume = key === 'juice' ? '1 л' : '0.5 л';
            msg += `${softNames[key] || key}: ${drinks.soft[key]} бут. (${volume})\n`;
        });
    } else {
        msg += `не требуются\n`;
    }
    
    msg += `\n--- ВОДА ---\n`;
    msg += `Вода питьевая: ${drinks.water} бут. (0.5 л)\n`;
    
    msg += `\nСпасибо, что воспользовались калькулятором Luding!`;
    alert(msg);
}

// Инициализация при загрузке
window.onload = function() {
    if (sessionStorage.getItem('ageVerified') === 'true') {
        document.getElementById('ageOverlay').classList.add('hidden');
    }
    renderStep();
};