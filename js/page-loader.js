(() => {
  const pageShell = document.querySelector("[data-page]");
  if (!pageShell) {
    return;
  }

  const pageType = pageShell.getAttribute("data-page");
  const listTarget = document.getElementById("pageDataList");
  const placeholderTarget = document.getElementById("pagePlaceholder");

  const pageMap = {
    diary: {
      file: "../data/diary.json",
      title: "Diary",
      subtitle: "This chapter hasn't been written yet..."
    },
    gallery: {
      file: "../data/gallery.json",
      title: "Gallery",
      subtitle: "More memories are being restored..."
    },
    chats: {
      file: "../data/chats.json",
      title: "Chat Archive",
      subtitle: "Synchronizing Memories..."
    },
    videos: {
      file: "../data/videos.json",
      title: "Video Archive",
      subtitle: "Loading Archive..."
    },
    timeline: {
      file: "../data/timeline.json",
      title: "Timeline",
      subtitle: "A new memory will appear here soon..."
    },
    soundtrack: {
      file: "../data/soundtrack.json",
      title: "Soundtrack",
      subtitle: "Songs for this chapter are loading..."
    },
    secret: {
      file: "../data/vault.json",
      title: "Secret Vault",
      subtitle: "Preparing secure memories..."
    }
  };

  const createCard = (title, body, meta = "") => {
    const card = document.createElement("article");
    card.className = "data-card";

    const heading = document.createElement("h2");
    heading.textContent = title;

    const content = document.createElement("p");
    content.textContent = body;

    card.append(heading, content);

    if (meta) {
      const metaLine = document.createElement("p");
      metaLine.style.opacity = "0.75";
      metaLine.style.fontSize = "0.92rem";
      metaLine.textContent = meta;
      card.appendChild(metaLine);
    }

    return card;
  };

  const renderFromData = (data, config) => {
    if (!listTarget) {
      return;
    }

    listTarget.innerHTML = "";

    if (Array.isArray(data)) {
      data.forEach((item) => {
        const title = item.title || config.title;
        const body = item.subtitle || item.description || item.content || config.subtitle;
        const meta = item.date || item.type || item.mood || "";
        listTarget.appendChild(createCard(title, body, meta));
      });
      return;
    }

    if (data && typeof data === "object") {
      const entries = Object.entries(data);
      entries.forEach(([key, value]) => {
        if (Array.isArray(value)) {
          listTarget.appendChild(createCard(key, `${value.length} items in this archive section.`));
        } else if (value && typeof value === "object") {
          const body = Object.values(value)
            .filter((entry) => typeof entry === "string")
            .join(" · ");
          listTarget.appendChild(createCard(key, body || config.subtitle));
        } else {
          listTarget.appendChild(createCard(key, String(value)));
        }
      });
      return;
    }

    listTarget.appendChild(createCard(config.title, config.subtitle));
  };

  const loadPage = async () => {
    const config = pageMap[pageType];
    if (!config) {
      return;
    }

    try {
      const response = await fetch(config.file);
      if (!response.ok) {
        throw new Error("Unable to load page data");
      }
      const data = await response.json();
      renderFromData(data, config);
      if (placeholderTarget) {
        placeholderTarget.textContent = "Archive data loaded from structured JSON.";
      }
    } catch {
      if (listTarget) {
        listTarget.innerHTML = "";
        listTarget.appendChild(createCard(config.title, config.subtitle));
      }
      if (placeholderTarget) {
        placeholderTarget.textContent = "This chapter is still waiting for its full story.";
      }
    }
  };

  loadPage();
})();
