class GallerySystem {
    constructor() {
        this.gallery = document.querySelector('.gallery-grid');
        this.filters = document.querySelector('.filters');
        this.lightbox = document.getElementById('lightbox');
        this.modal = document.getElementById('galleryModal');
        this.modalImage = document.getElementById('modalMainImage');
        this.thumbnailsContainer = document.querySelector('.modal-thumbnails');
        this.closeBtn = document.querySelector('.close-modal');
        this.cars = [
            {
                id: 1,
                name: 'Bentley Continental GT',
                category: 'sports',
                image: 'images/bentley.jpg',
                price: '$1,200/day',
                specs: 'V8 Engine, 542 HP'
            },
            {
                id: 2,
                name: 'Mercedes V250',
                category: 'mercedes',
                image: 'images/vehicles/mercedes-v250/main.jpg',
                price: '$150/day',
                specs: 'Luxury Van, 7 Seats, 2.0L Diesel Engine, 190 HP'
            },
            {
                id: 3,
                name: 'Mercedes V250d',
                category: 'mercedes',
                image: 'images/vehicles/mercedes-v250d/main.jpg',
                price: '$160/day',
                specs: 'Luxury Van, 7 Seats, 2.0L Diesel Engine, 190 HP'
            },
            // Add more cars
        ];

        // Define car image paths
        this.carImages = {
            'mercedes-v250': {
                name: 'Mercedes V250',
                images: [
                    'images/vehicles/mercedes-v250/cover.png',
                    'images/vehicles/mercedes-v250/front-1.png',
                    'images/vehicles/mercedes-v250/frontside-2.png',
                    'images/vehicles/mercedes-v250/exterior-1.png',
                    'images/vehicles/mercedes-v250/exterior-2.png'
                ]
            },
            'mercedes-v250d': {
                name: 'Mercedes V250d',
                images: [
                    'images/vehicles/mercedes-v250d/cover.jpg',
                    'images/vehicles/mercedes-v250d/front.jpg',
                    'images/vehicles/mercedes-v250d/leftside.jpg',
                    'images/vehicles/mercedes-v250d/backside.jpg',
                    'images/vehicles/mercedes-v250d/inside.jpg'
                ]
            },
            'mercedes-v300': {
                name: 'Mercedes V300',
                images: [
                    'images/vehicles/mercedes-v300/cover.jpg',
                    'images/vehicles/mercedes-v300/frontinside.jpg',
                    'images/vehicles/mercedes-v300/backinsde.jpg',
                    'images/vehicles/mercedes-v300/fullfront.jpg',
                    'images/vehicles/mercedes-v300/fullback.jpg',
                    'images/vehicles/mercedes-v300/backside.jpg',
                    'images/vehicles/mercedes-v300/side-1.jpg',
                    'images/vehicles/mercedes-v300/side-2.jpg'
                ]
            },
            'bmw-g20': {
                name: 'BMW G20',
                images: [
                    'images/vehicles/bmw-g20/cover.jpg',
                    'images/vehicles/bmw-g20/BMW-G20-3-Series-1.jpg',
                    'images/vehicles/bmw-g20/BMW-G20-3-Series-3.jpg',
                    'images/vehicles/bmw-g20/BMW-G20-3-Series-9.jpg',
                    'images/vehicles/bmw-g20/BMW-G20-3-Series-11.jpg',
                    'images/vehicles/bmw-g20/BMW-G20-3-Series-13.jpg',
                    'images/vehicles/bmw-g20/BMW-G20-3-Series-15.jpg',
                    'images/vehicles/bmw-g20/BMW-G20-3-Series-18.jpg',
                ]
            },
            'bmw-gt': {
                name: 'BMW GT',
                images: [
                    'images/vehicles/bmw-gt/cover.jpg',
                    'images/vehicles/bmw-gt/back.jpg',
                    'images/vehicles/bmw-gt/front.jpg',
                    'images/vehicles/bmw-gt/frontinside.jpg',
                    'images/vehicles/bmw-gt/leftside.jpg',
                    'images/vehicles/bmw-gt/opendoor.jpg',
                    'images/vehicles/bmw-gt/rightback.jpg'
                ]
            }
        };

        this.initializeGallery();
        this.initializeFilters();
        this.initializeLightbox();
    }

    initializeGallery() {
        this.renderCars(this.cars);

        // Add click handlers to car folders
        document.querySelectorAll('.car-folder').forEach(folder => {
            folder.addEventListener('click', () => {
                const carId = folder.dataset.car;
                this.openModal(carId);
            });
        });

        // Close modal handlers
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Keyboard handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    renderCars(cars) {
        this.gallery.innerHTML = cars.map(car => `
            <div class="car-card" data-category="${car.category}">
                <img src="${car.image}" alt="${car.name}" onclick="gallery.openLightbox(${car.id})">
                <h3>${car.name}</h3>
                <p class="price">${car.price}</p>
                <p class="specs">${car.specs}</p>
            </div>
        `).join('');
    }

    initializeFilters() {
        this.filters.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const category = e.target.dataset.filter;
                this.filterCars(category);
                
                // Update active filter button
                document.querySelectorAll('.filter-btn').forEach(btn => 
                    btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    filterCars(category) {
        const filteredCars = category === 'all' 
            ? this.cars 
            : this.cars.filter(car => car.category === category);
        
        this.renderCars(filteredCars);
    }

    openLightbox(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;

        this.lightbox.innerHTML = `
            <span class="close" onclick="gallery.closeLightbox()">&times;</span>
            <img src="${car.image}" alt="${car.name}">
            <div class="car-details">
                <h2>${car.name}</h2>
                <p class="price">${car.price}</p>
                <p class="specs">${car.specs}</p>
                <a href="rent.html?car=${carId}" class="rent-btn">Rent Now</a>
            </div>
        `;
        this.lightbox.classList.add('active');
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
    }

    openModal(carId) {
        const car = this.carImages[carId];
        if (!car) return;

        // Set main image
        this.modalImage.src = car.images[0];
        this.modalImage.alt = car.name;

        // Clear and populate thumbnails
        this.thumbnailsContainer.innerHTML = '';
        car.images.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.classList.add('thumbnail');
            if (index === 0) thumb.classList.add('active');
            
            thumb.addEventListener('click', () => {
                this.modalImage.src = imgSrc;
                this.thumbnailsContainer.querySelectorAll('.thumbnail')
                    .forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });

            this.thumbnailsContainer.appendChild(thumb);
        });

        // Show modal
        this.modal.classList.add('active');
    }

    closeModal() {
        this.modal.classList.remove('active');
    }
}

const gallery = new GallerySystem();