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

// Complete i18n English & Marathi Dictionary
const i18nDict = {
    en: {
        'nav-home': 'Home',
        'nav-services': 'Services',
        'nav-store': 'Store / Marketplace',
        'nav-contact': 'Contact Us',
        'nav-login': 'Login',
        'nav-register': 'Register',
        'hero-title-1': 'Welcome to Mayuri\'s Farm',
        'hero-sub-1': 'Get instant weather forecasts, tailored crop advice, access to quality farming products, and expert insights to maximize your harvest yield.',
        'btn-explore-1': '<i class="bi bi-gear-fill me-2"></i>Explore Services',
        'btn-market-1': '<i class="bi bi-bag-fill me-2"></i>Visit Marketplace',
        'hero-title-2': 'Live Weather and Crop Guidance',
        'hero-sub-2': 'Access hyper-localized live weather data and connect with agronomy specialists to make informed irrigation and seeding decisions.',
        'btn-register-2': '<i class="bi bi-person-plus-fill me-2"></i>Register Today',
        'btn-details-2': 'Guidance Details',
        'hero-title-3': 'Premium Seeds, Fertilizers & Tools',
        'hero-sub-3': 'Purchase curated, tested, and certified inputs directly from our digital storefront with simplified payments and door-to-door delivery.',
        'btn-shop-3': '<i class="bi bi-cart-fill me-2"></i>Shop Seeds & Tools',
        'btn-support-3': 'Contact Support',
        'why-title': 'Why Smart Farmer Service Center?',
        'why-sub': 'We combine traditional agriculture knowledge with modern tech solutions to deliver an all-in-one platform built for the modern farmer\'s everyday needs.',
        'card1-title': 'Live Forecasts & Guidance',
        'card1-desc': 'Enter your city coordinates to see up-to-date atmospheric information. Get recommendations on planting and pest prevention matching your climate conditions.',
        'card2-title': 'Quality Agri-Marketplace',
        'card2-desc': 'Browse high-grade seeds, fertilizers, and tools. Our products are sourced directly from verified manufacturers, ensuring quality compliance and longevity.',
        'card3-title': 'Expert Support & Schemes',
        'card3-desc': 'Stay informed on governmental subsidies and crop insurance schemas. Submit your issues directly to our consulting team for quick, custom resolutions.',
        'footer-desc': 'Empowering agricultural communities with localized live weather updates, expert guidance, specialized soil health schemes, and direct access to high-quality marketplace inputs like seeds, tools, and fertilizers.',
        'footer-quick-title': 'Quick Links',
        'footer-link-home': '<i class="bi bi-chevron-right me-1 small"></i> Home Overview',
        'footer-link-services': '<i class="bi bi-chevron-right me-1 small"></i> Agriculture Services',
        'footer-link-store': '<i class="bi bi-chevron-right me-1 small"></i> Seeds & Tools Store',
        'footer-link-contact': '<i class="bi bi-chevron-right me-1 small"></i> Customer Support',
        'footer-contact-title': 'Contact & Support',
        'footer-address': 'Main Road, Galleborgaon, MH20-431102',
        'footer-copy': '&copy; 2026 Smart Farmer Service Center. All Rights Reserved.',
        'footer-privacy': 'Privacy Policy',
        'footer-terms': 'Terms of Use'
    },
    mr: {
        'nav-home': 'मुख्यपृष्ठ',
        'nav-services': 'सेवा',
        'nav-store': 'दुकान / बाजारपेठ',
        'nav-contact': 'संपर्क साधा',
        'nav-login': 'लॉगिन',
        'nav-register': 'नोंदणी करा',
        'hero-title-1': 'मयुरीच्या शेतात आपले स्वागत आहे',
        'hero-sub-1': 'त्वरित हवामान अंदाज, पिकांचा सल्ला, दर्जेदार शेती उत्पादने आणि उत्पन्नामध्ये वाढ करण्यासाठी तज्ञांचे मार्गदर्शन मिळवा.',
        'btn-explore-1': '<i class="bi bi-gear-fill me-2"></i>सेवा पहा',
        'btn-market-1': '<i class="bi bi-bag-fill me-2"></i>बाजारपेठ भेट द्या',
        'hero-title-2': 'थेट हवामान आणि पीक मार्गदर्शन',
        'hero-sub-2': 'तुमच्या क्षेत्रातील थेट हवामान माहिती मिळवा आणि सिंचन व पेरणीच्या योग्य निर्णयासाठी कृषी तज्ञांशी संपर्क साधा.',
        'btn-register-2': '<i class="bi bi-person-plus-fill me-2"></i>आजच नोंदणी करा',
        'btn-details-2': 'मार्गदर्शन तपशील',
        'hero-title-3': 'उत्कृष्ट बियाणे, खते आणि अवजारे',
        'hero-sub-3': 'थेट आमच्या डिजिटल स्टोअरमधून प्रमाणित उत्पादने खरेदी करा, सोप्या पेमेंटसह घरापर्यंत डिलिव्हरी मिळवा.',
        'btn-shop-3': '<i class="bi bi-cart-fill me-2"></i>बियाणे व अवजारे खरेदी करा',
        'btn-support-3': 'ग्राहक मदत',
        'why-title': 'स्मार्ट शेतकरी सेवा केंद्र का निवडावे?',
        'why-sub': 'आम्ही पारंपारिक कृषी ज्ञान आणि आधुनिक तंत्रज्ञान एकत्र आणून शेतकऱ्यांच्या दैनंदिन गरजांसाठी सर्वसमावेशक व्यासपीठ पुरवतो.',
        'card1-title': 'थेट हवामान अंदाज आणि सल्ला',
        'card1-desc': 'हवामानाची ताजी माहिती पाहण्यासाठी शहराचे नाव टाका. तुमच्या हवामानानुसार पेरणी आणि कीड नियंत्रणाचे उपाय मिळवा.',
        'card2-title': 'दर्जेदार कृषी बाजारपेठ',
        'card2-desc': 'उच्च दर्जाची बियाणे, खते आणि अवजारे पहा. आमची उत्पादने थेट प्रमाणित उत्पादकांकडून प्राप्त केली जातात.',
        'card3-title': 'तज्ञ मदत आणि सरकारी योजना',
        'card3-desc': 'सरकारी सबसिडी आणि पीक विमा योजनांची माहिती ठेवा. तुमच्या समस्यांच्या त्वरित निवारणासाठी आमच्या टीमशी संपर्क साधा.',
        'footer-desc': 'शेतकरी बांधवांना थेट हवामान अंदाज, कृषी तज्ञांचे मार्गदर्शन, मृदा आरोग्य योजना आणि दर्जेदार कृषी साहित्याची सोय उपलब्ध करून देत आहोत.',
        'footer-quick-title': 'महत्वाच्या लिंक्स',
        'footer-link-home': '<i class="bi bi-chevron-right me-1 small"></i> मुख्यपृष्ठ',
        'footer-link-services': '<i class="bi bi-chevron-right me-1 small"></i> कृषी सेवा',
        'footer-link-store': '<i class="bi bi-chevron-right me-1 small"></i> बियाणे व अवजारे दुकान',
        'footer-link-contact': '<i class="bi bi-chevron-right me-1 small"></i> ग्राहक मदत',
        'footer-contact-title': 'संपर्क आणि मदत',
        'footer-address': 'मुख्य रस्ता, गल्ले बोरगाव, MH20-431102',
        'footer-copy': '&copy; २०२६ स्मार्ट शेतकरी सेवा केंद्र. सर्व हक्क सुरक्षित.',
        'footer-privacy': 'गोपनीयता धोरण',
        'footer-terms': 'वापराच्या अटी'
    }
};

function initLanguageSelector() {
    const langBtn = document.getElementById('langToggleBtn');
    if (!langBtn) return;

    let currentLang = localStorage.getItem('appLang') || 'en';
    langBtn.textContent = currentLang === 'en' ? 'EN' : 'मराठी';
    translateUI(currentLang);

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'mr' : 'en';
        localStorage.setItem('appLang', currentLang);
        langBtn.textContent = currentLang === 'en' ? 'EN' : 'मराठी';
        
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
