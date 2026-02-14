

(function(){

const canvas=document.getElementById('matrix');

if(!canvas) return;

const ctx=canvas.getContext('2d');

let fontSize=14;
let columns;
let drops;

const chars="01アカサタナハマヤラワ";

function initMatrix(){

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

columns=Math.floor(canvas.width/fontSize);

drops=Array(columns).fill(1);

}

function drawMatrix(){

ctx.fillStyle='rgba(0,0,0,0.05)';
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle='#00ffcc';
ctx.font=fontSize+"px monospace";

for(let i=0;i<drops.length;i++){

const text=chars[Math.floor(Math.random()*chars.length)];

ctx.fillText(text,i*fontSize,drops[i]*fontSize);

if(drops[i]*fontSize>canvas.height && Math.random()>0.975)
drops[i]=0;

drops[i]++;

}

}

initMatrix();

setInterval(drawMatrix,50);

window.addEventListener("resize",initMatrix);

})();

/* ================================
TERMINAL FAKE BOOT LOG
================================ */

(function(){

if(typeof queue==="undefined") return;

const bootSequence=[

"root@RKPexecutor:~# initializing kernel...",
"[ OK ] memory access granted",

"[ OK ] bypassing sandbox...",
"[ OK ] injecting executor core",

"[ OK ] loading control modules...",
"[ OK ] establishing root authority",

"root@RKPexecutor:~# _"

];

bootSequence.forEach(line=>{
queue.push(line);
});

if(typeof typeNext==="function")
typeNext();

})();
