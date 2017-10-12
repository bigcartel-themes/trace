function init() {
  window.addEventListener('scroll', function(e){
    var distanceY = window.pageYOffset || document.documentElement.scrollTop,
      shrinkOn = 30,
      elements = $('header, .close-container');
    if (distanceY > shrinkOn) {
      elements.addClass('smaller');
    } else {
      if (elements.hasClass('smaller')) {
        elements.removeClass('smaller');
      }
    }
  });
}
window.onload = init();

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
      $('.cart-empty-message, .cart-header').fadeIn('fast', function() { 
        $('.site-footer').fadeOut('fast');
      });
      
      $('.cart-num-items').html('0');
      $("html, body").animate({ scrollTop: 0 }, "fast");
    });
  }
  else {
    $('.errors').hide(); 
    if ($('.cart-shipping-amount').length) { 
      if (cart.shipping.pending) {
        if (cart.country) { 
          var shipping_amount = 'Shipping: <span class="small-message">Select another country</span>';
        }
        else { 
          var shipping_amount = 'Shipping: <span class="small-message">Select country</span>';
        }
      }
      else { 
        var shipping_amount = 'Shipping: <span>'+Format.money(cart.shipping && cart.shipping.amount ? cart.shipping.amount : 0, true, true)+'</span>';
      }
      $('.cart-shipping-amount').html(shipping_amount);
    }
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
  $('.category-nav').hover(function(e) {
    $(this).toggleClass('dropdown-open');
  });

  $('.open-menu').click(function(e) {
    $('body').addClass('overlay-open');
    $('.overlay').addClass('open').addClass('navigation');
    return false;
  });
  
  $('.close-overlay, .overlay a').click(function(e) {
    $('body').removeClass('overlay-open');
    $('.overlay').removeClass('open').removeClass('navigation');
  });
  
  $('.carousel-main').flickity({
    cellAlign: 'center',
    contain: true,
    prevNextButtons: false,
    setGallerySize: false,
    pageDots: false
  });
  
  $('.carousel-nav').flickity({
    asNavFor: '.carousel-main',
    contain: true,
    pageDots: false,
    prevNextButtons: false
  });
  
  $('.add-single-option').click(function(e) { 
    e.preventDefault();
    $('.add-to-bag').trigger('click');
  });
  
  $('.open-options').click(function(e) {
    e.preventDefault();
    $('body').addClass('overlay-open');
    $('.footer-options').addClass('open')
  });
  
  $('.close-options-list').click(function() { 
    $('.footer-options').removeClass('open');
    $('body').removeClass('overlay-open');
  });
  
  $('.product-options-list li').click(function() { 
    var option_id = $(this).data("option-id");
    if (option_id > 0) { 
      $('.footer-option-id').val(option_id);
      $('.footer-option-form').submit();
    }
  });
  
  $('.add-single-option').click(function(e) { 
    e.preventDefault();
    var option_id = $(this).data("option-id");
    if (option_id > 0) { 
      $('.footer-option-id').val(option_id);
      $('.footer-option-form').submit();
    }
  });
  
  $('.apply-discount').click(function(e) {
    e.preventDefault();
    $(this).closest('.checkout-btn').attr('name','update');
    $('.cart-form').submit();
  });
  
  $('[name="cart[shipping_country_id]"]').on('change',function() {
    $('.cart-form').submit();
  });
  
  $('[name="cart[discount_code]"]').on('keyup',function(e) { 
    if (e.keyCode == 13) {
      e.preventDefault(); 
      $(this).closest('.checkout-btn').attr('name','update');
      $('.cart-form').submit();
    }
  });
  
  $('.cancel-discount').click(function(e) {
    e.preventDefault(); 
    $('.cart-form').append('<input name="cart[discount_code]" type="hidden" value="">');
    $('.cart-form').submit();
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
$(document).on('keyup',function(e) {
  if (e.keyCode == 27) {
    $('body').removeClass('overlay-open');
    $('.overlay').removeClass('open').removeClass('navigation');
    $('.footer-options').removeClass('open');
  }
});