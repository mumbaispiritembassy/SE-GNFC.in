(() => {
  const sundayBranches = [
    {
      name: "Mumbai Branch",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=2000&q=85",
      thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=500&q=80",
      alt: "Mumbai Branch Sunday Service",
    },
    {
      name: "Branch 02",
      image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=2000&q=85",
      thumbnail: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=500&q=80",
      alt: "Branch 02 Sunday Service",
    },
    {
      name: "Branch 03",
      image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=2000&q=85",
      thumbnail: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=500&q=80",
      alt: "Branch 03 Sunday Service",
    },
    {
      name: "Branch 04",
      image: "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=2000&q=85",
      thumbnail: "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=500&q=80",
      alt: "Branch 04 Sunday Service",
    },
    {
      name: "Branch 05",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=2000&q=85",
      thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=500&q=80",
      alt: "Branch 05 Sunday Service",
    },
  ];

  const section = document.querySelector(".sunday-section");
  if (!section || typeof window.Swiper !== "function") return;

  const mainSlides = section.querySelector("[data-sunday-slides]");
  const thumbnailSlides = section.querySelector("[data-sunday-thumbnails]");
  mainSlides.innerHTML = sundayBranches.map((branch, index) => `
    <div class="swiper-slide sunday-main-slide">
      <img class="sunday-slide-image" src="${branch.image}" alt="${branch.alt}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
      <div class="sunday-slide-overlay" aria-hidden="true"></div>
      <div class="sunday-slide-content">
        <p class="sunday-slide-label">Sunday Service</p>
        <h3 class="sunday-branch-name">${branch.name}</h3>
        <p class="sunday-service-name">Every Sunday</p>
      </div>
    </div>`).join("");

  thumbnailSlides.innerHTML = sundayBranches.map((branch, index) => `
    <button class="swiper-slide sunday-branch-card" type="button" aria-label="Show ${branch.name} Sunday Service"${index === 0 ? ' aria-current="true"' : ""}>
      <img src="${branch.thumbnail}" alt="" loading="lazy">
      <span class="sunday-branch-card-name">${branch.name}</span>
    </button>`).join("");

  const currentCount = section.querySelector("[data-sunday-current]");
  const totalCount = section.querySelector("[data-sunday-total]");
  const progressFill = section.querySelector("[data-sunday-progress]");

  const sundayBranchSlider = new window.Swiper(section.querySelector(".sunday-branch-slider"), {
    slidesPerView: "auto",
    spaceBetween: 8,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    breakpoints: {
      768: { spaceBetween: 12 },
      1200: { slidesPerView: 5, spaceBetween: 12 },
    },
  });

  const sundayMainSlider = new window.Swiper(section.querySelector(".sunday-main-slider"), {
    loop: true,
    speed: 900,
    effect: "fade",
    fadeEffect: { crossFade: true },
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    navigation: {
      nextEl: section.querySelector(".sunday-main-next"),
      prevEl: section.querySelector(".sunday-main-prev"),
    },
    thumbs: { swiper: sundayBranchSlider },
    on: {
      init(swiper) {
        updateSundayProgress(swiper);
      },
      slideChange(swiper) {
        updateSundayProgress(swiper);
      },
    },
  });

  function updateSundayProgress(swiper) {
    const current = swiper.realIndex + 1;
    currentCount.textContent = String(current).padStart(2, "0");
    totalCount.textContent = String(sundayBranches.length).padStart(2, "0");
    progressFill.style.transform = `scaleX(${current / sundayBranches.length})`;
    section.querySelectorAll(".sunday-branch-card").forEach((thumbnail, index) => {
      if (index === swiper.realIndex) thumbnail.setAttribute("aria-current", "true");
      else thumbnail.removeAttribute("aria-current");
    });
  }

  section.querySelectorAll(".sunday-branch-card").forEach((thumbnail, index) => {
    thumbnail.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        sundayMainSlider.slideToLoop(index);
      }
    });
  });
})();
