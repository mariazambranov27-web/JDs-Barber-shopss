// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const heroBackground1 = document.querySelector('.hero-bg-layer-1');
const heroBackground2 = document.querySelector('.hero-bg-layer-2');

// Background carousel functionality
const backgroundImages = [
    'images/cortes/corte.jpg',
    'images/cortes/corte2.jpg',
    'images/cortes/corte3.jpg',
    'images/cortes/corte4.jpg',
    'images/cortes/corte5.jpg',
    'images/cortes/corte6.jpg',
    'images/cortes/corte7.jpg',
    'images/cortes/corte8.jpg'
];

let currentBgIndex = 0;
let isLayer1Active = true;

function showNextBackground() {
    if (!heroBackground1 || !heroBackground2) return;
    
    currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
    
    const activeLayer = isLayer1Active ? heroBackground1 : heroBackground2;
    const inactiveLayer = isLayer1Active ? heroBackground2 : heroBackground1;
    
    // Prepare the inactive layer with new image
    inactiveLayer.style.backgroundImage = `url('${backgroundImages[currentBgIndex]}')`;
    inactiveLayer.style.transform = 'scale(1)';
    
    // Cross-fade to the new image
    activeLayer.classList.remove('active');
    inactiveLayer.classList.add('active');
    
    // Switch which layer is active
    isLayer1Active = !isLayer1Active;
}

function startBackgroundCarousel() {
    if (!heroBackground1 || !heroBackground2) return;
    
    // Set initial background on layer 1
    heroBackground1.style.backgroundImage = `url('${backgroundImages[0]}')`;
    heroBackground1.classList.add('active');
    heroBackground1.style.transform = 'scale(1)';
    
    // Start carousel after 4 seconds, then change every 5 seconds
    setTimeout(() => {
        setInterval(showNextBackground, 5000);
    }, 4000);
}

// Modal functionality
const appointmentModal = document.getElementById('appointment-modal');
const appointmentModalBtns = document.querySelectorAll('#appointment-modal-btn, #appointment-modal-btn-hero');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const appointmentForm = document.getElementById('appointment-form');

// Show modal
appointmentModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        appointmentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Hide modal
function hideModal() {
    appointmentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

modalClose.addEventListener('click', hideModal);
modalCancel.addEventListener('click', hideModal);

// Close modal when clicking outside
appointmentModal.addEventListener('click', (e) => {
    if (e.target === appointmentModal) {
        hideModal();
    }
});

// Form submission
appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const selectedServices = [];
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
    serviceCheckboxes.forEach(checkbox => {
        selectedServices.push(checkbox.value);
    });
    
    const preferredDate = document.getElementById('preferred-date').value;
    
    if (selectedServices.length === 0) {
        alert('Por favor selecciona al menos un servicio.');
        return;
    }
    
    // Generate WhatsApp message
    const serviceNames = {
        'barba': 'Arreglo de Barba',
        'corte': 'Corte de Cabello',
        'cejas': 'Arreglo de Cejas'
    };
    
    const servicesText = selectedServices.map(service => serviceNames[service]).join(', ');
    const dateText = new Date(preferredDate).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const message = `Hola! Me gustaría agendar una cita en JD Barbershop para los siguientes servicios:\n\n✂️ Servicios: ${servicesText}\n📅 Fecha preferida: ${dateText}\n\n¡Gracias!`;
    
    openWhatsApp(message);
    hideModal();
});

// WhatsApp functionality
function openWhatsApp(customMessage = null) {
    const phoneNumber = '+50762046250';
    const message = customMessage || 'Hola, me gustaría agendar una cita en JD Barbershop';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Navbar scroll effect
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// Close mobile menu when clicking on links
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Smooth scroll to sections
function scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Intersection Observer for animation on scroll
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add active class to current section in navigation
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Add hover effects to cards
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .contact-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.style.transform.includes('translateY')) {
                this.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('service-card')) {
                this.style.transform = '';
            } else {
                this.style.transform = '';
            }
        });
    });
}

// Add click ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .social-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                background-color: rgba(255, 255, 255, 0.4);
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Location button functionality
function handleLocationClick() {
    const locationQuery = 'Brisas del Golf, Panama';
    const mapsURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;
    window.open(mapsURL, '_blank');
}

// Add CSS for ripple animation
const rippleStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Create and append style sheet for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for navigation
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateActiveNavLink);
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
            closeMobileMenu();
        });
    });

    // WhatsApp nav button (direct)
    const whatsappNavBtn = document.getElementById('whatsapp-nav');
    if (whatsappNavBtn) {
        whatsappNavBtn.addEventListener('click', () => openWhatsApp());
    }

    // Location button event listener
    const locationBtn = document.getElementById('location-btn');
    if (locationBtn) {
        locationBtn.addEventListener('click', handleLocationClick);
    }

    // Initialize features
    createIntersectionObserver();
    addCardHoverEffects();
    addRippleEffect();
    
    // Start background carousel
    startBackgroundCarousel();
    
    // Initialize scroll position
    handleScroll();
    updateActiveNavLink();
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Enhanced scroll performance
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(function() {
            handleScroll();
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
}

// Use the enhanced scroll handler
window.addEventListener('scroll', requestTick);

// Preloader functionality (if needed)
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add smooth reveal animations for elements that come into view
function addScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', addScrollAnimations);