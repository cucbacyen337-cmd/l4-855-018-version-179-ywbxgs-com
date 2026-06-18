
(function(){
function qsa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
var menuBtn=document.querySelector('[data-menu-button]');
var mobile=document.querySelector('[data-mobile-menu]');
if(menuBtn&&mobile){menuBtn.addEventListener('click',function(){mobile.classList.toggle('open')})}
var slides=qsa('.hero-slide'),dots=qsa('.hero-dots button'),pos=0,timer=null;
function show(i){if(!slides.length)return;pos=(i+slides.length)%slides.length;slides.forEach(function(s,n){s.classList.toggle('active',n===pos)});dots.forEach(function(d,n){d.classList.toggle('active',n===pos)})}
if(slides.length){dots.forEach(function(d,n){d.addEventListener('click',function(){show(n);restart()})});function restart(){clearInterval(timer);timer=setInterval(function(){show(pos+1)},5200)}restart()}
function norm(s){return (s||'').toString().toLowerCase()}
qsa('[data-filter-scope]').forEach(function(scope){
 var input=scope.querySelector('[data-filter-input]');
 var region=scope.querySelector('[data-filter-region]');
 var year=scope.querySelector('[data-filter-year]');
 var sort=scope.querySelector('[data-sort-select]');
 var grid=scope.querySelector('.movie-grid');
 var empty=scope.querySelector('.empty-state');
 var cards=qsa('.movie-card',scope);
 var params=new URLSearchParams(location.search);
 var qp=params.get('q');
 if(qp&&input){input.value=qp}
 function apply(){
  var q=norm(input&&input.value);
  var rv=region&&region.value;
  var yv=year&&year.value;
  var shown=0;
  cards.forEach(function(card){
   var ok=true;
   if(q){ok=norm(card.getAttribute('data-text')||card.textContent).indexOf(q)>-1}
   if(ok&&rv){ok=card.getAttribute('data-region')===rv}
   if(ok&&yv){ok=card.getAttribute('data-year')===yv}
   card.style.display=ok?'':'none';
   if(ok)shown++;
  });
  if(empty){empty.style.display=shown?'none':'block'}
 }
 function sortCards(){
  if(!grid||!sort)return;
  var val=sort.value;
  var sorted=cards.slice().sort(function(a,b){
   if(val==='year-desc')return (+b.getAttribute('data-year')||0)-(+a.getAttribute('data-year')||0);
   if(val==='year-asc')return (+a.getAttribute('data-year')||0)-(+b.getAttribute('data-year')||0);
   return (+a.getAttribute('data-index')||0)-(+b.getAttribute('data-index')||0);
  });
  sorted.forEach(function(c){grid.appendChild(c)});
  cards=sorted;
  apply();
 }
 [input,region,year].forEach(function(el){if(el){el.addEventListener(el.tagName==='INPUT'?'input':'change',apply)}});
 if(sort){sort.addEventListener('change',sortCards)}
 apply();
});
})();
