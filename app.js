/**
 * Left-Hand Typing Practice Logic
 */

// --- Word Bank ---
// Curated list of pure or predominantly left-hand words on a QWERTY keyboard.
// Left hand keys: q, w, e, r, t, a, s, d, f, g, z, x, c, v, b
const leftHandWords = [
    // Strict Left-Hand Words - Basic
    "sweater", "water", "secret", "create", "after", "badges",
    "stare", "star", "start", "state", "taste", "waste", "west", "test", "rest",
    "best", "vest", "fast", "cast", "vast", "mast", "last", "profile",
    "sweat", "sweet", "greet", "great", "treat", "retreat", "street",
    "free", "tree", "three", "there", "where", "were", "we", "be",
    "great", "bread", "trade", "water", "stare", "crate", "create",
    "feature", "weather", "treat", "after", "drawer", "sweater", "craft",
    "reward", "thread", "street", "starter", "forest", "reader", "writer",
    "brave", "greet", "weaver", "sweat", "draft", "grace", "brace",
    "break", "tread", "weird", "rewarded", "crafted", "steward", "stewardess",
    "create", "react", "trace", "crater", "treats", "waters", "faster",
    "sweeter", "greater", "breast", "streak", "streaked", "threaded",
    "breeder", "reader", "recreate", "stew", "stews", "west", "western",
    "wester", "sewer", "sewers", "sewed", "sewered", "crate", "crates", "traces",
    "traced", "tracer", "tracers", "sweater", "sweaters", "fret", "frets",
    "freed", "freer", "freest", "fewer", "fewerest", "weaver", "weavers",
    "weaved", "weaving", "reaver", "reavers", "reave", "reaved", "reaves",
    "braver", "bravest", "brewed", "brewer", "brewers", "brew",
    "brews", "breads", "breaded", "breaker", "breakers", "break", "breaks",
    "breaking", "freak", "freaks", "freaked", "freaker", "freakers", "wreak",
    "wreaks", "wreaked", "wreaker", "wreakers", "swept", "sweeper",
    "sweepers", "sweep", "sweeps", "sweeping", "sweat", "sweats", "sweated",
    "sweater", "sweaters", "sweaty", "treaty", "treaties", "treat", "treats",
    "treating", "treated", "treater", "tread", "treads", "treading", "treader",
    "treaders", "thread", "threads", "threaded", "threader", "threaders",
    "street", "streets", "streeted", "streeter", "streeters", "stew",
    "stews", "stewed", "stewer", "stewers", "steward", "stewards",
    "stewarded", "stewarding", "sewer", "sewers", "sewered", "sewering",
    "sewerage", "wear", "wears", "wearing", "wearer", "wearers", "wearied",
    "wearier", "weariest", "weariness", "weary", "weave", "weaves",
    "weaving", "weaver", "weavers", "weaved", "weird", "weirder",
    "weirdest", "weirdness", "weirdly", "weirding", "weir",
    "weirs", "writer", "writers", "writing", "write", "writes",
    "written", "wrote", "rewrite", "rewrites", "rewriting",
    "rewritten", "reader", "readers", "reading", "reads", "read",
    "ready", "readier", "readiest", "readiness", "reared", "rear",
    "rears", "rearing", "rearer", "rearers", "reward", "rewards", "rewarded", "rewarding",
    // Strict Left-Hand Words - Advanced/Longer
    "stewardesses", "desegregated", "reverberated", "exaggerated", "exacerbated",
    "devastate", "vertebrate", "extraterrestrial", "reverberate", "degraded",
    "recreated", "retreated", "federated", "segregated", "defenseless",
    "decreased", "reserved", "reversed", "deserved", "severed",
    "abstracted", "attracted", "distracted", "extracted", "retracted",
    "carcasses", "databases", "terraces", "caterers", "craters",
    "barbarian", "cabaret", "cataract", "abracadabra",
    // More Strict/Predominantly Left-Hand Words
    "exact", "excess", "exceed", "effect", "defect", "decrease", "address",
    "access", "assess", "asset", "assist", "assert", "arrest", "average",
    "brave", "crave", "grave", "grace", "trace", "brace", "face", "race",
    "breeze", "freeze", "sneeze", "cheese", "crease", "grease", "cease",
    "creed", "breed", "steed", "bleed", "speed", "greed", "freed", "agreed",
    "degree", "decree", "referee", "efforts", "affects", "effects"
];

// --- State ---
const NUM_WORDS_TO_LOAD = 30; // How many words to have in the queue at once
let wordSequence = [];
let currentWordIndex = 0; // Index in wordSequence
let wordsTyped = 0;
let errors = 0;
let totalKeystrokes = 0;
let startTime = null;
let isStarted = false;
let testDuration = 60; // 60 seconds test
let timeLeft = 60; // For visible display
let timerInterval;

// --- DOM Elements ---
const wordDisplay = document.getElementById('word-display');
const typeInput = document.getElementById('type-input');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress-bar');
const allKeys = document.querySelectorAll('.key');

// --- Initialization ---
function init() {
    resetState();
    loadWordSequence();
    setupEventListeners();
    typeInput.focus();
}

function resetState() {
    clearInterval(timerInterval);
    isStarted = false;
    wordSequence = [];
    currentWordIndex = 0;
    wordsTyped = 0;
    errors = 0;
    totalKeystrokes = 0;
    startTime = null;
    timeLeft = testDuration;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';

    // Check if time-display exists, if not we will inject it in JS or assume it will be there
    const timeDisplay = document.getElementById('time-left') || wpmDisplay; // fallback
    if (document.getElementById('time-left')) {
        document.getElementById('time-left').textContent = timeLeft;
    }

    progressBar.style.width = '0%';
    progressBar.style.background = 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))';
    typeInput.value = "";
    typeInput.disabled = false;
    wordDisplay.style.top = '0px'; // Reset scroll
    allKeys.forEach(k => {
        k.classList.remove('active', 'error');
    });
}

// --- Logic ---
function getRandomWord() {
    return leftHandWords[Math.floor(Math.random() * leftHandWords.length)];
}

function loadWordSequence() {
    wordSequence = [];
    for (let i = 0; i < NUM_WORDS_TO_LOAD; i++) {
        wordSequence.push(getRandomWord());
    }
    renderFullSequence();
}

function appendMoreWords() {
    let html = '';
    const startIndex = wordSequence.length;
    for (let i = 0; i < 10; i++) {
        const word = getRandomWord();
        wordSequence.push(word);
        html += createWordHTML(startIndex + i, word);
    }
    wordDisplay.insertAdjacentHTML('beforeend', html);
}

function createWordHTML(wIndex, wordText) {
    let wordClass = "word";
    let isCurrent = wIndex === currentWordIndex;
    if (isCurrent) {
        wordClass += " current-word";
    }
    let html = `<div class="${wordClass}"${isCurrent ? ' id="current-word-el"' : ''}>`;
    
    for (let cIndex = 0; cIndex < wordText.length; cIndex++) {
        const char = wordText[cIndex];
        if (wIndex < currentWordIndex) {
            html += `<span class="correct">${char}</span>`;
        } else if (isCurrent && cIndex === 0) {
            html += `<span class="current-char">${char}</span>`;
        } else {
            html += `<span>${char}</span>`;
        }
    }
    html += `</div>`;
    return html;
}

function renderFullSequence() {
    let html = '';
    for (let wIndex = 0; wIndex < wordSequence.length; wIndex++) {
        html += createWordHTML(wIndex, wordSequence[wIndex]);
    }
    wordDisplay.innerHTML = html;
    scrollToCurrentWord();
}

function updateCurrentWordDisplay() {
    const inputVal = typeInput.value;
    const currentTargetWord = wordSequence[currentWordIndex];
    if (!currentTargetWord) return;

    const activeEl = document.getElementById('current-word-el');
    if (!activeEl) return;

    let html = '';
    for (let cIndex = 0; cIndex < currentTargetWord.length; cIndex++) {
        const char = currentTargetWord[cIndex];
        if (cIndex < inputVal.length) {
            if (inputVal[cIndex] === char) {
                html += `<span class="correct">${char}</span>`;
            } else {
                html += `<span class="incorrect">${char}</span>`;
            }
        } else if (cIndex === inputVal.length) {
            html += `<span class="current-char">${char}</span>`;
        } else {
            html += `<span>${char}</span>`;
        }
    }
    
    // Handle case where user types more characters than the word length
    if (inputVal.length > currentTargetWord.length) {
        for (let extra = currentTargetWord.length; extra < inputVal.length; extra++) {
            html += `<span class="incorrect">${inputVal[extra]}</span>`;
        }
    }
    
    activeEl.innerHTML = html;
}

function scrollToCurrentWord() {
    const activeEl = document.getElementById('current-word-el');
    if (activeEl) {
        // Scroll so the active word is visible, keeping it roughly in the first/second row
        const containerRect = wordDisplay.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        // If the active element starts dropping down, shift the container up
        if (activeEl.offsetTop > 40) {
            wordDisplay.style.transform = `translateY(-${activeEl.offsetTop - 5}px)`;
        } else {
            wordDisplay.style.transform = `translateY(0px)`;
        }
    }
}

function updateStats() {
    if (!startTime) return;

    const currentTime = new Date();
    const timeElapsedSec = (currentTime - startTime) / 1000;

    // To avoid infinity/huge spikes in the first second
    if (timeElapsedSec < 1) return;

    const timeElapsedMin = timeElapsedSec / 60;

    // Strict WPM formula: (total correct keystrokes / 5) / minutes
    let correctKeystrokes = 0;
    for (let i = 0; i < currentWordIndex; i++) {
        if (wordSequence[i]) {
            correctKeystrokes += wordSequence[i].length + 1; // +1 for the space
        }
    }
    // Add current word's correct progress
    const inputVal = typeInput.value;
    const currentTargetWord = wordSequence[currentWordIndex];
    if (currentTargetWord && inputVal === currentTargetWord.substring(0, inputVal.length)) {
        correctKeystrokes += inputVal.length;
    }

    const wpm = timeElapsedMin > 0 ? Math.round((correctKeystrokes / 5) / timeElapsedMin) : 0;
    wpmDisplay.textContent = wpm;

    // Accuracy based on absolute errors vs all keystrokes attempted
    const accuracy = totalKeystrokes > 0 ? Math.max(0, Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100)) : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
}

function startTimer() {
    timeLeft = testDuration;
    if (document.getElementById('time-left')) {
        document.getElementById('time-left').textContent = timeLeft;
    }

    progressBar.style.width = '100%';
    progressBar.style.transition = `width ${testDuration}s linear`;

    // Force reflow
    void progressBar.offsetWidth;
    progressBar.style.width = '0%';

    timerInterval = setInterval(() => {
        timeLeft--;
        if (document.getElementById('time-left')) {
            document.getElementById('time-left').textContent = timeLeft;
        }

        const timeElapsed = (new Date() - startTime) / 1000;
        if (timeElapsed >= testDuration || timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    clearInterval(timerInterval);
    isStarted = false;
    typeInput.disabled = true;
    progressBar.style.width = '0%';
    progressBar.style.background = 'var(--text-incorrect)'; // Turn red to show end

    // Clear the sequence and show the end message
    wordSequence = [];
    wordDisplay.style.transform = `translateY(0px)`;
    wordDisplay.innerHTML = `<span style="color: var(--accent-primary); width: 100%; text-align: center; margin-top: 1rem;">Time's Up! Test Complete.</span>`;
}

// --- Visual Keyboard Handling ---
function highlightKey(keyChar, isRight = true) {
    const keyEl = document.querySelector(`.key[data-key="${keyChar.toLowerCase()}"]`);
    if (keyEl) {
        if (isRight) {
            keyEl.classList.add('active');
            setTimeout(() => keyEl.classList.remove('active'), 150);
        } else {
            keyEl.classList.add('error');
            setTimeout(() => keyEl.classList.remove('error'), 300);
        }
    }
}

// --- Event Listeners ---
function setupEventListeners() {
    typeInput.addEventListener('keydown', (e) => {
        // Handle Spacebar logic to move to next word
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent space from going into input
            if (isStarted || typeInput.value.length > 0) {
                moveToNextWord();
            }
            return;
        }

        // Ignore meta keys
        if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
            // allow backspace etc
            if (e.key !== 'Backspace') return;
        }

        // Timer Start Logic
        if (!isStarted && e.key.length === 1 && e.key !== ' ') {
            isStarted = true;
            startTime = new Date();
            startTimer();
        }

        const inputVal = typeInput.value;
        const currentTargetWord = wordSequence[currentWordIndex] || "";
        const expectedNextChar = currentTargetWord[inputVal.length];

        // === STRICT ERROR ENFORCEMENT ===
        // Before the character is even added to the input, check if it's correct.
        if (e.key.length === 1 && e.key !== 'Backspace') {
            totalKeystrokes++;

            if (e.key === expectedNextChar || (inputVal.length >= currentTargetWord.length && e.key === ' ')) {
                // Correct Key! Let it process normally.
                highlightKey(e.key, true);
            } else {
                // Incorrect Key Typed! Prevent the input entirely.
                e.preventDefault();
                errors++;
                highlightKey(e.key || ' ', false);

                // Flash the word red
                const activeEl = document.getElementById('current-word-el');
                if (activeEl) {
                    activeEl.style.backgroundColor = 'rgba(244, 63, 94, 0.4)'; // Flash red
                    setTimeout(() => {
                        activeEl.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }, 150);
                }
            }
        }
    });

    // We still use input to trigger renders so it catches the valid keystrokes that got through
    typeInput.addEventListener('input', () => {
        updateCurrentWordDisplay();
        updateStats();
    });

    restartBtn.addEventListener('click', () => {
        init();
        restartBtn.blur();
    });

    document.querySelector('.app-container').addEventListener('click', () => {
        if (!typeInput.disabled) typeInput.focus();
    });
}

function moveToNextWord() {
    const inputVal = typeInput.value.trim();
    const currentTargetWord = wordSequence[currentWordIndex];

    // Enforce strict correctness: only move forward if the word was fully matched
    // Because we block wrong letters immediately, inputVal will only ever equal currentTargetWord
    // or be shorter. We just check if they finished the word.
    if (inputVal === currentTargetWord) {
        wordsTyped++;
        
        // Update DOM for the old word (mark as correct)
        const oldActiveEl = document.getElementById('current-word-el');
        if (oldActiveEl) {
            oldActiveEl.removeAttribute('id');
            oldActiveEl.classList.remove('current-word');
            oldActiveEl.innerHTML = currentTargetWord.split('').map(char => `<span class="correct">${char}</span>`).join('');
        }

        currentWordIndex++;
        typeInput.value = '';
        highlightKey(' ', true);

        // Update DOM for the new word
        const newActiveEl = wordDisplay.children[currentWordIndex];
        if (newActiveEl) {
            newActiveEl.setAttribute('id', 'current-word-el');
            newActiveEl.classList.add('current-word');
        }

        // Load more words if getting close to the end
        if (wordSequence.length - currentWordIndex < 10) {
            appendMoreWords();
        }

        updateCurrentWordDisplay();
        scrollToCurrentWord();
        updateStats();
    } else if (inputVal.length > 0) {
        // Tried to hit space before finishing the word
        errors++;
        highlightKey(' ', false);
        const activeEl = document.getElementById('current-word-el');
        if (activeEl) {
            activeEl.style.backgroundColor = 'rgba(244, 63, 94, 0.4)'; // Flash red
            setTimeout(() => {
                activeEl.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }, 150);
        }
        // Remove trailing space that might have triggered this
        typeInput.value = inputVal;
    }
}

// Start the app
window.onload = init;
