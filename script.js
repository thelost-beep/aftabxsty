/* =============================================
   AFTAB PORTFOLIO — SUPERCHARGED TERMINAL v3.0
   Advanced hacker terminal w/ typing animations,
   ASCII art, matrix rain
   ============================================= */

// ============ GLOBAL STATE ============
let commandHistory = [];
let historyIndex = -1;
let cmdCount = 0;
let matrixRunning = false;
let matrixIntensity = 1;
let terminalTheme = 'green';
const startTime = Date.now();
const GEMINI_API_KEY = (typeof CONFIG !== 'undefined' && CONFIG.GEMINI_API_KEY) ? CONFIG.GEMINI_API_KEY : '';

// ============ ASCII ART ============
const AFTAB_ASCII = `
 █████╗ ███████╗████████╗ █████╗ ██████╗ 
██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
███████║█████╗     ██║   ███████║██████╔╝
██╔══██║██╔══╝     ██║   ██╔══██║██╔══██╗
██║  ██║██║        ██║   ██║  ██║██████╔╝
╚═╝  ╚═╝╚═╝        ╚═╝   ╚═╝  ╚═╝╚═════╝ `;

const SKULL_ASCII = `
    ▄▄▄▄▄▄▄▄
  ▄█████████████▄
 ████████████████▄
 █████████████████
 █████████████████
  ██  ███████  ██
  ▀█  ███████  █▀
      ▀█████▀
       █████
     ▄███████▄
   ▄████▀▀▀████▄
  ████       ████`;

const NEOFETCH_LOGO = `
   ██╗  ██╗
   ██║ ██╔╝
   █████╔╝ 
   ██╔═██╗ 
   ██║  ██╗
   ╚═╝  ╚═╝`;

// ============ FAKE FILE SYSTEM ============
const fileSystem = {
    'about.txt': `Name: Aftab Alam
Role: Student Developer | System Thinker
School: BDRA-SOSE, Lajpat Nagar
Board: DBSE
Class: 10th
Club: EthicBizz (ethicbizz.org)
GitHub: github.com/thelost-beep
Status: Building the future, one system at a time.`,

    'skills.conf': `[languages]
html = ████████████████████ 95%
css  = ███████████████████░ 90%
js   = ██████████████████░░ 85%
py   = █████████████████░░░ 80%
sql  = ████████████████░░░░ 75%

[frameworks]
react     = ██████████████████░░ 85%
nextjs    = █████████████████░░░ 80%
supabase  = ████████████████████ 95%

[tools]
git       = ██████████████████░░ 85%
vscode    = ████████████████████ 95%
figma     = ████████████████░░░░ 75%
linux     = ██████████████░░░░░░ 65%`,

    'projects.json': `{
  "total": 10,
  "projects": [
    { "name": "Fect", "type": "Library Infrastructure" },
    { "name": "TopperTrack", "type": "AI Academic Engine" },
    { "name": "ClassroomX", "type": "Social Network" },
    { "name": "Counselling System", "type": "Mental Health" },
    { "name": "Medique", "type": "Healthcare Queue" },
    { "name": "AI Skin Analysis", "type": "AI/ML Concept" },
    { "name": "SOSE Connect", "type": "Institutional Platform" },
    { "name": "Automation", "type": "Scripts & Tools" },
    { "name": "JS Console", "type": "Developer Tools" },
    { "name": "NastyTask Done", "type": "AI Social Platform" }
  ]
}`,

    'contact.yml': `contact:
  email: aftabalamcasse@gmail.com
  github: https://github.com/thelost-beep
  location: New Delhi, India
  availability: Open for projects & collaboration`,

    '.secrets': `ACCESS DENIED.
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Permission level: ROOT required
This file contains classified information.
Run 'sudo cat .secrets' for access.
...just kidding. There are no secrets here.
Or are there? 👀`,

    'readme.md': `# Aftab Alam — Portfolio System
> "I don't build random apps. I build systems."

## Quick Start
\`\`\`bash
$ help          # Show all commands
$ ai <query>    # Talk to AI assistant
$ neofetch      # System information
$ hack          # Begin hack sequence
$ projects      # View all 10 projects
\`\`\`

## Terminal Features
- Matrix rain animation
- CRT scanline effects
- AI-powered chat (Gemini)
- 20+ commands
- Tab completion
- Command history`,

    'system.log': `[2026-02-13 01:00:00] BOOT: System initialized
[2026-02-13 01:00:01] AUTH: User aftab authenticated
[2026-02-13 01:00:02] NET: Secure connection established
[2026-02-13 01:00:03] GPU: Matrix renderer loaded
[2026-02-13 01:00:04] SYS: All systems operational
[2026-02-13 01:00:05] SEC: AES-256 encryption active`
};

// ============ TYPING ANIMATION ENGINE ============
function typeText(element, text, speed = 12) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        const type = () => {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
                const body = document.getElementById('terminal-body');
                if (body) body.scrollTop = body.scrollHeight;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        };
        type();
    });
}

async function typeLines(lines, speed = 8) {
    const body = document.getElementById('terminal-body');
    for (const line of lines) {
        const div = document.createElement('div');
        div.className = 'terminal-line';
        body.appendChild(div);
        await typeText(div, line, speed);
        body.scrollTop = body.scrollHeight;
        await sleep(30);
    }
}

async function typeHtml(htmlContent, delay = 20) {
    const body = document.getElementById('terminal-body');
    const div = document.createElement('div');
    div.className = 'terminal-line';
    body.appendChild(div);

    const tempEl = document.createElement('div');
    tempEl.innerHTML = htmlContent;
    const text = tempEl.textContent;

    for (let i = 0; i < text.length; i++) {
        div.textContent += text[i];
        body.scrollTop = body.scrollHeight;
        if (i % 3 === 0) await sleep(delay);
    }
    // Now replace with actual HTML for styling
    div.innerHTML = htmlContent;
    return div;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function addLine(text, cls = '') {
    const body = document.getElementById('terminal-body');
    const div = document.createElement('div');
    div.className = `terminal-line ${cls}`;
    div.innerHTML = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
}

async function addLineAnimated(text, cls = '', speed = 8) {
    const body = document.getElementById('terminal-body');
    const div = document.createElement('div');
    div.className = `terminal-line ${cls}`;
    body.appendChild(div);
    await typeText(div, text, speed);
    return div;
}

function addPromptEcho(cmd) {
    addLine(`<span class="prompt-echo"><span class="pe-user">aftab</span><span class="pe-at">@</span><span class="pe-host">portfolio</span><span class="pe-colon">:</span><span class="pe-dir">~</span><span class="pe-dollar">$</span> ${escapeHtml(cmd)}</span>`);
}

function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function updateCmdCount() {
    cmdCount++;
    const el = document.getElementById('cmd-count');
    if (el) el.textContent = cmdCount;
}

// ============ MATRIX RAIN ============
let matrixCtx, matrixCols, matrixDrops;

function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    matrixCtx = canvas.getContext('2d');
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);
}

function resizeMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const fontSize = 14;
    matrixCols = Math.floor(canvas.width / fontSize);
    matrixDrops = Array(matrixCols).fill(1);
}

function drawMatrix() {
    if (!matrixRunning || !matrixCtx) return;
    const canvas = document.getElementById('matrix-canvas');
    const fontSize = 14;
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, canvas.width, canvas.height);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const color = terminalTheme === 'blue' ? '#00bfff' : terminalTheme === 'amber' ? '#ffb000' : '#00ff41';
    matrixCtx.fillStyle = color;
    matrixCtx.font = fontSize + 'px monospace';

    for (let i = 0; i < matrixDrops.length; i++) {
        if (Math.random() > (1 - 0.3 * matrixIntensity)) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            matrixCtx.fillText(char, i * fontSize, matrixDrops[i] * fontSize);
        }
        if (matrixDrops[i] * fontSize > canvas.height && Math.random() > 0.98) {
            matrixDrops[i] = 0;
        }
        matrixDrops[i]++;
    }
    requestAnimationFrame(drawMatrix);
}

function toggleMatrix(intense) {
    matrixIntensity = intense || 1;
    if (!matrixRunning) {
        matrixRunning = true;
        drawMatrix();
    }
}

// ============ BOOT SEQUENCE ============
async function bootSequence() {
    const body = document.getElementById('terminal-body');
    body.innerHTML = '';
    const input = document.getElementById('terminal-input');
    input.disabled = true;

    // CRT power on
    const overlay = document.getElementById('terminal-overlay');
    overlay.classList.add('crt-on');
    await sleep(300);
    overlay.classList.remove('crt-on');

    // Boot lines with typing effect
    const bootLines = [
        '[BIOS] POST check... OK',
        '[BIOS] Memory: 16384 MB detected',
        '[BIOS] CPU: Aftab Neural Engine v3.0',
        '',
        '██████████████████████████████████████████',
        '',
    ];

    for (const line of bootLines) {
        await addLineAnimated(line, 'boot-text', 6);
        await sleep(60);
    }

    // Big ASCII AFTAB
    const asciiLines = AFTAB_ASCII.split('\n');
    for (const line of asciiLines) {
        addLine(`<span class="ascii-art">${escapeHtml(line)}</span>`);
        await sleep(40);
    }

    addLine('');
    await addLineAnimated('        ╔══════════════════════════════════════╗', 'boot-border', 4);
    await addLineAnimated('        ║   AFTAB PORTFOLIO TERMINAL v3.0     ║', 'boot-border', 4);
    await addLineAnimated('        ║   Secure • Encrypted • AI-Powered   ║', 'boot-border', 4);
    await addLineAnimated('        ╚══════════════════════════════════════╝', 'boot-border', 4);
    addLine('');

    // System checks with progress
    const checks = [
        { name: 'Loading kernel modules', time: 200 },
        { name: 'Initializing matrix renderer', time: 150 },
        { name: 'Mounting file system', time: 180 },
        { name: 'Starting AI subsystem', time: 250 },
        { name: 'Establishing encrypted channel', time: 200 },
        { name: 'Loading portfolio data', time: 150 },
    ];

    for (const check of checks) {
        const line = addLine(`<span class="boot-check">[    ] ${check.name}...</span>`);
        await sleep(check.time);
        line.innerHTML = `<span class="boot-check boot-ok">[<span class="ok-mark"> OK </span>] ${check.name}</span>`;
        await sleep(50);
    }

    addLine('');
    // Progress bar
    const barLine = addLine('<span class="progress-bar"></span>');
    for (let i = 0; i <= 100; i += 5) {
        const filled = Math.floor(i / 2.5);
        const empty = 40 - filled;
        barLine.innerHTML = `<span class="progress-bar">[<span class="bar-fill">${'█'.repeat(filled)}</span>${'░'.repeat(empty)}] ${i}%</span>`;
        await sleep(30);
    }

    addLine('');
    await addLineAnimated('✓ System ready. Welcome back, aftab.', 'success-text', 10);
    await addLineAnimated('Type "help" to see available commands, or "ai" to talk to AI.', 'hint-text', 10);
    addLine('');

    input.disabled = false;
    input.focus();

    // Start subtle matrix
    toggleMatrix(0.3);
}

// ============ COMMAND HANDLERS ============
const commands = {
    help: cmdHelp,
    about: cmdAbout,
    skills: cmdSkills,
    education: cmdEducation,
    projects: cmdProjects,
    contact: cmdContact,
    github: cmdGithub,
    clear: cmdClear,
    exit: cmdExit,
    neofetch: cmdNeofetch,
    whoami: cmdWhoami,
    date: cmdDate,
    uptime: cmdUptime,
    uname: cmdUname,
    hostname: cmdHostname,
    ping: cmdPing,
    ls: cmdLs,
    cat: cmdCat,
    pwd: cmdPwd,
    hack: cmdHack,
    matrix: cmdMatrix,
    theme: cmdTheme,
    sudo: cmdSudo,
    echo: cmdEcho,
    history: cmdHistory,
    banner: cmdBanner,
    man: cmdMan,
    wget: cmdWget,
    nmap: cmdNmap,
    tree: cmdTree,
    fortune: cmdFortune,
    cowsay: cmdCowsay,
    export: cmdExport,
};

async function cmdHelp() {
    const sections = [
        {
            title: '═══ NAVIGATION ═══', cmds: [
                ['about', 'Display personal info'],
                ['skills', 'Show skill bars'],
                ['education', 'Show education details'],
                ['projects', 'List all 10 projects'],
                ['contact', 'Contact information'],
                ['github', 'Open GitHub profile'],
            ]
        },
        {
            title: '═══ SYSTEM ═══', cmds: [
                ['neofetch', 'System info with ASCII art'],
                ['whoami', 'Current user'],
                ['date', 'Current date/time'],
                ['uptime', 'Session uptime'],
                ['uname', 'System information'],
                ['hostname', 'Show hostname'],
                ['banner', 'Show ASCII banner'],
            ]
        },
        {
            title: '═══ FILES ═══', cmds: [
                ['ls [-la]', 'List files'],
                ['cat <file>', 'Read file contents'],
                ['pwd', 'Print working directory'],
                ['tree', 'Directory tree view'],
            ]
        },
        {
            title: '═══ HACKER ═══', cmds: [
                ['hack', 'Start hack sequence'],
                ['matrix [1-3]', 'Toggle matrix rain'],
                ['theme <g|b|a>', 'Change terminal theme'],
                ['ping <host>', 'Ping a server'],
                ['sudo <cmd>', 'Run as root'],
                ['nmap <target>', 'Scan network ports'],
                ['wget <url>', 'Download simulation'],
            ]
        },
        {
            title: '═══ AI ═══', cmds: [
                ['ai <question>', 'Chat with Gemini AI'],
            ]
        },
        {
            title: '═══ FUN ═══', cmds: [
                ['fortune', 'Random dev quote'],
                ['cowsay <text>', 'Cow says your text'],
                ['echo <text>', 'Print text'],
            ]
        },
        {
            title: '═══ UTILITY ═══', cmds: [
                ['history', 'Command history'],
                ['clear', 'Clear terminal'],
                ['exit', 'Close terminal'],
            ]
        },
    ];

    for (const section of sections) {
        addLine(`<span class="help-section">${section.title}</span>`);
        for (const [cmd, desc] of section.cmds) {
            addLine(`  <span class="help-cmd">${cmd.padEnd(18)}</span> <span class="help-desc">${desc}</span>`);
        }
        addLine('');
    }
    addLine('<span class="hint-text">Shortcuts: ↑↓ history | Tab autocomplete | Ctrl+L clear | Esc close</span>');
}

async function cmdBanner() {
    const lines = AFTAB_ASCII.split('\n');
    for (const line of lines) {
        addLine(`<span class="ascii-art">${escapeHtml(line)}</span>`);
        await sleep(30);
    }
    addLine('<span class="ascii-subtitle">     Student Developer | System Thinker</span>');
    addLine('<span class="ascii-subtitle">     "Building systems with discipline and logic"</span>');
}

async function cmdAbout() {
    await addLineAnimated('┌─── ABOUT ─────────────────────────────────┐', 'info-border', 5);
    const info = [
        ['Name', 'Aftab Alam'],
        ['Role', 'Student Developer & System Thinker'],
        ['School', 'BDRA-SOSE, Lajpat Nagar'],
        ['Board', 'DBSE'],
        ['Class', '10th'],
        ['Club', 'EthicBizz (Founder involvement)'],
        ['GitHub', 'github.com/thelost-beep'],
        ['Email', 'aftabalamcasse@gmail.com'],
        ['Mission', 'Build infrastructure that matters'],
    ];
    for (const [key, val] of info) {
        addLine(`│ <span class="info-key">${key.padEnd(10)}</span> <span class="info-val">${val}</span>`);
        await sleep(40);
    }
    await addLineAnimated('└───────────────────────────────────────────┘', 'info-border', 5);
}

async function cmdSkills() {
    await addLineAnimated('┌─── SKILL MATRIX ──────────────────────────┐', 'info-border', 5);
    const skills = [
        ['HTML/CSS', 95, '██████████████████░░'],
        ['JavaScript', 85, '█████████████████░░░'],
        ['React', 85, '█████████████████░░░'],
        ['Next.js', 80, '████████████████░░░░'],
        ['Python', 80, '████████████████░░░░'],
        ['Supabase', 90, '██████████████████░░'],
        ['PostgreSQL', 75, '███████████████░░░░░'],
        ['Git', 85, '█████████████████░░░'],
        ['AI/ML', 70, '██████████████░░░░░░'],
        ['System Design', 90, '██████████████████░░'],
    ];
    for (const [skill, pct, bar] of skills) {
        addLine(`│ <span class="skill-name">${skill.padEnd(14)}</span> <span class="skill-bar">${bar}</span> <span class="skill-pct">${pct}%</span>`);
        await sleep(50);
    }
    await addLineAnimated('└───────────────────────────────────────────┘', 'info-border', 5);
}

async function cmdEducation() {
    await addLineAnimated('┌─── EDUCATION ─────────────────────────────┐', 'info-border', 5);
    addLine('│ <span class="info-key">Institution</span>  BDRA-SOSE, Lajpat Nagar');
    addLine('│ <span class="info-key">Board</span>        DBSE (Delhi Board of School Education)');
    addLine('│ <span class="info-key">Class</span>        10th');
    addLine('│ <span class="info-key">Stream</span>       STEM + System Engineering');
    addLine('│ <span class="info-key">Focus</span>        Full-stack development, AI, Infrastructure');
    addLine('│ <span class="info-key">Club</span>         EthicBizz — Ethics in business & tech');
    await addLineAnimated('└───────────────────────────────────────────┘', 'info-border', 5);
}

async function cmdProjects() {
    await addLineAnimated('┌─── PROJECTS [10] ─────────────────────────┐', 'info-border', 5);
    const projs = [
        ['01', 'Fect', 'Library Infrastructure', 'HTML/CSS/JS'],
        ['02', 'TopperTrack', 'AI Academic Engine', 'React/Supabase'],
        ['03', 'ClassroomX', 'Social Network', 'Next.js/Supabase'],
        ['04', 'Counselling', 'Mental Health System', 'Web App'],
        ['05', 'Medique', 'Healthcare Queue', 'Algorithm'],
        ['06', 'AI Skin Analysis', 'AI/ML Concept', 'Python/TF'],
        ['07', 'SOSE Connect', 'Institutional Platform', 'Postgres/RLS'],
        ['08', 'Automation', 'Scripts & Tools', 'Python/Shell'],
        ['09', 'JS Console', 'Developer Tools', 'JavaScript'],
        ['10', 'NastyTask Done', 'AI Social Platform', 'React/AI'],
    ];
    for (const [num, name, type, tech] of projs) {
        addLine(`│ <span class="proj-num">[${num}]</span> <span class="proj-name">${name.padEnd(18)}</span> <span class="proj-type">${type.padEnd(22)}</span> <span class="proj-tech">${tech}</span>`);
        await sleep(60);
    }
    await addLineAnimated('└───────────────────────────────────────────┘', 'info-border', 5);
    addLine('<span class="hint-text">Visit portfolio site for detailed breakdowns →</span>');
}

async function cmdContact() {
    await addLineAnimated('┌─── CONTACT ───────────────────────────────┐', 'info-border', 5);
    addLine('│ <span class="info-key">Email</span>    aftabalamcasse@gmail.com');
    addLine('│ <span class="info-key">GitHub</span>   github.com/thelost-beep');
    addLine('│ <span class="info-key">Location</span> New Delhi, India');
    addLine('│ <span class="info-key">Status</span>   <span class="online-dot">●</span> Available for projects');
    await addLineAnimated('└───────────────────────────────────────────┘', 'info-border', 5);
}

function cmdGithub() {
    addLine('<span class="success-text">Opening GitHub profile...</span>');
    window.open('https://github.com/thelost-beep', '_blank');
}

function cmdClear() {
    document.getElementById('terminal-body').innerHTML = '';
}

function cmdExit() {
    const overlay = document.getElementById('terminal-overlay');
    overlay.classList.add('crt-off');
    matrixRunning = false;
    setTimeout(() => {
        overlay.classList.remove('active', 'crt-off');
        document.getElementById('terminal-body').innerHTML = '';
        document.getElementById('terminal-toggle')?.classList.remove('active');
    }, 500);
}

async function cmdNeofetch() {
    const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(uptimeSec / 60);
    const secs = uptimeSec % 60;

    const logo = NEOFETCH_LOGO.split('\n');
    const info = [
        `<span class="nf-title">aftab</span><span class="nf-at">@</span><span class="nf-title">portfolio</span>`,
        `<span class="nf-sep">─────────────────────</span>`,
        `<span class="nf-key">OS:</span>     AftabOS v3.0 (Neural)`,
        `<span class="nf-key">Host:</span>   Portfolio Terminal`,
        `<span class="nf-key">Kernel:</span> 6.1.0-aftab-custom`,
        `<span class="nf-key">Uptime:</span> ${mins}m ${secs}s`,
        `<span class="nf-key">Shell:</span>  zsh 5.9`,
        `<span class="nf-key">Theme:</span>  ${terminalTheme} [CRT]`,
        `<span class="nf-key">CPU:</span>    Aftab Neural Engine v3.0`,
        `<span class="nf-key">GPU:</span>    Matrix Renderer GL`,
        `<span class="nf-key">Memory:</span> 1337MB / 16384MB`,
        `<span class="nf-key">AI:</span>     Offline (terminal mode)`,
        ``,
        `<span class="nf-colors">████████████████████</span>`,
    ];

    for (let i = 0; i < Math.max(logo.length, info.length); i++) {
        const l = logo[i] || '          ';
        const r = info[i] || '';
        addLine(`<span class="nf-logo">${escapeHtml(l).padEnd(12)}</span>  ${r}`);
        await sleep(40);
    }
}

function cmdWhoami() {
    addLine('<span class="success-text">aftab</span> — Student Developer @ BDRA-SOSE');
}

function cmdDate() {
    addLine(new Date().toString());
}

function cmdUptime() {
    const sec = Math.floor((Date.now() - startTime) / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    addLine(`up ${h}h ${m}m ${s}s, 1 user, load average: 0.42, 0.31, 0.27`);
}

function cmdUname() {
    addLine('AftabOS 6.1.0-custom x86_64 AftabNeuralEngine GNU/Linux');
}

function cmdHostname() {
    addLine('portfolio.aftab.dev');
}

async function cmdPing(args) {
    const target = args[0] || 'google.com';
    await addLineAnimated(`PING ${target} (142.250.193.14) 56(84) bytes of data.`, '', 8);
    for (let i = 1; i <= 4; i++) {
        const time = (Math.random() * 30 + 10).toFixed(1);
        await addLineAnimated(`64 bytes from ${target}: icmp_seq=${i} ttl=117 time=${time} ms`, '', 6);
        await sleep(300);
    }
    addLine('');
    addLine(`--- ${target} ping statistics ---`);
    addLine('4 packets transmitted, 4 received, 0% packet loss');
}

async function cmdNmap(args) {
    const target = args[0] || 'portfolio.aftab.dev';
    await addLineAnimated(`Starting Nmap 7.94 ( https://nmap.org )`, 'boot-text', 6);
    await addLineAnimated(`Nmap scan report for ${target}`, '', 6);
    await sleep(300);
    await addLineAnimated('Host is up (0.024s latency).', '', 6);
    addLine('');
    addLine('PORT      STATE    SERVICE');
    const ports = [
        ['22/tcp', 'filtered', 'ssh'],
        ['80/tcp', 'open', 'http'],
        ['443/tcp', 'open', 'https'],
        ['3000/tcp', 'open', 'dev-server'],
        ['5432/tcp', 'filtered', 'postgresql'],
        ['8080/tcp', 'open', 'http-proxy'],
    ];
    for (const [port, state, service] of ports) {
        const stateClass = state === 'open' ? 'success-text' : 'warning-text';
        addLine(`${port.padEnd(10)} <span class="${stateClass}">${state.padEnd(9)}</span> ${service}`);
        await sleep(100);
    }
    addLine('');
    await addLineAnimated('Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds', '', 6);
}

async function cmdWget(args) {
    const url = args[0] || 'https://aftab.dev/data.json';
    await addLineAnimated(`--2026-02-13 01:25:00--  ${url}`, '', 6);
    await addLineAnimated('Resolving host... 142.250.193.14', '', 6);
    await addLineAnimated('Connecting... connected.', '', 6);
    await addLineAnimated('HTTP request sent, awaiting response... 200 OK', 'success-text', 6);
    addLine('Length: 13,371 (13K) [application/json]');
    addLine('');

    const barLine = addLine('');
    for (let i = 0; i <= 100; i += 10) {
        const filled = Math.floor(i / 2.5);
        const empty = 40 - filled;
        barLine.innerHTML = `[<span class="bar-fill">${'█'.repeat(filled)}</span>${'░'.repeat(empty)}] ${i}%  ${(i * 133.71 / 100).toFixed(0)}B`;
        await sleep(80);
    }
    addLine('');
    await addLineAnimated(`'data.json' saved [13371/13371]`, 'success-text', 6);
}

function cmdLs(args) {
    const flag = args[0] || '';
    const files = Object.keys(fileSystem);
    if (flag === '-l' || flag === '-la') {
        addLine('total ' + files.length);
        if (flag === '-la') {
            addLine('drwxr-xr-x  2 aftab aftab  4096 Feb 13 01:00 <span class="dir-color">.</span>');
            addLine('drwxr-xr-x  3 aftab aftab  4096 Feb 13 01:00 <span class="dir-color">..</span>');
        }
        files.forEach(f => {
            const size = fileSystem[f].length;
            const perm = f.startsWith('.') ? '-rw-------' : '-rw-r--r--';
            const color = f.endsWith('.json') ? 'json-color' : f.endsWith('.yml') ? 'yml-color' : f.startsWith('.') ? 'hidden-color' : 'file-color';
            addLine(`${perm}  1 aftab aftab ${String(size).padStart(5)} Feb 13 01:00 <span class="${color}">${f}</span>`);
        });
    } else {
        addLine(files.map(f => {
            const color = f.endsWith('.json') ? 'json-color' : f.endsWith('.yml') ? 'yml-color' : f.startsWith('.') ? 'hidden-color' : 'file-color';
            return `<span class="${color}">${f}</span>`;
        }).join('  '));
    }
}

async function cmdCat(args) {
    const file = args[0];
    if (!file) {
        addLine('<span class="error-text">cat: missing file operand</span>');
        return;
    }
    if (fileSystem[file]) {
        const lines = fileSystem[file].split('\n');
        for (const line of lines) {
            addLine(escapeHtml(line));
            await sleep(20);
        }
    } else {
        addLine(`<span class="error-text">cat: ${escapeHtml(file)}: No such file or directory</span>`);
    }
}

function cmdPwd() {
    addLine('/home/aftab/portfolio');
}

function cmdTree() {
    const lines = [
        '<span class="dir-color">.</span>',
        '├── <span class="file-color">about.txt</span>',
        '├── <span class="file-color">skills.conf</span>',
        '├── <span class="json-color">projects.json</span>',
        '├── <span class="yml-color">contact.yml</span>',
        '├── <span class="file-color">readme.md</span>',
        '├── <span class="file-color">system.log</span>',
        '└── <span class="hidden-color">.secrets</span>',
        '',
        '0 directories, 7 files',
    ];
    lines.forEach(l => addLine(l));
}

async function cmdHack() {
    const input = document.getElementById('terminal-input');
    input.disabled = true;
    toggleMatrix(3);

    const phases = [
        { text: '[*] Initializing exploit framework...', delay: 400 },
        { text: '[*] Target: classified.gov.sys', delay: 300 },
        { text: '[*] Running reconnaissance...', delay: 500 },
        { text: '[+] Open ports found: 22, 80, 443, 8080', delay: 300 },
        { text: '[*] Brute-forcing SSH keys...', delay: 600 },
        { text: '[+] Key found: RSA-4096 ████████████', delay: 200 },
        { text: '[*] Bypassing firewall rules...', delay: 500 },
        { text: '[+] Firewall breached', delay: 200 },
        { text: '[*] Injecting payload...', delay: 400 },
        { text: '[*] Escalating privileges...', delay: 500 },
        { text: '[+] ROOT ACCESS OBTAINED', delay: 100 },
    ];

    for (const phase of phases) {
        await addLineAnimated(phase.text, phase.text.includes('[+]') ? 'success-text' : 'boot-text', 5);
        await sleep(phase.delay);
    }

    addLine('');
    // Skull ASCII
    const skullLines = SKULL_ASCII.split('\n');
    for (const line of skullLines) {
        addLine(`<span class="hack-skull">${escapeHtml(line)}</span>`);
        await sleep(30);
    }

    addLine('');
    await addLineAnimated('⚠ ACCESS GRANTED — Welcome to the mainframe, aftab.', 'hack-success', 8);
    await addLineAnimated('Just kidding. You\'re still on a portfolio website. 😄', 'hint-text', 10);

    matrixIntensity = 0.3;
    input.disabled = false;
    input.focus();
}

function cmdMatrix(args) {
    const level = parseInt(args[0]) || 0;
    if (level === 0 && matrixRunning) {
        matrixRunning = false;
        const canvas = document.getElementById('matrix-canvas');
        if (matrixCtx) matrixCtx.clearRect(0, 0, canvas.width, canvas.height);
        addLine('<span class="success-text">Matrix rain disabled.</span>');
    } else {
        const intensity = Math.min(level || 1, 3);
        toggleMatrix(intensity);
        addLine(`<span class="success-text">Matrix rain enabled — intensity: ${intensity}/3</span>`);
    }
}

function cmdTheme(args) {
    const t = (args[0] || '').toLowerCase();
    const overlay = document.getElementById('terminal-overlay');
    if (t === 'blue' || t === 'b') {
        overlay.className = 'terminal-overlay active blue-theme';
        terminalTheme = 'blue';
        addLine('<span class="success-text">Theme changed to BLUE</span>');
    } else if (t === 'amber' || t === 'a') {
        overlay.className = 'terminal-overlay active amber-theme';
        terminalTheme = 'amber';
        addLine('<span class="success-text">Theme changed to AMBER</span>');
    } else if (t === 'green' || t === 'g') {
        overlay.className = 'terminal-overlay active';
        terminalTheme = 'green';
        addLine('<span class="success-text">Theme changed to GREEN</span>');
    } else {
        addLine('Usage: theme <green|blue|amber> or <g|b|a>');
        addLine(`Current theme: <span class="info-val">${terminalTheme}</span>`);
    }
}

async function cmdSudo(args) {
    if (!args.length) {
        addLine('<span class="error-text">usage: sudo <command></span>');
        return;
    }
    await addLineAnimated('[sudo] password for aftab: ████████████', '', 8);
    await sleep(500);

    if (args[0] === 'rm' && args.includes('-rf') && args.includes('/')) {
        await addLineAnimated('Nice try, hacker.', 'error-text', 10);
        await addLineAnimated('sudo: /: Permission denied (and also, no.)', 'error-text', 10);
        return;
    }

    await addLineAnimated('✓ Authentication successful', 'success-text', 8);
    await sleep(200);

    const cmd = args.join(' ');
    if (commands[args[0]]) {
        await processCommand(cmd);
    } else {
        addLine(`sudo: ${args[0]}: command not found`);
    }
}

function cmdEcho(args) {
    addLine(args.join(' '));
}

function cmdHistory() {
    commandHistory.forEach((cmd, i) => {
        addLine(`  <span class="history-num">${String(i + 1).padStart(4)}</span>  ${escapeHtml(cmd)}`);
    });
}

function cmdMan(args) {
    const cmd = args[0];
    if (!cmd) {
        addLine('What manual page do you want?');
        return;
    }
    if (commands[cmd]) {
        addLine(`<span class="man-header">${cmd.toUpperCase()}(1)                 AFTAB Manual                 ${cmd.toUpperCase()}(1)</span>`);
        addLine('');
        addLine(`<span class="info-key">NAME</span>`);
        addLine(`       ${cmd} — portfolio terminal command`);
        addLine('');
        addLine(`<span class="info-key">DESCRIPTION</span>`);
        addLine(`       Execute the '${cmd}' command in the Aftab Portfolio Terminal.`);
        addLine(`       Part of the AftabOS terminal suite.`);
        addLine('');
        addLine(`<span class="info-key">AUTHOR</span>`);
        addLine('       Aftab Alam <aftabalamcasse@gmail.com>');
    } else {
        addLine(`No manual entry for ${escapeHtml(cmd)}`);
    }
}

function cmdFortune() {
    const fortunes = [
        '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
        '"First, solve the problem. Then, write the code." — John Johnson',
        '"Talk is cheap. Show me the code." — Linus Torvalds',
        '"Programs must be written for people to read, and only incidentally for machines to execute." — Harold Abelson',
        '"The best error message is the one that never shows up." — Thomas Fuchs',
        '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
        '"Simplicity is the soul of efficiency." — Austin Freeman',
        '"It\'s not a bug — it\'s an undocumented feature." — Anonymous',
        '"The only way to learn a new programming language is by writing programs in it." — Dennis Ritchie',
        '"Don\'t comment bad code — rewrite it." — Brian Kernighan',
    ];
    const quote = fortunes[Math.floor(Math.random() * fortunes.length)];
    addLine(`<span class="fortune-text">🔮 ${quote}</span>`);
}

function cmdCowsay(args) {
    const text = args.join(' ') || 'Moo! I am Aftab\'s cow.';
    const border = '─'.repeat(text.length + 2);
    addLine(` ╭${border}╮`);
    addLine(` │ ${escapeHtml(text)} │`);
    addLine(` ╰${border}╯`);
    addLine('        \\   ^__^');
    addLine('         \\  (oo)\\_______');
    addLine('            (__)\\       )\\/\\');
    addLine('                ||----w |');
    addLine('                ||     ||');
}

function cmdExport(args) {
    if (!args.length) {
        addLine('TERM=xterm-256color');
        addLine('SHELL=/bin/zsh');
        addLine('USER=aftab');
        addLine('HOME=/home/aftab');
        return;
    }
    const [key, ...rest] = args.join(' ').split('=');
    const val = rest.join('=');
    addLine(`export: ${key}=${val}`);
}

// ============ COMMAND PROCESSOR ============
async function processCommand(input) {
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (!cmd) return;

    updateCmdCount();

    if (commands[cmd]) {
        await commands[cmd](args);
    } else {
        addLine(`<span class="error-text">zsh: command not found: ${escapeHtml(cmd)}</span>`);
        // Find close matches
        const close = Object.keys(commands).filter(c => c.startsWith(cmd[0]) || c.includes(cmd));
        if (close.length > 0) {
            addLine(`<span class="hint-text">Did you mean: ${close.slice(0, 3).join(', ')}?</span>`);
        }
    }
}

// ============ TAB COMPLETION ============
function tabComplete(partial) {
    const cmdNames = Object.keys(commands);
    const fileNames = Object.keys(fileSystem);
    const allOptions = [...cmdNames, ...fileNames];

    const parts = partial.split(/\s+/);
    if (parts.length <= 1) {
        const matches = cmdNames.filter(c => c.startsWith(parts[0].toLowerCase()));
        if (matches.length === 1) return matches[0];
        if (matches.length > 1) {
            addLine(matches.join('  '));
            return partial;
        }
    } else {
        const fileMatches = fileNames.filter(f => f.startsWith(parts[parts.length - 1]));
        if (fileMatches.length === 1) {
            parts[parts.length - 1] = fileMatches[0];
            return parts.join(' ');
        }
        if (fileMatches.length > 1) {
            addLine(fileMatches.join('  '));
        }
    }
    return partial;
}

// ============ INPUT HANDLER ============
function setupTerminal() {
    const input = document.getElementById('terminal-input');
    const overlay = document.getElementById('terminal-overlay');
    const toggle = document.getElementById('terminal-toggle');
    const close = document.getElementById('terminal-close');
    const themeToggle = document.getElementById('theme-toggle');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');

    if (!input || !overlay) return;

    // Terminal toggle
    if (toggle) {
        toggle.addEventListener('click', () => {
            if (overlay.classList.contains('active')) {
                cmdExit();
            } else {
                overlay.classList.add('active');
                toggle.classList.add('active');
                initMatrix();
                bootSequence();
            }
        });
    }

    // Close button
    if (close) {
        close.addEventListener('click', cmdExit);
    }

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' && e.ctrlKey) {
            e.preventDefault();
            if (overlay.classList.contains('active')) {
                cmdExit();
            } else {
                overlay.classList.add('active');
                if (toggle) toggle.classList.add('active');
                initMatrix();
                bootSequence();
            }
        }
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            cmdExit();
        }
    });

    // Input handler
    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            if (!val) return;

            commandHistory.push(val);
            historyIndex = commandHistory.length;

            addPromptEcho(val);
            input.value = '';
            input.disabled = true;

            await processCommand(val);

            input.disabled = false;
            input.focus();
            addLine('');
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            input.value = tabComplete(input.value);
        }

        if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            cmdClear();
        }
    });

    // Theme toggle
    if (themeToggle) {
        const savedTheme = localStorage.getItem('portfolioTheme');
        if (savedTheme === 'light') document.body.classList.add('light-theme');
        themeToggle.classList.toggle('active', savedTheme === 'light');

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            themeToggle.classList.toggle('active', isLight);
            localStorage.setItem('portfolioTheme', isLight ? 'light' : 'dark');
        });
    }

    // Hamburger — fully manual: you open it, you close it
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close nav when a link is tapped
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // Active nav
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(a => {
        a.classList.remove('active');
        const href = a.getAttribute('href');
        if (href === currentPage) {
            a.classList.add('active');
        }
        if (currentPage.startsWith('project-') && href === 'projects.html') {
            a.classList.add('active');
        }
    });

    // Contact form
    const contactForm = document.querySelector('form[action*="web3forms"]');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            try {
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                });
                if (res.ok) {
                    btn.textContent = '✓ Sent!';
                    contactForm.reset();
                } else {
                    btn.textContent = '✗ Error';
                }
            } catch {
                btn.textContent = '✗ Error';
            }
            setTimeout(() => {
                btn.textContent = orig;
                btn.disabled = false;
            }, 3000);
        });
    }
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', setupTerminal);
