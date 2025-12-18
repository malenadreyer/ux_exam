export const showModal = (header, text, onClose = null) => {
  const modal = document.querySelector('#modal-info');
  modal.querySelector('h2').innerText = header;
  modal.querySelector('.modal-message').innerText = text;

  console.log('showModal called with onClose:', onClose);

  // If there's a callback, set it up to run when modal closes
  if (onClose) {
    const handleClose = () => {
      console.log('Modal close event fired! Executing callback...');
      onClose();
      modal.removeEventListener('close', handleClose);
    };
    modal.addEventListener('close', handleClose);
    console.log('Close listener added');
  }

  // Open the modal
  modal.showModal();
  console.log('Modal opened');
};

// Set up close behavior once when the page loads
const modal = document.querySelector('#modal-info');

if (modal) {
  modal.addEventListener('click', (e) => {
    console.log('Modal clicked, target:', e.target);
    // Close if clicking the close button
    if (e.target.classList.contains('modal-button')) {
      console.log('Close button clicked, closing modal...');
      modal.close();
    }
    // Close if clicking the backdrop
    if (e.target === modal) {
      console.log('Backdrop clicked, closing modal...');
      modal.close();
    }
  });
  console.log('Modal click listener set up');
}