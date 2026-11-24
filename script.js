// Tema (tamna / svijetla), pamti se u pregledacu
function getTheme() {
  try { return localStorage.getItem("theme") === "light" ? "light" : "dark"; } catch (e) { return "dark"; }
}
function setTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("theme", t); } catch (e) {}
}
document.documentElement.setAttribute("data-theme", getTheme());



// Dugme "Kopiraj IP"
var btn = document.getElementById("copyBtn");
if (btn) btn.addEventListener("click", function () {
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
if (dd) {
  dd.querySelector(".dd-toggle").addEventListener("click", function (e) {
    e.preventDefault();
    dd.classList.toggle("open");
  });
  document.addEventListener("click", function (e) {
    if (!dd.contains(e.target)) dd.classList.remove("open");
  });
}

// Prijava / Registracija / korisnicki meni
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

  function logout() {
    fetch(API + "/logout", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: "{}" })
      .catch(function () {})
      .then(function () { location.reload(); });
  }


  function showUser(nick) {
    auth.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "user-menu";
    var b = document.createElement("button");
    b.type = "button";
    b.className = "auth-btn user-btn";
    b.textContent = nick + " \u25BE";
    var drop = document.createElement("div");
    drop.className = "user-drop";
    var sw = document.createElement("div");
    sw.className = "sub-wrap";
    var st = document.createElement("button");
    st.type = "button";
    st.className = "sub-toggle";
    st.textContent = "Postavke";
    var sub = document.createElement("div");
    sub.className = "sub-drop";
    var box = document.createElement("div");
    box.className = "sub-box";
    function group(label, opts, getv, setv) {
      var g = document.createElement("div");
      g.className = "sub-wrap";
      var t = document.createElement("button");
      t.type = "button";
      t.className = "sub-toggle";
      t.textContent = label;
      var d = document.createElement("div");
      d.className = "sub-drop";
      var bx = document.createElement("div");
      bx.className = "sub-box";
      function mark() {
        bx.querySelectorAll(".opt").forEach(function (o) {
          o.classList.toggle("on", o.getAttribute("data-v") === getv());
        });
      }
      opts.forEach(function (op) {
        var o = document.createElement("button");
        o.type = "button";
        o.className = "opt";
        o.setAttribute("data-v", op[0]);
        o.textContent = op[1];
        o.addEventListener("click", function (e) { e.stopPropagation(); setv(op[0]); mark(); });
        bx.appendChild(o);
      });
      mark();
      t.addEventListener("click", function (e) { e.stopPropagation(); g.classList.toggle("open"); });
      d.appendChild(bx);
      g.appendChild(t);
      g.appendChild(d);
      return g;
    }
    box.appendChild(group("Tema", [["dark", "Tamna"], ["light", "Svijetla"]], getTheme, setTheme));
    sub.appendChild(box);
    st.addEventListener("click", function (e) { e.stopPropagation(); sw.classList.toggle("open"); });
    sw.appendChild(st);
    sw.appendChild(sub);
    var lo = document.createElement("button");
    lo.type = "button";
    lo.textContent = "Odjava";
    lo.addEventListener("click", logout);
    drop.appendChild(sw);
    drop.appendChild(lo);
    wrap.appendChild(b);
    wrap.appendChild(drop);
    auth.appendChild(wrap);
    b.addEventListener("click", function (e) { e.stopPropagation(); wrap.classList.toggle("open"); });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) wrap.classList.remove("open"); });
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