
(() => {
    "use strict";

    // ============================================
    // LIZARD OS
    // A completely unnecessary JavaScript engine
    // ============================================

    const $ = selector => document.querySelector(selector);
    const $$ = selector => [...document.querySelectorAll(selector)];

    const random = (min, max) =>
        Math.random() * (max - min) + min;

    const pick = array =>
        array[Math.floor(Math.random() * array.length)];

    const STORAGE_KEY = "lizardOS-save-v2";
    const startTime = Date.now();
    const originalTitle = document.title;
    const lizard = $("body > img");

    const emojis = [
        "🐸", "🦎", "🍒", "💀", "🗿",
        "🔥", "✨", "👽", "🛸", "🐈",
        "🍕", "💥", "🪩", "👁️", "🧀"
    ];

    // ============================================
    // SAVE DATA
    // ============================================

    function loadSave() {
        try {
            const data = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "{}"
            );

            return {
                clicks: Number(data.clicks) || 0,
                lizardClicks: Number(data.lizardClicks) || 0,
                chaos: Number(data.chaos) || 0,
                achievements: Array.isArray(data.achievements)
                    ? data.achievements
                    : []
            };
        } catch {
            return {
                clicks: 0,
                lizardClicks: 0,
                chaos: 0,
                achievements: []
            };
        }
    }

    const save = loadSave();

    let clicks = save.clicks;
    let lizardClicks = save.lizardClicks;
    let chaos = save.chaos;

    let discoActive = false;
    let trailActive = false;
    let gravityActive = false;
    let escapeMode = false;
    let divCopies = 0;

    const achievements = new Set(save.achievements);

    function saveProgress() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    clicks,
                    lizardClicks,
                    chaos,
                    achievements: [...achievements]
                })
            );
        } catch {
            console.warn("Unable to save progress.");
        }
    }

    // ============================================
    // ACHIEVEMENT DEFINITIONS
    // ============================================

    const achievementDefinitions = [
        {
            id: "visitor",
            name: "Welcome!",
            description: "Visit the website."
        },
        {
            id: "patience",
            name: "Still Here",
            description: "Stay for one minute."
        },
        {
            id: "dedication",
            name: "Time Waster",
            description: "Stay for ten minutes."
        },
        {
            id: "lizard",
            name: "Lizard Whisperer",
            description: "Click the lizard."
        },
        {
            id: "lizard20",
            name: "Reptile Harassment",
            description: "Click the lizard 20 times."
        },
        {
            id: "click10",
            name: "Professional Clicker",
            description: "Click 10 times."
        },
        {
            id: "click50",
            name: "Mouse Destroyer",
            description: "Click 50 times."
        },
        {
            id: "click100",
            name: "Please Go Outside",
            description: "Click 100 times."
        },
        {
            id: "disco",
            name: "Disco Inferno",
            description: "Activate disco mode."
        },
        {
            id: "gravity",
            name: "Physics Is Optional",
            description: "Break gravity."
        },
        {
            id: "hacker",
            name: "Elite Hacker",
            description: "Open the terminal."
        },
        {
            id: "matrix",
            name: "Entered The Matrix",
            description: "Activate Matrix rain."
        },
        {
            id: "chaos",
            name: "Chaos Engineer",
            description: "Activate maximum chaos."
        },
        {
            id: "konami",
            name: "Secret Code Master",
            description: "Discover the legendary cheat code."
        },
        {
            id: "chicken",
            name: "Chicken Joe Enjoyer",
            description: "Discover Chicken Joe."
        },
        {
            id: "developer",
            name: "Console Archaeologist",
            description: "Find the developer console secret."
        },
        {
            id: "scramble",
            name: "Word Salad",
            description: "Scramble the heading."
        },
        {
            id: "words",
            name: "Word Wizard",
            description: "Make a word jump."
        },
        {
            id: "cell",
            name: "Spreadsheet Gamer",
            description: "Interact with a table cell."
        },
        {
            id: "mitochondria",
            name: "Biology Expert",
            description: "Investigate the powerhouse of the cell."
        },
        {
            id: "clone",
            name: "Copy Machine",
            description: "Duplicate a div."
        },
        {
            id: "clone5",
            name: "Divception",
            description: "Create five div copies."
        },
        {
            id: "collector",
            name: "Achievement Hunter",
            description: "Unlock ten achievements."
        },
        {
            id: "completionist",
            name: "Completionist",
            description: "Unlock every other achievement."
        }
    ];

    function getAchievement(id) {
        return achievementDefinitions.find(a => a.id === id);
    }

    // ============================================
    // CONTROL PANEL
    // ============================================

    const panel = document.createElement("aside");
    panel.id = "fun-panel";

    panel.innerHTML = `
        <h3>⚙️ completely necessary controls</h3>
        <div id="controls"></div>
        <div id="stats"></div>
        <small>Press ? for keyboard shortcuts</small>
    `;

    document.body.append(panel);

    function addButton(label, callback) {
        const button = document.createElement("button");
        button.textContent = label;
        button.addEventListener("click", callback);
        $("#controls").append(button);
        return button;
    }

    // ============================================
    // TOAST NOTIFICATIONS
    // ============================================

    let toastTimer;

    function toast(message) {
        $("#toast")?.remove();
        clearTimeout(toastTimer);

        const element = document.createElement("div");
        element.id = "toast";
        element.textContent = message;

        document.body.append(element);

        toastTimer = setTimeout(() => {
            element.remove();
        }, 2500);
    }

    // ============================================
    // PARTICLE ENGINE
    // ============================================

    function particle(x, y, emoji = pick(emojis)) {
        const element = document.createElement("span");
        element.className = "particle";
        element.textContent = emoji;

        element.style.left = x + "px";
        element.style.top = y + "px";

        document.body.append(element);

        const dx = random(-220, 220);
        const dy = random(-280, 120);
        const rotation = random(-720, 720);

        const animation = element.animate([
            {
                transform: "translate(0,0) rotate(0deg)",
                opacity: 1
            },
            {
                transform:
                    `translate(${dx}px,${dy}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: random(700, 1800),
            easing: "ease-out"
        });

        animation.finished
            .then(() => element.remove())
            .catch(() => element.remove());
    }

    function confetti(amount = 50) {
        for (let i = 0; i < amount; i++) {
            setTimeout(() => {
                particle(
                    random(0, innerWidth),
                    random(0, innerHeight),
                    pick(["🎉", "✨", "🎊", "⭐"])
                );
            }, i * 12);
        }
    }

    // ============================================
    // ACHIEVEMENTS
    // ============================================

    function achievement(id) {
        if (achievements.has(id)) return;

        const definition = getAchievement(id);
        if (!definition) return;

        achievements.add(id);
        saveProgress();

        const badge = document.createElement("div");
        badge.className = "achievement";
        badge.textContent = "🏆 " + definition.name;

        document.body.append(badge);

        setTimeout(() => badge.remove(), 3500);

        confetti(25);
        updateAchievementTracker();

        // Achievement Hunter
        const normalAchievements = achievementDefinitions.filter(
            a => !["collector", "completionist"].includes(a.id)
        );

        const unlockedNormal = normalAchievements.filter(
            a => achievements.has(a.id)
        ).length;

        if (unlockedNormal >= 10) {
            achievement("collector");
        }

        // Completionist
        if (
            unlockedNormal === normalAchievements.length &&
            achievements.has("collector")
        ) {
            achievement("completionist");
        }
    }

    // ============================================
    // ACHIEVEMENT TRACKER
    // ============================================

    const tracker = document.createElement("section");
    tracker.id = "achievement-tracker";
    tracker.className = "hidden";

    tracker.innerHTML = `
        <div class="tracker-header">
            <h2>🏆 achievements</h2>
            <button id="close-achievements">X</button>
        </div>

        <p id="achievement-summary"></p>

        <progress
            id="achievement-progress"
            value="0"
            max="100">
        </progress>

        <div id="achievement-list"></div>

        <button id="reset-achievements">
            Reset Progress
        </button>
    `;

    document.body.append(tracker);

    function updateAchievementTracker() {
        const list = $("#achievement-list");
        if (!list) return;

        list.replaceChildren();

        const unlocked = achievementDefinitions.filter(
            a => achievements.has(a.id)
        ).length;

        const total = achievementDefinitions.length;
        const percent = Math.round(unlocked / total * 100);

        $("#achievement-summary").textContent =
            `${unlocked}/${total} unlocked (${percent}%)`;

        $("#achievement-progress").value = percent;

        const sorted = [...achievementDefinitions].sort(
            (a, b) =>
                Number(achievements.has(b.id)) -
                Number(achievements.has(a.id))
        );

        sorted.forEach(item => {
            const isUnlocked = achievements.has(item.id);

            const card = document.createElement("article");

            card.className =
                "achievement-card " +
                (isUnlocked ? "unlocked" : "locked");

            const title = document.createElement("strong");
            title.textContent =
                (isUnlocked ? "🏆 " : "🔒 ") + item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const status = document.createElement("small");
            status.textContent =
                isUnlocked ? "UNLOCKED" : "LOCKED";

            card.append(title, description, status);
            list.append(card);
        });
    }

    function openAchievements() {
        updateAchievementTracker();
        tracker.classList.remove("hidden");
    }

    function closeAchievements() {
        tracker.classList.add("hidden");
    }

    $("#close-achievements").onclick = closeAchievements;

    $("#reset-achievements").onclick = () => {
        if (!confirm("Reset achievements and statistics?")) return;

        achievements.clear();
        clicks = 0;
        lizardClicks = 0;
        chaos = 0;

        saveProgress();
        updateAchievementTracker();
        updateStats();

        toast("progress has been reset");
    };

    // ============================================
    // INTERACTIVE HEADING
    // ============================================

    const heading = $("body > h1");
    const originalHeading = heading.textContent;

    heading.classList.add("interactive-heading");
    heading.title = "Click to scramble, double-click to restore";

    function scrambleText(text) {
        return text.split(" ").map(word => {
            const letters = [...word];

            for (let i = letters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [letters[i], letters[j]] =
                    [letters[j], letters[i]];
            }

            return letters.join("");
        }).join(" ");
    }

    heading.addEventListener("click", () => {
        heading.textContent = scrambleText(originalHeading);
        achievement("scramble");
        chaos++;
        saveProgress();
    });

    heading.addEventListener("dblclick", () => {
        heading.textContent = originalHeading;
        toast("heading restored");
    });

    // ============================================
    // INTERACTIVE PARAGRAPH WORDS
    // ============================================

    function makeWordsInteractive(paragraph) {
        const originalText = paragraph.textContent;
        const parts = originalText.split(/(\s+)/);

        paragraph.replaceChildren();

        parts.forEach(part => {
            if (!part) return;

            if (/^\s+$/.test(part)) {
                paragraph.append(document.createTextNode(part));
                return;
            }

            const word = document.createElement("span");
            word.className = "fun-word";
            word.textContent = part;
            word.title = "Click me";

            word.addEventListener("click", event => {
                word.classList.remove("word-jump");
                void word.offsetWidth;
                word.classList.add("word-jump");

                particle(
                    event.clientX,
                    event.clientY,
                    "✨"
                );

                achievement("words");
            });

            paragraph.append(word);
        });
    }

    makeWordsInteractive($("body > p"));

    // ============================================
    // LIZARD INTERACTIONS
    // ============================================

    lizard.title = "click me. i dare you.";

    lizard.addEventListener("click", event => {
        lizardClicks++;
        chaos++;

        saveProgress();

        for (let i = 0; i < 12; i++) {
            particle(
                event.clientX,
                event.clientY,
                pick(["🍒", "🦎", "✨"])
            );
        }

        lizard.style.transform =
            `rotate(${random(-20, 20)}deg)
             scale(${random(0.8, 1.2)})`;

        setTimeout(() => {
            lizard.style.transform = "";
        }, 300);

        toast(pick([
            "the lizard has acknowledged you",
            "please stop touching the lizard",
            "the lizard knows what you did",
            "cherry acquired",
            "lizard.exe is not responding",
            "you have angered the reptile"
        ]));

        achievement("lizard");

        if (lizardClicks >= 20) {
            achievement("lizard20");
        }
    });

    function toggleEscape() {
        escapeMode = !escapeMode;

        toast(escapeMode
            ? "the lizard fears your cursor"
            : "the lizard has calmed down");
    }

    lizard.addEventListener("mouseenter", () => {
        if (!escapeMode) return;

        const distance = random(30, 130);

        lizard.style.transform =
            `translate(${random(-distance, distance)}px,
                       ${random(-distance, distance)}px)`;

        chaos++;
        saveProgress();
    });

    // ============================================
    // INTERACTIVE TABLE
    // ============================================

    const cells = $$("body > table td");

    cells.forEach((cell, index) => {
        cell.classList.add("fun-cell");
        cell.title = "Click for a surprise";

        cell.addEventListener("click", event => {
            achievement("cell");

            switch (index) {
                case 0:
                    toast("⚡ ATP PRODUCTION ACTIVATED");
                    confetti(30);
                    achievement("mitochondria");
                    break;

                case 1:
                    cell.classList.toggle("flipped-cell");
                    toast("this is STILL a table btw");
                    break;

                case 2:
                    cell.classList.toggle("readable-cell");

                    toast(
                        cell.classList.contains("readable-cell")
                            ? "readability improved by 9000%"
                            : "readability revoked"
                    );
                    break;

                case 3:
                    particle(
                        event.clientX,
                        event.clientY,
                        "🐔"
                    );

                    achievement("chicken");
                    toast("🐔 CHICKEN JOE APPROVES");
                    break;
            }
        });
    });

    // ============================================
    // DIV CLONING MACHINE
    // ============================================

    const originalDiv = $("body > div");

    originalDiv.classList.add("cloneable-div");
    originalDiv.title = "Click to clone this div";

    function addCloneBehavior(element) {
        element.addEventListener("click", () => {
            if (divCopies >= 12) {
                toast("maximum div capacity reached");
                return;
            }

            const clone = originalDiv.cloneNode(true);

            clone.classList.add("cloneable-div");
            clone.title = "Click to clone this div";

            element.after(clone);
            addCloneBehavior(clone);

            divCopies++;

            achievement("clone");

            if (divCopies >= 5) {
                achievement("clone5");
            }

            toast(`divs successfully duplicated: ${divCopies}`);
        });
    }

    addCloneBehavior(originalDiv);

    // ============================================
    // RANDOM BACKGROUND
    // ============================================

    function randomBackground() {
        const hue = Math.floor(random(0, 360));

        document.body.style.background =
            `hsl(${hue}, 80%, 85%)`;

        chaos++;
        saveProgress();

        toast("the background has evolved");
    }

    // ============================================
    // DISCO MODE
    // ============================================

    function disco() {
        discoActive = !discoActive;

        document.body.classList.toggle(
            "disco",
            discoActive
        );

        toast(discoActive
            ? "🪩 DISCO MODE ENABLED"
            : "disco privileges revoked");

        if (discoActive) {
            achievement("disco");
        }
    }

    // ============================================
    // CURSOR TRAIL
    // ============================================

    let lastTrail = 0;

    document.addEventListener("pointermove", event => {
        if (!trailActive) return;
        if (Date.now() - lastTrail < 65) return;

        lastTrail = Date.now();

        particle(
            event.clientX,
            event.clientY,
            pick(["✨", "⭐", "🍒"])
        );
    });

    function toggleTrail() {
        trailActive = !trailActive;

        toast(trailActive
            ? "your cursor has been upgraded"
            : "cursor returned to normal");
    }

    // ============================================
    // GRAVITY MODE
    // ============================================

    const originalTransforms = new Map();

    function toggleGravity() {
        gravityActive = !gravityActive;

        const elements = $$(
            "body > h1, body > p, body > img, " +
            "body > table, body > div.cloneable-div"
        );

        if (gravityActive) {
            elements.forEach(element => {
                originalTransforms.set(
                    element,
                    element.style.transform
                );

                element.style.transition =
                    "transform 0.7s ease";

                element.style.transform =
                    `translateY(${random(5, 45)}px)
                     rotate(${random(-12, 12)}deg)`;
            });

            achievement("gravity");
            toast("gravity has become unreliable");
        } else {
            elements.forEach(element => {
                element.style.transform =
                    originalTransforms.get(element) || "";
            });

            toast("gravity restored");
        }
    }

    // ============================================
    // SPEECH SYNTHESIS
    // ============================================

    function speak() {
        if (!("speechSynthesis" in window)) {
            toast("your browser cannot speak");
            return;
        }

        const phrases = [
            "The mitochondria is the powerhouse of the cell.",
            "Chicken Joe.",
            "I have no style bro.",
            "The lizard is watching.",
            "This website is extremely functional.",
            "You should probably be doing something productive."
        ];

        speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(pick(phrases));

        utterance.rate = random(0.7, 1.5);
        utterance.pitch = random(0.5, 1.8);

        speechSynthesis.speak(utterance);
    }

    // ============================================
    // RANDOM FONT SIZE
    // ============================================

    function randomFont() {
        const size = Math.floor(random(12, 26));

        document.body.style.fontSize = size + "px";

        chaos++;
        saveProgress();

        toast(`font size: ${size}px. why not.`);
    }

    // ============================================
    // MAXIMUM CHAOS
    // ============================================

    function maximumChaos() {
        randomBackground();
        confetti(100);
        randomFont();
        speak();

        if (!discoActive) disco();
        if (!trailActive) toggleTrail();

        document.title = "CHAOS CHAOS CHAOS";

        chaos += 10;
        saveProgress();

        achievement("chaos");
    }

    // ============================================
    // FAKE TERMINAL
    // ============================================

    const terminal = document.createElement("div");
    terminal.id = "terminal";
    terminal.className = "hidden";

    terminal.innerHTML = `
        <strong>lizardOS v0.0.2</strong>
        <button id="close-terminal">X</button>
        <hr>
        <div id="terminal-output">Type 'help' for commands.</div>
        <input
            id="terminal-input"
            placeholder="guest@lizard:~$"
            autocomplete="off">
    `;

    document.body.append(terminal);

    const terminalInput = $("#terminal-input");
    const terminalOutput = $("#terminal-output");

    function print(message) {
        terminalOutput.textContent += "\n" + message;
        terminalOutput.scrollTop =
            terminalOutput.scrollHeight;
    }

    function openTerminal() {
        terminal.classList.remove("hidden");
        terminalInput.focus();
        achievement("hacker");
    }

    function closeTerminal() {
        terminal.classList.add("hidden");
    }

    $("#close-terminal").onclick = closeTerminal;

    // ============================================
    // MATRIX RAIN
    // ============================================

    let matrixCanvas = null;
    let matrixTimer = null;

    function matrixRain() {
        if (matrixCanvas) {
            matrixCanvas.remove();
            clearInterval(matrixTimer);

            matrixCanvas = null;
            matrixTimer = null;

            return;
        }

        matrixCanvas = document.createElement("canvas");

        matrixCanvas.style.cssText = `
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 900;
            pointer-events: none;
            opacity: 0.4;
        `;

        document.body.append(matrixCanvas);

        const ctx = matrixCanvas.getContext("2d");

        if (!ctx) {
            matrixCanvas.remove();
            matrixCanvas = null;
            return;
        }

        const fontSize = 16;
        let drops = [];

        function resizeMatrix() {
            if (!matrixCanvas) return;

            matrixCanvas.width = innerWidth;
            matrixCanvas.height = innerHeight;

            drops = Array(
                Math.ceil(matrixCanvas.width / fontSize)
            ).fill(0);
        }

        resizeMatrix();

        window.addEventListener("resize", resizeMatrix);

        function draw() {
            ctx.fillStyle = "rgba(0,0,0,0.08)";

            ctx.fillRect(
                0,
                0,
                matrixCanvas.width,
                matrixCanvas.height
            );

            ctx.fillStyle = "#00ff00";
            ctx.font = fontSize + "px monospace";

            drops.forEach((y, i) => {
                const char = pick([
                    "0", "1", "リ", "ザ", "ド"
                ]);

                ctx.fillText(
                    char,
                    i * fontSize,
                    y * fontSize
                );

                if (
                    y * fontSize > matrixCanvas.height &&
                    Math.random() > 0.975
                ) {
                    drops[i] = 0;
                } else {
                    drops[i]++;
                }
            });
        }

        matrixTimer = setInterval(draw, 50);

        achievement("matrix");
        toast("press M again to exit the matrix");
    }

    // ============================================
    // TERMINAL COMMANDS
    // ============================================

    const commands = {
        help() {
            return `Available commands:
help, clear, whoami, ls, date, uptime,
sudo, hack, lizard, chicken, matrix,
party, confetti, color, achievements,
trophies, stats, fortune, exit`;
        },

        whoami() {
            return "a highly sophisticated website visitor";
        },

        ls() {
            return "lizard.png  chicken_joe.txt  secrets/";
        },

        date() {
            return new Date().toString();
        },

        uptime() {
            return Math.floor(
                (Date.now() - startTime) / 1000
            ) + " seconds";
        },

        sudo() {
            return "you are not in the sudoers file. this incident will be reported.";
        },

        hack() {
            return "HACKING THE MAINFRAME...\nACCESS DENIED\nreason: insufficient lizard";
        },

        lizard() {
            lizard.click();
            return "lizard protocol activated";
        },

        chicken() {
            achievement("chicken");
            return "chicken joe sends his regards";
        },

        matrix() {
            matrixRain();
            return "entering the matrix...";
        },

        party() {
            maximumChaos();
            return "party protocol activated";
        },

        confetti() {
            confetti(100);
            return "celebration deployed";
        },

        color() {
            randomBackground();
            return "color changed";
        },

        achievements() {
            return [...achievements]
                .map(id => getAchievement(id)?.name || id)
                .join("\n") || "no achievements unlocked";
        },

        trophies() {
            openAchievements();
            return "opening achievement collection...";
        },

        stats() {
            return `Clicks: ${clicks}
Lizard Clicks: ${lizardClicks}
Chaos: ${chaos}
Achievements: ${achievements.size}/${achievementDefinitions.length}`;
        },

        fortune() {
            return pick([
                "you will encounter a mysterious lizard",
                "your CSS will compile. somehow.",
                "beware the chicken joe",
                "a div will change your destiny",
                "the table knows too much"
            ]);
        },

        clear() {
            terminalOutput.textContent = "";
            return "";
        },

        exit() {
            closeTerminal();
            return "goodbye";
        }
    };

    terminalInput.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;

        const input = terminalInput.value.trim();

        if (!input) return;

        const command =
            input.toLowerCase().split(/\s+/)[0];

        print("guest@lizard:~$ " + input);

        if (commands[command]) {
            const result = commands[command]();

            if (result) print(result);
        } else {
            print("command not found: " + command);
        }

        terminalInput.value = "";
    });

    // ============================================
    // RANDOM EVENTS
    // ============================================

    const randomEvents = [
        () => toast("a wild chicken joe appears"),
        () => confetti(20),
        () => document.title = "the lizard is watching",
        () => particle(
            random(0, innerWidth),
            random(0, innerHeight),
            "🦎"
        ),
        () => toast("error 418: i'm a teapot"),
        () => toast("you found absolutely nothing"),
        () => toast("achievement progress: probably"),
        () => {
            document.body.style.letterSpacing =
                random(0, 3) + "px";
        }
    ];

    function randomEvent() {
        pick(randomEvents)();
        chaos++;
        saveProgress();
    }

    // ============================================
    // KONAMI CODE
    // ============================================

    const konami = [
        "ArrowUp", "ArrowUp",
        "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight",
        "ArrowLeft", "ArrowRight",
        "b", "a"
    ];

    let konamiProgress = 0;

    document.addEventListener("keydown", event => {
        if (event.target.matches("input, textarea")) return;

        const key = event.key.length === 1
            ? event.key.toLowerCase()
            : event.key;

        if (key === konami[konamiProgress]) {
            konamiProgress++;
        } else {
            konamiProgress =
                key === konami[0] ? 1 : 0;
        }

        if (konamiProgress === konami.length) {
            konamiProgress = 0;

            maximumChaos();
            achievement("konami");
        }
    });

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    document.addEventListener("keydown", event => {
        if (event.target.matches("input, textarea")) {
            if (event.key === "Escape") {
                closeTerminal();
            }
            return;
        }

        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }

        switch (event.key.toLowerCase()) {
            case "?":
                toast("C=confetti D=disco T=terminal M=matrix G=gravity R=random P=party A=achievements");
                break;

            case "c":
                confetti();
                break;

            case "d":
                disco();
                break;

            case "t":
                openTerminal();
                break;

            case "m":
                matrixRain();
                break;

            case "g":
                toggleGravity();
                break;

            case "r":
                randomEvent();
                break;

            case "p":
                maximumChaos();
                break;

            case "a":
                openAchievements();
                break;

            case "escape":
                closeTerminal();
                closeAchievements();
                break;
        }
    });

    // ============================================
    // CLICK TRACKING
    // ============================================

    document.addEventListener("click", event => {
        clicks++;

        if (clicks >= 10) achievement("click10");
        if (clicks >= 50) achievement("click50");
        if (clicks >= 100) achievement("click100");

        if (event.target.closest("td")) {
            particle(
                event.clientX,
                event.clientY,
                "🧀"
            );
        }

        saveProgress();
        updateStats();
    });

    // ============================================
    // PAGE STATISTICS
    // ============================================

    function updateStats() {
        const uptime = Math.floor(
            (Date.now() - startTime) / 1000
        );

        $("#stats").textContent =
            `clicks: ${clicks} | ` +
            `lizard: ${lizardClicks} | ` +
            `chaos: ${chaos} | ` +
            `uptime: ${uptime}s | ` +
            `achievements: ${achievements.size}/${achievementDefinitions.length}`;
    }

    setInterval(updateStats, 1000);

    // ============================================
    // CONTROL PANEL BUTTONS
    // ============================================

    addButton("🎉 Confetti", () => confetti());
    addButton("🪩 Disco", disco);
    addButton("🎨 Random Color", randomBackground);
    addButton("🖥️ Terminal", openTerminal);
    addButton("🐸 Emoji Trail", toggleTrail);
    addButton("🌍 Gravity", toggleGravity);
    addButton("🦎 Escape Lizard", toggleEscape);
    addButton("🗣️ Speak", speak);
    addButton("🔡 Random Font", randomFont);
    addButton("💻 Matrix", matrixRain);
    addButton("🎲 Random Event", randomEvent);
    addButton("💥 MAX CHAOS", maximumChaos);
    addButton("🏆 Achievements", openAchievements);

    // ============================================
    // TIME-BASED ACHIEVEMENTS
    // ============================================

    setTimeout(() => {
        achievement("visitor");
    }, 3000);

    setTimeout(() => {
        achievement("patience");
    }, 60000);

    setTimeout(() => {
        achievement("dedication");
    }, 600000);

    // ============================================
    // TAB VISIBILITY
    // ============================================

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            document.title = "come back bro :(";
        } else {
            document.title = originalTitle;

            toast(
                "welcome back. the lizard missed you."
            );
        }
    });

    // ============================================
    // DEVELOPER CONSOLE SECRETS
    // ============================================

    window.secretLizard = () => {
        confetti(200);

        achievement("developer");

        toast("THE SECRET LIZARD HAS AWAKENED");
    };

    window.showAchievements = openAchievements;

    console.log(`
    ===============================
       WELCOME TO LIZARD OS
    ===============================

    congratulations.
    you opened developer tools.

    try typing:

    window.secretLizard()

    or

    window.showAchievements()
    `);

    // ============================================
    // INITIALIZATION
    // ============================================

    updateStats();
    updateAchievementTracker();

    // Restore previously earned milestones
    if (clicks >= 10) achievement("click10");
    if (clicks >= 50) achievement("click50");
    if (clicks >= 100) achievement("click100");

    if (lizardClicks >= 20) {
        achievement("lizard20");
    }

})();

