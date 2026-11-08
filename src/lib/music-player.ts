const STORAGE_KEY = 'erika-music-session-v1';
type MusicState = { paused: boolean; volume: number; time: number };

export function initMusicPlayer(root: HTMLElement, browser: Window = window) {
  const audio = root.querySelector<HTMLAudioElement>('audio');
  const controls = root.querySelector<HTMLElement>('[data-music-controls]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-music-toggle]');
  const label = root.querySelector<HTMLElement>('[data-music-label]');
  const volume = root.querySelector<HTMLInputElement>('[data-music-volume]');
  const status = root.querySelector<HTMLElement>('[data-music-status]');
  if (!audio || !controls || !toggle || !label || !volume || !status) return;

  let navigating = false;
  let pending = false;
  let saved: MusicState | null = null;
  try {
    const value = JSON.parse(browser.sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (value && typeof value.paused === 'boolean' && Number.isFinite(value.volume) && value.volume >= 0 && value.volume <= 1 && Number.isFinite(value.time) && value.time >= 0) saved = value;
  } catch { /* The player also works when session storage is disabled. */ }

  const initialVolume = Number(root.dataset.initialVolume);
  audio.volume = saved?.volume ?? (Number.isFinite(initialVolume) ? Math.max(0, Math.min(1, initialVolume)) : 0.15);
  volume.value = String(Math.round(audio.volume * 100));
  const restoreTime = saved?.time ?? 0;
  const restorePosition = () => {
    if (restoreTime > 0 && Number.isFinite(audio.duration) && audio.duration > 0) {
      try { audio.currentTime = restoreTime % audio.duration; } catch { /* Seeking may not yet be available. */ }
    }
  };
  if (audio.readyState >= 1) restorePosition();
  else audio.addEventListener('loadedmetadata', restorePosition, { once: true });

  const save = () => {
    if (navigating) return;
    try {
      browser.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ paused: audio.paused, volume: audio.volume, time: Number.isFinite(audio.currentTime) ? audio.currentTime : 0 }));
    } catch { /* Unavailable storage must not block playback or pause. */ }
  };
  const sync = () => {
    label.textContent = audio.paused ? 'Riproduci musica' : 'Pausa musica';
    toggle.setAttribute('aria-pressed', String(!audio.paused));
  };
  const start = async () => {
    if (pending) return;
    pending = true;
    toggle.disabled = true;
    try {
      await audio.play();
      status.textContent = 'Musica attiva. Puoi metterla in pausa in ogni momento.';
    } catch (error) {
      const denied = error instanceof Error && error.name === 'NotAllowedError';
      status.textContent = denied ? 'Premi Riproduci musica per ascoltare.' : 'Audio non disponibile. Puoi riprovare con Riproduci musica.';
    } finally {
      pending = false;
      toggle.disabled = false;
      sync();
    }
  };

  toggle.addEventListener('click', () => {
    if (audio.paused) void start();
    else audio.pause();
  });
  volume.addEventListener('input', () => {
    audio.volume = Math.max(0, Math.min(1, Number(volume.value) / 100));
    save();
  });
  audio.addEventListener('play', () => { sync(); save(); });
  audio.addEventListener('pause', () => {
    sync();
    if (!navigating) { status.textContent = 'Musica in pausa.'; save(); }
  });
  audio.addEventListener('volumechange', () => { volume.value = String(Math.round(audio.volume * 100)); save(); });
  audio.addEventListener('error', () => {
    status.textContent = 'Audio non disponibile. Puoi continuare a navigare nel sito.';
    sync();
  });
  browser.addEventListener('pagehide', () => {
    save();
    navigating = true;
    audio.pause();
  });
  browser.addEventListener('pageshow', event => {
    if (!(event as PageTransitionEvent).persisted) return;
    navigating = false;
    // Respect the latest pause choice, including when returning from another page.
    try {
      const latest = JSON.parse(browser.sessionStorage.getItem(STORAGE_KEY) || 'null');
      if (latest?.paused === false) void start();
      else { status.textContent = 'Musica in pausa.'; sync(); }
    } catch { status.textContent = 'Musica in pausa.'; sync(); }
  });

  audio.controls = false;
  controls.hidden = false;
  sync();
  if (saved?.paused === true) status.textContent = 'Musica in pausa.';
  else void start(); // Browsers may deny this; only the music button retries it.
}
