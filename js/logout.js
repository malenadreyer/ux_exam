import { SESSION_STORAGE_USER_EMAIL } from './info.js';

const handleLogout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_USER_EMAIL);
    window.location.href = 'index.html';
};

// Desktop logout button
document.querySelector('#logout-btn')?.addEventListener('click', handleLogout);

// Mobile logout button
document.querySelector('#mobile-logout .logout-button')?.addEventListener('click', handleLogout);