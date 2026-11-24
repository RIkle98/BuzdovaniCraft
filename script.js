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

// Prijava / Registracija (samo izgled, server jos nije povezan)
(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;

  var auth = document.createElement("div");
  auth.className = "auth";
  auth.innerHTML =
    '<button type="button" class="auth-btn" data-tab="login">Prijava</button>' +
    '<button type="button" class="auth-btn primary" data-tab="register">Registracija</button>';
  nav.appendChild(auth);

  var modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML =
    '<div class="modal-box" role="dialog" aria-modal="true">' +
      '<button type="button" class="modal-x" aria-label="Zatvori">&times;</button>' +
      '<div class="modal-tabs">' +
        '<button type="button" data-tab="login">Prijava</button>' +
        '<button type="button" data-tab="register">Registracija</button>' +
      '</div>' +
      '<form class="auth-form" autocomplete="off">' +
        '<label>Nick<input type="text" name="nick" maxlength="16" required></label>' +
        '<label>Lozinka<input type="password" name="pass" minlength="8" required></label>' +
        '<label class="reg-only">Ponovi lozinku<input type="password" name="pass2" minlength="8"></label>' +
        '<button type="submit" class="auth-submit"></button>' +
        '<p class="auth-msg"></p>' +
        '<button type="button" class="auth-switch"></button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(modal);

  var form = modal.querySelector(".auth-form");
  var msg = modal.querySelector(".auth-msg");
  var submit = modal.querySelector(".auth-submit");
  var pass2 = form.elements.pass2;
  var tab = "login";
  var API = "https://api.buzdovanicraft.com";

  function showUser(nick) {
    auth.innerHTML = "";
    var s = document.createElement("span");
    s.className = "auth-user";
    s.textContent = nick;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "auth-btn";
    b.textContent = "Odjava";
    b.addEventListener("click", function () {
      fetch(API + "/logout", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: "{}" })
        .catch(function () {})
        .then(function () { location.reload(); });
    });
    auth.appendChild(s);
    auth.appendChild(b);
  }

  fetch(API + "/me", { credentials: "include" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) { if (d && d.ok) showUser(d.nick); })
    .catch(function () {});

  function setTab(t) {
    tab = t;
    modal.classList.toggle("is-register", t === "register");
    pass2.required = (t === "register");
    submit.textContent = t === "register" ? "Napravi nalog" : "Prijavi se";
    modal.querySelectorAll(".modal-tabs button").forEach(function (b) {
      var on = b.getAttribute("data-tab") === t;
      b.classList.toggle("active", on);
      b.style.display = on ? "" : "none";
    });
    modal.querySelector(".auth-switch").textContent =
      t === "register" ? "Već imaš nalog? Prijavi se" : "Nemaš nalog? Registruj se";
    msg.textContent = "";
  }
  function openModal(t) {
    setTab(t);
    modal.classList.add("show");
    form.elements.nick.focus();
  }
  function closeModal() { modal.classList.remove("show"); }

  auth.querySelectorAll(".auth-btn").forEach(function (b) {
    b.addEventListener("click", function () { openModal(b.getAttribute("data-tab")); });
  });
  modal.querySelectorAll(".modal-tabs button").forEach(function (b) {
    b.addEventListener("click", function () { setTab(b.getAttribute("data-tab")); });
  });
  modal.querySelector(".modal-x").addEventListener("click", closeModal);
  modal.querySelector(".auth-switch").addEventListener("click", function () {
    setTab(tab === "login" ? "register" : "login");
  });
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nick = form.elements.nick.value;
    if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) {
      msg.textContent = "Nick: 3 do 16 znakova, slova, brojevi i _.";
      return;
    }
    if (tab === "register" && form.elements.pass.value !== pass2.value) {
      msg.textContent = "Lozinke se ne poklapaju.";
      return;
    }
    submit.disabled = true;
    msg.textContent = "Slanje...";
    fetch(API + (tab === "register" ? "/register" : "/login"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nick: nick, pass: form.elements.pass.value })
    })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: "Greska servera." }; }); })
      .then(function (d) {
        if (d.ok) { closeModal(); form.reset(); showUser(d.nick); }
        else { msg.textContent = d.error || "Greska."; }
      })
      .catch(function () { msg.textContent = "Server nije dostupan, probaj kasnije."; })
      .then(function () { submit.disabled = false; });
  });
})();