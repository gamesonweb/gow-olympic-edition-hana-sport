document.addEventListener("DOMContentLoaded", () => {
    const fullscreenButton = document.getElementById("fullscreen-button");
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  fullscreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      fullscreenButton.textContent = "Exit Fullscreen";
    } else {
      fullscreenButton.textContent = "Go Fullscreen";
    }
  });

  // Hide the address bar on load
  window.scrollTo(0, 1);
});
