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


/* FRAME RENDER SYSTEM */

async function loadShop(){

const frameRes = await fetch("/content/shop/frames.json");
const frameData = await frameRes.json();

const itemRes = await fetch("/content/shop/index.json");
const itemData = await itemRes.json();

const frames = frameData.frames;
const items = itemData.items;

const wall = document.querySelector(".relic-wall");

frames.forEach(frame => {

const frameEl = document.createElement("div");
frameEl.className = "relic-frame";

frameEl.style.width = frame.width + "px";
frameEl.style.height = frame.height + "px";

const border = document.createElement("img");
border.src = frame.image;
border.className = "border-art";

frameEl.appendChild(border);

/* product safe zone */

const zone = document.createElement("div");
zone.className = "product-zone";

zone.style.left = (frame.productZone.x * 100) + "%";
zone.style.top = (frame.productZone.y * 100) + "%";

zone.style.width = (frame.productZone.width * 100) + "%";
zone.style.height = (frame.productZone.height * 100) + "%";

frameEl.appendChild(zone);

/* find items that belong to this frame */

const frameItems = items.filter(i => i.frame === frame.id);

if(frameItems.length > 0){

const item = frameItems[0];

const product = document.createElement("img");
product.src = item.image;
product.className = "relic-product";

zone.appendChild(product);

}

wall.appendChild(frameEl);

});

}

loadShop();

/* DRAG */

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


/* LOCK */

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
width:el.style.width

};

});

console.log(JSON.stringify(layout,null,2));

alert("Layout JSON printed in console");

};

}


/* NPC TEXT */

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
