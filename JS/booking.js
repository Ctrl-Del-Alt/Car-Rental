class BookingSystem {
    constructor() {
        this.form = document.getElementById('bookingForm');
        this.resultDiv = document.getElementById('bookingResult');
        this.availableCars = {
            'mercedes-v250': { 
                name: 'Mercedes V250', 
                price: 3500,
                specs: 'Luxury Van, 7 Seats, 2.0L Diesel Engine, 190 HP'
            },
            'mercedes-v250d': { 
                name: 'Mercedes V250d', 
                price: 3800,
                specs: 'Luxury Van, 7 Seats, 2.0L Diesel Engine, 190 HP'
            },
            'mercedes-v300': { 
                name: 'Mercedes V300', 
                price: 4000,
                specs: 'Luxury Van, 7 Seats, 3.0L Diesel Engine, 236 HP'
            },
            'bmw-g20': { 
                name: 'BMW G20', 
                price: 2500,
                specs: 'Sedan, 5 Seats, 2.0L Turbo Engine, 255 HP'
            },
            'bmw-gt': { 
                name: 'BMW GT', 
                price: 2800,
                specs: 'Gran Turismo, 5 Seats, 2.0L Turbo Engine, 248 HP'
            }
        };

        this.carRates = {
            'mercedes-v250': 3500,
            'mercedes-v250d': 3800,
            'mercedes-v300': 4000,
            'bmw-g20': 2500,
            'bmw-gt': 2800
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('startDate').addEventListener('change', () => this.validateDates());
        document.getElementById('endDate').addEventListener('change', () => this.validateDates());
    }

    validateDates() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        
        if (endDate <= startDate) {
            alert('End date must be after start date');
            return false;
        }
        return true;
    }

    calculateTotalPrice(carType, days) {
        return this.availableCars[carType].price * days;
    }

    calculateBookingSummary(details) {
        const startDate = new Date(details.startDate);
        const endDate = new Date(details.endDate);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        // Get daily rate for selected car
        const dailyRate = this.carRates[details.carType];
        const totalPrice = days * dailyRate;

        // Format price with thousand separators
        const formattedPrice = new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(totalPrice);

        return `
            <div class="booking-summary">
                <h3>Booking Summary</h3>
                <div class="summary-item">
                    <span>Selected Vehicle:</span>
                    <span>${this.availableCars[details.carType].name}</span>
                </div>
                <div class="summary-item">
                    <span>Daily Rate:</span>
                    <span>R${dailyRate.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span>Duration:</span>
                    <span>${days} day${days > 1 ? 's' : ''}</span>
                </div>
                <div class="summary-item total">
                    <span>Total Amount:</span>
                    <span>${formattedPrice}</span>
                </div>
            </div>
        `;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateDates()) return;

        const formData = new FormData(this.form);
        const bookingDetails = {
            pickupLocation: formData.get('pickupLocation'),
            startDate: new Date(formData.get('startDate')),
            endDate: new Date(formData.get('endDate')),
            carType: formData.get('carType')
        };

        // Simulate API call
        const isAvailable = await this.checkAvailability(bookingDetails);
        this.displayResult(isAvailable, bookingDetails);
    }

    async checkAvailability(details) {
        // Simulate backend check
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(Math.random() > 0.3); // 70% chance of availability
            }, 1000);
        });
    }

    displayResult(isAvailable, details) {
        const days = Math.ceil((details.endDate - details.startDate) / (1000 * 60 * 60 * 24));
        const totalPrice = this.calculateTotalPrice(details.carType, days);

        const html = isAvailable ? `
            <div class="success">
                <h3>Car Available!</h3>
                <div class="booking-summary">
                    <p>Car: ${this.availableCars[details.carType].name}</p>
                    <p>Duration: ${days} days</p>
                    <p>Total Price: $${totalPrice}</p>
                </div>
                <button onclick="confirmBooking()">Confirm Booking</button>
            </div>
        ` : `
            <div class="error">
                <h3>Sorry, this car is not available for the selected dates.</h3>
                <p>Please try different dates or choose another vehicle.</p>
            </div>
        `;

        this.resultDiv.innerHTML = html;
        this.resultDiv.classList.remove('hidden');
    }

    updateBookingSummary(details) {
        try {
            // Calculate total price
            const days = this.calculateDuration(details.startDate, details.endDate);
            const dailyRate = this.availableCars[details.carType].price;
            const totalPrice = days * dailyRate;

            // Debug logging
            console.log('Daily Rate:', dailyRate);
            console.log('Days:', days);
            console.log('Total Price:', totalPrice);

            // Format price
            const formattedPrice = new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(totalPrice);

            console.log('Formatted Price:', formattedPrice);

            // Update the summary HTML
            const summaryHTML = `
                <h2>Booking Summary</h2>
                <div class="summary-details">
                    <p>Vehicle: ${this.availableCars[details.carType].name}</p>
                    <p>Duration: ${days} days</p>
                    <p>Daily Rate: R${dailyRate.toLocaleString()}</p>
                    <p class="total-amount">Total: ${formattedPrice}</p>
                </div>
            `;

            document.querySelector('.booking-summary').innerHTML = summaryHTML;

        } catch (error) {
            console.error('Error formatting price:', error);
        }
    }

    calculateDuration(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
}

const bookingSystem = new BookingSystem();