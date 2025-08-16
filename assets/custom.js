// Custom JavaScript for Candle Making Guide

// Enforce light palette site-wide to prevent dark scheme from persisting on some pages
(function enforceLightPalette() {
    try {
        const root = document.documentElement;
        // Clear any stored palette/scheme preferences from previous sessions
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && /palette|color|scheme/i.test(k)) keysToRemove.push(k);
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

        // Force Material palette attributes
        root.setAttribute('data-md-color-scheme', 'default');
        root.setAttribute('data-md-color-primary', 'brown');
        root.setAttribute('data-md-color-accent', 'deep-orange');
    } catch (e) {
        // no-op
    }
})();

// Temperature Converter
function convertTemperature() {
    const fahrenheit = document.getElementById('fahrenheit');
    const celsius = document.getElementById('celsius');

    if (fahrenheit) {
        fahrenheit.addEventListener('input', function () {
            const f = parseFloat(this.value);
            if (!isNaN(f)) {
                celsius.value = ((f - 32) * 5 / 9).toFixed(1);
            }
        });
    }

    if (celsius) {
        celsius.addEventListener('input', function () {
            const c = parseFloat(this.value);
            if (!isNaN(c)) {
                fahrenheit.value = ((c * 9 / 5) + 32).toFixed(1);
            }
        });
    }
}

// Wax Calculator
function calculateWax() {
    const containerVolume = document.getElementById('container-volume');
    const waxNeeded = document.getElementById('wax-needed');

    if (containerVolume && waxNeeded) {
        containerVolume.addEventListener('input', function () {
            const volume = parseFloat(this.value);
            if (!isNaN(volume)) {
                // Approximate: 1 oz volume = 0.8 oz wax weight
                const wax = (volume * 0.8).toFixed(1);
                waxNeeded.textContent = wax + ' oz of wax needed';
            }
        });
    }
}

// Progress Tracking
function initializeProgressTracking() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        // Load saved state
        const saved = localStorage.getItem('candle-guide-' + checkbox.id);
        if (saved === 'true') {
            checkbox.checked = true;
        }

        // Save state on change
        checkbox.addEventListener('change', function () {
            localStorage.setItem('candle-guide-' + this.id, this.checked);
        });
    });
}

// Recipe Timer
function startTimer(minutes, elementId) {
    let timeLeft = minutes * 60;
    const display = document.getElementById(elementId);

    if (!display) return;

    const timer = setInterval(function () {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;

        display.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;

        if (timeLeft <= 0) {
            clearInterval(timer);
            display.textContent = 'Time\'s up!';
            display.style.color = '#e53e3e';

            // Optional: Play sound or show notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Candle Making Timer', {
                    body: 'Your timer has finished!',
                    icon: '/assets/candle-icon.png'
                });
            }
        }

        timeLeft--;
    }, 1000);
}

// Safety Checklist Validator
function validateSafetyChecklist() {
    const safetyItems = document.querySelectorAll('.safety-checklist input[type="checkbox"]');
    const continueButton = document.getElementById('safety-continue');

    if (safetyItems.length > 0 && continueButton) {
        const checkProgress = () => {
            const checkedItems = document.querySelectorAll('.safety-checklist input[type="checkbox"]:checked');
            const progress = (checkedItems.length / safetyItems.length) * 100;

            continueButton.disabled = progress < 100;
            continueButton.textContent = progress < 100 ?
                `Safety Check: ${Math.round(progress)}% Complete` :
                'All Safety Items Confirmed - Continue';
        };

        safetyItems.forEach(item => {
            item.addEventListener('change', checkProgress);
        });

        checkProgress(); // Initial check
    }
}

// Fragrance Calculator
function calculateFragranceLoad() {
    const waxAmount = document.getElementById('wax-amount');
    const fragrancePercent = document.getElementById('fragrance-percent');
    const fragranceNeeded = document.getElementById('fragrance-needed');

    if (waxAmount && fragrancePercent && fragranceNeeded) {
        const calculate = () => {
            const wax = parseFloat(waxAmount.value);
            const percent = parseFloat(fragrancePercent.value);

            if (!isNaN(wax) && !isNaN(percent)) {
                const fragrance = (wax * percent / 100).toFixed(2);
                fragranceNeeded.textContent = fragrance + ' oz fragrance oil needed';
            }
        };

        waxAmount.addEventListener('input', calculate);
        fragrancePercent.addEventListener('input', calculate);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    convertTemperature();
    calculateWax();
    initializeProgressTracking();
    validateSafetyChecklist();
    calculateFragranceLoad();

    // Request notification permission for timers
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Inject a small, relaxing decorative candle in the corner
    try {
        const candle = document.createElement('div');
        candle.id = 'calm-candle';
        candle.innerHTML = '<div class="wax"></div><div class="wick"></div><div class="flame" aria-hidden="true"></div>';
        candle.setAttribute('aria-hidden', 'true');
        document.body.appendChild(candle);
    } catch (e) { /* no-op */ }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Print-friendly recipe cards
function printRecipe(recipeId) {
    const recipe = document.getElementById(recipeId);
    if (recipe) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Candle Recipe</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 1in; }
                        .recipe-card { border: 2px solid #333; padding: 1rem; }
                        h3 { color: #333; border-bottom: 2px solid #333; }
                    </style>
                </head>
                <body>
                    ${recipe.outerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}
