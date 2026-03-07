/* EDIT MODE */

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

console.log("no layout yet");

}

}

loadLayout();



/* DRAGGING */

if(editMode){

document.querySelectorAll(".ui-box").forEach(el=>{

let offsetX=0;
let offsetY=0;
let dragging=false;

el.addEventListener("mousedown",e=>{

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

console.log("SAVE THIS JSON:");

console.log(JSON.stringify(layout,null,2));

alert("Layout JSON printed in console. Copy it into layout.json");

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
