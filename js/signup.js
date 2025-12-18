import { USERS_BASE_URL } from './info.js';
import { showModal } from './modal.js';

const validatePassword = (password) => {
    if (password.length < 9) {
        return 'Password must be at least 9 characters long.';
    }
    if (!/\d/.test(password)) {
        return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return 'Password must contain at least one special character.';
    }
    return null;
};

// Check if we need to show modal after page reload
window.addEventListener('DOMContentLoaded', () => {
    const modalData = sessionStorage.getItem('showModal');
    if (modalData) {
        const { header, text, redirect } = JSON.parse(modalData);
        sessionStorage.removeItem('showModal');
        showModal(header, text);
        
        // Redirect after 2 seconds
        if (redirect) {
            setTimeout(() => {
                window.location.href = redirect;
            }, 2000);
        }
    }
});

document.querySelector('#signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim().toLowerCase();
    const password = e.target.password.value.trim();
    const repeatPassword = e.target.repeat_password.value.trim();

    const passwordError = validatePassword(password);
    if (passwordError) {
        showModal('Validation error', passwordError);
        return;
    }

    if (password !== repeatPassword) {
        showModal('Validation error', 'Both passwords must match.');
        return;
    }

    try {
        const response = await fetch(`${USERS_BASE_URL}/users`);
        const users = await response.json();
        
        const emailExists = users.some(user => user.email.toLowerCase() === email);
        
        if (emailExists) {
            showModal('Signup failed', 'This email is already registered. Please log in instead.', 'Go to login', 'login.html');
            return;
        }

        const newUser = { email, password };
        await fetch(`${USERS_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        // Store modal data with redirect in sessionStorage
        sessionStorage.setItem('showModal', JSON.stringify({
            header: 'Signed up',
            text: 'User was created successfully. Redirecting to login...',
            redirect: 'login.html'
        }));
        
    } catch (error) {
        showModal('Error', 'Failed to create user. Please try again.');
    }
});