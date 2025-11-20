// Menu functionality constants and their classes O_o
const burgerButton = document.getElementById('burger_button');
const closeButton = document.getElementById('close_button');
const rightSideMenu = document.getElementById('right_side_menu');
const overlay = document.getElementById('overlay');

// Open menu
burgerButton.addEventListener('click', () => {
    rightSideMenu.classList.add('open');
});

// Close menu
closeButton.addEventListener('click', () => {
    rightSideMenu.classList.remove('open');
});

// Close menu when clicking overlay
overlay.addEventListener('click', () => {
    rightSideMenu.classList.remove('open');
});