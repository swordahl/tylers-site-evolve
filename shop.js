async function loadShop() {

  try {

    const response = await fetch("/content/shop/index.json");
    const data = await response.json();

    const display = document.querySelector(".shop-display");

    data.items.forEach(item => {

      const relic = document.createElement("div");
      relic.className = "relic";

      relic.style.left = item.x + "%";
      relic.style.top = item.y + "%";

      const border = document.createElement("img");
      border.className = "relic-border";
      border.src = "/assets/shop-border/shop-border" + item.border + ".png";

      relic.appendChild(border);

      display.appendChild(relic);

    });

  } catch (error) {

    console.error("Shop failed to load:", error);

  }

}

document.addEventListener("DOMContentLoaded", loadShop);
