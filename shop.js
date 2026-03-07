async function loadShop(){

const res = await fetch("/content/shop/index.json");
const data = await res.json();

const layer = document.querySelector(".relic-layer");

data.items.forEach(item => {

const relic = document.createElement("div");
relic.className = "relic";

relic.style.left = item.x + "%";
relic.style.top = item.y + "%";

const img = document.createElement("img");
img.src = "/assets/shop-border/border" + item.border + ".png";

relic.appendChild(img);

layer.appendChild(relic);

});

}

loadShop();
