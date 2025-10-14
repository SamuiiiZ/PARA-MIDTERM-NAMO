// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add particles effect (optional)
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(199, 112, 240, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
    `;
    
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 2000);
}

// Create particles periodically
setInterval(createParticle, 300);

// ==================== CONTACT FORM VALIDATION ====================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Form validation function
function validateForm(formData) {
    let isValid = true;
    const errors = {};

    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });

    // Name validation
    if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
        isValid = false;
    }

    // Email validation
    if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Subject validation
    if (formData.subject.trim().length < 3) {
        errors.subject = 'Subject must be at least 3 characters long';
        isValid = false;
    }

    // Message validation
    if (formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
        isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(key => {
        const errorElement = document.getElementById(`${key}Error`);
        if (errorElement) {
            errorElement.textContent = errors[key];
            errorElement.classList.add('show');
        }
    });

    return isValid;
}

// Form submission handler
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validate form
        if (validateForm(formData)) {
            // Show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'flex';

            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                formSuccess.style.display = 'none';
            }, 3000);

            // Here you would normally send the form data to a server
            console.log('Form submitted:', formData);
        }
    });

    // Real-time validation on input blur
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            validateForm(formData);
        });
    });
}

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.style.width;
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// ==================== CV MODAL ====================
const cvModal = document.getElementById('cvModal');
const viewCvBtn = document.getElementById('viewCvBtn');
const cvModalClose = document.querySelector('.cv-modal-close');

// Open modal
if (viewCvBtn) {
    viewCvBtn.addEventListener('click', function() {
        cvModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

// Close modal when clicking X
if (cvModalClose) {
    cvModalClose.addEventListener('click', function() {
        cvModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside the image
cvModal.addEventListener('click', function(e) {
    if (e.target === cvModal) {
        cvModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cvModal.style.display === 'block') {
        cvModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ==================== TYPING GAME ====================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');

let gameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem('typingGameHighScore') || 0;
highScoreDisplay.textContent = highScore;

// Word bank for the game
const wordBank = [
    'code', 'type', 'fast', 'game', 'word', 'play', 'star', 'moon', 'fire', 'wind',
    'water', 'earth', 'light', 'dark', 'speed', 'power', 'magic', 'skill', 'focus', 'quick',
    'react', 'node', 'java', 'python', 'html', 'css', 'debug', 'array', 'loop', 'function',
    'class', 'object', 'string', 'number', 'boolean', 'variable', 'method', 'syntax', 'logic', 'data'
];

// Game objects
let asteroids = [];
let particles = [];
let currentInput = '';
let targetAsteroid = null;

// Input handling
window.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    // Ignore special keys
    if (e.key.length > 1 && e.key !== 'Backspace') return;
    
    e.preventDefault();
    
    if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        if (targetAsteroid) {
            targetAsteroid.typedChars = currentInput.length;
            if (!targetAsteroid.word.startsWith(currentInput)) {
                targetAsteroid.isTarget = false;
                targetAsteroid = null;
            }
        }
    } else if (e.key.match(/^[a-z]$/i)) {
        currentInput += e.key.toLowerCase();
        checkWordMatch();
    }
});

// Game functions
function createAsteroid() {
    const word = wordBank[Math.floor(Math.random() * wordBank.length)];
    const size = 60 + word.length * 8;
    asteroids.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: Math.random() * 1 + 0.5,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        word: word,
        typedChars: 0,
        isTarget: false
    });
}

function checkWordMatch() {
    // First, check if we're continuing to type the target asteroid's word
    if (targetAsteroid && targetAsteroid.word.startsWith(currentInput)) {
        targetAsteroid.typedChars = currentInput.length;
        
        // Check if word is complete
        if (currentInput === targetAsteroid.word) {
            destroyAsteroid(targetAsteroid);
            currentInput = '';
            targetAsteroid = null;
        }
        return;
    }
    
    // If not matching target, find a new matching asteroid
    targetAsteroid = null;
    
    // Reset all asteroids' target status
    asteroids.forEach(a => a.isTarget = false);
    
    for (let asteroid of asteroids) {
        if (asteroid.word.startsWith(currentInput)) {
            targetAsteroid = asteroid;
            targetAsteroid.typedChars = currentInput.length;
            targetAsteroid.isTarget = true;
            
            // Check if word is complete
            if (currentInput === asteroid.word) {
                destroyAsteroid(asteroid);
                currentInput = '';
                targetAsteroid = null;
            }
            return;
        }
    }
    
    // No match found, reset input if too long
    if (currentInput.length > 3) {
        currentInput = '';
    }
}

function destroyAsteroid(asteroid) {
    const index = asteroids.indexOf(asteroid);
    if (index > -1) {
        asteroids.splice(index, 1);
        createExplosion(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
        score += asteroid.word.length * 10;
        scoreDisplay.textContent = score;
        
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('typingGameHighScore', highScore);
        }
    }
}

function createExplosion(x, y) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
            size: Math.random() * 4 + 2,
            color: `hsl(${280 + Math.random() * 40}, 100%, ${50 + Math.random() * 30}%)`
        });
    }
}

function drawCurrentInput() {
    if (currentInput.length > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width / 2 - 150, canvas.height - 60, 300, 50);
        
        ctx.strokeStyle = '#c770f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width / 2 - 150, canvas.height - 60, 300, 50);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentInput, canvas.width / 2, canvas.height - 28);
    }
}

function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.save();
        ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
        ctx.rotate(asteroid.rotation);
        
        // Draw asteroid background
        const isTarget = asteroid === targetAsteroid;
        ctx.strokeStyle = isTarget ? '#ffdd00' : '#a64ac9';
        ctx.fillStyle = isTarget ? 'rgba(255, 221, 0, 0.2)' : 'rgba(166, 74, 201, 0.3)';
        ctx.lineWidth = isTarget ? 3 : 2;
        ctx.beginPath();
        
        const sides = 8;
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const radius = asteroid.width / 2 * (0.8 + Math.sin(angle * 3) * 0.2);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
        
        // Draw word on asteroid
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 18px Arial';
        
        // Calculate text position
        const textX = asteroid.x + asteroid.width / 2;
        const textY = asteroid.y + asteroid.height / 2;
        
        // Draw typed characters in green
        if (asteroid.typedChars > 0) {
            const typedPart = asteroid.word.substring(0, asteroid.typedChars);
            const remainingPart = asteroid.word.substring(asteroid.typedChars);
            
            // Measure text to position correctly
            ctx.font = 'bold 18px Arial';
            const typedWidth = ctx.measureText(typedPart).width;
            const totalWidth = ctx.measureText(asteroid.word).width;
            
            // Draw typed part in green
            ctx.fillStyle = '#00ff00';
            ctx.textAlign = 'left';
            ctx.fillText(typedPart, textX - totalWidth / 2, textY);
            
            // Draw remaining part in white
            ctx.fillStyle = '#fff';
            ctx.fillText(remainingPart, textX - totalWidth / 2 + typedWidth, textY);
        } else {
            // Draw entire word in white
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText(asteroid.word, textX, textY);
        }
        
        // Add glow effect for target
        if (isTarget) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffdd00';
            ctx.strokeStyle = '#ffdd00';
            ctx.lineWidth = 2;
            ctx.strokeRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
            ctx.shadowBlur = 0;
        }
    });
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

function updateGame() {
    if (!gameRunning || gamePaused) return;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(10, 1, 26, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update asteroids
    asteroids.forEach(asteroid => {
        asteroid.y += asteroid.speed;
        asteroid.rotation += asteroid.rotationSpeed;
    });
    
    // Create new asteroids
    if (Math.random() < 0.015 && asteroids.length < 8) {
        createAsteroid();
    }
    
    // Update particles
    particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        return particle.life > 0;
    });
    
    // Check game over - asteroid reached bottom
    asteroids = asteroids.filter(asteroid => {
        if (asteroid.y > canvas.height) {
            gameOver();
            return false;
        }
        return true;
    });
    
    // Draw everything
    drawParticles();
    drawAsteroids();
    drawCurrentInput();
    
    requestAnimationFrame(updateGame);
}

function startGame() {
    gameRunning = true;
    gamePaused = false;
    score = 0;
    asteroids = [];
    particles = [];
    currentInput = '';
    targetAsteroid = null;
    scoreDisplay.textContent = score;
    startBtn.textContent = 'Restart';
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    updateGame();
}

function pauseGame() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    if (!gamePaused) {
        updateGame();
    }
}

function gameOver() {
    gameRunning = false;
    gamePaused = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Draw game over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#c770f0';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    
    if (score === highScore && score > 0) {
        ctx.fillStyle = '#ffdd00';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('NEW HIGH SCORE! 🎉', canvas.width / 2, canvas.height / 2 + 50);
    }
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);

// Initial canvas clear
ctx.fillStyle = 'rgba(10, 1, 26, 0.9)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#c770f0';
ctx.font = 'bold 36px Arial';
ctx.textAlign = 'center';
ctx.fillText('TYPING GAME', canvas.width / 2, canvas.height / 2 - 30);
ctx.fillStyle = '#fff';
ctx.font = '18px Arial';
ctx.fillText('Press START to begin', canvas.width / 2, canvas.height / 2 + 20);
ctx.fillText('Type the words on asteroids to destroy them!', canvas.width / 2, canvas.height / 2 + 50);

// ==================== IMAGE GALLERY MODAL ====================
let imageModal, modalImage, imageCounter;
let currentGalleryImages = [];
let currentImageIndex = 0;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    imageModal = document.getElementById('imageModal');
    modalImage = document.getElementById('modalImage');
    imageCounter = document.getElementById('imageCounter');
    
    // Close modal when clicking outside the image
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
    
    // Close modal with ESC key and navigate with arrow keys
    document.addEventListener('keydown', function(e) {
        if (imageModal && imageModal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeImageModal();
            } else if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            }
        }
    });
});

// Function to open image modal
function openImageModal(imageSrc) {
    if (!imageModal || !modalImage) {
        console.error('Modal elements not found');
        return;
    }
    
    // Find which gallery this image belongs to
    const allGalleryImages = document.querySelectorAll('.gallery-image');
    let clickedImage = null;
    
    // Find the clicked image
    for (let img of allGalleryImages) {
        if (img.src === imageSrc) {
            clickedImage = img;
            break;
        }
    }
    
    if (clickedImage) {
        const gallery = clickedImage.closest('.project-gallery');
        
        if (gallery) {
            // Get all images in this specific gallery
            currentGalleryImages = Array.from(gallery.querySelectorAll('.gallery-image')).map(img => img.src);
            currentImageIndex = currentGalleryImages.indexOf(imageSrc);
        } else {
            currentGalleryImages = [imageSrc];
            currentImageIndex = 0;
        }
    } else {
        currentGalleryImages = [imageSrc];
        currentImageIndex = 0;
    }
    
    imageModal.style.display = 'block';
    modalImage.src = imageSrc;
    updateImageCounter();
    document.body.style.overflow = 'hidden';
}

// Function to navigate between images
function navigateImage(direction) {
    if (!modalImage) return;
    
    currentImageIndex += direction;
    
    // Loop around if at the beginning or end
    if (currentImageIndex < 0) {
        currentImageIndex = currentGalleryImages.length - 1;
    } else if (currentImageIndex >= currentGalleryImages.length) {
        currentImageIndex = 0;
    }
    
    modalImage.src = currentGalleryImages[currentImageIndex];
    updateImageCounter();
}

// Function to update image counter
function updateImageCounter() {
    if (!imageCounter) return;
    
    if (currentGalleryImages.length > 1) {
        imageCounter.textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
        imageCounter.style.display = 'block';
    } else {
        imageCounter.style.display = 'none';
    }
}

// Function to close image modal
function closeImageModal() {
    if (!imageModal) return;
    
    imageModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentGalleryImages = [];
    currentImageIndex = 0;
}

// ==================== CONTRIBUTION GRAPH ====================
function generateContributionGraph() {
    const grid = document.getElementById('contributionGrid');
    if (!grid) return;
    
    // Generate a year's worth of contributions (52 weeks * 3 days visible = 156 days)
    const totalDays = 156;
    const contributions = [];
    
    // Create mostly empty contribution data matching the image
    // Most days have no contributions (level 0)
    for (let i = 0; i < totalDays; i++) {
        contributions.push(0);
    }
    
    // Add specific contributions in Aug-Oct (last ~30 days)
    // These positions match the green squares in your screenshot
    const activePositions = [
        { pos: 126, level: 3 }, // Aug - Mon
        { pos: 138, level: 3 }, // Aug - Mon
        { pos: 139, level: 4 }, // Aug - Wed
        { pos: 140, level: 3 }, // Aug - Fri
        { pos: 141, level: 3 }, // Aug - Mon (next week)
        { pos: 142, level: 4 }, // Aug - Wed
        { pos: 144, level: 3 }, // Aug - Fri
        { pos: 145, level: 3 }, // Sep - Mon
        { pos: 153, level: 4 }, // Oct - Mon
        { pos: 154, level: 4 }, // Oct - Wed
        { pos: 155, level: 3 }, // Oct - Fri
    ];
    
    // Apply the active contributions
    activePositions.forEach(({ pos, level }) => {
        if (pos < totalDays) {
            contributions[pos] = level;
        }
    });
    
    // Create contribution day elements
    contributions.forEach((level, index) => {
        const day = document.createElement('div');
        day.className = `contribution-day level-${level}`;
        day.setAttribute('data-level', level);
        const contributionText = level === 0 ? 'No contributions' : `${level} contributions`;
        day.setAttribute('title', contributionText);
        grid.appendChild(day);
    });
}

// Initialize contribution graph when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateContributionGraph);
} else {
    generateContributionGraph();
}
