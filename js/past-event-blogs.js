(() => {
  const impactSection = document.querySelector(".impact-section");
  if (!impactSection) return;

  const stack = impactSection.querySelector(".impact-card-stage");
  const category = impactSection.querySelector(".impact-story-category");
  const title = impactSection.querySelector(".impact-story-title");
  const description = impactSection.querySelector(".impact-story-description");
  const learnMore = impactSection.querySelector(".impact-learn-more");
  const currentCounter = impactSection.querySelector("[data-impact-current]");
  const totalCounter = impactSection.querySelector("[data-impact-total]");
  const previousButton = impactSection.querySelector("[data-impact-prev]");
  const nextButton = impactSection.querySelector("[data-impact-next]");
  const stackClasses = ["is-active", "is-stack-one", "is-stack-two", "is-stack-three", "is-hidden"];
  const leaveDuration = 520;
  const impactAutoplayDelay = 5000;

  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

  async function initializeImpactStories() {
    try {
      const response = await fetch("data/past-event-blogs.json?v=20261001-impact-stack");
      if (!response.ok) throw new Error("Impact stories could not be loaded.");
      const impactStories = await response.json();
      if (!Array.isArray(impactStories) || impactStories.length === 0) return;

      stack.innerHTML = impactStories.map((story, index) => `
        <article class="impact-stack-card${index === 0 ? " is-active" : " is-hidden"}" data-impact-card="${index}" aria-hidden="${index === 0 ? "false" : "true"}">
          <img class="impact-stack-card-image" src="${escapeHtml(story.image)}" alt="${escapeHtml(story.imageAlt || story.title || "Impact story")}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
          <span class="impact-card-overlay" aria-hidden="true"></span>
        </article>`).join("");

      const cards = [...stack.querySelectorAll(".impact-stack-card")];
      let activeIndex = 0;
      let isAnimating = false;
      let impactAutoTimer = null;
      let impactIsPaused = document.hidden;
      let touchStartX = null;

      totalCounter.textContent = String(impactStories.length).padStart(2, "0");

      function updateStoryContent() {
        const story = impactStories[activeIndex];
        category.textContent = story.category || "OUR IMPACT";
        title.textContent = story.title || "Impact story";
        description.textContent = story.description || "";
        learnMore.href = story.url || "#";
        learnMore.setAttribute("aria-label", `Learn more: ${story.title || "Impact story"}`);
        currentCounter.textContent = String(activeIndex + 1).padStart(2, "0");
      }

      function updateCardStack() {
        cards.forEach((card, index) => {
          card.classList.remove(...stackClasses);
          const depth = (index - activeIndex + cards.length) % cards.length;
          if (depth === 0) card.classList.add("is-active");
          else if (depth <= 3) card.classList.add(`is-stack-${["", "one", "two", "three"][depth]}`);
          else card.classList.add("is-hidden");
          card.setAttribute("aria-hidden", depth === 0 ? "false" : "true");
        });
      }

      function clearImpactAutoplay() {
        window.clearTimeout(impactAutoTimer);
        impactAutoTimer = null;
      }

      function startImpactAutoplay() {
        clearImpactAutoplay();
        if (impactIsPaused || document.hidden || cards.length < 2) return;
        impactAutoTimer = window.setTimeout(() => {
          impactAutoTimer = null;
          moveStory(1);
        }, impactAutoplayDelay);
      }

      function moveStory(direction) {
        if (isAnimating || cards.length < 2) return;
        clearImpactAutoplay();
        isAnimating = true;
        const outgoing = cards[activeIndex];
        outgoing.classList.add(direction > 0 ? "is-leaving-next" : "is-leaving-prev");
        activeIndex = (activeIndex + direction + impactStories.length) % impactStories.length;
        updateCardStack();
        updateStoryContent();

        window.setTimeout(() => {
          outgoing.classList.remove("is-leaving-next", "is-leaving-prev");
          isAnimating = false;
          startImpactAutoplay();
        }, leaveDuration);
      }

      previousButton.addEventListener("click", () => moveStory(-1));
      nextButton.addEventListener("click", () => moveStory(1));
      stack.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? null;
        clearImpactAutoplay();
      }, { passive: true });
      stack.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0]?.clientX;
        if (touchStartX !== null && typeof touchEndX === "number") {
          const swipeDistance = touchEndX - touchStartX;
          if (Math.abs(swipeDistance) > 48) moveStory(swipeDistance < 0 ? 1 : -1);
          else startImpactAutoplay();
        }
        touchStartX = null;
      }, { passive: true });
      document.addEventListener("visibilitychange", () => {
        impactIsPaused = document.hidden;
        if (impactIsPaused) clearImpactAutoplay();
        else startImpactAutoplay();
      });
      updateStoryContent();
      updateCardStack();
      startImpactAutoplay();
    } catch {
      stack.innerHTML = '<p class="impact-story-error" role="status">Impact stories are temporarily unavailable.</p>';
    }
  }

  initializeImpactStories();
})();
