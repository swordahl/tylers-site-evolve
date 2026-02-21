// ===== ADMIN CONTROLLED SHOP SYSTEM =====

const itemImage = document.getElementById("itemImage");
const changeBtn = document.getElementById("changeItemBtn");

// You MUST add these text containers in HTML
const itemName = document.getElementById("itemName");
const itemStats = document.getElementById("itemStats");
const itemDesc = document.getElementById("itemDesc");

let items = [];
let currentItem = 0;

// Fetch all shop items from content/shop folder
async function loadShopItems() {
  try {
    const response = await fetch("/content/shop/");
    const text = await response.text();

    // Extract JSON file names from directory listing
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(text, "text/html");
    const links = [...htmlDoc.querySelectorAll("a")];

    const jsonFiles = links
      .map(link => link.getAttribute("href"))
      .filter(href => href && href.endsWith(".json"));

    for (let file of jsonFiles) {
      const res = await fetch(`/content/shop/${file}`);
      const data = await res.json();
      items.push(data);
    }

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

// Change item ONLY if more than one exists
changeBtn.addEventListener("click", () => {
  if (items.length <= 1) return;

  currentItem++;
  if (currentItem >= items.length) {
    currentItem = 0;
  }

  displayItem(currentItem);
});

loadShopItems();
