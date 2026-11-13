/* =========================================================
   QISKIT FALL FEST 2026 — MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initSponsorsCarousel();
  initTalksCarousel();
});


/* =========================================================
   1. SPONSORS CAROUSEL
   ========================================================= */

function initSponsorsCarousel() {
  const carousel = document.querySelector(".sponsors-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".sponsors-track");
  const dotsContainer = document.querySelector(".sponsors-dots");
  if (!track || !dotsContainer) return;

  const originalSlides = Array.from(track.children);
  const total = originalSlides.length;
  const VISIBLE = 3;
  const AUTOPLAY_MS = 3000;

  if (total <= VISIBLE) return;

  let index = VISIBLE;
  let animating = false;
  let timer;

  const slideWidth = 100 / VISIBLE;

  function build() {
    track.innerHTML = "";
    dotsContainer.innerHTML = "";

    const before = originalSlides.slice(-VISIBLE).map(cloneSlide);
    const after  = originalSlides.slice(0, VISIBLE).map(cloneSlide);

    [...before, ...originalSlides.map(cloneSlide), ...after]
      .forEach(slide => track.appendChild(slide));

    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.className = "sponsors-dot";
      dot.setAttribute("aria-label", `Go to sponsor ${i + 1}`);
      dot.addEventListener("click", () => {
        if (animating) return;
        stopAutoplay();
        index = VISIBLE + i;
        update();
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    }

    jumpTo(index);
  }

  function cloneSlide(node) {
    const slide = document.createElement("div");
    slide.className = "sponsors-slide";

    const content = node.cloneNode(true);
    content.setAttribute("role", "button");
    content.setAttribute("tabindex", "0");
    content.addEventListener("click", next);
    content.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        next();
      }
    });

    slide.appendChild(content);
    return slide;
  }

  function update() {
    track.style.transform = `translateX(-${index * slideWidth}%)`;

    const realIndex = (index - VISIBLE + total) % total;

    dotsContainer.querySelectorAll(".sponsors-dot")
      .forEach((dot, i) => dot.classList.toggle("active", i === realIndex));
  }

  function jumpTo(i) {
    track.style.transition = "none";
    update();
    track.offsetHeight;
    track.style.transition = "transform 0.6s ease-in-out";
  }

  function next() {
    if (animating) return;
    animating = true;
    index++;
    update();
  }

  function previous() {
    if (animating) return;
    animating = true;
    index--;
    update();
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  track.addEventListener("transitionend", () => {
    if (index >= total + VISIBLE) {
      index = VISIBLE;
      jumpTo(index);
    } else if (index < VISIBLE) {
      index = total + VISIBLE - 1;
      jumpTo(index);
    }
    animating = false;
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  build();
  startAutoplay();
}


/* =========================================================
   2. TALKS CAROUSEL
   ========================================================= */

function initTalksCarousel() {
  const carousel = document.querySelector(".talks-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".talks-track");
  const prevBtn = carousel.querySelector(".talks-prev");
  const nextBtn = carousel.querySelector(".talks-next");
  if (!track) return;

  const total = track.children.length;
  if (total <= 1) return;

  let index = 0;
  let timer;

  const show = i => {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const stop  = () => clearInterval(timer);
  const start = () => {
    stop();
    timer = setInterval(() => show(index + 1), 5000);
  };

  prevBtn?.addEventListener("click", () => show(index - 1));
  nextBtn?.addEventListener("click", () => show(index + 1));

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  start();
}