// PA Toast — shows a brief confirmation after add-to-cart

(function () {
  let toastEl = null;
  let hideTimer = null;

  function getToast() {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'pa-toast';
      document.body.appendChild(toastEl);
    }
    return toastEl;
  }

  function showToast(message) {
    const el = getToast();
    el.textContent = message;

    if (hideTimer) clearTimeout(hideTimer);

    // Force reflow so re-triggering animates from scratch
    el.classList.remove('pa-toast--visible');
    void el.offsetWidth;
    el.classList.add('pa-toast--visible');

    hideTimer = setTimeout(function () {
      el.classList.remove('pa-toast--visible');
    }, 3500);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof subscribe === 'undefined' || typeof PUB_SUB_EVENTS === 'undefined') return;

    subscribe(PUB_SUB_EVENTS.cartUpdate, function (event) {
      if (event.source !== 'product-form') return;

      const data = event.cartData;
      let title = '';
      let vendor = '';

      // /cart/add.js returns the line item; product_title is the product name
      if (data && data.product_title) {
        title = data.product_title;
        vendor = data.vendor || '';
      } else if (data && data.title) {
        title = data.title;
      }

      // Fallback: read from the product-form element's data attributes
      if (!title) {
        const form = document.querySelector('product-form');
        if (form) {
          title = form.dataset.productTitle || '';
          vendor = form.dataset.productVendor || '';
        }
      }

      const message = vendor
        ? title + ' by ' + vendor + ' was added to your basket'
        : title + ' was added to your basket';

      showToast(message);
    });
  });
})();
