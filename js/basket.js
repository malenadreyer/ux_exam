import { BASE_URL } from './info.js';

// TODO: Login cart, gemmer så det er den person der er logget ind
// TODO: Lav en function til selve formen, så jeg ikke behøver skrive det 2 gange. 
// TODO: Ryd op i CSS, den skal være flot og udoverskuelig. 


const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

// Den gemmer her i localstorage
const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Her tilfjer den et item til kurven, som vi bruger i product-list også, skal også in i single view siden. 
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

// En funktion til at fjerne produkter fra kurven 
const removeFromCart = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
};

// her opdatere vi antalet
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

/////////////////// Her er en check out form ////////////////////////
const renderCheckoutForm = () => {
    const checkoutContainer = document.querySelector('#checkout-form');
    if (!checkoutContainer) return;
    
    const form = document.createElement('div');
    form.className = 'checkout-form';
    
    // Billing address sektion
    const billingSection = document.createElement('section');
    billingSection.className = 'form-section';
    
    const billingTitle = document.createElement('h3');
    billingTitle.innerText = 'Billing adress';
    
    const billingName = document.createElement('input');
    billingName.type = 'text';
    billingName.placeholder = 'Full name';
    billingName.className = 'form-input';
    billingName.id = 'billing-name';
    
    const billingAddress = document.createElement('input');
    billingAddress.type = 'text';
    billingAddress.placeholder = 'Adress';
    billingAddress.className = 'form-input';
    billingAddress.id = 'billing-address';
    
    const billingCity = document.createElement('input');
    billingCity.type = 'text';
    billingCity.placeholder = 'Town';
    billingCity.className = 'form-input';
    billingCity.id = 'billing-city';
    
    const billingZip = document.createElement('input');
    billingZip.type = 'text';
    billingZip.placeholder = 'Zip';
    billingZip.className = 'form-input';
    billingZip.id = 'billing-zip';
    
    billingSection.append(billingTitle, billingName, billingAddress, billingCity, billingZip);
    
    /////////////////// Deilivery adress secition /////////////////////////////////////
    const deliverySection = document.createElement('div');
    deliverySection.className = 'form-section';
    
    const deliveryTitle = document.createElement('h3');
    deliveryTitle.innerText = 'Shipping adress';
    
    const sameAsBilling = document.createElement('div');
    sameAsBilling.className = 'checkbox-wrapper';
    
    const sameCheckbox = document.createElement('input');
    sameCheckbox.type = 'checkbox';
    sameCheckbox.id = 'same-as-billing';
    
    const sameLabel = document.createElement('label');
    sameLabel.htmlFor = 'same-as-billing';
    sameLabel.innerText = 'Same as billing adress';
    
    sameAsBilling.append(sameCheckbox, sameLabel);
    
    const deliveryName = document.createElement('input');
    deliveryName.type = 'text';
    deliveryName.placeholder = 'Full name';
    deliveryName.className = 'form-input';
    deliveryName.id = 'delivery-name';
    
    const deliveryAddress = document.createElement('input');
    deliveryAddress.type = 'text';
    deliveryAddress.placeholder = 'Adress';
    deliveryAddress.className = 'form-input';
    deliveryAddress.id = 'delivery-address';
    
    const deliveryCity = document.createElement('input');
    deliveryCity.type = 'text';
    deliveryCity.placeholder = 'Town';
    deliveryCity.className = 'form-input';
    deliveryCity.id = 'delivery-city';
    
    const deliveryZip = document.createElement('input');
    deliveryZip.type = 'text';
    deliveryZip.placeholder = 'Zip';
    deliveryZip.className = 'form-input';
    deliveryZip.id = 'delivery-zip';
    
    deliverySection.append(deliveryTitle, sameAsBilling, deliveryName, deliveryAddress, deliveryCity, deliveryZip);
    
    //////////////////// Credit card section //////////////////////
    const paymentSection = document.createElement('div');
    paymentSection.className = 'form-section';
    
    const paymentTitle = document.createElement('h3');
    paymentTitle.innerText = 'Payment information';
    
    const cardNumber = document.createElement('input');
    cardNumber.type = 'text';
    cardNumber.placeholder = 'Card-number';
    cardNumber.className = 'form-input';
    cardNumber.id = 'card-number';
    cardNumber.maxLength = 19;
    
    const cardRow = document.createElement('div');
    cardRow.className = 'card-row';
    
    const cardExpiry = document.createElement('input');
    cardExpiry.type = 'text';
    cardExpiry.placeholder = 'MM/YY';
    cardExpiry.className = 'form-input';
    cardExpiry.id = 'card-expiry';
    cardExpiry.maxLength = 5;
    
    const cardCvv = document.createElement('input');
    cardCvv.type = 'text';
    cardCvv.placeholder = 'CVV';
    cardCvv.className = 'form-input';
    cardCvv.id = 'card-cvv';
    cardCvv.maxLength = 3;
    
    cardRow.append(cardExpiry, cardCvv);
    paymentSection.append(paymentTitle, cardNumber, cardRow);
    
    // Submit knap
    const submitBtn = document.createElement('button');
    submitBtn.innerText = 'Confirm order';
    submitBtn.className = 'submit-btn';
    submitBtn.addEventListener('click', handleSubmit);
    
    // Confirmation message
    const confirmMsg = document.createElement('div');
    confirmMsg.id = 'confirm-message';
    confirmMsg.className = 'confirm-message';
    
    form.append(billingSection, deliverySection, paymentSection, submitBtn, confirmMsg);
    checkoutContainer.append(form);
    
    // Event listener for "same as billing" checkbox
    sameCheckbox.addEventListener('change', () => {
        if (sameCheckbox.checked) {
            deliveryName.value = billingName.value;
            deliveryAddress.value = billingAddress.value;
            deliveryCity.value = billingCity.value;
            deliveryZip.value = billingZip.value;
        }
    });
};


const handleSubmit = () => {
    const billingName = document.querySelector('#billing-name').value;
    const billingAddress = document.querySelector('#billing-address').value;
    const billingCity = document.querySelector('#billing-city').value;
    const billingZip = document.querySelector('#billing-zip').value;
    const cardNumber = document.querySelector('#card-number').value;
    const cardExpiry = document.querySelector('#card-expiry').value;
    const cardCvv = document.querySelector('#card-cvv').value;
    
    const confirmMsg = document.querySelector('#confirm-message');
    
    if (!billingName || !billingAddress || !billingCity || !billingZip || !cardNumber || !cardExpiry || !cardCvv) {
        confirmMsg.innerText = 'Please fill out the form';
        confirmMsg.className = 'confirm-message error';
        return;
    }
    
    saveCart([]);
    
    confirmMsg.innerText = 'Than for you order';
    confirmMsg.className = 'confirm-message success';
    
    
    renderCart();
};


const renderCart = async () => {
    const cart = getCart();
    const cartContainer = document.querySelector('#cart-items');
    const totalElement = document.querySelector('#cart-total');
    
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Din kurv er tom</p>';
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
        price.className = 'item-price';
        price.innerText = `${product.price} kr`;
        
        const quantityWrapper = document.createElement('div');
        quantityWrapper.className = 'quantity-wrapper';
        
        const minusBtn = document.createElement('button');
        minusBtn.innerText = '-';
        minusBtn.className = 'quantity-btn';
        minusBtn.addEventListener('click', () => updateQuantity(product.id, cartItem.quantity - 1));
        
        const quantitySpan = document.createElement('span');
        quantitySpan.className = 'quantity-number';
        quantitySpan.innerText = cartItem.quantity;
        
        const plusBtn = document.createElement('button');
        plusBtn.innerText = '+';
        plusBtn.className = 'quantity-btn';
        plusBtn.addEventListener('click', () => updateQuantity(product.id, cartItem.quantity + 1));
        
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Remove';
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

// Kør når siden loader
if (document.querySelector('#cart-items')) {
    renderCart();
    renderCheckoutForm();
}