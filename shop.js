/* ================================= */
/* EDIT MODE DETECTION */
/* ================================= */

const params = new URLSearchParams(window.location.search);
const editMode = params.get("edit") === "true";

if(editMode){
document.body.classList.add("edit-mode");
}



/* ================================= */
/* DRAG SYSTEM */
/* ================================= */

if(editMode){

document.querySelectorAll(".ui-box").forEach(el => {

let offsetX = 0;
let offsetY = 0;
let isDragging = false;

el.addEventListener("mousedown", e => {

isDragging = true;

offsetX = e.clientX - el.offsetLeft;
offsetY = e.clientY - el.offsetTop;

document.body.style.userSelect = "none";

});

document.addEventListener("mousemove", e => {

if(!isDragging) return;

el.style.left = (e.clientX - offsetX) + "px";
el.style.top = (e.clientY - offsetY) + "px";

});

document.addEventListener("mouseup", () => {

isDragging = false;

document.body.style.userSelect = "auto";

});

});

}



/* ================================= */
/* NPC TYPING */
/* ================================= */

const text = "Ah… another relic uncovered within Sentia.";

let i = 0;

function type(){

if(i < text.length){

document.getElementById("npcText").innerHTML += text.charAt(i);

i++;

setTimeout(type,30);

}

}

type();
