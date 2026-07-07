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
  if (gameDriveTile) {
    const photos = Array.from(gameDriveTile.querySelectorAll(".tile-photo"));
    let current = 0;
    setInterval(() => {
      photos[current].classList.remove("is-active");
      current = (current + 1) % photos.length;
      photos[current].classList.add("is-active");
    }, 3500);
  }
});
