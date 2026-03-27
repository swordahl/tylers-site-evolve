const params = new URLSearchParams(window.location.search);
const editMode = params.get("edit") === "true";

if(editMode){
  document.body.classList.add("edit-mode");
}


/* ============================= */
/* SOLD SYSTEM STORAGE */
/* ============================= */

let soldRelics = JSON.parse(localStorage.getItem("soldRelics") || "[]");

/* detect successful purchase return */
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get("success")) {
  const boughtIndex = localStorage.getItem("pendingRelic");

  if (boughtIndex !== null) {
    soldRelics.push(parseInt(boughtIndex));
    localStorage.setItem("soldRelics", JSON.stringify(soldRelics));

    localStorage.removeItem("pendingRelic");
  }
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
/* STRIPE CHECKOUT FUNCTION */
/* ============================= */

async function buyRelic(name, price, index) {
  try {
    const res = await fetch("/.netlify/functions/create-checkout", {
      method: "POST",
      body: JSON.stringify({ name, price }),
    });

    const data = await res.json();

    if (data.url) {
      localStorage.setItem("pendingRelic", index);
      window.location.href = data.url;
    } else {
      alert("Checkout failed");
      console.error(data);
    }

  } catch (err) {
    console.error(err);
    alert("Error connecting to checkout");
  }
}



/* ============================= */
/* DESKTOP RELIC RENDER */
/* ============================= */

function renderRelic(index){

  const item = relics[index];

  document.getElementById("relicName").textContent = item.name || "";
  document.getElementById("relicStats").textContent = item.stats || "";
  document.getElementById("relicDesc").textContent = item.desc || "";

  const buyBtn = document.getElementById("relicBuy");

  const isSold = soldRelics.includes(index);

  if (isSold) {
    buyBtn.textContent = "SOLD";
    buyBtn.style.opacity = "0.4";
    buyBtn.style.cursor = "not-allowed";
    buyBtn.onclick = null;

  } else {

    buyBtn.textContent =
    "Acquire Relic - " + (item.price || 0) + " gold";

    if(item.price){

      buyBtn.style.opacity = "1";
      buyBtn.style.cursor = "pointer";

      buyBtn.onclick = () => {
        const priceInCents = Math.round(item.price * 100);
        buyRelic(item.name, priceInCents, index);
      };

    }else{

      buyBtn.style.opacity = "0.5";
      buyBtn.style.cursor = "not-allowed";
      buyBtn.onclick = null;

    }
  }


  /* IMAGE */

  const img = document.getElementById("relicImage");

  if(img){
    img.src = item.image;

    if(isSold){
      img.style.filter = "grayscale(1)";
    } else {
      img.style.filter = "none";
    }
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

  const img = document.getElementById("mobileRelic");
  if(img) img.src = item.image;

  const name = document.getElementById("mobileName");
  if(name) name.textContent = item.name || "";

  const stats = document.getElementById("mobileStats");
  if(stats) stats.textContent = item.stats || "";

  const desc = document.getElementById("mobileDesc");
  if(desc) desc.textContent = item.desc || "";

  const buyBtn = document.getElementById("mobileBuy");

  const isSold = soldRelics.includes(currentRelic);

  if (isSold) {
    buyBtn.textContent = "SOLD";
    buyBtn.style.opacity = "0.4";
    buyBtn.style.cursor = "not-allowed";
    buyBtn.onclick = null;

  } else {

    buyBtn.textContent =
    "Acquire Relic - " + (item.price || 0) + " gold";

    if(item.price){

      buyBtn.style.opacity = "1";
      buyBtn.style.cursor = "pointer";

      buyBtn.onclick = () => {
        const priceInCents = Math.round(item.price * 100);
        buyRelic(item.name, priceInCents, currentRelic);
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
    dropdownList.style.display =
      dropdownList.style.display==="none" ? "block" : "none";
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
