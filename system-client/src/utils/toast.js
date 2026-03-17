const toast = (type) => {
  if(!type) return;

  let message = "";
  if (type === "added") message = "Successfully added to cart!";

  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    </div>
  `;

  document.body.appendChild(t);

  t.querySelector(".toast-close").addEventListener("click", () => {
    t.classList.add("slideOut");
    t.addEventListener("animationend", () => t.remove());
  });

  // auto remove after 2.5s
  setTimeout(() => {
    t.classList.add("slideOut");
    t.addEventListener("animationend", () => t.remove());
  }, 2500);
};

export default toast;