import { USERS_BASE_URL } from './info.js';
import { showModal } from './modal.js';

document.querySelector('#signup_form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const repeatPassword = e.target.repeat_password.value.trim();

    if (password !== repeatPassword) {
        showModal('Validation error', 'Both passwords must match.');
        return;
    }

    // First, fetch all users to check if email already exists
    fetch(`${USERS_BASE_URL}/users`)
    .then(response => response.json())
    .then(data => {
        // Check if email already exists
        const emailExists = data.some(user => user.email === email);

        if (emailExists) {
            showModal('Validation error', 'An account with this email already exists.');
            return;
        }

        // If email doesn't exist, create new user
        const newUser = {
            email: email,
            password: password
        };

        return fetch(`${USERS_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
    })
    .then(response => {
        if (!response) return; // Email exist, already showed modal
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        if (data) {
            showModal('Signed up', 'The new user was created successfully.');
            e.target.reset();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showModal('Error', 'Failed to create user. Please try again.');
    });
});