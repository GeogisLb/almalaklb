var PHONE = "96171033648";
function wa(text){ return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text); }
document.querySelectorAll("[data-wa]").forEach(function(a){
  a.href = wa(a.getAttribute("data-wa")); a.target = "_blank"; a.rel = "noopener";
});

/* hero power toggle */
var hero = document.getElementById("hero"), pw = document.getElementById("power");
pw.addEventListener("click", function(){
  var on = hero.classList.toggle("on");
  pw.setAttribute("aria-pressed", on);
  pw.textContent = on ? "Cut the grid" : "Restore power";
  document.getElementById("statusText").textContent = on ? "Solar and battery on. House lit." : "Grid off. House dark.";
});

/* lighting demo */
var warm = document.getElementById("warm"), bright = document.getElementById("bright"), room = document.getElementById("room");
function lerp(a,b,t){ return Math.round(a+(b-a)*t); }
function lamp(){
  var t = (warm.value - 2200) / 3800;
  var c = [lerp(255,200,t), lerp(170,225,t), lerp(100,255,t)];
  room.style.setProperty("--lamp", "rgb(" + c.join(",") + ")");
  room.style.setProperty("--lvl", bright.value / 100);
  document.getElementById("warmOut").textContent = warm.value + " K";
  document.getElementById("brightOut").textContent = bright.value + "%";
}
warm.addEventListener("input", lamp); bright.addEventListener("input", lamp); lamp();

/* sizing calculator */
var LOADS = [["Lights (whole home)",300],["Fridge and freezer",400],["Router and TV",150],["Fans",200],["Washing machine",800],["Water pump",750],["Air conditioner",1200],["Oven or cooker",2500]];
var box = document.getElementById("loads"), hours = document.getElementById("hours");
LOADS.forEach(function(l,i){
  var d = document.createElement("label"); d.className = "chk";
  d.innerHTML = '<input type="checkbox" data-w="' + l[1] + '" data-n="' + l[0] + '"> ' + l[0] + ' <small>' + l[1] + ' W</small>';
  box.appendChild(d);
});
var last = "";
function size(){
  var w = 0, names = [];
  box.querySelectorAll("input:checked").forEach(function(c){ w += +c.dataset.w; names.push(c.dataset.n); });
  var h = +hours.value;
  var avg = w * 0.5;
  var bat = avg * h / 1000;
  var inv = w ? Math.max(1, Math.ceil(w * 1.25 / 500) / 2) : 0;
  var kwp = w ? Math.ceil((bat / 5 * 1.3 + avg / 1000) * 10) / 10 : 0;
  var panels = w ? Math.ceil(kwp * 1000 / 550) : 0;
  document.getElementById("hoursOut").textContent = h + (h === 1 ? " hour" : " hours");
  document.getElementById("rH").textContent = h + " h";
  document.getElementById("rW").textContent = w + " W";
  document.getElementById("rPanels").textContent = panels;
  document.getElementById("rKwp").textContent = kwp.toFixed(1) + " kWp";
  document.getElementById("rInv").textContent = inv.toFixed(1) + " kW";
  document.getElementById("rBat").textContent = bat.toFixed(1) + " kWh";
  last = w ? "Hello MES, I used the sizing tool. I want to keep running: " + names.join(", ") + " (" + w + " W) for " + h + " hours. Estimate: " + panels + " panels (" + kwp.toFixed(1) + " kWp), " + inv.toFixed(1) + " kW inverter, " + bat.toFixed(1) + " kWh lithium bank. Can you confirm and quote?" : "Hello MES, I'd like help sizing a solar and battery system.";
  document.getElementById("sendSize").href = wa(last);
}
box.addEventListener("change", size); hours.addEventListener("input", size);
var s = document.getElementById("sendSize"); s.target = "_blank"; s.rel = "noopener";
size();
