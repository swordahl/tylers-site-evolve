// ===== AUTO ITEM DETECTION SYSTEM =====

const itemImage = document.getElementById("itemImage");
const changeBtn = document.getElementById("changeItemBtn");

let items = [];
let currentItem = 0;

// Automatically detect item-#.png files
function loadItems(index = 1) {
  const testImage = new Image();
  const path = `assets/item-${index}.png`;

  testImage.onload = function () {
    items.push(path);
    loadItems(index + 1); // try next number
  };

  testImage.onerror = function () {
    // When no more files exist:
    if (items.length > 0) {
      itemImage.src = items[0]; // show first item
    }
  };

  testImage.src = path;
}

loadItems();

// Change item ONLY if more than one exists
changeBtn.addEventListener("click", () => {
  if (items.length <= 1) return; // <-- this prevents change

  currentItem++;
  if (currentItem >= items.length) {
    currentItem = 0;
  }

  itemImage.src = items[currentItem];
});
