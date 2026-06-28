(() => {
  const bootScreen = document.getElementById("bootScreen");
  const bootTitle = document.getElementById("bootTitle");
  const bootMessage = document.getElementById("bootMessage");
  const bootProgressFill = document.getElementById("bootProgressFill");
  const bootProgressBar = document.getElementById("bootProgressBar");
  const bootParticles = document.getElementById("bootParticles");
  const introScreen = document.getElementById("introScreen");

  if (!bootScreen || !bootTitle || !bootMessage || !bootProgressFill || !bootProgressBar || !introScreen) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timeline = [
    { title: "Entering the archive...", message: "Black screen. A quiet memory begins.", progress: 8, duration: 2200 },
    { title: "Ambient tone rising...", message: "Particles and light are being restored.", progress: 26, duration: 2400 },
    { title: "Logo reveal", message: "AKHI//ARCHIVE is coming into focus.", progress: 44, duration: 2200 },
    { title: "Loading chapters", message: "Preparing Memories...", progress: 62, duration: 2400 },
    { title: "Restoring archive", message: "Synchronizing Memories...", progress: 82, duration: 2200 },
    { title: "Ready", message: "Welcome Back, Akhi.", progress: 100, duration: 2200 }
  ];

  const normalizedTimeline = reducedMotion
    ? timeline.map((step) => ({ ...step, duration: 400 }))
    : timeline;

  if (bootParticles && !reducedMotion) {
    const particleFragment = document.createDocumentFragment();
    for (let i = 0; i < 20; i += 1) {
      const particle = document.createElement("span");
      particle.style.setProperty("--delay", `${(i * 0.17).toFixed(2)}s`);
      particle.style.setProperty("--x", `${Math.random() * 100}%`);
      particleFragment.appendChild(particle);
    }
    bootParticles.appendChild(particleFragment);
  }

  let currentStep = 0;

  const runStep = () => {
    const step = normalizedTimeline[currentStep];
    if (!step) {
      bootScreen.classList.add("hidden");
      introScreen.classList.remove("hidden");
      return;
    }

    bootTitle.textContent = step.title;
    bootMessage.textContent = step.message;
    bootProgressFill.style.width = `${step.progress}%`;
    bootProgressBar.setAttribute("aria-valuenow", String(step.progress));

    currentStep += 1;
    window.setTimeout(runStep, step.duration);
  };

  runStep();
})();
