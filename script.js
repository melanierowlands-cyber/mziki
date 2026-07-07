document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.style.background = "rgba(33, 29, 23, 0.85)";
      header.style.backdropFilter = "blur(6px)";
    } else {
      header.style.background = "rgba(250, 247, 240, 0.0)";
      header.style.backdropFilter = "none";
    }
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    const introEnd = 7;
    let revealed = false;

    const seekPastIntro = () => {
      if (heroVideo.currentTime < introEnd) {
        heroVideo.currentTime = introEnd;
      }
    };

    heroVideo.addEventListener("loadedmetadata", seekPastIntro);

    heroVideo.addEventListener("seeked", () => {
      heroVideo.play();
      if (!revealed) {
        revealed = true;
        heroVideo.classList.add("is-ready");
      }
    });

    heroVideo.addEventListener("timeupdate", () => {
      if (heroVideo.currentTime >= heroVideo.duration - 0.2) {
        heroVideo.currentTime = introEnd;
      }
    });

    // In case metadata is already available before listeners attach.
    if (heroVideo.readyState >= 1) {
      seekPastIntro();
    }
  }

  const gameDriveTile = document.querySelector(".game-drive-tile");
  let gameDriveInterval = null;
  if (gameDriveTile) {
    const photos = Array.from(gameDriveTile.querySelectorAll(".tile-photo"));
    let current = 0;
    gameDriveInterval = setInterval(() => {
      photos[current].classList.remove("is-active");
      current = (current + 1) % photos.length;
      photos[current].classList.add("is-active");
    }, 3500);
  }

  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const lightboxCounter = lightbox.querySelector(".lightbox-counter");
    const lightboxPrev = lightbox.querySelector(".lightbox-prev");
    const lightboxNext = lightbox.querySelector(".lightbox-next");
    const lightboxClose = lightbox.querySelector(".lightbox-close");

    let currentPhotos = [];
    let currentIndex = 0;
    let lastFocusedTile = null;

    const render = () => {
      const photo = currentPhotos[currentIndex];
      lightboxImage.src = photo.src;
      lightboxImage.alt = photo.alt || "";
      lightboxCaption.textContent = photo.alt || "";
      const multi = currentPhotos.length > 1;
      lightboxCounter.textContent = multi ? `${currentIndex + 1} / ${currentPhotos.length}` : "";
      lightboxPrev.disabled = !multi;
      lightboxNext.disabled = !multi;
    };

    const open = (photos, startIndex, triggerEl) => {
      if (!photos.length) return;
      currentPhotos = photos;
      currentIndex = startIndex || 0;
      lastFocusedTile = triggerEl || null;
      render();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightboxClose.focus();
      if (gameDriveInterval) clearInterval(gameDriveInterval);
    };

    const close = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocusedTile) lastFocusedTile.focus();
    };

    const next = () => {
      if (currentPhotos.length < 2) return;
      currentIndex = (currentIndex + 1) % currentPhotos.length;
      render();
    };

    const prev = () => {
      if (currentPhotos.length < 2) return;
      currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
      render();
    };

    lightboxClose.addEventListener("click", close);
    lightboxNext.addEventListener("click", next);
    lightboxPrev.addEventListener("click", prev);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    document.querySelectorAll(".gallery-tile.has-photo").forEach((tile) => {
      const getPhotos = () => {
        const tilePhotos = tile.querySelectorAll(".tile-photo");
        if (tilePhotos.length) {
          return Array.from(tilePhotos).map((img) => ({ src: img.src, alt: img.alt }));
        }
        try {
          return JSON.parse(tile.dataset.photos || "[]");
        } catch (e) {
          return [];
        }
      };
      const getStartIndex = () => {
        const tilePhotos = Array.from(tile.querySelectorAll(".tile-photo"));
        const activeIndex = tilePhotos.findIndex((img) => img.classList.contains("is-active"));
        return activeIndex >= 0 ? activeIndex : 0;
      };
      const activate = () => open(getPhotos(), getStartIndex(), tile);

      tile.addEventListener("click", activate);
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });
  }
});
