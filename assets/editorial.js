document.getElementById('yr') && (document.getElementById('yr').textContent = new Date().getFullYear());

var burger = document.getElementById('burger'), nav = document.getElementById('navlinks');
if (burger && nav) {
  burger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
  });
}

var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
} else {
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.08});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
}

var lb = document.getElementById('lb'), lbimg = document.getElementById('lbimg');
if (lb && lbimg) {
  document.querySelectorAll('.cert').forEach(function(c){
    c.addEventListener('click', function(){ lbimg.src = c.dataset.full; lb.classList.add('open'); });
  });
  var closeLb = function(){ lb.classList.remove('open'); };
  var x = document.getElementById('lbx'); if (x) x.addEventListener('click', closeLb);
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLb(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLb(); });
}
