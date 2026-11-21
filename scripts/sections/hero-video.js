(() => {
  const video = document.querySelector('video[data-hero-video]');
  if (!video) return;

  const button = video.parentElement.querySelector('.hero-video-play');
  const source = video.querySelector('source');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const poster = video.poster;

  function play() {
    video.muted = true;
    // A tap also opts in when reduced motion excluded the automatic source.
    if (!video.currentSrc && !video.hasAttribute('src')) video.src = source.src;
    video.play().catch(() => {
      button.hidden = !video.paused || Boolean(video.error);
    });
  }

  function syncPlayback() {
    if (motion.matches) {
      button.hidden = false;
    } else {
      play();
    }
  }

  video.addEventListener('playing', () => { button.hidden = true; });
  video.addEventListener('pause', () => { button.hidden = false; });
  video.addEventListener('error', () => {
    video.poster = poster;
    button.hidden = true;
  });
  button.addEventListener('click', play);
  motion.addEventListener('change', () => {
    video.autoplay = !motion.matches;
    video.pause();
    video.poster = poster;
    video.removeAttribute('src');
    video.load();
    syncPlayback();
  });

  syncPlayback();
})();
