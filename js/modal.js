export const showModal = (header, text) => {
  const modal = document.querySelector("#modal-info");
  
  modal.querySelector("h2").innerText = header;
  modal.querySelector(".modal-message").innerText = text;
  
  modal.showModal();
};

// Set up close behavior once when the page loads
const modal = document.querySelector("#modal-info");

if (modal) {
  const closeBtn = modal.querySelector(".modal-button");
  
  closeBtn.addEventListener("click", () => {
    modal.close();
  });
  
  // Prevent closing by clicking backdrop - user must use X button
  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}