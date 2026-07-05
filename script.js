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
});
