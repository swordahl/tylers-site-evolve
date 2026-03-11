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



/* LOAD SHOP ITEMS */

let relics=[];
let currentRelic=0;

async function loadShop(){

try{

const res = await fetch("/content/shop/index.json");
const data = await res.json();

if(!data.items || data.items.length===0) return;

relics = data.items;

renderRelic(0);
buildDropdown();
renderMobile();

}catch(e){

console.log("shop load failed");

}

}

loadShop();



/* ============================= */
/* DESKTOP RELIC RENDER */
/* ============================= */

function renderRelic(index){

const item = relics[index];

document.getElementById("relicName").textContent = item.name || "";
document.getElementById("relicStats").textContent = item.stats || "";
document.getElementById("relicDesc").textContent = item.desc || "";

const buyBtn = document.getElementById("relicBuy");

buyBtn.textContent =
"Acquire Relic - " + (item.price || 0) + " gold";


/* ENABLE STRIPE CHECKOUT */

if(item.stripe){

buyBtn.style.opacity = "1";
buyBtn.style.cursor = "pointer";

buyBtn.onclick = () => {

window.open(item.stripe, "_blank");

};

}else{

buyBtn.style.opacity = "0.5";
buyBtn.style.cursor = "not-allowed";
buyBtn.onclick = null;

}


/* IMAGE */

const img = document.getElementById("relicImage");

if(img){
img.src = item.image;
}

}



/* ============================= */
/* BUILD DROPDOWN */
/* ============================= */

function buildDropdown(){

const list = document.getElementById("questerList");

list.innerHTML = "";

relics.forEach((item,index)=>{

const el = document.createElement("div");

el.className = "quester";
el.textContent = item.name;

el.onclick = ()=>{

renderRelic(index);
currentRelic = index;
renderMobile();

};

list.appendChild(el);

});

}



/* ============================= */
/* MOBILE RELIC VIEW */
/* ============================= */

function renderMobile(){

if(relics.length===0) return;

const item = relics[currentRelic];


/* IMAGE */

const img = document.getElementById("mobileRelic");

if(img){
img.src = item.image;
}


/* NAME */

const name = document.getElementById("mobileName");

if(name){
name.textContent = item.name || "";
}


/* STATS */

const stats = document.getElementById("mobileStats");

if(stats){
stats.textContent = item.stats || "";
}


/* DESCRIPTION */

const desc = document.getElementById("mobileDesc");

if(desc){
desc.textContent = item.desc || "";
}


/* BUY BUTTON */

const buyBtn = document.getElementById("mobileBuy");

if(buyBtn){

buyBtn.textContent =
"Acquire Relic - " + (item.price || 0) + " gold";


if(item.stripe){

buyBtn.style.opacity = "1";
buyBtn.style.cursor = "pointer";

buyBtn.onclick = () => {

window.open(item.stripe,"_blank");

};

}else{

buyBtn.style.opacity = "0.5";
buyBtn.style.cursor = "not-allowed";
buyBtn.onclick = null;

}

}

}



/* ============================= */
/* MOBILE ARROWS */
/* ============================= */

document.getElementById("nextRelic")?.addEventListener("click",()=>{

currentRelic++;

if(currentRelic>=relics.length){
currentRelic=0;
}

renderRelic(currentRelic);
renderMobile();

});


document.getElementById("prevRelic")?.addEventListener("click",()=>{

currentRelic--;

if(currentRelic<0){
currentRelic=relics.length-1;
}

renderRelic(currentRelic);
renderMobile();

});



/* ============================= */
/* QUESTERS DROPDOWN */
/* ============================= */

const toggle = document.getElementById("questerToggle");
const dropdownList = document.getElementById("questerList");

if(toggle){

toggle.onclick = ()=>{

if(dropdownList.style.display==="none"){
dropdownList.style.display="block";
}else{
dropdownList.style.display="none";
}

};

}



/* ============================= */
/* NPC TYPEWRITER */
/* ============================= */

const text = "Ah… another relic uncovered within Sentia.";

let i=0;

function type(){

if(i<text.length){

document.getElementById("npcText").innerHTML += text.charAt(i);

i++;

setTimeout(type,30);

}

}

type();
