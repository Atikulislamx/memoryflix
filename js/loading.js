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

  if (!loadingScreen || !loadingLine || !introScreen) {
    return;
  }

  let index = 0;
  const interval = setInterval(() => {
    index += 1;

    if (index >= loadingMessages.length) {
      clearInterval(interval);
      loadingScreen.classList.add("hidden");
      introScreen.classList.remove("hidden");
      return;
    }

    loadingLine.textContent = loadingMessages[index];
  }, 900);
})();
