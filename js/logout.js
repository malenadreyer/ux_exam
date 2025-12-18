import { SESSION_STORAGE_USER_EMAIL } from './info.js';

document.querySelector('#logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_STORAGE_USER_EMAIL);
    location.reload();
});