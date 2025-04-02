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
          }
        });
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