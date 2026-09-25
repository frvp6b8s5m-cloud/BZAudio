/* ==========================================================================
   BZaudio Front-End Engine - Script Architecture Matrix
   ========================================================================== */

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

// Browser Web Audio API Canvas Sound Generator
let audioCtx = null;
let droneOsc = null;

document.getElementById('audition-btn')?.addEventListener('click', function() {
    const glowNode = document.querySelector('.ambient-glow');
    
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        droneOsc = audioCtx.createOscillator();
        const lowpassFilter = audioCtx.createBiquadFilter();
        const masterGain = audioCtx.createGain();

        droneOsc.type = 'sawtooth';
        droneOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low frequency A drone node
        
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.setValueAtTime(140, audioCtx.currentTime);

        masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

        droneOsc.connect(lowpassFilter);
        lowpassFilter.connect(masterGain);
        masterGain.connect(audioCtx.destination);
        
        droneOsc.start();
        this.textContent = "[MUTING_SONIC_CANVAS_DRONE]";
        glowNode.classList.add('active-drone');
    } else {
        if (audioCtx.state === 'running') {
            audioCtx.suspend();
            this.textContent = "[AUDITION_CANVAS_SIGNATURE]";
            glowNode.classList.remove('active-drone');
        } else if (audioCtx.state === 'suspended') {
            audioCtx.resume();
            this.textContent = "[MUTING_SONIC_CANVAS_DRONE]";
            glowNode.classList.add('active-drone');
        }
    }
});
// Hidden Key Entry: Type 'b' then 'z' then 'a' sequentially on home page to unlock the gateway routes
let keystrokeBuffer = "";
window.addEventListener('keydown', (e) => {
    keystrokeBuffer += e.key.toLowerCase();
    if (keystrokeBuffer.endsWith("bza")) {
        keystrokeBuffer = "";
        window.location.href = "./admin.html";
    }
    if (keystrokeBuffer.length > 10) keystrokeBuffer = keystrokeBuffer.slice(-3);
});

// Irreversible Cryptographic Gateway Engine
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const artistId = document.getElementById('artist-id').value.trim();
    const secureKey = document.getElementById('secure-key').value;
    const engineBtn = document.querySelector('.engine-btn');

    engineBtn.textContent = "[PROCESSING_AUTH_HASH...]";
    engineBtn.disabled = true;

    const validationString = `${artistId}:${secureKey}`;

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(validationString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // The secure pre-calculated hash match parameter
        const targetMasterpieceKey = "4c3bbf1bfcf034ba2f4625b0cb046d2cb14b09ec98da7ca7a9f8ecf4e4a05553";

        if (computedHash === targetMasterpieceKey) {
            engineBtn.textContent = "[ENGINE_INITIALIZED]";
            setTimeout(() => { window.location.href = "./dashboard.html"; }, 1000);
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
// Dynamic Input Form Sub-Field Insertion
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

// Intercept form submissions to compile transactional data package strings
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
    alert(`PAYLOAD REGISTERED!\n\nTransaction [${ratioPayload.transactionId}] compiled. Mail terminal activated.`);
    this.reset();
});

// Live Client-Side Ranking & Real-time Tier Allocation Reordering
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
    activeCards.sort((cardA, cardB) => parseInt(cardB.getAttribute('data-score')) - parseInt(cardA.getAttribute('data-score')));
    activeCards.forEach(card => registryGrid.appendChild(card));
}
