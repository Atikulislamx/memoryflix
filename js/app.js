(() => {
  const beginArchiveBtn = document.getElementById("beginArchiveBtn");
  const profileAkhiBtn = document.getElementById("profileAkhiBtn");
  const introScreen = document.getElementById("introScreen");
  const profileScreen = document.getElementById("profileScreen");
  const appRoot = document.getElementById("appRoot");
  const collectionsGrid = document.getElementById("collectionsGrid");

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
      card.className = "collection-card";

      const title = document.createElement("h3");
      title.textContent = item.title;

      const note = document.createElement("p");
      note.textContent = item.placeholder;

      card.append(title, note);
      fragment.appendChild(card);
    });
    collectionsGrid.appendChild(fragment);
  }

  beginArchiveBtn?.addEventListener("click", () => {
    introScreen?.classList.add("hidden");
    profileScreen?.classList.remove("hidden");
  });

  profileAkhiBtn?.addEventListener("click", () => {
    profileScreen?.classList.add("hidden");
    appRoot?.classList.remove("hidden");
  });
})();
