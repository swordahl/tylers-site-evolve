async function loadShop(){

const res = await fetch("/content/shop/index.json");
const data = await res.json();

const wall = document.querySelector(".relic-wall");

data.items.forEach(item => {

const frame = document.createElement("section");
frame.className = "relic-frame";

frame.innerHTML = `

<img src="/assets/shop-border/shop-border${item.border}.png" class="border-art">

<img src="${item.image}" class="relic-product">

`;

wall.appendChild(frame);

});

}

loadShop();
