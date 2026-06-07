/* ==========================================================================
   FELIPE ANDRADE // CORE SYSTEM INTERACTIONS // app.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // Safety Net: Force-clear loader after 3.5s in case of any runtime glitches
    const loaderScreen = document.getElementById("loader-screen");
    const safetyTimeout = setTimeout(() => {
        if (loaderScreen && !loaderScreen.classList.contains("loaded")) {
            console.warn("Loader safety bypass triggered.");
            loaderScreen.classList.add("loaded");
            document.body.classList.remove("loading-active");
            setTimeout(() => { loaderScreen.style.display = "none"; }, 1000);
        }
    }, 3500);
    
    // --- 1. INTRO LOADER PROGRESS SEQUENCE ---
    const loadPct = document.getElementById("load-pct");
    const loadFill = document.getElementById("load-fill");
    const loadMsg = document.getElementById("load-msg");
    
    const bootMessages = [
        "ESTABLISHING SECURE CONNECTION...",
        "PARSING HOLOGRAPHIC GEOMETRY...",
        "MOUNTING TACTILE CONCRETE MESH...",
        "SYNCHRONIZING PORKBUN DNS CONNECT...",
        "COMPILING SHADER ARRAYS...",
        "SYSTEM ONLINE // WELCOME FELIPE"
    ];
    
    let loaderProgress = 0;
    const loaderDuration = 2500; // 2.5 seconds minimum
    const loaderIntervalTime = 50; 
    const loaderIncrement = (loaderIntervalTime / loaderDuration) * 100;
    
    const loaderInterval = setInterval(() => {
        loaderProgress += loaderIncrement;
        if (loaderProgress >= 100) {
            loaderProgress = 100;
            clearInterval(loaderInterval);
            
            // Finish loader
            if (loadPct) loadPct.textContent = "100%";
            if (loadFill) loadFill.style.width = "100%";
            if (loadMsg) loadMsg.textContent = bootMessages[bootMessages.length - 1];
            
            setTimeout(() => {
                // Slice reveal
                if (loaderScreen) {
                    loaderScreen.classList.add("loaded");
                    document.body.classList.remove("loading-active");
                    clearTimeout(safetyTimeout);
                    // Remove from DOM interaction path after animations finish
                    setTimeout(() => {
                        loaderScreen.style.display = "none";
                    }, 1200);
                }
            }, 300);
        } else {
            // Update loading pct and fill bar
            if (loadPct) loadPct.textContent = `${Math.floor(loaderProgress).toString().padStart(2, '0')}%`;
            if (loadFill) loadFill.style.width = `${loaderProgress}%`;
            
            // Fluctuating boot status messages
            const msgIndex = Math.min(
                Math.floor((loaderProgress / 100) * bootMessages.length),
                bootMessages.length - 2
            );
            if (loadMsg) loadMsg.textContent = bootMessages[msgIndex];
        }
    }, loaderIntervalTime);



    // --- 3. DYNAMIC INTERACTIVE GALLERY PROJECT SWITCHER ---
    const galleryCards = document.querySelectorAll(".gallery-card");
    const featuredTitle = document.getElementById("featured-title");
    const featuredSubtitle = document.getElementById("featured-subtitle");
    const featuredStatus = document.getElementById("featured-status");
    const featuredIterations = document.getElementById("featured-iterations");
    const featuredViewBtn = document.getElementById("featured-view-btn");
    const featuredImg = document.getElementById("featured-img");

    // Track active panel ID
    let currentPanelId = "panel-molebots";

    galleryCards.forEach(card => {
        card.addEventListener("click", () => {
            // Remove active class from all cards, add to clicked card
            galleryCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            // Extract project data attributes
            const title = card.getAttribute("data-title");
            const subtitle = card.getAttribute("data-subtitle");
            const status = card.getAttribute("data-status");
            const iterations = card.getAttribute("data-iterations");
            const imgPath = card.getAttribute("data-img");
            currentPanelId = card.getAttribute("data-panel");

            // Update Featured Artifact Panel details
            if (featuredTitle) featuredTitle.textContent = title;
            if (featuredSubtitle) featuredSubtitle.textContent = subtitle;
            if (featuredStatus) {
                featuredStatus.textContent = status;
                featuredStatus.className = "val " + (status === "PRODUCTION" || status === "ONLINE" ? "green-text" : "cyan-text");
            }
            if (featuredIterations) featuredIterations.textContent = iterations;

            // Update Featured Image Viewport with snappy digital fade transition
            if (featuredImg && imgPath) {
                featuredImg.style.transition = "opacity 0.15s cubic-bezier(0.2, 0, 0.2, 1), transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)";
                featuredImg.style.opacity = "0.1";
                featuredImg.style.transform = "scale(0.96) translate3d(0,0,0)";
                
                setTimeout(() => {
                    featuredImg.src = imgPath;
                    featuredImg.style.opacity = "1";
                    featuredImg.style.transform = "scale(1) translate3d(0,0,0)";
                }, 150);
            }
        });
    });

    // --- 4. VIEW PROJECT DETAIL PANEL TOGGLES ---
    const detailPanels = document.querySelectorAll(".detail-panel");
    const closeButtons = document.querySelectorAll(".panel-close-btn");

    // Open Panel from Featured Card view button
    if (featuredViewBtn) {
        featuredViewBtn.addEventListener("click", () => {
            const targetPanel = document.getElementById(currentPanelId);
            if (targetPanel) {
                targetPanel.classList.add("open");
                document.body.style.overflow = "hidden"; // lock page scroll
                
                // If it is the AI console panel, trigger typewriter typing
                if (currentPanelId === "panel-ai") {
                    setTimeout(runTerminalTypewriter, 300);
                }
            }
        });
    }

    // Connect nav sidebar links to overlay panels
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            const targetAttr = item.getAttribute("href");
            
            // Check if nav item targets a specific detail panel
            let panelTarget = null;
            if (targetAttr.includes("card-molebots")) {
                panelTarget = document.getElementById("panel-molebots");
            } else if (targetAttr.includes("card-sculpt")) {
                panelTarget = document.getElementById("panel-sculpt");
            } else if (targetAttr.includes("card-ai")) {
                panelTarget = document.getElementById("panel-ai");
            } else if (targetAttr.includes("secure-contact")) {
                panelTarget = document.getElementById("panel-contact");
            }

            if (panelTarget) {
                e.preventDefault();
                panelTarget.classList.add("open");
                document.body.style.overflow = "hidden";
                if (panelTarget.id === "panel-ai") {
                    setTimeout(runTerminalTypewriter, 300);
                }
            }
        });
    });

    // Close any active panel
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            detailPanels.forEach(panel => panel.classList.remove("open"));
            document.body.style.overflow = ""; // restore page scroll
        });
    });

    // --- 7. TELEMETRY STATUS DATA FLUCTUATIONS ---
    const flowDisplay = document.getElementById("flow-val");
    const flowFill = document.getElementById("flow-fill");
    const gaugeVal = document.getElementById("gauge-val");
    
    function updateStats() {
        // Extrusion flow telemetry progress bar (Panel A)
        if (flowDisplay && flowFill) {
            const flow = (94.0 + Math.random() * 4).toFixed(1);
            flowDisplay.textContent = `${flow}%`;
            flowFill.style.width = `${flow}%`;
        }
        
        // Gauge reading fluctuate (Panel A)
        if (gaugeVal) {
            const rpm = (64.5 + Math.random() * 1.5).toFixed(1);
            gaugeVal.textContent = rpm;
        }
    }
    
    setInterval(updateStats, 1500);
    updateStats();

    // --- 8. AI PROMPT TERMINAL PROCESSOR (PANEL AI) ---
    const termTypewriter = document.getElementById("term-typewriter");
    const termCompiling = document.getElementById("term-compiling");
    const barFill = document.getElementById("term-bar-fill");
    const termResults = document.getElementById("term-results");
    const btnReboot = document.getElementById("btn-reboot");
    
    const promptText = "compile synthetic brand narrative for molebots...";
    let textIndex = 0;
    let timerId;

    function runTerminalTypewriter() {
        if (!termTypewriter) return;
        termTypewriter.textContent = "";
        if (termCompiling) termCompiling.classList.add("hidden");
        if (barFill) barFill.style.width = "0%";
        if (termResults) termResults.classList.add("hidden");
        textIndex = 0;
        typeChar();
    }

    function typeChar() {
        if (textIndex < promptText.length) {
            termTypewriter.textContent += promptText.charAt(textIndex);
            textIndex++;
            timerId = setTimeout(typeChar, 35);
        } else {
            // Typing complete, trigger fake compiling process bar
            setTimeout(() => {
                if (termCompiling) termCompiling.classList.remove("hidden");
                
                // Animate progress bar fill over 1.2s
                setTimeout(() => {
                    if (barFill) barFill.style.width = "100%";
                    
                    // Show final response output
                    setTimeout(() => {
                        if (termResults) termResults.classList.remove("hidden");
                        const consoleElem = document.getElementById("term-console");
                        if (consoleElem) consoleElem.scrollTop = consoleElem.scrollHeight;
                    }, 1200);
                }, 100);
            }, 300);
        }
    }

    if (btnReboot) {
        btnReboot.addEventListener("click", () => {
            clearTimeout(timerId);
            runTerminalTypewriter();
        });
    }

    // --- 9. SECURE TRANSMISSION DISPATCH ---
    const contactForm = document.getElementById("secure-contact");
    const txStatus = document.getElementById("tx-status");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const sender = document.getElementById("sender-id").value.toUpperCase();
            const email = document.getElementById("sender-email").value.toUpperCase();
            
            txStatus.className = "tx-status";
            txStatus.innerHTML = `&gt; INITIATING CORE HANDSHAKE...<br>&gt; PACKETIZING COMMUNICATIONS DATA PAYLOAD...`;
            txStatus.classList.remove("hidden");
            
            setTimeout(() => {
                txStatus.innerHTML = `
                    &gt; TRANSMISSION SECURED & DISPATCHED.<br>
                    &gt; NODE_SENDER: ${sender}<br>
                    &gt; ROUTED_EMAIL: ${email}<br>
                    &gt; TRANSACTION STATUS: OK // SUCCESS 200
                `;
                contactForm.reset();
            }, 1500);
        });
    }

    console.log("%c FELIPE ANDRADE // BRUTALIST CORE SYS CONNECTED ", "background: #000; color: #00f0ff; font-size: 14px; font-weight: 800; padding: 5px; border: 1px solid #00f0ff;");

});
