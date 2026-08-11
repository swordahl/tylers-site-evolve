```javascript
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

        renderShop();

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
            body: JSON.stringify({
                name,
                price
            }),
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

        const price = Number(item.price || 0);

        article.innerHTML = `

            <img
                class="shop-image"
                src="${item.image}"
                alt="${item.name || ""}">

            <div class="shop-stats">
                ${item.stats || ""}
            </div>

            <p class="shop-description">
                ${item.desc || ""}
            </p>

            <button
                class="acquire-button"
                type="button">

                ${
                    sold
                        ? "SOLD"
                        : `$${price.toLocaleString("en-US")}`
                }

            </button>

        `;

        const button = article.querySelector(".acquire-button");
        const image = article.querySelector(".shop-image");


        /* ============================= */
        /* SOLD OUT */
        /* ============================= */

        if (sold || !price) {

            button.disabled = true;

            button.style.opacity = ".45";
            button.style.cursor = "not-allowed";

            image.style.filter = "grayscale(1)";

        }


        /* ============================= */
        /* AVAILABLE */
        /* ============================= */

        else {

            button.onclick = () => {

                buyRelic(
                    item.name,
                    Math.round(price * 100),
                    index
                );

            };

        }

        shop.appendChild(article);

    });

}

/* ============================= */
/* HEADER HIDE ON SCROLL */
/* ============================= */

const header = document.querySelector(".archive-header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 80) {

        header.classList.add("hidden");

    } else {

        header.classList.remove("hidden");

    }

});
```
