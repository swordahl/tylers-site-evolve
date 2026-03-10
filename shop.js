const params = new URLSearchParams(window.location.search);
const editMode = params.get("edit") === "true";

if(editMode){
document.body.classList.add("edit-mode");
}


/* LOAD LAYOUT */

async function loadLayout(){

try{

const res = await fetch("/content/shop/layout.json");
const layout = await res.json();

Object.keys(layout).forEach(id=>{

const el = document.querySelector(`[data-id="${id}"]`);
if(!el) return;

Object.assign(el.style, layout[id]);

});

}catch(e){

console.log("layout not found");

}

}

loadLayout();



/* LOAD SHOP ITEM */

let relics=[];

async function loadShop(){

try{

const res = await fetch("/content/shop/index.json");
const data = await res.json();

if(!data.items || data.items.length===0) return;

relics=data.items;

renderRelic(0);   // show first relic
buildDropdown();

}catch(e){

console.log("shop load failed");

}

}

loadShop();



/* RENDER RELIC */

function renderRelic(index){

const item=relics[index];

document.getElementById("relicName").textContent=item.name||"";
document.getElementById("relicStats").textContent=item.stats||"";
document.getElementById("relicDesc").textContent=item.desc||"";

document.getElementById("relicBuy").textContent=
"Acquire Relic - "+(item.price||0)+" gold";

const img=document.getElementById("relicImage");

if(img){
img.src=item.image;
}

}



/* BUILD DROPDOWN */

function buildDropdown(){

const list=document.getElementById("questerList");

list.innerHTML="";

relics.forEach((item,index)=>{

const el=document.createElement("div");

el.className="quester";
el.textContent=item.name;

el.onclick=()=>{

renderRelic(index);

};

list.appendChild(el);

});

}



/* DRAG SYSTEM */

if(editMode){

document.querySelectorAll(".ui-box").forEach(el=>{

let offsetX=0;
let offsetY=0;
let dragging=false;

el.addEventListener("mousedown",e=>{

if(el.classList.contains("locked")) return;

dragging=true;

offsetX=e.clientX-el.offsetLeft;
offsetY=e.clientY-el.offsetTop;

});

document.addEventListener("mousemove",e=>{

if(!dragging) return;

el.style.left=(e.clientX-offsetX)+"px";
el.style.top=(e.clientY-offsetY)+"px";

});

document.addEventListener("mouseup",()=>{

dragging=false;

});

});

}



/* LOCK BUTTON */

document.querySelectorAll(".lock-btn").forEach(btn=>{

btn.onclick=(e)=>{

e.stopPropagation();

const box=btn.parentElement;

box.classList.toggle("locked");

};

});



/* RESIZE */

if(editMode){

document.querySelectorAll(".resize-handle").forEach(handle=>{

const box=handle.parentElement;

let resizing=false;

handle.addEventListener("mousedown",e=>{

if(box.classList.contains("locked")) return;

e.stopPropagation();

resizing=true;

});

document.addEventListener("mousemove",e=>{

if(!resizing) return;

box.style.width=e.clientX-box.offsetLeft+"px";
box.style.height=e.clientY-box.offsetTop+"px";

});

document.addEventListener("mouseup",()=>{

resizing=false;

});

});

}



/* SAVE LAYOUT */

if(editMode){

document.getElementById("saveLayout").onclick=()=>{

const layout={};

document.querySelectorAll(".ui-box").forEach(el=>{

const id=el.dataset.id;

layout[id]={

left:el.style.left,
top:el.style.top,
width:el.style.width,
height:el.style.height

};

});

console.log(JSON.stringify(layout,null,2));

alert("Layout JSON printed in console");

};

}



/* QUESTERS DROPDOWN */

const toggle=document.getElementById("questerToggle");
const dropdownList=document.getElementById("questerList");

if(toggle){

toggle.onclick=()=>{

if(dropdownList.style.display==="none"){
dropdownList.style.display="block";
}else{
dropdownList.style.display="none";
}

};

}



/* NPC TYPEWRITER */

const text="Ah… another relic uncovered within Sentia.";

let i=0;

function type(){

if(i<text.length){

document.getElementById("npcText").innerHTML+=text.charAt(i);

i++;

setTimeout(type,30);

}

}

type();
/* MOBILE MODE */

.mobile-shop{
display:none;
position:fixed;
top:0;
left:0;
width:100vw;
height:100vh;
background:#8b0000;
align-items:center;
justify-content:center;
flex-direction:column;
}

/* relic frame */

.mobile-frame{
position:relative;
width:70vw;
max-width:320px;
}

.mobile-frame::before{
content:"";
position:absolute;
inset:0;
background:url("/assets/shop-border/shop-border1.png") center/contain no-repeat;
pointer-events:none;
}

/* relic */

.mobile-relic{
width:100%;
height:auto;
object-fit:contain;
}

/* arrows */

.arrow{
position:absolute;
top:50%;
transform:translateY(-50%);
font-size:40px;
background:none;
border:none;
color:white;
cursor:pointer;
}

.arrow-left{
left:20px;
}

.arrow-right{
right:20px;
}
