const gridEl = document.getElementById('grid');
const countEl = document.getElementById('count');
const rowsRange = document.getElementById('rowsRange');
const colsRange = document.getElementById('colsRange');
const sizeRange = document.getElementById('sizeRange');
const rowsVal = document.getElementById('rowsVal');
const colsVal = document.getElementById('colsVal');
const sizeVal = document.getElementById('sizeVal');
const resetBtn = document.getElementById('resetBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const soundToggle = document.getElementById('soundToggle');
const regenBtn = document.getElementById('regenBtn');

let rows = parseInt(rowsRange.value,10);
let cols = parseInt(colsRange.value,10);
let bubbleSize = parseInt(sizeRange.value,10);
let poppedCount = 0;
let pointerDown = false;
let soundOn = true;

const clamp = (v,min,max)=> Math.max(min, Math.min(max, v));

function applySize(){
  document.documentElement.style.setProperty('--bubble-size', bubbleSize+'px');
}
applySize();

// Web Audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function ensureAudio(){ if(!audioCtx) audioCtx = new AudioContext(); }
function playPop(){
  if(!soundOn) return;
  try{
    ensureAudio();
    const now = audioCtx.currentTime;
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass'; filter.frequency.value = 900;
    gain.gain.value = 0.0001;
    gain.connect(filter); filter.connect(audioCtx.destination);

    const osc = audioCtx.createOscillator();
    osc.type = 'triangle'; osc.frequency.value = 800;
    osc.connect(gain);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.start(now); osc.stop(now + 0.11);
  }catch(e){}
}

function createGrid(r, c, shuffle=false){
  gridEl.innerHTML = '';
  poppedCount = 0;
  updateCount();
  gridEl.style.gridTemplateColumns = `repeat(${c}, minmax(var(--bubble-size), 1fr))`;

  const total = r * c;
  const order = Array.from({length: total}, (_,i)=>i);
  if(shuffle){
    for(let i=order.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [order[i], order[j]]=[order[j], order[i]];
    }
  }

  for(let i=0;i<total;i++){
    const btn = document.createElement('button');
    btn.className = 'bubble';
    btn.type = 'button';
    if(shuffle){ btn.style.order = order[i]; }
    btn.addEventListener('pointerdown', e => { e.preventDefault(); pointerDown = true; popBubble(btn); });
    btn.addEventListener('pointerenter', e => { if(pointerDown) popBubble(btn); });
    btn.addEventListener('pointerup', ()=> pointerDown=false);
    btn.addEventListener('pointercancel', ()=> pointerDown=false);
    gridEl.appendChild(btn);
  }
}

// Pop + auto-respawn
function popBubble(el){
  if(!el || el.classList.contains('popped')) return;
  el.classList.add('popped','pop-anim');
  setTimeout(()=> el.classList.remove('pop-anim'), 420);
  playPop();
  poppedCount++;
  updateCount();

  const delay = 800 + Math.random()*1500; // 0.8–2.3s
  setTimeout(()=> el.classList.remove('popped'), delay);
}

function updateCount(){ countEl.textContent = `Popped: ${poppedCount}`; }

// Controls
rowsRange.addEventListener('input', e=>{
  rows = clamp(parseInt(e.target.value,10)||6, 3, 28);
  rowsVal.textContent = rows;
  createGrid(rows, cols, true);
});
colsRange.addEventListener('input', e=>{
  cols = clamp(parseInt(e.target.value,10)||10, 3, 40);
  colsVal.textContent = cols;
  createGrid(rows, cols, true);
});
sizeRange.addEventListener('input', e=>{
  bubbleSize = clamp(parseInt(e.target.value,10)||64, 28, 140);
  sizeVal.textContent = bubbleSize;
  applySize();
});
resetBtn.addEventListener('click', ()=> createGrid(rows, cols, false));
regenBtn.addEventListener('click', ()=> createGrid(rows, cols, true));
fullscreenBtn.addEventListener('click', async ()=>{
  const el = document.documentElement;
  if (!document.fullscreenElement) { try { await el.requestFullscreen(); } catch(e){} }
  else { try { await document.exitFullscreen(); } catch(e){} }
});
soundToggle.addEventListener('click', ()=>{
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? 'Sound: On' : 'Sound: Off';
  soundToggle.classList.toggle('ghost', !soundOn);
});

window.addEventListener('pointerup', ()=> pointerDown = false);
window.addEventListener('pointercancel', ()=> pointerDown = false);
window.addEventListener('keydown', e=>{
  if(e.code === 'Space' && !/input|textarea/i.test(document.activeElement?.tagName)){
    e.preventDefault(); createGrid(rows, cols, false);
  }
});
document.addEventListener('click', ()=> {
  try{ if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); }catch(e){}
}, {once:true});

// Initial render
rowsVal.textContent = rows;
colsVal.textContent = cols;
sizeVal.textContent = bubbleSize;
createGrid(rows, cols, true);
soundToggle.textContent = soundOn ? 'Sound: On' : 'Sound: Off';
