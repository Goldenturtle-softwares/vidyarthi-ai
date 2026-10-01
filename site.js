
(function(){
  const C = window.VIDYARTHI_COURSES || [];
  const cfg = window.VIDYARTHI_CONFIG || {};
  const path = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.menu').forEach(b=>b.addEventListener('click',()=>{
    document.querySelector('.mobile')?.classList.toggle('open');
  }));
  document.querySelectorAll('.dropbtn').forEach(b=>b.addEventListener('click',()=>{ b.closest('.dropdown')?.classList.toggle('open'); }));
  document.addEventListener('click',e=>{ if(!e.target.closest('.dropdown')) document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open')); });

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  function categoryClass(cat){
    if(cat==='ai') return 'ai';
    if(cat==='exam-prep') return 'exam';
    return 'tech';
  }
  function card(c){
    const price = c.type==='sample' ? 'SAMPLE' : (c.price===0 ? 'FREE' : '₹'+c.price.toLocaleString('en-IN'));
    const action = c.type==='sample' ? 'Preview path →' : c.delivery==='affiliate' ? 'View course ↗' : c.delivery==='internal' ? 'Start learning →' : 'Explore programme →';
    const image = c.image || '';
    return `<article class="course-card reveal">
      <div class="course-cover">
        ${image ? `<img src="${image}" alt="${c.title}" loading="lazy">` : ''}
        <span class="course-label">${c.type==='sample'?'SAMPLE CATALOGUE':c.delivery==='affiliate'?'PARTNER':c.delivery==='internal'?'FREE / VIDYARTHI':'VIDYARTHI PROGRAMME'}</span>
        <span class="course-level">${c.level}</span>
      </div>
      <div class="course-body">
        <div class="provider">${c.provider}</div>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <div class="course-meta">
          <span class="chip">★ ${c.rating||'—'}</span>
          <span class="chip">${c.duration||'Self-paced'}</span>
          ${c.language.slice(0,2).map(x=>`<span class="chip">${x}</span>`).join('')}
        </div>
        <div class="course-foot"><span class="price ${c.price===0?'free':''}">${price}</span><a class="btn ${c.price===0?'':'btn-blue'}" href="${c.url||'#'}" ${c.url && c.url!=='#'?'target="_blank" rel="noopener"':''}>${action}</a></div>
      </div>
    </article>`;
  }

  function renderFeatured(){
    const el=document.getElementById('featured-courses'); if(!el) return;
    el.innerHTML=C.filter(x=>x.featured).slice(0,6).map(card).join('');
    el.querySelectorAll('.reveal').forEach(x=>observer.observe(x));
  }

  function renderCourses(){
    const grid=document.getElementById('course-grid'); if(!grid) return;
    const search=document.getElementById('course-search'), cat=document.getElementById('course-category'), lang=document.getElementById('course-language'), price=document.getElementById('course-price');
    const render=()=>{
      let items=[...C];
      const q=(search.value||'').toLowerCase().trim();
      if(q) items=items.filter(c=>[c.title,c.provider,c.description,c.category,...c.language].join(' ').toLowerCase().includes(q));
      if(cat.value) items=items.filter(c=>c.category===cat.value);
      if(lang.value) items=items.filter(c=>c.language.includes(lang.value));
      if(price.value==='free') items=items.filter(c=>c.price===0);
      if(price.value==='paid') items=items.filter(c=>c.price>0);
      grid.innerHTML=items.map(card).join('') || '<div class="business-card"><h3>No exact match yet.</h3><p>Try another search or ask the free counsellor to build a path for you.</p></div>';
      grid.querySelectorAll('.reveal').forEach(x=>observer.observe(x));
    };
    [search,cat,lang,price].forEach(x=>x&&x.addEventListener('input',render));
    render();
  }

  function renderCategory(){
    const grid=document.getElementById('category-course-grid'); if(!grid) return;
    const cat=grid.dataset.category;
    grid.innerHTML=C.filter(c=>c.category===cat).map(card).join('');
    grid.querySelectorAll('.reveal').forEach(x=>observer.observe(x));
  }

  function counsellor(){
    const form=document.getElementById('chat-form'), input=document.getElementById('chat-input'), log=document.getElementById('chat-log');
    if(!form) return;
    const respond=(text)=>{
      const t=text.toLowerCase();
      let answer='I can help you choose a learning direction. Tell me your current education or job, your goal, preferred language and hours per week.';
      if(t.includes('not from engineering')||t.includes('non-tech')||t.includes('non tech')) answer='You do not need to become a programmer to start. Begin with AI literacy → learn 2–3 tools → apply them to your current field → then decide whether coding is useful for your target role. Try the “AI for Everyone” tracks on Vidyarthi.';
      else if(t.includes('b.com')||t.includes('commerce')||t.includes('finance')) answer='For commerce, start with AI + Excel/data + business analysis + communication. Add automation and presentation workflows. Coding can be optional unless your target role requires it.';
      else if(t.includes('5 hours')||t.includes('5 hour')) answer='With 5 hours/week, use a simple rhythm: 2 hours learning, 2 hours practice on your own work, 1 hour building a small portfolio output. Consistency beats collecting courses.';
      else if(t.includes('government exam')||t.includes('ssc')||t.includes('upsc')) answer='For exam preparation, first identify the exact exam and stage. Vidyarthi can help organise syllabus, practice, revision and language-specific resources. Verify official notifications and dates before acting.';
      else if(t.includes('ai')||t.includes('artificial intelligence')) answer='AI learning can be split into four levels: AI literacy, tool fluency, workflow skills and career application. Choose the level based on your role rather than starting with advanced machine learning.';
      return answer;
    };
    form.addEventListener('submit',e=>{
      e.preventDefault(); const text=input.value.trim(); if(!text) return;
      log.insertAdjacentHTML('beforeend',`<div class="bubble user">${text.replace(/[<>&]/g,'')}</div>`); input.value='';
      setTimeout(()=>{ log.insertAdjacentHTML('beforeend',`<div class="bubble ai"><strong>Vidyarthi</strong><br>${respond(text)}</div>`); log.scrollTop=log.scrollHeight; },300);
    });
    document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>{ input.value=b.dataset.prompt; input.focus(); }));
  }

  document.querySelectorAll('[data-whatsapp]').forEach(a=>{
    if(cfg.whatsappUrl) a.href=cfg.whatsappUrl; else { a.href='#'; a.addEventListener('click',e=>{e.preventDefault(); alert('Add your verified WhatsApp Business URL in js/config.js before publishing this link.');});}
  });
  document.querySelectorAll('[data-telegram]').forEach(a=>{
    if(cfg.telegramUrl) a.href=cfg.telegramUrl; else { a.href='#'; a.addEventListener('click',e=>{e.preventDefault(); alert('Add your Telegram URL in js/config.js before publishing this link.');});}
  });

  renderFeatured(); renderCourses(); renderCategory(); counsellor();
})();
