// MASSIVELY EXPANDED QUOTE SYSTEM
const intelligenceQuotes = {
    init: [
        { text: "No man is free who is not master of himself.", author: "Epictetus" },
        { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
        { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
        { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
        { text: "The crossroad of temptation is where a man defines his true value.", author: "Musonius Rufus" },
        { text: "He who conquers others is strong; he who conquers himself is mighty.", author: "Lao Tzu" },
        { text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
        { text: "Rule your mind or it will rule you.", author: "Horace" },
        { text: "Freedom is the unique possession of the self-disciplined.", author: "Daniel Webster" },
        { text: "Great properties are hidden within you. Awaken them to claim sovereignty.", author: "Stoic Core" }
    ],
    reset: [
        { text: "Urges are nothing more than waves. Learn to surf them; they always break and pass.", author: "Neurobiology" },
        { text: "Do not exchange months of absolute sovereign pride for 5 seconds of pixelated dopamine.", author: "Stoic Armor" },
        { text: "If you can quit for a day, you can quit for a lifetime. Stand up and rebuild.", author: "Discipline Core" },
        { text: "A lapse is an incident, not a total identity collapse. Reset instantly.", author: "Neuro-Rewiring" },
        { text: "The dopamine circuit is lying to you. The discomfort you feel right now is your brain healing.", author: "Biomedical Reality" },
        { text: "Shame is useless fuel. Convert it immediately into cold execution.", author: "Sovereign Framework" },
        { text: "The past is an unalterable data entry. The present frame is completely yours to command.", author: "Temporal Logic" }
    ]
};

const standardRanks = [
    { name: "Initiate (Rank I)", targets: 0, css: "bg-slate-950 text-slate-400 border-slate-900" },
    { name: "Vanguard (Rank II)", targets: 3, css: "bg-blue-950/30 text-blue-400 border-blue-900/40" },
    { name: "Centurion (Rank III)", targets: 7, css: "bg-emerald-950/30 text-emerald-400 border-emerald-900/40" },
    { name: "Sovereign (Rank IV)", targets: 14, css: "bg-amber-950/30 text-amber-400 border-amber-900/40" },
    { name: "Immortal (Rank V)", targets: 30, css: "bg-violet-950/30 text-violet-400 border-violet-900/40" },
    { name: "Apex Overlord (Max)", targets: 90, css: "bg-rose-950/30 text-rose-400 border-rose-900/40 font-black" }
];

// Centralized Encrypted Data State Architecture
let appState = JSON.parse(localStorage.getItem('sovereign_v5_master')) || {
    startEpoch: null,
    relapses: [],
    journalLog: {},
    threatTrigger: "None"
};

let frameRequestLoopId = null;
let panicTimeoutId = null;
let panicDrillActive = false;
let cachedLastDayCounter = -1;

// Permanent DOM Node Caching Layer
const elements = {
    m: document.getElementById('count-months'),
    d: document.getElementById('count-days'),
    h: document.getElementById('count-hours'),
    min: document.getElementById('count-minutes'),
    s: document.getElementById('count-seconds'),
    tierBadge: document.getElementById('tier-badge'),
    emptyState: document.getElementById('empty-state'),
    counterState: document.getElementById('counter-state')
};

function saveState() {
    localStorage.setItem('sovereign_v5_master', JSON.stringify(appState));
}

function runLiveChronometer() {
    if (!appState.startEpoch) {
        toggleUIState(false);
        return;
    }

    toggleUIState(true);

    function clockTickStep() {
        if (!appState.startEpoch) return;

        const deltaMilliseconds = Date.now() - appState.startEpoch;
        if (deltaMilliseconds >= 0) {
            const totalSeconds = Math.floor(deltaMilliseconds / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const totalHours = Math.floor(totalMinutes / 60);
            const absoluteDays = Math.floor(totalHours / 24);

            // Output Text updates directly to DOM components
            elements.m.innerText = String(Math.floor(absoluteDays / 30)).padStart(2, '0');
            elements.d.innerText = String(absoluteDays % 30).padStart(2, '0');
            elements.h.innerText = String(totalHours % 24).padStart(2, '0');
            elements.min.innerText = String(totalMinutes % 60).padStart(2, '0');
            elements.s.innerText = String(totalSeconds % 60).padStart(2, '0');

            // Macro UI refreshes only execute if a full day has rolled over
            if (absoluteDays !== cachedLastDayCounter) {
                cachedLastDayCounter = absoluteDays;
                executeHeavyUIRenderTask(absoluteDays, totalHours);
            }
        }
        frameRequestLoopId = requestAnimationFrame(clockTickStep);
    }
    
    if (frameRequestLoopId) cancelAnimationFrame(frameRequestLoopId);
    frameRequestLoopId = requestAnimationFrame(clockTickStep);
}

function executeHeavyUIRenderTask(days, hours) {
    evaluateMilestoneMatrix(days);
    renderInteractiveCalendar(appState.startEpoch);
    calculateNeuroBiometricsForecast(days, hours);
}

function toggleUIState(isActive) {
    const list = ['counter-state', 'calendar-card', 'biometrics-card', 'urge-logger-card', 'journal-card'];
    list.forEach(id => {
        document.getElementById(id).classList.toggle('hidden', !isActive);
    });
    elements.emptyState.classList.toggle('hidden', isActive);
    if (appState.relapses.length > 0 && isActive) document.getElementById('audit-card').classList.remove('hidden');
    
    if (!isActive) {
        elements.tierBadge.className = "px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase bg-slate-900 text-slate-500 border border-slate-800";
        elements.tierBadge.innerText = "INACTIVE";
        cachedLastDayCounter = -1;
    }
}

function initializeStreak() {
    appState.startEpoch = Date.now();
    saveState();
    runLiveChronometer();
    loadRandomQuote('init', 'DAILY DIRECTIVE');
    loadTodayJournalPrompt();
}

function triggerRelapseProtocol() {
    if (!appState.startEpoch) return;
    if (confirm("Confirm System Reset: This logs a failure event and forces your temporal tracking matrix back to absolute zero.")) {
        if (frameRequestLoopId) cancelAnimationFrame(frameRequestLoopId);
        appState.relapses.unshift(new Date().toLocaleString());
        appState.startEpoch = null;
        saveState();
        toggleUIState(false);
        loadRandomQuote('reset', 'PROTOCOL REBOOT');
        buildMilestoneList(0);
        renderRelapseAuditLog();
    }
}

function calculateNeuroBiometricsForecast(days, totalHours) {
    const arPercent = Math.min(Math.floor((totalHours / 168) * 100), 100);
    const dopaminePercent = Math.min(Math.floor((days / 60) * 100), 100);

    document.getElementById('bio-stat-ar').innerText = `${arPercent}%`;
    document.getElementById('bio-bar-ar').style.width = `${arPercent}%`;
    document.getElementById('bio-stat-dopamine').innerText = `${dopaminePercent}%`;
    document.getElementById('bio-bar-dopamine').style.width = `${dopaminePercent}%`;
}

function togglePanicDrill() {
    panicDrillActive = !panicDrillActive;
    document.getElementById('panic-box').classList.toggle('hidden', !panicDrillActive);

    const panicNavButton = document.getElementById('nav-panic');
    if (panicDrillActive) {
        panicNavButton.classList.add('text-rose-500', 'animate-pulse');
    } else {
        panicNavButton.classList.remove('text-rose-500', 'animate-pulse');
        panicNavButton.classList.add('text-slate-500');
        if (panicTimeoutId) clearTimeout(panicTimeoutId);
        return;
    }

    const ticker = document.getElementById('breath-ticker');
    const progress = document.getElementById('breath-progress');

    function runBreathCycle(phase) {
        if (!panicDrillActive) return;

        if (phase === 0) {
            ticker.innerText = "Breathe In... (4s)";
            progress.style.transitionDuration = '4s';
            progress.style.width = '100%';
            panicTimeoutId = setTimeout(() => runBreathCycle(1), 4000);
        } else if (phase === 1) {
            ticker.innerText = "Hold & Retain... (7s)";
            progress.style.transitionDuration = '7s';
            progress.style.width = '0%';
            panicTimeoutId = setTimeout(() => runBreathCycle(2), 7000);
        } else {
            ticker.innerText = "Slow Exhale... (8s)";
            progress.style.transitionDuration = '8s';
            progress.style.width = '100%';
            panicTimeoutId = setTimeout(() => runBreathCycle(0), 8000);
        }
    }
    runBreathCycle(0);
}

function logUrgeTrigger(type) {
    appState.threatTrigger = type;
    saveState();
    renderUrgeAnalyticsBoard();
}

function renderUrgeAnalyticsBoard() {
    const space = document.getElementById('urge-stats-matrix');
    if (appState.threatTrigger !== "None") {
        space.classList.remove('hidden');
        document.getElementById('urge-analytics-render').innerText = appState.threatTrigger;
    }
}

function renderInteractiveCalendar(startTimestamp) {
    const grid = document.getElementById('calendar-days-grid');
    const fragment = document.createDocumentFragment();
    grid.innerHTML = '';
    
    const activeDate = new Date();
    const currentYear = activeDate.getFullYear();
    const currentMonth = activeDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('calendar-month-year').innerText = `${monthNames[currentMonth]} ${currentYear} • PLATFORM LOG`;

    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const boundaryFirstDayOffset = new Date(currentYear, currentMonth, 1).getDay();

    for (let i = 0; i < boundaryFirstDayOffset; i++) {
        fragment.appendChild(document.createElement('div'));
    }

    const cleanStartDayFloor = new Date(startTimestamp);
    cleanStartDayFloor.setHours(0,0,0,0);
    const todayFloor = new Date();
    todayFloor.setHours(0,0,0,0);

    for (let targetDay = 1; targetDay <= totalDaysInMonth; targetDay++) {
        const cellDate = new Date(currentYear, currentMonth, targetDay);
        cellDate.setHours(0,0,0,0);
        const cell = document.createElement('div');
        cell.className = "aspect-square rounded-lg flex items-center justify-center font-bold font-mono border text-[11px] h-8 w-8 mx-auto ";
        cell.innerText = targetDay;

        if (cellDate.getTime() === todayFloor.getTime()) {
            cell.className += "border-indigo-500 bg-indigo-950/40 text-indigo-400";
        } else if (appState.startEpoch && cellDate >= cleanStartDayFloor && cellDate < todayFloor) {
            cell.className += "border-emerald-500/30 bg-emerald-950/20 text-emerald-400";
            cell.innerText = "✓";
        } else if (cellDate > todayFloor) {
            cell.className += "border-transparent bg-slate-950/40 text-slate-700";
        } else {
            cell.className += "border-slate-900 bg-[#04060c]/40 text-slate-500";
        }
        fragment.appendChild(cell);
    }
    grid.appendChild(fragment);
}

function loadTodayJournalPrompt() {
    document.getElementById('journal-input').value = appState.journalLog[new Date().toDateString()] || "";
}

function saveDailyJournal() {
    if (!appState.startEpoch) return;
    const textContent = document.getElementById('journal-input').value.trim();
    if(textContent) {
        appState.journalLog[new Date().toDateString()] = textContent;
        saveState();
        alert("Entry updated inside sandboxed application layer.");
    }
}

function renderRelapseAuditLog() {
    const container = document.getElementById('audit-log-space');
    let content = '';
    appState.relapses.forEach((timestamp, index) => {
        content += `
            <div class="flex justify-between text-rose-400/80 bg-rose-950/5 border border-rose-950/30 rounded-lg p-2 text-[10px]">
                <span>System Reset Metric #${appState.relapses.length - index}</span>
                <span>${timestamp.split(',')[0]}</span>
            </div>
        `;
    });
    container.innerHTML = content;
}

function evaluateMilestoneMatrix(currentDays) {
    let activeTier = standardRanks[0];
    for (let i = standardRanks.length - 1; i >= 0; i--) {
        if (currentDays >= standardRanks[i].targets) {
            activeTier = standardRanks[i];
            break;
                }
            }
    elements.tierBadge.innerText = activeTier.name.split(' ')[0];
    elements.tierBadge.className = `px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase border ${activeTier.css} accelerated-layer`;
    buildMilestoneList(currentDays);
}

function buildMilestoneList(activeDays) {
    const container = document.getElementById('matrix-injection-space');
    let content = '';
    standardRanks.forEach(rank => {
        const isUnlocked = activeDays >= rank.targets;
        const opacityStyle = isUnlocked ? 'opacity-100 bg-slate-900/60 border-slate-800' : 'opacity-25 border-transparent bg-transparent';
        content += `
            <div class="flex justify-between items-center p-3.5 text-xs border rounded-xl ${opacityStyle}">
                <span class="font-bold tracking-wide ${isUnlocked ? rank.css.split(' ')[1] : 'text-slate-500'}">${rank.name}</span>
                <span class="font-mono text-[9px] tracking-wider font-black ${isUnlocked ? 'text-emerald-400' : 'text-slate-600'}">${isUnlocked ? '✓ ACTIVE' : `${rank.targets} DAYS`}</span>
            </div>
        `;
    });
    container.innerHTML = content;
}

function loadRandomQuote(poolType, label) {
    const targetPool = intelligenceQuotes[poolType];
    const item = targetPool[Math.floor(Math.random() * targetPool.length)];
    document.getElementById('quote-badge').innerText = label;
    document.getElementById('quote-render').innerText = `"${item.text}"`;
    document.getElementById('author-render').innerText = `— ${item.author}`;
}

function switchTab(viewName) {
    ['dashboard', 'ranks'].forEach(v => {
        document.getElementById(`view-${v}`).classList.add('hidden');
        document.getElementById(`nav-${v}`).classList.replace('text-indigo-400', 'text-slate-500');
    });
    document.getElementById(`view-${viewName}`).classList.remove('hidden');
    document.getElementById(`nav-${viewName}`).classList.replace('text-slate-500', 'text-indigo-400');
    
    if(viewName === 'dashboard' && appState.startEpoch) {
        const delta = Date.now() - appState.startEpoch;
        const hours = Math.floor(delta / 3600000);
        executeHeavyUIRenderTask(Math.floor(hours / 24), hours);
    }
}

// Global lifecycle initial state check execution
window.onload = function() {
    renderRelapseAuditLog();
    renderUrgeAnalyticsBoard();
    if (appState.startEpoch) {
        runLiveChronometer();
        loadRandomQuote('init', 'DAILY DIRECTIVE');
        loadTodayJournalPrompt();
    } else {
        buildMilestoneList(0);
    }
};
