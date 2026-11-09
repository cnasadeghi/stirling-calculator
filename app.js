const $=s=>document.querySelector(s);
let kind='second',busy=false,last='25';
const fa=x=>String(x).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const normalize=s=>s.trim().replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)));
function setKind(next){kind=next;document.querySelectorAll('[data-kind]').forEach(b=>{b.classList.toggle('active',b.dataset.kind===kind);b.setAttribute('aria-pressed',b.dataset.kind===kind)});$('.signed').hidden=kind!=='first';$('#kind-help').textContent=kind==='second'?'افراز n عضو متمایز به k گروه ناتهی، بدون اهمیت ترتیب گروه‌ها.':'جایگشت n عضو متمایز با دقیقاً k دور؛ پیش‌فرض بدون علامت.';}
function render(n,k,signed){
  const answer=stirling(n,k,kind,signed),symbol=kind==='second'?'S':signed?'s':'c';last=String(answer);
  $('#notation').textContent=`${symbol}(${n}, ${k})`;
  $('#answer').textContent=last;$('#answer').classList.toggle('long',last.length>15);
  $('#caption').textContent=kind==='second'?`راه برای افراز ${fa(n)} عضو به ${fa(k)} گروه ناتهی`:signed?'مقدار استرلینگ نوع اول با قرارداد علامت‌دار':`جایگشتِ ${fa(n)} عضو با دقیقاً ${fa(k)} دور`;
  let text='',formula='';
  if(n===0&&k===0){text='مجموعهٔ تهی فقط یک افراز تهی و یک جایگشت تهی دارد.';formula=`${symbol}(0,0) = 1`;}
  else if(k>n){text='تعداد گروه‌ها یا دورهای ناتهی نمی‌تواند از تعداد عضوها بیشتر باشد.';formula=`${symbol}(${n},${k}) = 0`;}
  else if(k===0){text='مجموعهٔ غیرتهی را نمی‌توان به صفر گروه یا صفر دور تقسیم کرد.';formula=`${symbol}(${n},0) = 0`;}
  else{const a=stirling(n-1,k-1,kind,signed),b=stirling(n-1,k,kind,signed),m=kind==='second'?k:n-1,op=signed&&kind==='first'?'−':'+';text=kind==='second'?'عضو آخر دو انتخاب دارد: تنها یک گروه تازه بسازد، یا به یکی از گروه‌های قبلی بپیوندد. تعداد دو حالت را جمع می‌کنیم.':'عضو آخر یا دوری تازه می‌سازد، یا پس از یکی از عضوهای قبلی در دورها قرار می‌گیرد.';formula=`${symbol}(${n},${k}) = ${symbol}(${n-1},${k-1}) ${op} ${m} × ${symbol}(${n-1},${k})`;if(String(a).length+String(b).length<120)formula+=` = ${a} ${op} ${m} × (${b}) = ${answer}`;}
  $('#steps').replaceChildren();const p=document.createElement('p');p.textContent=text;const f=document.createElement('div');f.className='formula';f.textContent=formula;$('#steps').append(p,f);renderTable(n,k,signed);
}
function renderTable(n,k,signed){
  let html='<thead><tr><th scope="col">n / k</th>';
  for(let j=0;j<=10;j++)html+=`<th scope="col" class="${j===k?'axis-active':''}">${j}</th>`;
  html+='</tr></thead><tbody>';
  for(let i=0;i<=10;i++){
    html+=`<tr style="--row:${i}"><th scope="row" class="${i===n?'axis-active':''}">${i}</th>`;
    for(let j=0;j<=10;j++){
      const value=j<=i?stirling(i,j,kind,signed):0n;
      const classes=[i===n&&j===k?'selected':'',j>i?'empty':'',i===n||j===k?'axis':'',value===0n?'zero':''].filter(Boolean).join(' ');
      html+=`<td class="${classes}"><button type="button" data-cell="${i},${j}" ${i===n&&j===k?'aria-current="true"':''} aria-label="محاسبه برای n برابر ${i} و k برابر ${j}">${j<=i?value:'·'}</button></td>`;
    }
    html+='</tr>';
  }
  $('#table').innerHTML=html+'</tbody>';
}
document.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>{if(!busy){setKind(b.dataset.kind);$('#form').requestSubmit();}}));
$('#form').addEventListener('submit',async e=>{e.preventDefault();if(busy)return;let a=normalize($('#n').value),b=normalize($('#k').value);if(!/^\d+$/.test(a)||!/^\d+$/.test(b)||Number(a)>500||Number(b)>500){$('#error').textContent='برای n و k عدد صحیح بین ۰ تا ۵۰۰ وارد کن.';return;}$('#error').textContent='';busy=true;$('#calculate').disabled=true;$('#result').hidden=true;$('#loading').hidden=false;$('#calculator').setAttribute('aria-busy','true');const n=Number(a),k=Number(b),signed=$('#signed').checked;await new Promise(r=>setTimeout(r,1500));try{render(n,k,signed);}finally{busy=false;$('#calculate').disabled=false;$('#loading').hidden=true;$('#result').hidden=false;$('#calculator').removeAttribute('aria-busy');}});
document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{if(busy)return;const[n,k,t]=b.dataset.example.split(',');setKind(t);$('#signed').checked=false;$('#n').value=n;$('#k').value=k;$('#form').requestSubmit();}));
$('#table').addEventListener('click',e=>{const b=e.target.closest('[data-cell]');if(!b||busy)return;const[n,k]=b.dataset.cell.split(',');$('#n').value=n;$('#k').value=k;$('#form').requestSubmit();$('#calculator').scrollIntoView({behavior:'smooth'});});
$('#signed').addEventListener('change',()=>{if(!busy)$('#form').requestSubmit();});
render(5,3,false);

const motion=matchMedia('(prefers-reduced-motion: reduce)');
const sections=document.querySelectorAll('.hero,.workspace,.table-section,.learn,.cards article');
if(!motion.matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08});
  sections.forEach((section,i)=>{section.classList.add('reveal');section.style.setProperty('--delay',`${section.matches('article')?(i%3)*85:0}ms`);observer.observe(section);});
}
