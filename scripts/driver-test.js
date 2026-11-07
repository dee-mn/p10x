/* P10X driver test: original questions and matching, a native interactive presentation. */
(()=>{
 'use strict';
 const app=document.querySelector('#dpt-app'),M=window.P10XDriverTest;if(!app||!M)return;
 const $=selector=>app.querySelector(selector),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const arrow='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 const check='<svg class="dpt-answer-check" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 const avatarPath='/assets/images/p10x-driver-celebrity-avatars.jpg';
 const sections=[...new Set(M.questions.map(q=>q.section))];
 let phase='welcome',index=0,answers={},lead=null,referrer='',milestone=0,result=null,timer=0,transition=null;
 let runId='',inFlight=new Map(),delivered=new Set();
 const newId=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+'-'+Math.random().toString(36).slice(2);
 function animate(element){
  transition?.cancel();
  if(!reduced.matches)transition=element.animate([{opacity:.25,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.16,1,.3,1)'});
 }
 function stage(name,focus){
  clearTimeout(timer);phase=name;
  for(const key of ['welcome','lead','quiz','insight','result'])$('#dpt-'+key).hidden=key!==name;
  $('#dpt-top-stage').textContent=({welcome:'Your drive. Your personality.',lead:'Your details',quiz:'Your driver profile',insight:'Your profile is forming',result:'Your celebrity match'})[name];
  const visible=$('#dpt-'+name);animate(visible);
  if(focus){
   const heading=visible.querySelector('h2,h1');heading?.focus({preventScroll:true});
   const y=visible.getBoundingClientRect().top+scrollY-115;
   window.scrollTo({top:Math.max(0,y),behavior:reduced.matches?'instant':'smooth'});
  }
 }
 function avatar(profile,hint=false){
  const col=profile.gridIndex%5,row=Math.floor(profile.gridIndex/5);
  return `<div class="dpt-avatar${hint?' is-hint':''}" style="--avatar-col:${col};--avatar-row:${row}"><img src="${avatarPath}" alt="${hint?'Celebrity hint':esc(profile.name)}" decoding="async"></div>`;
 }
 $('#dpt-start').addEventListener('click',()=>stage('lead',true));
 $('#dpt-lead-back').addEventListener('click',()=>stage('welcome',true));
 M.referrers.forEach(name=>{
  const button=document.createElement('button');button.type='button';button.textContent=name;button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>{
   referrer=name;$('#dpt-referrers').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   $('#dpt-other-field').hidden=name!=='Others';$('#dpt-lead-error').textContent='';
  });$('#dpt-referrers').append(button);
 });
 const phone=$('#dpt-phone');
 const phoneError=value=>{const digits=value.replace(/[\s\-()+.]/g,'');return !digits?'Please enter your WhatsApp / phone number':!/^\d{6,16}$/.test(digits)?'Please enter a valid phone number':'';};
 phone.addEventListener('input',()=>phone.setCustomValidity(''));
 phone.addEventListener('blur',()=>{if(phone.value)phone.setCustomValidity(phoneError(phone.value));});
 $('#dpt-lead-form').addEventListener('submit',event=>{
  event.preventDefault();phone.setCustomValidity(phoneError(phone.value));
  for(const selector of ['#dpt-name','#dpt-car']){const input=$(selector);input.setCustomValidity(input.value.trim()?'':'Please complete this field.');}
  if(!event.currentTarget.reportValidity())return;
  if(!referrer){$('#dpt-lead-error').textContent='Please select who shared this with you';$('#dpt-referrers button').focus();return;}
  lead={name:$('#dpt-name').value.trim(),phone:phone.value.trim(),carModel:$('#dpt-car').value.trim(),referredBy:referrer,referredByOther:referrer==='Others'?$('#dpt-referrer-other').value.trim():undefined};
  runId=newId();renderQuestion();stage('quiz',true);
 });
 for(const selector of ['#dpt-name','#dpt-car'])$(selector).addEventListener('input',event=>event.target.setCustomValidity(''));
 function hasAnswer(){const value=answers[M.questions[index].id];return value!==undefined&&(!Array.isArray(value)||value.length>0);}
 function markAnswers(){
  const q=M.questions[index],value=answers[q.id],selected=Array.isArray(value)?value:value===undefined?[]:[value];
  $('#dpt-answers').querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(selected.includes(i))));
  $('#dpt-next').disabled=!hasAnswer();
 }
 function choose(choice){
  if(phase!=='quiz')return;clearTimeout(timer);
  const q=M.questions[index];
  if(q.allowMultiple){const current=Array.isArray(answers[q.id])?answers[q.id]:[];answers[q.id]=current.includes(choice)?current.filter(x=>x!==choice):[...current,choice];}
  else answers[q.id]=choice;
  markAnswers();
  if(!q.allowMultiple){const current=index;timer=setTimeout(()=>{if(phase==='quiz'&&index===current)advance();},350);}
 }
 function renderQuestion(){
  const q=M.questions[index],percent=Math.round(index/25*100);
  $('#dpt-question-title').textContent=q.text;$('#dpt-section-name').textContent=q.section;
  $('#dpt-question-number').textContent=String(q.id).padStart(2,'0');
  $('#dpt-question-kicker').textContent=`Question ${q.id}${q.allowMultiple?' · Select all that apply':''}`;
  $('#dpt-progress-label').textContent=`Question ${q.id} of 25`;$('#dpt-progress-percent').textContent=percent+'%';
  $('#dpt-progress-fill').style.width=percent+'%';$('#dpt-progress').setAttribute('aria-valuenow',String(index));
  $('#dpt-section-list').innerHTML=sections.map((section,i)=>`<li${section===q.section?' aria-current="step"':''}><span>${String(i+1).padStart(2,'0')}</span>${esc(section)}</li>`).join('');
  $('#dpt-answers').replaceChildren();
  q.answers.forEach((answer,i)=>{
   const button=document.createElement('button');button.type='button';button.className='dpt-answer';button.dataset.answer=String(i);
   button.innerHTML=`<span class="dpt-answer-number" aria-hidden="true">${i+1}</span><span class="dpt-answer-text">${esc(answer.text)}</span>${check}`;
   button.addEventListener('click',()=>choose(i));$('#dpt-answers').append(button);
  });markAnswers();
 }
 function goQuestion(next){clearTimeout(timer);index=next;renderQuestion();stage('quiz',true);}
 function advance(){
  if(!hasAnswer())return;clearTimeout(timer);
  if([4,9,14,19].includes(index)){milestone=index+1;index++;renderInsight();stage('insight',true);}
  else if(index<24)goQuestion(index+1);else complete();
 }
 $('#dpt-next').addEventListener('click',advance);
 $('#dpt-back').addEventListener('click',()=>index>0?goQuestion(index-1):stage('lead',true));
 function renderInsight(){
  const scores=M.score(answers),profile=M.match(answers,lead.carModel),ppf=M.ppfPackages[scores.ppfRec];
  const tendency=scores.ppfScore>12?'Protection-Focused':scores.ppfScore>6?'Balanced':'Low-Maintenance';
  const energy=answers[9]===0||answers[9]===1?'Performance Driver':answers[6]===0?'Perfectionist Owner':answers[9]===3?'Relaxed Commuter':'Practical Driver';
  const copy={
   5:['Your profile is forming...',`Early signals show you're a ${tendency} type of car owner.`,'Keep going — your celebrity match is just around the corner.'],
   10:['Your celebrity match is forming...',`You have a ${energy} energy. We're narrowing in on your perfect celebrity match.`,'Answer 5 more questions to reveal your match — and your PPF recommendation.'],
   15:['PPF result locked in!','Based on your driving habits and parking situation, your recommended protection package is:','5 quick tint questions left — then your full profile is revealed.'],
   20:['Almost there!','Your personality profile is 80% complete. Just 5 more questions for your full tint recommendation.','Your celebrity match + complete package is about to be revealed.']
  }[milestone];
  $('#dpt-insight-progress').textContent=`${milestone} / 25 · ${milestone/25*100}% complete`;
  $('#dpt-insight-title').textContent=copy[0];$('#dpt-insight-body').textContent=copy[1];$('#dpt-insight-hook').textContent=copy[2];
  $('#dpt-insight-extra').innerHTML=milestone===5?`<div><p class="dpt-eyebrow">Protection tendency</p><h3>${esc(tendency)}</h3></div>`:milestone===15?`<div><p class="dpt-eyebrow">PPF Recommendation</p><h3>${esc(ppf.title)}</h3><p>${esc(ppf.subtitle)}</p></div>`:`${avatar(profile,true)}<div><p class="dpt-eyebrow">${milestone===20?'Your celebrity match is ready':'Emerging match'}</p><h3>${milestone===20?'5 questions to unlock':'A famous celebrity awaits...'}</h3><p>Almost revealed</p></div>`;
 }
 $('#dpt-insight-next').addEventListener('click',()=>{renderQuestion();stage('quiz',true);});
 window.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.target.closest('input,textarea,select,[contenteditable=true]'))return;
  if(phase==='insight'&&['Enter',' '].includes(event.key)){event.preventDefault();$('#dpt-insight-next').click();return;}
  if(phase!=='quiz'||event.target.closest('header,footer'))return;
  const buttons=[...$('#dpt-answers').querySelectorAll('button')];
  if(['ArrowDown','ArrowUp'].includes(event.key)){
   event.preventDefault();const current=buttons.indexOf(document.activeElement),next=event.key==='ArrowDown'?(current+1)%buttons.length:(current<=0?buttons.length-1:current-1);buttons[next].focus();
  }else if(/^[1-7]$/.test(event.key)&&Number(event.key)<=buttons.length){event.preventDefault();choose(Number(event.key)-1);}
  else if(['Enter',' '].includes(event.key)&&!event.target.closest('button,a')){event.preventDefault();advance();}
  else if(['ArrowLeft','Backspace'].includes(event.key)&&index>0){event.preventDefault();goQuestion(index-1);}
 });
 function complete(){
  result={scores:M.score(answers),celebrity:M.match(answers,lead.carModel)};
  renderResult();stage('result',true);sendResult('');
 }
 function renderResult(){
  const {scores:s,celebrity:c}=result,p=M.ppfPackages[s.ppfRec],t=M.tintPackages[s.tintGrade],level={full:3,hybrid:2,ceramic:1}[s.ppfRec];
  const addons=[];if(s.securitySignal==='security')addons.push('Security film layer for theft deterrence');if(s.privacySignal==='dark')addons.push('Maximum darkness tint (within JPJ legal limits)');
  $('#dpt-result-content').innerHTML=`<div class="dpt-result-heading"><p class="dpt-eyebrow">Your results / P10X</p><h2 id="dpt-result-title" tabindex="-1">Here's your personality match,<br>${esc(lead.name.split(' ')[0])}.</h2><p>Profile built for your <strong>${esc(lead.carModel)}</strong></p></div>
  <div class="dpt-result-grid"><section class="dpt-match" aria-labelledby="dpt-celebrity-name">${avatar(c)}<div><p class="dpt-eyebrow">Your Celebrity Match</p><h3 id="dpt-celebrity-name">${esc(c.name)}</h3><p class="dpt-nationality">${esc(c.category)} · ${esc(c.nationality)}</p><p>${esc(c.description)}</p><div class="dpt-traits">${c.personalityTraits.map(trait=>`<span>${esc(trait)}</span>`).join('')}</div><p class="dpt-car-personality">${esc(c.carPersonality)}</p></div></section>
  <section class="dpt-package" aria-labelledby="dpt-ppf-title"><p class="dpt-eyebrow">PPF Recommendation</p><h3 id="dpt-ppf-title">${esc(p.title)}</h3><p class="dpt-package-subtitle">${esc(p.subtitle)}</p><p>${esc(p.description)}</p><ul>${p.includes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="dpt-protection"><span>Protection Level</span><span aria-label="${level} of 3">${[0,1,2].map(i=>`<i${i<level?' class="active"':''}></i>`).join('')}</span></div></section>
  <section class="dpt-package" aria-labelledby="dpt-tint-title"><p class="dpt-eyebrow">Window Tint Recommendation</p><h3 id="dpt-tint-title">${esc(t.title)}</h3><p>${esc(t.description)}</p><div class="dpt-tint-metrics"><div><p>Heat Rejection</p><strong>${esc(t.heatRejection)}</strong></div><div><p>UV Protection</p><strong>${esc(t.uvBlock)}</strong></div></div>${addons.length?`<div class="dpt-addons"><p>Recommended Add-ons</p><ul>${addons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}</section></div>
  <p class="dpt-status" id="dpt-auto-status" role="status" aria-live="polite">Sending your results to P10X…</p><button class="dpt-text-button dpt-submit-retry" type="button" id="dpt-retry" hidden>Try again</button>
  <section class="dpt-email" aria-labelledby="dpt-email-heading"><div class="dpt-email-heading"><h3 id="dpt-email-heading">Get Your Result by Email</h3><span>optional</span></div><p>We'll email you your full driver profile and recommended package for future reference.</p><form id="dpt-email-form"><label class="screen-reader-text" for="dpt-email">Email address</label><input id="dpt-email" name="email" type="email" placeholder="your@email.com" autocomplete="email" maxlength="254" required><button class="dpt-primary" type="submit" id="dpt-email-send">Send ${arrow}</button></form><p class="dpt-status" id="dpt-email-status" role="status" aria-live="polite"></p></section>
  <section class="dpt-share" aria-labelledby="dpt-share-title"><div class="dpt-share-head"><div><p class="dpt-eyebrow">Know someone who should try this?</p><h3 id="dpt-share-title">Share with your friends!</h3></div><p>See which celebrity matches their car care personality too.</p></div><div class="dpt-share-actions"><button type="button" class="dpt-primary" id="dpt-whatsapp">Share on WhatsApp ${arrow}</button><button type="button" class="dpt-secondary" id="dpt-copy">Copy Link</button><button type="button" class="dpt-secondary" id="dpt-native-share"${navigator.share?'':' hidden'}>More sharing options</button><button type="button" class="dpt-secondary" id="dpt-save">Save Result as Image</button></div><p class="dpt-status" id="dpt-share-status" role="status" aria-live="polite"></p><input class="dpt-copy-fallback" id="dpt-share-link" aria-label="Test link" readonly hidden><button type="button" class="dpt-text-button dpt-retake" id="dpt-retake">↩ Retake the Test</button></section>`;
  $('#dpt-retry').addEventListener('click',()=>sendResult(''));
  $('#dpt-email-form').addEventListener('submit',event=>{event.preventDefault();if(event.currentTarget.reportValidity())sendResult($('#dpt-email').value.trim());});
  const shareUrl=document.querySelector('link[rel=canonical]').href,shareText='I just discovered which celebrity matches my car care personality! Find out yours 🌟';
  $('#dpt-whatsapp').addEventListener('click',()=>window.open('https://wa.me/?text='+encodeURIComponent(shareText+'\n\n'+shareUrl),'_blank','noopener,noreferrer'));
  $('#dpt-copy').addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(shareUrl);$('#dpt-share-status').textContent='Link copied.';}
   catch{$('#dpt-share-link').hidden=false;$('#dpt-share-link').value=shareUrl;$('#dpt-share-link').select();$('#dpt-share-status').textContent='Copy this link to share your test.';}
  });
  $('#dpt-native-share').addEventListener('click',async()=>{try{await navigator.share({title:'P10X Celebrity Personality Test',text:shareText,url:shareUrl});}catch(error){if(error.name!=='AbortError')$('#dpt-share-status').textContent='Use Copy Link to share this test.';}});
  $('#dpt-save').addEventListener('click',saveImage);
  $('#dpt-retake').addEventListener('click',()=>{
   clearTimeout(timer);runId=newId();answers={};lead=null;index=0;result=null;referrer='';inFlight=new Map();delivered=new Set();
   $('#dpt-lead-form').reset();$('#dpt-other-field').hidden=true;$('#dpt-referrers').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));$('#dpt-lead-error').textContent='';
   stage('welcome',true);
  });
 }
 async function sendResult(email){
  const currentRun=runId,key=currentRun+'|'+email;if(inFlight.has(key)||delivered.has(key))return;
  const status=$(email?'#dpt-email-status':'#dpt-auto-status'),button=$(email?'#dpt-email-send':'#dpt-retry');
  status.classList.remove('is-error');status.textContent=email?'Sending your email request…':'Sending your results to P10X…';button.disabled=true;
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),16000);
  const task=fetch('/driver-test.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:currentRun,lead,answers,celebrityId:result.celebrity.id,email,website:$('#dpt-website').value}),signal:controller.signal});inFlight.set(key,task);
  try{
   const response=await task,data=await response.json();if(currentRun!==runId)return;
   if(!response.ok||!data.ok)throw new Error(data.message||'Your result is ready, but we could not send your details. Please try again.');
   delivered.add(key);
   status.textContent=data.preview?(email?'Preview only — no email request was sent.':'Preview only — no live submission was sent.'):(email?"Got it! We'll be in touch.":'Your results have been submitted to P10X.');
   if(email){$('#dpt-email').disabled=true;button.disabled=true;}else $('#dpt-retry').hidden=true;
  }catch(error){
   if(currentRun!==runId)return;status.classList.add('is-error');status.textContent=error.name==='AbortError'?'Your result is ready, but sending took too long. Please try again.':error.message;
   button.disabled=false;if(!email)button.hidden=false;
  }finally{clearTimeout(timeout);inFlight.delete(key);}
 }
 async function saveImage(){
  const button=$('#dpt-save');if(button.disabled)return;button.disabled=true;
  try{
   await document.fonts.ready;
   const image=new Image();image.src=avatarPath;await image.decode();
   const c=document.createElement('canvas');c.width=1080;c.height=4096;const ctx=c.getContext('2d');
   ctx.fillStyle='#141819';ctx.fillRect(0,0,c.width,c.height);
   function text(value,x,y,size=30,color='#eff3f1',weight=400){ctx.fillStyle=color;ctx.font=`${weight} ${size}px Inter,Arial,sans-serif`;ctx.fillText(value,x,y);}
   function wrap(value,x,y,maxWidth,size=28,line=42,color='#aab8ba'){
    ctx.font=`400 ${size}px Inter,Arial,sans-serif`;let row='';for(const word of String(value).split(/\s+/)){const trial=row?row+' '+word:word;if(ctx.measureText(trial).width>maxWidth&&row){text(row,x,y,size,color);y+=line;row=word;}else row=trial;}if(row){text(row,x,y,size,color);y+=line;}return y;
   }
   const {celebrity:p,scores:s}=result,ppf=M.ppfPackages[s.ppfRec],tint=M.tintPackages[s.tintGrade];
   text('P10X / DRIVER PERSONALITY TEST',65,75,19,'#03c4d5');
   text("Here's your personality match,",65,145,32);text(lead.name.split(' ')[0]+'.',65,203,47);
   ctx.save();ctx.beginPath();ctx.arc(165,350,100,0,Math.PI*2);ctx.clip();const cell=image.width/5;ctx.drawImage(image,(p.gridIndex%5)*cell,Math.floor(p.gridIndex/5)*cell,cell,cell,65,250,200,200);ctx.restore();
   let y=wrap(p.name,310,322,690,57,67,'#eff3f1');text(p.category+' · '+p.nationality,310,y+12,23,'#03c4d5');
   y=wrap(p.personalityTraits.join(' · '),65,510,950,23,35,'#03c4d5');y=wrap(p.description,65,y+30,950,29,43);y=wrap('Profile built for your '+lead.carModel,65,y+20,950,24,36,'#dce8e8');
   ctx.strokeStyle='#ffffff30';ctx.beginPath();ctx.moveTo(65,y+18);ctx.lineTo(1015,y+18);ctx.stroke();y+=73;
   text('PPF RECOMMENDATION',65,y,18,'#03c4d5');y+=55;y=wrap(ppf.title,65,y,950,44,55,'#eff3f1');y=wrap(ppf.subtitle,65,y+10,950,25,38,'#03c4d5');y=wrap(ppf.description,65,y+18,950,26,39);for(const item of ppf.includes)y=wrap('+ '+item,65,y+8,950,24,35,'#dce8e8');
   y+=50;text('WINDOW TINT RECOMMENDATION',65,y,18,'#03c4d5');y+=55;y=wrap(tint.title,65,y,950,41,51,'#eff3f1');y=wrap(tint.description,65,y+15,950,26,39);y=wrap(tint.heatRejection+' · '+tint.uvBlock,65,y+12,950,25,38,'#03c4d5');
   if(s.securitySignal==='security')y=wrap('Security film layer for theft deterrence',65,y+12,950,23,34);
   if(s.privacySignal==='dark')y=wrap('Maximum darkness tint (within JPJ legal limits)',65,y+12,950,23,34);
   y+=50;text('p10x.flevor.me/driver-personality-test/',65,y,19,'#899b9e');
   const output=document.createElement('canvas');output.width=c.width;output.height=Math.min(c.height,y+55);output.getContext('2d').drawImage(c,0,0);
   const blob=await new Promise(resolve=>output.toBlob(resolve,'image/png'));if(!blob)throw new Error('Image unavailable');
   const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`p10x-${p.id}-result.png`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
   $('#dpt-share-status').textContent='Your result image is ready.';
  }catch{$('#dpt-share-status').textContent='We could not create the image. Please try again.';}
  finally{button.disabled=false;}
 }
 if(!reduced.matches)animate($('#dpt-welcome'));
})();
