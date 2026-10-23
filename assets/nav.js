
(async function(){
  const BASE = location.pathname.split('/').includes('pages') ? '../' : '';
  const sb=document.getElementById('sidebar');
  if(sb){
    const nav=await (await fetch(BASE+'assets/nav.json')).json();
    let h='<h1><a href="'+BASE+'index.html" style="text-decoration:none;color:inherit">인도 주재원 생활 가이드</a></h1><p class="site-sub">뉴델리·구르가온 자료집</p>';
    let cur=null; const here=location.pathname.split('/').pop();
    for(const it of nav){ if(it.part!==cur){h+='<div class="part">'+it.part+'</div>';cur=it.part;}
      h+='<a href="'+BASE+'pages/'+it.page+'" class="'+(it.page===here?'on':'')+'">'+it.title+'</a>'; }
    sb.innerHTML=h;
    const btn=document.createElement('button');btn.className='menu-btn';btn.textContent='☰ 차례';
    const setOpen=(o)=>{ sb.classList.toggle('open',o); sb.style.left = o ? '0px' : '-290px'; };
    btn.onclick=()=>setOpen(!sb.classList.contains('open'));
    sb.addEventListener('click',e=>{ if(e.target.tagName==='A') setOpen(false); });
    document.body.appendChild(btn);
  }
  const q=document.getElementById('q'), res=document.getElementById('results');
  if(q){
    const data=await (await fetch(window.SEARCH_URL)).json();
    const norm=s=>s.toLowerCase();
    q.addEventListener('input',()=>{
      const k=norm(q.value.trim());
      if(k.length<2){res.style.display='none';return;}
      const hits=[];
      for(const d of data){
        const i=norm(d.text).indexOf(k);
        if(i<0 && !norm(d.title).includes(k)) continue;
        const ctx = i<0? d.text.slice(0,90) : d.text.slice(Math.max(0,i-45), i+70);
        hits.push({t:d.title,u:d.url,p:d.part,c:ctx.replace(/\s+/g,' ')});
        if(hits.length>25) break;
      }
      res.innerHTML = hits.length? hits.map(h=>'<a href="'+h.u+'">'+h.t+'<span class="r-part">'+h.p+'</span><br><span class="r-part">…'+h.c+'…</span></a>').join('') : '<a>결과 없음</a>';
      res.style.display='block';
    });
    document.addEventListener('click',e=>{if(!q.contains(e.target)&&!res.contains(e.target))res.style.display='none';});
  }
})();
