/* ==========================================================================
   FELIPE ANDRADE // INTERACTIVE LOGIC MODULE // app.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. NAVIGATION SCROLL TRACKER ---
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    function updateActiveLink() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute("id");
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }
    
    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink(); // Run initially

    // --- 2. ZBRUSH VIEWPORT INTERACTION SIMULATION ---
    const toolShaded = document.getElementById("tool-shaded");
    const toolWireframe = document.getElementById("tool-wireframe");
    const toolGrid = document.getElementById("tool-grid");
    const toolRotate = document.getElementById("tool-rotate");
    
    const viewportImg = document.getElementById("viewport-img");
    const viewportGrid = document.getElementById("viewport-grid");
    const wireframeEffect = document.getElementById("wireframe-effect");

    // Shaded Mode Button
    toolShaded.addEventListener("click", () => {
        toolShaded.classList.add("active");
        toolWireframe.classList.remove("active");
        
        viewportImg.classList.remove("wireframe");
        wireframeEffect.classList.remove("active");
    });

    // Wireframe Mode Button
    toolWireframe.addEventListener("click", () => {
        toolWireframe.classList.add("active");
        toolShaded.classList.remove("active");
        
        viewportImg.classList.add("wireframe");
        wireframeEffect.classList.add("active");
    });

    // Toggle Grid lines
    toolGrid.addEventListener("click", () => {
        toolGrid.classList.toggle("active");
        if (viewportGrid.style.opacity === "0") {
            viewportGrid.style.opacity = "1";
        } else {
            viewportGrid.style.opacity = "0";
        }
    });

    // Toggle Rotation Simulation
    toolRotate.addEventListener("click", () => {
        toolRotate.classList.toggle("active");
        viewportImg.classList.toggle("rotated");
    });

    // --- 3. AI CONTENT TERMINAL TYPEWRITER SIMULATOR ---
    const typewriterText = document.getElementById("typewriter-text");
    const aiResponseContainer = document.getElementById("ai-response-container");
    const btnReRun = document.getElementById("btn-re-run");
    const promptString = "Generate brand narrative and aesthetic styling for Molebots...";
    let charIndex = 0;
    let typingSpeed = 50; // Milliseconds per character
    let typingTimeout;

    function startTypewriter() {
        typewriterText.textContent = "";
        aiResponseContainer.classList.add("hidden");
        charIndex = 0;
        typePrompt();
    }

    function typePrompt() {
        if (charIndex < promptString.length) {
            typewriterText.textContent += promptString.charAt(charIndex);
            charIndex++;
            typingTimeout = setTimeout(typePrompt, typingSpeed);
        } else {
            // Typing complete, trigger fake processing logs
            setTimeout(() => {
                aiResponseContainer.classList.remove("hidden");
                // Scroll terminal body down if needed
                const termBody = document.getElementById("ai-term-body");
                termBody.scrollTop = termBody.scrollHeight;
            }, 500);
        }
    }

    // Initialize typewriter when scroll triggers or page loads
    // We can run it on load, and make it re-runable
    startTypewriter();

    btnReRun.addEventListener("click", () => {
        clearTimeout(typingTimeout);
        startTypewriter();
    });

    // --- 4. CONTACT FORM SUBMISSION TRANSMISSION ---
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nameVal = document.getElementById("name").value.toUpperCase();
        const emailVal = document.getElementById("email").value.toUpperCase();
        
        // Show loading state
        formStatus.className = "form-status-msg success";
        formStatus.innerHTML = `&gt; ENCRYPTING CHANNELS...<br>&gt; COMPILING TRANSMISSION DATA...`;
        formStatus.classList.remove("hidden");
        
        setTimeout(() => {
            formStatus.innerHTML = `
                &gt; TRANSMISSION DISPATCHED SUCCESSFULLY.<br>
                &gt; SENDER_ID: ${nameVal}<br>
                &gt; ROUTING_EMAIL: ${emailVal}<br>
                &gt; RESPONSE RESOLVING VIA LOCAL NODE. STATUS: OK
            `;
            // Reset form fields
            contactForm.reset();
        }, 1500);
    });

    // --- 5. TECHNICAL CONSOLE LOG INITIALIZATION (HERO DIAGNOSTICS) ---
    console.log("%c FELIPE ANDRADE // PORTFOLIO CORE SYSTEM ONLINE ", "background: #111; color: #39ff14; font-size: 14px; font-weight: bold; border: 1px solid #39ff14; padding: 4px;");

});
