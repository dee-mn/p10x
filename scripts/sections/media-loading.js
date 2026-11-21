/* Offscreen films keep their original assets and begin loading before the visitor reaches them. */
(() => {
  const videos = [...document.querySelectorAll('video[data-deferred-video]')];
  if (!videos.length) return;
  function load(video) {
    if (video.dataset.mediaLoaded) return;
    video.dataset.mediaLoaded = 'true';
    if (video.dataset.src) {
      video.src = video.dataset.src;
      delete video.dataset.src;
    }
    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.dataset.src;
      delete source.dataset.src;
    });
    video.muted = true;
    video.load();
    if (video.autoplay) video.play().catch(() => {});
  }
  function prepareAll() {
    videos.forEach(load);
  }
  if (!window.IntersectionObserver) {
    prepareAll();
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          load(entry.target);
          observer.unobserve(entry.target);
        }
      }),
    { rootMargin: '360px 0px', threshold: 0 }
  );
  videos.forEach((video) => observer.observe(video));
})();
