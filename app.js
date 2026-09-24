/* ==========================================================================
   IMPASTO PLATFORM CORE // AUTOMATION & SECURE MACRO MATRIX
   ========================================================================== */

const quizQuestions = [
    { q: "What is the primary tracking frequency variable of your setup?", a: ["LOW_FREQUENCY_AMBIENCE", "MID_RANGE_PROPULSION", "HIGH_FIDELITY_AIR", "DYNAMIC_BALANCED_CORE"] },
    { q: "Which saturation circuit topology aligns with your production?", a: ["VINTAGE_VACUUM_TUBE", "2_INCH_MAGNETIC_TAPE", "SOLID_STATE_CONSOLE", "PURE_DIGITAL_LINEAR"] },
    { q: "Select your targeted acoustic environmental profile:", a: ["DRY_BOOTH_ISOLATION", "CATHEDRAL_LONG_DECAY", "WOOD_PANEL_ROOM_ARRAY", "PLATE_REVERB_DENSITY"] },
    { q: "How should the compressor algorithm track transients?", a: ["FAST_ATTACK_PEAK_SMASH", "SLOW_SMOOTH_OPTICAL_LEVEL", "FEED_FORWARD_VCA_PUNCH", "VARIABLE_MU_GLUE"] },
    { q: "What is your baseline sample-rate tracking constraint?", a: ["44.1KHZ // COMPACT_DISC", "48KHZ // FILM_STANDARD", "96KHZ // HIGH_RES_ARCHIVE", "192KHZ // ULTRA_HD_ENGINE"] },
    { q: "Choose your primary instrumental arrangement layer:", a: ["AMBIENT_DELAY_GUITARS", "ANALOG_SYNTH_DRONES", "MULTI_MIC_DRUM_ROOMS", "ISOLATED_VOCAL_PATHS"] },
    { q: "What harmonic saturation distortion layout do you prefer?", a: ["EVEN_ORDER_VALVE_WARMTH", "ODD_ORDER_TAPE_GRIT", "SYM_TRANSISTOR_CLIPPING", "ZERO_DISTORTION_TRANSPARENT"] },
    { q: "Select your preferred multi-track session target format:", a: ["PRO_TOOLS_SESSION", "LOGIC_PRO_MATRIX", "ABLETON_LIVE_PACK", "REAPER_ARCHIVE_ZIP"] },
    { q: "How do you treat structural sub-frequency spaces?", a: ["MONO_ISOLATED_CLEAN", "STEREO_WIDE_SUB_PADS", "HEAVY_LIMITER_CLAMPED", "DYNAMIC_SIDECHAINED_ROUTING"] },
    { q: "What is the core target mood descriptor of the project?", a: ["CINEMATIC_DARK_OBSIDIAN", "WORSHIP_ARTS_BRIGHT", "INDUSTRIAL_LOFI_TEXTURAL", "MINIMALIST_RAW_ACOUSTIC"] }
];

let currentQuestionIndex = 0;
let userProfileArchetype = "AMBIENT_CORE";

document.addEventListener('DOMContentLoaded', () => {
    const quizCard = document.getElementById('onboarding-quiz-card');
    const userWorkbench = document.getElementById('user-workbench-view');
    const adminLoginCard = document.getElementById('admin-login-card');
    const adminDashboard = document.getElementById('admin-dashboard-view');
    
    const progressText = document.getElementById('quiz-progress-text');
    const questionText = document.getElementById('current-question-text');
    const optionsWrapper = document.getElementById('quiz-options-wrapper');
    const nextQuizBtn = document.getElementById('next-question-btn');
    
    const statusText = document.getElementById('engine-status-text');
    const dnaTag = document.getElementById('profile-dna-tag');
    const decaySlider = document.getElementById('decay-slider');
    const decayVal = document.getElementById('decay-val');
    const stackerZone = document.getElementById('stacker-zone');

    const heldKeys = { shift: false, a: false, d: false };

    function loadQuizQuestion() {
        if (currentQuestionIndex >= quizQuestions.length) {
            compileProfileResults();
            return;
        }
        
        nextQuizBtn.disabled = true;
        progressText.innerText = `QUESTION // ${(currentQuestionIndex + 1).toString().padStart(2, '0')} OF 10`;
        questionText.innerText = quizQuestions[currentQuestionIndex].q;
        optionsWrapper.innerHTML = '';
        
        quizQuestions[currentQuestionIndex].a.forEach(option => {
            const div = document.createElement('div');
            div.className = 'quiz-option-row';
            div.innerText = option;
            div.addEventListener('click', () => {
                document.querySelectorAll('.quiz-option-row').forEach(r => r.classList.remove('selected-option'));
                div.classList.add('selected-option');
                nextQuizBtn.disabled = false;
            });
            optionsWrapper.appendChild(div);
        });
    }

    if (nextQuizBtn) {
        nextQuizBtn.addEventListener('click', () => {
            const selected = document.querySelector('.selected-option').innerText;
            if (currentQuestionIndex === 9 && selected.includes("DARK")) userProfileArchetype = "DARK_OBSIDIAN";
            if (currentQuestionIndex === 9 && selected.includes("BRIGHT")) userProfileArchetype = "CINEMATIC_WORSHIP";
            
            currentQuestionIndex++;
            loadQuizQuestion();
        });
    }

    function compileProfileResults() {
        quizCard.classList.add('hidden');
        userWorkbench.classList.remove('hidden');
        if (dnaTag) dnaTag.innerText = `[ PROFILE // ${userProfileArchetype} ]`;
    }

    loadQuizQuestion();

    if (decaySlider) {
        decaySlider.addEventListener('input', (e) => {
            decayVal.innerText = `${(e.target.value / 10).toFixed(1)}s`;
        });
    }

    if (stackerZone) {
        stackerZone.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-layer')) {
                e.target.parentElement.remove();
            }
        });
    }

    document.getElementById('bake-preset-btn')?.addEventListener('click', function() {
        const fmt = document.getElementById('plugin-format').value.toUpperCase();
        statusText.innerText = "BAKING_CORE...";
        this.innerText = `[COMPILING_BINARY_${fmt}...]`;
        this.disabled = true;
        setTimeout(() => {
            statusText.innerText = "PLUGIN_BAKED";
            this.innerText = `[DOWNLOAD_${fmt}_PLUGIN]`;
            this.disabled = false;
        }, 3000);
    });

    document.getElementById('build-samples-btn')?.addEventListener('click', function() {
        statusText.innerText = "STITCHING_DNA...";
        this.innerText = "[RENDERING_STEMS...]";
        this.disabled = true;
        setTimeout(() => {
            statusText.innerText = "SESSION_READY";
            this.innerText = "[DOWNLOAD_STEM_SESSION]";
            this.disabled = false;
        }, 3500);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') heldKeys.shift = true;
        if (e.key.toLowerCase() === 'a') heldKeys.a = true;
        if (e.key.toLowerCase() === 'd') heldKeys.d = true;

        if (heldKeys.shift && heldKeys.a && heldKeys.d) {
            quizCard.classList.add('hidden');
            userWorkbench.classList.add('hidden');
            adminDashboard.classList.add('hidden');
            adminLoginCard.classList.remove('hidden');
            if (statusText) statusText.innerText = "OVERRIDE_LOCK";
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') heldKeys.shift = false;
        if (e.key.toLowerCase() === 'a') heldKeys.a = false;
        if (e.key.toLowerCase() === 'd') heldKeys.d = false;
    });

    document.getElementById('admin-auth-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        adminLoginCard.classList.add('hidden');
        adminDashboard.className = "dual-engine-workbench";
    });

    document.getElementById('logout-admin-btn')?.addEventListener('click', () => {
        adminDashboard.className = "dual-engine-workbench hidden";
        userWorkbench.classList.remove('hidden');
        statusText.innerText = "CALIBRATED_READY";
    });
});
