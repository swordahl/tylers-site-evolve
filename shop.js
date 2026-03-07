async function loadShop(){

const res = await fetch("/content/shop.json");
const data = await res.json();

const grid = document.getElementById("shop-grid");

if(!data.items) return;

data.items.forEach(item => {

```
const artifact = document.createElement("div");
artifact.className = "artifact";

artifact.innerHTML = `
  <img class="artifact-border" src="/assets/shop-border/shop-border1.png">

  <img class="artifact-product" src="${item.image}">

  <div class="artifact-name">${item.name}</div>

  <div class="artifact-price">${item.price} gold</div>
`;

grid.appendChild(artifact);
```

});

}

loadShop();
