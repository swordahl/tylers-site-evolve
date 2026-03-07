async function loadShop() {

try {

```
const response = await fetch("/content/shop/index.json");
const data = await response.json();

const grid = document.getElementById("shop-grid");

// clear grid
grid.innerHTML = "";

if (!data.items || data.items.length === 0) {
  grid.innerHTML = "<p>No artifacts available yet.</p>";
  return;
}

data.items.forEach(item => {

  const artifact = document.createElement("div");
  artifact.className = "artifact";

  artifact.innerHTML = `
    <img class="artifact-border" src="/assets/shop-border/shop-border1.png">

    <img class="artifact-product" src="${item.image}" alt="${item.name}">

    <div class="artifact-name">${item.name}</div>

    <div class="artifact-price">${item.price} gold</div>
  `;

  grid.appendChild(artifact);

});
```

} catch (error) {
console.error("Shop failed to load:", error);
}

}

document.addEventListener("DOMContentLoaded", loadShop);

