import { BASE_URL, SESSION_STORAGE_USER_EMAIL } from './info.js';
import { showModal } from './modal.js';

const getCart = () => {
    const email = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL);
    if (!email) return [];
    const cart = localStorage.getItem(`cart_${email}`);
    return cart ? JSON.parse(cart) : [];
};

const saveCart = (cart) => {
    const email = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL);
    if (!email) return;
    localStorage.setItem(`cart_${email}`, JSON.stringify(cart));
};

export const addToCart = (productInfo) => {
    const email = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL);
    if (!email) {
        location.href = 'login.html';
        return;
    }
    const cart = getCart();
    const productId = Number(productInfo);
    const existingItem = cart.find(item => item.id === productId);
    
    existingItem ? existingItem.quantity += 1 : cart.push({ id: productId, quantity: 1 });
    saveCart(cart);
};

const removeFromCart = (productInfo) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== Number(productInfo));
    saveCart(cart);
    renderCart();
};

const updateQuantity = (productInfo, quantity) => {
    const cart = getCart();
    const item = cart.find(item => item.id === Number(productInfo));
    
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productInfo);
            return;
        }
        saveCart(cart);
        renderCart();
    }
};

const renderCart = async () => {
    const email = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL);
    if (!email) {
        location.href = 'login.html';
        return;
    }
    
    const cart = getCart();
    const cartContainer = document.querySelector('#cart-items');
    const totalElement = document.querySelector('#cart-total');
    
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your basket is empty</p>';
        if (totalElement) totalElement.innerText = '0 kr';
        return;
    }
    
    const products = await fetch(BASE_URL).then(r => r.json()).catch(() => []);
    
    let total = 0;
    
    cart.forEach(cartItem => {
        const product = products.find(p => p.id == cartItem.id);
        if (!product) return;
        
        total += product.price * cartItem.quantity;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        
        const info = document.createElement('div');
        info.className = 'cart-item-info';
        
        const title = document.createElement('h3');
        title.innerText = product.title;
        
        const price = document.createElement('p');
        price.className = 'item-price';
        price.innerText = `${product.price} kr`;
        
        const quantityWrapper = document.createElement('div');
        quantityWrapper.className = 'quantity-wrapper';
        
        const minusBtn = document.createElement('button');
        minusBtn.innerText = '-';
        minusBtn.className = 'quantity-btn';
        minusBtn.type = 'button';
        minusBtn.onclick = () => updateQuantity(product.id, cartItem.quantity - 1);
        
        const quantitySpan = document.createElement('span');
        quantitySpan.className = 'quantity-number';
        quantitySpan.innerText = cartItem.quantity;
        
        const plusBtn = document.createElement('button');
        plusBtn.innerText = '+';
        plusBtn.className = 'quantity-btn';
        plusBtn.type = 'button';
        plusBtn.onclick = () => updateQuantity(product.id, cartItem.quantity + 1);
        
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.type = 'button';
        removeBtn.onclick = () => removeFromCart(product.id);
        
        quantityWrapper.append(minusBtn, quantitySpan, plusBtn);
        info.append(title, price, quantityWrapper, removeBtn);
        cartItemElement.append(img, info);
        cartContainer.append(cartItemElement);
    });
    
    if (totalElement) totalElement.innerText = `${total.toFixed(2)} kr`;
};

// Card number - kun tal, auto-formattering
const cardNumberInput = document.querySelector('#card-number');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = value.match(/.{1,16}/g)?.join(' ') || value;
        
        value = value.substring(0, 16);
        formatted = value.match(/.{1,16}/g)?.join(' ') || value;
        e.target.value = formatted;
        
    });
}

// CVV - kun tal, max 4
const cardCvvInput = document.querySelector('#card-cvv');
if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.substring(0, 4);
    });
}
const cardExpiryInput = document.querySelector('#card-expiry');
if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 4);

        e.target.value = value;
    });
}


const form = document.querySelector('#checkout-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const billingName = e.target.elements['billing-name'].value.trim();
        const billingAddress = e.target.elements['billing-address'].value.trim();
        const billingCity = e.target.elements['billing-city'].value.trim();
        const billingZip = e.target.elements['billing-zip'].value.trim();
        const cardNumber = e.target.elements['card-number'].value.trim();
        const cardExpiry = e.target.elements['card-expiry'].value.trim();
        const cardCvv = e.target.elements['card-cvv'].value.trim();
        
        // Tjek alle felter udfyldt
        if (!billingName || !billingAddress || !billingCity || !billingZip || !cardNumber || !cardExpiry || !cardCvv) {
            showModal('Validation error', 'Please fill out all fields');
            return;
        }
        
        const cleanedCard = cardNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cleanedCard)) {
            showModal('Validation error', 'Card number must be 16 digits');
            return;
        }
        
        if (!/^\d{3,4}$/.test(cardCvv)) {
            showModal('Validation error', 'CVV must be 3 or 4 digits');
            return;
        }
        
        if (!/^\d{4}$/.test(cardExpiry)) {
            showModal('Validation error', 'Expiry date must be in MM/YY format (e.g. 12/25)');
            return;
        }
        const cart = getCart();
        if (!cart || cart.length === 0) {
            showModal('Checkout error', 'Your cart is empty');
            return;
        }
        
        
        saveCart([]);
        showModal('Order confirmed', 'Thank you for your order!');
        e.target.reset();
        renderCart();
    });
}

// Check as if the same as billing
const sameCheckbox = document.querySelector('#same-as-billing');
if (sameCheckbox) {
    sameCheckbox.addEventListener('change', () => {
        if (sameCheckbox.checked) {
            document.querySelector('#delivery-name').value = document.querySelector('#billing-name').value;
            document.querySelector('#delivery-address').value = document.querySelector('#billing-address').value;
            document.querySelector('#delivery-city').value = document.querySelector('#billing-city').value;
            document.querySelector('#delivery-zip').value = document.querySelector('#billing-zip').value;
        }
    });
}

renderCart();