(() => {
  const beginArchiveBtn = document.getElementById("beginArchiveBtn");
  const profileAkhiBtn = document.getElementById("profileAkhiBtn");
  const introScreen = document.getElementById("introScreen");
  const profileScreen = document.getElementById("profileScreen");
  const appRoot = document.getElementById("appRoot");
  const collectionsGrid = document.getElementById("collectionsGrid");
  const rippleButtons = document.querySelectorAll(".btn-ripple");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const collections = [
    { title: "Photos", placeholder: "More memories are being restored..." },
    { title: "Videos", placeholder: "A new memory will appear here soon." },
    { title: "Diary", placeholder: "This chapter is still being written..." },
    {
      title: "Chat Archive",
      placeholder: "Some moments are still waiting to be preserved."
    },
    { title: "Timeline", placeholder: "Memory synchronization in progress..." },
    { title: "Soundtrack", placeholder: "Songs for this chapter are loading..." },
    { title: "Secret Vault", placeholder: "This chapter hasn't been written yet." }
  ];

  if (collectionsGrid) {
    const fragment = document.createDocumentFragment();
    collections.forEach((item) => {
      const card = document.createElement("article");
      card.className = "collection-card reveal-on-scroll";
      card.tabIndex = 0;

      const title = document.createElement("h3");
      title.textContent = item.title;

      const note = document.createElement("p");
      note.textContent = item.placeholder;

      card.append(title, note);
      fragment.appendChild(card);
    });
    collectionsGrid.appendChild(fragment);
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || prefersReducedMotion) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
  );

  document.querySelectorAll(".reveal-on-scroll").forEach((node) => {
    if (prefersReducedMotion) {
      node.classList.add("revealed");
      return;
    }
    revealObserver.observe(node);
  });

  rippleButtons.forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
      button.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
      button.classList.remove("ripple-active");
      requestAnimationFrame(() => button.classList.add("ripple-active"));
    });

    button.addEventListener("animationend", () => {
      button.classList.remove("ripple-active");
    });
  });

  beginArchiveBtn?.addEventListener("click", () => {
    if (!introScreen || !profileScreen) {
      return;
    }

    introScreen.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: prefersReducedMotion ? 100 : 300,
      fill: "forwards"
    });

    setTimeout(() => {
      introScreen.classList.add("hidden");
      profileScreen.classList.remove("hidden");
      profileAkhiBtn?.focus();
    }, prefersReducedMotion ? 80 : 240);
  });

  profileAkhiBtn?.addEventListener("click", () => {
    if (!profileScreen || !appRoot) {
      return;
    }

    profileScreen.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.99)" }], {
      duration: prefersReducedMotion ? 100 : 320,
      fill: "forwards"
    });

    setTimeout(() => {
      profileScreen.classList.add("hidden");
      appRoot.classList.remove("hidden");
      appRoot.classList.add("app-ready");
      document.getElementById("mainContent")?.focus?.();
    }, prefersReducedMotion ? 80 : 260);
  });
})();
