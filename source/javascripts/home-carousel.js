const homeSlideshowContainer = document.querySelector('.splide.home-slideshow');
if (homeSlideshowContainer) {
  function initSplide() {
    var splide = new Splide( '.splide.home-slideshow', {
      arrows: true,
      pagination: true,
      type: 'slide',
      autoplay: themeOptions.homepageSlideshowAutoplay,
      interval: themeOptions.homepageSlideshowSpeed,
      speed: 1500,
      rewind: true,
      keyboard: true
    } );
    splide.mount();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplide);
  } else {
    initSplide();
  }
}