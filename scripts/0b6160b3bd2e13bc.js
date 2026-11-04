(function(){
  'use strict';
  function p10xVectorIcons(){
  if(document.documentElement.hasAttribute('data-p10x-vector-icons'))return;
  document.documentElement.setAttribute('data-p10x-vector-icons','ready');
  var paths={
    '↗':'M5 19 19 5M5 5h14v14',
    '↖':'M19 19 5 5M5 19V5h14',
    '↘':'M5 5 19 19M5 19h14V5',
    '↙':'M19 5 5 19M5 5v14h14',
    '↓':'M12 4v16M5 13l7 7 7-7',
    '↑':'M12 20V4M5 11l7-7 7 7',
    '←':'M20 12H4M11 5l-7 7 7 7',
    '→':'M4 12h16M13 5l7 7-7 7',
    '▷':'M8 5l11 7-11 7Z',
    '▶':'M8 5l11 7-11 7Z',
    'Ⅱ':'M8 5v14M16 5v14',
    '⏸':'M8 5v14M16 5v14',
    '💡':'M9 18h6M10 21h4M8.5 15.5a6 6 0 1 1 7 0L15 18H9Z',
    '👉':'M4 12h16M13 5l7 7-7 7',
    '✅':'m5 12 4 4L19 6',
    '❌':'m6 6 12 12M18 6 6 18',
    '⚠':'m12 3 10 18H2ZM12 9v5M12 17v.5',
    '📞':'m7 3 3 5-3 3a15 15 0 0 0 6 6l3-3 5 3-2 4C10 21 3 14 3 5Z',
    '🛡':'m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6Zm-4 9 3 3 5-6',
    '🔹':'m12 5 7 7-7 7-7-7Z',
    '🚗':'m4 10 2-5h12l2 5M3 10h18v8H3ZM6 18v3M18 18v3M6 14h2M16 14h2',
    '🔥':'M13 3c2 6-4 6-2 10 1-1 3-2 3-4 5 4 5 7 3 10a7 7 0 0 1-11-1c-2-4 1-8 4-10 0 3 0 4 1 4 2-2 3-5 2-9Z',
    '✂':'M7 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM7 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM7 8l14 12M7 16 21 4',
    '📦':'m3 7 9-4 9 4v10l-9 4-9-4Zm0 0 9 4 9-4M12 11v10M7 5l10 4',
    '🪒':'m8 3 12 4-2 6-12-4ZM7 7l12 4M11 11l-4 10-3-1 4-10',
    '💧':'M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12ZM9 16a3 3 0 0 0 3 3',
    '🛠':'m4 3 5 5-3 3-5-5ZM9 11l10 10M16 3a6 6 0 0 0-7 7L2 17l5 5 7-7a6 6 0 0 0 7-7l-4 3-4-4 3-4',
    '🔧':'M16 3a6 6 0 0 0-7 7L2 17l5 5 7-7a6 6 0 0 0 7-7l-4 3-4-4 3-4',
    '💬':'M4 4h16v12H9l-5 4ZM8 8h8M8 12h5',
    '📌':'m8 3 8 0-1 5 4 5H5l4-5ZM12 13v8',
    '✨':'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4M18 4h4'
  };
  var skip='script,style,textarea,input,select,option,svg,code,pre,[contenteditable],.elementor-screen-only,.screen-reader-text,[data-p10x-keep-symbol]';
  var fontIcons={
    'fa-facebook-f':{solid:true,d:'M14 22v-9h3l.5-4H14V6.5c0-1.1.4-1.5 1.5-1.5H18V1.5c-.7-.1-1.8-.2-3-.2-3.2 0-5 2-5 5.2V9H7v4h3v9Z'},
    'fa-instagram':{d:'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17.5 6.5h.01'},
    'fa-youtube':{d:'M5 5h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3ZM10 9l6 3-6 3Z'},
    'fa-tiktok':{solid:true,d:'M14 2h3c.2 2.3 1.8 4 4 4v3a8 8 0 0 1-4-1v8a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3Z'},
    'bi-arrow-right':{d:paths['→']},
    'bi-arrow-up-right':{d:paths['↗']},
    'fa-eye':{d:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'},
    'fa-star':{d:'m12 2 3.1 6.3L22 9.3l-5 4.9 1.2 6.9L12 17.8l-6.2 3.3L7 14.2l-5-4.9 6.9-1Z'},
    'bi-123':{d:'m2 9 2-2v10M1 17h6M9 9V8a2 2 0 0 1 4 0c0 3-4 4-4 8h4M17 7h3l-2 4a3 3 0 1 1-2 5'},
    'fa-people-carry':{d:'M7 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM21 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 9h8v7H8ZM2 21l2-6V8l4 4M22 21l-2-6V8l-4 4M4 15l4 6M20 15l-4 6'},
    'fa-certificate':{d:'m12 2 3 2 4 1 1 4 2 3-2 3-1 4-4 1-3 2-3-2-4-1-1-4-2-3 2-3 1-4 4-1Zm-5 10 3 3 6-6'}
  };
  fontIcons['bi-instagram']=fontIcons['fa-instagram'];
  fontIcons['fa-chevron-right']={d:'m9 5 7 7-7 7'};
  fontIcons['fa-chevron-left']={d:'m15 5-7 7 7 7'};
  fontIcons['fa-chevron-up']={d:'m5 15 7-7 7 7'};
  fontIcons['fa-chevron-down']={d:'m5 9 7 7 7-7'};
  ['right','left','up','down'].forEach(function(direction){fontIcons['fa-angle-'+direction]=fontIcons['fa-chevron-'+direction];});
  fontIcons['pxl-menu-toggle']=fontIcons['fa-chevron-down'];
  function fontIcon(element){
    if(element.hasAttribute('data-p10x-svg-icon')||element.closest('.pxl-scroll-top,svg'))return;
    var key=Object.keys(fontIcons).find(function(name){return element.classList.contains(name);});
    if(!key)return;
    var definition=fontIcons[key],svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
    svg.setAttribute('class','p10x-glyph-icon');svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('data-p10x-solid',String(!!definition.solid));
    svg.setAttribute('width','1em');svg.setAttribute('height','1em');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
    svg.setAttribute('fill',definition.solid?'currentColor':'none');svg.setAttribute('stroke',definition.solid?'none':'currentColor');
    svg.setAttribute('stroke-width','1.7');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
    path.setAttribute('d',definition.d);svg.appendChild(path);
    element.replaceChildren(svg);element.setAttribute('data-p10x-svg-icon',key);element.setAttribute('aria-hidden','true');
    var link=element.closest('a'),labels={'fa-facebook-f':'Facebook','fa-instagram':'Instagram','bi-instagram':'Instagram','fa-youtube':'YouTube','fa-tiktok':'TikTok'};
    if(link&&labels[key]&&!link.hasAttribute('aria-label'))link.setAttribute('aria-label',labels[key]);
  }
  function searchIcon(button){
    if(button.hasAttribute('data-p10x-search-icon'))return;
    button.setAttribute('data-p10x-search-icon','');
    if(!button.hasAttribute('aria-label'))button.setAttribute('aria-label','Search');
    button.innerHTML='<svg class="p10x-glyph-icon" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false"><path d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  }

  var ns='http://www.w3.org/2000/svg';
  function replace(node){
    var parent=node.parentElement;
    if(!parent||parent.closest(skip))return;
    var expression=new RegExp('(?:'+Object.keys(paths).join('|')+')[\uFE0E\uFE0F]?', 'gu');
    if(!expression.test(node.nodeValue))return;
    expression.lastIndex=0;
    var value=node.nodeValue,fragment=document.createDocumentFragment(),offset=0,match;
    while((match=expression.exec(value))){
      if(match.index>offset)fragment.appendChild(document.createTextNode(value.slice(offset,match.index)));
      var glyph=Array.from(match[0])[0],svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
      svg.setAttribute('class','p10x-vector-icon');svg.setAttribute('viewBox','0 0 24 24');
      svg.setAttribute('width','1em');svg.setAttribute('height','1em');
      svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
      svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');
      svg.setAttribute('stroke-width','1.6');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
      path.setAttribute('d',paths[glyph]);svg.appendChild(path);fragment.appendChild(svg);
      offset=match.index+match[0].length;
    }
    if(offset<value.length)fragment.appendChild(document.createTextNode(value.slice(offset)));
    var control=parent.closest('a,button');
    if(control&&!control.hasAttribute('aria-label')&&!control.hasAttribute('aria-labelledby')&&control.textContent.trim()===value.trim()){
      var label={'←':'Previous','→':'Next','↓':'Scroll down','↑':'Back to top','▷':'Play','▶':'Play','Ⅱ':'Pause','⏸':'Pause'};
      control.setAttribute('aria-label',label[value.trim().charAt(0)]||'Open link');
    }
    node.parentNode.replaceChild(fragment,node);
  }
  function scan(root){
    if(root.nodeType===3){replace(root);return;}
    if(root.nodeType!==1||root.closest(skip))return;
    fontIcon(root);root.querySelectorAll('i,[class*="bi-"],[class*="fa-"],.pxl-menu-toggle').forEach(fontIcon);
    if(root.matches('.wp-block-search__button'))searchIcon(root);
    root.querySelectorAll('.wp-block-search__button').forEach(searchIcon);
    var walker=document.createTreeWalker(root,4),nodes=[],node;
    while((node=walker.nextNode()))nodes.push(node);
    nodes.forEach(replace);
  }
  scan(document.body);
  new MutationObserver(function(records){
    records.forEach(function(record){
      if(record.type==='characterData')replace(record.target);
      else record.addedNodes.forEach(scan);
    });
  }).observe(document.body,{childList:true,subtree:true,characterData:true});
}

  function ready(){
    p10xVectorIcons();
    var viewport=document.querySelector('meta[name="viewport"]');
    if(viewport){viewport.content=viewport.content.split(',').filter(function(part){return !/^\s*(maximum-scale|user-scalable)\s*=/i.test(part);}).join(',');}
    if(document.querySelector('.p10x-window')&&!document.querySelector('main,[role="main"]')){
      var main=document.querySelector('#pxl-main')||document.querySelector('.p10x-window');
      main.setAttribute('role','main');
    }
    document.querySelectorAll('.ab-person').forEach(function(card){card.setAttribute('role','group');});
    document.querySelectorAll('.ab-team-navigation a[aria-label]').forEach(function(link){var visible=link.textContent.trim(),label=link.getAttribute('aria-label');if(label.indexOf(visible)!==0)link.setAttribute('aria-label',visible+' — '+label);});
    document.querySelectorAll('.ab-pillar-tabs').forEach(function(tabs){
      var wrapper=tabs.querySelector('.elementor-tabs-content-wrapper');
      if(!wrapper)return;
      var mq=window.matchMedia('(max-width:767px)');
      function sync(){
        wrapper.removeAttribute('role');wrapper.removeAttribute('aria-orientation');
        tabs.querySelectorAll('.elementor-tab-mobile-title').forEach(function(title){
          var number=title.getAttribute('data-tab'),panel=document.getElementById(title.getAttribute('aria-controls'));
          var desktop=tabs.querySelector('.elementor-tab-desktop-title[data-tab="'+number+'"]');
          title.id='p10x-pillar-mobile-'+number;
          title.setAttribute('role','button');title.removeAttribute('aria-selected');
          title.setAttribute('tabindex','0');title.setAttribute('aria-expanded',String(title.classList.contains('elementor-active')));
          if(panel&&desktop){panel.setAttribute('role',mq.matches?'region':'tabpanel');panel.setAttribute('aria-labelledby',mq.matches?title.id:desktop.id);}
        });
      }
      tabs.addEventListener('click',function(event){if(event.target.closest('.elementor-tab-title'))requestAnimationFrame(sync);});
      tabs.querySelectorAll('.elementor-tab-mobile-title').forEach(function(title){title.addEventListener('keydown',function(event){if(mq.matches&&(event.key==='Enter'||event.key===' ')){event.preventDefault();title.click();}});});
      new MutationObserver(function(records){if(records.some(function(record){return record.target.classList.contains('elementor-tab-title');}))sync();}).observe(tabs,{subtree:true,attributes:true,attributeFilter:['class']});
      mq.addEventListener('change',sync);sync();
    });
    var grid=document.querySelector('body.page-id-7411 .pxl-grid-inner');
    if(grid){
      function labelImages(){grid.querySelectorAll('.pxl-grid-item').forEach(function(item){var link=item.querySelector('.pxl-img-link'),title=item.querySelector('.pxl-post--title');if(link&&title&&!link.getAttribute('aria-label'))link.setAttribute('aria-label','Read '+title.textContent.trim());});}
      labelImages();new MutationObserver(labelImages).observe(grid,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
