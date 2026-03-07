async function loadShop() {

  try {

    const response = await fetch("/content/shop/index.json");
    const data = await response.json();

    const display = document.querySelector(".shop-display");

    data.items.forEach(item => {

      const frame = document.createElement("div");
      frame.className = "relic";

      frame.style.position = "absolute";
      frame.style.left = item.x + "%";
      frame.style.top = item.y + "%";
      frame.style.transform = "translate(-50%, -50%)";

      const border = document.createElement("img");
      border.src = "/assets/shop-border/shop-border" + item.border + ".png";
      border.className = "relic-border";

      frame.appendChild(border);

      display.appendChild(frame);

    });

  } catch (error) {

    console.error("Shop failed:", error);

  }

}

document.addEventListener("DOMContentLoaded", loadShop);
