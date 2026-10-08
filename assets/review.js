/* SEHS review engine — shared by every unit page.
   Each unit page defines a global UNIT = { id, code, title, sub, sources, topics: [...] }
   and then loads this file. Do not edit per unit. */
/* ============================================================
   STATE
   ============================================================ */
const KEY="sehs-"+UNIT.id+"-v1";
let S={topic:UNIT.topics[0].id,mode:"study",idx:{},ans:{},self:{}};
try{const r=localStorage.getItem(KEY); if(r) S=Object.assign(S,JSON.parse(r));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const topic=()=>UNIT.topics.find(t=>t.id===S.topic);
const LTR=["A","B","C","D","E"];
const esc=s=>String(s).replace(/&(?![a-z#]+;)/g,"&amp;").replace(/</g,"&lt;");

/* ---------- theme ---------- */
const tb=document.getElementById("themebtn");
tb.addEventListener("click",()=>{
  const cur=document.documentElement.getAttribute("data-theme");
  const dark=cur? cur==="dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme",dark?"light":"dark");
});

/* ============================================================
   RENDER
   ============================================================ */
function answeredCount(t){const a=S.ans[t.id]||{};return Object.keys(a).length;}
function correctCount(t){const a=S.ans[t.id]||{};return Object.values(a).filter(v=>v.ok).length;}

function renderRail(){
  document.getElementById("rail").innerHTML = UNIT.topics.map(t=>{
    const n=answeredCount(t), tot=t.mcq.length, c=correctCount(t);
    return `<button class="tcard" data-t="${t.id}" aria-current="${t.id===S.topic}">
      <span class="code">${t.code}</span>
      <span class="nm">${t.name}</span>
      <span class="bar"><i style="width:${tot?(n/tot*100):0}%"></i></span>
      <span class="st">${n? c+" of "+n+" right" : tot+" questions"}</span>
    </button>`;}).join("");
  let tot=0,done=0;
  UNIT.topics.forEach(t=>{tot+=t.mcq.length;done+=answeredCount(t);});
  document.getElementById("ovbar").style.width=(tot?done/tot*100:0)+"%";
  document.getElementById("ovlabel").textContent=`${done} of ${tot} questions answered`;
}

function renderTabs(){
  const t=topic();
  const modes=[["study","Study"],["quiz","Questions ("+t.mcq.length+")"],["write","Write it out"],["review","Your misses"]];
  document.getElementById("tabs").innerHTML=modes.map(([m,l])=>
    `<button class="tab" role="tab" data-m="${m}" aria-selected="${S.mode===m}">${l}</button>`).join("");
}

function renderStudy(){
  const t=topic();
  return t.study.map(s=>{
    let h=`<section class="sec"><h3>${s.h}</h3><div class="pg">${t.code} &middot; ${s.pg}</div>`;
    if(s.html) h+=s.html;
    if(s.table){
      h+=`<div class="scroll"><table>`;
      if(s.thead) h+=`<thead><tr>${s.thead.map(x=>`<th>${x}</th>`).join("")}</tr></thead>`;
      h+=`<tbody>${s.table.map(r=>`<tr>${r.map((c,i)=>`<td${i===0?' style="font-weight:600;white-space:nowrap"':''}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    if(s.flag) h+=`<div class="${s.ahl?'ahlbox':'flag'}">${s.flag}</div>`;
    if(s.ahl && !s.flag) h=h.replace('<section class="sec">','<section class="sec" style="border-left:3px solid var(--ahl)">');
    return h+`</section>`;
  }).join("");
}

function renderQuiz(){
  const t=topic();
  const i=Math.min(S.idx[t.id]||0, t.mcq.length-1);
  const q=t.mcq[i];
  const rec=(S.ans[t.id]||{})[i];
  const done=answeredCount(t), right=correctCount(t);

  let opts=q.o.map((o,j)=>{
    let cls="opt";
    if(rec){
      if(o.ok) cls+=" is-ok";
      else if(rec.pick===j) cls+=" is-no";
      else cls+=" is-dim";
    }
    return `<button class="${cls}" data-o="${j}" ${rec?"disabled":""}>
      <span class="ltr">${LTR[j]}</span><span>${o.t}</span></button>`;
  }).join("");

  let fb="";
  if(rec){
    const chosen=q.o[rec.pick];
    fb = rec.ok
      ? `<div class="fb ok"><div class="verdict">Correct</div><div>${q.truth}</div><span class="ref">${t.code} &middot; ${q.pg}</span></div>`
      : `<div class="fb no"><div class="verdict">Not this one</div>
         <div class="why"><b>Why ${LTR[rec.pick]} is tempting.</b> ${chosen.f}</div>
         <div class="truth"><b>${LTR[q.o.findIndex(o=>o.ok)]} is correct.</b> ${q.truth}</div>
         <span class="ref">Re-read ${t.code} &middot; ${q.pg}</span></div>`;
  }

  return `<div class="qmeta">
      <span class="qcount">Question ${i+1} of ${t.mcq.length}</span>
      <span class="score">${done? right+" / "+done+" correct so far" : "nothing recorded"}</span>
    </div>
    <div class="qcard">
      <div class="stem">${q.s}</div>
      <div class="opts">${opts}</div>
      ${fb}
      <div class="nav">
        <button class="btn ghost" id="prev" ${i===0?"disabled":""}>Back</button>
        <button class="btn" id="next" ${i===t.mcq.length-1?"disabled":""}>${rec?"Next question":"Skip"}</button>
      </div>
    </div>`;
}

function renderWrite(){
  const t=topic();
  return `<p style="color:var(--fg-2);font-size:14.5px;margin-bottom:16px;max-width:62ch">
    Write the answer out first, in full sentences, before you open the markscheme. Then tick each mark you actually earned — not each one you meant. A ${t.written[0].m}-mark question wants ${t.written[0].m} separate creditable things.</p>`
  + t.written.map((w,k)=>{
    const sk=`${t.id}-${k}`, st=S.self[sk]||{open:false,ticks:[]};
    const ticks=st.ticks||[];
    return `<div class="wcard">
      <div class="marks">${t.code} &middot; [${w.m} marks]</div>
      <div class="stem" style="font-size:18px;margin:6px 0 0">${w.q}</div>
      <textarea id="ta-${sk}" placeholder="Your answer…">${esc(st.text||"")}</textarea>
      ${st.open ? `<div class="ms">
          <h4>Markscheme — tick what you actually wrote</h4>
          ${w.ms.map((m,j)=>`<div class="mspt">
             <input type="checkbox" id="ck-${sk}-${j}" data-sk="${sk}" data-j="${j}" ${ticks[j]?"checked":""}>
             <label for="ck-${sk}-${j}">${m} <b>[1]</b></label></div>`).join("")}
          <div class="selfscore">You award yourself ${ticks.filter(Boolean).length} of ${w.m}.</div>
          <div class="note">${w.note}</div>
        </div>`
      : `<div class="nav"><span></span><button class="btn" data-reveal="${sk}">Show the markscheme</button></div>`}
    </div>`;
  }).join("");
}

function renderReview(){
  const t=topic(), a=S.ans[t.id]||{};
  const misses=Object.keys(a).filter(k=>!a[k].ok).map(k=>({q:t.mcq[k],k:+k}));
  const done=Object.keys(a).length;
  if(!done) return `<div class="result"><h2 style="font-size:22px;margin-bottom:8px">Nothing to review yet</h2>
    <p class="empty">Answer some questions in ${t.code} and anything you get wrong collects here as a revision list, with the page that settles it.</p></div>`;
  const right=Object.values(a).filter(v=>v.ok).length;
  return `<div class="result">
    <div class="big">${right}<span style="font-size:22px;color:var(--fg-3)"> / ${done}</span></div>
    <p style="color:var(--fg-2);margin-top:6px">${t.code} &middot; ${t.name}</p>
    ${misses.length? `<div class="misslist">${misses.map(m=>`<div class="miss">
        <div class="mq">${m.q.s}</div>
        <div>${m.q.truth}</div>
        <span class="ref">${t.code} &middot; ${m.q.pg}</span></div>`).join("")}</div>
      <p style="margin-top:16px;color:var(--fg-2);font-size:14.5px">That list is your revision, already written and already specific. Re-read those pages, then clear the topic and run it again.</p>`
    : `<p class="empty" style="margin-top:14px">Nothing missed so far in this topic.</p>`}
    <div class="nav"><span></span><button class="btn ghost" id="clear">Clear ${t.code} and start again</button></div>
  </div>`;
}

function render(){
  renderRail(); renderTabs();
  const p=document.getElementById("panel");
  p.innerHTML = S.mode==="study"? renderStudy()
    : S.mode==="quiz"? renderQuiz()
    : S.mode==="write"? renderWrite()
    : renderReview();
  save();
}

/* ============================================================
   EVENTS
   ============================================================ */
document.getElementById("rail").addEventListener("click",e=>{
  const b=e.target.closest("[data-t]"); if(!b) return;
  S.topic=b.dataset.t; render(); window.scrollTo({top:0,behavior:"smooth"});
});
document.getElementById("tabs").addEventListener("click",e=>{
  const b=e.target.closest("[data-m]"); if(!b) return;
  S.mode=b.dataset.m; render();
});
document.getElementById("panel").addEventListener("click",e=>{
  const t=topic();

  const o=e.target.closest("[data-o]");
  if(o && !o.disabled){
    const i=Math.min(S.idx[t.id]||0,t.mcq.length-1), j=+o.dataset.o;
    S.ans[t.id]=S.ans[t.id]||{};
    S.ans[t.id][i]={pick:j, ok:!!t.mcq[i].o[j].ok};
    render(); return;
  }
  if(e.target.id==="next"){
    const i=Math.min(S.idx[t.id]||0,t.mcq.length-1);
    S.idx[t.id]=Math.min(i+1,t.mcq.length-1); render();
    document.querySelector(".qcard").scrollIntoView({block:"nearest",behavior:"smooth"}); return;
  }
  if(e.target.id==="prev"){
    const i=Math.min(S.idx[t.id]||0,t.mcq.length-1);
    S.idx[t.id]=Math.max(i-1,0); render(); return;
  }
  if(e.target.id==="clear"){
    delete S.ans[t.id]; S.idx[t.id]=0; render(); return;
  }
  const rv=e.target.closest("[data-reveal]");
  if(rv){
    const sk=rv.dataset.reveal;
    const ta=document.getElementById("ta-"+sk);
    S.self[sk]=Object.assign({ticks:[]},S.self[sk],{open:true,text:ta?ta.value:""});
    render(); return;
  }
});
document.getElementById("panel").addEventListener("change",e=>{
  const c=e.target.closest("input[type=checkbox][data-sk]"); if(!c) return;
  const sk=c.dataset.sk, j=+c.dataset.j;
  const st=S.self[sk]||{ticks:[]}; st.ticks=st.ticks||[]; st.ticks[j]=c.checked;
  S.self[sk]=st; render();
});
document.getElementById("panel").addEventListener("input",e=>{
  if(e.target.tagName!=="TEXTAREA") return;
  const sk=e.target.id.replace(/^ta-/,"");
  S.self[sk]=Object.assign({ticks:[]},S.self[sk],{text:e.target.value});
  save();
});

render();
