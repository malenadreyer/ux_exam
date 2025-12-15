import { BASE_URL, SESSION_STORAGE_USER_EMAIL } from './info.js';
import { showModal } from './modal.js';

const getCart = () => {
    const email = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL)
    if (!email) return [];

    const cart = localStorage.getItem(`cart_${email}`)
    return cart ? JSON.parse(cart) : [];
};

const saveCart = (cart) => {
    const email = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL);
    if(!email) return;

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
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    saveCart(cart);
};

const removeFromCart = (productInfo) => {
    let cart = getCart();
    const productId = Number(productInfo);
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
};

const updateQuantity = (productInfo, quantity) => {
    const cart = getCart();
    const productId = Number(productInfo);
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productInfo);
            return;
        }
    }
    
    saveCart(cart);
    renderCart();
};

const handleSubmit = (e) => {
    e.preventDefault();
    
    const billingName = document.querySelector('#billing-name').value.trim();
    const billingAddress = document.querySelector('#billing-address').value.trim();
    const billingCity = document.querySelector('#billing-city').value.trim();
    const billingZip = document.querySelector('#billing-zip').value.trim();
    const cardNumber = document.querySelector('#card-number').value.trim();
    const cardExpiry = document.querySelector('#card-expiry').value.trim();
    const cardCvv = document.querySelector('#card-cvv').value.trim();
    
    const confirmMsg = document.querySelector('#confirm-message');
    
    if (!billingName || !billingAddress || !billingCity || !billingZip || !cardNumber || !cardExpiry || !cardCvv) {
       showModal('Validation error', 'Please ill out all fields')
        return;
    }

    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        showModal('Validation error', 'Card number must be 16 digits')
        return;
    }
    
    //  CVV, 3 eller 4 cifre, konly numbers
    if (!/^\d{3,4}$/.test(cardCvv)) {
        showModal('Validation error', 'CVV must be 3 or 4 digits');
        return;
    }
    
    // mm & yy format)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        showModal('Validation error', 'Expiry date must be in MM/YY format (e.g. 12/25)');

        return;
    }
    
    saveCart([]);
    showModal('Order confirmed', 'Thank you for your order!')
    e.target.reset();
    renderCart();
};

const renderCart = async () => {
    const email = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL)
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
    
    const products = await fetch(`${BASE_URL}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching products:', error);
            return [];
        });
    
    const fragment = document.createDocumentFragment();
    let total = 0;
    
    cart.forEach(cartItem => {
        const product = products.find(p => p.id == cartItem.id);
        if (!product) return;
        
        const itemTotal = product.price * cartItem.quantity;
        total += itemTotal;
        
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
        minusBtn.addEventListener('click', () => updateQuantity(product.id, cartItem.quantity - 1));
        
        const quantitySpan = document.createElement('span');
        quantitySpan.className = 'quantity-number';
        quantitySpan.innerText = cartItem.quantity;
        
        const plusBtn = document.createElement('button');
        plusBtn.innerText = '+';
        plusBtn.className = 'quantity-btn';
        plusBtn.type = 'button';
        plusBtn.addEventListener('click', () => updateQuantity(product.id, cartItem.quantity + 1));
        
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.type = 'button';
        removeBtn.addEventListener('click', () => removeFromCart(product.id));
        
        quantityWrapper.append(minusBtn, quantitySpan, plusBtn);
        info.append(title, price, quantityWrapper, removeBtn);
        cartItemElement.append(img, info);
        fragment.append(cartItemElement);
    });
    
    cartContainer.append(fragment);
    
    if (totalElement) {
        totalElement.innerText = `${total.toFixed(2)} kr`;
    }
};


const form = document.querySelector('#checkout-form');
const sameCheckbox = document.querySelector('#same-as-billing');

if (form) {
    form.addEventListener('submit', handleSubmit);
    
    sameCheckbox.addEventListener('change', () => {
        if (sameCheckbox.checked) {
            document.querySelector('#delivery-name').value = document.querySelector('#billing-name').value;
            document.querySelector('#delivery-address').value = document.querySelector('#billing-address').value;
            document.querySelector('#delivery-city').value = document.querySelector('#billing-city').value;
            document.querySelector('#delivery-zip').value = document.querySelector('#billing-zip').value;
        }
    });
    
    renderCart();
}