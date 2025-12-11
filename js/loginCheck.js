import { SESSION_STORAGE_USER_EMAIL } from './info.js';

const email = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL);
if (email !== null) {
    document.querySelector('#user').innerText = email;
    document.querySelector('#login').classList.add('hidden');
    document.querySelector('#signup').classList.add('hidden');
    document.querySelector('#cart').classList.remove('hidden');
    document.querySelector('#logout').classList.remove('hidden');
} else {
    document.querySelector('#user').innerText = '';
    document.querySelector('#login').classList.remove('hidden');
    document.querySelector('#signup').classList.remove('hidden');
    document.querySelector('#cart').classList.add('hidden');
    document.querySelector('#logout').classList.add('hidden');
}