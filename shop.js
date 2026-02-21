// ===== ADMIN CONTROLLED SHOP SYSTEM (INDEX VERSION) =====

const itemImage = document.getElementById("itemImage");
const changeBtn = document.getElementById("changeItemBtn");

const itemName = document.getElementById("itemName");
const itemStats = document.getElementById("itemStats");
const itemDesc = document.getElementById("itemDesc");

const itemPrice = document.getElementById("itemPrice");
const buyBtn = document.getElementById("buyBtn");

let items = [];
let currentItem = 0;

async function loadShopItems() {
  try {
    const response = await fetch("/content/shop/index.json");
    const data = await response.json();

    items = data.items || [];

    if (items.length > 0) {
      displayItem(0);
    }

  } catch (err) {
    console.error("Shop load error:", err);
  }
}

function displayItem(index) {
  const item = items[index];

  if (!item) return;

  // Core content
  itemImage.src = item.image;
  itemName.textContent = item.name;
  itemStats.textContent = item.stats;
  itemDesc.textContent = item.desc;

  // Price
  if (item.price) {
    itemPrice.textContent = "$" + item.price;
    itemPrice.style.display = "block";
  } else {
    itemPrice.style.display = "none";
  }

  // Checkout Button
  if (item.stripe) {
    buyBtn.style.display = "block";
    buyBtn.onclick = () => {
      window.location.href = item.stripe;
    };
  } else {
    buyBtn.style.display = "none";
  }
}

changeBtn.addEventListener("click", () => {
  if (items.length <= 1) return;

  currentItem++;
  if (currentItem >= items.length) {
    currentItem = 0;
  }

  displayItem(currentItem);
});

loadShopItems();
