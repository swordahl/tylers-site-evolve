async function loadShop() {

try {

```
const response = await fetch("/content/shop/index.json");
const data = await response.json();

const grid = document.getElementById("shop-grid");

if (!data.items) return;

data.items.forEach(item => {

  const artifact = document.createElement("div");
  artifact.className = "artifact";

  const border = document.createElement("img");
  border.className = "artifact-border";
  border.src = "/assets/shop-border/shop-border1.png";

  const product = document.createElement("img");
  product.className = "artifact-product";
  product.src = item.image;

  const name = document.createElement("div");
  name.className = "artifact-name";
  name.textContent = item.name;

  const price = document.createElement("div");
  price.className = "artifact-price";
  price.textContent = item.price + " gold";

  artifact.appendChild(border);
  artifact.appendChild(product);
  artifact.appendChild(name);
  artifact.appendChild(price);

  grid.appendChild(artifact);

});
```

} catch (error) {
console.error("Shop failed to load:", error);
}

}

document.addEventListener("DOMContentLoaded", loadShop);
