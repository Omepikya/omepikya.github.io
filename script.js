document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{const el=document.querySelector(link.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
document.querySelectorAll('.feature,.steps article,.download-inner,.security-art').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(18px)';el.style.transition='opacity .6s ease, transform .6s ease';observer.observe(el)});
const style=document.createElement('style');style.textContent='.visible{opacity:1!important;transform:translateY(0)!important}';document.head.appendChild(style);
