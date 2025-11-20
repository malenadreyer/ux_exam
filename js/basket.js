import { BASE_URL } from './info.js';

// Hent kurv fra localStorage
const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

// Gem kurv til localStorage
const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Tilføj produkt til kurv
export const addToCart = (productId) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    saveCart(cart);
};

// Fjern produkt fra kurv
const removeFromCart = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
};

// Opdater antal
const updateQuantity = (productId, quantity) => {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }
    
    saveCart(cart);
    renderCart();
};

// Render kurven
const renderCart = async () => {
    const cart = getCart();
    const cartContainer = document.querySelector('#cart-items');
    const totalElement = document.querySelector('#cart-total');
    
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Din kurv er tom</p>';
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
        const product = products.find(p => p.id === cartItem.id);
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
        price.innerText = `${product.price} kr`;
        
        const quantityWrapper = document.createElement('div');
        quantityWrapper.className = 'quantity-wrapper';
        
        const minusBtn = document.createElement('button');
        minusBtn.innerText = '-';
        minusBtn.addEventListener('click', () => updateQuantity(product.id, cartItem.quantity - 1));
        
        const quantitySpan = document.createElement('span');
        quantitySpan.innerText = cartItem.quantity;
        
        const plusBtn = document.createElement('button');
        plusBtn.innerText = '+';
        plusBtn.addEventListener('click', () => updateQuantity(product.id, cartItem.quantity + 1));
        
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Fjern';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', () => removeFromCart(product.id));
        
        quantityWrapper.append(minusBtn, quantitySpan, plusBtn);
        info.append(title, price, quantityWrapper, removeBtn);
        cartItemElement.append(img, info);
        fragment.append(cartItemElement);
    });
    
    cartContainer.append(fragment);
    
    if (totalElement) {
        totalElement.innerText = `${total} kr`;
    }
};

// Kør renderCart når siden loader (kun på basket.html)
if (document.querySelector('#cart-items')) {
    renderCart();
}