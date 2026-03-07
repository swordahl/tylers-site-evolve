let items = [];
let startIndex = 0;

async function loadShop() {

try {

```
const res = await fetch("content/shop/index.json");
const data = await res.json();

items = data.items || [];

renderItems();
```

} catch (error) {

```
console.error("Shop failed to load:", error);
```

}

}

function renderItems(){

const slotImages = [
document.getElementById("item1"),
document.getElementById("item2"),
document.getElementById("item3")
];

for(let i = 0; i < 3; i++){

```
const item = items[startIndex + i];

if(item){

  slotImages[i].src = item.image;
  slotImages[i].style.display = "block";

}else{

  slotImages[i].style.display = "none";

}
```

}

}

function cycleItems(){

if(items.length <= 3) return;

startIndex++;

if(startIndex + 3 > items.length){
startIndex = 0;
}

renderItems();

}

document.addEventListener("DOMContentLoaded", () => {

loadShop();

const cycleBtn = document.getElementById("cycle");

if(cycleBtn){
cycleBtn.addEventListener("click", cycleItems);
}

});

