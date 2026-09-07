// MidnightCraft — cart (localStorage based, front-end only)
// NOTE: this simulates a working cart/checkout flow for the design.
// A real payment charge still needs a processor (e.g. Stripe, Cardcom, Tranzila)
// connected at the "Place order" step in checkout.html.

var MC_CART_KEY = 'mc_cart_v1';

function mcGetCart() {
    try {
          return JSON.parse(localStorage.getItem(MC_CART_KEY)) || [];
    } catch (e) {
          return [];
    }
}

function mcSaveCart(cart) {
    localStorage.setItem(MC_CART_KEY, JSON.stringify(cart));
    mcUpdateBadges();
}

function mcAddToCart(item) {
    var cart = mcGetCart();
    var existing = cart.find(function (i) { return i.id === item.id && i.size === item.size; });
    if (existing) {
          existing.qty += item.qty;
    } else {
          cart.push(item);
    }
    mcSaveCart(cart);
    mcToast(item.name + ' added to cart');
}

function mcRemoveFromCart(id, size) {
    var cart = mcGetCart().filter(function (i) { return !(i.id === id && i.size === size); });
    mcSaveCart(cart);
    mcRenderCartPage();
}

function mcSetQty(id, size, qty) {
    var cart = mcGetCart();
    var item = cart.find(function (i) { return i.id === id && i.size === size; });
    if (item) {
          item.qty = Math.max(1, qty);
          mcSaveCart(cart);
          mcRenderCartPage();
    }
}

function mcCartCount() {
    return mcGetCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
}

function mcCartTotal() {
    return mcGetCart().reduce(function (sum, i) { return sum + i.qty * i.price; }, 0);
}

function mcUpdateBadges() {
    var count = mcCartCount();
    document.querySelectorAll('.cart-badge').forEach(function (b) {
          b.textContent = count;
          b.hidden = count === 0;
    });
}

function mcToast(msg) {
    var toast = document.querySelector('.toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._mcToastTimer);
    window._mcToastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
}

function mcFormatPrice(n) {
    return '₪' + n.toFixed(0);
}

function mcRenderCartPage() {
    var container = document.getElementById('cart-items');
    if (!container) return;
    var cart = mcGetCart();
    var emptyState = document.getElementById('cart-empty');
    var summary = document.getElementById('cart-summary');

  if (cart.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (summary) summary.style.display = 'none';
        return;
  }
    if (emptyState) emptyState.style.display = 'none';
    if (summary) summary.style.display = 'block';

  container.innerHTML = cart.map(function (item) {
        return '' +
                '<div class="cart-row" style="display:flex;gap:20px;align-items:center;padding:24px 0;border-bottom:1px solid var(--line);">' +
                  '<div style="width:96px;height:120px;border-radius:2px;overflow:hidden;background:#0c0b0b;flex-shrink:0;"><img src="' + item.image + '" style="width:100%;height:100%;object-fit:cover;"></div>' +
                  '<div style="flex:1;">' +
                    '<div style="font-family:\'Bebas Neue\';font-size:19px;letter-spacing:0.02em;">' + item.name + '</div>' +
                    '<div style="font-size:12px;opacity:0.55;margin-top:4px;">Size ' + item.size + '</div>' +
                    '<div style="margin-top:14px;display:flex;align-items:center;gap:16px;">' +
                      '<div class="stepper" style="height:40px;">' +
                        '<button onclick="mcSetQty(\'' + item.id + '\',\'' + item.size + '\',' + (item.qty - 1) + ')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h16"/></svg></button>' +
                        '<span>' + item.qty + '</span>' +
                        '<button onclick="mcSetQty(\'' + item.id + '\',\'' + item.size + '\',' + (item.qty + 1) + ')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v16M4 12h16"/></svg></button>' +
                      '</div>' +
                      '<button onclick="mcRemoveFromCart(\'' + item.id + '\',\'' + item.size + '\')" style="background:none;border:none;cursor:pointer;font-size:12px;text-decoration:underline;opacity:0.6;">Remove</button>' +
                    '</div>' +
                  '</div>' +
                  '<div style="font-family:\'Bebas Neue\';font-size:18px;">' + mcFormatPrice(item.qty * item.price) + '</div>' +
                '</div>';
  }).join('');

  var subtotal = mcCartTotal();
    var subtotalEl = document.getElementById('cart-subtotal');
    var totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = mcFormatPrice(subtotal);
    if (totalEl) totalEl.textContent = mcFormatPrice(subtotal);
}

function mcRenderCheckoutSummary() {
    var container = document.getElementById('checkout-items');
    if (!container) return;
    var cart = mcGetCart();
    container.innerHTML = cart.map(function (item) {
          return '' +
                  '<div style="display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);font-size:14px;">' +
                    '<span style="opacity:0.75;">' + item.name + ' (' + item.size + ') × ' + item.qty + '</span>' +
                    '<span>' + mcFormatPrice(item.qty * item.price) + '</span>' +
                  '</div>';
    }).join('');
    var subtotal = mcCartTotal();
    var shipping = cart.length ? 25 : 0;
    var subtotalEl = document.getElementById('checkout-subtotal');
    var shippingEl = document.getElementById('checkout-shipping');
    var totalEl = document.getElementById('checkout-total');
    if (subtotalEl) subtotalEl.textContent = mcFormatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = mcFormatPrice(shipping);
    if (totalEl) totalEl.textContent = mcFormatPrice(subtotal + shipping);
}

document.addEventListener('DOMContentLoaded', function () {
    mcUpdateBadges();
    mcRenderCartPage();
    mcRenderCheckoutSummary();

                            // wire product-page "add to cart"
                            document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
                                  btn.addEventListener('click', function () {
                                          var size = document.querySelector('.size-group .size.active');
                                          var qtyEl = document.querySelector('.stepper span');
                                          mcAddToCart({
                                                    id: btn.dataset.id,
                                                    name: btn.dataset.name,
                                                    price: parseFloat(btn.dataset.price),
                                                    image: btn.dataset.image,
                                                    size: size ? size.textContent.trim() : 'One Size',
                                                    qty: qtyEl ? parseInt(qtyEl.textContent, 10) : 1
                                          });
                                  });
                            });

                            // wire shop-grid quick "add to cart"
                            document.querySelectorAll('[data-quick-add]').forEach(function (btn) {
                                  btn.addEventListener('click', function (e) {
                                          e.preventDefault();
                                          mcAddToCart({
                                                    id: btn.dataset.id,
                                                    name: btn.dataset.name,
                                                    price: parseFloat(btn.dataset.price),
                                                    image: btn.dataset.image,
                                                    size: 'M',
                                                    qty: 1
                                          });
                                  });
                            });

                            // checkout form submit — simulated order placement (no real payment processor wired up)
                            var checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
          checkoutForm.addEventListener('submit', function (e) {
                  e.preventDefault();
                  if (mcGetCart().length === 0) return;
                  localStorage.removeItem(MC_CART_KEY);
                  mcUpdateBadges();
                  document.getElementById('checkout-view').style.display = 'none';
                  document.getElementById('checkout-confirm').style.display = 'block';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
          });
    }
});
