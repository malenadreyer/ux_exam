export const showModal = (header, text) => {
  const modal = document.querySelector('#modal_info');
  modal.querySelector('h2').innerText = header;
  modal.querySelector('.modal_message').innerText = text;

  // Open tjhe modal
  modal.showModal();

  // add close behavior to all modal buttons
  modal.querySelectorAll('.modal_button').forEach(btn => {
    btn.addEventListener('click', () => modal.close());
  });
};

// close handling fo0r the x button

const modal = document.querySelector('#modal_info');
const closeBtn = modal.querySelector('#modal_close_button');

if (closeBtn) {
  closeBtn.addEventListener('click', () => modal.close());
}
