document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add loading animation
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        loader?.classList.add('hidden');
    });

    // Highlight active section in navigation
    const sections = document.querySelectorAll('.section');
    const navigationLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight/3)) {
                current = section.getAttribute('id');
            }
        });

        navigationLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Intersection Observer for section animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                updateActiveNav(entry.target.id);
            }
        });
    }, { threshold: 0.2 });

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Update active navigation link
    function updateActiveNav(sectionId) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    const vehicles = {
        'mercedes-v250': { name: 'Mercedes V250', price: 3500 },
        'mercedes-v250d': { name: 'Mercedes V250d', price: 3500 },
        'mercedes-v300': { name: 'Mercedes V300', price: 4000 },
        'bmw-f30': { name: 'BMW G20', price: 2500 },
        'bmw-gt': { name: 'BMW GT', price: 2500 }
    };

    const vehicleCards = document.querySelectorAll('.vehicle-card');
    const selectedVehicleInput = document.getElementById('selectedVehicle');
    const bookingForm = document.getElementById('bookingForm');
    const summaryDetails = document.querySelector('.summary-details');
    const totalPrice = document.querySelector('.total-price');

    vehicleCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous selection
            document.querySelector('.vehicle-card.selected')?.classList.remove('selected');
            
            // Add new selection
            card.classList.add('selected');
            const vehicleId = card.dataset.vehicle;
            selectedVehicleInput.value = vehicles[vehicleId].name;
            
            updateBookingSummary();
        });
    });

    function updateBookingSummary() {
        const selectedVehicle = document.querySelector('.vehicle-card.selected');
        if (!selectedVehicle) return;

        const vehicleId = selectedVehicle.dataset.vehicle;
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        
        if (startDate && endDate) {
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const price = vehicles[vehicleId].price;
            const totalAmount = days * price;

            summaryDetails.innerHTML = `
                <p>Vehicle: ${vehicles[vehicleId].name}</p>
                <p>Duration: ${days} days</p>
                <p>Daily Rate: £${price}</p>
            `;
            totalPrice.innerHTML = `Total: £${totalAmount}`;
        }
    }

    ['startDate', 'endDate'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateBookingSummary);
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your booking submission logic here
        alert('Booking request submitted successfully!');
    });

    // Additional JavaScript for menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const floatNav = document.querySelector('.float-nav');
    let hideTimeout;

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        floatNav.classList.toggle('active');
        
        // Clear any existing timeout
        clearTimeout(hideTimeout);
    });

    // Auto-hide menu after 3 seconds of inactivity
    function startHideTimeout() {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            menuToggle.classList.remove('active');
            floatNav.classList.remove('active');
        }, 3000);
    }

    // Reset timer when user interacts with menu
    floatNav.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
    });

    floatNav.addEventListener('mouseleave', () => {
        startHideTimeout();
    });

    // Hide menu when clicking a link
    document.querySelectorAll('.float-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Smooth scroll to section
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // Hide menu
            menuToggle.classList.remove('active');
            floatNav.classList.remove('active');
        });
    });

    // Hide menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !floatNav.contains(e.target)) {
            menuToggle.classList.remove('active');
            floatNav.classList.remove('active');
        }
    });

    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Remove any existing messages
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        try {
            // Simulate API call - Replace with your actual email sending logic
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-message success';
            successMessage.textContent = 'Message sent successfully!';
            contactForm.appendChild(successMessage);
            contactForm.reset();

        } catch (error) {
            // Error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'form-message error';
            errorMessage.textContent = 'Failed to send message. Please try again.';
            contactForm.appendChild(errorMessage);
        }

        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Remove message after 5 seconds
        setTimeout(() => {
            const message = contactForm.querySelector('.form-message');
            if (message) {
                message.remove();
            }
        }, 5000);
    });

    const swiper = new Swiper('.vehicleSwiper', {
        // Core settings
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 1000,
        
        // Use slide effect instead of fade
        effect: 'slide',
        
        // Enable better touch handling
        touchEventsTarget: 'wrapper',
        touchRatio: 1,
        touchAngle: 45,
        
        // Auto play
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        
        // Navigation
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: 'progressbar'
        },
        
        // Better performance
        preloadImages: true,
        updateOnWindowResize: true,
        
        // Keyboard control
        keyboard: {
            enabled: true,
            onlyInViewport: true
        },
        
        // Mouse/touch interaction
        grabCursor: true,
        
        // Transition effects
        on: {
            slideChangeTransitionStart: function() {
                const activeSlide = this.slides[this.activeIndex];
                activeSlide.style.transform = 'scale(1.05)';
            },
            slideChangeTransitionEnd: function() {
                this.slides.forEach(slide => {
                    slide.style.transform = 'scale(1)';
                });
            }
        }
    });

    const carData = {
        'mercedes-v250': {
            name: 'Mercedes V250',
            images: [
                'images/gallery/mercedes-v250/exterior-1.jpg',
                'images/gallery/mercedes-v250/exterior-2.jpg',
                'images/gallery/mercedes-v250/interior-1.jpg',
                'images/gallery/mercedes-v250/interior-2.jpg',
                'images/gallery/mercedes-v250/detail-1.jpg'
            ]
        },
        'mercedes-v250d': {
            name: 'Mercedes V250d',
            images: [
                'images/gallery/mercedes-v250d/exterior-1.jpg',
                'images/gallery/mercedes-v250d/exterior-2.jpg',
                'images/gallery/mercedes-v250d/interior-1.jpg',
                'images/gallery/mercedes-v250d/interior-2.jpg',
                'images/gallery/mercedes-v250d/detail-1.jpg'
            ]
        },
        'mercedes-v300': {
            name: 'Mercedes V300',
            images: [
                'images/gallery/mercedes-v300/exterior-1.jpg',
                'images/gallery/mercedes-v300/exterior-2.jpg',
                'images/gallery/mercedes-v300/interior-1.jpg',
                'images/gallery/mercedes-v300/interior-2.jpg',
                'images/gallery/mercedes-v300/detail-1.jpg'
            ]
        },
        'bmw-g20': {
            name: 'BMW G20',
            images: [
                'images/gallery/bmw-g20/exterior-1.jpg',
                'images/gallery/bmw-g20/exterior-2.jpg',
                'images/gallery/bmw-g20/interior-1.jpg',
                'images/gallery/bmw-g20/interior-2.jpg',
                'images/gallery/bmw-g20/detail-1.jpg'
            ]
        },
        'bmw-gt': {
            name: 'BMW GT',
            images: [
                'images/gallery/bmw-gt/exterior-1.jpg',
                'images/gallery/bmw-gt/exterior-2.jpg',
                'images/gallery/bmw-gt/interior-1.jpg',
                'images/gallery/bmw-gt/interior-2.jpg',
                'images/gallery/bmw-gt/detail-1.jpg'
            ]
        }
    };

    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalMainImage');
    const thumbnailsContainer = document.querySelector('.modal-thumbnails');
    const closeBtn = document.querySelector('.close-modal');

    // Add click handlers to all car folders
    document.querySelectorAll('.car-folder').forEach(folder => {
        folder.addEventListener('click', function() {
            const carId = this.dataset.car;
            const carImages = getCarImages(carId);
            
            if (carImages && carImages.length > 0) {
                // Set main image
                modalImg.src = carImages[0];
                modalImg.alt = carId;

                // Clear and populate thumbnails
                thumbnailsContainer.innerHTML = '';
                carImages.forEach((imgSrc, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = imgSrc;
                    thumb.classList.add('thumbnail');
                    if (index === 0) thumb.classList.add('active');
                    
                    thumb.addEventListener('click', () => {
                        modalImg.src = imgSrc;
                        // Update active thumbnail
                        document.querySelectorAll('.thumbnail').forEach(t => 
                            t.classList.remove('active'));
                        thumb.classList.add('active');
                    });

                    thumbnailsContainer.appendChild(thumb);
                });

                // Show modal
                modal.classList.add('active');
            }
        });
    });

    // Close modal handlers
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Helper function to get car images
    function getCarImages(carId) {
        const imagePaths = {
            'mercedes-v250': [
                'images/vehicles/mercedes-v250/cover.png',
                'images/vehicles/mercedes-v250/front-1.png',
                'images/vehicles/mercedes-v250/frontside-2.png',
                'images/vehicles/mercedes-v250/exterior-2.png',
                'images/vehicles/mercedes-v250/exterior-1.png',
            ],
            'mercedes-v250d': [
                'images/vehicles/mercedes-v250d/cover.jpg',
                'images/vehicles/mercedes-v250d/black_mercedes-v_2023_17178_511f.jpg',
                'images/vehicles/mercedes-v250d/black_mercedes-v_2023_17179_d18f.jpg',
                'images/vehicles/mercedes-v250d/black_mercedes-v_2023_17183_03ea.jpg',
                'images/vehicles/mercedes-v250d/black_mercedes-v_2023_17180_2da4.jpg',
            ],
            'mercedes-v300': [
                'images/vehicles/mercedes-v300/cover.jpg',
                'images/vehicles/mercedes-v300/backinside.jpg',
                'images/vehicles/mercedes-v300/frontinside.jpg',
                'images/vehicles/mercedes-v300/backside.jpg',
                'images/vehicles/mercedes-v300/fullback.jpg',
                'images/vehicles/mercedes-v300/fullfront.jpg',
                'images/vehicles/mercedes-v300/side-1.jpg',
                'images/vehicles/mercedes-v300/side-2.jpg',
            ],
            'bmw-g20': [
                'images/vehicles/bmw-g20/cover.jpg',
                'images/vehicles/bmw-g20/BMW-G20-3-Series-1.jpg',
                'images/vehicles/bmw-g20/BMW-G20-3-Series-3.jpg',
                'images/vehicles/bmw-g20/BMW-G20-3-Series-9.jpg',
                'images/vehicles/bmw-g20/BMW-G20-3-Series-11.jpg',
                'images/vehicles/bmw-g20/BMW-G20-3-Series-13.jpg',
                'images/vehicles/bmw-g20/BMW-G20-3-Series-15.jpg',
                'images/vehicles/bmw-g20/BMW-G20-3-Series-18.jpg',
            ],
            'bmw-gt': [
                'images/vehicles/bmw gt/cover.jpg',
                'images/vehicles/bmw gt/Crop800x600(1).jpg',
                'images/vehicles/bmw gt/Crop800x600(2).jpg',
                'images/vehicles/bmw gt/Crop800x600(3).jpg',
                'images/vehicles/bmw gt/Crop800x600(4).jpg',
                'images/vehicles/bmw gt/Crop800x600(5).jpg',
                'images/vehicles/bmw gt/Crop800x600(6).jpg',
            ]
        };
        return imagePaths[carId] || [];
    }
});