const slash = document.getElementById("slashSfx");
const player = document.getElementById("player");
const runeLayer = document.getElementById("rune-layer");

const popup = document.getElementById("trackPopup");
const popupTitle = document.getElementById("trackTitle");
const popupBar = document.getElementById("trackBar");

function notify(msg){
  console.warn(msg);
  const p = document.getElementById("trackPopup");
  const t = document.getElementById("trackTitle");
  if(p && t){
    t.textContent = msg;
    p.classList.add("show");
    setTimeout(()=>{ p.classList.remove("show"); }, 3200);
  }else{
    alert(msg);
  }
}

function playSlash(){
  try{ slash.currentTime = 0; slash.play().catch(()=>{}); }catch(e){}
}

// ===== TRACK SYSTEM =====
let TRACKS = [];
let featured = [];
let nowPlayingSlot = null;

async function loadTracks(){
  try{
    const res = await fetch("assets/playlist.m3u", {cache:"no-store"});
    if(res.ok){
      const text = await res.text();
      TRACKS = parseM3U(text);
      if(TRACKS.length === 0){
        notify("Playlist loaded but no usable tracks.");
        featured = new Array(7).fill(null);
        return;
      }
      pickFeatured(7);
      return;
    }
  }catch(err){}

  notify("No playlist found.");
  featured = new Array(7).fill(null);
}

function parseM3U(text){
  const lines = String(text).split(/\r?\n/);
  const out = [];
  for(const raw of lines){
    const line = raw.trim();
    if(!line || line.startsWith("#")) continue;

    let file = line.replace(/\\/g, "/");

    const idx = file.lastIndexOf("tracks/");
    if(idx !== -1){
      file = file.substring(idx);
    }else{
      const base = file.split("/").pop();
      if(!base) continue;
      file = "tracks/" + base;
    }

    const title = file.split("/").pop().replace(/\.(mp3|wav|ogg|m4a)$/i, "");
    out.push({ title, file });
  }
  return out;
}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function pickFeatured(count=7){
  if(TRACKS.length === 0){
    featured = new Array(count).fill(null);
    return;
  }

  if(TRACKS.length >= count){
    featured = shuffle(TRACKS).slice(0,count);
  }else{
    const shuffled = shuffle(TRACKS);
    featured = [];
    let i = 0;
    while(featured.length < count){
      featured.push(shuffled[i % shuffled.length]);
      i++;
    }
  }

 document.querySelectorAll(".play-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{

    const slot = parseInt(btn.dataset.slot, 10);

    // If clicking the same slot
    if(nowPlayingSlot === slot){

      if(!player.paused){
        player.pause();
      } else {
        player.play().catch(()=>{});
      }

      return;
    }

    // Otherwise play new slot
    playSlash();
    playSlot(slot);

  });
});

// ===== UI =====
function clearPlayingUI(){
  document.querySelectorAll(".play-btn").forEach(b=>b.classList.remove("is-playing"));
  nowPlayingSlot = null;
}

let barTimer=null;

function showPopup(title){
  if(!popup) return;
  popupTitle.textContent = title || "Unknown Track";
  popup.classList.add("show");
  if(popupBar) popupBar.style.width = "0%";
  if(barTimer) clearInterval(barTimer);

  barTimer = setInterval(()=>{
    if(!player || player.paused || !player.duration || !isFinite(player.duration)) return;
    const pct = Math.max(0, Math.min(100, (player.currentTime / player.duration) * 100));
    if(popupBar) popupBar.style.width = pct.toFixed(1) + "%";
  }, 120);
}

function hidePopup(){
  if(!popup) return;
  popup.classList.remove("show");
  if(barTimer) clearInterval(barTimer);
  barTimer = null;
  if(popupBar) popupBar.style.width = "0%";
}

// ===== PLAYBACK (UPDATED WITH SAFE FALLBACK) =====
function playSlot(slot){

  if(!TRACKS.length){
    notify("No tracks available.");
    return;
  }

  let attempts = 0;
  const maxAttempts = TRACKS.length;

  function tryPlay(trackObj){

    let path = trackObj.file;
    if(!path.startsWith("assets/")){
      path = "assets/" + path;
    }

    player.pause();
    player.currentTime = 0;

    player.src = path;
    player.load();

    player.play().then(()=>{

      nowPlayingSlot = slot;

      document.querySelectorAll(".play-btn")
        .forEach(b=>b.classList.remove("is-playing"));

      const activeBtn = document.querySelector(`.play-btn[data-slot="${slot}"]`);
      if(activeBtn) activeBtn.classList.add("is-playing");

      showPopup(trackObj.title || `Track ${slot+1}`);

    }).catch(()=>{

      attempts++;

      if(attempts >= maxAttempts){
        notify("No playable tracks found.");
        return;
      }

      const replacement = TRACKS[(Math.random()*TRACKS.length)|0];
      tryPlay(replacement);
    });
  }

  const initial = featured[slot] || TRACKS[(Math.random()*TRACKS.length)|0];
  tryPlay(initial);
}

function flashButton(slot){
  const btn = document.querySelector(`.play-btn[data-slot="${slot}"]`);
  if(!btn) return;
  btn.animate([
    {transform:"translate(-50%,-50%) scale(1.0)"},
    {transform:"translate(-50%,-50%) scale(1.06)"},
    {transform:"translate(-50%,-50%) scale(1.0)"},
  ], {duration:220, easing:"ease-out"});
}

document.querySelectorAll(".play-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    playSlash();
    const slot = parseInt(btn.dataset.slot, 10);
    playSlot(slot);
  });
});

// ===== RUNE SPILL =====
const emitters = [
  {x: 8, y: 36, color:"#7fffd4"},
  {x: 11, y: 48, color:"#7fffd4"},
  {x: 52, y: 42, color:"#8be9ff"},
  {x: 88, y: 40, color:"#a78bfa"},
  {x: 92, y: 55, color:"#a78bfa"},
];

const runeChars = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞᛟᛝ";
let runeTimer = null;

function spawnRune(){
  if(!runeLayer) return;
  const e = emitters[(Math.random()*emitters.length)|0];
  const span = document.createElement("span");
  span.className = "rune";
  span.textContent = runeChars[(Math.random()*runeChars.length)|0];

  const dx = (Math.random()*80 - 40);
  const dy = -(Math.random()*120 + 60);
  const dur = (Math.random()*900 + 900);

  span.style.left = e.x + "%";
  span.style.top  = e.y + "%";
  span.style.setProperty("--dx", dx.toFixed(1) + "px");
  span.style.setProperty("--dy", dy.toFixed(1) + "px");
  span.style.setProperty("--dur", dur.toFixed(0) + "ms");

  span.style.color = e.color;
  span.style.textShadow = `0 0 8px ${e.color}, 0 0 22px ${e.color}`;
  runeLayer.appendChild(span);
  setTimeout(()=>span.remove(), dur + 80);
}

function startRunes(){
  if(runeTimer) return;
  runeTimer = setInterval(()=>{
    spawnRune();
    spawnRune();
    if(Math.random() > 0.6) spawnRune();
  }, 420);
}

function stopRunes(){
  if(!runeTimer) return;
  clearInterval(runeTimer);
  runeTimer = null;
}

player.addEventListener("play", startRunes);
player.addEventListener("pause", ()=>{ stopRunes(); hidePopup(); });
player.addEventListener("ended", ()=>{ stopRunes(); hidePopup(); clearPlayingUI(); });

player.addEventListener("play", ()=>{
  if(nowPlayingSlot !== null){
    const t = featured[nowPlayingSlot];
    showPopup(t?.title || `Track ${nowPlayingSlot+1}`);
  }
});

player.addEventListener("pause", ()=>{
  document.querySelectorAll(".play-btn").forEach(b=>b.classList.remove("is-playing"));
});

loadTracks().catch(()=>{});

