/* =========================================================
   TRADEVAULT — lógica do site
   ========================================================= */

/* ---- Lista dos vídeos que estão na pasta do projeto ---- */
const VIDEO_FILES = [
  "2026_10_18_22_24_03.mp4",
  "2026_10_14_22_22_38.mp4",
  "2026_10_13_22_09_25.mp4",
  "2026_10_13_22_06_45.mp4",
  "2026_10_13_21_53_52.mp4",
  "2026_10_11_19_09_58.mp4",
  "2026_10_04_22_16_59.mp4",
  "2026_10_04_22_06_37.mp4",
  "2026_10_04_22_05_10.mp4",
  "2026_10_04_22_03_34.mp4",
  "2026_08_31_22_44_02.mp4",
  "2026_07_14_22_24_26.mp4",
];

const CATEGORIES = ["Análises", "Estratégias", "Resultados", "Sinais"];

const TITLES = [
  "Abertura do dia: leitura do gráfico e zonas de interesse",
  "Setup de rompimento com confirmação de volume",
  "Gestão de risco: stop, alvo e tamanho da posição",
  "Entrada na tendência: pullback no suporte",
  "Revisão das operações da semana",
  "Operação ao vivo no WINFUT — execução completa",
  "Suporte e resistência: como mapear os níveis",
  "Escala de saída parcial no lucro",
  "Falso rompimento: como evitar a armadilha",
  "Sessão americana: volatilidade e oportunidades",
  "Backtest do setup em 30 dias",
  "Psicologia: disciplina depois do stop",
  "Média móvel + RSI: filtro de tendência",
  "Operação vencedora com risco 1:3",
  "Como ler o fluxo de ordens no gráfico",
  "Fechamento do mês: resultado consolidado",
];

/* Monta o array de vídeos (data vira título complementar) */
const videos = VIDEO_FILES.map((file, i) => {
  const m = file.match(/(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})_(\d{2})/);
  const date = m ? `${m[3]}/${m[2]}/${m[1]}` : "—";
  const time = m ? `${m[4]}:${m[5]}` : "";
  return {
    id: i,
    src: file,
    title: TITLES[i % TITLES.length],
    category: CATEGORIES[i % CATEGORIES.length],
    date,
    time,
  };
});

/* ---- Vídeo externo (YouTube) — aparece primeiro na galeria ---- */
videos.unshift({
  id: videos.length,
  youtube: "p5skl4xAVtU",
  src: "https://www.youtube.com/watch?v=p5skl4xAVtU",
  title: "Como estratégias de abertura",
  category: "Estratégias",
  date: "27/10/2026",
  time: "",
  abertura: true, // também aparece na seção "Abertura de mercado"
});

videos.unshift({
  id: videos.length,
  youtube: "axDjDN6sYq4",
  src: "https://www.youtube.com/watch?v=axDjDN6sYq4",
  title: "Tutorial da Cortex",
  category: "Estratégias",
  date: "25/10/2026",
  time: "",
});

/* ---- Seção "Abertura de mercado" (vídeo em destaque fora da grade) ---- */
videos.unshift({
  id: videos.length,
  youtube: "XZa7J-jf58M",
  src: "https://www.youtube.com/watch?v=XZa7J-jf58M",
  title: "Abertura de mercado",
  category: "Abertura de mercado",
  date: "27/10/2026",
  time: "",
  section: true,
});

videos.unshift({
  id: videos.length,
  youtube: "RmmeWjAplGw",
  src: "https://www.youtube.com/watch?v=RmmeWjAplGw&t=933s",
  title: "TRADE NA ABERTURA Ficou Extremamente SIMPLES Depois que Aprendi Isso!",
  category: "Abertura de mercado",
  date: "05/11/2026",
  time: "",
  start: 933, // começa em 15:33 (t=933s)
  section: true,
});

/* ---- Seção "Artificial" (vídeo fora da grade principal) ---- */
videos.unshift({
  id: videos.length,
  youtube: "P5vVaooEgcI",
  src: "https://www.youtube.com/watch?v=P5vVaooEgcI",
  title: "Claude Code 100% Gratuito em 5 Minutos (O que 95% Não Sabem)",
  category: "Artificial",
  date: "27/10/2026",
  time: "",
  artificial: true,
});

/* ---- Elementos ---- */
const grid = document.getElementById("videoGrid");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("search");
const filtersBox = document.getElementById("filters");

const modal = document.getElementById("modal");
const player = document.getElementById("player");
const ytPlayer = document.getElementById("ytPlayer");
const modalTitle = document.getElementById("modalTitle");
const modalCat = document.getElementById("modalCat");
const modalMeta = document.getElementById("modalMeta");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let activeFilter = "Todos";
let visible = [...videos];
let currentId = null;

/* =========================================================
   GRID
   ========================================================= */
function formatDuration(sec) {
  if (!isFinite(sec)) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function renderGrid() {
  const term = searchInput.value.trim().toLowerCase();

  visible = videos.filter((v) => {
    if (v.section || v.abertura || v.artificial) return false; // fica só na sua seção
    const okCat = activeFilter === "Todos" || v.category === activeFilter;
    const okTerm =
      !term ||
      v.title.toLowerCase().includes(term) ||
      v.category.toLowerCase().includes(term) ||
      v.date.includes(term);
    return okCat && okTerm;
  });

  grid.innerHTML = "";
  visible.forEach((v, i) => grid.appendChild(createCard(v, i)));
  empty.hidden = visible.length > 0;
}

/* ---- Card de vídeo (usado na grade principal e na seção Abertura) ---- */
function createCard(v, i) {
  const card = document.createElement("article");
  card.className = "card";
  card.style.animationDelay = `${i * 40}ms`;
  const thumbHTML = v.youtube
    ? `<img src="https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg" alt="" loading="lazy" />`
    : `<video src="${v.src}" preload="metadata" muted playsinline></video>`;

  const catCls = v.category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w]+/g, "-");

  card.innerHTML = `
      <div class="thumb">
        ${thumbHTML}
        <span class="badge-cat c-${catCls}">${v.category}</span>
        <div class="overlay"><span class="play-ico">▶</span></div>
        ${v.youtube ? "" : `<span class="badge-time" data-time>--:--</span>`}
      </div>
      <div class="card-body">
        <h3>${v.title}</h3>
        <div class="card-meta">
          <span><i class="dot"></i>${[v.date, v.time].filter(Boolean).join(" · ")}</span>
          <span>Assistir ›</span>
        </div>
      </div>`;

  const vid = card.querySelector("video");
  const timeBadge = card.querySelector("[data-time]");

  if (vid && timeBadge) {
    // duração real do arquivo
    vid.addEventListener("loadedmetadata", () => {
      timeBadge.textContent = formatDuration(vid.duration);
    });
  }

  if (vid) {
    // preview mudo ao passar o mouse (desktop)
    card.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover)").matches) {
        vid.play().catch(() => {});
      }
    });
    card.addEventListener("mouseleave", () => {
      vid.pause();
      vid.currentTime = 0;
    });
  }

  card.addEventListener("click", () => openPlayer(v.id));
  return card;
}

/* ---- Seção "Abertura de mercado" ---- */
function renderAbertura() {
  const box = document.getElementById("aberturaGrid");
  if (!box) return;
  box.innerHTML = "";
  videos
    .filter((v) => v.section || v.abertura)
    .forEach((v, i) => box.appendChild(createCard(v, i)));
}

/* ---- Seção "Artificial" ---- */
function renderArtificial() {
  const box = document.getElementById("artificialGrid");
  if (!box) return;
  const list = videos.filter((v) => v.artificial);
  box.innerHTML = "";
  list.forEach((v, i) => box.appendChild(createCard(v, i)));
  const emptyEl = document.getElementById("artificialEmpty");
  if (emptyEl) emptyEl.hidden = list.length > 0;
}

/* ---- Filtros ---- */
function renderFilters() {
  const cats = ["Todos", ...CATEGORIES];
  filtersBox.innerHTML = "";
  cats.forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip-btn" + (c === activeFilter ? " active" : "");
    b.textContent = c;
    b.addEventListener("click", () => {
      activeFilter = c;
      renderFilters();
      renderGrid();
    });
    filtersBox.appendChild(b);
  });
}

searchInput.addEventListener("input", renderGrid);

/* =========================================================
   PLAYER MODAL
   ========================================================= */
function openPlayer(id) {
  const v = videos.find((x) => x.id === id);
  if (!v) return;
  currentId = id;

  // pausa qualquer preview da grade
  grid.querySelectorAll("video").forEach((el) => {
    el.pause();
    el.currentTime = 0;
  });

  modalTitle.textContent = v.title;
  modalCat.textContent = v.category;
  modalMeta.textContent = [v.date, v.time, v.src].filter(Boolean).join(" · ");

  if (v.youtube) {
    // player do YouTube
    player.pause();
    player.removeAttribute("src");
    player.load();
    player.hidden = true;
    ytPlayer.hidden = false;
    // "start" opcional: abre o vídeo já no minuto marcado (ex.: t=933s)
    const startParam = v.start ? `&start=${v.start}` : "";
    ytPlayer.src = `https://www.youtube.com/embed/${v.youtube}?autoplay=1&rel=0${startParam}`;
  } else {
    // player local (arquivo .mp4)
    ytPlayer.removeAttribute("src");
    ytPlayer.hidden = true;
    player.hidden = false;
    player.src = v.src;
    player.play().catch(() => {});
  }

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePlayer() {
  player.pause();
  player.removeAttribute("src");
  player.load();
  player.hidden = false;
  ytPlayer.removeAttribute("src");
  ytPlayer.hidden = true;
  modal.classList.remove("open");
  document.body.style.overflow = "";
  currentId = null;
}

function step(dir) {
  if (currentId === null) return;
  // navega na grade atual; se o vídeo não está nela (seção própria), usa a lista geral
  const list = visible.some((v) => v.id === currentId) ? visible : videos;
  const idx = list.findIndex((v) => v.id === currentId);
  if (idx === -1) return;
  const next = (idx + dir + list.length) % list.length;
  openPlayer(list[next].id);
}

modal.querySelectorAll("[data-close]").forEach((el) =>
  el.addEventListener("click", closePlayer)
);
prevBtn.addEventListener("click", () => step(-1));
nextBtn.addEventListener("click", () => step(1));

document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("open")) return;
  if (e.key === "Escape") closePlayer();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});

/* =========================================================
   HERO — candles, ticker e estatísticas
   ========================================================= */
function buildCandles() {
  const box = document.getElementById("candles");
  if (!box) return;
  let price = 40;
  let html = "";
  for (let i = 0; i < 22; i++) {
    const move = (Math.random() - 0.45) * 34;
    const body = Math.max(16, Math.min(74, Math.abs(move) + 20));
    const green = move >= 0;
    price = Math.max(4, Math.min(40, price + move * 0.6));
    const wick = 8 + Math.random() * 26;
    const color = green ? "var(--green)" : "var(--red)";
    const glow = green ? "rgba(0,229,138,.45)" : "rgba(255,77,109,.45)";
    html += `
      <span class="candle" style="margin-bottom:${price}px;animation-delay:${i * 45}ms">
        <i class="wick" style="height:${wick}px;background:${color}"></i>
        <i style="height:${body}px;background:${color};box-shadow:0 0 12px ${glow}"></i>
      </span>`;
  }
  box.innerHTML = html;
}

function buildTicker() {
  const track = document.getElementById("tickerTrack");
  if (!track) return;
  const items = [
    ["WINFUT", "+2,48%", true], ["WDOFUT", "-0,32%", false],
    ["PETR4", "+1,14%", true], ["VALE3", "-0,87%", false],
    ["IBOV", "+0,92%", true], ["BTC/USD", "+3,41%", true],
    ["USD/BRL", "-0,15%", false], ["ITUB4", "+0,58%", true],
  ];
  const line = items
    .map(([n, p, up]) => `<span><b>${n}</b> <i class="${up ? "up" : "down"}" style="font-style:normal">${up ? "▲" : "▼"} ${p}</i></span>`)
    .join("");
  track.innerHTML = line + line; // duplicado p/ loop contínuo
}

function animateStats() {
  const total = videos.length;
  const win = 68 + (total % 7); // win rate fictício exibido
  const hours = Math.round(total * 0.42);

  const countTo = (el, target, suffix, decimals = 0) => {
    if (!el) return;
    let cur = 0;
    const stepTime = 40;
    const inc = target / (1000 / stepTime);
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur.toFixed(decimals) + suffix;
    }, stepTime);
  };

  countTo(document.getElementById("statVideos"), total, "");
  countTo(document.getElementById("statWin"), win, "%");
  countTo(document.getElementById("statHours"), hours, "h");
}

/* =========================================================
   INDICADORES
   ========================================================= */
const INDICADORES = [
  { name: "Finviz — screener e mapa de mercado (EUA)", url: "https://finviz.com/", type: "Finviz", icon: "🔍" },
  { name: "Next Candle Predictor", url: "https://br.tradingview.com/", type: "TradingView", icon: "🔮" },
  { name: "Breakout Probability (Expo)", url: "https://br.tradingview.com/", type: "TradingView", icon: "📈" },
  { name: "Technical Ratings", url: "https://br.tradingview.com/", type: "TradingView", icon: "⭐" },
  { name: "SuperTrend AI (Clustering) [LuxAlgo]", url: "https://br.tradingview.com/", type: "TradingView", icon: "🤖" },
  { name: "Perfil de Volume Range fixo", url: "https://www.youtube.com/watch?v=uoyn3NDEuis", type: "YouTube", icon: "📊" },
  { name: "Indicador Win 1", url: "#", type: "Em breve", icon: "🎯" },
  { name: "Super Trend Aprimorado — indicador de tendência", url: "https://www.youtube.com/watch?v=rlXKvp_O-3g", type: "YouTube", icon: "🧭" },
  { name: "Análise de Indicador — 6 indicadores", url: "https://www.youtube.com/watch?v=Ed5DJc2bGSI", type: "YouTube", icon: "🧪" },
  { name: "Stop / ATR", url: "#", type: "Em breve", icon: "🛑" },
  { name: "Simple Moving Average", url: "#", type: "Em breve", icon: "〰️" },
  { name: "Vender Sites", url: "https://www.youtube.com/watch?v=6-fLPgv2IQg", type: "YouTube", icon: "🌐" },
];

const IND_FILTERS = ["Todos", "TradingView", "YouTube", "Finviz", "Em breve"];
const indGrid = document.getElementById("indGrid");
const indEmpty = document.getElementById("indEmpty");
const indSearch = document.getElementById("indSearch");
const indFiltersBox = document.getElementById("indFilters");

let indFilter = "Todos";

const slug = (s) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function renderIndFilters() {
  indFiltersBox.innerHTML = "";
  IND_FILTERS.forEach((f) => {
    const b = document.createElement("button");
    b.className = "chip-btn" + (f === indFilter ? " active" : "");
    b.textContent = f;
    b.addEventListener("click", () => {
      indFilter = f;
      renderIndFilters();
      renderIndicators();
    });
    indFiltersBox.appendChild(b);
  });
}

function renderIndicators() {
  const term = indSearch.value.trim().toLowerCase();
  const list = INDICADORES.filter((i) => {
    const okType = indFilter === "Todos" || i.type === indFilter;
    const okTerm = !term || slug(i.name).includes(term) || slug(i.type).includes(term);
    return okType && okTerm;
  });

  indGrid.innerHTML = "";

  list.forEach((ind, idx) => {
    const hasLink = ind.url && ind.url !== "#";
    const tagCls =
      ind.type === "TradingView" ? "t-tv" :
      ind.type === "YouTube" ? "t-yt" :
      ind.type === "Finviz" ? "t-fv" : "t-soon";
    const el = document.createElement(hasLink ? "a" : "div");
    el.className = "ind-card" + (hasLink ? "" : " disabled");
    el.style.animationDelay = `${idx * 40}ms`;
    if (hasLink) {
      el.href = ind.url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
    el.innerHTML = `
      <span class="ind-ico">${ind.icon}</span>
      <span class="ind-body">
        <h3>${ind.name}</h3>
        <span class="ind-meta">
          <span class="tag ${tagCls}">${ind.type}</span>
          ${hasLink ? "abrir ↗" : "link em breve"}
        </span>
      </span>
      <span class="ind-go">${hasLink ? "↗" : "—"}</span>`;
    indGrid.appendChild(el);
  });

  indEmpty.hidden = list.length > 0;
}

indSearch.addEventListener("input", renderIndicators);

/* Destaque do item do menu conforme a seção visível */
function initNavSpy() {
  const links = [...document.querySelectorAll(".nav-link")].filter((a) =>
    a.getAttribute("href").startsWith("#")
  );
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          (map.get(e.target.id) || links[0]).classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  ["videos", "estrategias", "indicadores", "acoes"].forEach((id) => {
    const sec = document.getElementById(id);
    if (sec) obs.observe(sec);
  });
}

/* =========================================================
   ESTRATÉGIAS — vídeo em destaque (player embutido)
   ========================================================= */
const FEATURE_YT = "h9GUwGJ5UYo";

function playFeature() {
  const media = document.getElementById("featureMedia");
  if (!media || media.querySelector("iframe")) return;
  media.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${FEATURE_YT}?autoplay=1&rel=0"
      title="Player YouTube"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
    ></iframe>`;
}

function initFeature() {
  const media = document.getElementById("featureMedia");
  const playBtn = document.getElementById("featurePlay");
  if (media) media.addEventListener("click", playFeature);
  if (playBtn) playBtn.addEventListener("click", playFeature);
}

/* =========================================================
   AÇÕES DA B3  (ticker + empresa)
   ========================================================= */
const ACOES_RAW = `
AALR3 Alliar
ABCB4 ABC Brasil
ABEV3 Ambev
AERI3 Aeris
AFLT3 Afluente T
AGRO3 BrasilAgro
AGXY3 AgroGalaxy
AHEB3 SPTuris
AHEB5 SPTuris
AHEB6 SPTuris
ALLD3 Allied
ALOS3 Allos
ALPA3 Alpargatas
ALPA4 Alpargatas
ALPK3 Estapar
ALUP11 Alupar
ALUP3 Alupar
ALUP4 Alupar
AMAR3 Marisa
AMBP3 Ambipar
AMER3 Americanas
AMOB3 Automob
ANIM3 Ânima
ARML3 Armac
ARND3 Arandu
ASAI3 Assaí
ATED3 Atom Educação
AUAU3 Petz Cobasi
AURE3 Auren
AVLL3 Alphaville
AXIA3 Axia Energia
AXIA5 Axia Energia
AXIA6 Axia Energia
AXIA7 Axia Energia
AZEV3 Azevedo e Travassos
AZEV4 Azevedo e Travassos
AZTE3 AZT Energia
AZUL3 Azul
AZUL53 Azul
AZZA3 Azzas 2154
B1003 B100
B3SA3 B3
BALM3 Baumer
BALM4 Baumer
BAUH4 Excelsior Alimentos
BAZA3 Banco da Amazônia
BBAS3 Banco do Brasil
BBDC3 Bradesco
BBDC4 Bradesco
BBSE3 BB Seguridade
BDLL3 Bardella
BDLL4 Bardella
BEEF3 Minerva Foods
BEES3 Banestes
BEES4 Banestes
BGIP3 Banese
BGIP4 Banese
BHIA3 Casas Bahia
BIED3 Bioma Educação
BIOM3 Biomm
BLAU3 Blau Farmacêutica
BMEB3 Mercantil do Brasil
BMEB4 Mercantil do Brasil
BMGB4 BMG
BMIN3 Mercantil Investimentos
BMIN4 Mercantil Investimentos
BMKS3 Bicicletas Monark
BMOB3 Bemobi
BNBR3 Banco do Nordeste
BOBR4 Bombril
BPAC11 BTG Pactual
BPAC3 BTG Pactual
BPAC5 BTG Pactual
BPAR3 Banpará
BRAP3 Bradespar
BRAP4 Bradespar
BRAV3 Brava Energia
BRBI11 BR Partners
BRKM3 Braskem
BRKM5 Braskem
BRKM6 Braskem
BRSR3 Banrisul
BRSR5 Banrisul
BRSR6 Banrisul
BRST3 Brisanet
BSLI3 BRB Banco
BSLI4 BRB Banco
CALI3 Construtora Lindenberg
CAMB3 Cambuci
CAML3 Camil
CASH3 Méliuz
CASN3 Casan
CBAV3 CBA
CBEE3 Ampla Energia
CCTY3 RDVC City
CEAB3 C&A
CEBR3 CEB
CEBR5 CEB
CEBR6 CEB
CEDO3 Cedro
CEDO4 Cedro
CEEB3 Coelba
CEEB5 Coelba
CEED3 CEEE-D
CEED4 CEEE-D
CEGR3 CEG
CGAS3 Comgás
CGAS5 Comgás
CGRA3 Grazziotin
CGRA4 Grazziotin
CLSC3 Celesc
CLSC4 Celesc
CMIG3 Cemig
CMIG4 Cemig
CMIN3 CSN Mineração
COCE3 Coelce
COCE5 Coelce
COGN3 Cogna
CPFE3 CPFL Energia
CPLE11 Copel
CPLE3 Copel
CPLE5 Copel
CPLE6 Copel
CRPG3 Cristal Pigmentos
CRPG5 Cristal Pigmentos
CRPG6 Cristal Pigmentos
CSAN3 Cosan
CSED3 Cruzeiro do Sul Educacional
CSMG3 Copasa
CSNA3 CSN
CSUD3 CSU Digital
CTAX3 Contax
CTKA3 Karsten
CTKA4 Karsten
CTSA3 Santanense
CTSA4 Santanense
CURY3 Cury
CVCB3 CVC
CXSE3 Caixa Seguridade
CYRE3 Cyrela
CYRE4 Cyrela
DASA3 Dasa
DESK3 Desktop
DEXP3 Dexxos
DEXP4 Dexxos
DIRR3 Direcional
DMVF3 D1000 Farma
DOHL3 Dohler
DOHL4 Dohler
DOTZ3 Dotz
DTCY3 DTCOM
DXCO3 Dexco
EALT3 Electro Aço Altona
EALT4 Electro Aço Altona
ECOR3 EcoRodovias
EGGY3 Granja Faria
EGIE3 Engie Brasil
EKTR3 Elektro
EKTR4 Elektro
EMAE3 EMAE
EMAE4 EMAE
EMBJ3 Embraer
ENEV3 Eneva
ENGI11 Energisa
ENGI3 Energisa
ENGI4 Energisa
ENJU3 Enjoei
ENMT3 Energisa MT
ENMT4 Energisa MT
EPAR3 Embpar
EQMA3B Equatorial Maranhão
EQPA3 Equatorial Pará
EQPA5 Equatorial Pará
EQPA6 Equatorial Pará
EQPA7 Equatorial Pará
EQTL3 Equatorial
ESPA3 Espaço Laser
ESTR3 Estrela
ESTR4 Estrela
ETER3 Eternit
EUCA3 Eucatex
EUCA4 Eucatex
EVEN3 Even
EZTC3 EZTec
FESA3 Ferbasa
FESA4 Ferbasa
FHER3 Fertilizantes Heringer
FICT3 Fictor Alimentos
FIEI3 FICA
FIGE3 Investimentos Bemge
FIQE3 Unifique
FLRY3 Fleury
FRAS3 Frasle
FRIO3 Metalfrio
GEPA3 Paranapanema Energia
GEPA4 Paranapanema Energia
GFSA3 Gafisa
GGBR3 Gerdau
GGBR4 Gerdau
GGPS3 GPS
GMAT3 Grupo Mateus
GOAU3 Metalúrgica Gerdau
GOAU4 Metalúrgica Gerdau
GPAR3 Celgpar
GRND3 Grendene
GSHP3 General Shopping
HAGA3 Haga
HAGA4 Haga
HAPV3 Hapvida
HBOR3 Helbor
HBRE3 HBR Realty
HBSA3 Hidrovias do Brasil
HBTS5 Habitasul
HETA3 Hércules
HETA4 Hércules
HOOT4 Hotéis Othon
HYPE3 Hypera
IFCM3 Infracommerce
IGTI11 Iguatemi
IGTI3 Iguatemi
IGTI4 Iguatemi
INEP3 Inepar
INEP4 Inepar
INTB3 Intelbras
IRBR3 IRB Brasil RE
ISAE3 ISA Energia
ISAE4 ISA Energia
ITSA3 Itaúsa
ITSA4 Itaúsa
ITUB3 Itaú Unibanco
ITUB4 Itaú Unibanco
JALL3 Jalles Machado
JFEN3 João Fortes
JHSF3 JHSF
JOPA3 Josapar
JOPA4 Josapar
JSLG3 JSL
KEPL3 Kepler Weber
KLBN11 Klabin
KLBN3 Klabin
KLBN4 Klabin
LAND3 Terra Santa
LAVV3 Lavvi
LEVE3 Mahle Metal Leve
LIGT3 Light
LJQQ3 Lojas Quero-Quero
LOGG3 Log Properties
LOGN3 Log-In Logística
LPSB3 Lopes Brasil
LREN3 Lojas Renner
LUPA3 Lupatech
LUXM4 Trevisa
LWSA3 Locaweb
MAPT3 Cemepe
MAPT4 Cemepe
MATD3 Mater Dei
MBRF3 Marfrig
MDIA3 M. Dias Branco
MDNE3 Moura Dubeux
MEAL3 International Meal
MELK3 Melnick
MGEL4 Mangels
MGLU3 Magazine Luiza
MILS3 Mills
MLAS3 Multilaser
MMAQ3 Minas Máquinas
MMAQ4 Minas Máquinas
MNDL3 Mundial
MNPR3 Minupar
MOTV3 Motiva
MOVI3 Movida
MRSA3B MRS Logística
MRSA5B MRS Logística
MRSA6B MRS Logística
MRVE3 MRV
MSPA3 Melhoramentos SP
MSPA4 Melhoramentos SP
MTRE3 Mitre Realty
MTSA3 Metisa
MTSA4 Metisa
MULT3 Multiplan
MWET3 Wetzel
MWET4 Wetzel
MYPK3 Iochpe-Maxion
NATU3 Natura
NEOE3 Neoenergia
NEXP3 Nexpe
NGRD3 Neogrid
NORD3 Nordon
NUTR3 Nutriplant
OBTC3 OranjebtC
ODER4 Oderich
OFSA3 Ourofino
OIBR3 Oi
OIBR4 Oi
ONCO3 Oncoclínicas
OPCT3 Oceanpact
ORVR3 Orizon
OSXB3 OSX Brasil
PASS3 Compass Gás
PATI3 Panatlantica
PATI4 Panatlantica
PCAR3 Grupo Pão de Açúcar
PDGR3 PDG Realty
PDTC3 Padtec
PEAB3 Par Al Bahia
PEAB4 Par Al Bahia
PETR3 Petrobras
PETR4 Petrobras
PFRM3 Profarma
PGMN3 Pague Menos
PINE3 Banco Pine
PINE4 Banco Pine
PLAS3 Plascar
PLPL3 Plano & Plano
PMAM3 Paranapanema
PNVL3 Dimed
POMO3 Marcopolo
POMO4 Marcopolo
POSI3 Positivo Tecnologia
PRIO3 PRIO
PRNR3 Priner
PSSA3 Porto Seguro
PSVM11 Porto Seguro VM
PTBL3 Portobello
PTNT3 Pettenati
PTNT4 Pettenati
QUAL3 Qualicorp
RADL3 Raia Drogasil
RAIL3 Rumo
RAIZ4 Raízen
RANI3 Irani
RAPT3 Randoncorp
RAPT4 Randoncorp
RCSL3 Recrusul
RCSL4 Recrusul
RDNI3 RNI
RDOR3 Rede D'Or
RECV3 PetroRecôncavo
REDE3 Rede Energia
RENT3 Localiza
RENT4 Localiza
RIAA3 Riachuelo
RNEW11 Renova Energia
RNEW3 Renova Energia
RNEW4 Renova Energia
ROMI3 Romi
RPAD3 Alfa Holdings
RPAD5 Alfa Holdings
RPAD6 Alfa Holdings
RPMG3 Refinaria Manguinhos
RSID3 Rossi Residencial
RSUL4 Riosulense
RVEE3 Revee
SANB11 Santander
SANB3 Santander
SANB4 Santander
SAPR11 Sanepar
SAPR3 Sanepar
SAPR4 Sanepar
SAUD3 Bradesco Saúde
SBFG3 Centauro
SBSP3 Sabesp
SCAR3 São Carlos
SEER3 Ser Educacional
SEQL3 Sequoia
SHOW3 Time for Fun
SHUL3 Schulz
SHUL4 Schulz
SIMH3 Simpar
SLCE3 SLC Agrícola
SMFT3 Smart Fit
SMTO3 São Martinho
SNSY3 Sansuy
SNSY5 Sansuy
SOJA3 Boa Safra
SOND3 Sondotécnica
SOND5 Sondotécnica
SOND6 Sondotécnica
SUZB3 Suzano
SYNE3 SYN Prop
TAEE11 Taesa
TAEE3 Taesa
TAEE4 Taesa
TASA3 Taurus Armas
TASA4 Taurus Armas
TCSA3 Tecnisa
TECN3 Technos
TELB3 Telebras
TELB4 Telebras
TEND3 Construtora Tenda
TFCO4 Track & Field
TGMA3 Tegma
TIMS3 TIM
TOKY3 Grupo Toky
TOTS3 Totvs
TPIS3 Triunfo Participações
TRAD3 TC
TRIS3 Trisul
TTEN3 3Tentos
TUPY3 Tupy
TXRX3 Têxtil Renauxview
TXRX4 Têxtil Renauxview
UCAS3 Unicasa
UGPA3 Ultrapar
UNIP3 Unipar
UNIP5 Unipar
UNIP6 Unipar
USIM3 Usiminas
USIM5 Usiminas
USIM6 Usiminas
VALE3 Vale
VAMO3 Vamos
VBBR3 Vibra Energia
VITT3 Vittia
VIVA3 Vivara
VIVR3 Viver Incorporadora
VIVT3 Vivo
VLID3 Valid
VSTE3 Veste
VTRU3 Vitru Educação
VULC3 Vulcabras
VVEO3 Viveo
WDCN3 WDC Networks
WEGE3 WEG
WEST3 Westwing
WHRL3 Whirlpool
WHRL4 Whirlpool
WIZC3 Wiz Co
WLMM3 WLM
WLMM4 WLM
YDUQ3 Yduqs
ZAMP3 Zamp
`;

const ACOES = ACOES_RAW.trim()
  .split("\n")
  .map((linha) => {
    const [ticker, ...resto] = linha.trim().split(/\s+/);
    const name = resto.join(" ");
    return {
      ticker,
      name,
      url: `https://br.tradingview.com/symbols/BMFBOVESPA-${ticker}/`,
    };
  });

const ACOES_RANGE = [
  ["Todos", null, null],
  ["A–F", "A", "F"],
  ["G–L", "G", "L"],
  ["M–R", "M", "R"],
  ["S–Z", "S", "Z"],
];

const acaoGrid = document.getElementById("acaoGrid");
const acaoEmpty = document.getElementById("acaoEmpty");
const acaoSearch = document.getElementById("acaoSearch");
const acaoFiltersBox = document.getElementById("acaoFilters");
const acaoCount = document.getElementById("acaoCount");

let acaoRange = "Todos";
let acaoLetter = null;

function renderAcaoFilters() {
  acaoFiltersBox.innerHTML = "";
  ACOES_RANGE.forEach(([label, de, ate]) => {
    const b = document.createElement("button");
    b.className = "chip-btn" + (acaoRange === label ? " active" : "");
    b.textContent = label;
    b.addEventListener("click", () => {
      acaoRange = label;
      acaoLetter = null;
      renderAcaoFilters();
      renderLetterBar();
      renderAcoes();
    });
    acaoFiltersBox.appendChild(b);
  });
}

function renderLetterBar() {
  let bar = document.getElementById("letterBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "letter-bar";
    bar.id = "letterBar";
    acaoGrid.parentNode.insertBefore(bar, acaoGrid);
  }
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  bar.innerHTML = "";
  letters.forEach((L) => {
    const b = document.createElement("button");
    b.textContent = L;
    if (acaoLetter === L) b.className = "active";
    b.addEventListener("click", () => {
      acaoLetter = acaoLetter === L ? null : L;
      acaoRange = "Todos";
      renderAcaoFilters();
      renderLetterBar();
      renderAcoes();
      document.getElementById("acoes").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    bar.appendChild(b);
  });
  bar.hidden = acaoRange !== "Todos";
}

function renderAcoes() {
  const term = slug(acaoSearch.value.trim());

  const range = ACOES_RANGE.find(([l]) => l === acaoRange) || ACOES_RANGE[0];

  const list = ACOES.filter((a) => {
    if (acaoLetter && a.ticker[0] !== acaoLetter) return false;
    if (range[1] && (a.ticker[0] < range[1] || a.ticker[0] > range[2])) return false;
    if (!term) return true;
    return slug(a.ticker).includes(term) || slug(a.name).includes(term);
  });

  acaoGrid.innerHTML = "";
  const frag = document.createDocumentFragment();

  list.forEach((a, i) => {
    const el = document.createElement("a");
    el.className = "acao-card";
    el.href = a.url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.title = `${a.ticker} — ${a.name}`;
    el.style.animationDelay = `${Math.min(i, 40) * 18}ms`;
    el.innerHTML = `
      <span class="acao-ticker">${a.ticker}</span>
      <span class="acao-name">${a.name}</span>
      <span class="acao-go">↗</span>`;
    frag.appendChild(el);
  });

  acaoGrid.appendChild(frag);
  acaoCount.innerHTML = `<b>${list.length}</b> de ${ACOES.length} ações` +
    (acaoLetter ? ` · letra <b>${acaoLetter}</b>` : "") +
    (acaoRange !== "Todos" ? ` · ${acaoRange}` : "") +
    (acaoSearch.value.trim() ? ` · busca "${acaoSearch.value.trim()}"` : "");
  acaoEmpty.hidden = list.length > 0;
}

acaoSearch.addEventListener("input", renderAcoes);

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */
renderFilters();
renderGrid();
renderAbertura();
renderArtificial();
renderIndFilters();
renderIndicators();
renderAcaoFilters();
renderLetterBar();
renderAcoes();
initNavSpy();
initFeature();
buildCandles();
buildTicker();
animateStats();
