/* Marketplace Grid Display Layout rules */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
}

.exhibit-card {
    background: rgba(24, 21, 20, 0.7);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 6px;
    padding: 20px;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.exhibit-card:hover { transform: translateY(-4px); }

/* Dynamic Tier Allocation Colors */
.exhibit-card[data-tier="Elite"] { border-color: #FFD700; box-shadow: 0 0 15px rgba(255,215,0,0.1); }
.exhibit-card[data-tier="Artisan"] { border-color: var(--accent-orange); }

.painting-mat {
    height: 180px;
    background: #000;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    position: relative;
}

.tier-indicator { position: absolute; top: 12px; left: 12px; font-size: 0.6rem; padding: 3px 6px; border-radius: 2px; font-weight: bold; }
.elite-tag { background: rgba(255,215,0,0.15); color: #FFD700; }
.artisan-tag { background: rgba(229,106,37,0.15); color: var(--accent-orange); }
.exhibition-tag { background: rgba(255,255,255,0.08); color: #FFF; }

.ratio-badge { position: absolute; bottom: 12px; right: 12px; font-size: 0.65rem; background: #000; color: #FFF; padding: 2px 5px; border: 1px solid rgba(255,255,255,0.2); }
.trade-ledger-box { background: rgba(0,0,0,0.2); padding: 10px; margin: 12px 0; border-radius: 4px; font-size: 0.75rem; }

/* Control Form & Interface Fields */
.offer-desk { background: #141110; border: 1px solid rgba(255,255,255,0.04); padding: 35px; border-radius: 6px; margin-top: 40px; }
.barter-split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 20px 0; }
.form-group { margin-bottom: 18px; }
label { display: block; font-size: 0.7rem; color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.05em; font-weight: bold; }
.label-green { color: #4CAF50; }.label-orange { color: var(--accent-orange); }

input, textarea { width: 100%; background: #0a0908; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 12px; color: #FFF; font-family: var(--font-mono); font-size: 0.8rem; margin-bottom: 8px; }
input:focus { outline: none; border-color: var(--accent-orange); }

/* Interface Command Buttons */
.gallery-btn { width: 100%; background: transparent; border: 1px solid var(--text-primary); color: var(--text-primary); font-family: var(--font-mono); padding: 12px; font-size: 0.8rem; border-radius: 4px; cursor: pointer; text-align: center; display: block; text-decoration: none; }
.gallery-btn:hover { background: #FFF; color: #000; font-weight: bold; }
.engine-btn { width: 100%; background: transparent; border: 1px solid var(--text-muted); color: var(--text-primary); font-family: var(--font-mono); padding: 12px; font-size: 0.8rem; border-radius: 4px; cursor: pointer; }
.engine-btn:hover { background: var(--text-primary); color: #000; font-weight: bold; }
.mini-btn { padding: 4px 8px; font-size: 0.7rem; width: auto; margin-top: 5px; }

.hud-bar { position: absolute; font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.1em; }
.top-left { top: 25px; left: 35px; color: var(--accent-orange); }
.bottom-left { bottom: 25px; left: 35px; }.bottom-right { bottom: 25px; right: 35px; }
.center-hud { color: var(--text-muted); font-size: 0.75rem; text-shadow: 0 2px 4px #000; pointer-events: none; }
/* ==========================================================================
   BZaudio Front-End Engine - Navigation, Audio Nodes & Secret Triggers
   ========================================================================== */

// Handle smooth navigation switching between sections
function switchWing(wingId) {
    document.querySelectorAll('.gallery-wing').forEach(wing => {
        wing.classList.remove('visible');
        wing.classList.add('hidden');
    });
    
    const targetWing = document.getElementById(wingId);
    if(targetWing) {
        targetWing.classList.remove('hidden');
        targetWing.classList.add('visible');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${wingId}`) link.classList.add('active');
    });
}

// Web Audio API Synthesizer - Canvas Ambient Drone
let audioCtx = null;
let droneOsc = null;

document.getElementById('audition-btn')?.addEventListener('click', function() {
    const glowNode = document.querySelector('.ambient-glow');
    
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Setup oscillator and master filter configurations
        droneOsc = audioCtx.createOscillator();
        const lowpassFilter = audioCtx.createBiquadFilter();
        const masterGain = audioCtx.createGain();

        droneOsc.type = 'sawtooth';
        droneOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A Tone
        
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.setValueAtTime(180, audioCtx.currentTime);

        masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime);

        // Chain components to audio environment destination
        droneOsc.connect(lowpassFilter);
        lowpassFilter.connect(masterGain);
        masterGain.connect(audioCtx.destination);
        
        droneOsc.start();
        this.textContent = "[MUTING_SONIC_CANVAS]";
        glowNode.classList.add('active-drone');
    } else {
        if (audioCtx.state === 'running') {
            audioCtx.suspend();
            this.textContent = "Audition Canvas Sonic Signature";
            glowNode.classList.remove('active-drone');
        } else if (audioCtx.state === 'suspended') {
            audioCtx.resume();
            this.textContent = "[MUTING_SONIC_CANVAS]";
            glowNode.classList.add('active-drone');
        }
    }
});
// Secret Entrance: Type 'b' then 'z' then 'a' continuously on home screen to access login
let keystrokeBuffer = "";
window.addEventListener('keydown', (e) => {
    keystrokeBuffer += e.key.toLowerCase();
    if (keystrokeBuffer.endsWith("bza")) {
        keystrokeBuffer = "";
        window.location.href = "admin.html";
    }
    if (keystrokeBuffer.length > 10) keystrokeBuffer = keystrokeBuffer.slice(-3);
});

// Secure Cryptographic Verification Function (SHA-256)
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const artistId = document.getElementById('artist-id').value.trim();
    const secureKey = document.getElementById('secure-key').value;
    const engineBtn = document.querySelector('.engine-btn');

    engineBtn.textContent = "[PROCESSING_AUTH_HASH...]";
    engineBtn.disabled = true;

    // Concat strings to execute transaction lookup signature
    const validationString = `${artistId}:${secureKey}`;

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(validationString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // The secure pre-calculated hash token configuration
        const targetMasterpieceKey = "4c3bbf1bfcf034ba2f4625b0cb046d2cb14b09ec98da7ca7a9f8ecf4e4a05553";

        if (computedHash === targetMasterpieceKey) {
            engineBtn.textContent = "[ENGINE_INITIALIZED]";
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
        } else {
            throw new Error();
        }
    } catch (error) {
        alert("ACCESS DENIED: Core terminal signatures do not match current matrix registry.");
        engineBtn.textContent = "[INITIALIZE_ENGINE]";
        engineBtn.disabled = false;
        document.getElementById('secure-key').value = "";
    }
});
// Append structural sub-input fields to form matrix
function addBarterField(containerId, placeholderText) {
    const container = document.getElementById(containerId);
    const count = container.getElementsByTagName('input').length + 1;
    
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = containerId === 'offeringContainer' ? 'offering-item' : 'seeking-item';
    newInput.placeholder = `${placeholderText} ${count}`;
    newInput.required = true;
    
    container.appendChild(newInput);
}

// Compile Multi-Asset Trade proposals into automated client payload links
document.getElementById('ratioOfferForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const offeringInputs = Array.from(document.querySelectorAll('.offering-item')).map(i => i.value.trim());
    const seekingInputs = Array.from(document.querySelectorAll('.seeking-item')).map(i => i.value.trim());
    
    const ratioPayload = {
        transactionId: "RATIO-" + Date.now().toString().slice(-6),
        artist: document.getElementById('ratioArtist').value.trim(),
        givingCount: offeringInputs.length,
        seekingCount: seekingInputs.length,
        offeredAssets: offeringInputs,
        soughtAssets: seekingInputs,
        sourceSecureLink: document.getElementById('ratioLink').value.trim(),
        timestamp: new Date().toLocaleDateString()
    };

    const cleanJson = JSON.stringify(ratioPayload, null, 2);
    const mailtoUrl = `mailto:curator@://bplugins.com{ratioPayload.transactionId}&body=Curator,%0A%0AI submit a barter proposal to Bplugins for review.%0A%0A${encodeURIComponent(cleanJson)}`;
    
    window.location.href = mailtoUrl;
    alert(`PAYLOAD REGISTERED!\n\nTransaction ${ratioPayload.transactionId} packaged successfully. Transferring data via mail portal hook.`);
    this.reset();
});

// Applaud System & Dynamic Tier Allocation Sorting Algorithm
function castVote(buttonElement) {
    buttonElement.classList.add('voted');
    buttonElement.textContent = "[APPLAUDED]";
    buttonElement.style.pointerEvents = 'none';

    const card = buttonElement.closest('.exhibit-card');
    const scoreNumNode = card.querySelector('.score-num');
    
    let currentScore = parseInt(card.getAttribute('data-score')) + 1;
    card.setAttribute('data-score', currentScore);
    scoreNumNode.textContent = currentScore;

    const tierBadge = card.querySelector('.tier-indicator');
    
    if (currentScore >= 100) {
        card.setAttribute('data-tier', 'Elite');
        tierBadge.textContent = "ELITE TIER";
        tierBadge.className = "tier-indicator elite-tag";
    } else if (currentScore >= 50) {
        card.setAttribute('data-tier', 'Artisan');
        tierBadge.textContent = "ARTISAN TIER";
        tierBadge.className = "tier-indicator artisan-tag";
    } else {
        card.setAttribute('data-tier', 'Exhibition');
        tierBadge.textContent = "EXHIBITION TIER";
        tierBadge.className = "tier-indicator exhibition-tag";
    }

    reorderGalleryFloor();
}

function reorderGalleryFloor() {
    const registryGrid = document.getElementById('publicRegistry');
    if(!registryGrid) return;
    
    const activeCards = Array.from(registryGrid.querySelectorAll('.exhibit-card'));

    activeCards.sort((cardA, cardB) => {
        return parseInt(cardB.getAttribute('data-score')) - parseInt(cardA.getAttribute('data-score'));
    });

    activeCards.forEach(card => registryGrid.appendChild(card));
}
