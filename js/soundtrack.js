(() => {
  class SoundtrackController {
    constructor({ toggleButton, volumeInput, statusTarget } = {}) {
      this.toggleButton = toggleButton;
      this.volumeInput = volumeInput;
      this.statusTarget = statusTarget;
      this.tracks = [];
      this.audio = null;
      this.currentTrackIndex = 0;
      this.isMuted = true;
      this.userVolume = 0.55;
      this.fadeInterval = null;
      this.isReady = false;
    }

    async init(tracks = []) {
      this.tracks = Array.isArray(tracks) ? tracks.filter((track) => track && track.src) : [];
      this.userVolume = Number(this.volumeInput?.value || 55) / 100;

      this.toggleButton?.addEventListener("click", () => this.toggleMute());
      this.volumeInput?.addEventListener("input", (event) => {
        const value = Number(event.target.value || 0) / 100;
        this.setVolume(value);
      });

      if (!this.tracks.length) {
        this.updateStatus("Soundtrack unavailable");
        if (this.toggleButton) {
          this.toggleButton.disabled = true;
        }
        if (this.volumeInput) {
          this.volumeInput.disabled = true;
        }
        return;
      }

      this.loadTrack(this.currentTrackIndex);
      this.isReady = true;
      this.updateStatus("Sound: Off");
    }

    loadTrack(index) {
      const track = this.tracks[index];
      if (!track) {
        return;
      }

      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }

      const audio = new Audio(track.src);
      audio.loop = true;
      audio.preload = "none";
      audio.volume = this.isMuted ? 0 : this.userVolume;
      audio.addEventListener("error", () => {
        this.updateStatus("Soundtrack unavailable");
      });
      this.audio = audio;
    }

    async ensurePlayback() {
      if (!this.audio) {
        this.loadTrack(this.currentTrackIndex);
      }

      if (!this.audio) {
        return;
      }

      try {
        await this.audio.play();
      } catch {
        this.updateStatus("Sound blocked until interaction");
      }
    }

    async start() {
      if (!this.isReady) {
        return;
      }
      this.isMuted = false;
      await this.ensurePlayback();
      this.fadeTo(this.userVolume, 1200);
      this.updateStatus(`Sound: On · ${this.currentTrackTitle()}`);
    }

    toggleMute() {
      if (!this.isReady || !this.audio) {
        return;
      }

      if (this.isMuted) {
        this.isMuted = false;
        this.ensurePlayback();
        this.fadeTo(this.userVolume, 700);
        this.updateStatus(`Sound: On · ${this.currentTrackTitle()}`);
      } else {
        this.isMuted = true;
        this.fadeTo(0, 700);
        this.updateStatus("Sound: Off");
      }
    }

    setVolume(value) {
      this.userVolume = Math.min(1, Math.max(0, value));
      if (!this.audio || this.isMuted) {
        return;
      }
      this.audio.volume = this.userVolume;
      this.updateStatus(`Sound: On · ${Math.round(this.userVolume * 100)}%`);
    }

    fadeTo(targetVolume, duration = 600) {
      if (!this.audio) {
        return;
      }

      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      const start = this.audio.volume;
      const diff = targetVolume - start;
      const tickCount = Math.max(1, Math.floor(duration / 60));
      let tick = 0;

      this.fadeInterval = window.setInterval(() => {
        tick += 1;
        const next = start + (diff * tick) / tickCount;
        this.audio.volume = Math.min(1, Math.max(0, next));

        if (tick >= tickCount) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          this.audio.volume = targetVolume;
          if (targetVolume === 0) {
            this.audio.pause();
          }
        }
      }, 60);
    }

    currentTrackTitle() {
      return this.tracks[this.currentTrackIndex]?.title || "Archive soundtrack";
    }

    updateStatus(message) {
      if (this.toggleButton) {
        this.toggleButton.textContent = message;
        this.toggleButton.setAttribute("aria-pressed", String(!this.isMuted));
      }
      if (this.statusTarget) {
        this.statusTarget.textContent = message;
      }
    }
  }

  window.MemoryFlixSoundtrackController = SoundtrackController;
})();
