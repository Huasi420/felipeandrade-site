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

    // --- 2. FUTURISTIC CUSTOM CURSOR & AMBIENT COORDINATES ---
    const customCursor = document.getElementById("custom-cursor");
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorRing = document.querySelector(".cursor-ring");
    const cursorLabel = document.getElementById("cursor-label");
    const telCoords = document.getElementById("tel-coords");
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move inner dot instantly
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Smooth cursor trailing ring
    function updateCursorRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        
        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        
        requestAnimationFrame(updateCursorRing);
    }
    updateCursorRing();

    // Scale cursor hover states
    function addHoverListeners() {
        const interactables = document.querySelectorAll("a, button, input, textarea, .card-interactive, .featured-viewport-container, .panel-close-btn");
        interactables.forEach(el => {
            el.addEventListener("mouseenter", () => {
                if (customCursor) customCursor.classList.add("active");
                if (cursorLabel) cursorLabel.textContent = "SYS_HOVER";
            });
            el.addEventListener("mouseleave", () => {
                if (customCursor) customCursor.classList.remove("active");
                if (cursorLabel) cursorLabel.textContent = "SYS_IDLE";
            });
        });
    }
    addHoverListeners();

    // --- 3. DYNAMIC INTERACTIVE GALLERY PROJECT SWITCHER ---
    const galleryCards = document.querySelectorAll(".gallery-card");
    const featuredTitle = document.getElementById("featured-title");
    const featuredSubtitle = document.getElementById("featured-subtitle");
    const featuredStatus = document.getElementById("featured-status");
    const featuredIterations = document.getElementById("featured-iterations");
    const featuredViewBtn = document.getElementById("featured-view-btn");
    const cube3d = document.getElementById("cube-3d");

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
            currentPanelId = card.getAttribute("data-panel");

            // Update Featured Artifact Panel details
            if (featuredTitle) featuredTitle.textContent = title;
            if (featuredSubtitle) featuredSubtitle.textContent = subtitle;
            if (featuredStatus) {
                featuredStatus.textContent = status;
                // Change status color based on text
                featuredStatus.className = "val " + (status === "PRODUCTION" || status === "ONLINE" ? "green-text" : "cyan-text");
            }
            if (featuredIterations) featuredIterations.textContent = iterations;

            // Trigger a quick spin effect on the 3D cube model as a transition indicator
            if (cube3d) {
                cube3d.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
                cube3d.style.transform = "rotateX(360deg) rotateY(360deg)";
                setTimeout(() => {
                    cube3d.style.transition = "transform 0.1s ease-out";
                    rotX = -25; rotY = 45;
                    cube3d.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                }, 600);
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

    // --- 5. 3D CUBE DRAG ROTATION MECHANICS ---
    
    // VIEWPORT A: FEATURED PANEL VIEWPORT
    const container3d = document.getElementById("3d-container");
    const rotDisplay = document.getElementById("vp-rot-display");
    
    let isDragging = false;
    let startX = 0, startY = 0;
    let rotX = -25; // initial tilt
    let rotY = 45;  // initial angle
    let autoRotActive = true;

    if (container3d && cube3d) {
        container3d.addEventListener("mousedown", (e) => {
            isDragging = true;
            autoRotActive = false;
            startX = e.clientX;
            startY = e.clientY;
            
            const instruct = container3d.querySelector(".vp-overlay-instruct");
            if (instruct) instruct.style.opacity = "0.1";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            rotY += deltaX * 0.5;
            rotX -= deltaY * 0.5;
            
            rotX = Math.max(-85, Math.min(85, rotX)); // clamp tilt
            cube3d.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            
            if (rotDisplay) {
                rotDisplay.textContent = `ROT: X: ${Math.round(rotX)}° / Y: ${Math.round(rotY)}°`;
            }
            
            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => { if (!isDragging) autoRotActive = true; }, 3000);
            }
        });
    }

    // Auto rotate featured cube when idle
    function autoRotateCube() {
        if (autoRotActive && cube3d && !isDragging) {
            rotY += 0.35;
            cube3d.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            if (rotDisplay) {
                rotDisplay.textContent = `ROT: X: ${Math.round(rotX)}° / Y: ${Math.round(rotY)}°`;
            }
        }
        requestAnimationFrame(autoRotateCube);
    }
    autoRotateCube();

    // VIEWPORT B: PANEL SCULPT DETAIL VIEWPORT
    const cube3dSculpt = document.getElementById("cube-3d-sculpt");
    const container3dSculpt = document.getElementById("3d-container-sculpt");
    const rotDisplaySculpt = document.getElementById("vp-rot-display-sculpt");
    
    let isDraggingSculpt = false;
    let startXSculpt = 0, startYSculpt = 0;
    let rotXSculpt = -25, rotYSculpt = 45;
    let autoRotSculpt = true;

    if (container3dSculpt && cube3dSculpt) {
        container3dSculpt.addEventListener("mousedown", (e) => {
            isDraggingSculpt = true;
            autoRotSculpt = false;
            startXSculpt = e.clientX;
            startYSculpt = e.clientY;
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDraggingSculpt) return;
            
            const deltaX = e.clientX - startXSculpt;
            const deltaY = e.clientY - startYSculpt;
            
            rotYSculpt += deltaX * 0.5;
            rotXSculpt -= deltaY * 0.5;
            
            rotXSculpt = Math.max(-85, Math.min(85, rotXSculpt));
            cube3dSculpt.style.transform = `rotateX(${rotXSculpt}deg) rotateY(${rotYSculpt}deg)`;
            
            if (rotDisplaySculpt) {
                rotDisplaySculpt.textContent = `ROT: X: ${Math.round(rotXSculpt)}° / Y: ${Math.round(rotYSculpt)}°`;
            }
            
            startXSculpt = e.clientX;
            startYSculpt = e.clientY;
        });

        document.addEventListener("mouseup", () => {
            if (isDraggingSculpt) {
                isDraggingSculpt = false;
                setTimeout(() => { if (!isDraggingSculpt) autoRotSculpt = true; }, 3000);
            }
        });
    }

    function autoRotateCubeSculpt() {
        if (autoRotSculpt && cube3dSculpt && !isDraggingSculpt) {
            rotYSculpt += 0.4;
            cube3dSculpt.style.transform = `rotateX(${rotXSculpt}deg) rotateY(${rotYSculpt}deg)`;
            if (rotDisplaySculpt) {
                rotDisplaySculpt.textContent = `ROT: X: ${Math.round(rotXSculpt)}° / Y: ${Math.round(rotYSculpt)}°`;
            }
        }
        requestAnimationFrame(autoRotateCubeSculpt);
    }
    autoRotateCubeSculpt();

    // --- 6. DYNAMIC 3D WIREFRAME CANVASES GRID DRAWING (STATS CARD) ---
    const statsCanvas = document.getElementById("stats-canvas");
    if (statsCanvas) {
        const ctx = statsCanvas.getContext("2d");
        let waveTime = 0;

        function drawStatsMesh() {
            // Resize canvas context boundaries dynamically to parent box
            const parentWidth = statsCanvas.parentElement.clientWidth;
            const parentHeight = statsCanvas.parentElement.clientHeight || 80;
            statsCanvas.width = parentWidth;
            statsCanvas.height = parentHeight;

            ctx.clearRect(0, 0, statsCanvas.width, statsCanvas.height);
            
            // Draw real-time sine grid mesh
            ctx.strokeStyle = "rgba(0, 240, 255, 0.22)";
            ctx.lineWidth = 1;

            const gridRows = 5;
            const gridCols = 15;
            const stepX = statsCanvas.width / (gridCols - 1);
            const stepY = statsCanvas.height / (gridRows - 1);

            // Draw horizontal rows
            for (let r = 0; r < gridRows; r++) {
                ctx.beginPath();
                for (let c = 0; c < gridCols; c++) {
                    const x = c * stepX;
                    // distorts height coordinates using stacked math sine waves
                    const z = Math.sin(c * 0.5 + waveTime) * Math.cos(r * 0.4 + waveTime * 0.4) * 6;
                    const y = r * stepY + z + 8;
                    
                    if (c === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Draw vertical columns
            for (let c = 0; c < gridCols; c++) {
                ctx.beginPath();
                for (let r = 0; r < gridRows; r++) {
                    const x = c * stepX;
                    const z = Math.sin(c * 0.5 + waveTime) * Math.cos(r * 0.4 + waveTime * 0.4) * 6;
                    const y = r * stepY + z + 8;

                    if (r === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            waveTime += 0.025;
            requestAnimationFrame(drawStatsMesh);
        }
        
        // Start canvas wireframe animation
        drawStatsMesh();
    }

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
