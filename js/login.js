import { showModal } from './modal.js';
import { SESSION_STORAGE_USER_EMAIL, USERS_BASE_URL } from './info.js';

document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    fetch(`${USERS_BASE_URL}/users`)
    .then(response => response.json())
    .then(data => {
        const email = e.target.txtEmail.value.trim();
        const password = e.target.txtPassword.value.trim();

        let found = false;
        data.forEach(user => {
            if (!found) {
                if (user.email === email && user.password === password) {
                    sessionStorage.setItem(SESSION_STORAGE_USER_EMAIL, email);

                    showModal('Login succesfull', 'Welcome back!');
                    setTimeout(() => {
                        location.href = 'index.html';
                    }, 1500);
                    
                    
                    found = true;
                }
            }
        });

        if (!found) {
            showModal('Validation error', 'Incorrect credentials.');
        } 
    })
    .catch(error => console.log(error));
});