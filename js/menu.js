        // Mobile menu toggle functionality
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const servicesDropdown = document.getElementById('servicesDropdown');
        const mobileDropdown = document.getElementById('mobileDropdown');
        
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = mobileMenuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Mobile dropdown functionality
        servicesDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            mobileDropdown.style.display = mobileDropdown.style.display === 'block' ? 'none' : 'block';
            
            // Rotate chevron icon
            const chevron = servicesDropdown.querySelector('i');
            chevron.classList.toggle('fa-rotate-180');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && 
                !mobileMenuToggle.contains(e.target) && 
                mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                
                // Also close dropdown if open
                mobileDropdown.style.display = 'none';
                const chevron = servicesDropdown.querySelector('i');
                if (chevron.classList.contains('fa-rotate-180')) {
                    chevron.classList.remove('fa-rotate-180');
                }
            }
        });

// Slideshow functionality for past activities
const pastActivitySlides = document.querySelectorAll('.triple-gallery .gallery-item:first-child .slide');
if (pastActivitySlides.length > 0) {
    let pastActivityCurrent = 0;
    
    function showPastActivitySlide(n) {
        pastActivitySlides.forEach(slide => slide.classList.remove('active'));
        pastActivityCurrent = (n + pastActivitySlides.length) % pastActivitySlides.length;
        pastActivitySlides[pastActivityCurrent].classList.add('active');
    }
    
    setInterval(() => {
        showPastActivitySlide(pastActivityCurrent + 1);
    }, 5000);
}

// Slideshow functionality for testimonials
const testimonialSlides = document.querySelectorAll('.triple-gallery .gallery-item:nth-child(2) .slide');
if (testimonialSlides.length > 0) {
    let testimonialCurrent = 0;
    
    function showTestimonialSlide(n) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialCurrent = (n + testimonialSlides.length) % testimonialSlides.length;
        testimonialSlides[testimonialCurrent].classList.add('active');
    }
    
    setInterval(() => {
        showTestimonialSlide(testimonialCurrent + 1);
    }, 5000);
}

// Slideshow functionality for upcoming events
const eventSlides = document.querySelectorAll('.triple-gallery .gallery-item:last-child .slide');
if (eventSlides.length > 0) {
    let eventCurrent = 0;
    
    function showEventSlide(n) {
        eventSlides.forEach(slide => slide.classList.remove('active'));
        eventCurrent = (n + eventSlides.length) % eventSlides.length;
        eventSlides[eventCurrent].classList.add('active');
    }
    
    setInterval(() => {
        showEventSlide(eventCurrent + 1);
    }, 5000);
}

// Video play functionality
const video = document.querySelector('video');
const videoOverlay = document.querySelector('.video-overlay');

if (video && videoOverlay) {
    videoOverlay.addEventListener('click', () => {
        video.play();
        videoOverlay.style.display = 'none';
        video.setAttribute('controls', 'controls');
    });
}

// WhatsApp button functionality
const whatsappBtn = document.querySelector('.whatsapp');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
        window.open('https://wa.me/2349166385000', '_blank');
    });
}

// Book button functionality
const bookBtn = document.querySelector('.book');
if (bookBtn) {
    bookBtn.addEventListener('click', () => {
        window.location.href = '#reservation';
    });
}

// Chat button functionality (JivoChat)
const chatBtn = document.querySelector('.chat');
if (chatBtn) {
    chatBtn.addEventListener('click', () => {
        // This would be replaced with actual JivoChat API call
        alert('Live chat will open here connected to JivoChat');
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(76, 175, 80, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.background = 'var(--primary-green)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the form data to your server
        // For demonstration, we'll just show an alert
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Initialize Google Map
function initMap() {
    // This would be replaced with actual Google Maps API code
    console.log('Google Maps would be initialized here');
}

// Contact links functionality
document.querySelectorAll('.contact-detail a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.href.startsWith('mailto:')) {
            // Email link
            return true;
        } else if (this.href.startsWith('tel:')) {
            // Phone link
            return true;
        } else if (this.href.includes('maps.google.com')) {
            // Map link
            return true;
        }
    });
});






