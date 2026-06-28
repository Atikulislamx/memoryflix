(() => {
  const beginArchiveBtn = document.getElementById("beginArchiveBtn");
  const profileAkhiBtn = document.getElementById("profileAkhiBtn");
  const introScreen = document.getElementById("introScreen");
  const profileScreen = document.getElementById("profileScreen");
  const appRoot = document.getElementById("appRoot");

  const continueGrid = document.getElementById("continueGrid");
  const collectionsGrid = document.getElementById("collectionsGrid");
  const featuredMemory = document.getElementById("featuredMemory");
  const diaryPreview = document.getElementById("diaryPreview");
  const galleryPreview = document.getElementById("galleryPreview");
  const chatPreview = document.getElementById("chatPreview");
  const videoPreview = document.getElementById("videoPreview");
  const timelinePreview = document.getElementById("timelinePreview");
  const soundtrackPreview = document.getElementById("soundtrackPreview");
  const vaultPreview = document.getElementById("vaultPreview");

  const soundtrackToggle = document.getElementById("soundtrackToggle");
  const soundtrackVolume = document.getElementById("soundtrackVolume");

  const placeholders = {
    continue: "Preparing Memories...",
    missing: "A new memory will appear here soon..."
  };

  const dataFiles = {
    memories: "data/memories.json",
    collections: "data/collections.json",
    diary: "data/diary.json",
    gallery: "data/gallery.json",
    chats: "data/chats.json",
    videos: "data/videos.json",
    timeline: "data/timeline.json",
    soundtrack: "data/soundtrack.json",
    vault: "data/vault.json"
  };

  const fetchJson = async (path, fallback) => {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        return fallback;
      }
      return await response.json();
    } catch {
      return fallback;
    }
  };

  const createCard = ({ title, description, url, subtitle }) => {
    const card = document.createElement(url ? "a" : "article");
    card.className = "collection-card";
    if (url) {
      card.href = url;
    }

    const titleElement = document.createElement("h3");
    titleElement.textContent = title || "Untitled";

    const copy = document.createElement("p");
    copy.textContent = subtitle || description || placeholders.missing;

    card.append(titleElement, copy);
    return card;
  };

  const renderContinueWatching = (items = []) => {
    if (!continueGrid) {
      return;
    }
    continueGrid.innerHTML = "";

    if (!items.length) {
      continueGrid.appendChild(
        createCard({ title: "Continue Watching", subtitle: placeholders.continue })
      );
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const card = createCard({
        title: item.title,
        subtitle: item.subtitle,
        url: item.url
      });

      if (typeof item.progress === "number") {
        const meter = document.createElement("div");
        meter.className = "progress";
        meter.setAttribute("role", "progressbar");
        meter.setAttribute("aria-valuemin", "0");
        meter.setAttribute("aria-valuemax", "100");
        meter.setAttribute("aria-valuenow", String(item.progress));

        const fill = document.createElement("span");
        fill.style.width = `${Math.max(0, Math.min(100, item.progress))}%`;
        meter.appendChild(fill);
        card.appendChild(meter);
      }

      fragment.appendChild(card);
    });

    continueGrid.appendChild(fragment);
  };

  const renderFeaturedMemory = (item) => {
    if (!featuredMemory) {
      return;
    }

    if (!item) {
      featuredMemory.textContent = "Loading Archive...";
      return;
    }

    featuredMemory.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = item.title || "Featured Memory";

    const date = document.createElement("p");
    date.className = "meta-line";
    date.textContent = item.date || "Date to be restored";

    const description = document.createElement("p");
    description.textContent = item.description || placeholders.missing;

    featuredMemory.append(title, date, description);

    if (item.ctaUrl && item.ctaLabel) {
      const cta = document.createElement("a");
      cta.className = "btn-secondary inline-btn";
      cta.href = item.ctaUrl;
      cta.textContent = item.ctaLabel;
      featuredMemory.appendChild(cta);
    }
  };

  const renderListPreview = (target, heading, body, href) => {
    if (!target) {
      return;
    }

    target.innerHTML = "";
    const item = createCard({ title: heading, subtitle: body, url: href });
    target.appendChild(item);
  };

  const initSoundtrack = async (soundtrackData) => {
    if (!window.MemoryFlixSoundtrackController) {
      return null;
    }

    const controller = new window.MemoryFlixSoundtrackController({
      toggleButton: soundtrackToggle,
      volumeInput: soundtrackVolume
    });

    await controller.init(soundtrackData?.tracks || []);
    return controller;
  };

  const init = async () => {
    const [memories, collections, diary, gallery, chats, videos, timeline, soundtrack, vault] =
      await Promise.all([
        fetchJson(dataFiles.memories, {}),
        fetchJson(dataFiles.collections, []),
        fetchJson(dataFiles.diary, []),
        fetchJson(dataFiles.gallery, {}),
        fetchJson(dataFiles.chats, {}),
        fetchJson(dataFiles.videos, {}),
        fetchJson(dataFiles.timeline, []),
        fetchJson(dataFiles.soundtrack, {}),
        fetchJson(dataFiles.vault, {})
      ]);

    renderContinueWatching(memories.continueWatching || []);
    renderFeaturedMemory(memories.featuredMemory);

    if (collectionsGrid) {
      collectionsGrid.innerHTML = "";
      const fragment = document.createDocumentFragment();
      collections.forEach((item) => fragment.appendChild(createCard(item)));
      if (!collections.length) {
        fragment.appendChild(createCard({ title: "Memory Collections", subtitle: placeholders.missing }));
      }
      collectionsGrid.appendChild(fragment);
    }

    renderListPreview(
      diaryPreview,
      diary[0]?.title || "Diary",
      diary[0]?.subtitle || "This chapter hasn't been written yet.",
      "pages/diary.html"
    );
    renderListPreview(
      galleryPreview,
      gallery.albums?.[0]?.title || "Gallery",
      "More memories are being restored...",
      "pages/gallery.html"
    );
    renderListPreview(
      chatPreview,
      chats.threads?.[0]?.title || "Chat Archive",
      chats.threads?.[0]?.preview || "Synchronizing conversations...",
      "pages/chats.html"
    );
    renderListPreview(
      videoPreview,
      videos.trailer?.title || "Video Archive",
      videos.trailer?.status || "Loading Archive...",
      "pages/videos.html"
    );
    renderListPreview(
      timelinePreview,
      timeline[0]?.title || "Timeline",
      "Relationship milestones and future plans are being restored.",
      "pages/timeline.html"
    );
    renderListPreview(
      soundtrackPreview,
      soundtrack.playlistTitle || "Soundtrack",
      soundtrack.tracks?.length
        ? `${soundtrack.tracks.length} tracks in the archive soundtrack.`
        : "Songs for this chapter are loading...",
      "pages/soundtrack.html"
    );
    renderListPreview(
      vaultPreview,
      vault.isProtected ? "Secret Vault (Locked)" : "Secret Vault",
      vault.placeholder || "Preparing secure memories...",
      "pages/secret.html"
    );

    const soundtrackController = await initSoundtrack(soundtrack);

    beginArchiveBtn?.addEventListener("click", async () => {
      introScreen?.classList.add("hidden");
      profileScreen?.classList.remove("hidden");
      if (soundtrackController) {
        await soundtrackController.start();
      }
    });

    profileAkhiBtn?.addEventListener("click", () => {
      profileScreen?.classList.add("hidden");
      appRoot?.classList.remove("hidden");
      appRoot?.setAttribute("tabindex", "-1");
      appRoot?.focus({ preventScroll: true });
    });
  };

  init();
})();
