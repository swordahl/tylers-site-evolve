async function loadShop(){

const response = await fetch("/content/shop/index.json");
const data = await response.json();

const wall = document.querySelector(".relic-wall");

data.items.forEach(item => {

const frame = document.createElement("div");
frame.className = "relic-frame";

frame.innerHTML = `
<img src="/assets/shop-border/shop-border1.png" class="border-art">

<div class="relic-zone">
<img src="${item.image}" class="relic-product">
</div>
`;

wall.appendChild(frame);

});

}

loadShop();
const text = "Ah… another relic uncovered within Sentia.";

let i = 0;

function type(){

    if(i < text.length){

        document.getElementById("npcText").innerHTML += text.charAt(i);

        i++;

        setTimeout(type,30);

    }

}

type();
