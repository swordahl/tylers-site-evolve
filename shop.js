const items = [
  "assets/item1.png",
  "assets/item2.png",
  "assets/item3.png"
];

let currentItem = 0;

const itemImage = document.getElementById("itemImage");
const changeBtn = document.getElementById("changeItemBtn");

changeBtn.addEventListener("click", () => {

  // If only one item exists, do nothing
  if (items.length <= 1) return;

  currentItem++;

  if (currentItem >= items.length) {
    currentItem = 0;
  }

  itemImage.src = items[currentItem];
});
