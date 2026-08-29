(() => {
  const dialog = document.querySelector("[data-tc-dialog]");
  if (!dialog) return;
  const image = dialog.querySelector("[data-tc-dialog-image]");
  document.querySelectorAll("[data-tc-gallery]").forEach((button) => button.addEventListener("click", () => {
    image.src = button.dataset.tcGallery;
    image.alt = button.dataset.tcAlt || "Thumb Command gallery image";
    dialog.showModal();
  }));
  dialog.querySelector("[data-tc-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
})();
