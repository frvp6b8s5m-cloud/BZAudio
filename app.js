/* ==========================================================================
   BZAUDIO ENGINE // MOUNTED SYSTEM AUTOMATION SCRIPT LAYERS
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

const activeVisitorLogs = [
    { ip: "172.56.21.94", profile: "WORSHIP_ARTS_BRIGHT", action: "DEPOSITED_TUBE_SAT" },
    { ip: "198.24.142.12", profile: "CINEMATIC_DARK_OBSIDIAN", action: "CLAIMED_SPACE_REVERB" },
    { ip: "64.233.160.8", profile: "INDUSTRIAL_LOFI", action: "MOUNTED_SWAP_BLOCK" }
];

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

    const tradeInput = document.getElementById('artist-search-bar');
    const postTradeBtn = document.getElementById('generate-search-btn');
    const swapListWrapper = document.getElementById('swap-list-wrapper');
    const claimPackageBtn = document.getElementById('download-package-btn');

    const heldKeys = { shift: false, a: false, d: false };

    function loadQuizQuestion() {
        if (!quizCard) return;
        if (currentQuestionIndex >= quizQuestions.length) {
            compileProfileResults();
            return;
        }
        
        if (nextQuizBtn) nextQuizBtn.disabled = true;
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
                if (nextQuizBtn) nextQuizBtn.disabled = false;
            });
            optionsWrapper.appendChild(div);
        });
    }

    if (nextQuizBtn) {
        nextQuizBtn.addEventListener('click', () => {
            const selectedOpt = document.querySelector('.selected-option');
            if (!selectedOpt) return;
            
            currentQuestionIndex++;
            loadQuizQuestion();
        });
    }

    function compileProfileResults() {
        quizCard?.classList.add('hidden');
        userWorkbench?.classList.remove('hidden');
        if (dnaTag) dnaTag.innerText = `[ HUB // OPEN_MARKET ]`;
    }

    loadQuizQuestion();

    postTradeBtn?.addEventListener('click', () => {
        const assetName = tradeInput.value.trim();
        if (assetName === '') return;

        if (statusText) statusText.innerText = "POSTING_ASSET...";
        postTradeBtn.innerText = "[PROCESSING...]";
        postTradeBtn.disabled = true;

        setTimeout(() => {
            const newListing = document.createElement('div');
            newListing.className = 'stacked-layer-item';
            newListing.innerHTML = `<span>📦 ${assetName}</span><span class="remove-layer" style="color:#D2C9BD; cursor:pointer;">[CLAIM]</span>`;
            swapListWrapper?.appendChild(newListing);
            
            tradeInput.value = '';
            if (statusText) statusText.innerText = "SWAP_ACTIVE";
            postTradeBtn.innerText = "[POST_TO_OPEN_SWAP_BLOCK]";
            postTradeBtn.disabled = false;
        }, 1200);
    });

    swapListWrapper?.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-layer')) {
            const targetRow = e.target.parentElement;
            const targetName = targetRow.querySelector('span').innerText;
            
            document.querySelectorAll('.stacked-layer-item').forEach(row => row.style.borderColor = 'rgba(210, 201, 189, 0.15)');
            targetRow.style.borderColor = '#D2C9BD';
            
            if (claimPackageBtn) {
                claimPackageBtn.innerText = `[DOWNLOAD_${targetName.replace('📦 ', '').toUpperCase().replace(/ /g, '_')}]`;
                claimPackageBtn.disabled = false;
                claimPackageBtn.style.backgroundColor = '#3A3025';
                claimPackageBtn.style.color = '#FFFFFF';
            }
        }
    });

    claimPackageBtn?.addEventListener('click', () => {
        if (statusText) statusText.innerText = "ASSET_CLAIMED";
        alert("DOWNLOAD_SUCCESS // Community digital asset unzipped safely to your DAW folder.");
        claimPackageBtn.disabled = true;
        claimPackageBtn.innerText = "[SELECT_A_LISTING_ABOVE]";
        claimPackageBtn.style.backgroundColor = 'transparent';
        claimPackageBtn.style.color = '#8C8275';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') heldKeys.shift = true;
        if (e.key.toLowerCase() === 'a') heldKeys.a = true;
        if (e.key.toLowerCase() === 'd') heldKeys.d = true;

        if (heldKeys.shift && heldKeys.a && heldKeys.d) {
            quizCard?.classList.add('hidden');
            userWorkbench?.classList.add('hidden');
            adminDashboard?.classList.add('hidden');
            adminLoginCard?.classList.remove('hidden');
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
        const inputPass = document.getElementById('admin-password').value;

        if (inputPass === "477643") {
            adminLoginCard?.classList.add('hidden');
            adminDashboard?.classList.remove('hidden');
            renderAdminSwapLogs();
        } else {
            alert("SECURITY ALERT // INCORRECT SYSTEM ACCESS KEY.");
            document.getElementById('admin-password').value = '';
        }
    });

    function renderAdminSwapLogs() {
        const telemetryPanel = document.getElementById('admin-telemetry-card');
        if (!telemetryPanel) return;

        let htmlFeed = `
            <div class="card-header"><span class="tech-id">LIVE_TELEMETRY // FEED_ACTIVE</span><h2>SWAP_BAY_MONITOR</h2><p>Tracking current community transaction logs.</p></div>
            <div class="control-matrix" style="font-size: 0.65rem; line-height: 1.6; max-height: 180px; overflow-y: auto; margin-bottom: 25px;">
        `;
        activeVisitorLogs.forEach(user => {
            htmlFeed += `<div style="border-bottom: 1px dashed rgba(210,201,189,0.1); padding: 5px 0;"><span style="color: #FFF;">👤 ADDR: ${user.ip}</span><br><span>↳ ACTION: <span style="color: #FFFFFF;">${user.action}</span></span></div>`;
        });
        htmlFeed += `</div><form_button class="forge-trigger-btn" id="logout-admin-btn" style="background-color: #ff3b30; color: #FFF; border-color: #FFF;">[DISENGAGE_ADMIN]</form_button>`;
        
        telemetryPanel.innerHTML = htmlFeed;
        document.getElementById('logout-admin-btn')?.addEventListener('click', () => {
            adminDashboard?.classList.add('hidden');
            userWorkbench?.classList.remove('hidden');
            if (statusText) statusText.innerText = "SWAP_ACTIVE";
        });
    }
});
