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

// close handling for the x button
const modal = document.querySelector('#modal_info');

// Only try to add event listeners if the modal actually exists
if (modal) {
  const closeBtn = modal.querySelector('#modal_close_button');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }
}
