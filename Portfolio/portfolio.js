document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.style.display = 'none';
    });

    // Smooth Scrolling for Navbar Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
                navLinks.forEach(lnk => lnk.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Section Fade-In Animation
    const animateSections = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'skills') {
                    const progressBars = document.querySelectorAll('.progress-bar');
                    progressBars.forEach(bar => {
                        bar.style.width = bar.style.width;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animateSections.forEach(section => sectionObserver.observe(section));

    // Project Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                }
            });
        });
    });

    // Project Modal Functionality
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    const modalTitle = document.getElementById('modal-project-title');
    const modalImage = document.getElementById('modal-project-image');
    const modalDescription = document.getElementById('modal-project-description');
    const modalTech = document.getElementById('modal-project-tech');
    const modalOutcome = document.getElementById('modal-project-outcome');

    const projectDetails = {
        wheat: {
            title: 'Organic Wheat Farming',
            image: 'wheat.jpg',
            description: 'This project focused on implementing sustainable farming techniques to grow organic wheat. We used crop rotation, natural fertilizers, and pest management to ensure a healthy yield.',
            tech: 'Organic Farming, Crop Rotation, Natural Pest Control',
            outcome: 'Increased wheat yield by 20% while maintaining soil health.'
        },
        weather: {
            title: 'Smart Kisaan Weather Tool',
            image: 'weather.jpg',
            description: 'Developed a weather forecasting tool integrated into the Smart Kisaan platform, helping farmers plan their activities based on real-time weather data.',
            tech: 'JavaScript, OpenWeatherMap API, Bootstrap',
            outcome: 'Enabled over 1,000 farmers to make informed decisions.'
        },
        irrigation: {
            title: 'Drip Irrigation System',
            image: 'drip.jpg',
            description: 'Designed and implemented a cost-effective drip irrigation system for small-scale farmers to optimize water usage and improve crop health.',
            tech: 'Irrigation Design, Water Management',
            outcome: 'Reduced water usage by 30% while improving crop yield.'
        }
    };

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectKey = button.getAttribute('data-project');
            const project = projectDetails[projectKey];
            modalTitle.textContent = project.title;
            modalImage.src = project.image;
            modalDescription.textContent = project.description;
            modalTech.textContent = project.tech;
            modalOutcome.textContent = project.outcome;
        });
    });

    // Contact Form Validation and Submission (Demo)
    const contactForm = document.querySelector('.contact-form');
    const contactSubmitBtn = document.getElementById('contact-submit');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    if (contactSubmitBtn) {
        contactSubmitBtn.addEventListener('click', () => {
            let isValid = true;

            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('is-invalid');
            });

            if (!nameInput.value.trim()) {
                nameInput.classList.add('is-invalid');
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            }

            if (!messageInput.value.trim()) {
                messageInput.classList.add('is-invalid');
                isValid = false;
            }

            if (isValid) {
                alert('Message sent successfully! (Demo)');
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
            }
        });
    }

    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
        });
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggleBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Load Theme Preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Initialize Bootstrap Tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});