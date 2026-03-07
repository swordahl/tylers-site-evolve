async function loadShop(){

const response = await fetch("/content/shop/index.json");
const data = await response.json();

const wall = document.querySelector(".relic-wall");

data.items.forEach(item => {

const frame = document.createElement("div");
frame.className = "relic-frame";

const border = document.createElement("img");
border.src = "/assets/shop-border/shop-border1.png";
border.className = "border-art";

const safezone = document.createElement("div");
safezone.className = "relic-safezone";

const product = document.createElement("img");
product.src = item.image;
product.className = "relic-product";

safezone.appendChild(product);

frame.appendChild(border);
frame.appendChild(safezone);

wall.appendChild(frame);

});

}

loadShop();
