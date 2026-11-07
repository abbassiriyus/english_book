/* ---------- demo lock (scripts/course-lock-client.js, inlined by the build) ----------
   window.COURSE_LOCK holds the encrypted lessons and a header-only stub for each of them.
   The right login and password give the AES key; the key is kept in localStorage so the
   course stays open after a reload. Without COURSE_LOCK (a --no-lock build) this does nothing. */
const Lock=(function(){
  const cfg=window.COURSE_LOCK||null;
  if(cfg)cfg.stubs.forEach(s=>LESSONS.push(Object.assign(parseLesson(s),{locked:true})));
  LESSONS.sort((a,b)=>a.n-b.n);
  const API="/api/session",P=cfg?cfg.prefix:"",PHONE=cfg?cfg.phone:"";
  let open=false,watch=null;
  const T={login:"Kirish",logout:"Chiqish",loginField:"Login",passwordField:"Parol",checking:"Tekshirilmoqda…",
    wrong:"Login yoki parol noto‘g‘ri.",noCrypto:"Kirish uchun sayt https:// orqali ochilishi kerak yoki brauzerni yangilang.",
    kicked:"Bu login bilan boshqa qurilmadan kirildi, shuning uchun bu yerdan chiqarildingiz. Bir vaqtda faqat bitta qurilmada foydalanish mumkin.",
    title:"Bu dars to‘liq versiyada",text:"Login va parolni kiriting — kursning barcha darslari ochiladi.",
    free:"Bepul darslar:",contact:"To‘liq kursni sotib olish uchun:",
    banner:(o,t)=>"🎁 Namoyish versiyasi: "+t+" ta darsdan "+o+" tasi ochiq."};
  const css=document.createElement("style");
  css.textContent=`
#courseBtn[hidden]{display:none}
nav button.item.locked{opacity:.6}nav button.item.locked.on{opacity:1}
.demo-banner{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 16px;padding:12px 16px;border-radius:14px;background:linear-gradient(90deg,#fff4d6,#ffe3ef);color:#4a2c00;font-weight:600;font-size:.92rem;box-shadow:var(--shadow)}
.demo-banner .lock-contact{display:block;font-weight:500;margin-top:2px}
.demo-actions{display:flex;gap:8px;flex-wrap:wrap}.demo-banner .btn{padding:7px 14px;font-size:.86rem}
.demo-banner .btn.alt{background:#fff;color:#3b38b5;border:0}
.lock-card{display:grid;justify-items:center;gap:12px;padding:30px 20px;text-align:center}
.lock-card h3{margin:0;font-size:1.3rem}.lock-card .tip{margin:0}
.lock-icon{font-size:3rem;line-height:1}
.lock-form{display:grid;gap:10px;width:min(340px,100%);text-align:left}
.lock-field{display:grid;gap:4px;font-weight:600;font-size:.88rem}
.lock-field input{font:inherit;font-weight:400;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink)}
.lock-err{margin:0;min-height:1.3em;color:var(--minus);font-size:.88rem;font-weight:600}
.lock-contact{color:var(--muted);font-size:.9rem}.lock-contact a{color:inherit;font-weight:700;white-space:nowrap}
.lock-free{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center;color:var(--muted);font-size:.9rem}
.lock-free .btn{padding:6px 12px;font-size:.85rem}
.lock-dlg{border:1px solid var(--line);border-radius:18px;padding:22px 22px 18px;background:var(--card);color:var(--ink);width:min(400px,calc(100vw - 32px));box-shadow:var(--shadow)}
.lock-dlg::backdrop{background:rgba(10,15,30,.55)}
.lock-dlg h3{margin:0 0 12px}.lock-dlg .lock-form{width:100%}.lock-dlg .lock-contact{display:block;margin-top:12px}
.lock-close{position:absolute;top:10px;right:12px;border:0;background:none;color:var(--muted);font-size:1.1rem;cursor:pointer}
.lock-notice{margin:0 0 12px;padding:10px 12px;border-radius:10px;background:var(--warn-bg);color:var(--warn);font-size:.9rem}`;
  document.head.appendChild(css);

  const bytes=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
  const forget=()=>{LS.set(P+"courseKey","");LS.set(P+"courseToken","");};
  async function request(payload){
    const r=await fetch(API,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
    return {status:r.status,data:await r.json().catch(()=>({}))};
  }
  async function unlock(raw){
    const key=await crypto.subtle.importKey("raw",raw,"AES-GCM",false,["decrypt"]);
    const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:bytes(cfg.iv)},key,bytes(cfg.data));
    const full=JSON.parse(new TextDecoder().decode(plain));
    full.src.forEach(text=>{const l=parseLesson(text),i=lessonIdx(l.n);if(i>=0)LESSONS[i]=l;else LESSONS.push(l);});
    LESSONS.sort((a,b)=>a.n-b.n);
    if(full.anim&&typeof ANIM==="object")Object.assign(ANIM,full.anim);
    open=true;
  }
  // One device at a time: a newer login elsewhere signs this one out on its next check.
  function kicked(){forget();LS.set(P+"courseKicked","1");location.reload();}
  async function ping(){
    const token=LS.get(P+"courseToken");
    if(document.hidden||!token)return;
    try{const {status,data}=await request({action:"ping",token});if(status===401&&data.error==="replaced")kicked();}catch(e){}
  }
  function watchSession(){
    if(watch)return;
    watch=setInterval(ping,30000);
    document.addEventListener("visibilitychange",ping);
    ping();
  }
  async function login(name,password){
    const material=await crypto.subtle.importKey("raw",new TextEncoder().encode(name.trim().toLowerCase()+":"+password),"PBKDF2",false,["deriveBits"]);
    const raw=new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2",salt:bytes(cfg.salt),iterations:cfg.iterations,hash:"SHA-256"},material,256));
    await unlock(raw);
    LS.set(P+"courseKey",btoa(String.fromCharCode(...raw)));
    LS.set(P+"courseToken","");
    // Without the session service (a plain file, GitHub Pages) the course still opens.
    try{
      const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",raw));
      const proof=[...digest].map(b=>b.toString(16).padStart(2,"0")).join("");
      const {status,data}=await request({action:"login",proof});
      if(status===200&&data.token)LS.set(P+"courseToken",data.token);
    }catch(e){}
    watchSession();
  }
  function redraw(){
    const l=LESSONS[lessonIdx(cur)];
    if(!tabsFor(l).some(([k])=>k===tab))tab=tabsFor(l)[0][0];
    setButton();buildNav();render();paintProgress();
  }
  function contact(){
    const a=h("a",null,"📞 "+PHONE);a.href="tel:"+PHONE.replace(/[^\d+]/g,"");
    return h("span","lock-contact",null,[document.createTextNode(T.contact+" "),a]);
  }
  function form(onDone){
    const field=(label,type,complete)=>{
      const input=h("input");input.type=type;input.required=true;input.autocomplete=complete;
      return [input,h("label","lock-field",null,[h("span",null,label),input])];
    };
    const [name,nameRow]=field(T.loginField,"text","username"),[pass,passRow]=field(T.passwordField,"password","current-password");
    name.autocapitalize="none";name.spellcheck=false;
    const error=h("p","lock-err"),submit=h("button","btn","🔑 "+T.login),f=h("form","lock-form",null,[nameRow,passRow,error,submit]);
    error.setAttribute("role","alert");submit.type="submit";
    f.onsubmit=async e=>{
      e.preventDefault();error.textContent="";
      if(!window.crypto||!crypto.subtle){error.textContent=T.noCrypto;return;}
      submit.disabled=true;submit.textContent=T.checking;
      try{await login(name.value,pass.value);if(onDone)onDone();redraw();}
      catch(err){error.textContent=T.wrong;pass.select();submit.disabled=false;submit.textContent="🔑 "+T.login;}
    };
    return f;
  }
  function dialog(notice){
    const d=h("dialog","lock-dlg"),x=h("button","lock-close","✕");
    x.type="button";x.setAttribute("aria-label","Yopish");x.onclick=()=>d.close();
    d.append(x,h("h3",null,"🔑 "+T.login));
    if(notice)d.appendChild(h("p","lock-notice",notice));
    d.append(form(()=>d.close()),contact());
    d.addEventListener("close",()=>d.remove());
    document.body.appendChild(d);d.showModal();
  }
  function setButton(){
    const b=document.getElementById("courseBtn");
    b.hidden=!cfg;b.textContent=open?"🚪 "+T.logout:"🔑 "+T.login;
  }
  document.getElementById("courseBtn").onclick=()=>{
    if(!open){dialog();return;}
    const token=LS.get(P+"courseToken");forget();
    (token?request({action:"logout",token}):Promise.resolve()).catch(()=>{}).finally(()=>location.reload());
  };
  const freeLessons=()=>LESSONS.filter(l=>!l.locked);
  // Called by render() after the hero. Returns true when the lesson is locked (the card is drawn).
  function screen(main,l){
    if(l.locked){
      const free=h("div","lock-free",null,[h("span",null,T.free)]);
      freeLessons().forEach(x=>{const b=h("button","btn alt",x.icon+" "+x.n);b.type="button";b.title=x.title;b.onclick=()=>go(x.n);free.appendChild(b);});
      main.appendChild(h("div","card lock-card",null,[h("div","lock-icon","🔒"),h("h3",null,T.title),h("p","tip",T.text),form(),contact(),free]));
      return true;
    }
    if(cfg&&!open){
      const free=freeLessons(),best=free[free.length-1],enter=h("button","btn","🔑 "+T.login),actions=h("div","demo-actions",null,[enter]);
      enter.type="button";enter.onclick=()=>dialog();
      if(best.n!==l.n){const b=h("button","btn alt","⭐ "+best.title);b.type="button";b.onclick=()=>go(best.n);actions.prepend(b);}
      main.appendChild(h("div","demo-banner",null,[h("div",null,null,[h("div",null,T.banner(free.length,LESSONS.length)),contact()]),actions]));
    }
    return false;
  }
  // First draw: open the course with the saved key first, so a buyer never sees the lock flash.
  function start(draw){
    const saved=cfg&&LS.get(P+"courseKey");
    const after=()=>{
      setButton();draw();
      if(open)watchSession();
      if(LS.get(P+"courseKicked")==="1"){LS.set(P+"courseKicked","");dialog(T.kicked);}
    };
    if(!saved||!window.crypto||!crypto.subtle){after();return;}
    unlock(bytes(saved)).catch(()=>forget()).then(after);
  }
  return {screen,start,isOpen:()=>open};
})();
