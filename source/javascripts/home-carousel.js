const homeSlideshowContainer = document.querySelector('.splide.home-slideshow');
if (homeSlideshowContainer) {
  function initSplide() {
    var splide = new Splide( '.splide.home-slideshow', {
      arrows: true,
      pagination: true,
      type: themeOptions.homepageSlideshowTransition,
      autoplay: themeOptions.homepageSlideshowAutoplay,
      interval: themeOptions.homepageSlideshowSpeed,
      speed: 1500,
      rewind: true,
      keyboard: true
    } );
    splide.mount();

    // Manual click event handling for slides
    const slides = document.querySelectorAll('.splide.home-slideshow .splide__slide');
    slides.forEach(function(slide) {
      slide.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent any default behavior (like lightbox)
        window.open('https://google.com', '_blank');
      });
      slide.style.cursor = 'pointer'; // Add pointer cursor
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplide);
  } else {
    initSplide();
  }
}