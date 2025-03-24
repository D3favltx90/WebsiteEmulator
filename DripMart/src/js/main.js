/**
 * DripMart E-commerce - Main JavaScript
 * Handles site interactivity, cart functionality, and UI updates
 */

// Store cart data in localStorage
let cart = JSON.parse(localStorage.getItem('dripmart_cart')) || [];
let cartCount = 0;

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const quantityButtons = document.querySelectorAll('.quantity-btn');
const productThumbs = document.querySelectorAll('.product-thumb');
const removeCartItems = document.querySelectorAll('.cart-remove');
const checkoutForm = document.querySelector('#checkout-form');

// Initialize the site
document.addEventListener('DOMContentLoaded', () => {
    initSite();
});

/**
 * Initialize site functionality
 */
function initSite() {
    updateCartCount();
    setupEventListeners();
    
    // Product detail page specific functionality
    if (document.querySelector('.product-gallery')) {
        setupProductGallery();
    }
    
    // Cart page specific functionality
    if (document.querySelector('.cart-table')) {
        renderCartItems();
        updateCartTotals();
    }
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    // Quantity buttons
    quantityButtons.forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
    
    // Remove cart items
    removeCartItems.forEach(button => {
        button.addEventListener('click', handleRemoveCartItem);
    });
    
    // Checkout form
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

/**
 * Handle adding a product to the cart
 * @param {Event} event - Click event
 */
function handleAddToCart(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const card = button.closest('.product-card') || button.closest('.product-details');
    
    if (!card) return;
    
    const id = button.getAttribute('data-id');
    const name = card.querySelector('.product-title') ? card.querySelector('.product-title').textContent : '';
    const price = card.querySelector('.product-price') ? parseFloat(card.querySelector('.product-price').getAttribute('data-price')) : 0;
    const img = card.querySelector('img') ? card.querySelector('img').getAttribute('src') : '';
    
    // Get quantity if on product details page
    let quantity = 1;
    const quantityInput = document.querySelector('.quantity-value');
    if (quantityInput) {
        quantity = parseInt(quantityInput.value);
    }
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
        // Update existing item
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id,
            name,
            price,
            img,
            quantity
        });
    }
    
    // Save to localStorage and update UI
    saveCart();
    updateCartCount();
    
    // Show confirmation message
    showMessage('Item added to cart!', 'success');
}

/**
 * Handle quantity change in product detail or cart
 * @param {Event} event - Click event
 */
function handleQuantityChange(event) {
    const button = event.currentTarget;
    const action = button.getAttribute('data-action');
    const quantityContainer = button.closest('.quantity-input');
    const quantityInput = quantityContainer.querySelector('.quantity-value');
    
    let currentValue = parseInt(quantityInput.value);
    
    if (action === 'increase') {
        currentValue++;
    } else if (action === 'decrease' && currentValue > 1) {
        currentValue--;
    }
    
    quantityInput.value = currentValue;
    
    // If in cart page, update item quantity
    const cartItem = button.closest('tr');
    if (cartItem) {
        const itemId = cartItem.getAttribute('data-id');
        updateCartItemQuantity(itemId, currentValue);
    }
}

/**
 * Update a cart item's quantity
 * @param {string} id - Item ID
 * @param {number} quantity - New quantity
 */
function updateCartItemQuantity(id, quantity) {
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity = quantity;
        saveCart();
        updateCartTotals();
    }
}

/**
 * Handle removing an item from the cart
 * @param {Event} event - Click event
 */
function handleRemoveCartItem(event) {
    const button = event.currentTarget;
    const item = button.closest('tr');
    const itemId = item.getAttribute('data-id');
    
    // Filter out the item to remove
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    
    // Save changes and update UI
    saveCart();
    item.remove();
    updateCartCount();
    updateCartTotals();
    
    // Show feedback
    showMessage('Item removed from cart', 'warning');
    
    // Check if cart is empty
    if (cart.length === 0) {
        const tableBody = document.querySelector('.cart-table tbody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
        }
    }
}

/**
 * Handle checkout form submission
 * @param {Event} event - Submit event
 */
function handleCheckout(event) {
    event.preventDefault();
    
    // In a real app, you would send this data to a server
    // For this demo, we'll just clear the cart and show a success message
    clearCart();
    showMessage('Order placed successfully! Thank you for your purchase.', 'success');
    
    // Redirect to homepage after a delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

/**
 * Setup product gallery functionality
 */
function setupProductGallery() {
    const mainImage = document.querySelector('.product-gallery-main');
    
    productThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Update main image source
            mainImage.src = thumb.src;
            
            // Update active state
            productThumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

/**
 * Render cart items in the cart page
 */
function renderCartItems() {
    const tableBody = document.querySelector('.cart-table tbody');
    
    if (!tableBody) return;
    
    // Clear table body
    tableBody.innerHTML = '';
    
    if (cart.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
        return;
    }
    
    // Add cart items to table
    cart.forEach(item => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', item.id);
        
        row.innerHTML = `
            <td>
                <div class="cart-product">
                    <img src="${item.img}" alt="${item.name}" class="cart-product-img">
                    <div class="cart-product-info">
                        <h4 class="cart-product-name">${item.name}</h4>
                        <div class="cart-product-price">$${item.price.toFixed(2)}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="quantity-input">
                    <span class="quantity-btn" data-action="decrease">-</span>
                    <input type="text" class="quantity-value" value="${item.quantity}" readonly>
                    <span class="quantity-btn" data-action="increase">+</span>
                </div>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><span class="cart-remove">✕</span></td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Reattach event listeners after rendering
    document.querySelectorAll('.cart-remove').forEach(button => {
        button.addEventListener('click', handleRemoveCartItem);
    });
    
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
}

/**
 * Update the cart totals in the cart summary
 */
function updateCartTotals() {
    const subtotalElement = document.querySelector('.cart-subtotal');
    const totalElement = document.querySelector('.cart-total-value');
    
    if (!subtotalElement || !totalElement) return;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0; // Simple shipping calculation
    const total = subtotal + shipping;
    
    // Update the DOM
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.cart-shipping').textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Update the cart count in the header
 */
function updateCartCount() {
    cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        if (cartCount === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'flex';
        }
    }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    localStorage.setItem('dripmart_cart', JSON.stringify(cart));
}

/**
 * Clear the cart
 */
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

/**
 * Show a message to the user
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, warning, error)
 */
function showMessage(message, type = 'info') {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type} fade-in`;
    messageElement.textContent = message;
    
    // Add to document
    document.body.appendChild(messageElement);
    
    // Remove after delay
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            messageElement.remove();
        }, 500);
    }, 3000);
}

/**
 * Format price to currency string
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    return price.toFixed(2);
} 