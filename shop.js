// ===== ADMIN CONTROLLED SHOP SYSTEM (INDEX VERSION) =====

const itemImage = document.getElementById("itemImage");
const changeBtn = document.getElementById("changeItemBtn");

const itemName = document.getElementById("itemName");
const itemStats = document.getElementById("itemStats");
const itemDesc = document.getElementById("itemDesc");

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

  itemImage.src = item.image;
  itemName.textContent = item.name;
  itemStats.textContent = item.stats;
  itemDesc.textContent = item.desc;
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
