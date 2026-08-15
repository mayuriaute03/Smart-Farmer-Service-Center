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

// Complete i18n English & Marathi Dictionary across all Web Application pages
const i18nDict = {
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-services': 'Services',
        'nav-store': 'Store / Marketplace',
        'nav-contact': 'Contact Us',
        'nav-login': 'Login',
        'nav-register': 'Register',

        // Home Page
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

        // Services Page
        'services-title': 'Our Agricultural Services',
        'services-sub': 'Supporting your farming journey with modern technical solutions, live market rates, and expert agronomy advisories.',
        'srv1-title': 'Crop Guidance',
        'srv1-desc': 'Get automated recommendations for ideal crops based on geographical soils, seasonal rainfall estimates, and current temperatures. Maximize your farm output capacity.',
        'srv2-title': 'Fertilizer Suggestions',
        'srv2-desc': 'Determine the exact N-P-K nutrient composition ratios needed for your crops. Save input costs and optimize soil nutrition to avoid chemical excesses.',
        'srv3-title': 'Soil Testing',
        'srv3-desc': 'Submit local soil samples to our partner laboratories. Receive digital reports mapping soil pH, electrical conductivity, organic carbon levels, and water retention indicators.',
        'srv4-title': 'Government Schemes',
        'srv4-desc': 'Discover state and federal agriculture programs, low-interest microloans, seed subsidies, and crop insurance options tailored for smallholder farmers.',
        'srv5-title': 'Live Commodity Market Prices',
        'srv5-desc': 'Stay up to date with live wholesale pricing for grains, oilseeds, fruits, and vegetables from major regional market mandis. Prevent middleman exploitation.',
        'srv6-title': 'Expert Consultations',
        'srv6-desc': 'Directly ask agriculture professors and experienced agronomists questions regarding crop diseases, pest outbreaks, and advanced irrigation solutions.',
        'srv-cta-title': 'Need Personalized Agriculture Recommendations?',
        'srv-cta-sub': 'Register a farmer profile and enter your city to see dynamic recommendations and local weather insights in real time.',
        'srv-cta-btn': '<i class="bi bi-person-plus-fill me-2"></i>Create Farmer Profile',

        // Contact Page
        'contact-title': 'Contact Support & Inquiry',
        'contact-sub': 'Have questions about soil health, agricultural supplies, or governmental schemes? Send us a message.',
        'contact-touch': 'Get In Touch',
        'contact-touch-desc': 'Our agricultural support personnel and agronomy consultants are available Monday through Saturday (8:00 AM - 6:00 PM) to help address crop failures, ordering complications, or support inquiries.',
        'contact-hq': 'Corporate HQ',
        'contact-addr': 'Main Road, Galleborgaon, MH20-431102',
        'contact-phone-lbl': 'Phone Line',
        'contact-email-lbl': 'Email Support',
        'contact-form-title': 'Submit An Inquiry',
        'lbl-name': 'Your Name',
        'lbl-email': 'Email Address',
        'lbl-msg': 'Message / Inquiry Details',
        'btn-send': '<i class="bi bi-send-fill me-2"></i>Send Message',

        // Authentication Pages
        'login-welcome': 'Welcome Back',
        'login-sub': 'Sign in to access your farmer dashboard or admin controls',
        'lbl-password': 'Password',
        'btn-signin': '<i class="bi bi-box-arrow-in-right me-2"></i>Sign In',
        'login-no-acc': 'Don\'t have an account yet?',
        'login-create-acc': 'Create a Farmer Account',
        'reg-title': 'Farmer Registration',
        'reg-sub': 'Create an account to track local weather conditions and access the marketplace',
        'lbl-fullname': 'Full Name',
        'reg-pwd-note': 'Passwords are validated upon form submission.',
        'btn-create-acc': '<i class="bi bi-person-check-fill me-2"></i>Create Account',
        'reg-already-acc': 'Already have a profile?',
        'reg-signin-btn': 'Sign In Instead',

        // Store & Cart Pages
        'cart-title': 'Your Shopping Cart',
        'cart-sub': 'Review your selected items and complete your order checkout.',
        'store-title': 'Seeds & Tools Marketplace',
        'store-sub': 'High-quality seeds, organic fertilizers, tools, and ecological pest control options.',
        'cat-all': 'All Products',
        'cat-seeds': 'Seeds',
        'cat-fert': 'Fertilizers',
        'cat-tools': 'Tools',
        'cat-pest': 'Pesticides',
        'btn-add-cart': '<i class="bi bi-cart-plus-fill me-2"></i>Add to Cart',
        'no-products': 'No products found in our catalog. Check back soon!',
        'tbl-product': 'Product',
        'tbl-price': 'Price',
        'tbl-qty': 'Quantity',
        'tbl-subtotal': 'Subtotal',
        'cart-empty-hdr': 'Your cart is currently empty',
        'cart-empty-sub': 'Go browse our catalog and add items before checking out.',
        'btn-cont-shop': '<i class="bi bi-arrow-left me-2"></i>Continue Shopping',
        'btn-clear-cart': '<i class="bi bi-trash-fill me-2"></i>Clear Entire Cart',
        'inv-summary': 'Invoice Summary',
        'inv-subtotal': 'Subtotal',
        'inv-tax': 'Tax / Service (0%)',
        'inv-total': 'Grand Total',
        'inv-note': '<i class="bi bi-info-circle-fill me-2"></i>Orders will be logged to the order tracking database for profile fulfillment.',
        'btn-complete-checkout': '<i class="bi bi-credit-card-fill me-2"></i>Complete Checkout',

        // Footer
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
        // Navigation
        'nav-home': 'मुख्यपृष्ठ',
        'nav-services': 'सेवा',
        'nav-store': 'दुकान / बाजारपेठ',
        'nav-contact': 'संपर्क साधा',
        'nav-login': 'लॉगिन',
        'nav-register': 'नोंदणी करा',

        // Home Page
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

        // Services Page
        'services-title': 'आमच्या कृषी सेवा',
        'services-sub': 'आधुनिक तंत्रज्ञान, थेट बाजारभाव आणि कृषी तज्ञांच्या सल्ल्याने तुमच्या शेती प्रवासाला पाठबळ देणे.',
        'srv1-title': 'पीक मार्गदर्शन',
        'srv1-desc': 'जमीन, हंगामी पाऊस आणि तापमानावर आधारित योग्य पिकांसाठी स्वयंचलित शिफारसी मिळवा. शेताचे उत्पन्न वाढवा.',
        'srv2-title': 'खत व्यवस्थापन शिफारसी',
        'srv2-desc': 'पिकांसाठी आवश्यक अचूक N-P-K पोषक घटकांचे प्रमाण जाणून घ्या. खर्च वाचवा आणि जमिनीची सुपीकता टिकवा.',
        'srv3-title': 'माती परीक्षण',
        'srv3-desc': 'मातीचे नमुने आमच्या लॅबमध्ये तपासा. जमिनीचा pH, सेंद्रिय कर्ब आणि पाणी धरून ठेवण्याची क्षमता याबद्दल डिजिटल रिपोर्ट मिळवा.',
        'srv4-title': 'सरकारी योजना',
        'srv4-desc': 'राज्य व केंद्र सरकारच्या योजना, कमी व्याजाची कर्जे, बियाणे सबसिडी आणि पीक विम्याची माहिती मिळवा.',
        'srv5-title': 'थेट बाजारभाव (मंडी भाव)',
        'srv5-desc': 'प्रमुख कृषी उत्पन्न बाजार समित्यांमधील धान्य, फळे व भाजीपाल्याचे थेट घाऊक भाव पहा. मध्यस्थांची फसवणूक टाळा.',
        'srv6-title': 'कृषी तज्ञ सल्ला',
        'srv6-desc': 'पिकांवरील रोग, कीड प्रादुर्भाव आणि आधुनिक सिंचनाबाबत कृषी तज्ञ व प्राध्यापकांकडून थेट मार्गदर्शन मिळवा.',
        'srv-cta-title': 'तुम्हाला वैयक्तिक कृषी सल्ल्याची गरज आहे का?',
        'srv-cta-sub': 'शेतकरी प्रोफाइल नोंदवा आणि थेट हवामान अंदाज व शिफारसी मिळवण्यासाठी तुमचे शहर प्रविष्ट करा.',
        'srv-cta-btn': '<i class="bi bi-person-plus-fill me-2"></i>शेतकरी प्रोफाइल तयार करा',

        // Contact Page
        'contact-title': 'संपर्क आणि मदत केंद्र',
        'contact-sub': 'मातीचे आरोग्य, कृषी साहित्य किंवा सरकारी योजनांबद्दल प्रश्न आहेत? आम्हाला संदेश पाठवा.',
        'contact-touch': 'संपर्क साधा',
        'contact-touch-desc': 'आमचे कृषी सहाय्यक आणि सल्लागार सोमवार ते शनिवार (सकाळी ८ ते संध्याकाळी ६) उपलब्ध आहेत.',
        'contact-hq': 'मुख्य कार्यालय',
        'contact-addr': 'मुख्य रस्ता, गल्ले बोरगाव, MH20-431102',
        'contact-phone-lbl': 'फोन नंबर',
        'contact-email-lbl': 'ईमेल सपोर्ट',
        'contact-form-title': 'तुमचा प्रश्न नोंदवा',
        'lbl-name': 'तुमचे नाव',
        'lbl-email': 'ईमेल पत्ता',
        'lbl-msg': 'संदेश / प्रश्नाचा तपशील',
        'btn-send': '<i class="bi bi-send-fill me-2"></i>संदेश पाठवा',

        // Authentication Pages
        'login-welcome': 'पुन्हा स्वागत आहे',
        'login-sub': 'तुमच्या शेतकरी प्रोफाइल किंवा ॲडमिन पॅनेलमध्ये प्रवेश करण्यासाठी साइन इन करा',
        'lbl-password': 'पासवर्ड',
        'btn-signin': '<i class="bi bi-box-arrow-in-right me-2"></i>साइन इन करा',
        'login-no-acc': 'अद्याप खाते नाही का?',
        'login-create-acc': 'शेतकरी खाते तयार करा',
        'reg-title': 'शेतकरी नोंदणी',
        'reg-sub': 'हवामान माहिती आणि बाजारपेठ वापरासाठी खाते तयार करा',
        'lbl-fullname': 'पूर्ण नाव',
        'reg-pwd-note': 'फॉर्म सबमिट करताना पासवर्डची पडताळणी केली जाते.',
        'btn-create-acc': '<i class="bi bi-person-check-fill me-2"></i>खाते तयार करा',
        'reg-already-acc': 'आधीच खाते आहे का?',
        'reg-signin-btn': 'येथे साइन इन करा',

        // Store & Cart Pages
        'cart-title': 'तुमची खरेदी टोपली (कार्ट)',
        'cart-sub': 'निवडलेल्या वस्तू तपासा आणि खरेदी पूर्ण करा.',
        'store-title': 'बियाणे व अवजारे बाजारपेठ',
        'store-sub': 'उच्च दर्जाची बियाणे, सेंद्रिय खते, अवजारे आणि जैविक कीटकनाशके.',
        'cat-all': 'सर्व उत्पादने',
        'cat-seeds': 'बियाणे',
        'cat-fert': 'खते',
        'cat-tools': 'अवजारे',
        'cat-pest': 'कीटकनाशके',
        'btn-add-cart': '<i class="bi bi-cart-plus-fill me-2"></i>कार्टमध्ये जोडा',
        'no-products': 'सध्या कोणतेही उत्पादन उपलब्ध नाही.',
        'tbl-product': 'उत्पादन',
        'tbl-price': 'किंमत',
        'tbl-qty': 'प्रमाण',
        'tbl-subtotal': 'एकूण',
        'cart-empty-hdr': 'तुमचे कार्ट सध्या रिकामे आहे',
        'cart-empty-sub': 'आमच्या कॅटलॉगमधून उत्पादने निवडून कार्टमध्ये जोडा.',
        'btn-cont-shop': '<i class="bi bi-arrow-left me-2"></i>खरेदी सुरू ठेवा',
        'btn-clear-cart': '<i class="bi bi-trash-fill me-2"></i>कार्ट रिकामे करा',
        'inv-summary': 'बिल सारांश',
        'inv-subtotal': 'उपएकूण',
        'inv-tax': 'कर / सेवा शुल्क (०%)',
        'inv-total': 'एकूण रक्कम',
        'inv-note': '<i class="bi bi-info-circle-fill me-2"></i>ऑर्डरची नोंद ट्रॅकिंग डेटाबेसमध्ये केली जाईल.',
        'btn-complete-checkout': '<i class="bi bi-credit-card-fill me-2"></i>खरेदी पूर्ण करा',

        // Footer
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
