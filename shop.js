const items = [
  "assets/item1.png",
  "assets/item2.png",
  "assets/item3.png"
];

let currentItem = 0;

const itemImage = document.getElementById("itemImage");
const changeBtn = document.getElementById("changeItemBtn");

changeBtn.addEventListener("click", () => {
  currentItem++;
  if (currentItem >= items.length) {
    currentItem = 0;
  }
  itemImage.src = items[currentItem];
});
