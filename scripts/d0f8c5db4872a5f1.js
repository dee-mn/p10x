(function(){let tries=0,owned;function fit(){const root=document.querySelector('.elementor-element-4e129bf'),section=root?.querySelector('.pxl-video-sticky1'),wrap=root?.querySelector('.pxl-item--bg'),inner=root?.querySelector('.pxl-video-inner'),toggle=root?.querySelector('.pxl-video-toggle');if(!section||!window.gsap||!window.ScrollTrigger){if(++tries<30)setTimeout(fit,200);return;}
if(innerWidth<=1280){if(owned){owned.scrollTrigger?.kill();owned.kill();owned=null;gsap.set(wrap,{clearProps:'width,height,transform'});}return;}
if(owned&&ScrollTrigger.getAll().includes(owned.scrollTrigger)){owned.scrollTrigger.refresh();return;}
const native=ScrollTrigger.getAll().find(t=>t.trigger===section&&t.animation);if(!native){if(++tries<30)setTimeout(fit,200);return;}
native.animation.kill();native.kill();
const centerX=()=>{const r=wrap.parentElement.getBoundingClientRect();return document.documentElement.clientWidth/2-r.left-r.width/2;};
const centerY=()=>{const p=wrap.parentElement.getBoundingClientRect(),r=inner.getBoundingClientRect();return r.top+r.height/2-p.top-p.height/2;};
gsap.set(wrap,{position:'absolute',top:'50%',left:'50%',xPercent:-50,yPercent:-50,x:0,y:0,width:190,height:110,force3D:true});
owned=gsap.timeline({scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.5,invalidateOnRefresh:true}});
owned.fromTo(wrap,{width:190,height:110,x:0,y:0,xPercent:-50,yPercent:-50},{width:()=>document.documentElement.clientWidth*.88,height:()=>inner.clientHeight*.72,x:centerX,y:centerY,xPercent:-50,yPercent:-50,duration:.65,ease:'none',immediateRender:true},0);
owned.to(wrap,{width:()=>document.documentElement.clientWidth,height:()=>inner.clientHeight,x:centerX,y:centerY,duration:.2,ease:'none'},.65);
if(toggle)owned.fromTo(toggle,{opacity:0},{opacity:1,duration:.1,ease:'none'},.18);
owned.to({hold:0},{hold:1,duration:.15},.85);
owned.scrollTrigger.refresh();
}
if(document.readyState==='complete')fit();else window.addEventListener('load',fit,{once:true});
let timer;window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(()=>{tries=0;fit();},300);},{passive:true});
})();