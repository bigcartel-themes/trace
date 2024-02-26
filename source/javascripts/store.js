"use strict";

document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.remove("preloader");
  let contactFields = document.querySelectorAll(".contact-form input, .contact-form textarea");
  contactFields.forEach(function (contactField) {
    contactField.removeAttribute("tabindex");
  });
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


$(function() {
  $('.category-nav-heading').click(function(e) {
    $(this).parent().toggleClass('dropdown-open');
  });
});

let menuElement = document.querySelector(".overlay");
let openMenuButton = document.querySelector(".open-menu");
let closeMenuButton = document.querySelector(".close-overlay");

let openMenu = function() {
  document.body.classList.add('overlay-open');
  menuElement.setAttribute("aria-expanded", "true")
  menuElement.classList.add('open');
  menuElement.classList.add('navigation');
  document.addEventListener("keydown", handleKeyDown, true);
  setTimeout(() => {
    closeMenuButton.focus();
  }, 100);
}
let closeMenu = function() {
  menuElement.setAttribute("aria-expanded", "false")
  menuElement.classList.remove('open');
  menuElement.classList.remove('navigation');

  document.removeEventListener("keydown", handleKeyDown, true);
  document.body.classList.remove('overlay-open');
  openMenuButton.focus();
}
let handleKeyDown = function(event) {
  if (event.key === "Escape") {
    closeMenu();
  }
}
closeMenuButton.addEventListener("click", (event) => {
  closeMenu();
})
openMenuButton.addEventListener("click", (event) => {
  openMenu();
})