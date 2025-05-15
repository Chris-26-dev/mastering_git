// Product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "Premium sound quality with noise cancellation",
        price: 129.99,
        image: "../images/wireless_headphones.jpg"
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Track your fitness and stay connected",
        price: 199.99,
        image: "../images/smart_watch.png"
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        description: "Portable speaker with 20h battery life",
        price: 79.99,
        image: "../images/bluetooth_speaker.jpg"
    },
    {
        id: 4,
        name: "Wireless Charger",
        description: "Fast charging for all Qi-enabled devices",
        price: 39.99,
        image: "../images/wireless_charger.jpg"
    }
];

// Shopping cart
let cart = [];

// DOM elements
const buyNowBtn = document.getElementById('buy-now-btn');
let selectedProduct = null; // To keep track of the product shown in the modal
const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const modalProductName = document.getElementById('modal-product-name');
const modalProductDescription = document.getElementById('modal-product-description');
const modalProductImage = document.getElementById('modal-product-image');
const modalProductPrice = document.getElementById('modal-product-price');
const productsContainer = document.getElementById('products');
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.getElementById('close-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');


function openProductModal(product) {
    modalProductName.textContent = product.name;
    modalProductDescription.textContent = product.description;
    modalProductImage.style.backgroundImage = `url('${product.image}')`;
    modalProductPrice.textContent = `$${product.price.toFixed(2)}`;
    selectedProduct = product;
    productModal.style.display = 'flex';

}

closeProductModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Render products
function renderProducts() {
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
    <div class="product-image" style="background-image: url('${product.image}')"></div>
    <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    </div>
`;

        // Show modal when clicking anywhere on card, excluding the Add to Cart button
        productCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                openProductModal(product);
            }
        });

        productsContainer.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});


// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Update cart count
    updateCartCount();

    // Change button style temporarily
    e.target.textContent = 'Added!';
    e.target.classList.add('added');

    setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.classList.remove('added');
    }, 1000);

    // Update cart modal if open
    if (cartModal.style.display === 'flex') {
        renderCartItems();
    }
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = 'Total: $0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
            </div>
            <div class="item-total">$${itemTotal.toFixed(2)}</div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Quantity adjustment functions
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }

    updateCart();
}

function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id') ||
        parseInt(e.target.parentElement.getAttribute('data-id')));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    updateCartCount();
    renderCartItems();
}

// Event listeners
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    renderCartItems();
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }

    // Save cart to localStorage before page unload
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    });
});

buyNowBtn.addEventListener('click', () => {
    if (selectedProduct) {
        cart.push({ ...selectedProduct, quantity: 1 });
        updateCart();
        productModal.style.display = 'none';
        cartModal.style.display = 'flex';
    }
});

