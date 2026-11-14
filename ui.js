// Ícones consistentes nos menus, sem emojis, e tratamento de erros visível.
(function(){
 const icons={
 dashboard:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 orders:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
 production:'<path d="M4 20h16M6 17h12l-1-9H7zM9 8V5a3 3 0 0 1 6 0v3"/>',
 products:'<path d="M3 10h18l-2 10H5zM3 10l3-6h12l3 6M8 10V7m8 3V7"/>',
 recipes:'<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>',
 stock:'<path d="M3 7h18v14H3zM3 7l9-4 9 4M12 11v10M7 11h.01M17 11h.01"/>',
 finance:'<path d="M12 2v20M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6"/>',
 customers:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v1"/>',
 reports:'<path d="M4 20V10m6 10V4m6 16v-7m6 7H2"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="m19 15 2 1-2 3-2-1-2 1v2h-4v-2l-2-1-2 1-2-3 2-1v-2l-2-1 2-3 2 1 2-1V7h4v2l2 1 2-1 2 3-2 1z"/>'
 };
 function polish(){
  document.querySelectorAll('#nav button[data-page]').forEach(b=>{
   if(b.dataset.polished)return;
   const label=b.querySelector('span')?.textContent||b.textContent.trim();
   b.innerHTML='<span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(icons[b.dataset.page]||'')+'</svg></span><span>'+label+'</span>';
   b.dataset.polished='1';
  });
  const logo=document.querySelector('.brand .logo');if(logo)logo.textContent='IC';
  const note=document.querySelector('.side-note');if(note)note.textContent='Gestão simples para uma confeitaria organizada.';
 }
 polish();
 document.addEventListener('DOMContentLoaded',polish);
 // Não remove #syncStatus: o módulo Firebase ainda atualiza esse elemento.
 const sync=document.getElementById('syncStatus');if(sync)sync.style.display='none';
 window.addEventListener('error',e=>{console.error(e.error||e.message)});
 window.addEventListener('unhandledrejection',e=>{console.error(e.reason)});
})();
