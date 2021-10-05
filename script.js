"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const header = document.querySelector(".header");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const logo = nav.querySelector("#logo");
const navLinks = nav.querySelectorAll(".nav__link");
const dotsContainer = document.querySelector(".dots");

btnScrollTo.addEventListener("click", () => {
  section1.scrollIntoView({ behavior: "smooth" });
});

const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML =
  'We use cookies for improved functionality and analytics.<btn class="btn btn--close--cookie">Got it!</btn>';

header.append(message);
message.style.backgroundColor = "#37383d";
message.style.width = "120%";
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 10 + "px";

document.querySelector(".btn--close--cookie").addEventListener("click", () => {
  message.remove();
});

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

document.querySelector(".nav__links").addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;
  if (target.classList.contains("nav__link")) {
    const sectionId = target.getAttribute("href");
    document.querySelector(sectionId).scrollIntoView({ behavior: "smooth" });
  }
});

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".operations__tab");
  if (clicked) {
    tabs.forEach((tab) => {
      tab.classList.remove("operations__tab--active");
    });
    clicked.classList.add("operations__tab--active");

    tabsContent.forEach((content) => {
      content.classList.remove("operations__content--active");
    });

    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add("operations__content--active");
  }
});

// Code for fading and unfading nav item
function handleNavHover(e, opacity) {
  const itemInFocus = e.target;
  const navTargets = [...navLinks, logo];
  if (itemInFocus.classList.contains("nav__link") || itemInFocus === logo) {
    navTargets.forEach((t) => {
      if (t !== itemInFocus) {
        t.style.opacity = opacity;
      }
    });
  }
}

nav.addEventListener("mouseover", (e) => handleNavHover(e, 0.5));
nav.addEventListener("mouseout", (e) => handleNavHover(e, 1));

//Code for sticky nav bar
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const navHeight = nav.getBoundingClientRect().height;
const headerHeight = header.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 1 - (headerHeight - navHeight) / headerHeight,
});
headerObserver.observe(header);

// Reveal sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
const allSections = document.querySelectorAll(".section");

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy loading images
const imgTargets = document.querySelectorAll(".features__img");

const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.setAttribute("src", entry.target.dataset.src);

    entry.target.addEventListener("load", () => {
      entry.target.classList.remove("lazy-img");
    });

    observer.unobserve(entry.target);
  }
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0.1,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
let curSlide = 0;

const activateDots = function (slide) {
  document.querySelectorAll(".dots__dot").forEach((dot) => {
    dot.classList.remove("dots__dot--active");
  });

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = (slideNum) => {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slideNum)}%)`;
  });
  activateDots(slideNum);
};

const goToNextSlide = () => {
  curSlide++;
  if (curSlide >= slides.length) {
    curSlide = 0;
  }
  goToSlide(curSlide);
};

const goToPreviousSlide = () => {
  curSlide--;
  if (curSlide < 0) {
    curSlide = slides.length - 1;
  }
  goToSlide(curSlide);
};

const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();

slides.forEach((s, i) => {
  s.style.transform = `translateX(${i * 100}%)`;
});
goToSlide(0);

btnRight.addEventListener("click", goToNextSlide);
btnLeft.addEventListener("click", goToPreviousSlide);

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") {
    goToNextSlide();
    return;
  }

  if (e.key === "ArrowLeft") {
    goToPreviousSlide();
  }
});

dotsContainer.addEventListener("click", (e) => {
  const { target } = e;
  if (e.target.classList.contains("dots__dot")) {
    const slideNum = target.dataset.slide;
    goToSlide(slideNum);
  }
});
