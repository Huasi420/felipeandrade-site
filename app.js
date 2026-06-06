/* ==========================================================================
   FELIPE ANDRADE // CORE SYSTEM INTERACTIONS // app.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CUSTOM CURSOR & AMBIENT GLOW ---
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
    const interactables = document.querySelectorAll("a, button, input, textarea, .card-interactive, .vp-viewport-container");
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

    // --- 2. 3D CSS CUBE ROTATION CONTROLS ---
    const cube3d = document.getElementById("cube-3d");
    const container3d = document.getElementById("3d-container");
    const rotDisplay = document.getElementById("vp-rot-display");
    
    let isDragging = false;
    let startX = 0, startY = 0;
    let rotX = -25; // initial tilt
    let rotY = 45;  // initial angle
    let autoRotActive = true;

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

    // --- 3. LIVE SYSTEM TELEMETRY FLUCTUATIONS ---
    const uptimeDisplay = document.getElementById("tel-uptime");
    const cpuDisplay = document.getElementById("stat-cpu");
    const memDisplay = document.getElementById("stat-mem");
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
        
        // Extrusion flow telemetry progress bar
        if (flowDisplay && flowFill) {
            const flow = (94.0 + Math.random() * 4).toFixed(1);
            flowDisplay.textContent = `${flow}%`;
            flowFill.style.width = `${flow}%`;
        }
        
        // Gauge reading fluctuate
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

    // --- 4. AI PROMPT TERMINAL PROCESSOR ---
    const termTypewriter = document.getElementById("term-typewriter");
    const termCompiling = document.getElementById("term-compiling");
    const barFill = document.getElementById("term-bar-fill");
    const termResults = document.getElementById("term-results");
    const btnReboot = document.getElementById("btn-reboot");
    
    const promptText = "compile synthetic brand narrative for mentiramentira.com...";
    let textIndex = 0;
    let timerId;

    function runTerminalTypewriter() {
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

    runTerminalTypewriter();

    btnReboot.addEventListener("click", () => {
        clearTimeout(timerId);
        runTerminalTypewriter();
    });

    // --- 5. SECURE TRANSMISSION DISPATCH ---
    const contactForm = document.getElementById("secure-contact");
    const txStatus = document.getElementById("tx-status");

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

    console.log("%c FELIPE ANDRADE // SYSTEM CORE LOADED AND CONNECTED ", "background: #000; color: #39ff14; font-size: 14px; font-weight: 800; padding: 5px; border: 1px solid #39ff14;");

});
