const homeSlideshowContainer = document.querySelector('.splide.home-slideshow');
if (homeSlideshowContainer) {
  document.addEventListener( 'DOMContentLoaded', function() {
    var splide = new Splide( '.splide.home-slideshow', {
      arrows: false,
      type: 'slide',
      autoplay: themeOptions.homepageSlideshowAutoplay,
      interval: themeOptions.homepageSlideshowSpeed,
      speed: 1500,
      rewind: true,
      keyboard: true,
      pagination: false,
    } );
    splide.mount();
  });
}