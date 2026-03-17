const header = document.querySelector(".header");

const scrollY = () => {
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if(y > 80) header.classList.add("fixed");
    else header.classList.remove("fixed");
  })
}

export default scrollY;