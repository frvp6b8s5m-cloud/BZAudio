/* ==========================================================================
   BPLUGINS ENGINE // PART 1: EVALUATION MATRIX & SYSTEM AUTHENTICATION
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

// Live server visitor monitoring logs parsed into root dashboard panels
const activeVisitorLogs = [
    { ip: "172.56.21.94", profile: "WORSHIP_ARTS_BRIGHT", action: "FORGED_DSP_VST3" },
    { ip: "198.24.142.12", profile: "CINEMATIC_DARK_OBSIDIAN", action: "DOWNLOADED_STEMS" },
    { ip: "64.233.160.8", profile: "INDUSTRIAL_LOFI", action: "SEARCH_FORGE_RUN" }
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

    const heldKeys = { shift: false, a: false, d: false };

    // Initialize Onboarding Evaluation Steps
    function loadQuizQuestion() {
        if (!quizCard) return;
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
        if (dnaTag) dnaTag.innerText = `[ ENGINE_CORE // STANDBY ]`;
    }

    loadQuizQuestion();

    // Secure Hidden Override Macro (Shift + A + D)
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

    // Admin Clearance Verification (477643)
    document.getElementById('admin-auth-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputPass = document.getElementById('admin-password').value;

        if (inputPass === "477643") {
            adminLoginCard.classList.add('hidden');
            adminDashboard.classList.remove('hidden');
            window.initializeAdminTelemetryFeed(); // Invokes rendering loop from Part 2
        } else {
            alert("SECURITY ALERT // INCORRECT GATEWAY CLEARANCE PASS.");
            document.getElementById('admin-password').value = '';
        }
    });
/* ==========================================================================
   BPLUGINS ENGINE // PART 2: PROMPT PROCESSING & DYNAMIC KNOB MATRICES
   ========================================================================== */

    // Search Component Selection Targets
    const searchBar = document.getElementById('artist-search-bar');
    const generateSearchBtn = document.getElementById('generate-search-btn');
    const generatedControlsCard = document.getElementById('generated-controls-card');
    const dynamicKnobMatrix = document.getElementById('dynamic-knob-matrix');
    const sandboxGuidanceText = document.getElementById('sandbox-guidance-text');
    const downloadPackageBtn = document.getElementById('download-package-btn');
    
    const label1 = document.getElementById('slider-label-1');
    const label2 = document.getElementById('slider-label-2');
    const slider1 = document.getElementById('dynamic-slider-1');
    const slider2 = document.getElementById('dynamic-slider-2');
    const val1 = document.getElementById('dynamic-val-1');
    const val2 = document.getElementById('dynamic-val-2');
    const genStemLabel = document.getElementById('gen-stem-label');
    const statusText = document.getElementById('engine-status-text');
    const dnaTag = document.getElementById('profile-dna-tag');
    const adminDashboard = document.getElementById('admin-dashboard-view');
    const userWorkbench = document.getElementById('user-workbench-view');

    // Real-Time Slider Value Monitors
    slider1?.addEventListener('input', (e) => { val1.innerText = `${(e.target.value / 10).toFixed(1)}dB`; });
    slider2?.addEventListener('input', (e) => { val2.innerText = `${(e.target.value / 10).toFixed(1)}s`; });

    // Natural Language Search Optimization Script
    generateSearchBtn?.addEventListener('click', () => {
        const queryText = searchBar.value.trim().toLowerCase();

        if (queryText === '') {
            alert("SYS_ERROR // SEARCH FIELD CANNOT BE EMPTY.");
            return;
        }

        statusText.innerText = "PARSING_STYLE...";
        generateSearchBtn.innerText = "[DECOMPOSING_STYLE_BLUEPRINTS...]";
        generateSearchBtn.disabled = true;

        setTimeout(() => {
            sandboxGuidanceText.innerText = "CUSTOM_PLUGIN_COMPILED_SUCCESSFULLY // Interactive variables calibrated to your text prompt variables below:";
            dynamicKnobMatrix.classList.remove('hidden');
            generatedControlsCard.classList.add('functionality-reveal-active');
            
            // Intelligently configure interactive dials based on search parameters
            if (queryText.includes("delay") || queryText.includes("reverb") || queryText.includes("space")) {
                label1.innerText = "FEEDBACK_REGENERATION_PERCENT //";
                label2.innerText = "SPATIAL_ROOM_DECAY_TIME //";
                slider1.value = 65; val1.innerText = "65%";
                slider2.value = 85; val2.innerText = "8.5s";
                genStemLabel.innerText = "⚡ GENERATED_AMBIENT_REVERB_STEM.wav";
                dnaTag.innerText = "[ BLUEPRINT // TIME_BASED_DSP ]";
            } else if (queryText.includes("warm") || queryText.includes("tube") || queryText.includes("distortion") || queryText.includes("saturation")) {
                label1.innerText = "VALVE_TUBE_DRIVE_GAIN //";
                label2.innerText = "EVEN_ORDER_HARMONIC_MIX //";
                slider1.value = 75; val1.innerText = "7.5dB";
                slider2.value = 45; val2.innerText = "45%";
                genStemLabel.innerText = "⚡ GENERATED_SATURATED_TAPE_ROOM.wav";
                dnaTag.innerText = "[ BLUEPRINT // HARMONIC_FORGE ]";
            } else {
                label1.innerText = "COMPRESSION_THRESHOLD //";
                label2.innerText = "MAKEUP_OUTPUT_GAIN //";
                slider1.value = 40; val1.innerText = "-4.0dB";
                slider2.value = 20; val2.innerText = "+2.0dB";
                genStemLabel.innerText = "⚡ GENERATED_BALANCED_MIX_STEM.wav";
                dnaTag.innerText = "[ BLUEPRINT // CUSTOM_DYNAMIC_FX ]";
            }

            statusText.innerText = "PRINT_SUCCESS";
            downloadPackageBtn.innerText = "[DOWNLOAD_CUSTOM_PLUGIN_&_STEMS]";
            downloadPackageBtn.disabled = false;
            generateSearchBtn.innerText = "[ENGAGE_AI_STYLE_GENERATION]";
            generateSearchBtn.disabled = false;
        }, 2800);
    });

    downloadPackageBtn?.addEventListener('click', () => {
        statusText.innerText = "ASSET_EXPORTED";
        alert("SYS_SUCCESS // Custom plugin binary block (.vst3) and matching multi-track stem packet zipped successfully.");
    });

    // Global Admin Telemetry Tracker Stream Logger
    window.initializeAdminTelemetryFeed = function() {
        const telemetryPanel = document.getElementById('admin-telemetry-card');
        if (!telemetryPanel) return;

        let htmlFeed = `
            <div class="card-header">
                <span class="tech-id">LIVE_TELEMETRY // FEED_ACTIVE</span>
                <h2>ACTIVE_VISITOR_MONITOR</h2>
                <p>Real-time telemetry stream parsing tracking current users processing assets on the workbench matrix.</p>
            </div>
            <div class="control-matrix" style="font-size: 0.65rem; line-height: 1.6; max-height: 180px; overflow-y: auto; margin-bottom: 25px;">
        `;

        activeVisitorLogs.forEach(user => {
            htmlFeed += `
                <div style="border-bottom: 1px dashed rgba(210,201,189,0.1); padding: 5px 0;">
                    <span style="color: #FFF;">👤 ADDR: ${user.ip}</span><br>
                    <span>↳ TYPE: ${user.profile} | ACTION: <span style="color: #FFFFFF;">${user.action}</span></span>
                </div>
            `;
        });

        htmlFeed += `</div><button class="forge-trigger-btn" id="logout-admin-btn" style="background-color: #ff3b30; color: #FFF; border-color: #FFF;">[DISENGAGE_ADMIN_SUBDOMAIN]</button>`;
        
        telemetryPanel.innerHTML = htmlFeed;

        document.getElementById('logout-admin-btn')?.addEventListener('click', () => {
            adminDashboard.classList.add('hidden');
            userWorkbench.classList.remove('hidden');
            statusText.innerText = "ENGINE_READY";
            dnaTag.innerText = "[ PROMPT_INPUT_STANDBY ]";
        });
    };
});
