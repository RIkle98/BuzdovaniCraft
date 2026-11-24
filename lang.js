var I18N = {
  sr: {
    tag: "Balkanski server za one koji jesu buzdovani, majke mi...",
    since: "Sa vama od 1953. godine, bre...",
    copied: "Kopirano, bre!",
    vlead: "Glasaj za Buzdovani Craft na sve tri liste. Upiši tačan nick, isti kao u igri, nemoj da pogrešiš. Isti linkovi rade i komandom /vote.",
    create: "Napravi nalog",
    nohave: "Nemaš nalog? Registruj se",
    nickerr: "Nick: od 3 do 16 znakova, slova, brojevi i _, bre.",
    mismatch: "Lozinke se ne poklapaju, probaj opet.",
    sending: "Šaljem...",
    srverr: "Greška servera.",
    err: "Greška.",
    down: "Server ne radi, probaj malo kasnije.",
    none: "Još niko nije glasao.",
    light: "Svetla"
  },
  bs: {
    tag: "Balkanski server za one koji jesu buzdovani, bolan...",
    since: "Sa vama od 1953. godine, baa...",
    copied: "Kopirano, brate!",
    vlead: "Glasaj za Buzdovani Craft na sve tri liste. Upiši tačan nick, isti kao u igri, nemoj da pogriješiš, brate. Isti linkovi rade i komandom /vote.",
    create: "Napravi nalog",
    nohave: "Nemaš nalog? Registruj se",
    nickerr: "Nick: 3 do 16 znakova, slova, brojevi i _, brate.",
    mismatch: "Lozinke se ne poklapaju, brate.",
    sending: "Slanje...",
    srverr: "Greška servera.",
    err: "Greška.",
    down: "Server nije dostupan, probaj kasnije.",
    none: "Još nema glasova, brate.",
    light: "Svijetla"
  },
  cnr: {
    tag: "Balkanski server za one koji jesu buzdovani, pobro...",
    since: "Sa vama od 1953. godine, bokte...",
    copied: "Kopirano, pobro!",
    vlead: "Glasaj za Buzdovani Craft na sve tri liste. Upiši tačan nick, isti kao u igri, nemoj da pogriješiš, pobro. Isti linkovi rade i komandom /vote.",
    create: "Otvori nalog",
    nohave: "Nemaš nalog? Registruj se",
    nickerr: "Nick: od 3 do 16 znakova, slova, brojevi i _, bokte.",
    mismatch: "Lozinke se ne poklapaju, bokte.",
    sending: "Šaljem...",
    srverr: "Greška servera.",
    err: "Greška.",
    down: "Server nije dostupan, probaj kasnije.",
    none: "Još niko nije glasao, bokte.",
    light: "Svijetla"
  }
};
function curLang() {
  try { var l = localStorage.getItem("lang"); return (l === "sr" || l === "cnr") ? l : "bs"; } catch (e) { return "bs"; }
}
function tr(k) {
  var d = I18N[curLang()];
  return (d && d[k]) || I18N.bs[k] || k;
}
function applyLang() {
  document.documentElement.setAttribute("lang", curLang());
  document.querySelectorAll("[data-i]").forEach(function (el) {
    el.textContent = tr(el.getAttribute("data-i"));
  });
}
applyLang();