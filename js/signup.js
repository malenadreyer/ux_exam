import { USERS_BASE_URL } from './info.js';
import { showModal } from './modal.js';

document.querySelector('#signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const repeatPassword = e.target.repeat_password.value.trim();

    if (password !== repeatPassword) {
        console.log('Passwords do not match');
        showModal('Validation error', 'Both passwords must match.');
        return;
    }

    try {
        const response = await fetch(`${USERS_BASE_URL}/users`);
        const users = await response.json();
        
        if (users.some(user => user.email === email)) {
            showModal('Validation error', 'An account with this email already exists.');
            return;
        }

        const createResponse = await fetch(`${USERS_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!createResponse.ok) {
            throw new Error(`HTTP error! status: ${createResponse.status}`);
        }

        await createResponse.json();
        
        // Redirect IMMEDIATELY, skip the modal for successful signup
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('Error:', error);
        showModal('Error', 'Failed to create user. Please try again.');
    }
});