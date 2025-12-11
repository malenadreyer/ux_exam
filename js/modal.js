export const showModal = (header, text) => {
  const modal = document.querySelector('#modal-info');
  modal.querySelector('h2').innerText = header;
  modal.querySelector('.modal-message').innerText = text;

  // Open the modal
  modal.showModal();

  // add close behavior to all modal buttons
  modal.querySelectorAll('.modal-button').forEach(btn => {
    btn.addEventListener('click', () => modal.close());
  });
};

// close handling fo0r the x button

const modal = document.querySelector('#modal-info');
const closeBtn = modal.querySelector('#modal-close-button');

if (closeBtn) {
  closeBtn.addEventListener('click', () => modal.close());
}
