const games = [
 {id:"efootball",name:"eFootball",sub:"Coins",icon:"⚽",packages:[["Starter Coins", "10.00"],["Value Coins","25.00"],["Pro Coins","50.00"]]},
 {id:"fc-mobile",name:"FC Mobile",sub:"FC Points",icon:"🏆",packages:[["Starter Pack","10.00"],["Player Pack","25.00"],["Elite Pack","50.00"]]},
 {id:"codm",name:"Call of Duty Mobile",sub:"CP",icon:"🎯",packages:[["Starter CP","15.00"],["Battle Pack","40.00"],["Pro CP","80.00"]]},
 {id:"free-fire",name:"Free Fire",sub:"Diamonds",icon:"💎",packages:[["Starter Diamonds","10.00"],["Popular Pack","30.00"],["Mega Pack","60.00"]]},
 {id:"pubg",name:"PUBG Mobile",sub:"UC",icon:"🪖",packages:[["Starter UC","15.00"],["Battle UC","40.00"],["Elite UC","80.00"]]},
 {id:"roblox",name:"Roblox",sub:"Robux",icon:"🧱",packages:[["Starter Robux","15.00"],["Builder Robux","40.00"],["Mega Robux","80.00"]]}
];
const $=s=>document.querySelector(s);
const grid=$("#gameGrid"), gameSelect=$("#game"), packageSelect=$("#package"), price=$("#price");
let selectedGame=games[0];
function renderGames(){
 grid.innerHTML="";
 games.forEach(g=>{
  const b=document.createElement("button");b.type="button";b.className="game-card"+(g.id===selectedGame.id?" selected":"");
  b.innerHTML=`<span class="game-icon">${g.icon}</span><strong>${g.name}</strong><small>${g.sub}</small>`;
  b.addEventListener("click",()=>chooseGame(g.id,true));grid.appendChild(b);
 });
 gameSelect.innerHTML=games.map(g=>`<option value="${g.id}">${g.name}</option>`).join("");
}
function chooseGame(id,scroll=false){
 selectedGame=games.find(g=>g.id===id)||games[0];gameSelect.value=selectedGame.id;
 packageSelect.innerHTML=selectedGame.packages.map((p,i)=>`<option value="${i}">${p[0]} — ${p[1]} MAD (تجريبي)</option>`).join("");
 renderGames();updatePrice();if(scroll)$("#orderSection").scrollIntoView({behavior:"smooth"});
}
function updatePrice(){const p=selectedGame.packages[Number(packageSelect.value)||0];price.textContent=`${p[1]} MAD`;}
gameSelect.addEventListener("change",()=>chooseGame(gameSelect.value));packageSelect.addEventListener("change",updatePrice);
function getOrders(){try{return JSON.parse(localStorage.getItem("lavaOrders")||"[]")}catch{return []}}
function saveOrders(a){localStorage.setItem("lavaOrders",JSON.stringify(a))}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3000)}
$("#orderForm").addEventListener("submit",e=>{
 e.preventDefault();
 const playerId=$("#playerId").value.trim(), p=selectedGame.packages[Number(packageSelect.value)||0];
 if(playerId.length<3){toast("دخل Player ID صحيح.");return}
 const order={id:"LAVA-"+Math.floor(100000+Math.random()*900000),game:selectedGame.name,playerId,pack:p[0],price:p[1],status:"بانتظار ربط مزوّد الشحن",created:new Date().toISOString()};
 const orders=getOrders();orders.unshift(order);saveOrders(orders);
 $("#trackingResult").textContent=`رقم الطلب: ${order.id} — الحالة: ${order.status}. هاد طلب تجريبي فقط، ما تم حتى شحن.`;
 $("#orderSearch").value=order.id;toast("تسجّل الطلب التجريبي بنجاح.");$("#orderForm").reset();chooseGame(selectedGame.id);
});
$("#trackBtn").addEventListener("click",()=>{
 const id=$("#orderSearch").value.trim().toUpperCase();if(!id){$("#trackingResult").textContent="دخل رقم الطلب أولا.";return}
 const o=getOrders().find(x=>x.id===id);
 $("#trackingResult").textContent=o?`الطلب ${o.id} · ${o.game} · ${o.pack} · ${o.price} MAD · الحالة: ${o.status}. هاد طلب تجريبي فقط.`:"ما لقيناش هاد الطلب فهاد الجهاز. تأكد من الرقم أو استعمل نفس المتصفح والجهاز.";
});
$("#year").textContent=new Date().getFullYear();
let installPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installBtn").hidden=false});
$("#installBtn").addEventListener("click",async()=>{if(!installPrompt){toast("استعمل قائمة المتصفح ثم Add to Home screen.");return}installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installBtn").hidden=true});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
renderGames();chooseGame("efootball");
