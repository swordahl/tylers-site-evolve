async function loadShop(){

const response = await fetch("/content/shop/index.json");
const data = await response.json();

if(!data.items || data.items.length === 0) return;

const item = data.items[0];

document.querySelector(".relic-product").src = item.image;

document.querySelector(".character-name").textContent = item.name;

document.querySelector(".character-stats").textContent = item.stats;

document.querySelector(".character-description").textContent = item.desc;

document.querySelector(".character-buy").textContent =
"Acquire Relic - " + item.price + " gold";

}

loadShop();




/* NPC dialogue typing */

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
