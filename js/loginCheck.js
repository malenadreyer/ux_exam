import { SESSION_STORAGE_USER_EMAIL } from './info.js';

const email = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL);

if (email !== null) {
    document.querySelector('#user').innerText = email;
    
    // Desktop menu
    document.querySelector('#login')?.classList.add('hidden');
    document.querySelector('#signup')?.classList.add('hidden');
    document.querySelector('#cart')?.classList.remove('hidden');
    document.querySelector('#logout')?.classList.remove('hidden');
    
    // Mobile menu - hide login/signup section, show cart and logout
    document.querySelector('#mobile-utility-not-logged-in')?.classList.add('hidden');
    document.querySelector('#mobile-utility-logged-in')?.classList.remove('hidden');
    document.querySelector('#mobile-logout .logout-button')?.classList.remove('hidden');
    document.querySelector('#mobile-cart')?.classList.remove('hidden');
} else {
    document.querySelector('#user').innerText = '';
    
    // Desktop menu
    document.querySelector('#login')?.classList.remove('hidden');
    document.querySelector('#signup')?.classList.remove('hidden');
    document.querySelector('#cart')?.classList.add('hidden');
    document.querySelector('#logout')?.classList.add('hidden');
    
    // Mobile menu - show login/signup section, hide cart and logout
    document.querySelector('#mobile-utility-not-logged-in')?.classList.remove('hidden');
    document.querySelector('#mobile-utility-logged-in')?.classList.add('hidden');
    document.querySelector('#mobile-logout .logout-button')?.classList.add('hidden');
    document.querySelector('#mobile-cart')?.classList.add('hidden');
}