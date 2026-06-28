(() => {
  const loadingMessages = [
    "Preparing Memories...",
    "Loading Gallery...",
    "Opening Diary...",
    "Restoring Conversations...",
    "Loading Soundtrack...",
    "Synchronizing Memories...",
    "Welcome Back, Akhi."
  ];

  const loadingScreen = document.getElementById("loadingScreen");
  const loadingLine = document.getElementById("loadingLine");
  const introScreen = document.getElementById("introScreen");
  const isReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!loadingScreen || !loadingLine || !introScreen) {
    return;
  }

  let index = 0;
  const transitionDelay = isReducedMotion ? 420 : 1100;

  const interval = setInterval(() => {
    index += 1;

    if (index >= loadingMessages.length) {
      clearInterval(interval);
      loadingScreen.animate(
        [{ opacity: 1, filter: "blur(0)" }, { opacity: 0, filter: "blur(6px)" }],
        { duration: isReducedMotion ? 180 : 480, easing: "ease-out", fill: "forwards" }
      );

      setTimeout(() => {
        loadingScreen.classList.add("hidden");
        introScreen.classList.remove("hidden");
      }, isReducedMotion ? 180 : 420);
      return;
    }

    loadingLine.animate(
      [{ opacity: 0.35, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: isReducedMotion ? 150 : 300, easing: "ease-out" }
    );
    loadingLine.textContent = loadingMessages[index];
  }, transitionDelay);
})();
