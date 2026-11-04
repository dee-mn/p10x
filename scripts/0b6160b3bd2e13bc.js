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
    '⏸':'M8 5v14M16 5v14'
  };
  var skip='script,style,textarea,input,select,option,svg,code,pre,[contenteditable],.elementor-screen-only,.screen-reader-text,[data-p10x-keep-symbol]';
  var ns='http://www.w3.org/2000/svg';
  function replace(node){
    var parent=node.parentElement;
    if(!parent||parent.closest(skip))return;
    var expression=parent.closest('button,.p10x-motion,[aria-hidden="true"]')?/[↗↖↘↙↓↑←→▷▶Ⅱ⏸][\uFE0E\uFE0F]?/g:/[↗↖↘↙↓↑←→][\uFE0E\uFE0F]?/g;
    if(!expression.test(node.nodeValue))return;
    expression.lastIndex=0;
    var value=node.nodeValue,fragment=document.createDocumentFragment(),offset=0,match;
    while((match=expression.exec(value))){
      if(match.index>offset)fragment.appendChild(document.createTextNode(value.slice(offset,match.index)));
      var glyph=match[0].charAt(0),svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
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
