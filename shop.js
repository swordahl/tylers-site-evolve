let items = [];
let startIndex = 0;

async function loadShop() {

  try {

    const response = await fetch("/content/shop/index.json");
    const data = await response.json();

    items = data.items || [];

    renderItems();

  } catch (error) {

    console.error("Shop failed to load:", error);

  }

}

function renderItems() {

  const slots = [
    document.getElementById("item1"),
    document.getElementById("item2"),
    document.getElementById("item3")
  ];

  for (let i = 0; i < 3; i++) {

    const item = items[startIndex + i];

    if (item) {
      slots[i].src = item.image;
      slots[i].style.display = "block";
    } else {
      slots[i].style.display = "none";
    }

  }

}

function cycleItems() {

  if (items.length <= 3) return;

  startIndex++;

  if (startIndex + 3 > items.length) {
    startIndex = 0;
  }

  renderItems();

}

document.addEventListener("DOMContentLoaded", function () {

  loadShop();

  const arrow = document.getElementById("cycle");

  if (arrow) {
    arrow.addEventListener("click", cycleItems);
  }

});
document.addEventListener("click", function(e){

const x = ((e.pageX / window.innerWidth) * 100).toFixed(2);
const y = ((e.pageY / document.body.scrollHeight) * 100).toFixed(2);

alert(`x:${x}  y:${y}`);

});
// coordinate helper (only for designing)

document.addEventListener("click", function(e){

const x = ((e.pageX / window.innerWidth) * 100).toFixed(2);
const y = ((e.pageY / document.body.scrollHeight) * 100).toFixed(2);

const popup = document.createElement("div");

popup.innerText = `x:${x}  y:${y}`;

popup.style.position = "fixed";
popup.style.left = "20px";
popup.style.bottom = "20px";
popup.style.background = "black";
popup.style.color = "white";
popup.style.padding = "8px 12px";
popup.style.fontSize = "14px";
popup.style.zIndex = "9999";

document.body.appendChild(popup);

setTimeout(() => {
popup.remove();
}, 2000);

});
