// MidnightCraft — shared UI behavior
document.addEventListener('DOMContentLoaded', function () {

  // mobile nav drawer
    var menuBtn = document.querySelector('.menu-btn');
      var drawer = document.querySelector('.mobile-drawer');
        if (menuBtn && drawer) {
            menuBtn.addEventListener('click', function () { drawer.classList.add('open'); });
                var closeBtn = drawer.querySelector('.close-btn');
                    if (closeBtn) closeBtn.addEventListener('click', function () { drawer.classList.remove('open'); });
                        drawer.querySelectorAll('a').forEach(function (a) {
                              a.addEventListener('click', function () { drawer.classList.remove('open'); });
                                  });
                                    }

                                      // accordion (product page)
                                        document.querySelectorAll('.acc-item .accrow').forEach(function (row) {
                                            row.addEventListener('click', function () {
                                                  var item = row.closest('.acc-item');
                                                        var wasOpen = item.classList.contains('open');
                                                              item.parentElement.querySelectorAll('.acc-item').forEach(function (i) { i.classList.remove('open'); });
                                                                    if (!wasOpen) item.classList.add('open');
                                                                        });
                                                                          });

                                                                            // filter chips (visual only — swaps active state)
                                                                              document.querySelectorAll('.chip-group').forEach(function (group) {
                                                                                  group.querySelectorAll('.chip').forEach(function (chip) {
                                                                                        chip.addEventListener('click', function () {
                                                                                                group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
                                                                                                        chip.classList.add('active');
                                                                                                              });
                                                                                                                  });
                                                                                                                    });
                                                                                                                    
                                                                                                                      // size selector (product page)
                                                                                                                        document.querySelectorAll('.size-group').forEach(function (group) {
                                                                                                                            group.querySelectorAll('.size').forEach(function (s) {
                                                                                                                                  s.addEventListener('click', function () {
                                                                                                                                          group.querySelectorAll('.size').forEach(function (o) { o.classList.remove('active'); });
                                                                                                                                                  s.classList.add('active');
                                                                                                                                                        });
                                                                                                                                                            });
                                                                                                                                                              });
                                                                                                                                                              
                                                                                                                                                                // qty stepper
                                                                                                                                                                  document.querySelectorAll('.stepper').forEach(function (stepper) {
                                                                                                                                                                      var span = stepper.querySelector('span');
                                                                                                                                                                          var minus = stepper.querySelector('.minus');
                                                                                                                                                                              var plus = stepper.querySelector('.plus');
                                                                                                                                                                                  if (!span || !minus || !plus) return;
                                                                                                                                                                                      minus.addEventListener('click', function () {
                                                                                                                                                                                            var v = parseInt(span.textContent, 10);
                                                                                                                                                                                                  if (v > 1) span.textContent = v - 1;
                                                                                                                                                                                                      });
                                                                                                                                                                                                          plus.addEventListener('click', function () {
                                                                                                                                                                                                                var v = parseInt(span.textContent, 10);
                                                                                                                                                                                                                      if (v < 10) span.textContent = v + 1;
                                                                                                                                                                                                                          });
                                                                                                                                                                                                                            });
                                                                                                                                                                                                                            
                                                                                                                                                                                                                              // gallery thumbnail swap (product page)
                                                                                                                                                                                                                                document.querySelectorAll('.thumbcol .t').forEach(function (thumb) {
                                                                                                                                                                                                                                    thumb.addEventListener('click', function () {
                                                                                                                                                                                                                                          var group = thumb.closest('.product-gallery');
                                                                                                                                                                                                                                                var main = group.querySelector('.mainimg img');
                                                                                                                                                                                                                                                      group.querySelectorAll('.thumbcol .t').forEach(function (t) { t.classList.remove('active'); });
                                                                                                                                                                                                                                                            thumb.classList.add('active');
                                                                                                                                                                                                                                                                  main.src = thumb.querySelector('img').src;
                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                        
