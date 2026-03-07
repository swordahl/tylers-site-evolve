async function loadShop(){

const response = await fetch("/content/shop/index.json");
const data = await response.json();

const wall = document.querySelector(".relic-wall");

data.items.forEach(item => {

const frame = document.createElement("div");
frame.className = "relic-frame";

frame.innerHTML = `
<img src="/assets/shop-border/shop-border1.png" class="border-art">

<div class="relic-safezone">
<img src="${item.image}" class="relic-product">
</div>
`;

wall.appendChild(frame);

});

}

loadShop();
