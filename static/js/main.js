document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Image Background Carousel
    initHeroCarousel();

    // 2. Bootstrap 5 Validation Layer
    initFormValidation();

    // 3. Alerts Engine - Fade out after 4000ms
    initAlertsEngine();
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
