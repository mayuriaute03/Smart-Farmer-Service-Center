document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Image Background Carousel
    initHeroCarousel();

    // 2. Bootstrap 5 Validation Layer
    initFormValidation();

    // 3. Alerts Engine - Fade out after 4000ms
    initAlertsEngine();

    // 4. Theme Toggle
    initThemeToggle();

    // 5. Language Selector
    initLanguageSelector();
});

/**
 * Hero Background Carousel
 * Toggles active class on slides inside .hero-slider every 5000ms.
 */
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slider .hero-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5000 milliseconds

    // Set first slide active initially if none active
    let hasActive = false;
    slides.forEach(slide => {
        if (slide.classList.contains('active')) {
            hasActive = true;
        }
    });
    if (!hasActive) {
        slides[0].classList.add('active');
    }

    setInterval(() => {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Calculate index of next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to next slide
        slides[currentSlide].classList.add('active');
    }, slideInterval);
}

/**
 * Bootstrap 5 form validation handler
 * Hooks into forms with class '.needs-validation'
 */
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    // Loop over forms and prevent submission if invalid
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            // Additional custom validations (e.g. minimum password lengths or specific patterns)
            const passwordInput = form.querySelector('input[type="password"]');
            if (passwordInput && passwordInput.value.length > 0 && passwordInput.value.length < 6) {
                passwordInput.setCustomValidity('Password must be at least 6 characters.');
                // Show custom validation message if needed
                const feedback = passwordInput.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.textContent = 'Password must be at least 6 characters.';
                }
            } else if (passwordInput) {
                passwordInput.setCustomValidity('');
            }

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);

        // Reset custom validation on input changes
        const passwordInput = form.querySelector('input[type="password"]');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                if (passwordInput.value.length >= 6) {
                    passwordInput.setCustomValidity('');
                }
            });
        }
    });
}

/**
 * Alerts Engine
 * Locates alert popups, waits 4000ms, and fades them out smoothly.
 */
function initAlertsEngine() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        // Wait 4000ms before starting fade
        setTimeout(() => {
            alert.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s ease';
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            
            // Remove from DOM after fade completes
            setTimeout(() => {
                alert.remove();
            }, 800);
        }, 4000);
    });
}

// Theme Toggle & Language Selection Logic
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initLanguageSelector();
});

function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggle') || document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('themeIcon') || document.getElementById('theme-icon');
    
    if (!themeToggleBtn || !themeIcon) return;
    
    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // Smooth rotation animation
        themeIcon.style.transition = 'transform 0.4s ease, opacity 0.2s ease';
        themeIcon.style.transform = 'rotate(180deg) scale(0.8)';
        themeIcon.style.opacity = '0.5';
        
        setTimeout(() => {
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
                themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
            }
            themeIcon.style.transform = 'rotate(360deg) scale(1)';
            themeIcon.style.opacity = '1';
            
            // Reset transform for next click
            setTimeout(() => {
                themeIcon.style.transition = 'none';
                themeIcon.style.transform = 'rotate(0deg) scale(1)';
            }, 400);
        }, 200);
    });
}

// Minimal i18n English & Marathi Dictionary
const i18nDict = {
    en: {
        'nav-home': 'Home',
        'nav-services': 'Services',
        'nav-store': 'Store / Marketplace',
        'nav-contact': 'Contact Us',
        'nav-login': 'Login',
        'nav-register': 'Register',
        'hero-title': 'Welcome to Mayuri\'s Farm',
        'hero-sub': 'Get instant weather forecasts, tailored crop advice, access to quality farming products, and expert insights to maximize your harvest yield.',
        'btn-explore': '<i class="bi bi-gear-fill me-2"></i>Explore Services',
        'btn-market': '<i class="bi bi-bag-fill me-2"></i>Visit Marketplace'
    },
    mr: {
        'nav-home': 'मुख्यपृष्ठ',
        'nav-services': 'सेवा',
        'nav-store': 'दुकान',
        'nav-contact': 'संपर्क',
        'nav-login': 'लॉगिन',
        'nav-register': 'नोंदणी करा',
        'hero-title': 'मयुरीच्या शेतात आपले स्वागत आहे',
        'hero-sub': 'त्वरित हवामान अंदाज, पिकांचा सल्ला, दर्जेदार शेती उत्पादने आणि तज्ञांचे मार्गदर्शन मिळवा.',
        'btn-explore': '<i class="bi bi-gear-fill me-2"></i>सेवा एक्सप्लोर करा',
        'btn-market': '<i class="bi bi-bag-fill me-2"></i>बाजारपेठ भेट द्या'
    }
};

function initLanguageSelector() {
    const langToggleBtn = document.getElementById('langToggle');
    if (!langToggleBtn) return;

    let currentLang = localStorage.getItem('appLang') || 'en';
    
    // Set initial button text based on lang
    if(currentLang === 'mr') {
        langToggleBtn.innerHTML = 'MR / EN';
    } else {
        langToggleBtn.innerHTML = 'EN / MR';
    }
    
    translateUI(currentLang);

    langToggleBtn.addEventListener('click', () => {
        // Toggle language
        currentLang = (currentLang === 'en') ? 'mr' : 'en';
        localStorage.setItem('appLang', currentLang);
        
        // Update button text
        if(currentLang === 'mr') {
            langToggleBtn.innerHTML = 'MR / EN';
        } else {
            langToggleBtn.innerHTML = 'EN / MR';
        }
        
        // Add a smooth fade out
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            translateUI(currentLang);
            document.body.style.opacity = '1';
        }, 300);
    });
}

function translateUI(lang) {
    const dict = i18nDict[lang];
    if (!dict) return;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });
}
