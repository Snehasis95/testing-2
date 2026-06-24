// Shopping Cart
let cart = [];

// Get elements
const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.getElementById('cartModal');
const closeModal = document.querySelector('.close');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');

// Open cart modal
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
    displayCart();
});

// Close cart modal
closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Add to cart functionality
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productName = btn.getAttribute('data-product');
        const productPrice = parseFloat(btn.getAttribute('data-price'));

        // Add item to cart
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        updateCartCount();
        showNotification(`${productName} added to cart!`);
    });
});

// Display cart items
function displayCart() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                $${item.price.toFixed(2)} x ${item.quantity}
            </div>
            <div>
                <strong>$${itemTotal.toFixed(2)}</strong>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);

    // Add remove functionality
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCart();
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        showNotification(`Thanks! We've sent a confirmation to ${email}`);
        newsletterForm.reset();
    });
}

// Contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Message sent successfully! We\'ll get back to you soon.');
        contactForm.reset();
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add animation to elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards
document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});

// Observe testimonial cards
document.querySelectorAll('.testimonial').forEach(card => {
    observer.observe(card);
});

// Product search
const searchBtn = document.querySelector('.search-btn');
const searchContainer = document.querySelector('.search-container');
const searchInput = document.querySelector('.search-input');
const productCards = document.querySelectorAll('.product-card');
const noResults = document.getElementById('noResults');

if (searchBtn && searchContainer && searchInput) {
    searchBtn.addEventListener('click', () => {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            filterProducts('');
        }
    });

    searchInput.addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });
}

function filterProducts(query) {
    const term = query.trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const matches = name.includes(term);
        card.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
    });

    if (noResults) {
        noResults.hidden = term === '' || visibleCount > 0;
    }
}

// Checkout button
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }
        showNotification('Redirecting to checkout...');
        setTimeout(() => {
            cartModal.style.display = 'none';
            cart = [];
            updateCartCount();
            showNotification('Order placed successfully!');
        }, 1000);
    });
}

// Add CSS animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .remove-btn {
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 0.3rem 0.8rem;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.8rem;
        margin-left: 0.5rem;
        transition: background 0.3s ease;
    }
    
    .remove-btn:hover {
        background: #ff5252;
    }
`;
document.head.appendChild(style);

// Log initialization
console.log('ShopHub landing page initialized successfully!');
