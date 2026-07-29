const params = new URLSearchParams(window.location.search);
const editMode = params.get("edit") === "true";

if (editMode) {
  document.body.classList.add("edit-mode");
}


/* ============================= */
/* LOAD LAYOUT */
/* ============================= */

async function loadLayout() {
  try {
    const res = await fetch("/content/shop/layout.json");
    const layout = await res.json();

    Object.keys(layout).forEach(id => {
      const el = document.querySelector(`[data-id="${id}"]`);
      if (!el) return;
      Object.assign(el.style, layout[id]);
    });

  } catch (e) {
    console.log("layout not found");
  }
}

loadLayout();


/* ============================= */
/* LOAD SHOP ITEMS */
/* ============================= */

let relics = [];
async function loadShop() {
  try {
    const res = await fetch("/content/shop/index.json");
    const data = await res.json();

    if (!data.items || data.items.length === 0) return;

    relics = data.items;

    renderRelic(0);
    buildDropdown();
    renderMobile();

  } catch (e) {
    console.log("shop load failed");
  }
}

loadShop();


/* ============================= */
/* STRIPE CHECKOUT */
/* ============================= */

async function buyRelic(name, price, index) {
  try {
    const res = await fetch("/.netlify/functions/create-checkout", {
      method: "POST",
      body: JSON.stringify({ name, price }),
    });

    const data = await res.json();

    if (data.url) {
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

function renderShop() {

    const shop = document.getElementById("shopList");

    if (!shop) return;

    shop.innerHTML = "";

    relics.forEach((item, index) => {

        const article = document.createElement("article");
        article.className = "shop-item";

        const sold = item.sold === true;

        article.innerHTML = `

            <img
                class="shop-image"
                src="${item.image}"
                alt="${item.name || ""}">

            <h2 class="shop-title">
                ${item.name || ""}
            </h2>

            <div class="shop-stats">
                ${item.stats || ""}
            </div>

            <p class="shop-description">
                ${item.desc || ""}
            </p>

            <button class="acquire-button">
                ${
                    sold
                        ? "SOLD"
                        : `Acquire Relic — ${item.price || 0} Gold`
                }
            </button>

        `;

        const button = article.querySelector(".acquire-button");

        if (sold || !item.price) {

            button.disabled = true;
            button.style.opacity = ".45";
            button.style.cursor = "not-allowed";

            article.querySelector(".shop-image").style.filter = "grayscale(1)";

        } else {

            button.onclick = () => {

                buyRelic(
                    item.name,
                    Math.round(item.price * 100),
                    index
                );

            };

        }

        shop.appendChild(article);

    });

}
