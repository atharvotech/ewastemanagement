// Fade-in animation when cards come into view
const cards = document.querySelectorAll(".fade-in");

function revealOnScroll() {
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      card.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
