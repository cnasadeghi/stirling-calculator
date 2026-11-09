const finePointer=matchMedia('(min-width:601px) and (hover:hover) and (pointer:fine)');
let cursorFrame=0,cursorTarget={x:-100,y:-100},cursorCurrent={x:-100,y:-100},cursorDot,cursorRing;
function stopCursor(){cancelAnimationFrame(cursorFrame);cursorFrame=0;document.documentElement.classList.remove('cursor-active');cursorDot?.classList.remove('on');cursorRing?.classList.remove('on');}
function drawCursor(){
  cursorCurrent.x+=(cursorTarget.x-cursorCurrent.x)*.19;
  cursorCurrent.y+=(cursorTarget.y-cursorCurrent.y)*.19;
  cursorDot.style.transform=`translate3d(${cursorTarget.x-3.5}px,${cursorTarget.y-3.5}px,0)`;
  cursorRing.style.transform=`translate3d(${cursorCurrent.x}px,${cursorCurrent.y}px,0) translate(-50%,-50%)`;
  if(Math.abs(cursorTarget.x-cursorCurrent.x)+Math.abs(cursorTarget.y-cursorCurrent.y)>.1)cursorFrame=requestAnimationFrame(drawCursor);else cursorFrame=0;
}
function enableCursor(){
  if(motion.matches||!finePointer.matches){stopCursor();return;}
  if(!cursorDot){
    cursorDot=document.createElement('div');cursorRing=document.createElement('div');
    cursorDot.className='cursor-dot';cursorRing.className='cursor-ring';
    cursorDot.setAttribute('aria-hidden','true');cursorRing.setAttribute('aria-hidden','true');document.body.append(cursorDot,cursorRing);
  }
}
enableCursor();finePointer.addEventListener('change',enableCursor);motion.addEventListener('change',enableCursor);
document.addEventListener('pointermove',e=>{
  if(e.pointerType!=='mouse'||!cursorDot||motion.matches||!finePointer.matches)return;
  if(!cursorDot.classList.contains('on')){cursorCurrent.x=e.clientX;cursorCurrent.y=e.clientY;}
  cursorTarget.x=e.clientX;cursorTarget.y=e.clientY;
  cursorDot.classList.add('on');cursorRing.classList.add('on');document.documentElement.classList.add('cursor-active');
  cursorRing.classList.toggle('hovering',!!e.target.closest('button,a,input,.cards article,.table-scroll'));
  if(!cursorFrame)cursorFrame=requestAnimationFrame(drawCursor);
},{passive:true});
document.addEventListener('pointerleave',stopCursor);window.addEventListener('blur',stopCursor);
document.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&!motion.matches)cursorRing?.classList.add('pressing');});
window.addEventListener('pointerup',()=>cursorRing?.classList.remove('pressing'));
document.querySelectorAll('.cards article').forEach(card=>{
  let frame=0,point=null;
  card.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse'||motion.matches||!finePointer.matches)return;
    const box=card.getBoundingClientRect();point={x:Math.max(0,Math.min(1,(e.clientX-box.left)/box.width)),y:Math.max(0,Math.min(1,(e.clientY-box.top)/box.height))};
    if(frame)return;
    frame=requestAnimationFrame(()=>{card.classList.add('tilting');card.style.setProperty('--rx',`${(point.y-.5)*-18}deg`);card.style.setProperty('--ry',`${(point.x-.5)*20}deg`);card.style.setProperty('--hx',`${point.x*100}%`);card.style.setProperty('--hy',`${point.y*100}%`);frame=0;});
  },{passive:true});
  card.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);frame=0;card.classList.remove('tilting');card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');});
});
document.addEventListener('click',e=>{
  if(motion.matches)return;
  const button=e.target.closest('button');
  if(button&&!button.disabled){const box=button.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='ripple';ripple.setAttribute('aria-hidden','true');ripple.style.left=`${e.detail?e.clientX-box.left:box.width/2}px`;ripple.style.top=`${e.detail?e.clientY-box.top:box.height/2}px`;button.append(ripple);setTimeout(()=>ripple.remove(),700);}
  if(!e.detail)return;
  const wave=document.createElement('span');wave.className='click-wave';wave.setAttribute('aria-hidden','true');wave.style.left=`${e.clientX}px`;wave.style.top=`${e.clientY}px`;document.body.append(wave);setTimeout(()=>wave.remove(),700);
  for(let i=0;i<6;i++){const spark=document.createElement('span'),angle=i*Math.PI/3;spark.className='click-spark';spark.setAttribute('aria-hidden','true');spark.style.left=`${e.clientX}px`;spark.style.top=`${e.clientY}px`;spark.style.setProperty('--dx',`${Math.cos(angle)*34}px`);spark.style.setProperty('--dy',`${Math.sin(angle)*34}px`);document.body.append(spark);setTimeout(()=>spark.remove(),650);}
});
new MutationObserver(()=>{if(!$('#result').hidden&&!motion.matches){const panel=$('.result-panel');panel.classList.remove('celebrate');requestAnimationFrame(()=>panel.classList.add('celebrate'));}}).observe($('#result'),{attributes:true,attributeFilter:['hidden']});
