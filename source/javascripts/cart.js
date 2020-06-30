$('body')
  .on( 'click','.qty-button', function(e) {
    e.preventDefault();
    var $t = $(this)
    , input = $(this).parent().find('input')
    , val = parseInt(input.val())
    , valMin = 1
    , item_id = $(this).data("item-id");
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
  })
  .on( 'click', '.cart-item-remove', function(e) {
    e.preventDefault();
    item_id = $(this).parent().data("item-id");
    new_val = 0;
    Cart.updateItem(item_id, new_val, function(cart) {
      processUpdate('', item_id, '', cart);
    });
  })
  .on('change','.option-quantity', function(e) {
    var item_id = $(this).parent().data("item-id");
    var new_val = $(this).val();
    var input = $(this);
    Cart.updateItem(item_id, new_val, function(cart) {
      processUpdate(input, item_id, new_val, cart);
    });
  })
  .on('keydown','.option-quantity', function(e) {
    if (e.keyCode == 13) {
      item_id = $(this).closest('.cart-item').data("item-id");
      new_val = $(this).val();
      input = $(this);
      Cart.updateItem(item_id, new_val, function(cart) {
        processUpdate(input, item_id, new_val, cart);
      });
      e.preventDefault();
      return false;
    }
  })


var processUpdate = function(input, item_id, new_val, cart) {
  var sub_total = strip_tags(Format.money(cart.total, true, true));
  var item_count = cart.item_count;

  $('.cart-subtotal-amount, .cart-num-items').fadeOut(100, function() {
    $('.cart-subtotal-amount').html(sub_total);
    $('.cart-num-items').html(item_count);
    $('.cart-subtotal-amount, .cart-num-items').fadeIn(500);
  });

  if (item_count == 0) {
    $('.cart-form').slideUp('fast',function() {
      empty_text = $('.cart-header').data('empty-text');
      $('.cart-header').html(empty_text).fadeIn('fast');
      $('.cart-container').addClass('empty-cart');
      $('html, body').animate({ scrollTop: 0 }, "fast");
    });
  }
  else {
    $('.errors').hide();
    if (input) {
      input.val(new_val);
    }
  }
  if (new_val > 0) {
    for (itemIndex = 0; itemIndex < cart.items.length; itemIndex++) {
      if (cart.items[itemIndex].id == item_id) {
        item_price = cart.items[itemIndex].price;
        formatted_item_price = strip_tags(Format.money(item_price, true, true));
        item_price_element = $('.cart-item[data-item-id="'+item_id+'"]').find('.item-details-price');
        item_price_element.fadeOut(100, function() {
          item_price_element.html(formatted_item_price);
          item_price_element.fadeIn(500);
        });
      }
    }
  }
  else {
    $('.cart-item[data-item-id="'+item_id+'"]').slideUp('fast');
  }
  return false;
}

function strip_tags(string) {
  new_string = string.replace(/<(.|\n)*?>/g, '');
  return new_string;
}
