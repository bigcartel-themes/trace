"use strict";

document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.remove("preloader");

  const pageType = document.body.getAttribute('data-bc-page-type');

  // Handle specific page types
  switch(pageType) {
    case 'home':
      const welcomeButton = document.querySelector(".welcome-button");
      if (welcomeButton) {
        welcomeButton.addEventListener("click", function (event) {
          if (themeOptions.welcomeButtonBehavior === "scroll") {
            event.preventDefault();
            const targetElement = document.querySelector(".home-featured-categories") ?? 
                                document.querySelector(".home-featured-products");
            if (targetElement) {
              smoothScroll(targetElement, 1000);
            }
          } else if (themeOptions.welcomeButtonBehavior === "navigate") {
            if (isExternalLink(event.target.href)) {
              event.preventDefault();
              event.stopPropagation();
              window.open(event.target.href, '_blank', 'noopener,noreferrer');
            }
            // Let internal links use template's href naturally
          }
        });
      }

      // Handle separate image link functionality
      const heroImageLink = themeOptions.heroImageLink && themeOptions.heroImageLink.trim() !== '' ? themeOptions.heroImageLink : null;
      
      // Only make hero elements clickable if welcome button is not shown and heroImageLink is configured
      if (!welcomeButton && heroImageLink) {
        // Handle slideshow clicks
        const slideshow = document.querySelector(".home-slideshow");
        if (slideshow) {
          const slides = slideshow.querySelectorAll('.splide__slide');
          // Add styling and accessibility attributes to individual slides
          slides.forEach(slide => {
            slide.classList.add("hero-clickable");
            slide.setAttribute("role", "button");
            slide.setAttribute("aria-label", "Navigate to " + heroImageLink);
          });
          
          // Use event delegation with a single listener on the slideshow container
          slideshow.addEventListener("click", function(event) {
            // Don't interfere with splide controls - only handle clicks on slide content
            if (!event.target.closest('.splide__arrow, .splide__pagination')) {
              const clickedSlide = event.target.closest('.splide__slide');
              if (clickedSlide) {
                event.preventDefault();
                event.stopPropagation();
                
                if (isExternalLink(heroImageLink)) {
                  window.open(heroImageLink, '_blank', 'noopener,noreferrer');
                } else {
                  window.location.href = heroImageLink;
                }
              }
            }
          });
        }
        
        // Handle welcome image clicks
        const welcomeImage = document.querySelector(".welcome-image");
        if (welcomeImage) {
          welcomeImage.classList.add("hero-clickable");
          welcomeImage.setAttribute("role", "button");
          welcomeImage.setAttribute("aria-label", "Navigate to " + heroImageLink);
          welcomeImage.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (isExternalLink(heroImageLink)) {
              window.open(heroImageLink, '_blank', 'noopener,noreferrer');
            } else {
              window.location.href = heroImageLink;
            }
          });
        }
      }

      const featuredCategoriesContainerSelector = '.home-featured-categories';
      const featuredCategoriesContainer = document.querySelector(featuredCategoriesContainerSelector);
      const categoryCollagesEnabled = featuredCategoriesContainer?.dataset.categoryCollagesEnabled === 'true';

      if (categoryCollagesEnabled) {
        setupCategoryCollages({ 
          collage: { 
            width: 760, 
            height: 760 
          } 
        });
      }
      
      break;
    case 'contact':
      let contactFields = document.querySelectorAll(".contact-form input, .contact-form textarea");
      contactFields.forEach(function (contactField) {
        contactField.removeAttribute("tabindex");
      });
      break;
  }

  const numShades = 5;

  let cssProperties = [];

  for (const themeColor in themeColors) {
    const hexValue = themeColors[themeColor];
    var hsl = tinycolor(hexValue).toHsl();
    for (var i = numShades - 1; i >= 0; i -= 1) {
      hsl.l = (i + 0.5) / numShades;
      cssProperties.push(`--${camelCaseToDash(themeColor)}-${((i * 100) / 1000) * 200}: ${tinycolor(hsl).toRgbString()};`);
    }
    numColor = tinycolor(hexValue).toRgb();
    cssProperties.push(`--${camelCaseToDash(themeColor)}-rgb: ${numColor["r"]}, ${numColor["g"]}, ${numColor["b"]};`);
  }

  const headTag = document.getElementsByTagName("head")[0];
  const styleTag = document.createElement("style");

  styleTag.innerHTML = `
    :root {
      ${cssProperties.join("\n")}
    }
  `;
  headTag.appendChild(styleTag);

  
});

window.addEventListener("load", () => {
  document.body.classList.remove("transition-preloader");
});

// Hybrid announcement pause: hover on desktop, tap-to-toggle on mobile, focus for keyboard
document.addEventListener('DOMContentLoaded', () => {
  const announcement = document.querySelector('.announcement-message--scrolling');

  if (!announcement) return;

  const scrollContent = announcement.querySelector('.announcement-message__scroll-content');
  const firstText = announcement.querySelector('.announcement-message__text');

  // Calculate exact scroll distance for seamless looping
  function updateScrollDistance() {
    if (scrollContent && firstText) {
      // Get the width of one text block including its spacing
      const textWidth = firstText.offsetWidth;

      // Set CSS variable with exact pixel distance to scroll
      // This ensures perfectly seamless looping regardless of content length
      scrollContent.style.setProperty('--scroll-distance', `-${textWidth}px`);
    }
  }

  // Initial calculation
  updateScrollDistance();

  // Recalculate on resize (debounced to avoid performance issues)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateScrollDistance, 150);
  });

  // Add tap-to-toggle for all devices (primarily for touch devices)
  // Desktop users can still use hover (handled by CSS), but click also works as backup
  let isPaused = false;

  announcement.addEventListener('click', (e) => {
    // Don't toggle if user clicked a link - let the link work normally
    if (e.target.closest('a')) return;

    // Toggle pause state
    isPaused = !isPaused;
    announcement.classList.toggle('is-paused', isPaused);
  });
});
