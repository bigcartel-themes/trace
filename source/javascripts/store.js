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


API.onError = function(errors) {
  var $errorList = $('<ul>', { class: 'errors'} )
    , $cartError = $('.cart-form')
    , $productError = $('.product-form');
  $.each(errors, function(index, error) {
    $errorList.append($('<li>').html(error));
  });
  if ($cartError.length > 0) {
    $cartError.find('.errors').remove();
    $cartError.prepend($errorList);
    $("html, body").animate({ scrollTop: 0 }, "fast");
  } else if ($productError.length > 0) {
    $productError.find('.errors').hide();
    $productError.prepend($errorList);
  }
}

var processUpdate = function(input, item_id, new_val, cart) {
  var sub_total = Format.money(cart.total, true, true);
  var item_count = cart.item_count;
  if (item_count == 0) {
    var empty_title = $('.cart-header').data('empty-text');
    $('.cart-header').html(empty_title);
    $('.cart-form').slideUp('fast',function() {
      $('.cart-empty-message, .cart-header').fadeIn('fast');
      $('.cart-num-items').html('0');
      $("html, body").animate({ scrollTop: 0 }, "fast");
    });
  }
  else {
    $('.errors').hide();
    $('.cart-totals h3 > span').html(sub_total);
    $('.cart-num-items').html(item_count);
    input.val(new_val);
  }
  if (new_val == 0) {
    $('.cart-item[data-cart-id="'+item_id+'"]').slideUp('fast');
  }
  return false;
}

var updateCart = function(cart) {
  var item_count = cart.item_count;
  $('.cart-num-items').html(item_count);
}

$(window).on("load resize", function() {
  var window_width = $(window).width();
  if (window_width < 669) {
    var flickity_width = $('.carousel-main').width() * 125 / 100;
    $('.carousel-main').css('height',flickity_width+'px')
  }
  else {
    $('.carousel-main').css('height','100%');
  }
});

$(function() {
  $('.category-nav-heading').click(function(e) {
    $(this).parent().toggleClass('dropdown-open');
  });

  $('.qty').click(function() {
    var $t = $(this)
    , input = $(this).parent().find('input')
    , val = parseInt(input.val())
    , valMin = 1
    , item_id = $(this).parent().data("cart-id");
    if (isNaN(val) || val < valMin) {
      var new_val = valMin;
    }
    if ($t.data('func') == 'plus') {
      var new_val = val + 1;
    }
    else {
      if (val > valMin) {
        var new_val = val - 1;
      }
    }
    if (new_val > 0) {
      Cart.updateItem(item_id, new_val, function(cart) {
        processUpdate(input, item_id, new_val, cart);
      });
    }
    else {
      Cart.removeItem(item_id, function(cart) {
        processUpdate(input, item_id, 0, cart);
      });
    }
  });

  $('.item-quantity-holder input').blur(function(e) {
    var item_id = $(this).parent().data("cart-id");
    var new_val = $(this).val();
    var input = $(this);
    if (!isNaN(new_val)) {
      Cart.updateItem(item_id, new_val, function(cart) {
        processUpdate(input, item_id, new_val, cart);
      });
    }
  });

  $('.item-quantity-holder input').on('keyup',function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      var item_id = $(this).parent().data("cart-id");
      var new_val = $(this).val();
      var input = $(this);
      if (!isNaN(new_val)) {
        Cart.updateItem(item_id, new_val, function(cart) {
          processUpdate(input, item_id, new_val, cart);
        });
      }
      $(this).blur();
    }
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