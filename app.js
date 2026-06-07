/* ==========================================================================
   FELIPE ANDRADE // CORE SYSTEM INTERACTIONS // app.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const snapScrollParent = document.querySelector(".snap-scroll-parent");
    
    // --- 1. FORCED 2.5S INTRO LOADER SEQUENCE ---
    const loaderScreen = document.getElementById("loader-screen");
    const loadPct = document.getElementById("load-pct");
    const loadFill = document.getElementById("load-fill");
    const loadMsg = document.getElementById("load-msg");
    
    const bootMessages = [
        "ESTABLISHING SECURE CONNECTION...",
        "PARSING ASCII GEOMETRY MODULES...",
        "MOUNTING 3D VIEWPORT KERNEL...",
        "SYNCHRONIZING PORKBUN DNS CONNECT...",
        "COMPILING STYLESHEET ARRAYS...",
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
            loadPct.textContent = "100%";
            loadFill.style.width = "100%";
            loadMsg.textContent = bootMessages[bootMessages.length - 1];
            
            setTimeout(() => {
                // Slice reveal
                loaderScreen.classList.add("loaded");
                
                // Remove from DOM interaction path after animations finish
                setTimeout(() => {
                    loaderScreen.style.display = "none";
                }, 1000);
            }, 400);
        } else {
            // Update loading pct and fill bar
            loadPct.textContent = `${Math.floor(loaderProgress).toString().padStart(2, '0')}%`;
            loadFill.style.width = `${loaderProgress}%`;
            
            // Fluctuating boot status messages
            const msgIndex = Math.min(
                Math.floor((loaderProgress / 100) * bootMessages.length),
                bootMessages.length - 2
            );
            loadMsg.textContent = bootMessages[msgIndex];
        }
    }, loaderIntervalTime);

    // --- 2. CUSTOM CURSOR & AMBIENT GLOW ---
    const customCursor = document.getElementById("custom-cursor");
    const cursorRing = document.querySelector(".cursor-ring");
    const cursorLabel = document.getElementById("cursor-label");
    const mouseGlow = document.getElementById("mouse-glow");
    const telCoords = document.getElementById("tel-coords");
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move crosshair cursor directly
        customCursor.style.left = `${mouseX}px`;
        customCursor.style.top = `${mouseY}px`;
        
        // Update coordinates in status bar
        if (telCoords) {
            telCoords.textContent = `X: ${String(mouseX).padStart(3, '0')} / Y: ${String(mouseY).padStart(3, '0')}`;
        }
        
        // Update radial lighting position
        if (mouseGlow) {
            mouseGlow.style.setProperty("--mouse-x", `${e.clientX}px`);
            mouseGlow.style.setProperty("--mouse-y", `${e.clientY}px`);
        }
    });

    // Smooth cursor trailing ring
    function updateCursorRing() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        
        requestAnimationFrame(updateCursorRing);
    }
    updateCursorRing();

    // Scale cursor hover states
    function addHoverListeners() {
        const interactables = document.querySelectorAll("a, button, input, textarea, .card-interactive, .vp-viewport-container, .panel-close-btn");
        interactables.forEach(el => {
            el.addEventListener("mouseenter", () => {
                customCursor.classList.add("active");
                cursorLabel.textContent = "SYS_HOVER";
                cursorLabel.style.color = "var(--accent-orange)";
                cursorLabel.style.borderColor = "rgba(255, 94, 0, 0.4)";
            });
            el.addEventListener("mouseleave", () => {
                customCursor.classList.remove("active");
                cursorLabel.textContent = "SYS_IDLE";
                cursorLabel.style.color = "var(--accent-neon)";
                cursorLabel.style.borderColor = "rgba(57, 255, 20, 0.3)";
            });
        });
    }
    addHoverListeners();

    // --- 3. HORIZONTAL SLIDE-OUT DETAIL PANELS ---
    const panelMolebots = document.getElementById("panel-molebots");
    const panelSculpt = document.getElementById("panel-sculpt");
    const panelAi = document.getElementById("panel-ai");
    
    const cardMolebots = document.getElementById("card-molebots");
    const cardSculpt = document.getElementById("card-sculpt");
    const cardAi = document.getElementById("card-ai");
    
    const closeMolebots = document.getElementById("close-molebots");
    const closeSculpt = document.getElementById("close-sculpt");
    const closeAi = document.getElementById("close-ai");

    // Open Panels
    cardMolebots.addEventListener("click", () => {
        panelMolebots.classList.add("open");
        snapScrollParent.style.overflowY = "hidden"; // lock vertical snap scroll
    });
    cardSculpt.addEventListener("click", () => {
        panelSculpt.classList.add("open");
        snapScrollParent.style.overflowY = "hidden";
    });
    cardAi.addEventListener("click", () => {
        panelAi.classList.add("open");
        snapScrollParent.style.overflowY = "hidden";
        // Trigger typewriter inside panel C when opened
        setTimeout(runTerminalTypewriter, 300);
    });

    // Close Panels
    closeMolebots.addEventListener("click", () => {
        panelMolebots.classList.remove("open");
        snapScrollParent.style.overflowY = "scroll"; // unlock vertical snap scroll
    });
    closeSculpt.addEventListener("click", () => {
        panelSculpt.classList.remove("open");
        snapScrollParent.style.overflowY = "scroll";
    });
    closeAi.addEventListener("click", () => {
        panelAi.classList.remove("open");
        snapScrollParent.style.overflowY = "scroll";
    });

    // --- 4. ZBRUSH 3D CUBE ROTATION CONTROLS (PANEL SCULPT) ---
    const cube3d = document.getElementById("cube-3d");
    const container3d = document.getElementById("3d-container");
    const rotDisplay = document.getElementById("vp-rot-display");
    
    let isDragging = false;
    let startX = 0, startY = 0;
    let rotX = -25; // initial tilt
    let rotY = 45;  // initial angle
    let autoRotActive = true;

    if (container3d) {
        container3d.addEventListener("mousedown", (e) => {
            isDragging = true;
            autoRotActive = false; // Pause auto rotate on drag
            startX = e.clientX;
            startY = e.clientY;
            
            const instruct = container3d.querySelector(".vp-overlay-instruct");
            if (instruct) instruct.style.opacity = "0.1";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging || !cube3d) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            rotY += deltaX * 0.5;
            rotX -= deltaY * 0.5;
            
            // Clamp X tilt to prevent vertical inversion
            rotX = Math.max(-80, Math.min(80, rotX));
            
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
                // Resume auto-rotation after 3 seconds of inactivity
                setTimeout(() => {
                    if (!isDragging) autoRotActive = true;
                }, 3000);
            }
        });
    }

    // Auto rotate cube when idle
    function autoRotateCube() {
        if (autoRotActive && cube3d) {
            rotY += 0.4;
            cube3d.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            if (rotDisplay) {
                rotDisplay.textContent = `ROT: X: ${Math.round(rotX)}° / Y: ${Math.round(rotY)}°`;
            }
        }
        requestAnimationFrame(autoRotateCube);
    }
    autoRotateCube();

    // --- 5. LIVE SYSTEM TELEMETRY FLUCTUATIONS ---
    const uptimeDisplay = document.getElementById("tel-uptime");
    const cpuDisplay = document.getElementById("stat-cpu");
    const memDisplay = document.getElementById("stat-mem");
    
    // Panel specific telemetry
    const flowDisplay = document.getElementById("flow-val");
    const flowFill = document.getElementById("flow-fill");
    const gaugeVal = document.getElementById("gauge-val");
    
    const startTime = Date.now();

    function updateStats() {
        // CPU Load fluctuate
        if (cpuDisplay) {
            const loadVal = (10 + Math.random() * 8).toFixed(1);
            cpuDisplay.textContent = `${loadVal}%`;
        }
        
        // Memory capacity hover
        if (memDisplay) {
            const memVal = (98.0 + Math.random() * 0.8).toFixed(1);
            memDisplay.textContent = `${memVal}%`;
        }
        
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

        // Ticking Uptime
        const elapsedSecs = Math.floor((Date.now() - startTime) / 1000);
        const hrs = String(Math.floor(elapsedSecs / 3600)).padStart(2, '0');
        const mins = String(Math.floor((elapsedSecs % 3600) / 60)).padStart(2, '0');
        const secs = String(elapsedSecs % 60).padStart(2, '0');
        if (uptimeDisplay) {
            uptimeDisplay.textContent = `${hrs}:${mins}:${secs}`;
        }
    }
    
    setInterval(updateStats, 1500);
    updateStats();

    // --- 6. AI PROMPT TERMINAL PROCESSOR (PANEL AI) ---
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
        termCompiling.classList.add("hidden");
        barFill.style.width = "0%";
        termResults.classList.add("hidden");
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
                termCompiling.classList.remove("hidden");
                
                // Animate progress bar fill over 1.2s
                setTimeout(() => {
                    barFill.style.width = "100%";
                    
                    // Show final response output
                    setTimeout(() => {
                        termResults.classList.remove("hidden");
                        const consoleElem = document.getElementById("term-console");
                        consoleElem.scrollTop = consoleElem.scrollHeight;
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

    // --- 7. SECURE TRANSMISSION DISPATCH ---
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

    // Navigation Active Link highlight on Scroll (snap observer)
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".snap-board");
    
    const navObserverOptions = {
        root: snapScrollParent,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    console.log("%c FELIPE ANDRADE // SYSTEM CORE LOADED AND CONNECTED ", "background: #000; color: #39ff14; font-size: 14px; font-weight: 800; padding: 5px; border: 1px solid #39ff14;");

});
