// Dugme "Kopiraj IP"
var btn = document.getElementById("copyBtn");
btn.addEventListener("click", function () {
  var ip = document.getElementById("ipText").textContent;
  function done() {
    btn.textContent = "Kopirano";
    setTimeout(function () { btn.textContent = "Kopiraj IP"; }, 1800);
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(ip).then(done);
  } else {
    var t = document.createElement("textarea");
    t.value = ip; document.body.appendChild(t); t.select();
    document.execCommand("copy"); document.body.removeChild(t); done();
  }
});


// Padajući meni "Rankovi" (klik na telefonu)
var dd = document.querySelector(".dd");
dd.querySelector(".dd-toggle").addEventListener("click", function (e) {
  e.preventDefault();
  dd.classList.toggle("open");
});
document.addEventListener("click", function (e) {
  if (!dd.contains(e.target)) dd.classList.remove("open");
});