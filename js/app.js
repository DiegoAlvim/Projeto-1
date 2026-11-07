// Taxas de conversão baseadas em 1 USD
const RATES = { USD: 1.0, BRL: 5.50, EUR: 0.92, GBP: 0.77 };

const CURRENCY_SYMBOLS = {
    USD: { symbol: "$", locale: "en-US" },
    BRL: { symbol: "R$", locale: "pt-BR" },
    EUR: { symbol: "€", locale: "de-DE" },
    GBP: { symbol: "£", locale: "en-GB" }
};

const currencyOrder = ["USD", "BRL", "EUR", "GBP"];
let activeCurrencyIndex = 0;

// Variáveis de controle do estado do Carrossel
let carouselInterval = null;
let currentSlideIndex = 0;

// ==========================================
// SELETOR DE TEMAS DINÂMICO
// ==========================================
const themeSelect = document.getElementById('theme-select');
const savedTheme = localStorage.getItem('nomad-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeSelect) themeSelect.value = savedTheme;

if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('nomad-theme', selectedTheme);
    });
}

// ==========================================
// 1. BANCO DE DADOS GLOBAL DE DESTINOS
// ==========================================
const citiesDatabase = {
    newyork: {
        title: "🗽 Nova York, EUA",
        total: 3600,
        internet: "250 Mbps ⚡",
        weather: "14°C 🌤️",
        copilotAdvice: "Diretriz E.V.A.: Conectividade nível Alfa detectada. Custos de habitação críticos na Ilha de Manhattan. Planeje sua carteira financeira antes do pouso.",
        funFact: "Você sabia que Nova York já foi a capital dos Estados Unidos por cinco anos, antes de mudarem para a Filadélfia e depois Washington?",
        mapX: "24%", mapY: "32%", mapZoom: "220%",
        images: [
            "img/ny1.jpg",
            "img/ny2.jpg"
        ]
    },
    bali: {
        title: "🌴 Bali, Indonésia",
        total: 1340,
        internet: "45 Mbps ⚡",
        weather: "28°C ☀️",
        copilotAdvice: "Diretriz E.V.A.: Modo economia ativado. Custos operacionais excelentes. Regiões litorâneas possuem oscilação de sinal de satélite.",
        funFact: "Curiosidade sobre Bali: O calendario tradicional balinês tem apenas duzentos e dez dias no ano inteiro. É um ciclo cultural fascinante!",
        mapX: "76%", mapY: "58%", mapZoom: "240%",
        images: [
            "img/bali1.jpg",
            "img/bali2.jpg"
        ]
    },
    medellin: {
        title: "🚡 Medellín, Colômbia",
        total: 1150,
        internet: "80 Mbps ⚡",
        weather: "22°C 🌦️",
        copilotAdvice: "Diretriz E.V.A.: Zona amigável para nômades. Bairro El Poblado oferece o ecossistema perfeito para reuniões e sinal estável.",
        funFact: "Você sabia? Medellín é conhecida internacionalmente como a Cidade da Eterna Primavera por causa do seu clima ameno e agradável o ano todo.",
        mapX: "28%", mapY: "48%", mapZoom: "220%",
        images: [
            "https://unsplash.com",
            "https://unsplash.com"
        ]
    },
    florianopolis: {
        title: "🏄‍♂️ Florianópolis, Brasil",
        total: 1080,
        internet: "120 Mbps ⚡",
        weather: "25°C ☀️",
        copilotAdvice: "Diretriz E.V.A.: Hub costeiro detectado. Excelente infraestrutura de fibra óptica na região norte da ilha. Custos moderados.",
        funFact: "Fato sobre Florianópolis: A ilha da magia abriga exatamente quarenta e duas praias oficiais, combinando polo de tecnologia e natureza.",
        mapX: "34%", mapY: "62%", mapZoom: "200%",
        images: [
            "img/flo1.jpg",
            "img/flo2.jpg"
        ]
    },
    lisboa: {
        title: "🟨 Lisboa, Portugal",
        total: 2100,
        internet: "200 Mbps ⚡",
        weather: "19°C ☀️",
        copilotAdvice: "Diretriz E.V.A.: Scanner imobiliário indica alta densidade de custos. Comunidade tecnológica activa e culinária de alta classificação.",
        funFact: "Curiosidade sobre Lisboa: É uma das cidades mais antigas do mundo, superando capitais históricas europeias como Roma, Paris e Londres por séculos.",
        mapX: "46%", mapY: "35%", mapZoom: "230%",
        images: [
            "https://unsplash.com",
            "https://unsplash.com"
        ]
    },
    bangkok: {
        title: "🛕 Bangkok, Tailândia",
        total: 1250,
        internet: "150 Mbps ⚡",
        weather: "31°C 🔥",
        copilotAdvice: "Diretriz E.V.A.: Custos de nutrição extremamente baixos. Condomínios modernos oferecem excelente infraestrutura de escritórios internos.",
        funFact: "Sabia dessa? O nome cerimonial completo de Bangkok é considerado o nome de lugar mais longo do mundo, contendo cento e sexta e oito letras.",
        mapX: "72%", mapY: "44%", mapZoom: "220%",
        images: [
            "https://unsplash.com",
            "https://unsplash.com"
        ]
    },
    capetown: {
        title: "⛰️ Cidade do Cabo, África do Sul",
        total: 1450,
        internet: "75 Mbps ⚡",
        weather: "21°C 💨",
        copilotAdvice: "Diretriz E.V.A.: Alinhamento de fuso horário ideal para contratos corporativos na Europa. Paisagens geográficas de alta qualidade.",
        funFact: "Curiosidade: A Montanha da Mesa, cartão-postal da cidade, é uma das estruturas geológicas mais antigas do planeta terra, com trezentos milhões de anos.",
        mapX: "50%", mapY: "60%", mapZoom: "210%",
        images: [
            "https://unsplash.com",
            "https://unsplash.com"
        ]
    },
    tulum: {
        title: "🌮 Tulum, México",
        total: 1950,
        internet: "50 Mbps ⚡",
        weather: "27°C 🏖️",
        copilotAdvice: "Diretriz E.V.A.: Estilo de vida focado em bem-estar. Recomendo validar redundância de dados LTE antes de alugar lofts isolados.",
        funFact: "Fato histórico: Ao contrário de outras cidades maias, Tulum foi construída diretamente na costa e cercada por muralhas defensivas contra invasões.",
        mapX: "24%", mapY: "44%", mapZoom: "240%",
        images: [
            "https://unsplash.com",
            "https://unsplash.com"
        ]
    }
};

const genericExpenses = [
    { item: "🏢 Acomodação Privada (Mês)", factor: 0.60 },
    { item: "🏢 Espaço de Trabalho / Coworking", factor: 0.10 },
    { item: "🚗 Logística e Transporte Local", costFixed: 80 },
    { item: "☕ Café da Manhã e Cafeterias", factor: 0.06 },
    { item: "🍲 Alimentação Geral", factor: 0.24 }
];

// ==========================================
// 2. FUNÇÃO DE VOZ SILENCIADA (ÁUDIO REMOVIDO 🔕)
// ==========================================
function speakText(text) {
    window.speechSynthesis.cancel(); 
}

const citiesContainer = document.getElementById('cities-container');
const bubbleText = document.getElementById('assistant-bubble-text');

function formatValue(valueUSD) {
    const currentCurrency = currencyOrder[activeCurrencyIndex];
    const rate = RATES[currentCurrency];
    const converted = valueUSD * rate;
    const config = CURRENCY_SYMBOLS[currentCurrency];
    return converted.toLocaleString(config.locale, { style: 'currency', currency: currentCurrency, maximumFractionDigits: 0 });
}

function renderCards() {
    if (!citiesContainer) return;
    citiesContainer.innerHTML = "";
    Object.keys(citiesDatabase).forEach(key => {
        const city = citiesDatabase[key];
        const cardDiv = document.createElement('article');
        cardDiv.classList.add('card');
        cardDiv.setAttribute('data-city', key);
        cardDiv.innerHTML = `
            <div class="card-header"><h3>${city.title}</h3></div>
            <div class="card-body">
                <p><strong>Custo:</strong> <span class="price-convert" data-value="${city.total}">${formatValue(city.total)}</span> /mês</p>
                <p><strong>Internet:</strong> ${city.internet}</p>
                <p><strong>Clima:</strong> ${city.weather}</p>
            </div>
            <div class="card-footer"><button class="btn-details">Ver Detalhes</button></div>
        `;
        
        cardDiv.addEventListener('mouseenter', () => {
            if (bubbleText) bubbleText.textContent = city.funFact;
            speakText(city.funFact);
        });

        cardDiv.querySelector('.btn-details').addEventListener('click', () => openModal(key));
        citiesContainer.appendChild(cardDiv);
    });
}
renderCards();

// ==========================================
// 3. LÓGICA DO MODAL + CARROSSEL DINÂMICO
// ==========================================
const modal = document.getElementById('cost-modal');
const modalTitle = document.getElementById('modal-title');
const modalTotalValue = document.getElementById('modal-total-value');
const tableData = document.getElementById('table-data');

const closeModalBtn = document.querySelector('.close-modal');
const copilotText = document.getElementById('copilot-text');
const carouselSlides = document.getElementById('carousel-slides');

function openModal(cityKey) {
    const cityData = citiesDatabase[cityKey];
    if (cityData && modal) {
        if (modalTitle) modalTitle.textContent = cityData.title;
        if (modalTotalValue) {
            modalTotalValue.setAttribute('data-value', cityData.total);
            modalTotalValue.textContent = formatValue(cityData.total);
        }
        if (copilotText) copilotText.textContent = cityData.copilotAdvice;
        
        // Mapeamento de câmera corrigido com crases
        document.body.style.backgroundPosition = `${cityData.mapX} ${cityData.mapY}`;
        document.body.style.backgroundSize = cityData.mapZoom;
        
        if (carouselSlides) {
            carouselSlides.innerHTML = "";
            cityData.images.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = cityData.title;
                carouselSlides.appendChild(img);
            });
        }
        
        currentSlideIndex = 0;
        updateCarouselPosition();
        
        clearInterval(carouselInterval);
        carouselInterval = setInterval(() => {
            changeSlide(1);
        }, 3000);
        
        if (tableData) {
            tableData.innerHTML = "";
            genericExpenses.forEach(exp => {
                const tr = document.createElement('tr');
                let costVal = exp.costFixed ? exp.costFixed : Math.round(cityData.total * exp.factor);
                tr.innerHTML = `<td>${exp.item}</td><td><strong class="price-convert" data-value="${costVal}">${formatValue(costVal)}</strong></td>`;
                tableData.appendChild(tr);
            });
        }
        modal.style.display = "block";
    }
}

function updateCarouselPosition() {
    if (carouselSlides) carouselSlides.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
}

function changeSlide(direction) {
    if (!carouselSlides) return;
    const totalSlides = carouselSlides.children.length;
    if (totalSlides === 0) return;
    
    currentSlideIndex = (currentSlideIndex + direction + totalSlides) % totalSlides;
    updateCarouselPosition();
}

const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        clearInterval(carouselInterval);
        changeSlide(-1);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        clearInterval(carouselInterval);
        changeSlide(1);
    });
}

function resetMap() {
    if (modal) modal.style.display = "none";
    document.body.style.backgroundPosition = "center 30%";
    document.body.style.backgroundSize = "130% auto";
    window.speechSynthesis.cancel();
    clearInterval(carouselInterval);
}

if (closeModalBtn) closeModalBtn.addEventListener('click', resetMap);
window.addEventListener('click', (e) => { if (e.target === modal) resetMap(); });

// ==========================================
// 4. BARRA DE BUSCA EM TEMPO REAL
// ==========================================
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

function filterCities() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    document.querySelectorAll('.grid-cities .card').forEach(card => {
        const cityName = card.querySelector('h3').textContent.toLowerCase();
        if (cityName.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

if (searchInput) searchInput.addEventListener('input', filterCities);

// ==========================================
// 5. EVENTO DO JATO NEON HORIZONTAL
// ==========================================
const plane = document.getElementById('plane-animation');

function triggerPlaneAnimation() {
    filterCities();
    if (plane) {
        plane.style.display = "block";
        plane.classList.add('fly');
        setTimeout(() => { plane.classList.remove('fly'); }, 3500);
    }
}

if (searchButton) searchButton.addEventListener('click', triggerPlaneAnimation);
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') triggerPlaneAnimation();
    });
}

// ==========================================
// 6. MULTI-CONVERSOR DE MOEDAS EM CARROSSEL
// ==========================================
const currencyToggleBtn = document.getElementById('currency-toggle');

if (currencyToggleBtn) {
    currencyToggleBtn.addEventListener('click', () => {
        activeCurrencyIndex = (activeCurrencyIndex + 1) % currencyOrder.length;
        const currentCurrency = currencyOrder[activeCurrencyIndex];
        
        // Conversor de moedas em crases
        currencyToggleBtn.textContent = `💵 Moeda: ${currentCurrency}`;
        
        document.querySelectorAll('.price-convert').forEach(element => {
            const baseValueUSD = parseFloat(element.getAttribute('data-value'));
            element.textContent = formatValue(baseValueUSD);
            element.classList.add('shimmer-effect');
            setTimeout(() => element.classList.remove('shimmer-effect'), 400);
        });
    });
}

// ==========================================
// 7. INTERAÇÃO DE CLIQUE NA ROBOZINHA DA HOME
// ==========================================
const mainAssistant = document.getElementById('main-assistant');
if (mainAssistant) {
    mainAssistant.addEventListener('click', () => {
        const greeting = "Pronta para nova busca tática, Comandante. Selecione uma das cidades da tela.";
        if (bubbleText) bubbleText.textContent = greeting;
        speakText(greeting);
    });
}

// ==========================================
// 8. LÓGICA DE INTERAÇÃO DO ACCORDION (WINDOWS 11 STYLE)
// ==========================================
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const currentItem = header.parentElement;
        const content = currentItem.querySelector('.accordion-content');
        const isActive = currentItem.classList.contains('active');
        
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.accordion-content').style.maxHeight = null;
        });
        
        if (!isActive) {
            currentItem.classList.add('active');
            content.style.maxHeight = content.scrollHeight + "px";
            
            const headerText = header.querySelector('.header-title').textContent;
            
            // Texto do Accordion corrigido com crases
            const notification = `Acessando o banco de dados sobre: ${headerText}.`;
            if (bubbleText) bubbleText.textContent = notification;
            speakText(notification);
        } else {
            window.speechSynthesis.cancel();
        }
    });
});
